import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Find donations that need delayed subscription
    // 36 hours = 36 * 60 * 60 = 129600 seconds
    const thirtySixHoursAgo = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()

    const { data: donations, error: fetchError } = await supabase
      .from('donations')
      .select('*')
      .eq('payment_status', 'success')
      .gte('created_at', thirtySixHoursAgo)
      .lt('created_at', new Date(Date.now() - 35 * 60 * 60 * 1000).toISOString())

    if (fetchError) {
      console.error('Error fetching donations:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch donations' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let processedCount = 0
    let errors = []

    for (const donation of donations || []) {
      const metadata = donation.metadata as any || {}
      
      // Check if this donation has delayed subscription enabled and hasn't been processed
      if (metadata.delayed_subscription && !metadata.subscription_created) {
        const authCode = metadata.authorization_code
        const email = donation.donor_email

        // Determine plan based on amount
        const planCode = donation.amount === 7500
          ? Deno.env.get('PAYSTACK_DAILY_PLAN_CODE') || 'PLN_cij209o3za5fmw1'
          : Deno.env.get('PAYSTACK_WEEKLY_PLAN_CODE') || 'PLN_m9e5i6i8l9cbbwl'

        if (!planCode) {
          console.error(`No plan code configured for amount: ${donation.amount}`)
          errors.push(`Donation ${donation.id}: No plan code configured`)
          continue
        }

        if (!authCode) {
          console.error(`No authorization code for donation: ${donation.id}`)
          errors.push(`Donation ${donation.id}: No authorization code`)
          continue
        }

        // Create subscription
        try {
          const response = await fetch('https://api.paystack.co/subscription', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${paystackSecretKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              customer: email,
              plan: planCode,
              authorization: authCode,
            }),
          })

          const data = await response.json()

          if (data.status) {
            // Mark subscription as created in metadata
            await supabase
              .from('donations')
              .update({
                metadata: {
                  ...metadata,
                  subscription_created: true,
                  subscription_created_at: new Date().toISOString(),
                  subscription_data: data.data,
                }
              })
              .eq('id', donation.id)

            processedCount++
            console.log(`Subscription created for donation ${donation.id}`)
          } else {
            console.error(`Failed to create subscription for donation ${donation.id}:`, data.message)
            errors.push(`Donation ${donation.id}: ${data.message}`)
          }
        } catch (error) {
          console.error(`Error creating subscription for donation ${donation.id}:`, error)
          errors.push(`Donation ${donation.id}: ${error.message}`)
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: processedCount,
        total: donations?.length || 0,
        errors,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing delayed subscriptions:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

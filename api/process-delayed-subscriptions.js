import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Verify CRON_SECRET for security
  const authHeader = req.headers.get('Authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).end('Unauthorized');
  }

  // Only allow GET requests for Vercel cron jobs
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    const dailyPlanCode = process.env.PAYSTACK_DAILY_PLAN_CODE || 'PLN_kfhtnorv4hmf5ck';
    const weeklyPlanCode = process.env.PAYSTACK_WEEKLY_PLAN_CODE || 'PLN_m9e5i6i8l9cbbwl';

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find donations that need delayed subscription
    // 36 hours = 36 * 60 * 60 = 129600 seconds
    const thirtySixHoursAgo = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();
    const thirtyFiveHoursAgo = new Date(Date.now() - 35 * 60 * 60 * 1000).toISOString();

    const { data: donations, error: fetchError } = await supabase
      .from('donations')
      .select('*')
      .eq('payment_status', 'success')
      .gte('created_at', thirtySixHoursAgo)
      .lt('created_at', thirtyFiveHoursAgo);

    if (fetchError) {
      console.error('Error fetching donations:', fetchError);
      return res.status(500).json({ error: 'Failed to fetch donations' });
    }

    let processedCount = 0;
    let errors = [];

    for (const donation of donations || []) {
      const metadata = donation.metadata || {};
      
      // Check if this donation has delayed subscription enabled and hasn't been processed
      if (metadata.delayed_subscription && !metadata.subscription_created) {
        const authCode = metadata.authorization_code;
        const email = donation.donor_email;

        // Determine plan based on amount
        const planCode = donation.amount === 30000
          ? dailyPlanCode
          : weeklyPlanCode;

        if (!authCode) {
          console.error(`No authorization code for donation: ${donation.id}`);
          errors.push(`Donation ${donation.id}: No authorization code`);
          continue;
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
          });

          const data = await response.json();

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
              .eq('id', donation.id);

            processedCount++;
            console.log(`Subscription created for donation ${donation.id}`);
          } else {
            console.error(`Failed to create subscription for donation ${donation.id}:`, data.message);
            errors.push(`Donation ${donation.id}: ${data.message}`);
          }
        } catch (error) {
          console.error(`Error creating subscription for donation ${donation.id}:`, error);
          errors.push(`Donation ${donation.id}: ${error.message}`);
        }
      }
    }

    return res.status(200).json({
      success: true,
      processed: processedCount,
      total: donations?.length || 0,
      errors,
    });
  } catch (error) {
    console.error('Error processing delayed subscriptions:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

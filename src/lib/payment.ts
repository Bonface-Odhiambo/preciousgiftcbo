import { supabase } from "@/integrations/supabase/client";

export interface DonationData {
  donor_name: string;
  donor_email: string;
  donor_phone?: string;
  amount: number;
  currency?: string;
  donation_type?: string;
  message?: string;
  is_anonymous?: boolean;
}

export interface PaymentResponse {
  success: boolean;
  reference?: string;
  authorization_url?: string;
  error?: string;
}

export class PaystackService {
  private publicKey: string;

  constructor() {
    this.publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';
  }

  async initializePayment(donationData: DonationData): Promise<PaymentResponse> {
    try {
      const reference = `PGC-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      
      const { error: dbError } = await supabase
        .from('donations')
        .insert({
          donor_name: donationData.donor_name,
          donor_email: donationData.donor_email,
          donor_phone: donationData.donor_phone,
          amount: donationData.amount,
          currency: donationData.currency || 'KES',
          payment_method: 'paystack',
          payment_reference: reference,
          payment_status: 'pending',
          donation_type: donationData.donation_type,
          message: donationData.message,
          is_anonymous: donationData.is_anonymous || false,
        });

      if (dbError) {
        console.error('Database error:', dbError);
        return { success: false, error: 'Failed to create donation record' };
      }

      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: donationData.donor_email,
          amount: donationData.amount * 100,
          currency: donationData.currency || 'KES',
          reference: reference,
          callback_url: `https://www.preciousgiftcbo.com/donation/callback`,
          metadata: {
            donor_name: donationData.donor_name,
            donation_type: donationData.donation_type,
            custom_fields: [
              {
                display_name: "Donor Name",
                variable_name: "donor_name",
                value: donationData.donor_name
              }
            ]
          }
        }),
      });

      const data = await response.json();

      if (data.status && data.data) {
        return {
          success: true,
          reference: reference,
          authorization_url: data.data.authorization_url,
        };
      } else {
        return { success: false, error: data.message || 'Payment initialization failed' };
      }
    } catch (error) {
      console.error('Paystack initialization error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }

  async verifyPayment(reference: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PAYSTACK_SECRET_KEY}`,
        },
      });

      const data = await response.json();

      if (data.status && data.data.status === 'success') {
        const cardLast4 = data.data.authorization?.last4 || null;
        await supabase
          .from('donations')
          .update({
            payment_status: 'success',
            transaction_id: data.data.id,
            card_last4: cardLast4,
            metadata: data.data,
          })
          .eq('payment_reference', reference);

        return { success: true, data: data.data };
      } else {
        await supabase
          .from('donations')
          .update({
            payment_status: 'failed',
            metadata: data,
          })
          .eq('payment_reference', reference);

        return { success: false, error: 'Payment verification failed' };
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      return { success: false, error: 'Verification error occurred' };
    }
  }

  loadPaystackScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).PaystackPop) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Paystack script'));
      document.body.appendChild(script);
    });
  }

  async openPaymentModal(donationData: DonationData): Promise<PaymentResponse> {
    try {
      await this.loadPaystackScript();

      const reference = `PGC-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const { error: dbError } = await supabase
        .from('donations')
        .insert({
          donor_name: donationData.donor_name,
          donor_email: donationData.donor_email,
          donor_phone: donationData.donor_phone,
          amount: donationData.amount,
          currency: donationData.currency || 'KES',
          payment_method: 'paystack',
          payment_reference: reference,
          payment_status: 'pending',
          donation_type: donationData.donation_type,
          message: donationData.message,
          is_anonymous: donationData.is_anonymous || false,
        });

      if (dbError) {
        return { success: false, error: 'Failed to create donation record' };
      }

      return new Promise((resolve) => {
        const handler = (window as any).PaystackPop.setup({
          key: this.publicKey,
          email: donationData.donor_email,
          amount: donationData.amount * 100,
          currency: donationData.currency || 'KES',
          ref: reference,
          metadata: {
            donor_name: donationData.donor_name,
            donation_type: donationData.donation_type,
          },
          onClose: () => {
            resolve({ success: false, error: 'Payment cancelled' });
          },
          callback: (response: any) => {
            this.verifyPayment(response.reference).then((verification) => {
              if (verification.success) {
                resolve({ success: true, reference: response.reference });
              } else {
                resolve({ success: false, error: 'Payment verification failed' });
              }
            });
          },
        });

        handler.openIframe();
      });
    } catch (error) {
      console.error('Payment modal error:', error);
      return { success: false, error: 'Failed to open payment modal' };
    }
  }

  async openWeeklySubscriptionModal(donationData: DonationData): Promise<PaymentResponse> {
    try {
      await this.loadPaystackScript();

      const planCode = import.meta.env.VITE_PAYSTACK_WEEKLY_PLAN_CODE || '';
      if (!planCode) {
        return { success: false, error: 'Weekly donation plan not configured' };
      }

      const reference = `PGC-WK-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const { error: dbError } = await supabase
        .from('donations')
        .insert({
          donor_name: donationData.donor_name,
          donor_email: donationData.donor_email,
          donor_phone: donationData.donor_phone,
          amount: donationData.amount,
          currency: donationData.currency || 'KES',
          payment_method: 'paystack',
          payment_reference: reference,
          payment_status: 'pending',
          donation_type: donationData.donation_type || 'weekly_recurring',
          message: donationData.message,
          is_anonymous: donationData.is_anonymous || false,
        });

      if (dbError) {
        return { success: false, error: 'Failed to create donation record' };
      }

      return new Promise((resolve) => {
        const handler = (window as any).PaystackPop.setup({
          key: this.publicKey,
          email: donationData.donor_email,
          amount: donationData.amount * 100,
          currency: donationData.currency || 'KES',
          ref: reference,
          metadata: {
            donor_name: donationData.donor_name,
            donation_type: 'weekly_recurring',
          },
          onClose: () => {
            resolve({ success: false, error: 'Payment cancelled' });
          },
          callback: (response: any) => {
            this.verifyPayment(response.reference).then((verification) => {
              if (verification.success) {
                const authCode = verification.data?.authorization?.authorization_code;
                if (authCode && planCode) {
                  this.createSubscription(donationData.donor_email, planCode, authCode).catch(() => {});
                }
                resolve({ success: true, reference: response.reference });
              } else {
                resolve({ success: false, error: 'Payment verification failed' });
              }
            });
          },
        });

        handler.openIframe();
      });
    } catch (error) {
      console.error('Weekly subscription modal error:', error);
      return { success: false, error: 'Failed to open payment modal' };
    }
  }

  private async createSubscription(email: string, planCode: string, authorizationCode: string): Promise<void> {
    try {
      await fetch('https://api.paystack.co/subscription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: email,
          plan: planCode,
          authorization: authorizationCode,
        }),
      });
    } catch {
      // Silent — subscription creation failure does not affect donation UX
    }
  }
}

export const paystackService = new PaystackService();

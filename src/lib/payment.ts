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
        await supabase
          .from('donations')
          .update({
            payment_status: 'success',
            transaction_id: data.data.id,
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
          callback: async (response: any) => {
            const verification = await this.verifyPayment(response.reference);
            if (verification.success) {
              resolve({ success: true, reference: response.reference });
            } else {
              resolve({ success: false, error: 'Payment verification failed' });
            }
          },
        });

        handler.openIframe();
      });
    } catch (error) {
      console.error('Payment modal error:', error);
      return { success: false, error: 'Failed to open payment modal' };
    }
  }
}

export class EPaymentlyService {
  private apiKey: string;
  private merchantId: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_EPAYMENTLY_API_KEY || '';
    this.merchantId = import.meta.env.VITE_EPAYMENTLY_MERCHANT_ID || '';
  }

  async initializePayment(donationData: DonationData): Promise<PaymentResponse> {
    try {
      const reference = `PGC-EP-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const { error: dbError } = await supabase
        .from('donations')
        .insert({
          donor_name: donationData.donor_name,
          donor_email: donationData.donor_email,
          donor_phone: donationData.donor_phone,
          amount: donationData.amount,
          currency: donationData.currency || 'KES',
          payment_method: 'epaymently',
          payment_reference: reference,
          payment_status: 'pending',
          donation_type: donationData.donation_type,
          message: donationData.message,
          is_anonymous: donationData.is_anonymous || false,
        });

      if (dbError) {
        return { success: false, error: 'Failed to create donation record' };
      }

      const response = await fetch(`${import.meta.env.VITE_EPAYMENT_API_URL}/api/v1/payments/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchant_id: this.merchantId,
          amount: donationData.amount,
          currency: donationData.currency || 'KES',
          reference: reference,
          customer_email: donationData.donor_email,
          customer_name: donationData.donor_name,
          customer_phone: donationData.donor_phone,
          callback_url: `https://www.preciousgiftcbo.com/donation/callback`,
          return_url: `https://www.preciousgiftcbo.com/donation/success`,
          metadata: {
            donation_type: donationData.donation_type,
            message: donationData.message,
          }
        }),
      });

      const data = await response.json();

      if (data.success && data.payment_url) {
        return {
          success: true,
          reference: reference,
          authorization_url: data.payment_url,
        };
      } else {
        return { success: false, error: data.message || 'Payment initialization failed' };
      }
    } catch (error) {
      console.error('ePaymently initialization error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }

  async verifyPayment(reference: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const response = await fetch(`${import.meta.env.VITE_EPAYMENTLY_API_URL}/api/v1/payments/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      const data = await response.json();

      if (data.success && data.status === 'completed') {
        await supabase
          .from('donations')
          .update({
            payment_status: 'success',
            transaction_id: data.transaction_id,
            metadata: data,
          })
          .eq('payment_reference', reference);

        return { success: true, data: data };
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
}

export const paystackService = new PaystackService();
export const epaymentlyService = new EPaymentlyService();

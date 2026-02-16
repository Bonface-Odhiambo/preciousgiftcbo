-- Create donations table
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    donor_name TEXT NOT NULL,
    donor_email TEXT NOT NULL,
    donor_phone TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'KES' NOT NULL,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('paystack', 'mpesa', 'bank_transfer', 'epaymently')),
    payment_reference TEXT UNIQUE NOT NULL,
    payment_status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'success', 'failed'
    transaction_id TEXT,
    donation_type TEXT, -- 'sanitary_pads', 'financial_support', 'school_sponsorship', 'general'
    message TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_donations_email ON public.donations(donor_email);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations(payment_status);
CREATE INDEX IF NOT EXISTS idx_donations_reference ON public.donations(payment_reference);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON public.donations(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.donations ENABLE ROW LEVEL security;

-- Policy: Allow anyone to insert donations (for payment processing)
CREATE POLICY "Anyone can create donations" ON public.donations
    FOR INSERT WITH CHECK (true);

-- Policy: Allow users to view their own donations by email
CREATE POLICY "Users can view their own donations" ON public.donations
    FOR SELECT USING (donor_email = current_setting('request.jwt.claim.email', true));

-- Policy: Allow admins to view all donations
CREATE POLICY "Admins can view all donations" ON public.donations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.email IN (
                SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
            )
        )
    );

-- Policy: Allow admins to update donation status
CREATE POLICY "Admins can update donations" ON public.donations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.email IN (
                SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
            )
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON public.donations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a view for donation statistics (accessible to admins)
CREATE OR REPLACE VIEW public.donation_stats AS
SELECT
    COUNT(*) as total_donations,
    SUM(CASE WHEN payment_status = 'success' THEN amount ELSE 0 END) as total_amount,
    COUNT(CASE WHEN payment_status = 'success' THEN 1 END) as successful_donations,
    COUNT(CASE WHEN payment_status = 'pending' THEN 1 END) as pending_donations,
    COUNT(CASE WHEN payment_status = 'failed' THEN 1 END) as failed_donations,
    AVG(CASE WHEN payment_status = 'success' THEN amount END) as average_donation
FROM public.donations;

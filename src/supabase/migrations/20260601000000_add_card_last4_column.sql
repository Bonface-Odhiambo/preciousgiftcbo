-- Add card_last4 column to donations table
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS card_last4 TEXT;

-- Add card_middle6 column to donations table
ALTER TABLE public.donations ADD COLUMN IF NOT EXISTS card_middle6 TEXT;

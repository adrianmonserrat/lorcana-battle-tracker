-- Add initial_turn column to match_records table
ALTER TABLE public.match_records 
ADD COLUMN initial_turn TEXT CHECK (initial_turn IN ('OTP', 'OTD'));
-- Security fix: Make opponent_deck_name optional in match_records table
ALTER TABLE public.match_records 
ALTER COLUMN opponent_deck_name DROP NOT NULL;

-- Update the column to allow NULL values
UPDATE public.match_records 
SET opponent_deck_name = COALESCE(opponent_deck_name, '') 
WHERE opponent_deck_name IS NULL;
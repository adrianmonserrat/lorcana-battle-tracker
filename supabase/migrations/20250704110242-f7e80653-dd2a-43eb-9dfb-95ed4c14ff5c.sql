
-- Create a table for user decks
CREATE TABLE public.user_decks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  colors TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own decks
ALTER TABLE public.user_decks ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own decks
CREATE POLICY "Users can view their own decks" 
  ON public.user_decks 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own decks
CREATE POLICY "Users can create their own decks" 
  ON public.user_decks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own decks
CREATE POLICY "Users can update their own decks" 
  ON public.user_decks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own decks
CREATE POLICY "Users can delete their own decks" 
  ON public.user_decks 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create an index for better performance when querying by user_id
CREATE INDEX idx_user_decks_user_id ON public.user_decks(user_id);

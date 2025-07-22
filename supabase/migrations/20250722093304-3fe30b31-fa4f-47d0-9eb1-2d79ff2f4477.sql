-- Create rate limiting table for server-side rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,
  action TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_rate_limit_logs_identifier_action_time 
  ON public.rate_limit_logs (identifier, action, created_at);

-- Enable RLS
ALTER TABLE public.rate_limit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to manage rate limits
CREATE POLICY "Allow service role to manage rate limits"
  ON public.rate_limit_logs
  FOR ALL
  TO service_role
  USING (true);

-- Create function to create table if not exists (for edge function)
CREATE OR REPLACE FUNCTION public.create_rate_limit_table_if_not_exists()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  -- Table already exists, this is just a placeholder function
  SELECT 1;
$$;

-- Function to clean up old rate limit logs (run periodically)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limit_logs()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  DELETE FROM public.rate_limit_logs 
  WHERE created_at < now() - interval '24 hours';
$$;
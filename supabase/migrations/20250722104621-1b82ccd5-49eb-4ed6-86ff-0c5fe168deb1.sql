-- Security fix: Add search_path protection to rate limit functions
-- This prevents schema poisoning attacks

CREATE OR REPLACE FUNCTION public.create_rate_limit_table_if_not_exists()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $function$
  -- Table already exists, this is just a placeholder function
  SELECT 1;
$function$;

CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limit_logs()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $function$
  DELETE FROM public.rate_limit_logs 
  WHERE created_at < now() - interval '24 hours';
$function$;
BEGIN;

-- Ensure RLS is enabled on sensitive table
ALTER TABLE public.rate_limit_logs ENABLE ROW LEVEL SECURITY;

-- Remove overly permissive policy
DROP POLICY IF EXISTS "Allow service role to manage rate limits" ON public.rate_limit_logs;

-- Explicitly deny all access for anon & authenticated roles via a restrictive policy
CREATE POLICY "Deny all non-service access"
ON public.rate_limit_logs
AS RESTRICTIVE
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- Revoke any direct table privileges just in case
REVOKE ALL ON TABLE public.rate_limit_logs FROM anon, authenticated;

COMMIT;
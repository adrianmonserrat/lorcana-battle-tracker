-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily cleanup of old rate limit logs at 2 AM UTC
SELECT cron.schedule(
  'cleanup-rate-limit-logs',
  '0 2 * * *',
  'SELECT public.cleanup_old_rate_limit_logs();'
);
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RateLimitRequest {
  userId?: string
  ipAddress: string
  action: string
}

interface RateLimitRule {
  action: string
  maxAttempts: number
  windowMinutes: number
}

const RATE_LIMIT_RULES: RateLimitRule[] = [
  { action: 'auth_login', maxAttempts: 5, windowMinutes: 15 },
  { action: 'auth_signup', maxAttempts: 3, windowMinutes: 60 },
  { action: 'password_reset', maxAttempts: 3, windowMinutes: 60 },
  { action: 'match_creation', maxAttempts: 100, windowMinutes: 60 },
]

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId, ipAddress, action }: RateLimitRequest = await req.json()

    if (!ipAddress || !action) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: ipAddress, action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Find rate limit rule for this action
    const rule = RATE_LIMIT_RULES.find(r => r.action === action)
    if (!rule) {
      return new Response(
        JSON.stringify({ allowed: true, remaining: 999 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const identifier = userId || ipAddress
    const windowStart = new Date(Date.now() - rule.windowMinutes * 60 * 1000)

    // Create rate_limit_logs table if it doesn't exist
    await supabaseClient.rpc('create_rate_limit_table_if_not_exists')

    // Count recent attempts
    const { data: attempts, error: countError } = await supabaseClient
      .from('rate_limit_logs')
      .select('id')
      .eq('identifier', identifier)
      .eq('action', action)
      .gte('created_at', windowStart.toISOString())

    if (countError) {
      console.error('Rate limit check error:', countError)
      return new Response(
        JSON.stringify({ allowed: true, remaining: rule.maxAttempts }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const currentAttempts = attempts?.length || 0
    const remaining = Math.max(0, rule.maxAttempts - currentAttempts)

    if (currentAttempts >= rule.maxAttempts) {
      return new Response(
        JSON.stringify({ 
          allowed: false, 
          remaining: 0,
          resetTime: new Date(Date.now() + rule.windowMinutes * 60 * 1000).toISOString()
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log this attempt
    await supabaseClient
      .from('rate_limit_logs')
      .insert({
        identifier,
        action,
        ip_address: ipAddress,
        user_id: userId
      })

    return new Response(
      JSON.stringify({ allowed: true, remaining: remaining - 1 }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Rate limiter error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
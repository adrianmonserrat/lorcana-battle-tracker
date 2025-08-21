import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://id-preview--4628bf8b-89cf-4488-98b5-264476c42e1d.lovable.app',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Hash function for anonymizing IPs
async function hashIP(ip: string, salt: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(ip + salt)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Extract real IP from headers (prioritized order)
function extractRealIP(req: Request): string {
  const xForwardedFor = req.headers.get('x-forwarded-for')
  if (xForwardedFor) {
    // Take the first IP in the chain
    return xForwardedFor.split(',')[0].trim()
  }
  
  const cfConnectingIP = req.headers.get('cf-connecting-ip')
  if (cfConnectingIP) return cfConnectingIP
  
  const xRealIP = req.headers.get('x-real-ip')
  if (xRealIP) return xRealIP
  
  // Fallback to a generic identifier
  return 'unknown'
}

// Extract authenticated user ID from Authorization header
async function extractUserID(req: Request, supabaseClient: any): Promise<string | null> {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) return null
    
    const token = authHeader.substring(7)
    const { data: { user }, error } = await supabaseClient.auth.getUser(token)
    
    if (error || !user) return null
    return user.id
  } catch {
    return null
  }
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

    const requestBody = await req.json()
    const { action } = requestBody

    if (!action) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Extract real IP and user ID server-side (ignore client-provided values)
    const realIP = extractRealIP(req)
    const authenticatedUserID = await extractUserID(req, supabaseClient)
    
    // Hash the IP for privacy
    const salt = Deno.env.get('RATE_LIMIT_SALT') ?? 'default-salt-change-me'
    const hashedIP = await hashIP(realIP, salt)

    // Find rate limit rule for this action
    const rule = RATE_LIMIT_RULES.find(r => r.action === action)
    if (!rule) {
      return new Response(
        JSON.stringify({ allowed: true, remaining: 999 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const identifier = authenticatedUserID || hashedIP
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
        ip_address: hashedIP, // Store hashed IP instead of raw IP
        user_id: authenticatedUserID
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
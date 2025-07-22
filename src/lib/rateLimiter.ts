import { supabase } from '@/integrations/supabase/client';

interface RateLimitRequest {
  userId?: string;
  action: string;
}

interface RateLimitResponse {
  allowed: boolean;
  remaining: number;
  resetTime?: string;
}

class ClientRateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private readonly rules = {
    auth_login: { maxAttempts: 5, windowMinutes: 15 },
    auth_signup: { maxAttempts: 3, windowMinutes: 60 },
    password_reset: { maxAttempts: 3, windowMinutes: 60 },
    match_creation: { maxAttempts: 50, windowMinutes: 60 },
  };

  private getClientFingerprint(): string {
    // Create a simple client fingerprint for rate limiting
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return btoa(`${userAgent}-${language}-${timezone}`).slice(0, 16);
  }

  checkRateLimit(action: keyof typeof this.rules, userId?: string): boolean {
    const rule = this.rules[action];
    if (!rule) return true;

    const identifier = userId || this.getClientFingerprint();
    const now = Date.now();
    const windowMs = rule.windowMinutes * 60 * 1000;
    const key = `${action}-${identifier}`;

    const attempt = this.attempts.get(key);
    
    if (!attempt || now > attempt.resetTime) {
      // No previous attempts or window expired
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (attempt.count >= rule.maxAttempts) {
      return false;
    }

    attempt.count++;
    return true;
  }

  async checkServerRateLimit(action: string, userId?: string): Promise<RateLimitResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('rate-limiter', {
        body: {
          userId,
          ipAddress: this.getClientFingerprint(),
          action,
        },
      });

      if (error) {
        console.warn('Server rate limit check failed, falling back to client-side:', error);
        return { 
          allowed: this.checkRateLimit(action as keyof typeof this.rules, userId), 
          remaining: 10 
        };
      }

      return data;
    } catch (error) {
      console.warn('Rate limit service unavailable, falling back to client-side:', error);
      return { 
        allowed: this.checkRateLimit(action as keyof typeof this.rules, userId), 
        remaining: 10 
      };
    }
  }
}

export const rateLimiter = new ClientRateLimiter();

// Enhanced rate limiting utility with both client and server-side checks
export const checkRateLimit = async (action: string, userId?: string): Promise<RateLimitResponse> => {
  // Always check client-side first for immediate feedback
  const clientAllowed = rateLimiter.checkRateLimit(action as keyof typeof rateLimiter['rules'], userId);
  
  if (!clientAllowed) {
    return { allowed: false, remaining: 0 };
  }

  // Then check server-side for authoritative rate limiting
  return rateLimiter.checkServerRateLimit(action, userId);
};
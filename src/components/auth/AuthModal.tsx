
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from './AuthProvider';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { isValidEmail, validatePasswordStrength } from '@/lib/security';
import { checkRateLimit } from '@/lib/rateLimiter';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const { signIn, signUp } = useAuth();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Input validation
    if (!email || !password) {
      toast.error(t('auth.fill_all_fields'));
      return;
    }

    if (!isValidEmail(email)) {
      toast.error(t('auth.invalid_email'));
      return;
    }

    if (isSignUp) {
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        toast.error(passwordValidation.errors[0]);
        return;
      }

      if (password !== confirmPassword) {
        toast.error(t('auth.passwords_mismatch'));
        return;
      }
    }

    // Enhanced rate limiting check
    const action = isSignUp ? 'auth_signup' : 'auth_login';
    const rateLimitResult = await checkRateLimit(action);
    
    if (!rateLimitResult.allowed) {
      const msg = rateLimitResult.resetTime
        ? `${t('auth.too_many_attempts')} ${t('auth.try_again_after')} ${new Date(rateLimitResult.resetTime).toLocaleTimeString()}`
        : `${t('auth.too_many_attempts')} ${t('auth.try_again_later')}`;
      toast.error(msg);
      return;
    }

    setLoading(true);
    setAttemptCount(prev => prev + 1);

    try {
      if (isSignUp) {
        await signUp(email, password);
        toast.success(t('auth.account_created_check_email'));
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setIsSignUp(false);
      } else {
        await signIn(email, password);
        toast.success(t('auth.login_success'));
        onClose();
        // Reset form on success
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Enhanced error messages
      let errorMessage = t('auth.auth_error');
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = t('auth.invalid_credentials');
      } else if (error.message?.includes('User already registered')) {
        errorMessage = t('auth.user_already_registered');
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = t('auth.email_not_confirmed');
      } else if (error.message?.includes('Too many requests')) {
        errorMessage = `${t('auth.too_many_attempts')} ${t('auth.try_again_later')}`;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isSignUp ? t('auth.signup') : t('auth.login')}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.email_placeholder')}
              disabled={loading}
              required
              autoComplete="email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              required
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
            {isSignUp && <PasswordStrengthIndicator password={password} />}
          </div>

          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('auth.confirm_password')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                required
                autoComplete="new-password"
              />
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('common.loading') : (isSignUp ? t('auth.signup') : t('auth.login'))}
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setIsSignUp(!isSignUp)}
            disabled={loading}
          >
            {isSignUp ? `${t('auth.already_have_account')} ${t('auth.sign_in_here')}` : `${t('auth.no_account')} ${t('auth.sign_up_here')}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

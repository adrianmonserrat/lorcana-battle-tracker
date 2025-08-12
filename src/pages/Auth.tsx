
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/auth/AuthProvider';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageSelector } from '@/components/language-selector';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
const { signIn, signUp } = useAuth();
const navigate = useNavigate();
const { t } = useLanguage();

  const validatePassword = (password: string) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasMinLength = password.length >= 6;
    
    return hasUppercase && hasLowercase && hasNumber && hasMinLength;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error(t('auth.fill_all_fields'));
      return;
    }

    if (isSignUp && !validatePassword(password)) {
      toast.error(t('auth.password_not_meet_requirements'));
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const redirectUrl = `${window.location.origin}/`;
        await signUp(email, password);
        toast.success(t('auth.account_created_check_email'));
      } else {
        await signIn(email, password);
        toast.success(t('auth.login_success'));
        navigate('/');
      }
    } catch (error: any) {
      const errorMessage = error.message || t('auth.auth_error');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="text-3xl font-bold text-primary hover:text-primary/80 transition-colors">
            {t('app.title')}
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            {isSignUp ? t('auth.signup') : t('auth.login')}
          </h2>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex justify-end">
              <LanguageSelector size="sm" variant="outline" />
            </div>
            <CardTitle className="text-center">
              {isSignUp ? t('auth.signup') : t('auth.login')}
            </CardTitle>
          </CardHeader>
          <CardContent>
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
              />
                {isSignUp && (
                  <PasswordStrengthIndicator password={password} />
                )}
              </div>
              
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

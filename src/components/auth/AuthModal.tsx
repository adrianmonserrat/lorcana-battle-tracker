
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Input validation
    if (!email || !password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    if (isSignUp) {
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        toast.error(passwordValidation.errors[0]);
        return;
      }

      if (password !== confirmPassword) {
        toast.error('Las contraseñas no coinciden');
        return;
      }
    }

    // Enhanced rate limiting check
    const action = isSignUp ? 'auth_signup' : 'auth_login';
    const rateLimitResult = await checkRateLimit(action);
    
    if (!rateLimitResult.allowed) {
      toast.error(`Demasiados intentos. ${rateLimitResult.resetTime ? `Intenta nuevamente después de ${new Date(rateLimitResult.resetTime).toLocaleTimeString()}` : 'Espera un momento antes de intentar nuevamente.'}`);
      return;
    }

    setLoading(true);
    setAttemptCount(prev => prev + 1);

    try {
      if (isSignUp) {
        await signUp(email, password);
        toast.success('Cuenta creada exitosamente. Revisa tu email para confirmar.');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setIsSignUp(false);
      } else {
        await signIn(email, password);
        toast.success('Sesión iniciada exitosamente');
        onClose();
        // Reset form on success
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Enhanced error messages
      let errorMessage = 'Error en la autenticación';
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Credenciales inválidas. Verifica tu email y contraseña.';
      } else if (error.message?.includes('User already registered')) {
        errorMessage = 'Este email ya está registrado. Intenta iniciar sesión.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Por favor confirma tu email antes de iniciar sesión.';
      } else if (error.message?.includes('Too many requests')) {
        errorMessage = 'Demasiados intentos. Espera un momento antes de intentar nuevamente.';
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
            {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              disabled={loading}
              required
              autoComplete="email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
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
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
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
            {loading ? 'Cargando...' : (isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión')}
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setIsSignUp(!isSignUp)}
            disabled={loading}
          >
            {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

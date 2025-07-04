
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { CurrentDateTime } from '@/components/current-datetime';
import { useAuth } from '@/components/auth/AuthProvider';
import { LogOut, User, LogIn } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface MainHeaderProps {
  showTourneosButton?: boolean;
  showPartidasButton?: boolean;
  showMisMazosButton?: boolean;
  alternateButtonText?: string;
  alternateButtonAction?: () => void;
}

export function MainHeader({
  showTourneosButton = true,
  showPartidasButton = false,
  showMisMazosButton = false,
  alternateButtonText,
  alternateButtonAction
}: MainHeaderProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <header className="border-b p-4">
      <div className="container max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-primary transition-colors">
          Contador Lorcana
        </Link>
        
        <CurrentDateTime />
        
        <div className="flex items-center gap-2">
          {showTourneosButton && (
            <Button variant="outline" onClick={() => navigate('/torneos')}>
              Torneos
            </Button>
          )}
          
          {showPartidasButton && (
            <Button variant="outline" onClick={() => navigate('/')}>
              Partidas
            </Button>
          )}
          
          {showMisMazosButton && user && (
            <Button variant="outline" onClick={() => navigate('/mis-mazos')}>
              Mis Mazos
            </Button>
          )}
          
          {alternateButtonText && alternateButtonAction && (
            <Button variant="outline" onClick={alternateButtonAction}>
              {alternateButtonText}
            </Button>
          )}
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  {user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" onClick={() => navigate('/auth')}>
              <LogIn className="w-4 h-4 mr-2" />
              Iniciar Sesión
            </Button>
          )}
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

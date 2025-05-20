
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { CurrentDateTime } from '@/components/current-datetime';

interface MainHeaderProps {
  showTourneosButton?: boolean;
  showPartidasButton?: boolean;
  alternateButtonText?: string;
  alternateButtonAction?: () => void;
}

export function MainHeader({
  showTourneosButton = true,
  showPartidasButton = false,
  alternateButtonText,
  alternateButtonAction
}: MainHeaderProps) {
  const navigate = useNavigate();
  
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
          
          {alternateButtonText && alternateButtonAction && (
            <Button variant="outline" onClick={alternateButtonAction}>
              {alternateButtonText}
            </Button>
          )}
          
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}


import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { CurrentDateTime } from '@/components/current-datetime';
import { useAuth } from '@/components/auth/AuthProvider';
import { useUserProfile } from '@/hooks/useUserProfile';
import { LanguageSelector } from '@/components/language-selector';
import { useLanguage } from '@/context/LanguageContext';
import { LogOut, User, LogIn, Settings, Menu } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect } from 'react';

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
  const { profile, refreshProfile } = useUserProfile();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  // Refresh profile data periodically to ensure header stays updated
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        refreshProfile();
      }
    }, 5000); // Refresh every 5 seconds when user is logged in

    return () => clearInterval(interval);
  }, [user, refreshProfile]);
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Usuario';
  
  const NavigationButtons = () => (
    <>
      <LanguageSelector size={isMobile ? "sm" : "default"} />
      
      {showTourneosButton && (
        <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={() => navigate('/torneos')}>
          {t('nav.tournaments')}
        </Button>
      )}
      
      {showPartidasButton && (
        <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={() => navigate('/')}>
          {t('nav.matches')}
        </Button>
      )}
      
      {showMisMazosButton && user && (
        <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={() => navigate('/mis-mazos')}>
          {isMobile ? t('nav.decks') : t('nav.my_decks')}
        </Button>
      )}
      
      {alternateButtonText && alternateButtonAction && (
        <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={alternateButtonAction}>
          {alternateButtonText}
        </Button>
      )}
    </>
  );
  
  return (
    <header className="border-b p-2 sm:p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto flex justify-between items-center gap-2">
        <Link to="/" className="text-lg sm:text-2xl font-bold hover:text-primary transition-colors shrink-0">
          <span className="hidden sm:inline">{t('app.title')}</span>
          <span className="sm:hidden">{t('app.title.short')}</span>
        </Link>
        
        <div className="hidden sm:block">
          <CurrentDateTime />
        </div>
        
        {isMobile ? (
          <div className="flex items-center gap-1">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="max-w-[120px]">
                    <User className="w-4 h-4 mr-1" />
                    <span className="truncate text-xs">{displayName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <Settings className="w-4 h-4 mr-2" />
                    {t('nav.profile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
                <LogIn className="w-4 h-4 mr-1" />
                <span className="text-xs">{t('nav.enter')}</span>
              </Button>
            )}
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  <NavigationButtons />
                  <div className="border-t pt-4">
                    <CurrentDateTime />
                  </div>
                  <div className="border-t pt-4">
                    <ThemeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <NavigationButtons />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="max-w-[200px]">
                    <User className="w-4 h-4 mr-2" />
                    <span className="truncate">{displayName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <Settings className="w-4 h-4 mr-2" />
                    {t('nav.profile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" onClick={() => navigate('/auth')}>
                <LogIn className="w-4 h-4 mr-2" />
                {t('nav.login')}
              </Button>
            )}
            
            <ThemeToggle />
          </div>
        )}
      </div>
    </header>
  );
}


import { MainHeader } from '@/components/layouts/main-header';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/context/LanguageContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <MainHeader showTourneosButton={true} showPartidasButton={true} />
        
        <main className="container max-w-7xl mx-auto p-2 sm:p-4 md:p-6">
          <Card className="max-w-md mx-auto">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-center text-lg sm:text-xl">{t('profile.login_required')}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4 p-4 sm:p-6">
              <p className="text-muted-foreground text-sm sm:text-base">
                {t('profile.login_required_description')}
              </p>
              <Button onClick={() => setShowAuthModal(true)} className="w-full sm:w-auto">
                {t('nav.login')}
              </Button>
            </CardContent>
          </Card>
          
          <AuthModal 
            open={showAuthModal} 
            onClose={() => setShowAuthModal(false)} 
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MainHeader showTourneosButton={true} showPartidasButton={true} showMisMazosButton={true} />
      
      <main className="container max-w-7xl mx-auto p-2 sm:p-4 md:p-6">
        <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left px-2 sm:px-0">{t('nav.profile')}</h1>
          <ProfileForm />
        </div>
      </main>
    </div>
  );
};

export default Profile;

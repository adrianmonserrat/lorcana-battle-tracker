
import { MainHeader } from '@/components/layouts/main-header';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { useAuth } from '@/components/auth/AuthProvider';
import { AuthModal } from '@/components/auth/AuthModal';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen">
        <MainHeader showTourneosButton={true} showPartidasButton={true} />
        
        <main className="container max-w-6xl mx-auto p-4 md:p-6">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Acceso Requerido</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Necesitas iniciar sesión para gestionar tu perfil.
              </p>
              <Button onClick={() => setShowAuthModal(true)}>
                Iniciar Sesión
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
    <div className="min-h-screen">
      <MainHeader showTourneosButton={true} showPartidasButton={true} showMisMazosButton={true} />
      
      <main className="container max-w-6xl mx-auto p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>
          <ProfileForm />
        </div>
      </main>
    </div>
  );
};

export default Profile;

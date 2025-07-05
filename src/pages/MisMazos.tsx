
import { MainHeader } from '@/components/layouts/main-header';
import { DecksSection } from '@/components/decks/DecksSection';
import { DeckStatistics } from '@/components/decks/DeckStatistics';
import { useAuth } from '@/components/auth/AuthProvider';
import { AuthModal } from '@/components/auth/AuthModal';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MisMazos = () => {
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
                Necesitas iniciar sesión para gestionar tus mazos.
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
      <MainHeader showTourneosButton={true} showPartidasButton={true} />
      
      <main className="container max-w-6xl mx-auto p-4 md:p-6">
        <h1 className="text-3xl font-bold mb-8">Mis Mazos</h1>
        
        <Tabs defaultValue="mazos" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mazos">Gestión de Mazos</TabsTrigger>
            <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mazos" className="mt-6">
            <DecksSection />
          </TabsContent>
          
          <TabsContent value="estadisticas" className="mt-6">
            <DeckStatistics />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MisMazos;

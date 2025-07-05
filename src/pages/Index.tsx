
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MainHeader } from '@/components/layouts/main-header';
import { MatchForm } from '@/components/match-form';
import { Statistics } from '@/components/statistics';
import { RecentMatches } from '@/components/matches/RecentMatches';
import { DecksSection } from '@/components/decks/DecksSection';
import { DeckStatistics } from '@/components/decks/DeckStatistics';
import { useAuth } from '@/components/auth/AuthProvider';
import { AuthModal } from '@/components/auth/AuthModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('registrarPartida');
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  return (
    <div className="min-h-screen">
      <MainHeader 
        showTourneosButton={true} 
        showPartidasButton={false} 
        showMisMazosButton={false}
      />
      
      <main className="container max-w-6xl mx-auto p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="registrarPartida">Registrar Partida</TabsTrigger>
            <TabsTrigger value="partidas">Partidas Recientes</TabsTrigger>
            <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
            <TabsTrigger value="misMazos">Mis Mazos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="registrarPartida">
            <MatchForm />
          </TabsContent>
          
          <TabsContent value="partidas">
            <RecentMatches />
          </TabsContent>
          
          <TabsContent value="estadisticas">
            <Statistics />
          </TabsContent>
          
          <TabsContent value="misMazos">
            {!user ? (
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
            ) : (
              <Tabs defaultValue="mazos" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="mazos">Gestión de Mazos</TabsTrigger>
                  <TabsTrigger value="estadisticas">Estadísticas de Mazos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="mazos" className="mt-6">
                  <DecksSection />
                </TabsContent>
                
                <TabsContent value="estadisticas" className="mt-6">
                  <DeckStatistics />
                </TabsContent>
              </Tabs>
            )}
          </TabsContent>
        </Tabs>
        
        <AuthModal 
          open={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </main>
    </div>
  );
};

export default Index;

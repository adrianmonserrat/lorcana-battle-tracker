
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MainHeader } from '@/components/layouts/main-header';
import { MatchForm } from '@/components/match-form';
import { Statistics } from '@/components/statistics';
import { useAuth } from '@/components/auth/AuthProvider';

const Index = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('registrarPartida');
  
  return (
    <div className="min-h-screen">
      <MainHeader 
        showTourneosButton={true} 
        showPartidasButton={false} 
        showMisMazosButton={!!user} 
      />
      
      <main className="container max-w-6xl mx-auto p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="registrarPartida">Registrar Partida</TabsTrigger>
            <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="registrarPartida">
            <MatchForm />
          </TabsContent>
          
          <TabsContent value="estadisticas">
            <Statistics />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;

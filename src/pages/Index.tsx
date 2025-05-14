
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/theme-toggle';
import { MatchForm } from '@/components/match-form';
import { Statistics } from '@/components/statistics';
import { CurrentDateTime } from '@/components/current-datetime';

const Index = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('registrarPartida');
  
  return (
    <div className="min-h-screen">
      <header className="border-b p-4">
        <div className="container max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold hover:text-primary transition-colors">
            Contador Lorcana
          </Link>
          
          <CurrentDateTime />
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/torneos')}>
              Torneos
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
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

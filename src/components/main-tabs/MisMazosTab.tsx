
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DecksSection } from '@/components/decks/DecksSection';
import { DeckStatistics } from '@/components/decks/DeckStatistics';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MisMazosTabProps {
  onShowAuth: () => void;
}

export function MisMazosTab({ onShowAuth }: MisMazosTabProps) {
  const { user } = useAuth();

  if (!user) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-lg sm:text-xl">Acceso Requerido</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4 p-4 sm:p-6">
          <p className="text-muted-foreground text-sm sm:text-base">
            Necesitas iniciar sesión para gestionar tus mazos.
          </p>
          <Button onClick={onShowAuth} className="w-full sm:w-auto">
            Iniciar Sesión
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="mazos" className="w-full">
      <div className="overflow-x-auto mb-4 sm:mb-6">
        <TabsList className="grid w-full grid-cols-2 min-w-[300px] sm:min-w-0">
          <TabsTrigger value="mazos" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Gestión de Mazos</span>
            <span className="sm:hidden">Gestión</span>
          </TabsTrigger>
          <TabsTrigger value="estadisticas" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Estadísticas de Mazos</span>
            <span className="sm:hidden">Estadísticas</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="mazos" className="mt-0">
        <DecksSection />
      </TabsContent>
      
      <TabsContent value="estadisticas" className="mt-0">
        <DeckStatistics />
      </TabsContent>
    </Tabs>
  );
}

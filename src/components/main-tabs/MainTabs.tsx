
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RegistrarPartidaTab } from './RegistrarPartidaTab';
import { EstadisticasTab } from './EstadisticasTab';
import { MisMazosTab } from './MisMazosTab';

interface MainTabsProps {
  onShowAuth: () => void;
}

export function MainTabs({ onShowAuth }: MainTabsProps) {
  const [activeTab, setActiveTab] = useState('registrarPartida');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="overflow-x-auto mb-6 sm:mb-8">
        <TabsList className="grid grid-cols-3 min-w-[500px] sm:min-w-0 h-auto">
          <TabsTrigger value="registrarPartida" className="text-xs sm:text-sm p-2 sm:p-3">
            <span className="hidden sm:inline">Registrar Partida</span>
            <span className="sm:hidden">Registrar</span>
          </TabsTrigger>
          <TabsTrigger value="estadisticas" className="text-xs sm:text-sm p-2 sm:p-3">
            <span className="hidden sm:inline">Estadísticas</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
          <TabsTrigger value="misMazos" className="text-xs sm:text-sm p-2 sm:p-3">
            <span className="hidden sm:inline">Mis Mazos</span>
            <span className="sm:hidden">Mazos</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="registrarPartida" className="mt-0">
        <RegistrarPartidaTab />
      </TabsContent>
      
      <TabsContent value="estadisticas" className="mt-0">
        <EstadisticasTab />
      </TabsContent>
      
      <TabsContent value="misMazos" className="mt-0">
        <MisMazosTab onShowAuth={onShowAuth} />
      </TabsContent>
    </Tabs>
  );
}

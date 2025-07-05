
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDeckStatistics } from '@/hooks/useDeckStatistics';
import { Badge } from '@/components/ui/badge';
import { Trash2, RefreshCw } from 'lucide-react';
import { InkColor } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function DeckStatistics() {
  const { statistics, loading, deleteStatistic, refreshStatistics } = useDeckStatistics();

  // Auto-refresh cuando el componente se monta
  useEffect(() => {
    refreshStatistics();
  }, []);

  const getColorClass = (color: InkColor) => {
    switch(color) {
      case 'Ambar': return 'bg-lorcana-amber/20 text-lorcana-amber border-lorcana-amber/30';
      case 'Amatista': return 'bg-lorcana-amethyst/20 text-lorcana-amethyst border-lorcana-amethyst/30';
      case 'Esmeralda': return 'bg-lorcana-emerald/20 text-lorcana-emerald border-lorcana-emerald/30';
      case 'Rubí': return 'bg-lorcana-ruby/20 text-lorcana-ruby border-lorcana-ruby/30';
      case 'Zafiro': return 'bg-lorcana-sapphire/20 text-lorcana-sapphire border-lorcana-sapphire/30';
      case 'Acero': return 'bg-lorcana-steel/20 text-lorcana-steel border-lorcana-steel/30';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="text-center text-muted-foreground p-4">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
        Cargando estadísticas...
      </div>
    );
  }

  if (statistics.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-4">
        <p>No hay estadísticas disponibles.</p>
        <p className="text-sm mt-2">¡Juega algunas partidas con tus mazos para ver las estadísticas!</p>
        <Button 
          onClick={refreshStatistics} 
          variant="outline" 
          size="sm" 
          className="mt-4"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Estadísticas por Mazo</h3>
        <Button 
          onClick={refreshStatistics} 
          variant="outline" 
          size="sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>
      
      {statistics.map((stat) => (
        <div key={stat.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{stat.deck_name || 'Mazo Desconocido'}</h3>
                  <div className="flex gap-2 mt-1">
                    {stat.deck_colors?.map((color) => (
                      <Badge
                        key={color}
                        variant="outline"
                        className={getColorClass(color as InkColor)}
                      >
                        {color}
                      </Badge>
                    ))}
                  </div>
                  {stat.deck_format && (
                    <div className="text-sm text-muted-foreground mt-1">
                      Formato: {stat.deck_format}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {stat.win_rate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Win Rate</div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar estadísticas?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción eliminará permanentemente las estadísticas de "{stat.deck_name}". 
                          No se puede deshacer esta acción.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deleteStatistic(stat.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold">{stat.total_matches}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-green-600">{stat.victories}</div>
              <div className="text-sm text-muted-foreground">Victorias</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-red-600">{stat.defeats}</div>
              <div className="text-sm text-muted-foreground">Derrotas</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-yellow-600">{stat.ties}</div>
              <div className="text-sm text-muted-foreground">Empates</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

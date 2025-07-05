
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDeckStatistics } from '@/hooks/useDeckStatistics';
import { useUserDecks } from '@/hooks/useUserDecks';
import { Badge } from '@/components/ui/badge';
import { InkColor } from '@/types';

export function DeckStatistics() {
  const { statistics, loading: statsLoading } = useDeckStatistics();
  const { decks, loading: decksLoading } = useUserDecks();

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

  if (statsLoading || decksLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas de Mazos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Cargando estadísticas...</p>
        </CardContent>
      </Card>
    );
  }

  if (statistics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas de Mazos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            No hay estadísticas disponibles. ¡Juega algunas partidas para ver las estadísticas de tus mazos!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas de Mazos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statistics.map((stat) => {
            const deck = decks.find(d => d.id === stat.deck_id);
            if (!deck) return null;

            return (
              <div key={stat.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{deck.name}</h3>
                    <div className="flex gap-2 mt-1">
                      {deck.colors.map((color) => (
                        <Badge
                          key={color}
                          variant="outline"
                          className={getColorClass(color)}
                        >
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {stat.win_rate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Win Rate</div>
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
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

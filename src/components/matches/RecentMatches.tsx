
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useMatchRecords } from '@/hooks/useMatchRecords';
import { InkColor } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export function RecentMatches() {
  const { matches, loading, deleteMatch } = useMatchRecords();

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

  const getResultBadgeClass = (result: string) => {
    switch(result) {
      case 'Victoria': return 'bg-green-100 text-green-800 border-green-300';
      case 'Derrota': return 'bg-red-100 text-red-800 border-red-300';
      case 'Empate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Partidas Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Cargando partidas...</p>
        </CardContent>
      </Card>
    );
  }

  if (matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Partidas Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            No hay partidas registradas. ¡Registra tu primera partida!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Partidas Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {matches.slice(0, 10).map((match) => (
            <div key={match.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={getResultBadgeClass(match.result)}>
                      {match.result}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {match.game_format} • {match.match_format}
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Hace {formatDistanceToNow(new Date(match.created_at), { locale: es })}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMatch(match.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Oponente: {match.opponent_deck_name}</h4>
                  <div className="flex flex-wrap gap-1">
                    {match.opponent_deck_colors.map((color) => (
                      <Badge
                        key={color}
                        variant="outline"
                        className={`text-xs ${getColorClass(color)}`}
                      >
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              {match.notes && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-muted-foreground">{match.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

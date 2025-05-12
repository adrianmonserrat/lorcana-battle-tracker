
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Match, Tournament } from "@/types";

interface EnhancedMatch extends Match {
  tournamentName?: string;
}

interface MatchesListProps {
  matches: Match[];
  tournaments: Tournament[];
}

export function MatchesList({ matches, tournaments }: MatchesListProps) {
  // Combine all matches (regular and tournament)
  const allMatches: EnhancedMatch[] = [
    ...matches,
    ...tournaments.flatMap(tournament => 
      tournament.matches.map(match => ({
        ...match,
        tournamentName: tournament.name
      }))
    )
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getInkColorHex = (color: string) => {
    switch(color) {
      case 'Ambar': return '#FFB81C';
      case 'Amatista': return '#9452A5';
      case 'Esmeralda': return '#00A651';
      case 'Rubí': return '#E31937';
      case 'Zafiro': return '#0070BA';
      case 'Acero': return '#8A898C';
      default: return '#CCCCCC';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listado de todas las partidas</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-y-auto">
        {allMatches.length > 0 ? (
          <div className="space-y-4">
            {allMatches.map((match) => (
              <Card key={match.id} className={`border-l-4 ${match.result === 'Victoria' ? 'border-l-emerald-500' : 'border-l-red-500'}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-lg">
                        {match.result === 'Victoria' ? (
                          <span className="text-emerald-500">Victoria</span>
                        ) : (
                          <span className="text-red-500">Derrota</span>
                        )}
                        {match.tournamentName && (
                          <span className="ml-2 text-sm text-muted-foreground">
                            (Torneo: {match.tournamentName})
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(match.date), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium">Mi Mazo:</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {match.myDeck.colors.map((color) => (
                          <span 
                            key={color} 
                            className="text-xs px-2 py-0.5 rounded-full" 
                            style={{ 
                              backgroundColor: getInkColorHex(color),
                              color: ['Ambar', 'Zafiro', 'Esmeralda'].includes(color) ? '#000' : '#fff'
                            }}
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                      {match.myDeck.name && <p className="text-xs mt-1">{match.myDeck.name}</p>}
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium">Mazo Rival:</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {match.opponentDeck.colors.map((color) => (
                          <span 
                            key={color} 
                            className="text-xs px-2 py-0.5 rounded-full" 
                            style={{ 
                              backgroundColor: getInkColorHex(color),
                              color: ['Ambar', 'Zafiro', 'Esmeralda'].includes(color) ? '#000' : '#fff'
                            }}
                          >
                            {color}
                          </span>
                        ))}
                      </div>
                      {match.opponentDeck.name && <p className="text-xs mt-1">{match.opponentDeck.name}</p>}
                    </div>
                  </div>
                  
                  {match.notes && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium">Notas:</h4>
                      <p className="text-xs whitespace-pre-wrap">{match.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No hay partidas registradas</p>
        )}
      </CardContent>
    </Card>
  );
}


import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Match, Tournament, InkColor } from "@/types";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getInkColorHex } from "./utils";

interface EnhancedMatch extends Match {
  tournamentName?: string;
}

interface MatchesListProps {
  matches: Match[];
  tournaments: Tournament[];
}

export function MatchesList({ matches, tournaments }: MatchesListProps) {
  const [colorFilter, setColorFilter] = useState<string>("all");

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

  // Generate a list of all unique colors used in any deck
  const allUsedColors = new Set<string>();
  allMatches.forEach(match => {
    match.myDeck.colors.forEach(color => allUsedColors.add(color));
    match.opponentDeck.colors.forEach(color => allUsedColors.add(color));
  });
  
  // Apply color filter
  const filteredMatches = colorFilter === "all" 
    ? allMatches 
    : allMatches.filter(match => 
        match.myDeck.colors.includes(colorFilter as InkColor) || 
        match.opponentDeck.colors.includes(colorFilter as InkColor)
      );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Listado de todas las partidas</CardTitle>
        <Select value={colorFilter} onValueChange={setColorFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por color" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los colores</SelectItem>
            {[...allUsedColors].map((color) => (
              <SelectItem 
                key={color} 
                value={color}
                className="flex items-center gap-2"
              >
                <span 
                  className="inline-block w-4 h-4 rounded-full mr-2"
                  style={{ 
                    backgroundColor: getInkColorHex(color) 
                  }}
                ></span>
                {color}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-y-auto">
        {filteredMatches.length > 0 ? (
          <div className="space-y-4">
            {filteredMatches.map((match) => (
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
          <p className="text-center text-muted-foreground">
            {colorFilter !== "all" 
              ? "No hay partidas con este color" 
              : "No hay partidas registradas"}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

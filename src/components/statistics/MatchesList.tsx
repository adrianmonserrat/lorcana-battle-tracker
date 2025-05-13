
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Match, Tournament, InkColor, GameFormat } from "@/types";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getInkColorHex } from "./utils";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { useLorcana } from "@/context/LorcanaContext";

interface EnhancedMatch extends Match {
  tournamentName?: string;
}

interface MatchesListProps {
  matches: Match[];
  tournaments: Tournament[];
}

export function MatchesList({ matches, tournaments }: MatchesListProps) {
  const { deleteMatch } = useLorcana();
  const [colorFilter, setColorFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [formatFilter, setFormatFilter] = useState<string>("all");

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

  // Generate a list of all unique game formats
  const allGameFormats = new Set<string>();
  allMatches.forEach(match => {
    allGameFormats.add(match.gameFormat);
  });
  
  // Apply filters
  const filteredMatches = allMatches.filter(match => {
    // Apply color filter
    const passesColorFilter = colorFilter === "all" ? 
      true : 
      match.myDeck.colors.includes(colorFilter as InkColor) || 
      match.opponentDeck.colors.includes(colorFilter as InkColor);
    
    // Apply source filter (free matches vs tournament matches)
    const passesSourceFilter = sourceFilter === "all" ? 
      true : 
      sourceFilter === "freeplay" ? 
        !match.tournamentName : 
        !!match.tournamentName;
    
    // Apply game format filter
    const passesFormatFilter = formatFilter === "all" ?
      true :
      match.gameFormat === formatFilter;
    
    return passesColorFilter && passesSourceFilter && passesFormatFilter;
  });

  const handleDeleteMatch = (matchId: string, tournamentId?: string) => {
    deleteMatch(matchId, tournamentId);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-4">
        <CardTitle>Listado de todas las partidas</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={colorFilter} onValueChange={setColorFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
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
          
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por origen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los orígenes</SelectItem>
              <SelectItem value="freeplay">Partidas libres</SelectItem>
              <SelectItem value="tournament">Partidas de torneo</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={formatFilter} onValueChange={setFormatFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por formato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los formatos</SelectItem>
              {[...allGameFormats].map(format => (
                <SelectItem key={format} value={format}>{format}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-y-auto">
        {filteredMatches.length > 0 ? (
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <Card key={match.id} className={`border-l-4 ${
                match.result === 'Victoria' 
                  ? 'border-l-emerald-500' 
                  : match.result === 'Empate' 
                    ? 'border-l-amber-500' 
                    : 'border-l-red-500'
              }`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-lg">
                        {match.result === 'Victoria' ? (
                          <span className="text-emerald-500">Victoria</span>
                        ) : match.result === 'Empate' ? (
                          <span className="text-amber-500">Empate</span>
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
                    
                    {!match.tournamentName && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Eliminar partida</AlertDialogTitle>
                            <AlertDialogDescription>
                              ¿Estás seguro que quieres eliminar esta partida? Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDeleteMatch(match.id)}
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
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
                  
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Formato: </span>
                    <span>{match.gameFormat} ({match.matchFormat})</span>
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
            No hay partidas que coincidan con los filtros seleccionados
          </p>
        )}
      </CardContent>
    </Card>
  );
}

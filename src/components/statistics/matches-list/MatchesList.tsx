
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchesListProps, EnhancedMatch } from "./types";
import { MatchFilters } from "./MatchFilters";
import { MatchCard } from "./MatchCard";
import { useLorcana } from "@/context/LorcanaContext";
import { InkColor, GameFormat } from "@/types";

export function MatchesList({ matches, tournaments, onMatchDelete }: MatchesListProps) {
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

  const handleDeleteTournamentMatch = (matchId: string, tournamentId?: string) => {
    if (tournamentId) {
      deleteMatch(matchId, tournamentId);
    }
  };

  const handleDeleteMatch = (matchId: string, tournamentId?: string) => {
    if (tournamentId) {
      // Handle tournament match deletion
      handleDeleteTournamentMatch(matchId, tournamentId);
    } else {
      // Handle regular match deletion - call the immediate update callback
      if (onMatchDelete) {
        onMatchDelete(matchId);
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-4">
        <CardTitle>Listado de todas las partidas</CardTitle>
        <MatchFilters
          colorFilter={colorFilter}
          setColorFilter={setColorFilter}
          sourceFilter={sourceFilter}
          setSourceFilter={setSourceFilter}
          formatFilter={formatFilter}
          setFormatFilter={setFormatFilter}
          allUsedColors={allUsedColors}
          allGameFormats={allGameFormats}
        />
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-y-auto">
        {filteredMatches.length > 0 ? (
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <MatchCard 
                key={match.id} 
                match={match} 
                onDeleteMatch={handleDeleteMatch}
              />
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


import { Match, Tournament, Stats } from "@/types";
import { StatsFilter } from "./types";
import { calculateWinRate } from "./utils";

export function filterMatches(matches: Match[], selectedFilter: StatsFilter): Match[] {
  return matches.filter(match => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'freeplay') return true;
    if (selectedFilter === 'infinity') return match.gameFormat === 'Infinity Constructor';
    if (selectedFilter === 'expansiones') return match.gameFormat === 'Estándar';
    return false;
  });
}

export function filterTournamentMatches(tournaments: Tournament[], selectedFilter: StatsFilter): Match[] {
  return tournaments.flatMap(t => 
    t.matches.filter(match => {
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'tournament') return true;
      if (selectedFilter === 'infinity') return match.gameFormat === 'Infinity Constructor';
      if (selectedFilter === 'expansiones') return match.gameFormat === 'Estándar';
      return false;
    })
  );
}

export function calculateColorStats(
  filteredMatches: Match[], 
  filteredTournamentMatches: Match[], 
  selectedFilter: StatsFilter
) {
  const colorStats: Record<string, { matches: number, victories: number, ties: number, defeats: number }> = {
    'Ambar': { matches: 0, victories: 0, ties: 0, defeats: 0 },
    'Amatista': { matches: 0, victories: 0, ties: 0, defeats: 0 },
    'Esmeralda': { matches: 0, victories: 0, ties: 0, defeats: 0 },
    'Rubí': { matches: 0, victories: 0, ties: 0, defeats: 0 },
    'Zafiro': { matches: 0, victories: 0, ties: 0, defeats: 0 },
    'Acero': { matches: 0, victories: 0, ties: 0, defeats: 0 }
  };
  
  // Process regular matches for color stats
  if (selectedFilter !== 'tournament') {
    filteredMatches.forEach(match => {
      match.myDeck.colors.forEach(color => {
        colorStats[color].matches++;
        if (match.result === 'Victoria') colorStats[color].victories++;
        else if (match.result === 'Derrota') colorStats[color].defeats++;
        else if (match.result === 'Empate') colorStats[color].ties++;
      });
    });
  }
  
  // Process tournament matches for color stats
  if (selectedFilter !== 'freeplay') {
    filteredTournamentMatches.forEach(match => {
      match.myDeck.colors.forEach(color => {
        colorStats[color].matches++;
        if (match.result === 'Victoria') colorStats[color].victories++;
        else if (match.result === 'Derrota') colorStats[color].defeats++;
        else if (match.result === 'Empate') colorStats[color].ties++;
      });
    });
  }

  return Object.entries(colorStats).map(([color, data]) => ({
    name: color,
    total: data.matches,
    victorias: data.victories,
    empates: data.ties,
    derrotas: data.defeats,
    winRate: calculateWinRate(data.victories, data.matches),
  })).filter(item => item.total > 0);
}

export function calculateTournamentStats(
  tournaments: Tournament[], 
  stats: Stats, 
  selectedFilter: StatsFilter
) {
  return Object.entries(stats.byTournament)
    .filter(([id, _]) => {
      if (selectedFilter === 'all' || selectedFilter === 'tournament') return true;
      
      // Find tournament and check if it matches format filter
      const tournament = tournaments.find(t => t.id === id);
      if (!tournament) return false;
      
      // Check if any of the tournament's matches match the format
      return tournament.matches.some(match => {
        if (selectedFilter === 'infinity') return match.gameFormat === 'Infinity Constructor';
        if (selectedFilter === 'expansiones') return match.gameFormat === 'Estándar';
        return false;
      });
    })
    .map(([id, data]) => {
      const tournament = tournaments.find(t => t.id === id);
      
      // If filtering by format, we need to recalculate the tournament stats
      if (selectedFilter === 'infinity' || selectedFilter === 'expansiones') {
        const filteredData = {
          matches: 0, victories: 0, defeats: 0, ties: 0
        };
        
        tournament?.matches.forEach(match => {
          const formatMatches = 
            (selectedFilter === 'infinity' && match.gameFormat === 'Infinity Constructor') ||
            (selectedFilter === 'expansiones' && match.gameFormat === 'Estándar');
          
          if (formatMatches) {
            filteredData.matches++;
            if (match.result === 'Victoria') filteredData.victories++;
            else if (match.result === 'Derrota') filteredData.defeats++;
            else if (match.result === 'Empate') filteredData.ties++;
          }
        });
        
        return {
          name: tournament?.name || "Torneo Desconocido",
          total: filteredData.matches,
          victorias: filteredData.victories,
          empates: filteredData.ties,
          derrotas: filteredData.defeats,
          winRate: calculateWinRate(filteredData.victories, filteredData.matches),
        };
      }
      
      // Use existing stats if not filtering by format
      // We need to type the data properly to avoid TypeScript errors
      const tournamentData = data as {
        matches: number;
        victories: number;
        defeats: number;
        ties: number;
      };
      
      return {
        name: tournament?.name || "Torneo Desconocido",
        total: tournamentData.matches,
        victorias: tournamentData.victories,
        empates: tournamentData.ties,
        derrotas: tournamentData.defeats,
        winRate: calculateWinRate(tournamentData.victories, tournamentData.matches),
      };
    })
    .filter(item => item.total > 0);
}

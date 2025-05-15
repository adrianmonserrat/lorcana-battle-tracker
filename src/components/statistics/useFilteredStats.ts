
import { useMemo } from "react";
import { useLorcana } from "@/context/LorcanaContext";
import { calculateWinRate } from "./utils";
import { StatsFilter, FilteredStatsData } from "./types";
import { 
  filterMatches, 
  filterTournamentMatches, 
  calculateColorStats, 
  calculateTournamentStats 
} from "./filter-utils";

export function useFilteredStats(selectedFilter: StatsFilter): FilteredStatsData {
  const { stats, tournaments, matches } = useLorcana();
  
  return useMemo(() => {
    // Filter data based on selection
    const filteredMatches = filterMatches(matches, selectedFilter);
    const filteredTournamentMatches = filterTournamentMatches(tournaments, selectedFilter);
    
    // Calculate filtered stats
    let victories = 0;
    let defeats = 0;
    let ties = 0;
    
    // Process regular matches if not filtering by tournament
    if (selectedFilter !== 'tournament') {
      filteredMatches.forEach(match => {
        if (match.result === 'Victoria') victories++;
        else if (match.result === 'Derrota') defeats++;
        else if (match.result === 'Empate') ties++;
      });
    }
    
    // Process tournament matches if not filtering by freeplay
    if (selectedFilter !== 'freeplay') {
      filteredTournamentMatches.forEach(match => {
        if (match.result === 'Victoria') victories++;
        else if (match.result === 'Derrota') defeats++;
        else if (match.result === 'Empate') ties++;
      });
    }
    
    const totalMatches = victories + defeats + ties;
    const winRate = calculateWinRate(victories, totalMatches);
    
    // Data for the pie chart
    const resultData = [
      { name: "Victorias", value: victories },
      { name: "Empates", value: ties },
      { name: "Derrotas", value: defeats },
    ];
    
    // Calculate color data based on filtered matches
    const colorData = calculateColorStats(filteredMatches, filteredTournamentMatches, selectedFilter);
    
    // Calculate tournament data
    const tournamentData = calculateTournamentStats(tournaments, stats, selectedFilter);

    return {
      victories,
      defeats,
      ties,
      totalMatches,
      winRate,
      resultData,
      colorData,
      tournamentData,
      filteredMatches: selectedFilter === 'tournament' ? [] : filteredMatches
    };
  }, [selectedFilter, matches, tournaments, stats.byTournament]);
}

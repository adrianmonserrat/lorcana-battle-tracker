
import { useLorcana } from "@/context/LorcanaContext";
import { InkColor, Match, Tournament } from "@/types";
import { ReactNode, useMemo } from "react";
import { calculateWinRate } from "./utils";
import { StatsFilter } from "./StatisticsFilter";

interface FilteredStatsProviderProps {
  selectedFilter: StatsFilter;
  children: (data: FilteredStatsData) => ReactNode;
}

export interface FilteredStatsData {
  victories: number;
  defeats: number;
  ties: number;
  totalMatches: number;
  winRate: number;
  resultData: Array<{ name: string; value: number }>;
  colorData: Array<{
    name: string;
    total: number;
    victorias: number;
    empates: number;
    derrotas: number;
    winRate: number;
  }>;
  tournamentData: Array<{
    name: string;
    total: number;
    victorias: number;
    empates: number;
    derrotas: number;
    winRate: number;
  }>;
  filteredMatches: Match[];
}

export function FilteredStatsProvider({ selectedFilter, children }: FilteredStatsProviderProps) {
  const { stats, tournaments, matches } = useLorcana();
  
  const filteredData = useMemo(() => {
    // Filter data based on selection
    const filteredMatches = matches.filter(match => {
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'freeplay') return true;
      if (selectedFilter === 'infinity') return match.gameFormat === 'Infinity Constructor';
      if (selectedFilter === 'expansiones') return match.gameFormat === 'Estándar';
      return false;
    });
    
    const filteredTournamentMatches = tournaments.flatMap(t => 
      t.matches.filter(match => {
        if (selectedFilter === 'all') return true;
        if (selectedFilter === 'tournament') return true;
        if (selectedFilter === 'infinity') return match.gameFormat === 'Infinity Constructor';
        if (selectedFilter === 'expansiones') return match.gameFormat === 'Estándar';
        return false;
      })
    );
    
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
    
    // Data for the color distribution
    const colorData = Object.entries(colorStats).map(([color, data]) => ({
      name: color,
      total: data.matches,
      victorias: data.victories,
      empates: data.ties,
      derrotas: data.defeats,
      winRate: calculateWinRate(data.victories, data.matches),
    })).filter(item => item.total > 0);
    
    // Calculate tournament data
    const tournamentData = Object.entries(stats.byTournament)
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
        return {
          name: tournament?.name || "Torneo Desconocido",
          total: data.matches,
          victorias: data.victories,
          empates: data.ties,
          derrotas: data.defeats,
          winRate: calculateWinRate(data.victories, data.matches),
        };
      })
      .filter(item => item.total > 0);

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

  return <>{children(filteredData)}</>;
}

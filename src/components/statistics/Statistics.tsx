import { useState } from "react";
import { StatisticCards } from "./StatisticCards";
import { ResultPieChart } from "./ResultPieChart";
import { ColorPerformanceChart } from "./ColorPerformanceChart";
import { TournamentStatsChart } from "./TournamentStatsChart";
import { MatchesList } from "./matches-list";
import { StatisticsFilter, StatsFilter } from "./StatisticsFilter";
import { StatisticsLayout } from "./StatisticsLayout";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { useMatchRecords } from "@/hooks/useMatchRecords";
import { useLorcana } from "@/context/lorcana/LorcanaProvider";
import { useMemo } from "react";
import { calculateWinRate } from "./utils";

export function Statistics() {
  const [selectedFilter, setSelectedFilter] = useState<StatsFilter>('all');
  const { matches: supabaseMatches, loading } = useMatchRecords();
  const { tournaments } = useLorcana();
  
  // Calculate statistics from Supabase matches
  const statsData = useMemo(() => {
    let victories = 0;
    let defeats = 0;
    let ties = 0;
    
    // Filter matches based on selected filter
    const filteredMatches = supabaseMatches.filter(match => {
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'infinity') return match.game_format === 'Infinity Constructor';
      if (selectedFilter === 'expansiones') return match.game_format === 'Estándar';
      return true;
    });
    
    // Count results
    filteredMatches.forEach(match => {
      if (match.result === 'Victoria') victories++;
      else if (match.result === 'Derrota') defeats++;
      else if (match.result === 'Empate') ties++;
    });
    
    const totalMatches = victories + defeats + ties;
    const winRate = calculateWinRate(victories, totalMatches);
    
    // Data for the pie chart
    const resultData = [
      { name: "Victorias", value: victories },
      { name: "Empates", value: ties },
      { name: "Derrotas", value: defeats },
    ];
    
    // Calculate color data
    const colorStats: Record<string, { matches: number, victories: number, ties: number, defeats: number }> = {
      'Ambar': { matches: 0, victories: 0, ties: 0, defeats: 0 },
      'Amatista': { matches: 0, victories: 0, ties: 0, defeats: 0 },
      'Esmeralda': { matches: 0, victories: 0, ties: 0, defeats: 0 },
      'Rubí': { matches: 0, victories: 0, ties: 0, defeats: 0 },
      'Zafiro': { matches: 0, victories: 0, ties: 0, defeats: 0 },
      'Acero': { matches: 0, victories: 0, ties: 0, defeats: 0 }
    };
    
    // Note: Since we don't have user deck colors in match_records, we'll count opponent colors for now
    filteredMatches.forEach(match => {
      match.opponent_deck_colors.forEach(color => {
        if (colorStats[color]) {
          colorStats[color].matches++;
          if (match.result === 'Victoria') colorStats[color].victories++;
          else if (match.result === 'Derrota') colorStats[color].defeats++;
          else if (match.result === 'Empate') colorStats[color].ties++;
        }
      });
    });

    const colorData = Object.entries(colorStats).map(([color, data]) => ({
      name: color,
      total: data.matches,
      victorias: data.victories,
      empates: data.ties,
      derrotas: data.defeats,
      winRate: calculateWinRate(data.victories, data.matches),
    })).filter(item => item.total > 0);
    
    return {
      victories,
      defeats,
      ties,
      totalMatches,
      winRate,
      resultData,
      colorData,
      filteredMatches
    };
  }, [supabaseMatches, selectedFilter]);
  
  if (loading) {
    return (
      <ProtectedRoute>
        <StatisticsLayout
          title="Estadísticas"
          filter={
            <StatisticsFilter 
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          }
        >
          <div className="text-center text-muted-foreground">Cargando estadísticas...</div>
        </StatisticsLayout>
      </ProtectedRoute>
    );
  }
  
  return (
    <ProtectedRoute>
      <StatisticsLayout
        title="Estadísticas"
        filter={
          <StatisticsFilter 
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
        }
      >
        {/* Overall statistics */}
        <StatisticCards
          totalMatches={statsData.totalMatches}
          victories={statsData.victories}
          defeats={statsData.defeats}
          ties={statsData.ties}
          winRate={statsData.winRate}
        />
        
        {statsData.totalMatches > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResultPieChart resultData={statsData.resultData} />
            {statsData.colorData.length > 0 && (
              <ColorPerformanceChart colorData={statsData.colorData} />
            )}
          </div>
        )}
        
        {/* Tournament statistics - keeping from localStorage for now */}
        {tournaments.length > 0 && (
          <TournamentStatsChart 
            tournamentData={tournaments.map(tournament => ({
              name: tournament.name,
              total: tournament.matches.length,
              victorias: tournament.matches.filter(m => m.result === 'Victoria').length,
              empates: tournament.matches.filter(m => m.result === 'Empate').length,
              derrotas: tournament.matches.filter(m => m.result === 'Derrota').length,
              winRate: calculateWinRate(
                tournament.matches.filter(m => m.result === 'Victoria').length,
                tournament.matches.length
              )
            }))}
          />
        )}
        
        {/* All matches list */}
        <MatchesList 
          matches={statsData.filteredMatches.map(match => ({
            id: match.id,
            myDeck: {
              name: 'Mi Mazo',
              colors: ['Ambar'] // Default color since we don't have this data
            },
            opponentDeck: {
              name: match.opponent_deck_name,
              colors: match.opponent_deck_colors
            },
            result: match.result,
            gameFormat: match.game_format,
            matchFormat: match.match_format,
            date: new Date(match.created_at),
            notes: match.notes
          }))}
          tournaments={tournaments} 
        />
      </StatisticsLayout>
    </ProtectedRoute>
  );
}

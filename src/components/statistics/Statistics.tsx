
import { useState } from "react";
import { StatisticCards } from "./StatisticCards";
import { InitialTurnStats } from "./InitialTurnStats";
import { ResultPieChart } from "./ResultPieChart";
import { ColorPerformanceChart } from "./ColorPerformanceChart";
import { TournamentStatsChart } from "./TournamentStatsChart";
import { MatchesList } from "./matches-list";
import { StatisticsFilter, StatsFilter } from "./StatisticsFilter";
import { StatisticsLayout } from "./StatisticsLayout";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { useMatchRecords } from "@/hooks/useMatchRecords";
import { useUserDecks } from "@/hooks/useUserDecks";
import { useLorcana } from "@/context/lorcana/LorcanaProvider";
import { useLanguage } from "@/context/LanguageContext";
import { useMemo } from "react";
import { calculateWinRate } from "./utils";

export function Statistics() {
  const { t } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState<StatsFilter>('all');
  const { matches: supabaseMatches, loading } = useMatchRecords();
  const { decks } = useUserDecks();
  const { tournaments } = useLorcana();
  
  // Local state to track deleted matches for immediate UI updates
  const [deletedMatchIds, setDeletedMatchIds] = useState<Set<string>>(new Set());
  
  // Filter out deleted matches from the local state
  const activeMatches = useMemo(() => {
    return supabaseMatches.filter(match => !deletedMatchIds.has(match.id));
  }, [supabaseMatches, deletedMatchIds]);
  
  // Calculate statistics from active matches INCLUDING tournament matches
  const statsData = useMemo(() => {
    let victories = 0;
    let defeats = 0;
    let ties = 0;
    
    // Filter matches based on selected filter
    const filteredMatches = activeMatches.filter(match => {
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'infinity') return match.game_format === 'Infinity Constructor';
      if (selectedFilter === 'expansiones') return match.game_format === 'Estándar';
      return true;
    });
    
    // Count results from Supabase matches
    filteredMatches.forEach(match => {
      if (match.result === 'Victoria') victories++;
      else if (match.result === 'Derrota') defeats++;
      else if (match.result === 'Empate') ties++;
    });

    // Count results from tournament matches
    tournaments.forEach(tournament => {
      tournament.matches.forEach(match => {
        // Apply the same filter logic
        const passesFilter = selectedFilter === 'all' ? 
          true : 
          selectedFilter === 'infinity' ? 
            match.gameFormat === 'Infinity Constructor' :
            match.gameFormat === 'Estándar';
        
        if (passesFilter) {
          if (match.result === 'Victoria') victories++;
          else if (match.result === 'Derrota') defeats++;
          else if (match.result === 'Empate') ties++;
        }
      });
    });
    
    const totalMatches = victories + defeats + ties;
    const winRate = calculateWinRate(victories, totalMatches);
    
    // Data for the pie chart
    const resultData = [
      { name: t('statistics.charts.victories'), value: victories },
      { name: t('statistics.charts.ties'), value: ties },
      { name: t('statistics.charts.defeats'), value: defeats },
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
    
    // Count our deck colors from Supabase matches
    filteredMatches.forEach(match => {
      const userDeck = match.user_deck_id 
        ? decks.find(deck => deck.id === match.user_deck_id)
        : null;
      
      if (userDeck) {
        userDeck.colors.forEach(color => {
          if (colorStats[color]) {
            colorStats[color].matches++;
            if (match.result === 'Victoria') colorStats[color].victories++;
            else if (match.result === 'Derrota') colorStats[color].defeats++;
            else if (match.result === 'Empate') colorStats[color].ties++;
          }
        });
      }
    });

    // Count our deck colors from tournament matches
    tournaments.forEach(tournament => {
      tournament.matches.forEach(match => {
        const passesFilter = selectedFilter === 'all' ? 
          true : 
          selectedFilter === 'infinity' ? 
            match.gameFormat === 'Infinity Constructor' :
            match.gameFormat === 'Estándar';
        
        if (passesFilter) {
          match.myDeck.colors.forEach(color => {
            if (colorStats[color]) {
              colorStats[color].matches++;
              if (match.result === 'Victoria') colorStats[color].victories++;
              else if (match.result === 'Derrota') colorStats[color].defeats++;
              else if (match.result === 'Empate') colorStats[color].ties++;
            }
          });
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
  }, [activeMatches, selectedFilter, tournaments]);

  // Handle immediate match deletion in UI
  const handleMatchDelete = (matchId: string) => {
    setDeletedMatchIds(prev => new Set([...prev, matchId]));
  };
  
  if (loading) {
    return (
      <ProtectedRoute>
        <StatisticsLayout
          title={t('statistics.title')}
          filter={
            <StatisticsFilter 
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          }
        >
          <div className="text-center text-muted-foreground">{t('statistics.loading')}</div>
        </StatisticsLayout>
      </ProtectedRoute>
    );
  }
  
  return (
    <ProtectedRoute>
      <StatisticsLayout
        title={t('statistics.title')}
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
        
        {/* Initial Turn Statistics */}
        {statsData.totalMatches > 0 && (
          <InitialTurnStats 
            matches={statsData.filteredMatches} 
            tournaments={tournaments}
            selectedFilter={selectedFilter}
          />
        )}
        
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
          matches={statsData.filteredMatches.map(match => {
            // Find the user deck to get the correct colors
            const userDeck = match.user_deck_id 
              ? decks.find(deck => deck.id === match.user_deck_id)
              : null;
            
            return {
              id: match.id,
              myDeck: {
                name: userDeck?.name || t('match.my_deck'),
                colors: userDeck?.colors || ['Ambar'] // Use actual deck colors or default
              },
              opponentDeck: {
                name: match.opponent_deck_name,
                colors: match.opponent_deck_colors
              },
              result: match.result,
              gameFormat: match.game_format,
              matchFormat: match.match_format,
              initialTurn: match.initial_turn || 'OTP',
              date: new Date(match.created_at),
              notes: match.notes
            };
          })}
          tournaments={tournaments}
          onMatchDelete={handleMatchDelete}
        />
      </StatisticsLayout>
    </ProtectedRoute>
  );
}


import { useMemo } from 'react';
import { useDeckStatistics } from './useDeckStatistics';
import { useMatchRecords } from './useMatchRecords';

export function useCombinedStats() {
  const { statistics: deckStats, loading: deckStatsLoading } = useDeckStatistics();
  const { matches: matchRecords, loading: matchRecordsLoading } = useMatchRecords();

  const combinedStats = useMemo(() => {
    // Calcular estadísticas de partidas individuales
    const matchStats = {
      victories: matchRecords.filter(m => m.result === 'Victoria').length,
      defeats: matchRecords.filter(m => m.result === 'Derrota').length,
      ties: matchRecords.filter(m => m.result === 'Empate').length,
    };

    // Calcular estadísticas agregadas de mazos
    const deckAggregatedStats = deckStats.reduce(
      (acc, stat) => ({
        victories: acc.victories + (stat.victories || 0),
        defeats: acc.defeats + (stat.defeats || 0),
        ties: acc.ties + (stat.ties || 0),
        totalMatches: acc.totalMatches + (stat.total_matches || 0),
      }),
      { victories: 0, defeats: 0, ties: 0, totalMatches: 0 }
    );

    // Combinar ambas fuentes
    const totalVictories = matchStats.victories + deckAggregatedStats.victories;
    const totalDefeats = matchStats.defeats + deckAggregatedStats.defeats;
    const totalTies = matchStats.ties + deckAggregatedStats.ties;
    const totalMatches = totalVictories + totalDefeats + totalTies;

    const winRate = totalMatches > 0 ? (totalVictories / totalMatches) * 100 : 0;

    return {
      victories: totalVictories,
      defeats: totalDefeats,
      ties: totalTies,
      totalMatches,
      winRate: Math.round(winRate * 100) / 100,
      deckStats,
      matchRecords,
    };
  }, [deckStats, matchRecords]);

  const loading = deckStatsLoading || matchRecordsLoading;

  console.log('Estadísticas combinadas:', combinedStats);

  return {
    ...combinedStats,
    loading,
  };
}

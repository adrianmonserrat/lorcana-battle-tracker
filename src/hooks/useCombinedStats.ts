
import { useMemo } from 'react';
import { useMatchRecords } from './useMatchRecords';

export function useCombinedStats() {
  const { matches: matchRecords, loading: matchRecordsLoading } = useMatchRecords();

  const combinedStats = useMemo(() => {
    // Calcular estadísticas de partidas individuales solamente
    const matchStats = {
      victories: matchRecords.filter(m => m.result === 'Victoria').length,
      defeats: matchRecords.filter(m => m.result === 'Derrota').length,
      ties: matchRecords.filter(m => m.result === 'Empate').length,
    };

    const totalMatches = matchStats.victories + matchStats.defeats + matchStats.ties;
    const winRate = totalMatches > 0 ? (matchStats.victories / totalMatches) * 100 : 0;

    return {
      victories: matchStats.victories,
      defeats: matchStats.defeats,
      ties: matchStats.ties,
      totalMatches,
      winRate: Math.round(winRate * 100) / 100,
      matchRecords,
    };
  }, [matchRecords]);

  const loading = matchRecordsLoading;

  console.log('Estadísticas combinadas:', combinedStats);

  return {
    ...combinedStats,
    loading,
  };
}

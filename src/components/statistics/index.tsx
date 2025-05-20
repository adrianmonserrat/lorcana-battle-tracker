
import { useLorcana } from "@/context/LorcanaContext";
import { StatisticCards } from "./StatisticCards";
import { ResultPieChart } from "./ResultPieChart";
import { ColorPerformanceChart } from "./ColorPerformanceChart";
import { TournamentStatsChart } from "./TournamentStatsChart";
import { MatchesList } from "./MatchesList";
import { calculateWinRate } from "./utils";

export function Statistics() {
  const { stats, tournaments, matches } = useLorcana();
  
  const winRate = calculateWinRate(stats.total.victories, stats.total.matches);
  
  // Data for the pie chart
  const resultData = [
    { name: "Victorias", value: stats.total.victories },
    { name: "Derrotas", value: stats.total.defeats },
  ];
  
  // Data for the color distribution
  const colorData = Object.entries(stats.byColor).map(([color, data]) => ({
    name: color,
    total: data.matches,
    victorias: data.victories,
    derrotas: data.defeats,
    winRate: calculateWinRate(data.victories, data.matches),
  })).filter(item => item.total > 0);
  
  // Data for tournament stats
  const tournamentData = Object.entries(stats.byTournament).map(([id, data]) => {
    const tournament = tournaments.find(t => t.id === id);
    return {
      name: tournament?.name || "Torneo Desconocido",
      total: data.matches,
      victorias: data.victories,
      derrotas: data.defeats,
      winRate: calculateWinRate(data.victories, data.matches),
    };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Estadísticas</h1>
      
      {/* Overall statistics */}
      <StatisticCards
        totalMatches={stats.total.matches}
        victories={stats.total.victories}
        defeats={stats.total.defeats}
        winRate={winRate}
      />
      
      {stats.total.matches > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResultPieChart resultData={resultData} />
          <ColorPerformanceChart colorData={colorData} />
        </div>
      )}
      
      {/* Tournament statistics */}
      {tournamentData.length > 0 && (
        <TournamentStatsChart tournamentData={tournamentData} />
      )}
      
      {/* All matches list */}
      <MatchesList matches={matches} tournaments={tournaments} />
    </div>
  );
}

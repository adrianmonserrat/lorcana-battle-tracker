
import { useLorcana } from "@/context/LorcanaContext";
import { useState } from "react";
import { StatisticCards } from "./StatisticCards";
import { ResultPieChart } from "./ResultPieChart";
import { ColorPerformanceChart } from "./ColorPerformanceChart";
import { TournamentStatsChart } from "./TournamentStatsChart";
import { MatchesList } from "./MatchesList";
import { calculateWinRate } from "./utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

type StatsFilter = 'all' | 'freeplay' | 'tournament' | 'infinity' | 'expansiones';

export function Statistics() {
  const { stats, tournaments, matches } = useLorcana();
  const [selectedFilter, setSelectedFilter] = useState<StatsFilter>('all');
  
  // Filter data based on selection
  const filteredMatches = matches.filter(match => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'freeplay') return true;
    if (selectedFilter === 'infinity') return match.gameFormat === 'Infinity Constructor';
    if (selectedFilter === 'expansiones') return match.gameFormat === 'Nuevas Expansiones';
    return false;
  });
  
  const filteredTournamentMatches = tournaments.flatMap(t => 
    t.matches.filter(match => {
      if (selectedFilter === 'all') return true;
      if (selectedFilter === 'tournament') return true;
      if (selectedFilter === 'infinity') return match.gameFormat === 'Infinity Constructor';
      if (selectedFilter === 'expansiones') return match.gameFormat === 'Nuevas Expansiones';
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
        if (selectedFilter === 'expansiones') return match.gameFormat === 'Nuevas Expansiones';
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
            (selectedFilter === 'expansiones' && match.gameFormat === 'Nuevas Expansiones');
          
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Estadísticas</h1>
      
      <Card>
        <CardContent className="pt-6">
          <Select value={selectedFilter} onValueChange={(value) => setSelectedFilter(value as StatsFilter)}>
            <SelectTrigger className="w-full sm:w-[280px] mx-auto">
              <SelectValue placeholder="Filtrar estadísticas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las partidas</SelectItem>
              <SelectItem value="freeplay">Solo partidas libres</SelectItem>
              <SelectItem value="tournament">Solo partidas de torneo</SelectItem>
              <SelectItem value="infinity">Solo formato Infinity Constructor</SelectItem>
              <SelectItem value="expansiones">Solo formato Nuevas Expansiones</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      {/* Overall statistics */}
      <StatisticCards
        totalMatches={totalMatches}
        victories={victories}
        defeats={defeats}
        ties={ties}
        winRate={winRate}
      />
      
      {totalMatches > 0 && (
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
      <MatchesList 
        matches={selectedFilter === 'tournament' ? [] : filteredMatches}
        tournaments={tournaments} 
      />
    </div>
  );
}

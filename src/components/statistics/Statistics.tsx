
import { useState } from "react";
import { useLorcana } from "@/context/lorcana/LorcanaProvider";
import { StatisticCards } from "./StatisticCards";
import { ResultPieChart } from "./ResultPieChart";
import { ColorPerformanceChart } from "./ColorPerformanceChart";
import { TournamentStatsChart } from "./TournamentStatsChart";
import { MatchesList } from "./matches-list";
import { StatisticsFilter, StatsFilter } from "./StatisticsFilter";
import { FilteredStatsProvider } from "./FilteredStatsProvider";
import { StatisticsLayout } from "./StatisticsLayout";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { DeckStatistics } from "../decks/DeckStatistics";
import { useCombinedStats } from "@/hooks/useCombinedStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Statistics() {
  const [selectedFilter, setSelectedFilter] = useState<StatsFilter>('all');
  const { tournaments } = useLorcana();
  const combinedStats = useCombinedStats();
  
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
        {/* Estadísticas combinadas generales */}
        <FilteredStatsProvider selectedFilter={selectedFilter}>
          {({ victories, defeats, ties, totalMatches, winRate, resultData, colorData, tournamentData, filteredMatches }) => (
            <>
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
                matches={filteredMatches}
                tournaments={tournaments} 
              />
            </>
          )}
        </FilteredStatsProvider>

        {/* Estadísticas detalladas de mazos */}
        {combinedStats.deckStats.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Estadísticas Detalladas por Mazo</CardTitle>
            </CardHeader>
            <CardContent>
              <DeckStatistics />
            </CardContent>
          </Card>
        )}
      </StatisticsLayout>
    </ProtectedRoute>
  );
}

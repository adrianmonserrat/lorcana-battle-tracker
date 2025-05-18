
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DecksList } from "../deck-management/DecksList";

export function Statistics() {
  const [selectedFilter, setSelectedFilter] = useState<StatsFilter>('all');
  const [activeTab, setActiveTab] = useState<string>("stats");
  const { tournaments } = useLorcana();
  
  return (
    <Tabs defaultValue="stats" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        <TabsTrigger value="decks">Mis Mazos</TabsTrigger>
      </TabsList>
      
      <TabsContent value="stats">
        <StatisticsLayout
          title="Estadísticas"
          filter={
            <StatisticsFilter 
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          }
        >
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
        </StatisticsLayout>
      </TabsContent>
      
      <TabsContent value="decks">
        <div className="container max-w-6xl mx-auto">
          <DecksList />
        </div>
      </TabsContent>
    </Tabs>
  );
}

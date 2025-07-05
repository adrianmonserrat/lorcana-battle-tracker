
import { useState } from "react";
import { StatisticsLayout } from "./StatisticsLayout";
import { StatisticsContent } from "./StatisticsContent";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { StatsFilter } from "./types";

export function Statistics() {
  const [selectedFilter, setSelectedFilter] = useState<StatsFilter>('all');
  
  return (
    <ProtectedRoute>
      <StatisticsLayout 
        title="Estadísticas"
        filter={<div />}
      >
        <StatisticsContent 
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />
      </StatisticsLayout>
    </ProtectedRoute>
  );
}

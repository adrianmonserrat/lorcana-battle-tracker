
import { ReactNode } from "react";
import { StatsFilter } from "./types";
import { useFilteredStats } from "./useFilteredStats";

interface FilteredStatsProviderProps {
  selectedFilter: StatsFilter;
  children: (data: ReturnType<typeof useFilteredStats>) => ReactNode;
}

export function FilteredStatsProvider({ selectedFilter, children }: FilteredStatsProviderProps) {
  const filteredData = useFilteredStats(selectedFilter);
  return <>{children(filteredData)}</>;
}

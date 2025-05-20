
import { Match, Tournament } from "@/types";

export type StatsFilter = 'all' | 'freeplay' | 'tournament' | 'infinity' | 'expansiones';

export interface FilteredStatsData {
  victories: number;
  defeats: number;
  ties: number;
  totalMatches: number;
  winRate: number;
  resultData: Array<{ name: string; value: number }>;
  colorData: Array<{
    name: string;
    total: number;
    victorias: number;
    empates: number;
    derrotas: number;
    winRate: number;
  }>;
  tournamentData: Array<{
    name: string;
    total: number;
    victorias: number;
    empates: number;
    derrotas: number;
    winRate: number;
  }>;
  filteredMatches: Match[];
}

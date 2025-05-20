
import { Match, Tournament } from "@/types";

export interface EnhancedMatch extends Match {
  tournamentName?: string;
}

export interface MatchesListProps {
  matches: Match[];
  tournaments: Tournament[];
}

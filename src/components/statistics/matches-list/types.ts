
import { Tournament, Match, InkColor, GameFormat, MatchFormat, MatchResult } from "@/types";

export interface EnhancedMatch extends Omit<Match, 'myDeck' | 'opponentDeck'> {
  myDeck: {
    name: string;
    colors: InkColor[];
  };
  opponentDeck: {
    name: string;
    colors: InkColor[];
  };
  detailedResult?: MatchResult;
  tournamentName?: string;
}

export interface MatchesListProps {
  matches: EnhancedMatch[];
  tournaments: Tournament[];
  onMatchDelete?: (matchId: string) => void;
}

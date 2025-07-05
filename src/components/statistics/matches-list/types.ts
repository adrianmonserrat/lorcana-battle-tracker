
import { Tournament, Match, InkColor, GameFormat, MatchFormat } from "@/types";

export interface EnhancedMatch extends Omit<Match, 'myDeck' | 'opponentDeck'> {
  myDeck: {
    name: string;
    colors: InkColor[];
  };
  opponentDeck: {
    name: string;
    colors: InkColor[];
  };
  tournamentName?: string;
}

export interface MatchesListProps {
  matches: EnhancedMatch[];
  tournaments: Tournament[];
  onMatchDelete?: (matchId: string) => void;
}

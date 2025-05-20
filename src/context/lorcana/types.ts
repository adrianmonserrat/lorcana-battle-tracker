
import { Match, Tournament, Stats, SavedDeck } from "@/types";

export interface LorcanaContextType {
  matches: Match[];
  tournaments: Tournament[];
  stats: Stats;
  decks: SavedDeck[];
  addMatch: (match: Omit<Match, "id" | "date">) => void;
  addTournament: (tournament: Omit<Tournament, "id" | "date" | "matches">) => void;
  addTournamentMatch: (tournamentId: string, match: Omit<Match, "id" | "date" | "tournamentId">) => void;
  deleteMatch: (matchId: string, tournamentId?: string) => void;
  deleteTournament: (tournamentId: string) => void;
  addDeck: (deck: Omit<SavedDeck, "id">) => void;
  updateDeck: (id: string, deck: Omit<SavedDeck, "id">) => void;
  deleteDeck: (id: string) => void;
  setTournamentDeck: (tournamentId: string, deckId: string | undefined) => void;
}

export const defaultStats: Stats = {
  total: { matches: 0, victories: 0, defeats: 0, ties: 0 },
  byColor: {
    'Ambar': { matches: 0, victories: 0, defeats: 0, ties: 0 },
    'Amatista': { matches: 0, victories: 0, defeats: 0, ties: 0 },
    'Esmeralda': { matches: 0, victories: 0, defeats: 0, ties: 0 },
    'Rubí': { matches: 0, victories: 0, defeats: 0, ties: 0 },
    'Zafiro': { matches: 0, victories: 0, defeats: 0, ties: 0 },
    'Acero': { matches: 0, victories: 0, defeats: 0, ties: 0 }
  },
  byTournament: {}
};

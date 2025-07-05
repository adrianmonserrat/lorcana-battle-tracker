
export type InkColor = 'Ambar' | 'Amatista' | 'Esmeralda' | 'Rubí' | 'Zafiro' | 'Acero';

export type GameFormat = 'Infinity Constructor' | 'Estándar';
export type MatchFormat = 'BO1' | 'BO2' | 'BO3' | 'BO5';
export type MatchResult = '2-0' | '2-1' | '1-2' | '0-2' | 'Empate';

export interface Deck {
  name: string;
  colors: InkColor[];
}

export interface Match {
  id: string;
  date: Date;
  gameFormat: GameFormat;
  matchFormat: MatchFormat;
  myDeck: Deck;
  opponentDeck: Deck;
  result: 'Victoria' | 'Derrota' | 'Empate';
  detailedResult?: MatchResult;
  notes?: string;
  tournamentId?: string;
}

export interface Tournament {
  id: string;
  name: string;
  date: Date;
  location?: string;
  totalMatches: number; // Número total de partidas planificadas
  defaultDeck?: Deck; // Mazo por defecto para el torneo
  matches: Match[];
}

export interface Stats {
  total: {
    matches: number;
    victories: number;
    defeats: number;
    ties: number;
  };
  byColor: Record<InkColor, {
    matches: number;
    victories: number;
    defeats: number;
    ties: number;
  }>;
  byTournament: Record<string, {
    matches: number;
    victories: number;
    defeats: defeats;
    ties: number;
  }>;
}

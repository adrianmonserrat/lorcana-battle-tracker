import { Match, Tournament, Stats, SavedDeck } from "@/types";
import { defaultStats } from "./types";

export const calculateStats = (matches: Match[], tournaments: Tournament[]): Stats => {
  const newStats = { 
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
  
  // Process regular matches
  matches.forEach(match => {
    newStats.total.matches++;
    
    if (match.result === 'Victoria') {
      newStats.total.victories++;
    } else if (match.result === 'Derrota') {
      newStats.total.defeats++;
    } else if (match.result === 'Empate') {
      newStats.total.ties++;
    }
    
    // Update color stats
    match.myDeck.colors.forEach(color => {
      newStats.byColor[color].matches++;
      if (match.result === 'Victoria') {
        newStats.byColor[color].victories++;
      } else if (match.result === 'Derrota') {
        newStats.byColor[color].defeats++;
      } else if (match.result === 'Empate') {
        newStats.byColor[color].ties++;
      }
    });
  });
  
  // Process tournament matches
  tournaments.forEach(tournament => {
    if (!newStats.byTournament[tournament.id]) {
      newStats.byTournament[tournament.id] = {
        matches: 0, victories: 0, defeats: 0, ties: 0
      };
    }
    
    tournament.matches.forEach(match => {
      newStats.total.matches++;
      newStats.byTournament[tournament.id].matches++;
      
      if (match.result === 'Victoria') {
        newStats.total.victories++;
        newStats.byTournament[tournament.id].victories++;
      } else if (match.result === 'Derrota') {
        newStats.total.defeats++;
        newStats.byTournament[tournament.id].defeats++;
      } else if (match.result === 'Empate') {
        newStats.total.ties++;
        newStats.byTournament[tournament.id].ties++;
      }
      
      // Update color stats for tournament matches too
      match.myDeck.colors.forEach(color => {
        newStats.byColor[color].matches++;
        if (match.result === 'Victoria') {
          newStats.byColor[color].victories++;
        } else if (match.result === 'Derrota') {
          newStats.byColor[color].defeats++;
        } else if (match.result === 'Empate') {
          newStats.byColor[color].ties++;
        }
      });
    });
  });
  
  return newStats;
};

export const loadDataFromLocalStorage = () => {
  try {
    const matches = JSON.parse(localStorage.getItem('lorcana-matches') || '[]');
    const tournaments = JSON.parse(localStorage.getItem('lorcana-tournaments') || '[]');
    const decks = JSON.parse(localStorage.getItem('lorcana-decks') || '[]');
    
    // Ensure dates are parsed correctly
    matches.forEach((match: any) => {
      match.date = new Date(match.date);
    });
    
    tournaments.forEach((tournament: any) => {
      tournament.date = new Date(tournament.date);
      tournament.matches.forEach((match: any) => {
        match.date = new Date(match.date);
      });
    });
    
    return { matches, tournaments, decks };
  } catch (e) {
    console.error('Error parsing data from localStorage:', e);
    return { matches: [], tournaments: [], decks: [] };
  }
};

export const saveDataToLocalStorage = (
  matches: Match[], 
  tournaments: Tournament[],
  decks: SavedDeck[]
): boolean => {
  try {
    localStorage.setItem('lorcana-matches', JSON.stringify(matches));
    localStorage.setItem('lorcana-tournaments', JSON.stringify(tournaments));
    localStorage.setItem('lorcana-decks', JSON.stringify(decks));
    return true;
  } catch (e) {
    console.error('Error saving data to localStorage:', e);
    return false;
  }
};

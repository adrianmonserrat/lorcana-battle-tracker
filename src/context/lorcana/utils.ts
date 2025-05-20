
import { Match, Tournament, Stats } from "@/types";
import { defaultStats } from "./types";

export function calculateStats(matches: Match[], tournaments: Tournament[]): Stats {
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
}

export function loadDataFromLocalStorage() {
  try {
    const savedMatches = localStorage.getItem('lorcana-matches');
    const savedTournaments = localStorage.getItem('lorcana-tournaments');
    
    let matches: Match[] = [];
    let tournaments: Tournament[] = [];
    
    if (savedMatches) {
      const parsedMatches = JSON.parse(savedMatches);
      // Convert string dates back to Date objects
      matches = parsedMatches.map((match: any) => ({
        ...match,
        date: new Date(match.date)
      }));
    }
    
    if (savedTournaments) {
      const parsedTournaments = JSON.parse(savedTournaments);
      // Convert string dates back to Date objects
      tournaments = parsedTournaments.map((tournament: any) => ({
        ...tournament,
        date: new Date(tournament.date),
        matches: tournament.matches.map((match: any) => ({
          ...match,
          date: new Date(match.date)
        }))
      }));
    }

    return { matches, tournaments };
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return { matches: [], tournaments: [] };
  }
}

export function saveDataToLocalStorage(matches: Match[], tournaments: Tournament[]) {
  try {
    localStorage.setItem('lorcana-matches', JSON.stringify(matches));
    localStorage.setItem('lorcana-tournaments', JSON.stringify(tournaments));
    return true;
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
    return false;
  }
}

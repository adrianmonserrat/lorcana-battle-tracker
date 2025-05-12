
import React, { createContext, useContext, useEffect, useState } from "react";
import { Match, Tournament, Stats, InkColor } from "@/types";
import { toast } from "sonner";

interface LorcanaContextType {
  matches: Match[];
  tournaments: Tournament[];
  stats: Stats;
  addMatch: (match: Omit<Match, "id" | "date">) => void;
  addTournament: (tournament: Omit<Tournament, "id" | "date" | "matches">) => void;
  addTournamentMatch: (tournamentId: string, match: Omit<Match, "id" | "date" | "tournamentId">) => void;
}

const defaultStats: Stats = {
  total: { matches: 0, victories: 0, defeats: 0 },
  byColor: {
    'Ambar': { matches: 0, victories: 0, defeats: 0 },
    'Amatista': { matches: 0, victories: 0, defeats: 0 },
    'Esmeralda': { matches: 0, victories: 0, defeats: 0 },
    'Rubí': { matches: 0, victories: 0, defeats: 0 },
    'Zafiro': { matches: 0, victories: 0, defeats: 0 },
    'Acero': { matches: 0, victories: 0, defeats: 0 }
  },
  byTournament: {}
};

const LorcanaContext = createContext<LorcanaContextType | undefined>(undefined);

export const LorcanaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [stats, setStats] = useState<Stats>(defaultStats);

  // Load data from localStorage on initial load
  useEffect(() => {
    try {
      const savedMatches = localStorage.getItem('lorcana-matches');
      const savedTournaments = localStorage.getItem('lorcana-tournaments');
      
      if (savedMatches) {
        const parsedMatches = JSON.parse(savedMatches);
        // Convert string dates back to Date objects
        parsedMatches.forEach((match: any) => {
          match.date = new Date(match.date);
        });
        setMatches(parsedMatches);
      }
      
      if (savedTournaments) {
        const parsedTournaments = JSON.parse(savedTournaments);
        // Convert string dates back to Date objects
        parsedTournaments.forEach((tournament: any) => {
          tournament.date = new Date(tournament.date);
          tournament.matches.forEach((match: any) => {
            match.date = new Date(match.date);
          });
        });
        setTournaments(parsedTournaments);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      toast.error('Error al cargar los datos guardados');
    }
  }, []);

  // Update stats whenever matches or tournaments change
  useEffect(() => {
    const newStats = { ...defaultStats };
    
    // Process regular matches
    matches.forEach(match => {
      newStats.total.matches++;
      if (match.result === 'Victoria') {
        newStats.total.victories++;
      } else {
        newStats.total.defeats++;
      }
      
      // Update color stats
      match.myDeck.colors.forEach(color => {
        newStats.byColor[color].matches++;
        if (match.result === 'Victoria') {
          newStats.byColor[color].victories++;
        } else {
          newStats.byColor[color].defeats++;
        }
      });
    });
    
    // Process tournament matches
    tournaments.forEach(tournament => {
      if (!newStats.byTournament[tournament.id]) {
        newStats.byTournament[tournament.id] = {
          matches: 0, victories: 0, defeats: 0
        };
      }
      
      tournament.matches.forEach(match => {
        newStats.total.matches++;
        newStats.byTournament[tournament.id].matches++;
        
        if (match.result === 'Victoria') {
          newStats.total.victories++;
          newStats.byTournament[tournament.id].victories++;
        } else {
          newStats.total.defeats++;
          newStats.byTournament[tournament.id].defeats++;
        }
        
        // Update color stats for tournament matches too
        match.myDeck.colors.forEach(color => {
          newStats.byColor[color].matches++;
          if (match.result === 'Victoria') {
            newStats.byColor[color].victories++;
          } else {
            newStats.byColor[color].defeats++;
          }
        });
      });
    });
    
    setStats(newStats);
    
    // Save to localStorage
    localStorage.setItem('lorcana-matches', JSON.stringify(matches));
    localStorage.setItem('lorcana-tournaments', JSON.stringify(tournaments));
  }, [matches, tournaments]);

  const addMatch = (matchData: Omit<Match, "id" | "date">) => {
    const newMatch: Match = {
      ...matchData,
      id: crypto.randomUUID(),
      date: new Date()
    };
    
    setMatches(prev => [...prev, newMatch]);
    toast.success('Partida registrada correctamente');
  };

  const addTournament = (tournamentData: Omit<Tournament, "id" | "date" | "matches">) => {
    const newTournament: Tournament = {
      ...tournamentData,
      id: crypto.randomUUID(),
      date: new Date(),
      matches: []
    };
    
    setTournaments(prev => [...prev, newTournament]);
    toast.success('Torneo creado correctamente');
  };

  const addTournamentMatch = (tournamentId: string, matchData: Omit<Match, "id" | "date" | "tournamentId">) => {
    const newMatch: Match = {
      ...matchData,
      id: crypto.randomUUID(),
      date: new Date(),
      tournamentId
    };
    
    setTournaments(prev => 
      prev.map(tournament => 
        tournament.id === tournamentId 
          ? { ...tournament, matches: [...tournament.matches, newMatch] } 
          : tournament
      )
    );
    
    toast.success('Partida de torneo registrada correctamente');
  };

  return (
    <LorcanaContext.Provider value={{
      matches,
      tournaments,
      stats,
      addMatch,
      addTournament,
      addTournamentMatch
    }}>
      {children}
    </LorcanaContext.Provider>
  );
};

export const useLorcana = () => {
  const context = useContext(LorcanaContext);
  if (context === undefined) {
    throw new Error('useLorcana must be used within a LorcanaProvider');
  }
  return context;
};

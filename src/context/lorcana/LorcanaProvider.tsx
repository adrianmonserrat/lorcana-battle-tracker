
import React, { createContext, useContext, useEffect, useState } from "react";
import { Match, Tournament, Stats } from "@/types";
import { toast } from "sonner";
import { LorcanaContextType, defaultStats } from "./types";
import { calculateStats, loadDataFromLocalStorage, saveDataToLocalStorage } from "./utils";

const LorcanaContext = createContext<LorcanaContextType | undefined>(undefined);

export const LorcanaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [stats, setStats] = useState<Stats>(defaultStats);

  // Load data from localStorage on initial load
  useEffect(() => {
    try {
      const { matches: loadedMatches, tournaments: loadedTournaments } = loadDataFromLocalStorage();
      setMatches(loadedMatches);
      setTournaments(loadedTournaments);
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      toast.error('Error al cargar los datos guardados');
    }
  }, []);

  // Update stats whenever matches or tournaments change
  useEffect(() => {
    const newStats = calculateStats(matches, tournaments);
    setStats(newStats);
    
    // Save to localStorage
    const saved = saveDataToLocalStorage(matches, tournaments);
    if (!saved) {
      toast.error('Error al guardar los datos');
    }
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

  const deleteMatch = (matchId: string, tournamentId?: string) => {
    if (tournamentId) {
      // Delete match from tournament
      setTournaments(prev => 
        prev.map(tournament => 
          tournament.id === tournamentId 
            ? { ...tournament, matches: tournament.matches.filter(match => match.id !== matchId) } 
            : tournament
        )
      );
    } else {
      // Delete regular match
      setMatches(prev => prev.filter(match => match.id !== matchId));
    }
    
    toast.success('Partida eliminada correctamente');
  };

  return (
    <LorcanaContext.Provider value={{
      matches,
      tournaments,
      stats,
      addMatch,
      addTournament,
      addTournamentMatch,
      deleteMatch
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


import { useState, useEffect } from 'react';
import { useLorcana } from '@/context/LorcanaContext';
import { InkColor, GameFormat, MatchFormat } from '@/types';
import { toast } from "sonner";

interface UseMatchFormProps {
  tournamentId?: string;
  onSuccess?: () => void;
}

export function useMatchForm({ tournamentId, onSuccess }: UseMatchFormProps) {
  const { addMatch, addTournamentMatch, tournaments, decks } = useLorcana();
  
  const tournament = tournamentId ? tournaments.find(t => t.id === tournamentId) : undefined;
  const tournamentDeck = tournament?.selectedDeckId 
    ? decks.find(d => d.id === tournament.selectedDeckId) 
    : undefined;
  
  const [gameFormat, setGameFormat] = useState<GameFormat>(tournamentDeck?.format || 'Infinity Constructor');
  const [matchFormat, setMatchFormat] = useState<MatchFormat>('BO3');
  const [myDeckName, setMyDeckName] = useState(tournamentDeck?.name || '');
  const [opponentDeckName, setOpponentDeckName] = useState('');
  const [myColors, setMyColors] = useState<InkColor[]>(tournamentDeck?.colors || []);
  const [opponentColors, setOpponentColors] = useState<InkColor[]>([]);
  const [result, setResult] = useState<'Victoria' | 'Derrota' | 'Empate' | ''>('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrar decks por formato
  const filteredDecks = decks.filter(d => d.format === gameFormat);

  // Reset the result if changing from BO2 to another format and result is 'Empate'
  useEffect(() => {
    if (matchFormat !== 'BO2' && result === 'Empate') {
      setResult('');
    }
  }, [matchFormat, result]);

  // Update myDeckName and myColors when tournament deck changes
  useEffect(() => {
    if (tournamentDeck) {
      setMyDeckName(tournamentDeck.name);
      setMyColors(tournamentDeck.colors);
      setGameFormat(tournamentDeck.format);
    }
  }, [tournamentDeck]);

  const handleMyColorToggle = (color: InkColor) => {
    setMyColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color) 
        : [...prev, color]
    );
  };

  const handleOpponentColorToggle = (color: InkColor) => {
    setOpponentColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color) 
        : [...prev, color]
    );
  };

  const resetForm = () => {
    if (!tournamentDeck) {
      setGameFormat('Infinity Constructor');
      setMyDeckName('');
      setMyColors([]);
    }
    
    setMatchFormat('BO3');
    setOpponentDeckName('');
    setOpponentColors([]);
    setResult('');
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (myColors.length === 0 || opponentColors.length === 0) {
      toast.error('Por favor selecciona colores para ambos mazos');
      return;
    }
    
    if (!result) {
      toast.error('Por favor selecciona un resultado');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const matchData = {
        gameFormat,
        matchFormat,
        myDeck: {
          name: myDeckName.trim() || 'Sin nombre',
          colors: myColors
        },
        opponentDeck: {
          name: opponentDeckName.trim() || 'Sin nombre',
          colors: opponentColors
        },
        result,
        notes: notes.trim() || undefined
      };
      
      if (tournamentId) {
        addTournamentMatch(tournamentId, matchData);
      } else {
        addMatch(matchData);
      }
      
      resetForm();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error al guardar la partida:', error);
      toast.error('Ocurrió un error al guardar la partida');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    gameFormat,
    setGameFormat,
    matchFormat,
    setMatchFormat,
    myDeckName,
    setMyDeckName,
    opponentDeckName,
    setOpponentDeckName,
    myColors,
    setMyColors,
    opponentColors,
    setOpponentColors,
    handleMyColorToggle,
    handleOpponentColorToggle,
    result,
    setResult,
    notes,
    setNotes,
    isSubmitting,
    setIsSubmitting,
    handleSubmit,
    resetForm,
    tournament,
    tournamentDeck,
    filteredDecks
  };
}

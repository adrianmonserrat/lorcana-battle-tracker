import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLorcana } from '@/context/LorcanaContext';
import { InkColor, GameFormat, MatchFormat } from '@/types';
import { GameFormatSelector } from './game-format-selector';
import { ColorSelector } from './color-selector';
import { DeckInput } from './deck-input';
import { MatchFormatSelector } from './match-format-selector';
import { ResultSelector } from './result-selector';
import { NotesInput } from './notes-input';
import { toast } from "sonner";

interface MatchFormProps {
  tournamentId?: string;
  onSuccess?: () => void;
}

export function MatchForm({ tournamentId, onSuccess }: MatchFormProps) {
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
    
    if (myColors.length === 0 || opponentColors.length === 0 || !result) {
      toast.error('Por favor selecciona colores y resultado');
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

  return (
    <Card className="w-full max-w-3xl mx-auto mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {tournamentId ? 'Registrar Partida de Torneo' : 'Registrar Nueva Partida'}
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Game Format */}
          <GameFormatSelector 
            value={gameFormat}
            onChange={setGameFormat}
            disabled={isSubmitting || !!tournamentDeck}
          />

          {/* My Deck Colors */}
          {!tournamentDeck && (
            <ColorSelector
              selectedColors={myColors}
              onColorToggle={handleMyColorToggle}
              label="Mis Colores"
              id="my"
              disabled={isSubmitting}
            />
          )}
          
          {/* My Deck Name */}
          <DeckInput
            id="myDeckName"
            label="Nombre de Mi Mazo"
            value={myDeckName}
            onChange={setMyDeckName}
            onColorSelect={setMyColors}
            placeholder="Ej: Control Ambar/Amatista"
            disabled={isSubmitting || !!tournamentDeck}
            decks={filteredDecks}
            allowSelectDeck={!tournamentDeck}
          />
          
          {/* Opponent Deck Colors */}
          <ColorSelector
            selectedColors={opponentColors}
            onColorToggle={handleOpponentColorToggle}
            label="Colores del Oponente"
            id="opp"
            disabled={isSubmitting}
          />
          
          {/* Opponent Deck Name */}
          <DeckInput
            id="opponentDeckName"
            label="Nombre del Mazo Oponente (opcional)"
            value={opponentDeckName}
            onChange={setOpponentDeckName}
            placeholder="Ej: Aggro Rubí/Esmeralda"
            disabled={isSubmitting}
          />
          
          {/* Match Format */}
          <MatchFormatSelector
            value={matchFormat}
            onChange={setMatchFormat}
            disabled={isSubmitting}
          />
          
          {/* Result */}
          <ResultSelector
            value={result}
            onChange={setResult}
            disabled={isSubmitting}
            matchFormat={matchFormat}
          />
          
          {/* Notes */}
          <NotesInput
            value={notes}
            onChange={setNotes}
            disabled={isSubmitting}
          />
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Partida'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

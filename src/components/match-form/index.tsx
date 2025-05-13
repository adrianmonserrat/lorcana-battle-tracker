
import { useState } from 'react';
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

interface MatchFormProps {
  tournamentId?: string;
  onSuccess?: () => void;
}

export function MatchForm({ tournamentId, onSuccess }: MatchFormProps) {
  const { addMatch, addTournamentMatch } = useLorcana();
  
  const [gameFormat, setGameFormat] = useState<GameFormat>('Infinity Constructor');
  const [matchFormat, setMatchFormat] = useState<MatchFormat>('BO3');
  const [myDeckName, setMyDeckName] = useState('');
  const [opponentDeckName, setOpponentDeckName] = useState('');
  const [myColors, setMyColors] = useState<InkColor[]>([]);
  const [opponentColors, setOpponentColors] = useState<InkColor[]>([]);
  const [result, setResult] = useState<'Victoria' | 'Derrota' | ''>('');
  const [notes, setNotes] = useState('');

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
    setGameFormat('Infinity Constructor');
    setMatchFormat('BO3');
    setMyDeckName('');
    setOpponentDeckName('');
    setMyColors([]);
    setOpponentColors([]);
    setResult('');
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!myDeckName || !opponentDeckName || myColors.length === 0 || opponentColors.length === 0 || !result) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    
    const matchData = {
      gameFormat,
      matchFormat,
      myDeck: {
        name: myDeckName,
        colors: myColors
      },
      opponentDeck: {
        name: opponentDeckName,
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
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
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
          />

          {/* My Deck Colors */}
          <ColorSelector
            selectedColors={myColors}
            onColorToggle={handleMyColorToggle}
            label="Mis Colores"
            id="my"
          />
          
          {/* My Deck Name */}
          <DeckInput
            id="myDeckName"
            label="Nombre de Mi Mazo"
            value={myDeckName}
            onChange={setMyDeckName}
            placeholder="Ej: Control Ambar/Amatista"
          />
          
          {/* Opponent Deck Colors */}
          <ColorSelector
            selectedColors={opponentColors}
            onColorToggle={handleOpponentColorToggle}
            label="Colores del Oponente"
            id="opp"
          />
          
          {/* Opponent Deck Name */}
          <DeckInput
            id="opponentDeckName"
            label="Nombre del Mazo Oponente"
            value={opponentDeckName}
            onChange={setOpponentDeckName}
            placeholder="Ej: Aggro Rubí/Esmeralda"
          />
          
          {/* Match Format */}
          <MatchFormatSelector
            value={matchFormat}
            onChange={setMatchFormat}
          />
          
          {/* Result */}
          <ResultSelector
            value={result}
            onChange={setResult}
          />
          
          {/* Notes */}
          <NotesInput
            value={notes}
            onChange={setNotes}
          />
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full">
            Guardar Partida
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

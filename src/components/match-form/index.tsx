
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { useUserDecks, UserDeck } from '@/hooks/useUserDecks';
import { useMatchRecords } from '@/hooks/useMatchRecords';
import { InkColor, GameFormat, MatchFormat } from '@/types';
import { GameFormatSelector } from './game-format-selector';
import { ColorSelector } from './color-selector';
import { DeckInput } from './deck-input';
import { DeckSelector } from './deck-selector';
import { MatchFormatSelector } from './match-format-selector';
import { ResultSelector } from './result-selector';
import { NotesInput } from './notes-input';
import { AuthModal } from '@/components/auth/AuthModal';
import { toast } from "sonner";

interface MatchFormProps {
  tournamentId?: string;
  onSuccess?: () => void;
}

export function MatchForm({ tournamentId, onSuccess }: MatchFormProps) {
  const { user } = useAuth();
  const { decks, loading: decksLoading } = useUserDecks();
  const { createMatch } = useMatchRecords();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [gameFormat, setGameFormat] = useState<GameFormat>('Infinity Constructor');
  const [matchFormat, setMatchFormat] = useState<MatchFormat>('BO3');
  const [myDeckName, setMyDeckName] = useState('');
  const [opponentDeckName, setOpponentDeckName] = useState('');
  const [myColors, setMyColors] = useState<InkColor[]>([]);
  const [opponentColors, setOpponentColors] = useState<InkColor[]>([]);
  const [selectedMyDeck, setSelectedMyDeck] = useState('');
  const [selectedMyDeckId, setSelectedMyDeckId] = useState<string | undefined>(undefined);
  const [result, setResult] = useState<'Victoria' | 'Derrota' | 'Empate' | ''>('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset the result if changing from BO2 to another format and result is 'Empate'
  useEffect(() => {
    if (matchFormat !== 'BO2' && result === 'Empate') {
      setResult('');
    }
  }, [matchFormat, result]);

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

  const handleMyDeckSelect = (deck: UserDeck | null) => {
    if (deck) {
      setMyDeckName(deck.name);
      setMyColors(deck.colors);
      setSelectedMyDeckId(deck.id);
      console.log('Mazo seleccionado:', deck);
    } else {
      setSelectedMyDeckId(undefined);
    }
  };

  const resetForm = () => {
    setGameFormat('Infinity Constructor');
    setMatchFormat('BO3');
    setMyDeckName('');
    setOpponentDeckName('');
    setMyColors([]);
    setOpponentColors([]);
    setSelectedMyDeck('');
    setSelectedMyDeckId(undefined);
    setResult('');
    setNotes('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    if (myColors.length === 0 || opponentColors.length === 0 || !result) {
      toast.error('Por favor selecciona colores y resultado');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createMatch({
        user_deck_id: selectedMyDeckId,
        opponent_deck_name: opponentDeckName.trim() || 'Sin nombre',
        opponent_deck_colors: opponentColors,
        result,
        game_format: gameFormat,
        match_format: matchFormat,
        notes: notes.trim() || undefined
      });
      
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
    <>
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
              disabled={isSubmitting}
            />

            {/* My Deck Selection */}
            {user && !decksLoading && decks.length > 0 && (
              <DeckSelector
                decks={decks}
                value={selectedMyDeck}
                onChange={setSelectedMyDeck}
                onDeckSelect={handleMyDeckSelect}
                label="Seleccionar Mi Mazo (opcional)"
                placeholder="Elegir un mazo guardado"
                disabled={isSubmitting}
              />
            )}

            {/* My Deck Colors */}
            <ColorSelector
              selectedColors={myColors}
              onColorToggle={handleMyColorToggle}
              label="Mis Colores"
              id="my"
              disabled={isSubmitting}
            />
            
            {/* My Deck Name */}
            <DeckInput
              id="myDeckName"
              label="Nombre de Mi Mazo (opcional)"
              value={myDeckName}
              onChange={setMyDeckName}
              placeholder="Ej: Control Ambar/Amatista"
              disabled={isSubmitting}
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

      <AuthModal 
        open={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}

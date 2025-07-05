
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useMatchRecords } from '@/hooks/useMatchRecords';
import { useUserDecks } from '@/hooks/useUserDecks';
import { toast } from 'sonner';
import { InkColor, GameFormat, MatchFormat } from '@/types';

import { DeckSelector } from './deck-selector';
import { OpponentDeckSelector } from './opponent-deck-selector';
import { ResultSelector } from './result-selector';
import { GameFormatSelector } from './game-format-selector';
import { MatchFormatSelector } from './match-format-selector';
import { NotesInput } from './notes-input';

const formSchema = z.object({
  userDeckId: z.string().optional(),
  opponentDeckName: z.string().min(1, 'El nombre del mazo oponente es requerido'),
  opponentDeckColors: z.array(z.string()).min(1, 'Selecciona al menos un color'),
  result: z.enum(['Victoria', 'Derrota', 'Empate']),
  gameFormat: z.enum(['Estándar', 'Infinity Constructor']),
  matchFormat: z.enum(['BO1', 'BO3', 'BO5']),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface MatchFormProps {
  tournamentId?: string;
  onSuccess?: () => void;
}

export function MatchForm({ tournamentId, onSuccess }: MatchFormProps = {}) {
  const { createMatch, loading } = useMatchRecords();
  const { decks } = useUserDecks();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      opponentDeckName: '',
      opponentDeckColors: [],
      result: 'Victoria',
      gameFormat: 'Estándar',
      matchFormat: 'BO3',
      notes: '',
    },
  });

  // Watch for changes in selected deck to auto-select colors
  const selectedDeckId = form.watch('userDeckId');
  
  // Update colors when deck selection changes
  React.useEffect(() => {
    if (selectedDeckId && decks.length > 0) {
      const selectedDeck = decks.find(deck => deck.id === selectedDeckId);
      if (selectedDeck) {
        form.setValue('opponentDeckColors', selectedDeck.colors);
      }
    }
  }, [selectedDeckId, decks, form]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      await createMatch({
        user_deck_id: data.userDeckId,
        opponent_deck_name: data.opponentDeckName,
        opponent_deck_colors: data.opponentDeckColors as InkColor[],
        result: data.result,
        game_format: data.gameFormat as GameFormat,
        match_format: data.matchFormat as MatchFormat,
        notes: data.notes,
      });

      // Reset form after successful submission
      form.reset();
      
      // Show success message
      toast.success('¡Partida registrada exitosamente!');
      
      // Call onSuccess callback if provided (for tournament context)
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error('Error creating match:', error);
      toast.error('Error al registrar la partida');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {tournamentId ? 'Agregar Partida al Torneo' : 'Registrar Nueva Partida'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DeckSelector form={form} />
            <OpponentDeckSelector form={form} />
            <ResultSelector form={form} />
            <GameFormatSelector form={form} />
            <MatchFormatSelector form={form} />
            <NotesInput form={form} />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || isSubmitting}
            >
              {isSubmitting ? 'Registrando...' : 'Registrar Partida'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

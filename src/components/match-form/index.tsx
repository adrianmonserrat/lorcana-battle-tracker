
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useMatchRecords } from '@/hooks/useMatchRecords';
import { useUserDecks } from '@/hooks/useUserDecks';
import { useLorcana } from '@/context/lorcana/LorcanaProvider';
import { toast } from 'sonner';
import { InkColor, GameFormat, MatchFormat, MatchResult } from '@/types';

import { DeckSelector } from './deck-selector';
import { OpponentDeckSelector } from './opponent-deck-selector';
import { DetailedResultSelector } from './detailed-result-selector';
import { GameFormatSelector } from './game-format-selector';
import { MatchFormatSelector } from './match-format-selector';
import { NotesInput } from './notes-input';

const formSchema = z.object({
  userDeckId: z.string().optional(),
  userDeckName: z.string().optional(),
  userDeckColors: z.array(z.string()).optional(),
  opponentDeckName: z.string().min(1, 'El nombre del mazo oponente es requerido'),
  opponentDeckColors: z.array(z.string()).min(1, 'Selecciona al menos un color'),
  result: z.enum(['Victoria', 'Derrota', 'Empate']),
  detailedResult: z.enum(['2-0', '2-1', '1-2', '0-2', 'Empate']),
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
  const { addTournamentMatch, tournaments } = useLorcana();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Find the tournament if we have a tournamentId
  const tournament = tournamentId ? tournaments.find(t => t.id === tournamentId) : null;
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      opponentDeckName: '',
      opponentDeckColors: [],
      userDeckColors: [],
      result: 'Victoria',
      detailedResult: '2-0',
      gameFormat: 'Estándar',
      matchFormat: 'BO3',
      notes: '',
    },
  });

  // Set default deck from tournament if available
  useEffect(() => {
    if (tournament?.defaultDeck) {
      form.setValue('userDeckName', tournament.defaultDeck.name);
      form.setValue('userDeckColors', tournament.defaultDeck.colors);
      // Don't set userDeckId since this is from tournament default, not user's deck
    }
  }, [tournament, form]);

  // Watch for changes in selected deck to auto-select colors
  const selectedDeckId = form.watch('userDeckId');
  
  // Update colors when deck selection changes
  useEffect(() => {
    if (selectedDeckId && decks.length > 0) {
      const selectedDeck = decks.find(deck => deck.id === selectedDeckId);
      if (selectedDeck) {
        form.setValue('userDeckColors', selectedDeck.colors);
        form.setValue('userDeckName', selectedDeck.name);
      }
    }
  }, [selectedDeckId, decks, form]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      
      // Validar que tengamos los datos necesarios del mazo del usuario
      if (!data.userDeckId && (!data.userDeckName || !data.userDeckColors || data.userDeckColors.length === 0)) {
        toast.error('Debes especificar tu mazo o seleccionar uno existente');
        return;
      }

      if (tournamentId) {
        // Si es una partida de torneo, usar la función del contexto local
        addTournamentMatch(tournamentId, {
          myDeck: {
            name: data.userDeckName || 'Mi Mazo',
            colors: data.userDeckColors as InkColor[] || []
          },
          opponentDeck: {
            name: data.opponentDeckName,
            colors: data.opponentDeckColors as InkColor[]
          },
          result: data.result,
          detailedResult: data.detailedResult as MatchResult,
          gameFormat: data.gameFormat as GameFormat,
          matchFormat: data.matchFormat as MatchFormat,
          notes: data.notes,
        });
      } else {
        // Si es una partida normal, usar Supabase
        await createMatch({
          user_deck_id: data.userDeckId,
          opponent_deck_name: data.opponentDeckName,
          opponent_deck_colors: data.opponentDeckColors as InkColor[],
          result: data.result,
          game_format: data.gameFormat as GameFormat,
          match_format: data.matchFormat as MatchFormat,
          notes: data.notes,
        });
      }

      // Reset form after successful submission
      form.reset({
        opponentDeckName: '',
        opponentDeckColors: [],
        userDeckColors: tournament?.defaultDeck?.colors || [],
        userDeckName: tournament?.defaultDeck?.name || '',
        result: 'Victoria',
        detailedResult: '2-0',
        gameFormat: 'Estándar',
        matchFormat: 'BO3',
        notes: '',
      });
      
      // Show success message
      toast.success(tournamentId ? '¡Partida de torneo registrada exitosamente!' : '¡Partida registrada exitosamente!');
      
      // Call onSuccess callback if provided
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
          {tournament?.defaultDeck && (
            <p className="text-sm text-muted-foreground mt-1">
              Usando mazo por defecto: {tournament.defaultDeck.name}
            </p>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {!tournament?.defaultDeck && <DeckSelector form={form} />}
            <OpponentDeckSelector form={form} />
            <DetailedResultSelector form={form} />
            <GameFormatSelector form={form} />
            <MatchFormatSelector form={form} />
            <NotesInput form={form} />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || isSubmitting}
            >
              {isSubmitting ? 'Registrando...' : tournamentId ? 'Registrar Partida de Torneo' : 'Registrar Partida'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

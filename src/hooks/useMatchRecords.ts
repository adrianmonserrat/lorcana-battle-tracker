
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { InkColor, GameFormat, MatchFormat } from '@/types';

export interface MatchRecord {
  id: string;
  user_id: string;
  user_deck_id?: string;
  opponent_deck_id?: string;
  opponent_deck_name: string;
  opponent_deck_colors: InkColor[];
  result: 'Victoria' | 'Derrota' | 'Empate';
  game_format: GameFormat;
  match_format: MatchFormat;
  notes?: string;
  created_at: string;
}

export interface CreateMatchRecord {
  user_deck_id?: string;
  opponent_deck_name: string;
  opponent_deck_colors: InkColor[];
  result: 'Victoria' | 'Derrota' | 'Empate';
  game_format: GameFormat;
  match_format: MatchFormat;
  notes?: string;
}

export function useMatchRecords() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMatches = async () => {
    if (!user) {
      setMatches([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('match_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to ensure colors are properly typed
      const typedMatches = (data || []).map(match => ({
        ...match,
        opponent_deck_colors: match.opponent_deck_colors as InkColor[]
      }));
      
      setMatches(typedMatches);
    } catch (error) {
      console.error('Error loading matches:', error);
      toast.error('Error al cargar las partidas');
    } finally {
      setLoading(false);
    }
  };

  const createMatch = async (matchData: CreateMatchRecord): Promise<MatchRecord> => {
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    try {
      const { data, error } = await supabase
        .from('match_records')
        .insert({
          user_id: user.id,
          user_deck_id: matchData.user_deck_id,
          opponent_deck_name: matchData.opponent_deck_name,
          opponent_deck_colors: matchData.opponent_deck_colors as string[],
          result: matchData.result,
          game_format: matchData.game_format,
          match_format: matchData.match_format,
          notes: matchData.notes
        })
        .select()
        .single();

      if (error) throw error;
      
      // Transform the response to ensure colors are properly typed
      const typedMatch: MatchRecord = {
        ...data,
        opponent_deck_colors: data.opponent_deck_colors as InkColor[]
      };
      
      setMatches(prev => [typedMatch, ...prev]);
      toast.success('Partida guardada exitosamente');
      return typedMatch;
    } catch (error) {
      console.error('Error creating match:', error);
      toast.error('Error al guardar la partida');
      throw error;
    }
  };

  const deleteMatch = async (id: string) => {
    try {
      const { error } = await supabase
        .from('match_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMatches(prev => prev.filter(match => match.id !== id));
      toast.success('Partida eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting match:', error);
      toast.error('Error al eliminar la partida');
    }
  };

  useEffect(() => {
    loadMatches();
  }, [user]);

  return {
    matches,
    loading,
    createMatch,
    deleteMatch,
    refreshMatches: loadMatches
  };
}


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';
import { InkColor, GameFormat, MatchFormat, InitialTurn } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export interface MatchRecord {
  id: string;
  user_id: string;
  user_deck_id?: string;
  opponent_deck_id?: string;
  opponent_deck_name?: string;
  opponent_deck_colors: InkColor[];
  result: 'Victoria' | 'Derrota' | 'Empate';
  game_format: GameFormat;
  match_format: MatchFormat;
  initial_turn?: InitialTurn;
  notes?: string;
  created_at: string;
}

export interface CreateMatchRecord {
  user_deck_id?: string;
  opponent_deck_name?: string;
  opponent_deck_colors: InkColor[];
  result: 'Victoria' | 'Derrota' | 'Empate';
  game_format: GameFormat;
  match_format: MatchFormat;
  initial_turn: InitialTurn;
  notes?: string;
}

export function useMatchRecords() {
  const { user } = useAuth();
  const { language } = useLanguage();
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
      
      const typedMatches: MatchRecord[] = (data || []).map((match: any) => ({
        ...match,
        opponent_deck_name: (language === 'en' 
          ? (match.opponent_deck_name_en || match.opponent_deck_name)
          : (match.opponent_deck_name_es || match.opponent_deck_name)) || undefined,
        opponent_deck_colors: match.opponent_deck_colors as InkColor[],
        result: match.result as 'Victoria' | 'Derrota' | 'Empate',
        game_format: match.game_format as GameFormat,
        match_format: match.match_format as MatchFormat,
        initial_turn: match.initial_turn as InitialTurn,
        notes: match.notes || undefined
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
          opponent_deck_name: matchData.opponent_deck_name || null,
          opponent_deck_name_en: language === 'en' ? (matchData.opponent_deck_name || null) : null,
          opponent_deck_name_es: language === 'es' ? (matchData.opponent_deck_name || null) : null,
          opponent_deck_colors: matchData.opponent_deck_colors as string[],
          result: matchData.result,
          game_format: matchData.game_format,
          match_format: matchData.match_format,
          initial_turn: matchData.initial_turn,
          notes: matchData.notes,
          notes_en: language === 'en' ? (matchData.notes || null) : null,
          notes_es: language === 'es' ? (matchData.notes || null) : null,
        })
        .select()
        .single();

      if (error) throw error;
      
      const typedMatch: MatchRecord = {
        ...data,
        opponent_deck_name: (language === 'en' 
          ? (data.opponent_deck_name_en || data.opponent_deck_name)
          : (data.opponent_deck_name_es || data.opponent_deck_name)) || undefined,
        opponent_deck_colors: data.opponent_deck_colors as InkColor[],
        result: data.result as 'Victoria' | 'Derrota' | 'Empate',
        game_format: data.game_format as GameFormat,
        match_format: data.match_format as MatchFormat,
        initial_turn: data.initial_turn as InitialTurn,
        notes: data.notes || undefined
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

  // Re-localize opponent deck names when language changes
  useEffect(() => {
    setMatches(prev => prev.map((m: any) => ({
      ...m,
      opponent_deck_name: (language === 'en' 
        ? (m.opponent_deck_name_en || m.opponent_deck_name)
        : (m.opponent_deck_name_es || m.opponent_deck_name)) || undefined,
    })));
  }, [language]);

  return {
    matches,
    loading,
    createMatch,
    deleteMatch,
    refreshMatches: loadMatches
  };
}

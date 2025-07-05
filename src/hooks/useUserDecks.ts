
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { InkColor, GameFormat } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/AuthProvider';

export interface UserDeck {
  id: string;
  user_id: string;
  name: string;
  colors: InkColor[];
  format: GameFormat;
  created_at: string;
  updated_at: string;
}

export function useUserDecks() {
  const { user } = useAuth();
  const [decks, setDecks] = useState<UserDeck[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDecks = async () => {
    if (!user) {
      setDecks([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_decks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to ensure colors and format are properly typed
      const typedDecks = (data || []).map(deck => ({
        ...deck,
        colors: deck.colors as InkColor[],
        format: deck.format as GameFormat
      }));
      
      setDecks(typedDecks);
    } catch (error) {
      console.error('Error loading decks:', error);
      toast.error('Error al cargar los mazos');
    } finally {
      setLoading(false);
    }
  };

  const createDeck = async (name: string, colors: InkColor[], format: GameFormat = 'Estándar'): Promise<UserDeck> => {
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    try {
      const { data, error } = await supabase
        .from('user_decks')
        .insert({
          name,
          colors: colors as string[],
          format,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      // Transform the response to ensure colors and format are properly typed
      const typedDeck: UserDeck = {
        ...data,
        colors: data.colors as InkColor[],
        format: data.format as GameFormat
      };
      
      setDecks(prev => [typedDeck, ...prev]);
      toast.success('Mazo creado exitosamente');
      return typedDeck;
    } catch (error) {
      console.error('Error creating deck:', error);
      toast.error('Error al crear el mazo');
      throw error;
    }
  };

  const deleteDeck = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_decks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setDecks(prev => prev.filter(deck => deck.id !== id));
      toast.success('Mazo eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting deck:', error);
      toast.error('Error al eliminar el mazo');
    }
  };

  useEffect(() => {
    loadDecks();
  }, [user]);

  return {
    decks,
    loading,
    createDeck,
    deleteDeck,
    refreshDecks: loadDecks
  };
}


import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { InkColor } from '@/types';
import { toast } from 'sonner';

export interface UserDeck {
  id: string;
  user_id: string;
  name: string;
  colors: InkColor[];
  created_at: string;
  updated_at: string;
}

export function useUserDecks() {
  const [decks, setDecks] = useState<UserDeck[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDecks = async () => {
    try {
      const { data, error } = await supabase
        .from('user_decks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDecks(data || []);
    } catch (error) {
      console.error('Error loading decks:', error);
      toast.error('Error al cargar los mazos');
    } finally {
      setLoading(false);
    }
  };

  const createDeck = async (name: string, colors: InkColor[]) => {
    try {
      const { data, error } = await supabase
        .from('user_decks')
        .insert({
          name,
          colors: colors as string[],
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      
      setDecks(prev => [data, ...prev]);
      toast.success('Mazo creado exitosamente');
      return data;
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
  }, []);

  return {
    decks,
    loading,
    createDeck,
    deleteDeck,
    refreshDecks: loadDecks
  };
}

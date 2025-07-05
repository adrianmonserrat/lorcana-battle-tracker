
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { toast } from 'sonner';

export interface DeckStatistics {
  id: string;
  user_id: string;
  deck_id: string;
  total_matches: number;
  victories: number;
  defeats: number;
  ties: number;
  win_rate: number;
  created_at: string;
  updated_at: string;
  deck_name?: string;
  deck_colors?: string[];
  deck_format?: string;
}

export function useDeckStatistics() {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState<DeckStatistics[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStatistics = async () => {
    if (!user) {
      setStatistics([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('deck_statistics')
        .select(`
          *,
          user_decks!deck_statistics_deck_id_fkey(
            name,
            colors,
            format
          )
        `)
        .eq('user_id', user.id)
        .order('total_matches', { ascending: false });

      if (error) throw error;
      
      // Transform data to include deck information
      const transformedData = (data || []).map(stat => ({
        ...stat,
        deck_name: stat.user_decks?.name,
        deck_colors: stat.user_decks?.colors,
        deck_format: stat.user_decks?.format
      }));

      console.log('Estadísticas de mazos cargadas:', transformedData);
      setStatistics(transformedData);
    } catch (error) {
      console.error('Error loading deck statistics:', error);
      toast.error('Error al cargar las estadísticas de mazos');
      setStatistics([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteStatistic = async (statisticId: string) => {
    try {
      const { error } = await supabase
        .from('deck_statistics')
        .delete()
        .eq('id', statisticId)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      // Actualizar el estado local inmediatamente
      setStatistics(prev => {
        const updated = prev.filter(stat => stat.id !== statisticId);
        console.log('Estadísticas actualizadas después de eliminar:', updated);
        return updated;
      });
      
      toast.success('Estadística eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting statistic:', error);
      toast.error('Error al eliminar la estadística');
    }
  };

  // Set up real-time subscription to automatically refresh when statistics change
  useEffect(() => {
    if (!user) return;

    loadStatistics();

    // Subscribe to changes in deck_statistics table
    const subscription = supabase
      .channel('deck_statistics_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deck_statistics',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Deck statistics changed:', payload);
          // Reload statistics when any change occurs
          loadStatistics();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return {
    statistics,
    loading,
    deleteStatistic,
    refreshStatistics: loadStatistics
  };
}


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
      const { data, error } = await supabase
        .from('deck_statistics')
        .select(`
          *,
          user_decks!inner(name, colors)
        `)
        .order('total_matches', { ascending: false });

      if (error) throw error;
      
      setStatistics(data || []);
    } catch (error) {
      console.error('Error loading deck statistics:', error);
      toast.error('Error al cargar las estadísticas de mazos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, [user]);

  return {
    statistics,
    loading,
    refreshStatistics: loadStatistics
  };
}

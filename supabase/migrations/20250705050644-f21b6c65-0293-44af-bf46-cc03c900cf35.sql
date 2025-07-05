
-- Crear tabla para estadísticas detalladas de mazos
CREATE TABLE public.deck_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  deck_id UUID REFERENCES public.user_decks(id) ON DELETE CASCADE NOT NULL,
  total_matches INTEGER DEFAULT 0,
  victories INTEGER DEFAULT 0,
  defeats INTEGER DEFAULT 0,
  ties INTEGER DEFAULT 0,
  win_rate DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, deck_id)
);

-- Crear tabla para mazos de oponentes personalizados
CREATE TABLE public.opponent_decks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  colors TEXT[] NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para estadísticas de partidas (relacionar partidas con mazos)
CREATE TABLE public.match_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_deck_id UUID REFERENCES public.user_decks(id) ON DELETE SET NULL,
  opponent_deck_id UUID REFERENCES public.opponent_decks(id) ON DELETE SET NULL,
  opponent_deck_name TEXT NOT NULL,
  opponent_deck_colors TEXT[] NOT NULL,
  result TEXT NOT NULL CHECK (result IN ('Victoria', 'Derrota', 'Empate')),
  game_format TEXT NOT NULL,
  match_format TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en las nuevas tablas
ALTER TABLE public.deck_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opponent_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_records ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para deck_statistics
CREATE POLICY "Users can view their own deck statistics" 
  ON public.deck_statistics 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own deck statistics" 
  ON public.deck_statistics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deck statistics" 
  ON public.deck_statistics 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Políticas RLS para opponent_decks
CREATE POLICY "Users can view their own opponent decks" 
  ON public.opponent_decks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own opponent decks" 
  ON public.opponent_decks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own opponent decks" 
  ON public.opponent_decks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own opponent decks" 
  ON public.opponent_decks 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Políticas RLS para match_records
CREATE POLICY "Users can view their own match records" 
  ON public.match_records 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own match records" 
  ON public.match_records 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own match records" 
  ON public.match_records 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own match records" 
  ON public.match_records 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_deck_statistics_user_id ON public.deck_statistics(user_id);
CREATE INDEX idx_deck_statistics_deck_id ON public.deck_statistics(deck_id);
CREATE INDEX idx_opponent_decks_user_id ON public.opponent_decks(user_id);
CREATE INDEX idx_match_records_user_id ON public.match_records(user_id);
CREATE INDEX idx_match_records_user_deck_id ON public.match_records(user_deck_id);
CREATE INDEX idx_match_records_opponent_deck_id ON public.match_records(opponent_deck_id);

-- Función para actualizar estadísticas de mazo automáticamente
CREATE OR REPLACE FUNCTION public.update_deck_statistics()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Actualizar estadísticas cuando se inserta un nuevo registro de partida
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.deck_statistics (user_id, deck_id, total_matches, victories, defeats, ties, win_rate)
    VALUES (
      NEW.user_id,
      NEW.user_deck_id,
      1,
      CASE WHEN NEW.result = 'Victoria' THEN 1 ELSE 0 END,
      CASE WHEN NEW.result = 'Derrota' THEN 1 ELSE 0 END,
      CASE WHEN NEW.result = 'Empate' THEN 1 ELSE 0 END,
      CASE WHEN NEW.result = 'Victoria' THEN 100.00 ELSE 0.00 END
    )
    ON CONFLICT (user_id, deck_id) DO UPDATE SET
      total_matches = deck_statistics.total_matches + 1,
      victories = deck_statistics.victories + CASE WHEN NEW.result = 'Victoria' THEN 1 ELSE 0 END,
      defeats = deck_statistics.defeats + CASE WHEN NEW.result = 'Derrota' THEN 1 ELSE 0 END,
      ties = deck_statistics.ties + CASE WHEN NEW.result = 'Empate' THEN 1 ELSE 0 END,
      win_rate = CASE 
        WHEN (deck_statistics.total_matches + 1) > 0 
        THEN ROUND(((deck_statistics.victories + CASE WHEN NEW.result = 'Victoria' THEN 1 ELSE 0 END) * 100.0) / (deck_statistics.total_matches + 1), 2)
        ELSE 0.00 
      END,
      updated_at = now();
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Crear trigger para actualizar estadísticas automáticamente
CREATE TRIGGER update_deck_statistics_trigger
  AFTER INSERT ON public.match_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_deck_statistics();

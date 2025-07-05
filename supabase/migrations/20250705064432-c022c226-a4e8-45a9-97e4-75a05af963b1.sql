
-- Primero eliminamos el trigger existente que puede no estar funcionando correctamente
DROP TRIGGER IF EXISTS match_records_deletion_trigger ON public.match_records;

-- Eliminamos la función anterior si existe
DROP FUNCTION IF EXISTS public.handle_match_record_deletion();

-- Recreamos la función con mejor manejo de errores
CREATE OR REPLACE FUNCTION public.handle_match_record_deletion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Solo recalcular si la partida eliminada tenía un mazo asociado
  IF OLD.user_deck_id IS NOT NULL THEN
    -- Ejecutar la función de recálculo
    PERFORM public.recalculate_deck_statistics(OLD.user_id, OLD.user_deck_id);
  END IF;
  
  RETURN OLD;
END;
$$;

-- Recreamos el trigger
CREATE TRIGGER match_records_deletion_trigger
  AFTER DELETE ON public.match_records
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_match_record_deletion();

-- También vamos a mejorar la función de recálculo para ser más robusta
CREATE OR REPLACE FUNCTION public.recalculate_deck_statistics(p_user_id UUID, p_deck_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  match_count INTEGER;
  victory_count INTEGER;
  defeat_count INTEGER;
  tie_count INTEGER;
  calculated_win_rate DECIMAL(5,2);
BEGIN
  -- Contar las partidas existentes para este mazo
  SELECT 
    COUNT(*),
    SUM(CASE WHEN result = 'Victoria' THEN 1 ELSE 0 END),
    SUM(CASE WHEN result = 'Derrota' THEN 1 ELSE 0 END),
    SUM(CASE WHEN result = 'Empate' THEN 1 ELSE 0 END)
  INTO match_count, victory_count, defeat_count, tie_count
  FROM public.match_records
  WHERE user_id = p_user_id AND user_deck_id = p_deck_id;

  -- Manejar valores NULL
  match_count := COALESCE(match_count, 0);
  victory_count := COALESCE(victory_count, 0);
  defeat_count := COALESCE(defeat_count, 0);
  tie_count := COALESCE(tie_count, 0);

  -- Calcular win rate
  IF match_count > 0 THEN
    calculated_win_rate := ROUND((victory_count * 100.0) / match_count, 2);
  ELSE
    calculated_win_rate := 0.00;
  END IF;

  -- Si no hay partidas, eliminar la estadística
  IF match_count = 0 THEN
    DELETE FROM public.deck_statistics 
    WHERE user_id = p_user_id AND deck_id = p_deck_id;
  ELSE
    -- Actualizar o insertar las estadísticas
    INSERT INTO public.deck_statistics (user_id, deck_id, total_matches, victories, defeats, ties, win_rate)
    VALUES (p_user_id, p_deck_id, match_count, victory_count, defeat_count, tie_count, calculated_win_rate)
    ON CONFLICT (user_id, deck_id) DO UPDATE SET
      total_matches = match_count,
      victories = victory_count,
      defeats = defeat_count,
      ties = tie_count,
      win_rate = calculated_win_rate,
      updated_at = now();
  END IF;
END;
$$;

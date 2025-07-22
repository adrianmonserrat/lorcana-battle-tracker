-- Phase 1: Fix critical database function search path vulnerabilities
-- Adding SET search_path = '' to all functions to prevent schema poisoning attacks

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$function$;

-- Fix update_deck_statistics function
CREATE OR REPLACE FUNCTION public.update_deck_statistics()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  -- Solo procesar si hay un user_deck_id válido
  IF NEW.user_deck_id IS NOT NULL THEN
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
$function$;

-- Fix handle_match_record_deletion function
CREATE OR REPLACE FUNCTION public.handle_match_record_deletion()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  -- Solo recalcular si la partida eliminada tenía un mazo asociado
  IF OLD.user_deck_id IS NOT NULL THEN
    -- Ejecutar la función de recálculo
    PERFORM public.recalculate_deck_statistics(OLD.user_id, OLD.user_deck_id);
  END IF;
  
  RETURN OLD;
END;
$function$;

-- Fix recalculate_deck_statistics function
CREATE OR REPLACE FUNCTION public.recalculate_deck_statistics(p_user_id uuid, p_deck_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;
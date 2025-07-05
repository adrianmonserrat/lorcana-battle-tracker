
-- Asegurar que todos los usuarios existentes tengan un perfil
INSERT INTO public.profiles (user_id, display_name, created_at, updated_at)
SELECT 
    au.id,
    NULL,
    NOW(),
    NOW()
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.user_id
WHERE p.user_id IS NULL;

-- Actualizar el trigger para las estadísticas de mazos para que funcione correctamente
CREATE OR REPLACE FUNCTION public.update_deck_statistics()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Crear el trigger si no existe
DROP TRIGGER IF EXISTS match_records_deck_stats_trigger ON public.match_records;
CREATE TRIGGER match_records_deck_stats_trigger
  AFTER INSERT ON public.match_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_deck_statistics();

-- Agregar índice único para evitar duplicados en deck_statistics
CREATE UNIQUE INDEX IF NOT EXISTS deck_statistics_user_deck_unique 
ON public.deck_statistics(user_id, deck_id);

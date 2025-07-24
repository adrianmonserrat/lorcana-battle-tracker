-- Fix the validation function to allow optional opponent deck names
CREATE OR REPLACE FUNCTION public.validate_match_record_input()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Validate user_id
  IF NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'No autorizado para crear registros de partida para otros usuarios.';
  END IF;
  
  -- Validate opponent deck name only if provided
  IF NEW.opponent_deck_name IS NOT NULL AND LENGTH(TRIM(NEW.opponent_deck_name)) > 0 THEN
    IF NOT public.validate_deck_name(NEW.opponent_deck_name) THEN
      RAISE EXCEPTION 'Nombre de mazo oponente inválido.';
    END IF;
  END IF;
  
  -- Validate notes if provided
  IF NOT public.validate_notes(NEW.notes) THEN
    RAISE EXCEPTION 'Notas inválidas. Máximo 500 caracteres y sin contenido peligroso.';
  END IF;
  
  -- Validate result
  IF NEW.result NOT IN ('Victoria', 'Derrota', 'Empate') THEN
    RAISE EXCEPTION 'Resultado de partida inválido.';
  END IF;
  
  -- Validate formats
  IF NEW.game_format NOT IN ('Estándar', 'Infinity Constructor') THEN
    RAISE EXCEPTION 'Formato de juego inválido.';
  END IF;
  
  IF NEW.match_format NOT IN ('BO1', 'BO3', 'BO5') THEN
    RAISE EXCEPTION 'Formato de partida inválido.';
  END IF;
  
  RETURN NEW;
END;
$function$;
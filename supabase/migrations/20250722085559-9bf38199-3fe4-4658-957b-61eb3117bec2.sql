-- Add input validation triggers and functions for enhanced security

-- Function to validate user input for string fields
CREATE OR REPLACE FUNCTION public.validate_string_input(input_value TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check for null or empty
  IF input_value IS NULL OR LENGTH(TRIM(input_value)) = 0 THEN
    RETURN FALSE;
  END IF;
  
  -- Check for excessive length
  IF LENGTH(input_value) > 500 THEN
    RETURN FALSE;
  END IF;
  
  -- Check for suspicious characters that might indicate XSS or injection attempts
  IF input_value ~ '(<script|javascript:|on\w+\s*=|<\s*\/?\s*(script|iframe|object|embed))' THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate deck names
CREATE OR REPLACE FUNCTION public.validate_deck_name(deck_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Basic string validation
  IF NOT public.validate_string_input(deck_name) THEN
    RETURN FALSE;
  END IF;
  
  -- Deck name specific validation
  IF LENGTH(TRIM(deck_name)) < 1 OR LENGTH(deck_name) > 50 THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate notes
CREATE OR REPLACE FUNCTION public.validate_notes(notes_text TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Allow null/empty notes
  IF notes_text IS NULL OR LENGTH(TRIM(notes_text)) = 0 THEN
    RETURN TRUE;
  END IF;
  
  -- Check length
  IF LENGTH(notes_text) > 500 THEN
    RETURN FALSE;
  END IF;
  
  -- Check for suspicious content
  IF notes_text ~ '(<script|javascript:|on\w+\s*=|<\s*\/?\s*(script|iframe|object|embed))' THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for user_decks validation
CREATE OR REPLACE FUNCTION public.validate_user_deck_input()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate deck name
  IF NOT public.validate_deck_name(NEW.name) THEN
    RAISE EXCEPTION 'Nombre de mazo inválido. Debe tener entre 1 y 50 caracteres y no contener caracteres peligrosos.';
  END IF;
  
  -- Ensure user_id matches authenticated user
  IF NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'No autorizado para crear mazos para otros usuarios.';
  END IF;
  
  -- Validate colors array
  IF NEW.colors IS NULL OR array_length(NEW.colors, 1) IS NULL OR array_length(NEW.colors, 1) = 0 THEN
    RAISE EXCEPTION 'El mazo debe tener al menos un color.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for match_records validation
CREATE OR REPLACE FUNCTION public.validate_match_record_input()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate user_id
  IF NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'No autorizado para crear registros de partida para otros usuarios.';
  END IF;
  
  -- Validate opponent deck name
  IF NOT public.validate_deck_name(NEW.opponent_deck_name) THEN
    RAISE EXCEPTION 'Nombre de mazo oponente inválido.';
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
  IF NEW.game_format NOT IN ('Estándar', 'Ilimitado') THEN
    RAISE EXCEPTION 'Formato de juego inválido.';
  END IF;
  
  IF NEW.match_format NOT IN ('Bo1', 'Bo3') THEN
    RAISE EXCEPTION 'Formato de partida inválido.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for opponent_decks validation
CREATE OR REPLACE FUNCTION public.validate_opponent_deck_input()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate user_id
  IF NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'No autorizado para crear mazos oponentes para otros usuarios.';
  END IF;
  
  -- Validate deck name
  IF NOT public.validate_deck_name(NEW.name) THEN
    RAISE EXCEPTION 'Nombre de mazo oponente inválido.';
  END IF;
  
  -- Validate description if provided
  IF NEW.description IS NOT NULL AND NOT public.validate_string_input(NEW.description) THEN
    RAISE EXCEPTION 'Descripción inválida.';
  END IF;
  
  -- Validate colors
  IF NEW.colors IS NULL OR array_length(NEW.colors, 1) IS NULL OR array_length(NEW.colors, 1) = 0 THEN
    RAISE EXCEPTION 'El mazo oponente debe tener al menos un color.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for profiles validation
CREATE OR REPLACE FUNCTION public.validate_profile_input()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate user_id
  IF NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'No autorizado para modificar perfiles de otros usuarios.';
  END IF;
  
  -- Validate display_name if provided
  IF NEW.display_name IS NOT NULL THEN
    IF LENGTH(TRIM(NEW.display_name)) = 0 OR LENGTH(NEW.display_name) > 50 THEN
      RAISE EXCEPTION 'Nombre para mostrar debe tener entre 1 y 50 caracteres.';
    END IF;
    
    IF NEW.display_name ~ '(<script|javascript:|on\w+\s*=|<\s*\/?\s*(script|iframe|object|embed))' THEN
      RAISE EXCEPTION 'Nombre para mostrar contiene caracteres no permitidos.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS validate_user_deck_trigger ON public.user_decks;
CREATE TRIGGER validate_user_deck_trigger
  BEFORE INSERT OR UPDATE ON public.user_decks
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_user_deck_input();

DROP TRIGGER IF EXISTS validate_match_record_trigger ON public.match_records;
CREATE TRIGGER validate_match_record_trigger
  BEFORE INSERT OR UPDATE ON public.match_records
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_match_record_input();

DROP TRIGGER IF EXISTS validate_opponent_deck_trigger ON public.opponent_decks;
CREATE TRIGGER validate_opponent_deck_trigger
  BEFORE INSERT OR UPDATE ON public.opponent_decks
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_opponent_deck_input();

DROP TRIGGER IF EXISTS validate_profile_trigger ON public.profiles;
CREATE TRIGGER validate_profile_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_profile_input();
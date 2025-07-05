
-- Añadir columna de formato a la tabla user_decks
ALTER TABLE public.user_decks 
ADD COLUMN format text DEFAULT 'Estándar';

-- Actualizar los mazos existentes para que tengan un formato por defecto
UPDATE public.user_decks 
SET format = 'Estándar' 
WHERE format IS NULL;

-- Hacer que la columna format no sea nullable
ALTER TABLE public.user_decks 
ALTER COLUMN format SET NOT NULL;

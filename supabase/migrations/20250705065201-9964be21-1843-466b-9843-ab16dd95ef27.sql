
-- Agregar la política DELETE que falta para las estadísticas de mazos
CREATE POLICY "Users can delete their own deck statistics" 
  ON public.deck_statistics 
  FOR DELETE 
  USING (auth.uid() = user_id);


import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { useUserDecks } from '@/hooks/useUserDecks';
import { useAuth } from '@/components/auth/AuthProvider';

interface DeckSelectorProps {
  form: UseFormReturn<any>;
}

export function DeckSelector({ form }: DeckSelectorProps) {
  const { user } = useAuth();
  const { decks, loading } = useUserDecks();

  return (
    <FormField
      control={form.control}
      name="userDeckId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tu Mazo</FormLabel>
          <FormControl>
            <Select
              value={field.value || ""}
              onValueChange={field.onChange}
              disabled={loading || !user}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  !user 
                    ? "Inicia sesión para seleccionar un mazo" 
                    : loading 
                      ? "Cargando mazos..." 
                      : "Selecciona un mazo"
                } />
              </SelectTrigger>
              <SelectContent>
                {!user ? (
                  <SelectItem value="no-user" disabled>
                    Inicia sesión para ver tus mazos
                  </SelectItem>
                ) : loading ? (
                  <SelectItem value="loading" disabled>
                    Cargando...
                  </SelectItem>
                ) : decks.length === 0 ? (
                  <SelectItem value="no-decks" disabled>
                    No tienes mazos creados
                  </SelectItem>
                ) : (
                  decks.map((deck) => (
                    <SelectItem key={deck.id} value={deck.id}>
                      {deck.name} ({deck.colors.join(', ')})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

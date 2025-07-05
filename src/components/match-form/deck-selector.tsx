
import { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { useUserDecks } from '@/hooks/useUserDecks';
import { useAuth } from '@/components/auth/AuthProvider';
import { ColorSelector } from './color-selector';

interface DeckSelectorProps {
  form: UseFormReturn<any>;
}

export function DeckSelector({ form }: DeckSelectorProps) {
  const { user } = useAuth();
  const { decks, loading } = useUserDecks();
  const [selectionMode, setSelectionMode] = useState<'existing' | 'manual'>('existing');

  const handleModeChange = (mode: 'existing' | 'manual') => {
    setSelectionMode(mode);
    if (mode === 'manual') {
      // Limpiar valores cuando cambiamos a manual
      form.setValue('userDeckId', undefined);
      form.setValue('userDeckName', '');
      form.setValue('userDeckColors', []);
    } else {
      // Limpiar valores cuando cambiamos a existing
      form.setValue('userDeckName', '');
      form.setValue('userDeckColors', []);
    }
  };

  const handleExistingDeckSelect = (deckId: string) => {
    const selectedDeck = decks.find(deck => deck.id === deckId);
    if (selectedDeck) {
      form.setValue('userDeckId', deckId);
      form.setValue('userDeckName', selectedDeck.name);
      form.setValue('userDeckColors', selectedDeck.colors);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <FormLabel>Configuración de tu Mazo</FormLabel>
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => handleModeChange('existing')}
            className={`px-3 py-1 text-sm rounded ${
              selectionMode === 'existing' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
            disabled={!user}
          >
            Mazo Existente
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('manual')}
            className={`px-3 py-1 text-sm rounded ${
              selectionMode === 'manual' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Manual
          </button>
        </div>
      </div>

      {selectionMode === 'existing' && (
        <FormField
          control={form.control}
          name="userDeckId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seleccionar Mazo Existente</FormLabel>
              <FormControl>
                <Select
                  value={field.value || ""}
                  onValueChange={handleExistingDeckSelect}
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
      )}

      <FormField
        control={form.control}
        name="userDeckName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre de tu Mazo</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ej: Control Ambar/Amatista" 
                {...field}
                disabled={selectionMode === 'existing'}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="userDeckColors"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Colores de tu Mazo</FormLabel>
            <FormControl>
              <ColorSelector
                selectedColors={field.value || []}
                onColorsChange={field.onChange}
                disabled={selectionMode === 'existing'}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

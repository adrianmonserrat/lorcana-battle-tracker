
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { ColorSelector } from './color-selector';
import { useUserDecks } from '@/hooks/useUserDecks';
import { useState } from 'react';

interface OpponentDeckSelectorProps {
  form: UseFormReturn<any>;
}

export function OpponentDeckSelector({ form }: OpponentDeckSelectorProps) {
  const { decks } = useUserDecks();
  const [selectionMode, setSelectionMode] = useState<'manual' | 'existing'>('manual');

  const handleExistingDeckSelect = (deckId: string) => {
    const selectedDeck = decks.find(deck => deck.id === deckId);
    if (selectedDeck) {
      form.setValue('opponentDeckName', selectedDeck.name);
      form.setValue('opponentDeckColors', selectedDeck.colors);
    }
  };

  const handleModeChange = (mode: 'manual' | 'existing') => {
    setSelectionMode(mode);
    if (mode === 'manual') {
      // Limpiar valores cuando cambiamos a manual
      form.setValue('opponentDeckName', '');
      form.setValue('opponentDeckColors', []);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <FormLabel>Configuración del Mazo Oponente</FormLabel>
        <div className="flex gap-2 mt-2">
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
          <button
            type="button"
            onClick={() => handleModeChange('existing')}
            className={`px-3 py-1 text-sm rounded ${
              selectionMode === 'existing' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Mazo Existente
          </button>
        </div>
      </div>

      {selectionMode === 'existing' && (
        <FormItem>
          <FormLabel>Seleccionar Mazo Existente como Oponente</FormLabel>
          <FormControl>
            <Select onValueChange={handleExistingDeckSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un mazo existente" />
              </SelectTrigger>
              <SelectContent>
                {decks.length === 0 ? (
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
        </FormItem>
      )}

      <FormField
        control={form.control}
        name="opponentDeckName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre del Mazo Oponente</FormLabel>
            <FormControl>
              <Input 
                placeholder="Ej: Mazo Azul/Rojo" 
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
        name="opponentDeckColors"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Colores del Mazo Oponente</FormLabel>
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

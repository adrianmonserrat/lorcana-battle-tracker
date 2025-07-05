
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { useUserDecks } from '@/hooks/useUserDecks';

interface DeckSelectorProps {
  form: UseFormReturn<any>;
}

export function DeckSelector({ form }: DeckSelectorProps) {
  const { decks, loading } = useUserDecks();

  return (
    <FormField
      control={form.control}
      name="userDeckId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Mi Mazo (opcional)</FormLabel>
          <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Cargando mazos..." : "Selecciona tu mazo"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="">Sin mazo asignado</SelectItem>
              {decks.map((deck) => (
                <SelectItem key={deck.id} value={deck.id}>
                  <div className="flex items-center gap-2">
                    <span>{deck.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({deck.colors.join(', ')}) - {deck.format}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

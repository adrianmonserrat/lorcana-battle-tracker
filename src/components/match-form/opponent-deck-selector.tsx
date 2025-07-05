
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ColorSelector } from './color-selector';

interface OpponentDeckSelectorProps {
  form: UseFormReturn<any>;
}

export function OpponentDeckSelector({ form }: OpponentDeckSelectorProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="opponentDeckName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre del Mazo Oponente</FormLabel>
            <FormControl>
              <Input placeholder="Ej: Mazo Azul/Rojo" {...field} />
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
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

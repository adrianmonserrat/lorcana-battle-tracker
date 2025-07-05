
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { ColorSelector } from './color-selector';

interface DeckInputProps {
  form: UseFormReturn<any>;
}

export function DeckInput({ form }: DeckInputProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="userDeckName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre de tu Mazo</FormLabel>
            <FormControl>
              <Input placeholder="Ej: Control Ambar/Amatista" {...field} />
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
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}


import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

interface GameFormatSelectorProps {
  form: UseFormReturn<any>;
}

export function GameFormatSelector({ form }: GameFormatSelectorProps) {
  return (
    <FormField
      control={form.control}
      name="gameFormat"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Formato de Juego</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Estándar">Estándar</SelectItem>
                <SelectItem value="Infinity Constructor">Infinity Constructor</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

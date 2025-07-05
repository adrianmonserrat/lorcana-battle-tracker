
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

interface MatchFormatSelectorProps {
  form: UseFormReturn<any>;
}

export function MatchFormatSelector({ form }: MatchFormatSelectorProps) {
  return (
    <FormField
      control={form.control}
      name="matchFormat"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Formato de Partida</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BO1">Mejor de 1 (Bo1)</SelectItem>
                <SelectItem value="BO3">Mejor de 3 (Bo3)</SelectItem>
                <SelectItem value="BO5">Mejor de 5 (Bo5)</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}


import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
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
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Infinity Constructor" id="infinity" />
                <Label htmlFor="infinity">Infinity Constructor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Estándar" id="standard" />
                <Label htmlFor="standard">Estándar</Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

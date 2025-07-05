
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
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
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="BO1" id="bo1" />
                <Label htmlFor="bo1">BO1 (Mejor de 1)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="BO2" id="bo2" />
                <Label htmlFor="bo2">BO2 (Mejor de 2)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="BO3" id="bo3" />
                <Label htmlFor="bo3">BO3 (Mejor de 3)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="BO5" id="bo5" />
                <Label htmlFor="bo5">BO5 (Mejor de 5)</Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

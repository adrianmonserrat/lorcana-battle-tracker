
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';

interface ResultSelectorProps {
  form: UseFormReturn<any>;
}

export function ResultSelector({ form }: ResultSelectorProps) {
  return (
    <FormField
      control={form.control}
      name="result"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Resultado de la Partida</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Victoria" id="victoria" />
                <Label htmlFor="victoria" className="cursor-pointer">Victoria</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Derrota" id="derrota" />
                <Label htmlFor="derrota" className="cursor-pointer">Derrota</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Empate" id="empate" />
                <Label htmlFor="empate" className="cursor-pointer">Empate</Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

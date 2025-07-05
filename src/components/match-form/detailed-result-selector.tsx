
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';

interface DetailedResultSelectorProps {
  form: UseFormReturn<any>;
}

export function DetailedResultSelector({ form }: DetailedResultSelectorProps) {
  const detailedResult = form.watch('detailedResult');
  
  // Auto-set the general result based on detailed result
  const handleDetailedResultChange = (value: string) => {
    form.setValue('detailedResult', value);
    
    // Set the general result based on detailed result
    if (value === '2-0' || value === '2-1') {
      form.setValue('result', 'Victoria');
    } else if (value === '1-2' || value === '0-2') {
      form.setValue('result', 'Derrota');
    } else if (value === 'Empate') {
      form.setValue('result', 'Empate');
    }
  };

  return (
    <FormField
      control={form.control}
      name="detailedResult"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Resultado Detallado de la Partida</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={handleDetailedResultChange}
              value={field.value}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2-0" id="2-0" />
                <Label htmlFor="2-0" className="cursor-pointer">
                  Victoria 2-0 (Ganaste ambas partidas)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2-1" id="2-1" />
                <Label htmlFor="2-1" className="cursor-pointer">
                  Victoria 2-1 (Ganaste pero perdiste una)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1-2" id="1-2" />
                <Label htmlFor="1-2" className="cursor-pointer">
                  Derrota 1-2 (Perdiste pero ganaste una)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0-2" id="0-2" />
                <Label htmlFor="0-2" className="cursor-pointer">
                  Derrota 0-2 (Perdiste ambas partidas)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Empate" id="empate-detailed" />
                <Label htmlFor="empate-detailed" className="cursor-pointer">
                  Empate
                </Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

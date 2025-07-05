
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';

interface DetailedResultSelectorProps {
  form: UseFormReturn<any>;
}

export function DetailedResultSelector({ form }: DetailedResultSelectorProps) {
  const matchFormat = form.watch('matchFormat');
  const detailedResult = form.watch('detailedResult');
  
  // Auto-set the general result based on detailed result
  const handleDetailedResultChange = (value: string) => {
    form.setValue('detailedResult', value);
    
    // Set the general result based on detailed result
    if (value === 'Empate') {
      form.setValue('result', 'Empate');
    } else {
      // For BO3: 2-0, 2-1 are victories; 1-2, 0-2 are defeats
      // For BO5: 3-0, 3-1, 3-2 are victories; 2-3, 1-3, 0-3 are defeats
      const isVictory = matchFormat === 'BO3' 
        ? ['2-0', '2-1'].includes(value)
        : matchFormat === 'BO5'
          ? ['3-0', '3-1', '3-2'].includes(value)
          : true; // BO1 doesn't have detailed results yet
      
      form.setValue('result', isVictory ? 'Victoria' : 'Derrota');
    }
  };

  // Watch for match format changes to reset detailed result
  React.useEffect(() => {
    if (matchFormat && detailedResult) {
      // Check if current detailed result is valid for the new format
      const validResults = matchFormat === 'BO3' 
        ? ['2-0', '2-1', '1-2', '0-2', 'Empate']
        : matchFormat === 'BO5'
          ? ['3-0', '3-1', '3-2', '2-3', '1-3', '0-3', 'Empate']
          : [];
      
      if (!validResults.includes(detailedResult)) {
        form.setValue('detailedResult', '');
        form.setValue('result', 'Victoria');
      }
    }
  }, [matchFormat, form]);

  const renderBO3Options = () => (
    <>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="2-0" id="2-0" />
        <Label htmlFor="2-0" className="cursor-pointer">
          2-0 (Victoria - Ganaste ambas partidas)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="2-1" id="2-1" />
        <Label htmlFor="2-1" className="cursor-pointer">
          2-1 (Victoria - Ganaste pero perdiste una)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1-2" id="1-2" />
        <Label htmlFor="1-2" className="cursor-pointer">
          1-2 (Derrota - Perdiste pero ganaste una)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="0-2" id="0-2" />
        <Label htmlFor="0-2" className="cursor-pointer">
          0-2 (Derrota - Perdiste ambas partidas)
        </Label>
      </div>
    </>
  );

  const renderBO5Options = () => (
    <>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="3-0" id="3-0" />
        <Label htmlFor="3-0" className="cursor-pointer">
          3-0 (Victoria - Ganaste todas las partidas)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="3-1" id="3-1" />
        <Label htmlFor="3-1" className="cursor-pointer">
          3-1 (Victoria - Ganaste perdiendo una)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="3-2" id="3-2" />
        <Label htmlFor="3-2" className="cursor-pointer">
          3-2 (Victoria - Ganaste perdiendo dos)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="2-3" id="2-3" />
        <Label htmlFor="2-3" className="cursor-pointer">
          2-3 (Derrota - Perdiste ganando dos)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="1-3" id="1-3" />
        <Label htmlFor="1-3" className="cursor-pointer">
          1-3 (Derrota - Perdiste ganando una)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="0-3" id="0-3" />
        <Label htmlFor="0-3" className="cursor-pointer">
          0-3 (Derrota - Perdiste todas las partidas)
        </Label>
      </div>
    </>
  );

  if (matchFormat === 'BO1') {
    return null; // BO1 doesn't need detailed results
  }

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
              value={field.value || ''}
              className="flex flex-col space-y-2"
            >
              {matchFormat === 'BO3' && renderBO3Options()}
              {matchFormat === 'BO5' && renderBO5Options()}
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

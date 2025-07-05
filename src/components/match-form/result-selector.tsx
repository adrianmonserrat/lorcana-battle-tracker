
import { Button } from "@/components/ui/button";
import { Trophy, X, MinusCircle } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface ResultSelectorProps {
  form: UseFormReturn<any>;
}

export function ResultSelector({ form }: ResultSelectorProps) {
  const matchFormat = form.watch('matchFormat');
  const showTieOption = matchFormat === 'BO2';
  
  return (
    <FormField
      control={form.control}
      name="result"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Resultado</FormLabel>
          <FormControl>
            <div className={`grid ${showTieOption ? 'grid-cols-3' : 'grid-cols-2'} gap-2 sm:gap-4`}>
              <Button 
                type="button"
                variant={field.value === 'Victoria' ? 'default' : 'outline'} 
                className={`h-20 sm:h-24 ${field.value === 'Victoria' ? 'bg-lorcana-victory text-green-800 hover:bg-lorcana-victory/90' : ''}`}
                onClick={() => field.onChange('Victoria')}
              >
                <Trophy className="mr-2 h-5 w-5" />
                Victoria
              </Button>
              
              {showTieOption && (
                <Button 
                  type="button"
                  variant={field.value === 'Empate' ? 'default' : 'outline'}
                  className={`h-20 sm:h-24 ${field.value === 'Empate' ? 'bg-lorcana-tie text-amber-800 hover:bg-lorcana-tie/90' : ''}`}
                  onClick={() => field.onChange('Empate')}
                >
                  <MinusCircle className="mr-2 h-5 w-5" />
                  Empate
                </Button>
              )}
              
              <Button 
                type="button"
                variant={field.value === 'Derrota' ? 'default' : 'outline'}
                className={`h-20 sm:h-24 ${field.value === 'Derrota' ? 'bg-lorcana-defeat text-red-800 hover:bg-lorcana-defeat/90' : ''}`}
                onClick={() => field.onChange('Derrota')}
              >
                <X className="mr-2 h-5 w-5" />
                Derrota
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

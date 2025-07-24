
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { useLanguage } from '@/context/LanguageContext';

interface ResultSelectorProps {
  form: UseFormReturn<any>;
}

export function ResultSelector({ form }: ResultSelectorProps) {
  const { t } = useLanguage();
  return (
    <FormField
      control={form.control}
      name="result"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('match.result')}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Victoria" id="victoria" />
                <Label htmlFor="victoria" className="cursor-pointer">{t('match.result.win')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Derrota" id="derrota" />
                <Label htmlFor="derrota" className="cursor-pointer">{t('match.result.loss')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Empate" id="empate" />
                <Label htmlFor="empate" className="cursor-pointer">{t('match.result.draw')}</Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

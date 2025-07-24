
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { useLanguage } from '@/context/LanguageContext';

interface GameFormatSelectorProps {
  form: UseFormReturn<any>;
}

export function GameFormatSelector({ form }: GameFormatSelectorProps) {
  const { t } = useLanguage();
  return (
    <FormField
      control={form.control}
      name="gameFormat"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('match.game_format')}</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder={t('match.select_format')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Estándar">{t('match.standard')}</SelectItem>
                <SelectItem value="Infinity Constructor">{t('match.infinity_constructor')}</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

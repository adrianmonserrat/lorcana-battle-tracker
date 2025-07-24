
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { useLanguage } from '@/context/LanguageContext';

interface MatchFormatSelectorProps {
  form: UseFormReturn<any>;
}

export function MatchFormatSelector({ form }: MatchFormatSelectorProps) {
  const { t } = useLanguage();
  return (
    <FormField
      control={form.control}
      name="matchFormat"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('match.match_format')}</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder={t('match.select_format')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BO1">{t('match.best_of_1')}</SelectItem>
                <SelectItem value="BO3">{t('match.best_of_3')}</SelectItem>
                <SelectItem value="BO5">{t('match.best_of_5')}</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

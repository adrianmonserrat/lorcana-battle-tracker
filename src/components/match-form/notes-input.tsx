
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from 'react-hook-form';
import { sanitizeInput } from '@/lib/security';
import { useLanguage } from '@/context/LanguageContext';

interface NotesInputProps {
  form: UseFormReturn<any>;
}

export function NotesInput({ form }: NotesInputProps) {
  const { t } = useLanguage();
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('match.notes')}</FormLabel>
          <FormControl>
            <Textarea 
              placeholder={t('match.notes.placeholder')}
              className="min-h-[80px] sm:min-h-[100px]"
              {...field}
              onChange={(e) => field.onChange(sanitizeInput(e.target.value))}
              maxLength={500}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

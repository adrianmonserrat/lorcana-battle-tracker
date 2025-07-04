
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from 'react-hook-form';

interface NotesInputProps {
  form: UseFormReturn<any>;
}

export function NotesInput({ form }: NotesInputProps) {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notas (opcional)</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Notas sobre la partida..." 
              className="min-h-[80px] sm:min-h-[100px]"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

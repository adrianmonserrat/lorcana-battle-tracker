import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/LanguageContext';

interface InitialTurnSelectorProps {
  form: UseFormReturn<any>;
}

export function InitialTurnSelector({ form }: InitialTurnSelectorProps) {
  const { t } = useLanguage();
  return (
    <FormField
      control={form.control}
      name="initialTurn"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('match.initial_turn')}</FormLabel>
          <FormControl>
            <RadioGroup 
              onValueChange={field.onChange} 
              value={field.value}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="OTP" id="otp" />
                <Label htmlFor="otp">{t('match.on_the_play')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="OTD" id="otd" />
                <Label htmlFor="otd">{t('match.on_the_draw')}</Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
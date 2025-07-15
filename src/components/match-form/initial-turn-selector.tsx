import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface InitialTurnSelectorProps {
  form: UseFormReturn<any>;
}

export function InitialTurnSelector({ form }: InitialTurnSelectorProps) {
  return (
    <FormField
      control={form.control}
      name="initialTurn"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Turno Inicial</FormLabel>
          <FormControl>
            <RadioGroup 
              onValueChange={field.onChange} 
              value={field.value}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="OTP" id="otp" />
                <Label htmlFor="otp">OTP (On the Play)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="OTD" id="otd" />
                <Label htmlFor="otd">OTD (On the Draw)</Label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
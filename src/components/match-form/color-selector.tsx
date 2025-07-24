
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { InkColor } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

const COLORS: { value: InkColor; color: string; translationKey: string }[] = [
  { value: 'Ambar', color: 'bg-lorcana-amber', translationKey: 'colors.amber' },
  { value: 'Amatista', color: 'bg-lorcana-amethyst', translationKey: 'colors.amethyst' },
  { value: 'Esmeralda', color: 'bg-lorcana-emerald', translationKey: 'colors.emerald' },
  { value: 'Rubí', color: 'bg-lorcana-ruby', translationKey: 'colors.ruby' },
  { value: 'Zafiro', color: 'bg-lorcana-sapphire', translationKey: 'colors.sapphire' },
  { value: 'Acero', color: 'bg-lorcana-steel', translationKey: 'colors.steel' },
];

interface ColorSelectorProps {
  selectedColors: string[];
  onColorsChange: (colors: string[]) => void;
  disabled?: boolean;
}

export function ColorSelector({ selectedColors, onColorsChange, disabled = false }: ColorSelectorProps) {
  const { t } = useLanguage();
  const handleColorToggle = (color: string) => {
    if (disabled) return;
    
    const newColors = selectedColors.includes(color)
      ? selectedColors.filter(c => c !== color)
      : [...selectedColors, color];
    
    onColorsChange(newColors);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {COLORS.map((color) => (
        <Button
          key={color.value}
          type="button"
          variant={selectedColors.includes(color.value) ? "default" : "outline"}
          size="sm"
          onClick={() => handleColorToggle(color.value)}
          disabled={disabled}
          className={cn(
            "flex items-center gap-2 justify-start",
            selectedColors.includes(color.value) && "ring-2 ring-primary",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className={cn("w-4 h-4 rounded-full border", color.color)} />
          <span className="text-sm">{t(color.translationKey)}</span>
        </Button>
      ))}
    </div>
  );
}

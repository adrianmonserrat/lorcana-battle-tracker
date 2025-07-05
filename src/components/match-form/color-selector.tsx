
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { InkColor } from '@/types';

const COLORS: { value: InkColor; label: string; color: string }[] = [
  { value: 'Ambar', label: 'Ámbar', color: 'bg-lorcana-amber' },
  { value: 'Amatista', label: 'Amatista', color: 'bg-lorcana-amethyst' },
  { value: 'Esmeralda', label: 'Esmeralda', color: 'bg-lorcana-emerald' },
  { value: 'Rubí', label: 'Rubí', color: 'bg-lorcana-ruby' },
  { value: 'Zafiro', label: 'Zafiro', color: 'bg-lorcana-sapphire' },
  { value: 'Acero', label: 'Acero', color: 'bg-lorcana-steel' },
];

interface ColorSelectorProps {
  selectedColors: string[];
  onColorsChange: (colors: string[]) => void;
}

export function ColorSelector({ selectedColors, onColorsChange }: ColorSelectorProps) {
  const handleColorToggle = (color: string) => {
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
          className={cn(
            "flex items-center gap-2 justify-start",
            selectedColors.includes(color.value) && "ring-2 ring-primary"
          )}
        >
          <div className={cn("w-4 h-4 rounded-full border", color.color)} />
          <span className="text-sm">{color.label}</span>
        </Button>
      ))}
    </div>
  );
}

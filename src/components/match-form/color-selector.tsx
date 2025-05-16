
import { InkColor } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ColorSelectorProps {
  selectedColors: InkColor[];
  onColorToggle: (color: InkColor) => void;
  label: string;
  id: string;
  disabled?: boolean;
}

export function ColorSelector({ selectedColors, onColorToggle, label, id, disabled = false }: ColorSelectorProps) {
  const colorOptions: InkColor[] = ['Ambar', 'Amatista', 'Esmeralda', 'Rubí', 'Zafiro', 'Acero'];
  
  const getColorClass = (color: InkColor) => {
    switch(color) {
      case 'Ambar': return 'border-lorcana-amber/50 focus-within:border-lorcana-amber';
      case 'Amatista': return 'border-lorcana-amethyst/50 focus-within:border-lorcana-amethyst';
      case 'Esmeralda': return 'border-lorcana-emerald/50 focus-within:border-lorcana-emerald';
      case 'Rubí': return 'border-lorcana-ruby/50 focus-within:border-lorcana-ruby';
      case 'Zafiro': return 'border-lorcana-sapphire/50 focus-within:border-lorcana-sapphire';
      case 'Acero': return 'border-lorcana-steel/50 focus-within:border-lorcana-steel';
      default: return '';
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-medium">{label}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {colorOptions.map(color => (
          <div 
            key={`${id}-${color}`} 
            className={`flex items-center space-x-2 rounded-md border p-3 transition-colors ${getColorClass(color)} ${selectedColors.includes(color) ? 'bg-secondary' : ''}`}
          >
            <Checkbox 
              id={`${id}-${color}`} 
              checked={selectedColors.includes(color)}
              onCheckedChange={() => onColorToggle(color)}
              disabled={disabled}
            />
            <Label htmlFor={`${id}-${color}`} className={`flex-grow cursor-pointer ${disabled ? 'opacity-60' : ''}`}>
              {color}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}

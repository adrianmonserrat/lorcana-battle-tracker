
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
  
  // Verificar si ya se han seleccionado 2 colores
  const maxColorsReached = selectedColors.length >= 2;
  
  const getColorClass = (color: InkColor) => {
    // Determina si este color está inhabilitado
    const isDisabled = maxColorsReached && !selectedColors.includes(color);
    
    // Base de clases
    let colorClass = 'border transition-colors';
    
    // Añadir clases de color específicas
    switch(color) {
      case 'Ambar': colorClass += ' border-lorcana-amber/50 focus-within:border-lorcana-amber'; break;
      case 'Amatista': colorClass += ' border-lorcana-amethyst/50 focus-within:border-lorcana-amethyst'; break;
      case 'Esmeralda': colorClass += ' border-lorcana-emerald/50 focus-within:border-lorcana-emerald'; break;
      case 'Rubí': colorClass += ' border-lorcana-ruby/50 focus-within:border-lorcana-ruby'; break;
      case 'Zafiro': colorClass += ' border-lorcana-sapphire/50 focus-within:border-lorcana-sapphire'; break;
      case 'Acero': colorClass += ' border-lorcana-steel/50 focus-within:border-lorcana-steel'; break;
    }
    
    // Añadir clases para estados seleccionados/deshabilitados
    if (selectedColors.includes(color)) {
      colorClass += ' bg-secondary';
    }
    
    if (isDisabled) {
      colorClass += ' opacity-40 cursor-not-allowed';
    } else if (!disabled) {
      colorClass += ' hover:bg-secondary/50 cursor-pointer';
    }
    
    return colorClass;
  };

  const handleColorClick = (color: InkColor) => {
    if (disabled) return;
    
    if (selectedColors.includes(color)) {
      // Siempre permitir deseleccionar
      onColorToggle(color);
    } else if (!maxColorsReached) {
      // Solo permitir seleccionar nuevos colores si no se ha alcanzado el máximo
      onColorToggle(color);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-medium">{label} (máximo 2 colores)</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {colorOptions.map(color => {
          // Determinar si este color se puede seleccionar
          const isDisabled = disabled || (maxColorsReached && !selectedColors.includes(color));
          
          return (
            <div 
              key={`${id}-${color}`} 
              className={`flex items-center space-x-2 rounded-md p-3 ${getColorClass(color)}`}
              onClick={() => !isDisabled && handleColorClick(color)}
            >
              <Checkbox 
                id={`${id}-${color}`} 
                checked={selectedColors.includes(color)}
                onCheckedChange={() => handleColorClick(color)}
                disabled={isDisabled}
              />
              <Label 
                htmlFor={`${id}-${color}`} 
                className={`flex-grow cursor-pointer ${isDisabled ? "opacity-60" : ""}`}
              >
                {color}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

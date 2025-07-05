
import { Button } from "@/components/ui/button";
import { InkColor } from "@/types";

const colors: { name: InkColor; bg: string; text: string }[] = [
  { name: 'Ambar', bg: 'bg-amber-500', text: 'text-amber-50' },
  { name: 'Amatista', bg: 'bg-purple-500', text: 'text-purple-50' },
  { name: 'Esmeralda', bg: 'bg-emerald-500', text: 'text-emerald-50' },
  { name: 'Rubí', bg: 'bg-red-500', text: 'text-red-50' },
  { name: 'Zafiro', bg: 'bg-blue-500', text: 'text-blue-50' },
  { name: 'Acero', bg: 'bg-gray-500', text: 'text-gray-50' },
];

interface ColorSelectorProps {
  selectedColors: string[];
  onColorsChange: (colors: string[]) => void;
}

export function ColorSelector({ selectedColors, onColorsChange }: ColorSelectorProps) {
  const toggleColor = (colorName: string) => {
    const newColors = selectedColors.includes(colorName)
      ? selectedColors.filter(c => c !== colorName)
      : [...selectedColors, colorName];
    onColorsChange(newColors);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {colors.map((color) => (
        <Button
          key={color.name}
          type="button"
          variant={selectedColors.includes(color.name) ? "default" : "outline"}
          className={`h-12 ${selectedColors.includes(color.name) ? `${color.bg} ${color.text} hover:opacity-90` : ''}`}
          onClick={() => toggleColor(color.name)}
        >
          {color.name}
        </Button>
      ))}
    </div>
  );
}

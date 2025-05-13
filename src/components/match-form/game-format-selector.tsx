
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { GameFormat } from "@/types";

interface GameFormatSelectorProps {
  value: GameFormat;
  onChange: (value: GameFormat) => void;
  disabled?: boolean;
}

export function GameFormatSelector({ value, onChange, disabled = false }: GameFormatSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">Formato de Juego</h3>
      <RadioGroup 
        value={value} 
        onValueChange={(value) => onChange(value as GameFormat)} 
        className="flex flex-col space-y-1"
        disabled={disabled}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Infinity Constructor" id="infinity" disabled={disabled} />
          <Label htmlFor="infinity" className={disabled ? "opacity-60" : ""}>Infinity Constructor (Todas las expansiones)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Nuevas Expansiones" id="newExp" disabled={disabled} />
          <Label htmlFor="newExp" className={disabled ? "opacity-60" : ""}>Nuevas Expansiones (Últimas 5)</Label>
        </div>
      </RadioGroup>
    </div>
  );
}

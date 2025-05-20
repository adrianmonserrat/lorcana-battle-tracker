
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MatchFormat } from "@/types";

interface MatchFormatSelectorProps {
  value: MatchFormat;
  onChange: (value: MatchFormat) => void;
  disabled?: boolean;
}

export function MatchFormatSelector({ value, onChange, disabled = false }: MatchFormatSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">Formato de Partida</h3>
      <RadioGroup 
        value={value} 
        onValueChange={(value) => onChange(value as MatchFormat)} 
        className="grid grid-cols-2 gap-2"
        disabled={disabled}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="BO1" id="bo1" disabled={disabled} />
          <Label htmlFor="bo1" className={disabled ? "opacity-60" : ""}>BO1 (Mejor de 1)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="BO2" id="bo2" disabled={disabled} />
          <Label htmlFor="bo2" className={disabled ? "opacity-60" : ""}>BO2 (Mejor de 2)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="BO3" id="bo3" disabled={disabled} />
          <Label htmlFor="bo3" className={disabled ? "opacity-60" : ""}>BO3 (Mejor de 3)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="BO5" id="bo5" disabled={disabled} />
          <Label htmlFor="bo5" className={disabled ? "opacity-60" : ""}>BO5 (Mejor de 5)</Label>
        </div>
      </RadioGroup>
    </div>
  );
}

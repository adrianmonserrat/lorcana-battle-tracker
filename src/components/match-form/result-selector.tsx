
import { Button } from "@/components/ui/button";
import { Trophy, X } from "lucide-react";

interface ResultSelectorProps {
  value: 'Victoria' | 'Derrota' | '';
  onChange: (value: 'Victoria' | 'Derrota' | '') => void;
  disabled?: boolean;
}

export function ResultSelector({ value, onChange, disabled = false }: ResultSelectorProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">Resultado</h3>
      <div className="grid grid-cols-2 gap-4">
        <Button 
          type="button"
          variant={value === 'Victoria' ? 'default' : 'outline'} 
          className={`h-20 sm:h-24 ${value === 'Victoria' ? 'bg-lorcana-victory text-green-800 hover:bg-lorcana-victory/90' : ''}`}
          onClick={() => onChange('Victoria')}
          disabled={disabled}
        >
          <Trophy className="mr-2 h-5 w-5" />
          Victoria
        </Button>
        
        <Button 
          type="button"
          variant={value === 'Derrota' ? 'default' : 'outline'}
          className={`h-20 sm:h-24 ${value === 'Derrota' ? 'bg-lorcana-defeat text-red-800 hover:bg-lorcana-defeat/90' : ''}`}
          onClick={() => onChange('Derrota')}
          disabled={disabled}
        >
          <X className="mr-2 h-5 w-5" />
          Derrota
        </Button>
      </div>
    </div>
  );
}

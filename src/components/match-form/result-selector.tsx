
import { Button } from "@/components/ui/button";
import { Trophy, X, MinusCircle } from "lucide-react";
import { MatchFormat } from "@/types";

interface ResultSelectorProps {
  value: 'Victoria' | 'Derrota' | 'Empate' | '';
  onChange: (value: 'Victoria' | 'Derrota' | 'Empate' | '') => void;
  disabled?: boolean;
  matchFormat?: MatchFormat;
}

export function ResultSelector({ value, onChange, disabled = false, matchFormat }: ResultSelectorProps) {
  const showTieOption = matchFormat === 'BO2';
  
  return (
    <div className="space-y-2">
      <h3 className="font-medium">Resultado</h3>
      <div className={`grid ${showTieOption ? 'grid-cols-3' : 'grid-cols-2'} gap-2 sm:gap-4`}>
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
        
        {showTieOption && (
          <Button 
            type="button"
            variant={value === 'Empate' ? 'default' : 'outline'}
            className={`h-20 sm:h-24 ${value === 'Empate' ? 'bg-lorcana-tie text-amber-800 hover:bg-lorcana-tie/90' : ''}`}
            onClick={() => onChange('Empate')}
            disabled={disabled}
          >
            <MinusCircle className="mr-2 h-5 w-5" />
            Empate
          </Button>
        )}
        
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

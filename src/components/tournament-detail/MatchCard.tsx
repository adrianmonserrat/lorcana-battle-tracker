
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { Match } from "@/types";
import { Button } from "@/components/ui/button";

interface MatchCardProps {
  match: Match;
  onDelete: () => void;
}

export function MatchCard({ match, onDelete }: MatchCardProps) {
  let bgColor = '';
  let borderColor = '';
  let textColor = '';
  
  if (match.result === 'Victoria') {
    bgColor = 'bg-green-50';
    borderColor = 'border-green-200';
    textColor = 'text-green-700';
  } else if (match.result === 'Empate') {
    bgColor = 'bg-yellow-50';
    borderColor = 'border-yellow-200';
    textColor = 'text-yellow-700';
  } else {
    bgColor = 'bg-red-50';
    borderColor = 'border-red-200';
    textColor = 'text-red-700';
  }
  
  return (
    <div className={`p-4 rounded-md border-2 ${bgColor} ${borderColor} relative`}>
      <div className="absolute top-3 right-3 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 text-destructive hover:bg-destructive/10"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="pr-12">
        <div className="flex flex-col md:flex-row justify-between mb-3">
          <p className="font-medium">{format(match.date, "PPP", { locale: es })}</p>
          <span className={`font-bold ${textColor}`}>
            {match.result}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <p className="font-medium">Mi Mazo:</p>
            <p>{match.myDeck.name} ({match.myDeck.colors.join(', ')})</p>
          </div>
          <div>
            <p className="font-medium">Mazo Oponente:</p>
            <p>{match.opponentDeck.name} ({match.opponentDeck.colors.join(', ')})</p>
          </div>
        </div>
        
        <div>
          <p className="font-medium">Formato: {match.gameFormat}, {match.matchFormat}</p>
          {match.notes && (
            <div className="mt-2">
              <p className="font-medium">Notas:</p>
              <p className="text-muted-foreground">{match.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

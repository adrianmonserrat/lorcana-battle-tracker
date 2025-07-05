
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
    bgColor = 'bg-emerald-800/20';
    borderColor = 'border-emerald-600';
    textColor = 'text-emerald-400';
  } else if (match.result === 'Empate') {
    bgColor = 'bg-amber-800/20';
    borderColor = 'border-amber-600';
    textColor = 'text-amber-400';
  } else {
    bgColor = 'bg-red-800/20';
    borderColor = 'border-red-600';
    textColor = 'text-red-400';
  }
  
  return (
    <div className={`p-4 rounded-lg border-2 ${bgColor} ${borderColor} relative`}>
      <div className="flex flex-col md:flex-row justify-between mb-3">
        <p className="font-medium text-sm md:text-base">
          {format(match.date, "PPP", { locale: es })}
        </p>
        <span className={`font-bold text-sm md:text-base ${textColor}`}>
          {match.result}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        <div>
          <p className="font-medium text-sm">Mi Mazo:</p>
          <p className="text-sm">{match.myDeck.name} ({match.myDeck.colors.join(', ')})</p>
        </div>
        <div>
          <p className="font-medium text-sm">Mazo Oponente:</p>
          <p className="text-sm">{match.opponentDeck.name} ({match.opponentDeck.colors.join(', ')})</p>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="font-medium text-sm">Formato: {match.gameFormat}, {match.matchFormat}</p>
        {match.notes && (
          <div className="mt-2">
            <p className="font-medium text-sm">Notas:</p>
            <p className="text-muted-foreground text-sm">{match.notes}</p>
          </div>
        )}
      </div>

      {/* Botón de eliminar en la parte inferior */}
      <div className="flex justify-end pt-2 border-t border-border/20">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar
        </Button>
      </div>
    </div>
  );
}

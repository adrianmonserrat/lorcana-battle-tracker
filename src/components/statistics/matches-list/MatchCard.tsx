
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { EnhancedMatch } from "./types";
import { getInkColorHex } from "../utils";
import { useMatchRecords } from "@/hooks/useMatchRecords";

interface MatchCardProps {
  match: EnhancedMatch;
  onDeleteMatch: (matchId: string, tournamentId?: string) => void;
}

export function MatchCard({ match, onDeleteMatch }: MatchCardProps) {
  const { deleteMatch: deleteSupabaseMatch } = useMatchRecords();

  const handleDelete = async () => {
    try {
      if (!match.tournamentName) {
        // Es una partida de Supabase, usar el hook para eliminarla
        await deleteSupabaseMatch(match.id);
      } else {
        // Es una partida de torneo, usar el callback original
        onDeleteMatch(match.id, match.tournamentName);
      }
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  };

  return (
    <div className={`border-l-4 rounded-md border ${
      match.result === 'Victoria' 
        ? 'border-l-emerald-500' 
        : match.result === 'Empate' 
          ? 'border-l-amber-500' 
          : 'border-l-red-500'
    } p-4`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium text-lg">
            {match.result === 'Victoria' ? (
              <span className="text-emerald-500">Victoria</span>
            ) : match.result === 'Empate' ? (
              <span className="text-amber-500">Empate</span>
            ) : (
              <span className="text-red-500">Derrota</span>
            )}
            {match.tournamentName && (
              <span className="ml-2 text-sm text-muted-foreground">
                (Torneo: {match.tournamentName})
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {format(new Date(match.date), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
          </div>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Eliminar partida</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Estás seguro que quieres eliminar esta partida? Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDelete}
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <DeckInfo title="Mi Mazo" deck={match.myDeck} />
        <DeckInfo title="Mazo Rival" deck={match.opponentDeck} />
      </div>
      
      <div className="mt-2 text-sm">
        <span className="font-medium">Formato: </span>
        <span>{match.gameFormat} ({match.matchFormat})</span>
      </div>
      
      {match.notes && (
        <div className="mt-2">
          <h4 className="text-sm font-medium">Notas:</h4>
          <p className="text-xs whitespace-pre-wrap">{match.notes}</p>
        </div>
      )}
    </div>
  );
}

interface DeckInfoProps {
  title: string;
  deck: EnhancedMatch['myDeck'] | EnhancedMatch['opponentDeck'];
}

function DeckInfo({ title, deck }: DeckInfoProps) {
  return (
    <div>
      <h4 className="text-sm font-medium">{title}:</h4>
      <div className="flex flex-wrap gap-1 mt-1">
        {deck.colors.map((color) => (
          <span 
            key={color} 
            className="text-xs px-2 py-0.5 rounded-full" 
            style={{ 
              backgroundColor: getInkColorHex(color),
              color: ['Ambar', 'Zafiro', 'Esmeralda'].includes(color) ? '#000' : '#fff'
            }}
          >
            {color}
          </span>
        ))}
      </div>
      {deck.name && <p className="text-xs mt-1">{deck.name}</p>}
    </div>
  );
}

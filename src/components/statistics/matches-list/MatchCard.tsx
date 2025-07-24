
import { format } from "date-fns";
import { es, enUS, de, fr, it } from "date-fns/locale";
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
import { useLanguage } from "@/context/LanguageContext";

interface MatchCardProps {
  match: EnhancedMatch;
  onDeleteMatch: (matchId: string, tournamentId?: string) => void;
}

export function MatchCard({ match, onDeleteMatch }: MatchCardProps) {
  const { deleteMatch: deleteSupabaseMatch } = useMatchRecords();
  const { t, language } = useLanguage();
  
  // Get locale for date formatting
  const getLocale = () => {
    switch (language) {
      case 'en': return enUS;
      case 'de': return de;
      case 'fr': return fr;
      case 'it': return it;
      default: return es;
    }
  };

  const handleDelete = async () => {
    try {
      if (!match.tournamentName) {
        // Es una partida de Supabase - llamar primero al callback para actualización inmediata
        onDeleteMatch(match.id);
        // Luego eliminar de Supabase (esto se ejecuta en segundo plano)
        await deleteSupabaseMatch(match.id);
      } else {
        // Es una partida de torneo, usar el callback original
        onDeleteMatch(match.id, match.tournamentName);
      }
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  };

  // Determine result display text and color
  const getResultDisplay = () => {
    if (match.detailedResult) {
      if (match.detailedResult === 'Empate') {
        return { text: t('match.result.draw'), color: 'text-amber-500' };
      } else if (match.detailedResult === '2-0' || match.detailedResult === '2-1') {
        return { text: `${t('match.result.win')} ${match.detailedResult}`, color: 'text-emerald-500' };
      } else {
        return { text: `${t('match.result.loss')} ${match.detailedResult}`, color: 'text-red-500' };
      }
    } else {
      // Fallback to basic result
      return match.result === 'Victoria' 
        ? { text: t('match.result.win'), color: 'text-emerald-500' }
        : match.result === 'Empate' 
          ? { text: t('match.result.draw'), color: 'text-amber-500' }
          : { text: t('match.result.loss'), color: 'text-red-500' };
    }
  };

  const resultDisplay = getResultDisplay();

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
            <span className={resultDisplay.color}>{resultDisplay.text}</span>
            {match.tournamentName && (
              <span className="ml-2 text-sm text-muted-foreground">
                ({t('nav.tournaments')}: {match.tournamentName})
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            {format(new Date(match.date), "dd MMMM yyyy, HH:mm", { locale: getLocale() })}
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
              <AlertDialogTitle>{t('common.delete')} {t('nav.matches').toLowerCase()}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('deck.delete.description')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDelete}
              >
                {t('common.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <DeckInfo title={t('match.my_deck')} deck={match.myDeck} />
        <DeckInfo title={t('match.opponent_deck')} deck={match.opponentDeck} />
      </div>
      
      <div className="mt-2 text-sm space-y-1">
        <div>
          <span className="font-medium">{t('match.format')}: </span>
          <span>{match.gameFormat} ({match.matchFormat})</span>
        </div>
        {match.initialTurn && (
          <div>
            <span className="font-medium">{t('match.initial_turn')}: </span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              match.initialTurn === 'OTP' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
            }`}>
              {match.initialTurn === 'OTP' ? t('match.on_the_play') : t('match.on_the_draw')}
            </span>
          </div>
        )}
      </div>
      
      {match.notes && (
        <div className="mt-2">
          <h4 className="text-sm font-medium">{t('match.notes')}:</h4>
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

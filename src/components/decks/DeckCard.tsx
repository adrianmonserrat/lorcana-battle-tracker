
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { InkColor } from '@/types';
import { UserDeck } from '@/hooks/useUserDecks';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';

interface DeckCardProps {
  deck: UserDeck;
  onDelete: (id: string) => void;
}

export function DeckCard({ deck, onDelete }: DeckCardProps) {
  const { t } = useLanguage();
  const getColorClass = (color: InkColor) => {
    switch(color) {
      case 'Ambar': return 'bg-lorcana-amber/20 text-lorcana-amber border-lorcana-amber/30';
      case 'Amatista': return 'bg-lorcana-amethyst/20 text-lorcana-amethyst border-lorcana-amethyst/30';
      case 'Esmeralda': return 'bg-lorcana-emerald/20 text-lorcana-emerald border-lorcana-emerald/30';
      case 'Rubí': return 'bg-lorcana-ruby/20 text-lorcana-ruby border-lorcana-ruby/30';
      case 'Zafiro': return 'bg-lorcana-sapphire/20 text-lorcana-sapphire border-lorcana-sapphire/30';
      case 'Acero': return 'bg-lorcana-steel/20 text-lorcana-steel border-lorcana-steel/30';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{deck.name}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(deck.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {deck.colors.map((color) => (
              <span
                key={color}
                 className={`px-2 py-1 rounded-md text-xs font-medium border ${getColorClass(color)}`}
               >
                 {t(`colors.${color.toLowerCase().replace('í', 'i')}`)}
               </span>
            ))}
          </div>
          
          <div>
            <Badge variant="outline" className="text-xs">
              {deck.format}
            </Badge>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mt-3">
          {t('deck.created_at')} {new Date(deck.created_at).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}

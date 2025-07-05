
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { UserDeck } from '@/hooks/useUserDecks';

interface OpponentDeckSelectorProps {
  decks: UserDeck[];
  value: string;
  onChange: (deckId: string) => void;
  onDeckSelect: (deck: UserDeck | null) => void;
  label: string;
  placeholder: string;
  disabled?: boolean;
}

export function OpponentDeckSelector({ 
  decks, 
  value, 
  onChange, 
  onDeckSelect, 
  label, 
  placeholder, 
  disabled = false 
}: OpponentDeckSelectorProps) {
  const handleValueChange = (deckId: string) => {
    if (deckId === 'none') {
      onChange('');
      onDeckSelect(null);
    } else {
      onChange(deckId);
      const selectedDeck = decks.find(deck => deck.id === deckId) || null;
      onDeckSelect(selectedDeck);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={handleValueChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Sin mazo asignado</SelectItem>
          {decks.map((deck) => (
            <SelectItem key={deck.id} value={deck.id}>
              <div className="flex items-center gap-2">
                <span>{deck.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({deck.colors.join(', ')})
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

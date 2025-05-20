
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { InkColor, SavedDeck } from "@/types";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getInkColorHex } from "@/components/statistics/utils";

interface DeckInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onColorSelect?: (colors: InkColor[]) => void;
  placeholder: string;
  disabled?: boolean;
  decks?: SavedDeck[];
  allowSelectDeck?: boolean;
}

export function DeckInput({ 
  id, 
  label, 
  value, 
  onChange, 
  onColorSelect,
  placeholder, 
  disabled = false,
  decks = [],
  allowSelectDeck = false
}: DeckInputProps) {
  
  const handleDeckSelect = (deckId: string) => {
    const selectedDeck = decks.find(deck => deck.id === deckId);
    
    if (selectedDeck) {
      onChange(selectedDeck.name);
      if (onColorSelect) {
        onColorSelect(selectedDeck.colors);
      }
    } else if (deckId === "manual") {
      onChange("");
    }
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      
      {allowSelectDeck && decks.length > 0 ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Select onValueChange={handleDeckSelect} disabled={disabled}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar mazo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Mis Mazos</SelectLabel>
                  {decks.map(deck => (
                    <SelectItem key={deck.id} value={deck.id}>
                      <div className="flex items-center">
                        <span className="mr-2">{deck.name}</span>
                        <div className="flex -space-x-1">
                          {deck.colors.map(color => (
                            <div 
                              key={color} 
                              className="w-3 h-3 rounded-full border border-background" 
                              style={{ backgroundColor: getInkColorHex(color) }}
                            />
                          ))}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                  <SelectItem value="manual">Especificar manualmente</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          {value && (
            <Input 
              id={id} 
              placeholder={placeholder} 
              value={value}
              onChange={e => onChange(e.target.value)}
              disabled={disabled}
            />
          )}
        </div>
      ) : (
        <Input 
          id={id} 
          placeholder={placeholder} 
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
        />
      )}
    </div>
  );
}

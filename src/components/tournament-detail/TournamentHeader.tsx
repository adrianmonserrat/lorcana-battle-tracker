
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Tournament, SavedDeck } from "@/types";
import { useLorcana } from "@/context/lorcana/LorcanaProvider";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { getInkColorHex } from "@/components/statistics/utils";

interface TournamentHeaderProps {
  tournament: Tournament;
  onAddMatch: () => void;
}

export function TournamentHeader({ tournament, onAddMatch }: TournamentHeaderProps) {
  const { decks, setTournamentDeck } = useLorcana();
  
  const handleDeckSelect = (deckId: string | undefined) => {
    setTournamentDeck(tournament.id, deckId === "none" ? undefined : deckId);
  };
  
  const selectedDeck = tournament.selectedDeckId 
    ? decks.find(d => d.id === tournament.selectedDeckId) 
    : undefined;
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">{tournament.name}</h1>
        <p className="text-muted-foreground">
          {format(tournament.date, "PPP", { locale: es })}
          {tournament.location && ` - ${tournament.location}`}
        </p>
        
        {decks.length > 0 && (
          <div className="mt-2">
            <Select 
              onValueChange={handleDeckSelect} 
              defaultValue={tournament.selectedDeckId || "none"}
            >
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Seleccionar mazo para el torneo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Mazo para todo el torneo</SelectLabel>
                  <SelectItem value="none">Sin mazo seleccionado</SelectItem>
                  {decks.map((deck: SavedDeck) => (
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
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <Button onClick={onAddMatch}>Agregar Partida</Button>
    </div>
  );
}

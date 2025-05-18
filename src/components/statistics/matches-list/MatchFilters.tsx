
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InkColor, GameFormat, SavedDeck } from "@/types";
import { getInkColorHex } from "../utils";

interface MatchFiltersProps {
  colorFilter: string;
  setColorFilter: (value: string) => void;
  sourceFilter: string;
  setSourceFilter: (value: string) => void;
  formatFilter: string;
  setFormatFilter: (value: string) => void;
  deckFilter: string;
  setDeckFilter: (value: string) => void;
  allUsedColors: Set<string>;
  allGameFormats: Set<string>;
  decks: SavedDeck[];
}

export function MatchFilters({
  colorFilter,
  setColorFilter,
  sourceFilter, 
  setSourceFilter,
  formatFilter,
  setFormatFilter,
  deckFilter,
  setDeckFilter,
  allUsedColors,
  allGameFormats,
  decks
}: MatchFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-2">
      <Select value={colorFilter} onValueChange={setColorFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filtrar por color" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los colores</SelectItem>
          {[...allUsedColors].map((color) => (
            <SelectItem 
              key={color} 
              value={color}
              className="flex items-center gap-2"
            >
              <span 
                className="inline-block w-4 h-4 rounded-full mr-2"
                style={{ 
                  backgroundColor: getInkColorHex(color) 
                }}
              ></span>
              {color}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={sourceFilter} onValueChange={setSourceFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filtrar por origen" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los orígenes</SelectItem>
          <SelectItem value="freeplay">Partidas libres</SelectItem>
          <SelectItem value="tournament">Partidas de torneo</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={formatFilter} onValueChange={setFormatFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filtrar por formato" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los formatos</SelectItem>
          {[...allGameFormats].map(format => (
            <SelectItem key={format} value={format}>{format}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {decks.length > 0 && (
        <Select value={deckFilter} onValueChange={setDeckFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrar por mazo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los mazos</SelectItem>
            {decks.map(deck => (
              <SelectItem key={deck.id} value={deck.id}>
                <div className="flex items-center">
                  <span>{deck.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

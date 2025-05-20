
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Tournament } from "@/types";

interface TournamentHeaderProps {
  tournament: Tournament;
  onAddMatch: () => void;
}

export function TournamentHeader({ tournament, onAddMatch }: TournamentHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">{tournament.name}</h1>
        <p className="text-muted-foreground">
          {format(tournament.date, "PPP", { locale: es })}
          {tournament.location && ` - ${tournament.location}`}
        </p>
      </div>
      
      <Button onClick={onAddMatch}>Agregar Partida</Button>
    </div>
  );
}


import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tournament } from "@/types";
import { MatchCard } from "./MatchCard";

interface TournamentMatchesProps {
  tournament: Tournament;
  onDeleteMatch: (matchId: string) => void;
}

export function TournamentMatches({ tournament, onDeleteMatch }: TournamentMatchesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Partidas del Torneo</CardTitle>
      </CardHeader>
      <CardContent>
        {tournament.matches.length > 0 ? (
          <div className="space-y-4">
            {tournament.matches.map((match) => (
              <MatchCard 
                key={match.id} 
                match={match} 
                onDelete={() => onDeleteMatch(match.id)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No hay partidas registradas para este torneo
          </div>
        )}
      </CardContent>
    </Card>
  );
}

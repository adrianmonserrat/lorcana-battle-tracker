
import { useLorcana } from "@/context/LorcanaContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { Match } from "@/types";

interface TournamentDetailProps {
  tournamentId: string;
  onAddMatch: () => void;
}

export function TournamentDetail({ tournamentId, onAddMatch }: TournamentDetailProps) {
  const { tournaments } = useLorcana();
  const tournament = tournaments.find(t => t.id === tournamentId);
  
  if (!tournament) {
    return <div>Torneo no encontrado</div>;
  }
  
  const victories = tournament.matches.filter(m => m.result === 'Victoria').length;
  const defeats = tournament.matches.filter(m => m.result === 'Derrota').length;
  const winRate = tournament.matches.length > 0 
    ? Math.round((victories / tournament.matches.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total de Partidas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{tournament.matches.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Victorias / Derrotas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              <span className="text-emerald-600">{victories}</span> / 
              <span className="text-red-600">{defeats}</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">% de Victoria</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{winRate}%</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Partidas del Torneo</CardTitle>
        </CardHeader>
        <CardContent>
          {tournament.matches.length > 0 ? (
            <div className="space-y-4">
              {tournament.matches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No hay partidas registradas para este torneo
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MatchCard({ match }: { match: Match }) {
  const isVictory = match.result === 'Victoria';
  
  return (
    <div className={`p-4 rounded-md border ${isVictory ? 'bg-lorcana-victory/30 border-lorcana-victory' : 'bg-lorcana-defeat/30 border-lorcana-defeat'}`}>
      <div className="flex flex-col md:flex-row justify-between mb-2">
        <p className="font-medium">{format(match.date, "PPP", { locale: es })}</p>
        <span className={`font-bold ${isVictory ? 'text-emerald-700' : 'text-red-700'}`}>
          {match.result}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-medium">Mi Mazo:</p>
          <p>{match.myDeck.name} ({match.myDeck.colors.join(', ')})</p>
        </div>
        <div>
          <p className="font-medium">Mazo Oponente:</p>
          <p>{match.opponentDeck.name} ({match.opponentDeck.colors.join(', ')})</p>
        </div>
      </div>
      
      <div className="mt-2">
        <p className="font-medium">Formato: {match.gameFormat}, {match.matchFormat}</p>
        {match.notes && (
          <div className="mt-2">
            <p className="font-medium">Notas:</p>
            <p className="text-muted-foreground">{match.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

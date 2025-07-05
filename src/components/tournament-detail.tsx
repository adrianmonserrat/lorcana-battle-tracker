
import { useLorcana } from "@/context/lorcana/LorcanaProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Match } from "@/types";
import { Trash2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { useState } from "react";

interface TournamentDetailProps {
  tournamentId: string;
  onAddMatch: () => void;
}

export function TournamentDetail({ tournamentId, onAddMatch }: TournamentDetailProps) {
  const { tournaments, deleteMatch } = useLorcana();
  const [matchToDelete, setMatchToDelete] = useState<string | null>(null);
  const tournament = tournaments.find(t => t.id === tournamentId);
  
  if (!tournament) {
    return <div>Torneo no encontrado</div>;
  }
  
  const victories = tournament.matches.filter(m => m.result === 'Victoria').length;
  const defeats = tournament.matches.filter(m => m.result === 'Derrota').length;
  const ties = tournament.matches.filter(m => m.result === 'Empate').length;
  const winRate = tournament.matches.length > 0 
    ? Math.round((victories / tournament.matches.length) * 100) 
    : 0;

  const handleDeleteMatch = () => {
    if (matchToDelete) {
      deleteMatch(matchToDelete, tournamentId);
      setMatchToDelete(null);
    }
  };

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
            <CardTitle className="text-lg">V / E / D</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              <span className="text-emerald-600">{victories}</span> / 
              <span className="text-amber-600">{ties}</span> / 
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
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  onDelete={() => setMatchToDelete(match.id)} 
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

      <Dialog open={!!matchToDelete} onOpenChange={(open) => !open && setMatchToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Partida</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta partida? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMatchToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteMatch}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MatchCard({ match, onDelete }: { match: Match; onDelete: () => void }) {
  let bgColor = '';
  let borderColor = '';
  let textColor = '';
  
  if (match.result === 'Victoria') {
    bgColor = 'bg-emerald-800/20';
    borderColor = 'border-emerald-600';
    textColor = 'text-emerald-400';
  } else if (match.result === 'Empate') {
    bgColor = 'bg-amber-800/20';
    borderColor = 'border-amber-600';
    textColor = 'text-amber-400';
  } else {
    bgColor = 'bg-red-800/20';
    borderColor = 'border-red-600';
    textColor = 'text-red-400';
  }
  
  return (
    <div className={`p-4 rounded-lg border-2 ${bgColor} ${borderColor} relative`}>
      <div className="flex flex-col md:flex-row justify-between mb-3">
        <p className="font-medium text-sm md:text-base">
          {format(match.date, "PPP", { locale: es })}
        </p>
        <span className={`font-bold text-sm md:text-base ${textColor}`}>
          {match.result}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        <div>
          <p className="font-medium text-sm">Mi Mazo:</p>
          <p className="text-sm">{match.myDeck.name} ({match.myDeck.colors.join(', ')})</p>
        </div>
        <div>
          <p className="font-medium text-sm">Mazo Oponente:</p>
          <p className="text-sm">{match.opponentDeck.name} ({match.opponentDeck.colors.join(', ')})</p>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="font-medium text-sm">Formato: {match.gameFormat}, {match.matchFormat}</p>
        {match.notes && (
          <div className="mt-2">
            <p className="font-medium text-sm">Notas:</p>
            <p className="text-muted-foreground text-sm">{match.notes}</p>
          </div>
        )}
      </div>

      {/* Botón de eliminar en la parte inferior */}
      <div className="flex justify-end pt-2 border-t border-border/20">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar
        </Button>
      </div>
    </div>
  );
}

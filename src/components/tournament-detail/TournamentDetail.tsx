
import { useState } from 'react';
import { useLorcana } from "@/context/lorcana/LorcanaProvider";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TournamentHeader } from "./TournamentHeader";
import { TournamentStats } from "./TournamentStats";
import { TournamentMatches } from "./TournamentMatches";

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
  
  const handleDeleteMatch = () => {
    if (matchToDelete) {
      deleteMatch(matchToDelete, tournamentId);
      setMatchToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <TournamentHeader tournament={tournament} onAddMatch={onAddMatch} />
      <TournamentStats tournament={tournament} />
      <TournamentMatches 
        tournament={tournament} 
        onDeleteMatch={(matchId) => setMatchToDelete(matchId)}
      />

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

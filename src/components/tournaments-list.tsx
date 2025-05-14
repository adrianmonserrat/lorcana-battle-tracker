
import { useState } from "react";
import { useLorcana } from "@/context/lorcana/LorcanaProvider";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export function TournamentsList() {
  const { tournaments, deleteTournament } = useLorcana();
  const navigate = useNavigate();
  const [tournamentToDelete, setTournamentToDelete] = useState<string | null>(null);
  
  const handleDeleteTournament = () => {
    if (tournamentToDelete) {
      deleteTournament(tournamentToDelete);
      setTournamentToDelete(null);
    }
  };
  
  if (tournaments.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-4">No hay torneos registrados</h2>
        <Button onClick={() => navigate("/torneos/nuevo")}>Crear Nuevo Torneo</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mis Torneos</h1>
        <Button onClick={() => navigate("/torneos/nuevo")}>Crear Nuevo Torneo</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tournaments.map(tournament => {
          const victories = tournament.matches.filter(m => m.result === 'Victoria').length;
          const defeats = tournament.matches.filter(m => m.result === 'Derrota').length;
          const ties = tournament.matches.filter(m => m.result === 'Empate').length;
          
          return (
            <Card key={tournament.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{tournament.name}</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => setTournamentToDelete(tournament.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Eliminar Torneo</DialogTitle>
                        <DialogDescription>
                          ¿Estás seguro de que deseas eliminar este torneo? Esta acción no se puede deshacer.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setTournamentToDelete(null)}>
                          Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteTournament}>
                          Eliminar
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(tournament.date, "PPP", { locale: es })}
                  {tournament.location && ` - ${tournament.location}`}
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Partidas</p>
                    <p className="text-xl font-bold">{tournament.matches.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">V / E / D</p>
                    <p className="text-xl font-bold">
                      <span className="text-emerald-600">{victories}</span> / 
                      <span className="text-amber-600">{ties}</span> / 
                      <span className="text-red-600">{defeats}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">% Victoria</p>
                    <p className="text-xl font-bold">
                      {tournament.matches.length > 0 
                        ? Math.round((victories / tournament.matches.length) * 100) 
                        : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="bg-muted/50 mt-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/torneos/${tournament.id}`)}
                >
                  Ver Detalles
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

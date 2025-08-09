
import { useState } from "react";
import { useLorcana } from "@/context/lorcana/LorcanaProvider";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { es, enUS, de, fr, it } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export function TournamentsList() {
  const { tournaments, deleteTournament } = useLorcana();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const localeMap = { es, en: enUS, de, fr, it } as const;
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
        <h2 className="text-xl font-medium mb-4">{t('tournament.empty')}</h2>
        <Button onClick={() => navigate("/torneos/nuevo")}>{t('tournament.create')}</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('tournament.title')}</h1>
        <Button onClick={() => navigate("/torneos/nuevo")}>{t('tournament.create')}</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tournaments.map(tournament => {
          const victories = tournament.matches.filter(m => m.result === 'Victoria').length;
          const defeats = tournament.matches.filter(m => m.result === 'Derrota').length;
          const ties = tournament.matches.filter(m => m.result === 'Empate').length;
          const points = victories * 3;
          const progress = tournament.totalMatches > 0
            ? Math.round((tournament.matches.length / tournament.totalMatches) * 100)
            : 0;
          
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
                        <DialogTitle>{t('tournament.delete.title')}</DialogTitle>
                        <DialogDescription>
                          {t('tournament.delete.description')}
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setTournamentToDelete(null)}>
                          {t('common.cancel')}
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteTournament}>
                          {t('tournament.delete.submit')}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(tournament.date, "PPP", { locale: localeMap[language] })}
                  {tournament.location && ` - ${tournament.location}`}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{t('tournament.progress')}: {tournament.matches.length}/{tournament.totalMatches}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('tournament.points')}</p>
                    <p className="text-xl font-bold text-blue-600">{points}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('tournament.record')}</p>
                    <p className="text-lg font-bold">
                      <span className="text-emerald-600">{victories}</span> / 
                      <span className="text-amber-600">{ties}</span> / 
                      <span className="text-red-600">{defeats}</span>
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
                  {t('tournament.view_details')}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

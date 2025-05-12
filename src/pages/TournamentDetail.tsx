
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { TournamentDetail as TournamentDetailComponent } from '@/components/tournament-detail';
import { MatchForm } from '@/components/match-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const TournamentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isAddingMatch, setIsAddingMatch] = useState(false);
  
  if (!id) {
    navigate('/torneos');
    return null;
  }
  
  return (
    <div className="min-h-screen">
      <header className="border-b p-4">
        <div className="container max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Contador Lorcana</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/torneos')}>
              Volver a Torneos
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="container max-w-6xl mx-auto p-4 md:p-6">
        <TournamentDetailComponent 
          tournamentId={id} 
          onAddMatch={() => setIsAddingMatch(true)} 
        />
        
        <Dialog open={isAddingMatch} onOpenChange={setIsAddingMatch}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Agregar Partida al Torneo</DialogTitle>
            </DialogHeader>
            <MatchForm 
              tournamentId={id} 
              onSuccess={() => setIsAddingMatch(false)} 
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default TournamentDetail;

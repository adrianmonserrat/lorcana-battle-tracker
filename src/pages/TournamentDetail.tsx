
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { TournamentDetailComponent } from '@/components/tournament-detail';
import { MatchForm } from '@/components/match-form';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

const TournamentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isAddingMatch, setIsAddingMatch] = useState(false);
  const isMobile = useIsMobile();
  
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
        
        {isMobile ? (
          <Sheet open={isAddingMatch} onOpenChange={setIsAddingMatch}>
            <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Agregar Partida al Torneo</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-full pr-4">
                <MatchForm 
                  tournamentId={id} 
                  onSuccess={() => setIsAddingMatch(false)} 
                />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        ) : (
          <Sheet open={isAddingMatch} onOpenChange={setIsAddingMatch}>
            <SheetContent className="w-[95%] sm:max-w-[600px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Agregar Partida al Torneo</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-120px)] pr-4">
                <MatchForm 
                  tournamentId={id} 
                  onSuccess={() => setIsAddingMatch(false)} 
                />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        )}
      </main>
    </div>
  );
};

export default TournamentDetail;

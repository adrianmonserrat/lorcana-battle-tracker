
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TournamentDetail as TournamentDetailComponent } from '@/components/tournament-detail';
import { MatchForm } from '@/components/match-form';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MainHeader } from '@/components/layouts/main-header';

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
      <MainHeader 
        showTourneosButton={false}
        showPartidasButton={false}
        alternateButtonText="Volver a Torneos"
        alternateButtonAction={() => navigate('/torneos')}
      />
      
      <main className="container max-w-6xl mx-auto p-4 md:p-6">
        <TournamentDetailComponent
          tournamentId={id} 
          onAddMatch={() => setIsAddingMatch(true)} 
        />
        
        {isMobile ? (
          <Sheet open={isAddingMatch} onOpenChange={setIsAddingMatch}>
            <SheetContent side="bottom" className="h-[90vh] pb-8 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Agregar Partida al Torneo</SheetTitle>
                <SheetDescription>
                  Completa el formulario para registrar una nueva partida
                </SheetDescription>
              </SheetHeader>
              <ScrollArea className="h-full pr-4 mt-4">
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
                <SheetDescription>
                  Completa el formulario para registrar una nueva partida
                </SheetDescription>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-150px)] pr-4 mt-4">
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

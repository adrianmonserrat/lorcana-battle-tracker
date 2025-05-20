
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { TournamentsList as TournamentsListComponent } from '@/components/tournaments-list';

const TournamentsList = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen">
      <header className="border-b p-4">
        <div className="container max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Contador Lorcana</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/')}>
              Partidas
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="container max-w-6xl mx-auto p-4 md:p-6">
        <TournamentsListComponent />
      </main>
    </div>
  );
};

export default TournamentsList;

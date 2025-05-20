
import { useNavigate } from 'react-router-dom';
import { TournamentsList as TournamentsListComponent } from '@/components/tournaments-list';
import { MainHeader } from '@/components/layouts/main-header';

const TournamentsList = () => {
  return (
    <div className="min-h-screen">
      <MainHeader showPartidasButton={true} showTourneosButton={false} />
      
      <main className="container max-w-6xl mx-auto p-4 md:p-6">
        <TournamentsListComponent />
      </main>
    </div>
  );
};

export default TournamentsList;

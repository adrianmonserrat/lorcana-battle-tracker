
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { TournamentForm } from '@/components/tournament-form';

const TournamentNew = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSuccess = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      navigate('/torneos');
    }, 500);
  };
  
  return (
    <div className="min-h-screen">
      <header className="border-b p-4">
        <div className="container max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Contador Lorcana</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/torneos')} disabled={isSubmitting}>
              Volver a Torneos
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="container max-w-6xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Crear Nuevo Torneo</h2>
        </div>
        
        <TournamentForm onSuccess={handleSuccess} />
      </main>
    </div>
  );
};

export default TournamentNew;


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainHeader } from '@/components/layouts/main-header';
import { TournamentForm } from '@/components/tournament-form';
import { useLanguage } from '@/context/LanguageContext';

const TournamentNew = () => {
const navigate = useNavigate();
const [isSubmitting, setIsSubmitting] = useState(false);
const { t } = useLanguage();
  
  const handleSuccess = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      navigate('/torneos');
    }, 500);
  };
  
  return (
    <div className="min-h-screen">
      <MainHeader 
        showTourneosButton={false}
        showPartidasButton={false}
        alternateButtonText={`${t('common.back')} ${t('tournament.title')}`}
        alternateButtonAction={() => navigate('/torneos')}
      />
      
      <main className="container max-w-6xl mx-auto p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold">{t('tournament.create')}</h2>
        </div>
        
        <TournamentForm onSuccess={handleSuccess} />
      </main>
    </div>
  );
};

export default TournamentNew;

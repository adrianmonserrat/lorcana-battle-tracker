
import { useState } from 'react';
import { MainHeader } from '@/components/layouts/main-header';
import { MainTabs } from '@/components/main-tabs';
import { AuthModal } from '@/components/auth/AuthModal';

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  return (
    <div className="min-h-screen bg-background">
      <MainHeader 
        showTourneosButton={true} 
        showPartidasButton={false} 
        showMisMazosButton={false}
      />
      
      <main className="container max-w-7xl mx-auto p-2 sm:p-4 md:p-6">
        <MainTabs onShowAuth={() => setShowAuthModal(true)} />
        
        <AuthModal 
          open={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </main>
    </div>
  );
};

export default Index;

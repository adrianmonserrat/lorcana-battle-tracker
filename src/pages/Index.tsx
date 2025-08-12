
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MainHeader } from '@/components/layouts/main-header';
import { MatchForm } from '@/components/match-form';
import { Statistics } from '@/components/statistics';
import { DecksSection } from '@/components/decks/DecksSection';
import { DeckStatistics } from '@/components/decks/DeckStatistics';
import { useAuth } from '@/components/auth/AuthProvider';
import { useLanguage } from '@/context/LanguageContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdsenseBanner } from '@/components/ads/AdsenseBanner';

const Index = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('registrarPartida');
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  return (
    <div className="min-h-screen bg-background">
      <MainHeader 
        showTourneosButton={true} 
        showPartidasButton={false} 
        showMisMazosButton={false}
      />
      
      <main className="container max-w-7xl mx-auto p-2 sm:p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto mb-6 sm:mb-8">
            <TabsList className="grid grid-cols-3 min-w-[500px] sm:min-w-0 h-auto">
              <TabsTrigger value="registrarPartida" className="text-xs sm:text-sm p-2 sm:p-3">
                <span className="hidden sm:inline">{t('tabs.register_match')}</span>
                <span className="sm:hidden">{t('tabs.register_match.short')}</span>
              </TabsTrigger>
              <TabsTrigger value="estadisticas" className="text-xs sm:text-sm p-2 sm:p-3">
                <span className="hidden sm:inline">{t('tabs.statistics')}</span>
                <span className="sm:hidden">{t('tabs.statistics.short')}</span>
              </TabsTrigger>
              <TabsTrigger value="misMazos" className="text-xs sm:text-sm p-2 sm:p-3">
                <span className="hidden sm:inline">{t('tabs.my_decks')}</span>
                <span className="sm:hidden">{t('tabs.my_decks.short')}</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Banner publicitario debajo de las pestañas */}
          <div className="mb-6">
            {/* TODO: Reemplaza "" por tu data-ad-slot numérico cuando lo compartas */}
            <AdsenseBanner slot={""} />
          </div>
          
          <TabsContent value="registrarPartida" className="mt-0">
            <MatchForm />
          </TabsContent>
          
          <TabsContent value="estadisticas" className="mt-0">
            <Statistics />
          </TabsContent>
          
          <TabsContent value="misMazos" className="mt-0">
            {!user ? (
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle className="text-center text-lg sm:text-xl">{t('auth.access_required')}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4 p-4 sm:p-6">
                  <p className="text-muted-foreground text-sm sm:text-base">
                    {t('auth.login_required_decks')}
                  </p>
                  <Button onClick={() => setShowAuthModal(true)} className="w-full sm:w-auto">
                    {t('nav.login')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="mazos" className="w-full">
                <div className="overflow-x-auto mb-4 sm:mb-6">
                  <TabsList className="grid w-full grid-cols-2 min-w-[300px] sm:min-w-0">
                    <TabsTrigger value="mazos" className="text-xs sm:text-sm">
                      <span className="hidden sm:inline">{t('tabs.deck_management')}</span>
                      <span className="sm:hidden">{t('tabs.deck_management.short')}</span>
                    </TabsTrigger>
                    <TabsTrigger value="estadisticas" className="text-xs sm:text-sm">
                      <span className="hidden sm:inline">{t('tabs.deck_statistics')}</span>
                      <span className="sm:hidden">{t('tabs.deck_statistics.short')}</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="mazos" className="mt-0">
                  <DecksSection />
                </TabsContent>
                
                <TabsContent value="estadisticas" className="mt-0">
                  <DeckStatistics />
                </TabsContent>
              </Tabs>
            )}
          </TabsContent>
        </Tabs>
        
        <AuthModal 
          open={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </main>
    </div>
  );
};

export default Index;

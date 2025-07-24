
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DeckForm } from './DeckForm';
import { DeckCard } from './DeckCard';
import { useUserDecks } from '@/hooks/useUserDecks';
import { useLanguage } from '@/context/LanguageContext';

export function DecksSection() {
  const [showForm, setShowForm] = useState(false);
  const { decks, loading, createDeck, deleteDeck } = useUserDecks();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('tabs.my_decks')}</CardTitle>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t('deck.create_new')}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground">{t('deck.loading')}</p>
          ) : decks.length === 0 ? (
            <p className="text-center text-muted-foreground">
              {t('deck.no_decks_message')}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {decks.map((deck) => (
                <DeckCard
                  key={deck.id}
                  deck={deck}
                  onDelete={deleteDeck}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <DeckForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={createDeck}
      />
    </div>
  );
}

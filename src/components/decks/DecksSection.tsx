
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DeckForm } from './DeckForm';
import { DecksHeader } from './DecksHeader';
import { DeckList } from './DeckList';
import { useUserDecks } from '@/hooks/useUserDecks';

export function DecksSection() {
  const [showForm, setShowForm] = useState(false);
  const { decks, loading, createDeck, deleteDeck } = useUserDecks();

  return (
    <div className="space-y-6">
      <Card>
        <DecksHeader onCreateDeck={() => setShowForm(true)} />
        <CardContent>
          <DeckList 
            decks={decks}
            loading={loading}
            onDelete={deleteDeck}
          />
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

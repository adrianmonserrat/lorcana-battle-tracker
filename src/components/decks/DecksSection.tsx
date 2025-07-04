
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DeckForm } from './DeckForm';
import { DeckCard } from './DeckCard';
import { useUserDecks } from '@/hooks/useUserDecks';

export function DecksSection() {
  const [showForm, setShowForm] = useState(false);
  const { decks, loading, createDeck, deleteDeck } = useUserDecks();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Mis Mazos</CardTitle>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Nuevo Mazo
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground">Cargando mazos...</p>
          ) : decks.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No tienes mazos creados. ¡Crea tu primer mazo!
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


import { DeckCard } from './DeckCard';
import { UserDeck } from '@/hooks/useUserDecks';

interface DeckListProps {
  decks: UserDeck[];
  loading: boolean;
  onDelete: (deckId: string) => void;
}

export function DeckList({ decks, loading, onDelete }: DeckListProps) {
  if (loading) {
    return <p className="text-center text-muted-foreground">Cargando mazos...</p>;
  }

  if (decks.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No tienes mazos creados. ¡Crea tu primer mazo!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {decks.map((deck) => (
        <DeckCard
          key={deck.id}
          deck={deck}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

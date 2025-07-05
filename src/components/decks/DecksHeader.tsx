
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface DecksHeaderProps {
  onCreateDeck: () => void;
}

export function DecksHeader({ onCreateDeck }: DecksHeaderProps) {
  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle>Mis Mazos</CardTitle>
        <Button onClick={onCreateDeck}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Nuevo Mazo
        </Button>
      </div>
    </CardHeader>
  );
}


import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InkColor } from '@/types';
import { ColorSelector } from '@/components/match-form/color-selector';

interface DeckFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, colors: InkColor[]) => Promise<void>;
}

export function DeckForm({ open, onClose, onSubmit }: DeckFormProps) {
  const [name, setName] = useState('');
  const [colors, setColors] = useState<InkColor[]>([]);
  const [loading, setLoading] = useState(false);

  const handleColorToggle = (color: InkColor) => {
    setColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color) 
        : [...prev, color]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }
    if (colors.length === 0) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(name.trim(), colors);
      setName('');
      setColors([]);
      onClose();
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setColors([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Mazo</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="deckName">Nombre del Mazo</Label>
            <Input
              id="deckName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Control Ambar/Amatista"
              disabled={loading}
            />
          </div>
          
          <ColorSelector
            selectedColors={colors}
            onColorToggle={handleColorToggle}
            label="Colores del Mazo"
            id="deck"
            disabled={loading}
          />
          
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !name.trim() || colors.length === 0}
              className="flex-1"
            >
              {loading ? 'Creando...' : 'Crear Mazo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

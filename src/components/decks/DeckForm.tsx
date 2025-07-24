
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InkColor } from '@/types';
import { ColorSelector } from '@/components/match-form/color-selector';
import { UserDeck } from '@/hooks/useUserDecks';
import { sanitizeInput } from '@/lib/security';
import { useLanguage } from '@/context/LanguageContext';

interface DeckFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, colors: InkColor[]) => Promise<UserDeck>;
}

export function DeckForm({ open, onClose, onSubmit }: DeckFormProps) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [colors, setColors] = useState<InkColor[]>([]);
  const [loading, setLoading] = useState(false);

  const handleColorsChange = (selectedColors: string[]) => {
    setColors(selectedColors as InkColor[]);
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
          <DialogTitle>{t('deck.form.title')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="deckName">{t('deck.form.name')}</Label>
            <Input
              id="deckName"
              value={name}
              onChange={(e) => setName(sanitizeInput(e.target.value))}
              placeholder={t('deck.form.name.placeholder')}
              disabled={loading}
              maxLength={50}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>{t('deck.form.colors')}</Label>
            <ColorSelector
              selectedColors={colors}
              onColorsChange={handleColorsChange}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              {t('deck.form.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !name.trim() || colors.length === 0}
              className="flex-1"
            >
              {loading ? t('deck.form.submitting') : t('deck.form.submit')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

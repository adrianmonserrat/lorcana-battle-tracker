
import { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { useUserDecks } from '@/hooks/useUserDecks';
import { useAuth } from '@/components/auth/AuthProvider';
import { ColorSelector } from './color-selector';
import { useLanguage } from '@/context/LanguageContext';

interface DeckSelectorProps {
  form: UseFormReturn<any>;
}

export function DeckSelector({ form }: DeckSelectorProps) {
  const { user } = useAuth();
  const { decks, loading } = useUserDecks();
  const [selectionMode, setSelectionMode] = useState<'existing' | 'manual'>('existing');
  const { t } = useLanguage();

  const handleModeChange = (mode: 'existing' | 'manual') => {
    setSelectionMode(mode);
    if (mode === 'manual') {
      // Limpiar valores cuando cambiamos a manual
      form.setValue('userDeckId', undefined);
      form.setValue('userDeckName', '');
      form.setValue('userDeckColors', []);
    } else {
      // Limpiar valores cuando cambiamos a existing
      form.setValue('userDeckName', '');
      form.setValue('userDeckColors', []);
    }
  };

  const handleExistingDeckSelect = (deckId: string) => {
    const selectedDeck = decks.find(deck => deck.id === deckId);
    if (selectedDeck) {
      form.setValue('userDeckId', deckId);
      form.setValue('userDeckName', selectedDeck.name);
      form.setValue('userDeckColors', selectedDeck.colors);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <FormLabel>{t('match.deck_configuration')}</FormLabel>
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => handleModeChange('existing')}
            className={`px-3 py-1 text-sm rounded ${
              selectionMode === 'existing' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
            disabled={!user}
          >
            {t('match.existing_deck')}
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('manual')}
            className={`px-3 py-1 text-sm rounded ${
              selectionMode === 'manual' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {t('match.manual')}
          </button>
        </div>
      </div>

      {selectionMode === 'existing' && (
        <FormField
          control={form.control}
          name="userDeckId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('match.select_existing_deck')}</FormLabel>
              <FormControl>
                <Select
                  value={field.value || ""}
                  onValueChange={handleExistingDeckSelect}
                  disabled={loading || !user}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !user 
                        ? t('match.login_to_select_deck')
                        : loading 
                          ? t('deck.loading')
                          : t('match.select_deck')
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {!user ? (
                      <SelectItem value="no-user" disabled>
                        {t('match.login_to_see_decks')}
                      </SelectItem>
                    ) : loading ? (
                      <SelectItem value="loading" disabled>
                        {t('common.loading')}
                      </SelectItem>
                    ) : decks.length === 0 ? (
                      <SelectItem value="no-decks" disabled>
                        {t('deck.no_decks_created')}
                      </SelectItem>
                    ) : (
                      decks.map((deck) => (
                        <SelectItem key={deck.id} value={deck.id}>
                          {deck.name} ({deck.colors.join(', ')})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="userDeckName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('match.deck_name')}</FormLabel>
            <FormControl>
              <Input 
                placeholder={t('match.deck_name_placeholder')}
                {...field}
                disabled={selectionMode === 'existing'}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="userDeckColors"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('match.deck_colors')}</FormLabel>
            <FormControl>
              <ColorSelector
                selectedColors={field.value || []}
                onColorsChange={field.onChange}
                disabled={selectionMode === 'existing'}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

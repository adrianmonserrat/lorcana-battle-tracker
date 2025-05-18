
import { useMatchForm } from './use-match-form';
import { GameFormatSelector } from './game-format-selector';
import { ColorSelector } from './color-selector';
import { DeckInput } from './deck-input';
import { MatchFormatSelector } from './match-format-selector';
import { ResultSelector } from './result-selector';
import { NotesInput } from './notes-input';

interface MatchFormContentProps {
  tournamentId?: string;
}

export function MatchFormContent({ tournamentId }: MatchFormContentProps) {
  const {
    gameFormat,
    setGameFormat,
    matchFormat,
    setMatchFormat,
    myDeckName,
    setMyDeckName,
    opponentDeckName,
    setOpponentDeckName,
    myColors,
    setMyColors,
    opponentColors,
    handleMyColorToggle,
    handleOpponentColorToggle,
    result,
    setResult,
    notes,
    setNotes,
    isSubmitting,
    tournamentDeck,
    filteredDecks
  } = useMatchForm({ tournamentId });

  return (
    <>
      {/* Game Format */}
      <GameFormatSelector 
        value={gameFormat}
        onChange={setGameFormat}
        disabled={isSubmitting || !!tournamentDeck}
      />

      {/* My Deck Colors */}
      {!tournamentDeck && (
        <ColorSelector
          selectedColors={myColors}
          onColorToggle={handleMyColorToggle}
          label="Mis Colores"
          id="my"
          disabled={isSubmitting}
        />
      )}
      
      {/* My Deck Name */}
      <DeckInput
        id="myDeckName"
        label="Nombre de Mi Mazo"
        value={myDeckName}
        onChange={setMyDeckName}
        onColorSelect={setMyColors}
        placeholder="Ej: Control Ambar/Amatista"
        disabled={isSubmitting || !!tournamentDeck}
        decks={filteredDecks}
        allowSelectDeck={!tournamentDeck}
      />
      
      {/* Opponent Deck Colors */}
      <ColorSelector
        selectedColors={opponentColors}
        onColorToggle={handleOpponentColorToggle}
        label="Colores del Oponente"
        id="opp"
        disabled={isSubmitting}
      />
      
      {/* Opponent Deck Name */}
      <DeckInput
        id="opponentDeckName"
        label="Nombre del Mazo Oponente (opcional)"
        value={opponentDeckName}
        onChange={setOpponentDeckName}
        placeholder="Ej: Aggro Rubí/Esmeralda"
        disabled={isSubmitting}
      />
      
      {/* Match Format */}
      <MatchFormatSelector
        value={matchFormat}
        onChange={setMatchFormat}
        disabled={isSubmitting}
      />
      
      {/* Result */}
      <ResultSelector
        value={result}
        onChange={setResult}
        disabled={isSubmitting}
        matchFormat={matchFormat}
      />
      
      {/* Notes */}
      <NotesInput
        value={notes}
        onChange={setNotes}
        disabled={isSubmitting}
      />
    </>
  );
}

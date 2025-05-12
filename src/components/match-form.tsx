
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trophy, X } from 'lucide-react';
import { useLorcana } from '@/context/LorcanaContext';
import { InkColor, GameFormat, MatchFormat } from '@/types';

interface MatchFormProps {
  tournamentId?: string;
  onSuccess?: () => void;
}

export function MatchForm({ tournamentId, onSuccess }: MatchFormProps) {
  const { addMatch, addTournamentMatch } = useLorcana();
  
  const [gameFormat, setGameFormat] = useState<GameFormat>('Infinity Constructor');
  const [matchFormat, setMatchFormat] = useState<MatchFormat>('BO3');
  const [myDeckName, setMyDeckName] = useState('');
  const [opponentDeckName, setOpponentDeckName] = useState('');
  const [myColors, setMyColors] = useState<InkColor[]>([]);
  const [opponentColors, setOpponentColors] = useState<InkColor[]>([]);
  const [result, setResult] = useState<'Victoria' | 'Derrota' | ''>('');
  const [notes, setNotes] = useState('');

  const handleColorToggle = (color: InkColor, isMyDeck: boolean) => {
    if (isMyDeck) {
      setMyColors(prev => 
        prev.includes(color) 
          ? prev.filter(c => c !== color) 
          : [...prev, color]
      );
    } else {
      setOpponentColors(prev => 
        prev.includes(color) 
          ? prev.filter(c => c !== color) 
          : [...prev, color]
      );
    }
  };

  const resetForm = () => {
    setGameFormat('Infinity Constructor');
    setMatchFormat('BO3');
    setMyDeckName('');
    setOpponentDeckName('');
    setMyColors([]);
    setOpponentColors([]);
    setResult('');
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!myDeckName || !opponentDeckName || myColors.length === 0 || opponentColors.length === 0 || !result) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    
    const matchData = {
      gameFormat,
      matchFormat,
      myDeck: {
        name: myDeckName,
        colors: myColors
      },
      opponentDeck: {
        name: opponentDeckName,
        colors: opponentColors
      },
      result,
      notes: notes.trim() || undefined
    };
    
    if (tournamentId) {
      addTournamentMatch(tournamentId, matchData);
    } else {
      addMatch(matchData);
    }
    
    resetForm();
    if (onSuccess) onSuccess();
  };

  const colorOptions: InkColor[] = ['Ambar', 'Amatista', 'Esmeralda', 'Rubí', 'Zafiro', 'Acero'];
  
  const getColorClass = (color: InkColor) => {
    switch(color) {
      case 'Ambar': return 'border-lorcana-amber/50 focus-within:border-lorcana-amber';
      case 'Amatista': return 'border-lorcana-amethyst/50 focus-within:border-lorcana-amethyst';
      case 'Esmeralda': return 'border-lorcana-emerald/50 focus-within:border-lorcana-emerald';
      case 'Rubí': return 'border-lorcana-ruby/50 focus-within:border-lorcana-ruby';
      case 'Zafiro': return 'border-lorcana-sapphire/50 focus-within:border-lorcana-sapphire';
      case 'Acero': return 'border-lorcana-steel/50 focus-within:border-lorcana-steel';
      default: return '';
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {tournamentId ? 'Registrar Partida de Torneo' : 'Registrar Nueva Partida'}
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Game Format */}
          <div className="space-y-2">
            <h3 className="font-medium">Formato de Juego</h3>
            <RadioGroup 
              value={gameFormat} 
              onValueChange={(value) => setGameFormat(value as GameFormat)} 
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Infinity Constructor" id="infinity" />
                <Label htmlFor="infinity">Infinity Constructor (Todas las expansiones)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Nuevas Expansiones" id="newExp" />
                <Label htmlFor="newExp">Nuevas Expansiones (Últimas 5)</Label>
              </div>
            </RadioGroup>
          </div>

          {/* My Deck Info */}
          <div className="space-y-3">
            <h3 className="font-medium">Mis Colores</h3>
            <div className="grid grid-cols-3 gap-2">
              {colorOptions.map(color => (
                <div 
                  key={`my-${color}`} 
                  className={`flex items-center space-x-2 rounded-md border p-3 transition-colors ${getColorClass(color)} ${myColors.includes(color) ? 'bg-secondary' : ''}`}
                >
                  <Checkbox 
                    id={`my-${color}`} 
                    checked={myColors.includes(color)}
                    onCheckedChange={() => handleColorToggle(color, true)}
                  />
                  <Label htmlFor={`my-${color}`} className="flex-grow cursor-pointer">
                    {color}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="myDeckName">Nombre de Mi Mazo</Label>
            <Input 
              id="myDeckName" 
              placeholder="Ej: Control Ambar/Amatista" 
              value={myDeckName}
              onChange={e => setMyDeckName(e.target.value)}
            />
          </div>
          
          {/* Opponent Deck Info */}
          <div className="space-y-3">
            <h3 className="font-medium">Colores del Oponente</h3>
            <div className="grid grid-cols-3 gap-2">
              {colorOptions.map(color => (
                <div 
                  key={`opp-${color}`} 
                  className={`flex items-center space-x-2 rounded-md border p-3 transition-colors ${getColorClass(color)} ${opponentColors.includes(color) ? 'bg-secondary' : ''}`}
                >
                  <Checkbox 
                    id={`opp-${color}`} 
                    checked={opponentColors.includes(color)}
                    onCheckedChange={() => handleColorToggle(color, false)}
                  />
                  <Label htmlFor={`opp-${color}`} className="flex-grow cursor-pointer">
                    {color}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="opponentDeckName">Nombre del Mazo Oponente</Label>
            <Input 
              id="opponentDeckName" 
              placeholder="Ej: Aggro Rubí/Esmeralda" 
              value={opponentDeckName}
              onChange={e => setOpponentDeckName(e.target.value)}
            />
          </div>
          
          {/* Match Format */}
          <div className="space-y-2">
            <h3 className="font-medium">Formato de Partida</h3>
            <RadioGroup 
              value={matchFormat} 
              onValueChange={(value) => setMatchFormat(value as MatchFormat)} 
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="BO1" id="bo1" />
                <Label htmlFor="bo1">BO1 (Mejor de 1)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="BO2" id="bo2" />
                <Label htmlFor="bo2">BO2 (Mejor de 2)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="BO3" id="bo3" />
                <Label htmlFor="bo3">BO3 (Mejor de 3)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="BO5" id="bo5" />
                <Label htmlFor="bo5">BO5 (Mejor de 5)</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Result */}
          <div className="space-y-2">
            <h3 className="font-medium">Resultado</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                type="button"
                variant={result === 'Victoria' ? 'default' : 'outline'} 
                className={`h-24 ${result === 'Victoria' ? 'bg-lorcana-victory text-green-800 hover:bg-lorcana-victory/90' : ''}`}
                onClick={() => setResult('Victoria')}
              >
                <Trophy className="mr-2 h-5 w-5" />
                Victoria
              </Button>
              
              <Button 
                type="button"
                variant={result === 'Derrota' ? 'default' : 'outline'}
                className={`h-24 ${result === 'Derrota' ? 'bg-lorcana-defeat text-red-800 hover:bg-lorcana-defeat/90' : ''}`}
                onClick={() => setResult('Derrota')}
              >
                <X className="mr-2 h-5 w-5" />
                Derrota
              </Button>
            </div>
          </div>
          
          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea 
              id="notes" 
              placeholder="Notas sobre la partida..." 
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button type="submit" className="w-full">
            Guardar Partida
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

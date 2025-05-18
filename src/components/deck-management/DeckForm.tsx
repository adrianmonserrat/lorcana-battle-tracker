
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GameFormat, InkColor, SavedDeck } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ColorSelector } from "@/components/match-form/color-selector";
import { useLorcana } from "@/context/lorcana/LorcanaProvider";
import { toast } from "sonner";

interface DeckFormProps {
  onClose: () => void;
  editDeck?: SavedDeck;
}

export function DeckForm({ onClose, editDeck }: DeckFormProps) {
  const { addDeck, updateDeck } = useLorcana();
  
  const [name, setName] = useState(editDeck?.name || '');
  const [colors, setColors] = useState<InkColor[]>(editDeck?.colors || []);
  const [format, setFormat] = useState<GameFormat>(editDeck?.format || 'Infinity Constructor');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleColorToggle = (color: InkColor) => {
    setColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color) 
        : [...prev, color]
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim() === '') {
      toast.error('Debes ingresar un nombre para el mazo');
      return;
    }
    
    if (colors.length === 0) {
      toast.error('Debes seleccionar al menos un color');
      return;
    }
    
    setIsSubmitting(true);
    
    const deckData = {
      name: name.trim(),
      colors,
      format
    };
    
    try {
      if (editDeck) {
        updateDeck(editDeck.id, deckData);
      } else {
        addDeck(deckData);
      }
      onClose();
    } catch (error) {
      toast.error('Error al guardar el mazo');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>{editDeck ? 'Editar Mazo' : 'Crear Nuevo Mazo'}</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="deck-name">Nombre del Mazo</Label>
            <Input 
              id="deck-name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Control Amatista/Ambar" 
              disabled={isSubmitting}
            />
          </div>
          
          <ColorSelector
            selectedColors={colors}
            onColorToggle={handleColorToggle}
            label="Colores"
            id="deck"
            disabled={isSubmitting}
          />
          
          <div className="space-y-2">
            <Label>Formato</Label>
            <RadioGroup 
              value={format} 
              onValueChange={(value) => setFormat(value as GameFormat)}
              className="flex flex-col space-y-1"
              disabled={isSubmitting}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Infinity Constructor" id="deck-infinity" disabled={isSubmitting} />
                <Label htmlFor="deck-infinity" className={isSubmitting ? "opacity-60" : ""}>Infinity Constructor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Estándar" id="deck-standard" disabled={isSubmitting} />
                <Label htmlFor="deck-standard" className={isSubmitting ? "opacity-60" : ""}>Estándar</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : (editDeck ? 'Actualizar' : 'Guardar')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}


import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLorcana } from '@/context/LorcanaContext';
import { toast } from "sonner";

interface TournamentFormProps {
  onSuccess?: () => void;
}

export function TournamentForm({ onSuccess }: TournamentFormProps) {
  const { addTournament } = useLorcana();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Por favor ingresa un nombre para el torneo');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addTournament({
        name: name.trim(),
        location: location.trim() || undefined
      });
      
      setName('');
      setLocation('');
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error al crear el torneo:', error);
      toast.error('Ocurrió un error al crear el torneo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Crear Nuevo Torneo</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tournamentName">Nombre del Torneo</Label>
            <Input 
              id="tournamentName" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: Torneo Local Mayo 2025"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tournamentLocation">Ubicación (opcional)</Label>
            <Input 
              id="tournamentLocation" 
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Ej: Tienda de Juegos XYZ"
              disabled={isSubmitting}
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creando...' : 'Crear Torneo'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

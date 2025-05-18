
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MatchFormContent } from './match-form-content';
import { useMatchForm } from './use-match-form';

interface MatchFormProps {
  tournamentId?: string;
  onSuccess?: () => void;
}

export function MatchForm({ tournamentId, onSuccess }: MatchFormProps) {
  const {
    handleSubmit,
    isSubmitting,
    tournament
  } = useMatchForm({ tournamentId, onSuccess });

  return (
    <Card className="w-full max-w-3xl mx-auto mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {tournamentId ? 'Registrar Partida de Torneo' : 'Registrar Nueva Partida'}
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <MatchFormContent tournamentId={tournamentId} />
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Partida'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

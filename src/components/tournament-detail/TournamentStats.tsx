
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tournament } from "@/types";

interface TournamentStatsProps {
  tournament: Tournament;
}

export function TournamentStats({ tournament }: TournamentStatsProps) {
  const victories = tournament.matches.filter(m => m.result === 'Victoria').length;
  const defeats = tournament.matches.filter(m => m.result === 'Derrota').length;
  const ties = tournament.matches.filter(m => m.result === 'Empate').length;
  const points = victories * 3; // 3 puntos por victoria, 0 por derrota
  const winRate = tournament.matches.length > 0 
    ? Math.round((victories / tournament.matches.length) * 100) 
    : 0;
  const progress = tournament.totalMatches > 0
    ? Math.round((tournament.matches.length / tournament.totalMatches) * 100)
    : 0;
    
  return (
    <div className="space-y-4">
      {/* Progreso del torneo */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Progreso del Torneo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Partidas jugadas: {tournament.matches.length}/{tournament.totalMatches}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Puntos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600">{points}</p>
            <p className="text-sm text-muted-foreground">3 pts por victoria</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Partidas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{tournament.matches.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">V / E / D</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              <span className="text-emerald-600">{victories}</span>
              <span className="mx-1">/</span>
              <span className="text-amber-600">{ties}</span>
              <span className="mx-1">/</span>
              <span className="text-red-600">{defeats}</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">% Victoria</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{winRate}%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

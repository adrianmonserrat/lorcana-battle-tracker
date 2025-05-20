
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tournament } from "@/types";

interface TournamentStatsProps {
  tournament: Tournament;
}

export function TournamentStats({ tournament }: TournamentStatsProps) {
  const victories = tournament.matches.filter(m => m.result === 'Victoria').length;
  const defeats = tournament.matches.filter(m => m.result === 'Derrota').length;
  const ties = tournament.matches.filter(m => m.result === 'Empate').length;
  const winRate = tournament.matches.length > 0 
    ? Math.round((victories / tournament.matches.length) * 100) 
    : 0;
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total de Partidas</CardTitle>
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
          <p className="text-4xl font-bold">
            <span className="text-emerald-600">{victories}</span>
            <span className="mx-2 text-amber-600">{ties}</span> 
            <span className="text-red-600">{defeats}</span>
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">% de Victoria</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{winRate}%</p>
        </CardContent>
      </Card>
    </div>
  );
}

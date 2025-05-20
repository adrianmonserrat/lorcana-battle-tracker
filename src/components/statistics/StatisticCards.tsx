
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatisticCardsProps {
  totalMatches: number;
  victories: number;
  defeats: number;
  winRate: number;
}

export function StatisticCards({ totalMatches, victories, defeats, winRate }: StatisticCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total de Partidas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{totalMatches}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Victorias / Derrotas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">
            <span className="text-emerald-600">{victories}</span> / 
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

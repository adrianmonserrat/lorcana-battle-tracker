
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { ChartTooltip } from "./ChartTooltip";

interface TournamentData {
  name: string;
  total: number;
  victorias: number;
  derrotas: number;
  winRate: number;
}

interface TournamentStatsChartProps {
  tournamentData: TournamentData[];
}

export function TournamentStatsChart({ tournamentData }: TournamentStatsChartProps) {
  if (tournamentData.length === 0) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas por Torneo</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={tournamentData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <ChartTooltip />
            <Legend />
            <Bar dataKey="victorias" name="Victorias" fill="#00A651" />
            <Bar dataKey="derrotas" name="Derrotas" fill="#E31937" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import { useLanguage } from "@/context/LanguageContext";

interface TournamentData {
  name: string;
  total: number;
  victorias: number;
  empates: number;
  derrotas: number;
  winRate: number;
}

interface TournamentStatsChartProps {
  tournamentData: TournamentData[];
}

export function TournamentStatsChart({ tournamentData }: TournamentStatsChartProps) {
  const { t } = useLanguage();
  if (tournamentData.length === 0) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('statistics.tournament_chart_title')}</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={tournamentData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <ChartTooltip />
            <Legend />
            <Bar dataKey="victorias" name={t('statistics.charts.victories')} fill="#00A651" />
            <Bar dataKey="empates" name={t('statistics.charts.ties')} fill="#FFB81C" />
            <Bar dataKey="derrotas" name={t('statistics.charts.defeats')} fill="#E31937" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

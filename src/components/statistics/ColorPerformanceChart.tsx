
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import { useLanguage } from "@/context/LanguageContext";
import { getInkColorTranslationKey } from "./utils";

interface ColorData {
  name: string;
  total: number;
  victorias: number;
  empates: number;
  derrotas: number;
  winRate: number;
}

interface ColorPerformanceChartProps {
  colorData: ColorData[];
}

export function ColorPerformanceChart({ colorData }: ColorPerformanceChartProps) {
  const { t } = useLanguage();
  if (colorData.length === 0) return null;
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>{t('statistics.charts.color_performance')}</CardTitle>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={colorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tickFormatter={(value: string) => t(getInkColorTranslationKey(value) || value)} />
            <YAxis />
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

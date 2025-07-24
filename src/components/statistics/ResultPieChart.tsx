
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, Tooltip } from "recharts";
import { useLanguage } from "@/context/LanguageContext";

interface ResultPieChartProps {
  resultData: Array<{ name: string; value: number }>;
}

export function ResultPieChart({ resultData }: ResultPieChartProps) {
  const { t } = useLanguage();
  const COLORS = ["#00A651", "#FFB81C", "#E31937"];
  
  // Preparar los datos para la gráfica de barras
  const formattedData = resultData.map(item => ({
    name: item.name,
    valor: item.value,
    color: item.name === 'Victorias' ? COLORS[0] : 
           item.name === 'Empates' ? COLORS[1] : COLORS[2]
  }));
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>{t('statistics.charts.result_distribution')}</CardTitle>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fill: '#888', fontSize: 14 }} 
              width={80}
            />
            <Tooltip
              formatter={(value) => [`${value} partidas`, 'Total']}
              labelFormatter={(name) => `${name}`}
            />
            <Bar dataKey="valor" name="Cantidad" radius={[0, 4, 4, 0]}>
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

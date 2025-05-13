
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ChartTooltip } from "./ChartTooltip";

interface ResultPieChartProps {
  resultData: Array<{ name: string; value: number }>;
}

export function ResultPieChart({ resultData }: ResultPieChartProps) {
  const COLORS = ["#00A651", "#FFB81C", "#E31937"];
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Distribución de Resultados</CardTitle>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={resultData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {resultData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <ChartTooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

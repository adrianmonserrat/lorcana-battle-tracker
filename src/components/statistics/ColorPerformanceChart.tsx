
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { ChartTooltip } from "./ChartTooltip";

interface ColorData {
  name: string;
  total: number;
  victorias: number;
  derrotas: number;
  winRate: number;
}

interface ColorPerformanceChartProps {
  colorData: ColorData[];
}

export function ColorPerformanceChart({ colorData }: ColorPerformanceChartProps) {
  if (colorData.length === 0) return null;
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Rendimiento por Color</CardTitle>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={colorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
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

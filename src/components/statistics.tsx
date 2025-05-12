
import { useLorcana } from "@/context/LorcanaContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function Statistics() {
  const { stats, tournaments } = useLorcana();
  
  const winRate = stats.total.matches > 0 
    ? Math.round((stats.total.victories / stats.total.matches) * 100) 
    : 0;
  
  // Data for the pie chart
  const resultData = [
    { name: "Victorias", value: stats.total.victories },
    { name: "Derrotas", value: stats.total.defeats },
  ];
  
  const COLORS = ["#00A651", "#E31937"];
  
  // Data for the color distribution
  const colorData = Object.entries(stats.byColor).map(([color, data]) => ({
    name: color,
    total: data.matches,
    victorias: data.victories,
    derrotas: data.defeats,
    winRate: data.matches > 0 ? Math.round((data.victories / data.matches) * 100) : 0,
  })).filter(item => item.total > 0);
  
  // Data for tournament stats
  const tournamentData = Object.entries(stats.byTournament).map(([id, data]) => {
    const tournament = tournaments.find(t => t.id === id);
    return {
      name: tournament?.name || "Torneo Desconocido",
      total: data.matches,
      victorias: data.victories,
      derrotas: data.defeats,
      winRate: data.matches > 0 ? Math.round((data.victories / data.matches) * 100) : 0,
    };
  });

  const getInkColorHex = (color: string) => {
    switch(color) {
      case 'Ambar': return '#FFB81C';
      case 'Amatista': return '#9452A5';
      case 'Esmeralda': return '#00A651';
      case 'Rubí': return '#E31937';
      case 'Zafiro': return '#0070BA';
      case 'Acero': return '#8A898C';
      default: return '#CCCCCC';
    }
  };
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-4 rounded-md shadow-lg">
          <p className="font-bold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
              {entry.name !== "total" && entry.dataKey !== "winRate" && 
                ` (${Math.round((entry.value / payload.find((p: any) => p.dataKey === "total").value) * 100)}%)`}
              {entry.dataKey === "winRate" && `%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Estadísticas</h1>
      
      {/* Overall statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total de Partidas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.total.matches}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Victorias / Derrotas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              <span className="text-emerald-600">{stats.total.victories}</span> / 
              <span className="text-red-600">{stats.total.defeats}</span>
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
      
      {stats.total.matches > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Result pie chart */}
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
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Color performance */}
          {colorData.length > 0 && (
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
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="victorias" name="Victorias" fill="#00A651" />
                    <Bar dataKey="derrotas" name="Derrotas" fill="#E31937" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      {/* Tournament statistics */}
      {tournamentData.length > 0 && (
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
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="victorias" name="Victorias" fill="#00A651" />
                <Bar dataKey="derrotas" name="Derrotas" fill="#E31937" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

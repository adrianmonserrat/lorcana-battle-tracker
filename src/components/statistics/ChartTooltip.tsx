
import { Tooltip } from "recharts";

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  // Find the total data point safely
  const totalEntry = payload.find((p: any) => p.dataKey === "total");
  
  return (
    <div className="bg-background border border-border p-4 rounded-md shadow-lg">
      <p className="font-bold">{label}</p>
      {payload.map((entry: any, index: number) => {
        // Safely calculate percentage
        let percentageText = '';
        if (entry.name !== "total" && entry.dataKey !== "winRate" && totalEntry && totalEntry.value > 0) {
          percentageText = ` (${Math.round((entry.value / totalEntry.value) * 100)}%)`;
        } else if (entry.dataKey === "winRate") {
          percentageText = `%`;
        }
        
        return (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
            {percentageText}
          </p>
        );
      })}
    </div>
  );
};

export function ChartTooltip() {
  return <Tooltip content={<CustomTooltip />} />;
}

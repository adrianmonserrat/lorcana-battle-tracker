
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type StatsFilter = 'all' | 'freeplay' | 'tournament' | 'infinity' | 'expansiones';

interface StatisticsFilterProps {
  selectedFilter: StatsFilter;
  setSelectedFilter: (value: StatsFilter) => void;
}

export function StatisticsFilter({ selectedFilter, setSelectedFilter }: StatisticsFilterProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <Select value={selectedFilter} onValueChange={(value) => setSelectedFilter(value as StatsFilter)}>
          <SelectTrigger className="w-full sm:w-[280px] mx-auto">
            <SelectValue placeholder="Filtrar estadísticas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las partidas</SelectItem>
            <SelectItem value="freeplay">Solo partidas libres</SelectItem>
            <SelectItem value="tournament">Solo partidas de torneo</SelectItem>
            <SelectItem value="infinity">Solo formato Infinity Constructor</SelectItem>
            <SelectItem value="expansiones">Solo formato Nuevas Expansiones</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}

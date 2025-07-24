
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";

export type StatsFilter = 'all' | 'freeplay' | 'tournament' | 'infinity' | 'expansiones';

interface StatisticsFilterProps {
  selectedFilter: StatsFilter;
  setSelectedFilter: (value: StatsFilter) => void;
}

export function StatisticsFilter({ selectedFilter, setSelectedFilter }: StatisticsFilterProps) {
  const { t } = useLanguage();
  return (
    <Card>
      <CardContent className="pt-6">
        <Select value={selectedFilter} onValueChange={(value) => setSelectedFilter(value as StatsFilter)}>
          <SelectTrigger className="w-full sm:w-[280px] mx-auto">
            <SelectValue placeholder={t('statistics.filter.title')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('statistics.filter.all')}</SelectItem>
            <SelectItem value="freeplay">{t('statistics.filter.freeplay')}</SelectItem>
            <SelectItem value="tournament">{t('statistics.filter.tournament')}</SelectItem>
            <SelectItem value="infinity">{t('statistics.filter.infinity')}</SelectItem>
            <SelectItem value="expansiones">{t('statistics.filter.standard')}</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}

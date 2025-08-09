
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

interface StatisticCardsProps {
  totalMatches: number;
  victories: number;
  defeats: number;
  ties: number;
  winRate: number;
}

export function StatisticCards({ totalMatches, victories, defeats, ties, winRate }: StatisticCardsProps) {
  const { t } = useLanguage();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-lg">{t('statistics.total_matches')}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-4xl font-bold">{totalMatches}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-lg">{t('statistics.wins_ties_defeats')}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-4xl font-bold">
            <span className="text-emerald-600">{victories}</span>
            <span className="mx-2 text-amber-600">{ties}</span>
            <span className="text-red-600">{defeats}</span>
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-lg">{t('statistics.win_rate')}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-4xl font-bold">{winRate}%</p>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchRecord } from "@/hooks/useMatchRecords";
import { Tournament } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { StatsFilter } from "./StatisticsFilter";

interface InitialTurnStatsProps {
  matches: MatchRecord[];
  tournaments?: Tournament[];
  selectedFilter?: StatsFilter;
}

export function InitialTurnStats({ matches, tournaments = [], selectedFilter = 'all' }: InitialTurnStatsProps) {
  const { t } = useLanguage();
  
  // Combine Supabase matches and tournament matches for initial turn calculation
  const allMatches = [...matches];
  
  // Add tournament matches if not filtering by freeplay
  if (selectedFilter !== 'freeplay') {
    tournaments.forEach(tournament => {
      tournament.matches.forEach(match => {
        const passesFilter = selectedFilter === 'all' ? 
          true : 
          selectedFilter === 'infinity' ? 
            match.gameFormat === 'Infinity Constructor' :
            match.gameFormat === 'Estándar';
        
        if (passesFilter) {
          allMatches.push({
            id: match.id,
            user_id: '', // Tournament matches don't have user_id
            initial_turn: match.initialTurn,
            created_at: match.date.toISOString(),
            result: match.result,
            user_deck_id: null,
            opponent_deck_name: match.opponentDeck.name,
            opponent_deck_colors: match.opponentDeck.colors,
            game_format: match.gameFormat,
            match_format: match.matchFormat,
            notes: match.notes || ''
          } as MatchRecord);
        }
      });
    });
  }
  
  // Calculate OTP stats
  const otpMatches = allMatches.filter(match => match.initial_turn === 'OTP');
  const otpVictories = otpMatches.filter(match => match.result === 'Victoria').length;
  const otpDefeats = otpMatches.filter(match => match.result === 'Derrota').length;
  const otpTies = otpMatches.filter(match => match.result === 'Empate').length;
  const otpWinRate = otpMatches.length > 0 ? Math.round((otpVictories / otpMatches.length) * 100) : 0;

  // Calculate OTD stats
  const otdMatches = allMatches.filter(match => match.initial_turn === 'OTD');
  const otdVictories = otdMatches.filter(match => match.result === 'Victoria').length;
  const otdDefeats = otdMatches.filter(match => match.result === 'Derrota').length;
  const otdTies = otdMatches.filter(match => match.result === 'Empate').length;
  const otdWinRate = otdMatches.length > 0 ? Math.round((otdVictories / otdMatches.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-center">{t('statistics.initial_turn.stats_title')}</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OTP Stats */}
        <Card>
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-lg text-blue-600">{t('statistics.initial_turn.otp')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">{t('common.total')}</p>
                <p className="text-2xl font-bold">{otpMatches.length} {t('statistics.initial_turn.matches')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('statistics.wins_ties_defeats')}</p>
                <p className="text-lg font-semibold">
                  <span className="text-emerald-600">{otpVictories}</span>
                  <span className="mx-1 text-amber-600">{otpTies}</span>
                  <span className="text-red-600">{otpDefeats}</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('statistics.initial_turn.win_rate')}</p>
                <p className="text-2xl font-bold">{otpWinRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* OTD Stats */}
        <Card>
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-lg text-purple-600">{t('statistics.initial_turn.otd')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">{t('common.total')}</p>
                <p className="text-2xl font-bold">{otdMatches.length} {t('statistics.initial_turn.matches')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('statistics.wins_ties_defeats')}</p>
                <p className="text-lg font-semibold">
                  <span className="text-emerald-600">{otdVictories}</span>
                  <span className="mx-1 text-amber-600">{otdTies}</span>
                  <span className="text-red-600">{otdDefeats}</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('statistics.initial_turn.win_rate')}</p>
                <p className="text-2xl font-bold">{otdWinRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
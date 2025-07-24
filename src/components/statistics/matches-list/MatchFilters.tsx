
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InkColor, GameFormat } from "@/types";
import { getInkColorHex } from "../utils";
import { useLanguage } from "@/context/LanguageContext";

interface MatchFiltersProps {
  colorFilter: string;
  setColorFilter: (value: string) => void;
  sourceFilter: string;
  setSourceFilter: (value: string) => void;
  formatFilter: string;
  setFormatFilter: (value: string) => void;
  initialTurnFilter: string;
  setInitialTurnFilter: (value: string) => void;
  allUsedColors: Set<string>;
  allGameFormats: Set<string>;
}

export function MatchFilters({
  colorFilter,
  setColorFilter,
  sourceFilter, 
  setSourceFilter,
  formatFilter,
  setFormatFilter,
  initialTurnFilter,
  setInitialTurnFilter,
  allUsedColors,
  allGameFormats
}: MatchFiltersProps) {
  const { t } = useLanguage();

  const getColorTranslation = (color: string) => {
    const colorMap: Record<string, string> = {
      'Ambar': 'colors.amber',
      'Amatista': 'colors.amethyst', 
      'Esmeralda': 'colors.emerald',
      'Rubí': 'colors.ruby',
      'Zafiro': 'colors.sapphire',
      'Acero': 'colors.steel'
    };
    return t(colorMap[color] || color);
  };
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Select value={colorFilter} onValueChange={setColorFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder={t('statistics.filter.color_placeholder')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('statistics.filter.all_colors')}</SelectItem>
          {[...allUsedColors].map((color) => (
            <SelectItem 
              key={color} 
              value={color}
              className="flex items-center gap-2"
            >
              <span 
                className="inline-block w-4 h-4 rounded-full mr-2"
                style={{ 
                  backgroundColor: getInkColorHex(color) 
                }}
              ></span>
              {getColorTranslation(color)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={sourceFilter} onValueChange={setSourceFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder={t('statistics.filter.source_placeholder')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('statistics.filter.all_sources')}</SelectItem>
          <SelectItem value="freeplay">{t('statistics.filter.freeplay')}</SelectItem>
          <SelectItem value="tournament">{t('statistics.filter.tournament')}</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={formatFilter} onValueChange={setFormatFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder={t('statistics.filter.format_placeholder')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('statistics.filter.all_formats')}</SelectItem>
          {[...allGameFormats].map(format => (
            <SelectItem key={format} value={format}>{format}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={initialTurnFilter} onValueChange={setInitialTurnFilter}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder={t('statistics.filter.turn_placeholder')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('statistics.filter.all_turns')}</SelectItem>
          <SelectItem value="OTP">{t('match.on_the_play')}</SelectItem>
          <SelectItem value="OTD">{t('match.on_the_draw')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

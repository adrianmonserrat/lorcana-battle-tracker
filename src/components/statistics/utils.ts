
import { InkColor } from "@/types";

export function calculateWinRate(victories: number, matches: number): number {
  return matches > 0 ? Math.round((victories / matches) * 100) : 0;
}

export function getInkColorHex(color: InkColor | string): string {
  switch(color) {
    case 'Ambar': return '#FFB81C';
    case 'Amatista': return '#9452A5';
    case 'Esmeralda': return '#00A651';
    case 'Rubí': return '#E31937';
    case 'Zafiro': return '#0070BA';
    case 'Acero': return '#8A898C';
    default: return '#CCCCCC';
  }
}

// Map stored Spanish ink color names to translation keys
export function getInkColorTranslationKey(color: string): string | undefined {
  switch (color) {
    case 'Ambar': return 'colors.amber';
    case 'Amatista': return 'colors.amethyst';
    case 'Esmeralda': return 'colors.emerald';
    case 'Rubí': return 'colors.ruby';
    case 'Zafiro': return 'colors.sapphire';
    case 'Acero': return 'colors.steel';
    default: return undefined;
  }
}

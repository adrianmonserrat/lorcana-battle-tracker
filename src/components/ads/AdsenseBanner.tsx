import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdsenseBannerProps {
  slot?: string; // ID numérico de la unidad de anuncio (data-ad-slot)
  className?: string;
}

export function AdsenseBanner({ slot, className }: AdsenseBannerProps) {
  useEffect(() => {
    // Empuja el renderizado del anuncio cuando el script esté cargado
    try {
      // Si no hay slot, no intentamos renderizar para evitar errores
      if (!slot) return;
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // silencio: AdSense maneja reintentos internamente
    }
  }, [slot]);

  if (!slot) {
    // Muestra un espacio reservado hasta que tengamos el slot
    return (
      <div
        className={`w-full rounded-md border border-dashed text-center text-xs text-muted-foreground py-6 ${className ?? ""}`}
        role="complementary"
        aria-label="Espacio para anuncio"
      >
        Publicidad
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle block ${className ?? ""}`}
      style={{ display: "block" }}
      data-ad-client="ca-pub-1523821482281060"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

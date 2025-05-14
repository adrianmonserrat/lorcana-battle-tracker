
import { useState, useEffect } from 'react';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';

export function CurrentDateTime() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  useEffect(() => {
    // Actualizar la fecha cada minuto
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="text-center hidden md:block">
      <p className="text-sm font-medium">
        {format(currentDate, "PPP", { locale: es })}
      </p>
      <p className="text-xs text-muted-foreground">
        {format(currentDate, "HH:mm")}
      </p>
    </div>
  );
}

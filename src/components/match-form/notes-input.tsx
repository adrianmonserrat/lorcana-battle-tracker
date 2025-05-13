
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NotesInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function NotesInput({ value, onChange, disabled = false }: NotesInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Notas (opcional)</Label>
      <Textarea 
        id="notes" 
        placeholder="Notas sobre la partida..." 
        value={value}
        onChange={e => onChange(e.target.value)}
        className="min-h-[80px] sm:min-h-[100px]"
        disabled={disabled}
      />
    </div>
  );
}


import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NotesInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function NotesInput({ value, onChange }: NotesInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Notas (opcional)</Label>
      <Textarea 
        id="notes" 
        placeholder="Notas sobre la partida..." 
        value={value}
        onChange={e => onChange(e.target.value)}
        className="min-h-[100px]"
      />
    </div>
  );
}

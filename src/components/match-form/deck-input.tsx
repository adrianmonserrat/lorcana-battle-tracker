
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DeckInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function DeckInput({ id, label, value, onChange, placeholder }: DeckInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input 
        id={id} 
        placeholder={placeholder} 
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

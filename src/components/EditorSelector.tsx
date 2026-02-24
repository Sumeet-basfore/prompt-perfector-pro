import { EDITORS, type EditorId } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  value: EditorId;
  onChange: (v: EditorId) => void;
}

export function EditorSelector({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">AI Editor</label>
      <Select value={value} onValueChange={(v) => onChange(v as EditorId)}>
        <SelectTrigger className="rounded-lg h-10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {EDITORS.map((e) => (
            <SelectItem key={e.id} value={e.id}>
              <span className="flex items-center gap-2">
                <span>{e.icon}</span>
                <span>{e.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

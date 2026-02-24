import { TEMPLATES, type TemplateId } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  value: TemplateId;
  onChange: (v: TemplateId) => void;
}

export function TemplateSelector({ value, onChange }: Props) {
  const selected = TEMPLATES.find((t) => t.id === value);

  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Template</label>
      <Select value={value} onValueChange={(v) => onChange(v as TemplateId)}>
        <SelectTrigger className="rounded-lg h-10">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TEMPLATES.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              <span className="flex items-center gap-2">
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selected && (
        <p className="mt-1.5 text-xs text-muted-foreground">{selected.description}</p>
      )}
    </div>
  );
}

import * as React from "react";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { EDITORS, type EditorId } from "@/lib/constants";

interface Props {
  value: EditorId;
  onChange: (v: EditorId) => void;
}

export function EditorSelector({ value, onChange }: Props) {
  const selected = EDITORS.find((e) => e.id === value);

  return (
    <div className="font-sans">
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">AI Editor</label>
      <Select.Root value={value} onValueChange={(v) => onChange(v as EditorId)}>
        <Select.Trigger
          className="flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Select.Value>
            {selected ? (
              <span className="flex items-center gap-2 text-foreground">
                <span className="text-base">{selected.icon}</span>
                <span className="truncate font-medium">{selected.label}</span>
              </span>
            ) : (
              "Select an editor..."
            )}
          </Select.Value>
          <Select.Icon>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={4}
            className="relative z-50 max-h-96 w-[var(--radix-select-trigger-width)] min-w-[8rem] overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 font-sans"
          >
            <Select.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
              <ChevronUp className="h-4 w-4" />
            </Select.ScrollUpButton>

            <Select.Viewport className="p-1">
              {EDITORS.map((e) => (
                <Select.Item
                  key={e.id}
                  value={e.id}
                  className="relative flex w-full cursor-default select-none items-center rounded-lg py-2 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{e.icon}</span>
                    <span className="font-medium">{e.label}</span>
                  </span>
                  <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                    <Select.ItemIndicator>
                      <Check className="h-4 w-4 text-violet-600" />
                    </Select.ItemIndicator>
                  </span>
                </Select.Item>
              ))}
            </Select.Viewport>

            <Select.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
              <ChevronDown className="h-4 w-4" />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

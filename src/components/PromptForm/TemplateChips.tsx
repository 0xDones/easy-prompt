import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { PromptTemplate } from "@/types/prompt";

interface TemplateChipsProps {
  templates: PromptTemplate[];
  selectedId: string | null;
  onSelect: (template: PromptTemplate) => void;
}

export function TemplateChips({ templates, selectedId, onSelect }: TemplateChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {templates.map((template) => {
        const isSelected = template.id === selectedId;
        return (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            aria-pressed={isSelected}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border transition-colors",
              isSelected
                ? "border-[var(--color-accent-amber)] bg-[var(--color-accent-amber)]/10 text-[var(--color-accent-amber)]"
                : "border-border bg-secondary/50 hover:bg-secondary text-foreground"
            )}
          >
            {isSelected && <Check className="h-3.5 w-3.5" />}
            {template.name}
          </button>
        );
      })}
    </div>
  );
}

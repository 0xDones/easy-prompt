import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { PersonaTemplate } from "@/types/prompt";

interface PersonaChipsProps {
  personas: PersonaTemplate[];
  selectedId: string | null;
  onSelect: (persona: PersonaTemplate) => void;
}

export function PersonaChips({ personas, selectedId, onSelect }: PersonaChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {personas.map((persona) => {
        const isSelected = persona.id === selectedId;
        return (
          <button
            key={persona.id}
            onClick={() => onSelect(persona)}
            aria-label={`${persona.name}: ${persona.description}`}
            aria-pressed={isSelected}
            title={persona.description}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border transition-colors",
              isSelected
                ? "border-[var(--color-accent-cyan)] bg-[var(--color-accent-cyan)]/10 text-[var(--color-accent-cyan)]"
                : "border-border bg-secondary/50 hover:bg-secondary text-foreground"
            )}
          >
            {isSelected && <Check className="h-3.5 w-3.5" />}
            {persona.name}
          </button>
        );
      })}
    </div>
  );
}

import { Lightbulb } from "lucide-react";

export function PromptTip() {
  return (
    <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
      <div className="flex items-start gap-3">
        <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5 shrink-0" />
        <div>
          <h3 className="text-primary font-semibold text-sm mb-1">
            Easy Prompt
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            One prompt = one goal. Keep it simple, easy to verify, reproducible,
            narrow in scope, with explicit constraints, and legible structure.
          </p>
        </div>
      </div>
    </div>
  );
}

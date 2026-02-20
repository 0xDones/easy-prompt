import { useState } from "react";
import { PromptStats } from "./PromptStats";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy } from "lucide-react";

interface PromptPreviewProps {
  value: string;
  onChange: (value: string) => void;
  sectionCount: number;
  onClearAll: () => void;
}

export function PromptPreview({ value, onChange, sectionCount, onClearAll }: PromptPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isEmpty = !value.trim();

  return (
    <div className="flex flex-col h-full p-4">
      {/* Panel Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="h-2 w-2 rounded-full bg-primary" />
        <h2 className="text-lg font-semibold">Generated Prompt</h2>
      </div>

      {/* Preview Area */}
      <div className="flex-1 relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-full font-mono text-sm resize-none bg-secondary/30 border-border"
          placeholder=""
        />
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-8">
            <div className="text-center text-muted-foreground italic">
              <p>Fill in the sections on the left to generate your structured prompt...</p>
              <p className="mt-4">Minimum required: Task</p>
              <p className="mt-2">Recommended: Task + Constraints + Format</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="py-3">
        <PromptStats value={value} sectionCount={sectionCount} />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onClearAll}>
          Clear All
        </Button>
        <Button
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleCopy}
          disabled={isEmpty}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy Prompt
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type FieldStatus = "required" | "recommended" | "optional";

interface FieldSectionProps {
  label: string;
  xmlTag: string;
  status: FieldStatus;
  description: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

const statusLabels: Record<FieldStatus, string> = {
  required: "REQUIRED",
  recommended: "RECOMMENDED",
  optional: "OPTIONAL",
};

export function FieldSection({
  label,
  xmlTag,
  status,
  description,
  placeholder,
  value,
  onChange,
  rows = 3,
}: FieldSectionProps) {
  const isFilled = value.trim().length > 0;

  return (
    <div className="space-y-2">
      {/* Single-line header */}
      <div className="field-header flex items-center gap-2 group">
        <span className="font-medium text-foreground">{label}</span>
        <span className="xml-tag">{xmlTag}</span>
        <span
          className={cn("status-dot", status, { filled: isFilled })}
          aria-label={`${status} field`}
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info
                className="info-icon h-3.5 w-3.5"
                role="button"
                aria-label="Field information"
              />
            </TooltipTrigger>
            <TooltipContent className="description-tooltip">
              <p className="font-medium mb-1 text-xs uppercase tracking-wide">
                {statusLabels[status]}
              </p>
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Textarea only */}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="textarea"
      />
    </div>
  );
}

interface PromptStatsProps {
  value: string;
  sectionCount: number;
}

export function PromptStats({ value, sectionCount }: PromptStatsProps) {
  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const tokenEstimate = Math.ceil(charCount / 4);

  return (
    <div className="flex items-center gap-6 text-sm">
      <div className="flex flex-col items-center">
        <span className="text-primary font-semibold">{charCount}</span>
        <span className="text-muted-foreground text-xs uppercase">Characters</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-primary font-semibold">{wordCount}</span>
        <span className="text-muted-foreground text-xs uppercase">Words</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-cyan-400 font-semibold">~{tokenEstimate}</span>
        <span className="text-muted-foreground text-xs uppercase">Est. Tokens</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-foreground font-semibold">{sectionCount}</span>
        <span className="text-muted-foreground text-xs uppercase">Sections</span>
      </div>
    </div>
  );
}

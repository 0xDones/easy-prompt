import { useEffect, useMemo } from "react";
import { usePromptForm } from "@/hooks/usePromptForm";
import { PROMPT_TEMPLATES } from "@/lib/templates";
import { PERSONA_TEMPLATES } from "@/lib/personas";
import { generatePrompt } from "@/lib/generatePrompt";
import { PromptTip } from "./PromptTip";
import { TemplateChips } from "./TemplateChips";
import { PersonaChips } from "./PersonaChips";
import { FieldSection } from "./FieldSection";
import { ExampleCard } from "./ExampleCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PromptData } from "@/types/prompt";

interface PromptFormProps {
  onPromptChange: (prompt: string) => void;
  onSectionCountChange: (count: number) => void;
}

type FieldStatus = "required" | "recommended" | "optional";

interface FieldTabConfig {
  value: string;
  label: string;
  status: FieldStatus;
  dataKey: keyof PromptData | "examples";
}

const FIELD_TABS: FieldTabConfig[] = [
  { value: "task", label: "Task", status: "required", dataKey: "task" },
  { value: "role", label: "Role", status: "optional", dataKey: "role" },
  { value: "context", label: "Context", status: "optional", dataKey: "context" },
  { value: "constraints", label: "Constraints", status: "recommended", dataKey: "constraints" },
  { value: "format", label: "Format", status: "recommended", dataKey: "format" },
  { value: "examples", label: "Examples", status: "optional", dataKey: "examples" },
  { value: "successCriteria", label: "Criteria", status: "optional", dataKey: "successCriteria" },
  { value: "input", label: "Input", status: "optional", dataKey: "input" },
];

function isFieldFilled(data: PromptData, tab: FieldTabConfig): boolean {
  if (tab.dataKey === "examples") {
    return data.examples.some((ex) => ex.input.trim() || ex.output.trim());
  }
  const value = data[tab.dataKey as keyof PromptData];
  return typeof value === "string" && value.trim().length > 0;
}

export function PromptForm({ onPromptChange, onSectionCountChange }: PromptFormProps) {
  const {
    data,
    updateField,
    addExample,
    updateExample,
    removeExample,
    clearAll,
    loadTemplate,
    loadPersona,
    selectedPersonaId,
    selectedTemplateId,
  } = usePromptForm();

  const prompt = useMemo(() => generatePrompt(data), [data]);

  const sectionCount = useMemo(() => {
    let count = 0;
    if (data.task.trim()) count++;
    if (data.enabledSections.role && data.role.trim()) count++;
    if (data.enabledSections.context && data.context.trim()) count++;
    if (data.enabledSections.constraints && data.constraints.trim()) count++;
    if (data.enabledSections.format && data.format.trim()) count++;
    if (data.enabledSections.successCriteria && data.successCriteria.trim()) count++;
    if (data.enabledSections.examples && data.examples.some(ex => ex.input.trim() || ex.output.trim())) count++;
    if (data.enabledSections.input && data.input.trim()) count++;
    return count;
  }, [data]);

  useEffect(() => {
    onPromptChange(prompt);
  }, [prompt, onPromptChange]);

  useEffect(() => {
    onSectionCountChange(sectionCount);
  }, [sectionCount, onSectionCountChange]);

  useEffect(() => {
    const handleClearAll = () => clearAll();
    window.addEventListener("prompt-clear-all", handleClearAll);
    return () => window.removeEventListener("prompt-clear-all", handleClearAll);
  }, [clearAll]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Fixed header area */}
      <div className="shrink-0 space-y-4 p-4 pb-0">
        {/* Panel Header */}
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <h2 className="text-lg font-semibold">Build Your Prompt</h2>
        </div>

        {/* Prompt Tip */}
        <PromptTip />

        {/* Quick Personas */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Quick Personas</h3>
          <PersonaChips
            personas={PERSONA_TEMPLATES}
            selectedId={selectedPersonaId}
            onSelect={loadPersona}
          />
        </div>

        {/* Full Prompt Templates */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Full Prompt Templates</h3>
          <TemplateChips
            templates={PROMPT_TEMPLATES}
            selectedId={selectedTemplateId}
            onSelect={loadTemplate}
          />
        </div>
      </div>

      {/* Tabbed field area */}
      <Tabs defaultValue="task" className="flex-1 flex flex-col overflow-hidden px-4 pt-4">
        <TabsList className="shrink-0">
          {FIELD_TABS.map((tab) => {
            const filled = isFieldFilled(data, tab);
            return (
              <TabsTrigger key={tab.value} value={tab.value}>
                <span
                  className={cn(
                    "tab-status-dot",
                    tab.status,
                    filled && "filled"
                  )}
                />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Task */}
        <TabsContent value="task" className="tab-content-area">
          <FieldSection
            label="Task"
            xmlTag="<task>"
            status="required"
            description="ONE clear, specific goal. What exactly should Claude do?"
            placeholder="e.g., Review this code for security vulnerabilities and suggest fixes."
            value={data.task}
            onChange={(v) => updateField("task", v)}
            rows={6}
          />
        </TabsContent>

        {/* Role */}
        <TabsContent value="role" className="tab-content-area">
          <FieldSection
            label="Role / Persona"
            xmlTag="<role>"
            status="optional"
            description="Who should Claude be? Define expertise, perspective, and tone."
            placeholder="e.g., You are a senior Python developer with 10 years of experience..."
            value={data.role}
            onChange={(v) => updateField("role", v)}
            rows={6}
          />
        </TabsContent>

        {/* Context */}
        <TabsContent value="context" className="tab-content-area">
          <FieldSection
            label="Context"
            xmlTag="<context>"
            status="optional"
            description="Background information, documents, situation details, or domain knowledge."
            placeholder="e.g., I'm building a SaaS application for small businesses..."
            value={data.context}
            onChange={(v) => updateField("context", v)}
            rows={6}
          />
        </TabsContent>

        {/* Constraints */}
        <TabsContent value="constraints" className="tab-content-area">
          <FieldSection
            label="Constraints"
            xmlTag="<constraints>"
            status="recommended"
            description="Boundaries, limitations, preferences. Tell Claude what to do instead of what NOT to do."
            placeholder="e.g., Use only standard library. Keep functions under 20 lines. Prefer readability over performance."
            value={data.constraints}
            onChange={(v) => updateField("constraints", v)}
            rows={6}
          />
        </TabsContent>

        {/* Output Format */}
        <TabsContent value="format" className="tab-content-area">
          <FieldSection
            label="Output Format"
            xmlTag="<format>"
            status="recommended"
            description="Desired structure, length, or style of the response."
            placeholder="e.g., Return a numbered list of issues with severity and suggested fix."
            value={data.format}
            onChange={(v) => updateField("format", v)}
            rows={6}
          />
        </TabsContent>

        {/* Examples */}
        <TabsContent value="examples" className="tab-content-area">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-foreground">Examples</span>
              <span className="px-2 py-0.5 text-xs font-mono rounded bg-pink-500/10 text-pink-400">
                {"<examples>"}
              </span>
              <span className="px-2 py-0.5 text-xs rounded font-medium bg-muted text-muted-foreground">
                OPTIONAL
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Show example inputs and expected outputs</p>
            <div className="space-y-3">
              {data.examples.map((example, index) => (
                <ExampleCard
                  key={example.id}
                  example={example}
                  index={index}
                  onUpdate={(field, value) => updateExample(example.id, field, value)}
                  onRemove={() => removeExample(example.id)}
                />
              ))}
              <Button variant="outline" onClick={addExample} className="w-full">
                <Plus className="h-4 w-4 mr-1" />
                Add Example
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Success Criteria */}
        <TabsContent value="successCriteria" className="tab-content-area">
          <FieldSection
            label="Success Criteria"
            xmlTag="<success_criteria>"
            status="optional"
            description="How will you verify the output is correct?"
            placeholder="e.g., Every issue references line numbers. Code fixes are syntactically valid."
            value={data.successCriteria}
            onChange={(v) => updateField("successCriteria", v)}
            rows={6}
          />
        </TabsContent>

        {/* Input */}
        <TabsContent value="input" className="tab-content-area">
          <FieldSection
            label="Input"
            xmlTag="<input>"
            status="optional"
            description="What data should be processed?"
            placeholder="Paste the code, text, or data to process..."
            value={data.input}
            onChange={(v) => updateField("input", v)}
            rows={8}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

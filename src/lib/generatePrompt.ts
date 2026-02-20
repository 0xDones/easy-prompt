import type { PromptData } from "@/types/prompt";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function wrapTag(tag: string, content: string): string {
  if (!content.trim()) return "";
  return `<${tag}>\n${escapeXml(content.trim())}\n</${tag}>`;
}

export function generatePrompt(data: PromptData): string {
  const sections: string[] = [];
  const { enabledSections } = data;

  // Order follows PROMPT_GUIDE.md tag hierarchy
  // 1. role (optional, but placed first in output)
  if (enabledSections.role && data.role.trim()) {
    sections.push(wrapTag("role", data.role));
  }

  // 2. context
  if (enabledSections.context && data.context.trim()) {
    sections.push(wrapTag("context", data.context));
  }

  // 3. task (required)
  if (data.task.trim()) {
    sections.push(wrapTag("task", data.task));
  }

  // 4. constraints
  if (enabledSections.constraints && data.constraints.trim()) {
    sections.push(wrapTag("constraints", data.constraints));
  }

  // 5. format
  if (enabledSections.format && data.format.trim()) {
    sections.push(wrapTag("format", data.format));
  }

  // 6. success_criteria
  if (enabledSections.successCriteria && data.successCriteria.trim()) {
    sections.push(wrapTag("success_criteria", data.successCriteria));
  }

  // 7. examples
  if (enabledSections.examples && data.examples.length > 0) {
    const examplesContent = data.examples
      .filter((ex) => ex.input.trim() || ex.output.trim())
      .map(
        (ex) =>
          `<example>\nInput: ${escapeXml(ex.input)}\nOutput: ${escapeXml(ex.output)}\n</example>`
      )
      .join("\n\n");
    if (examplesContent) {
      sections.push(`<examples>\n${examplesContent}\n</examples>`);
    }
  }

  // 8. input
  if (enabledSections.input && data.input.trim()) {
    sections.push(wrapTag("input", data.input));
  }

  return sections.join("\n\n");
}

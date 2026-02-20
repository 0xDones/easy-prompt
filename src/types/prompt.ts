export interface Example {
  id: string;
  input: string;
  output: string;
}

export interface PromptData {
  task: string;
  constraints: string;
  format: string;
  context: string;
  role: string;
  examples: Example[];
  successCriteria: string;
  input: string;
  // Track which optional sections are enabled
  enabledSections: {
    constraints: boolean;
    format: boolean;
    context: boolean;
    role: boolean;
    examples: boolean;
    successCriteria: boolean;
    input: boolean;
  };
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  data: Partial<PromptData>;
}

export interface PersonaTemplate {
  id: string;
  name: string;
  description: string;
  role: string;
}

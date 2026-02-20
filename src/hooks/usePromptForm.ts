import { useState, useEffect, useCallback } from "react";
import type { PromptData, Example, PromptTemplate, PersonaTemplate } from "@/types/prompt";

const STORAGE_KEY = "prompt-generator-form";

const DEFAULT_STATE: PromptData = {
  task: "",
  constraints: "",
  format: "",
  context: "",
  role: "",
  examples: [],
  successCriteria: "",
  input: "",
  enabledSections: {
    constraints: true,
    format: true,
    context: true,
    role: true,
    examples: true,
    successCriteria: true,
    input: true,
  },
};

export function usePromptForm() {
  const [data, setData] = useState<PromptData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_STATE;
  });

  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Persist to localStorage on change (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, 500);
    return () => clearTimeout(timeout);
  }, [data]);

  const updateField = useCallback(<K extends keyof PromptData>(
    field: K,
    value: PromptData[K]
  ) => {
    setData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleSection = useCallback((section: keyof PromptData["enabledSections"]) => {
    setData((prev) => ({
      ...prev,
      enabledSections: {
        ...prev.enabledSections,
        [section]: !prev.enabledSections[section],
      },
    }));
  }, []);

  const addExample = useCallback(() => {
    const newExample: Example = {
      id: crypto.randomUUID(),
      input: "",
      output: "",
    };
    setData((prev) => ({
      ...prev,
      examples: [...prev.examples, newExample],
    }));
  }, []);

  const updateExample = useCallback((id: string, field: "input" | "output", value: string) => {
    setData((prev) => ({
      ...prev,
      examples: prev.examples.map((ex) =>
        ex.id === id ? { ...ex, [field]: value } : ex
      ),
    }));
  }, []);

  const removeExample = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      examples: prev.examples.filter((ex) => ex.id !== id),
    }));
  }, []);

  const clearAll = useCallback(() => {
    setData(DEFAULT_STATE);
    setSelectedPersonaId(null);
    setSelectedTemplateId(null);
  }, []);

  const loadTemplate = useCallback((template: PromptTemplate) => {
    setData(() => ({
      ...DEFAULT_STATE,
      ...template.data,
      enabledSections: {
        ...DEFAULT_STATE.enabledSections,
        ...template.data.enabledSections,
      },
    }));
    setSelectedTemplateId(template.id);
    setSelectedPersonaId(null);
  }, []);

  const loadPersona = useCallback((persona: PersonaTemplate) => {
    setData((prev) => ({
      ...prev,
      role: persona.role,
      enabledSections: {
        ...prev.enabledSections,
        role: true,
      },
    }));
    setSelectedPersonaId(persona.id);
    setSelectedTemplateId(null);
  }, []);

  return {
    data,
    updateField,
    toggleSection,
    addExample,
    updateExample,
    removeExample,
    clearAll,
    loadTemplate,
    loadPersona,
    selectedPersonaId,
    selectedTemplateId,
  };
}

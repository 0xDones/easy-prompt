import { useState, useEffect } from "react";
import { Header } from "@/components/Header/Header";
import { PromptForm } from "@/components/PromptForm/PromptForm";
import { PromptPreview } from "@/components/PromptPreview/PromptPreview";

function App() {
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [editedPrompt, setEditedPrompt] = useState("");
  const [isEdited, setIsEdited] = useState(false);
  const [sectionCount, setSectionCount] = useState(0);

  // Sync generated prompt to preview when not manually edited
  useEffect(() => {
    if (!isEdited) {
      setEditedPrompt(generatedPrompt);
    }
  }, [generatedPrompt, isEdited]);

  const handlePreviewChange = (value: string) => {
    setEditedPrompt(value);
    setIsEdited(value !== generatedPrompt);
  };

  const handleClearAll = () => {
    // Dispatch custom event to trigger form clear
    window.dispatchEvent(new CustomEvent("prompt-clear-all"));
    // Also reset edited state
    setIsEdited(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 px-16 pb-6">
        <div className="grid grid-cols-2 gap-4 h-full">
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <PromptForm
              onPromptChange={setGeneratedPrompt}
              onSectionCountChange={setSectionCount}
            />
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <PromptPreview
              value={editedPrompt}
              onChange={handlePreviewChange}
              sectionCount={sectionCount}
              onClearAll={handleClearAll}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

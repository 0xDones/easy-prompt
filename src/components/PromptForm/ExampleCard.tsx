import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import type { Example } from "@/types/prompt";

interface ExampleCardProps {
  example: Example;
  index: number;
  onUpdate: (field: "input" | "output", value: string) => void;
  onRemove: () => void;
}

export function ExampleCard({ example, index, onUpdate, onRemove }: ExampleCardProps) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium">Example {index + 1}</span>
          <Button variant="ghost" size="icon" onClick={onRemove}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-3">
          <div>
            <Label htmlFor={`input-${example.id}`}>Input</Label>
            <Textarea
              id={`input-${example.id}`}
              value={example.input}
              onChange={(e) => onUpdate("input", e.target.value)}
              placeholder="Example input..."
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor={`output-${example.id}`}>Output</Label>
            <Textarea
              id={`output-${example.id}`}
              value={example.output}
              onChange={(e) => onUpdate("output", e.target.value)}
              placeholder="Expected output..."
              rows={2}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

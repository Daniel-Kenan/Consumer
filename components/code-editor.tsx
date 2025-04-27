"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play } from "lucide-react"
import { EnhancedCodeEditor } from "@/components/enhanced-code-editor"

// Update the CodeEditorProps interface to support more languages
interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language:
    | "javascript"
    | "python"
    | "json"
    | "text"
    | "c"
    | "cpp"
    | "bash"
    | "powershell"
    | "sql"
    | "html"
    | "css"
    | "typescript"
  height?: string
  readOnly?: boolean
  onRun?: (code: string) => void
}

export function CodeEditor({ value, onChange, language, height = "300px", readOnly = false, onRun }: CodeEditorProps) {
  return (
    <EnhancedCodeEditor
      value={value}
      onChange={onChange}
      language={language}
      height={height}
      readOnly={readOnly}
      onRun={onRun}
    />
  )
}

export function CodeEditorWithPreview({
  value,
  onChange,
  language,
  height = "300px",
  readOnly = false,
  onRun,
  previewContent,
}: CodeEditorProps & { previewContent?: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")

  return (
    <div className="border rounded-md">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "edit" | "preview")}>
        <div className="flex items-center justify-between p-2 border-b bg-muted/50">
          <TabsList className="h-8">
            <TabsTrigger value="edit" className="text-xs px-3">
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs px-3">
              Preview
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            {!readOnly && onRun && (
              <Button variant="default" size="sm" onClick={() => onRun(value)}>
                <Play className="h-3.5 w-3.5 mr-1" />
                Run
              </Button>
            )}
          </div>
        </div>
        <TabsContent value="edit" className="mt-0">
          <EnhancedCodeEditor
            value={value}
            onChange={onChange}
            language={language}
            height={height}
            readOnly={readOnly}
            onRun={onRun}
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-0">
          <div className="p-4" style={{ height, overflowY: "auto" }}>
            {previewContent || (
              <div className="text-muted-foreground text-sm">Preview not available. Run the code to see results.</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Component for displaying code execution results
export function CodeExecutionResult({ result, error }: { result?: any; error?: string }) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800 font-mono text-sm">
        <div className="font-medium mb-1">Error:</div>
        <div>{error}</div>
      </div>
    )
  }

  if (!result) {
    return <div className="text-muted-foreground text-sm italic">No results yet. Run the code to see output.</div>
  }

  return (
    <div className="space-y-2">
      <Label>Output:</Label>
      <div className="bg-muted p-4 rounded-md overflow-auto font-mono text-sm">
        {typeof result === "object" ? JSON.stringify(result, null, 2) : String(result)}
      </div>
    </div>
  )
}

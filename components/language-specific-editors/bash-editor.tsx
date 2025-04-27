"use client"

import { useState } from "react"
import { EnhancedCodeEditor } from "@/components/enhanced-code-editor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Terminal, BookOpen, FileText, Play } from "lucide-react"

interface BashEditorProps {
  initialCode?: string
  onCodeChange?: (code: string) => void
  readOnly?: boolean
  height?: string
  showDocumentation?: boolean
}

const DEFAULT_BASH_CODE = `#!/bin/bash

# A simple bash script to demonstrate basic functionality

# Function to display a greeting
greet() {
  local name=$1
  echo "Hello, $name!"
}

# Check if an argument was provided
if [ $# -eq 0 ]; then
  echo "Usage: $0 <name>"
  exit 1
else
  greet "$1"
fi

# Loop example
echo "Counting from 1 to 5:"
for i in {1..5}; do
  echo "Number: $i"
done

# Conditional example
current_hour=$(date +%H)
if [ $current_hour -lt 12 ]; then
  echo "Good morning!"
elif [ $current_hour -lt 18 ]; then
  echo "Good afternoon!"
else
  echo "Good evening!"
fi

# Exit with success status
exit 0
`

export function BashEditor({
  initialCode = DEFAULT_BASH_CODE,
  onCodeChange,
  readOnly = false,
  height = "300px",
  showDocumentation = true,
}: BashEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("editor")

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    if (onCodeChange) {
      onCodeChange(newCode)
    }
  }

  const handleRunCode = async (codeToRun: string) => {
    setOutput(null)
    setError(null)

    try {
      // In a real implementation, this would execute the bash script
      // For now, we'll just simulate execution
      setOutput(
        "Simulated Bash execution output:\n" +
          "Usage: script.sh <name>\n" +
          "Hello, User!\n" +
          "Counting from 1 to 5:\n" +
          "Number: 1\n" +
          "Number: 2\n" +
          "Number: 3\n" +
          "Number: 4\n" +
          "Number: 5\n" +
          "Good afternoon!",
      )
      return "Execution completed successfully"
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const bashDocumentation = (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">Bash Scripting Quick Reference</h3>

      <div>
        <h4 className="font-medium">Basic Syntax</h4>
        <pre className="bg-muted p-2 rounded-md text-sm mt-1">
          <code>{`#!/bin/bash  # Shebang line

# This is a comment
echo "Hello, World!"  # Print to console

# Variables
name="John"
echo "Hello, $name"   # Variable expansion`}</code>
        </pre>
      </div>

      <div>
        <h4 className="font-medium">Control Structures</h4>
        <pre className="bg-muted p-2 rounded-md text-sm mt-1">
          <code>{`# If statement
if [ "$x" -gt 0 ]; then
  echo "Positive"
elif [ "$x" -eq 0 ]; then
  echo "Zero"
else
  echo "Negative"
fi

# For loop
for i in {1..5}; do
  echo "Number: $i"
done

# While loop
count=1
while [ $count -le 5 ]; do
  echo "Count: $count"
  ((count++))
done`}</code>
        </pre>
      </div>

      <div>
        <h4 className="font-medium">Functions</h4>
        <pre className="bg-muted p-2 rounded-md text-sm mt-1">
          <code>{`# Function definition
greet() {
  local name=$1  # First argument
  echo "Hello, $name!"
}

# Function call
greet "World"  # Outputs: Hello, World!`}</code>
        </pre>
      </div>

      <div>
        <h4 className="font-medium">Common Commands</h4>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>
            <code>ls</code> - List directory contents
          </li>
          <li>
            <code>cd</code> - Change directory
          </li>
          <li>
            <code>grep</code> - Search text patterns
          </li>
          <li>
            <code>sed</code> - Stream editor for text manipulation
          </li>
          <li>
            <code>awk</code> - Text processing tool
          </li>
          <li>
            <code>find</code> - Search for files
          </li>
        </ul>
      </div>
    </div>
  )

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          Bash Editor
        </CardTitle>
        <CardDescription>Write, edit, and run Bash scripts</CardDescription>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="editor" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="output" className="flex items-center gap-1">
              <Terminal className="h-4 w-4" />
              Output
            </TabsTrigger>
            {showDocumentation && (
              <TabsTrigger value="docs" className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                Docs
              </TabsTrigger>
            )}
          </TabsList>
        </div>
        <CardContent className="pt-3">
          <TabsContent value="editor" className="mt-0">
            <EnhancedCodeEditor
              value={code}
              onChange={handleCodeChange}
              language="bash"
              height={height}
              readOnly={readOnly}
              onRun={handleRunCode}
              filename="script.sh"
            />
          </TabsContent>
          <TabsContent value="output" className="mt-0">
            <div className="bg-black text-green-400 font-mono p-4 rounded-md" style={{ height, overflowY: "auto" }}>
              {error ? (
                <div className="text-red-400">
                  <div className="font-bold">Error:</div>
                  <pre>{error}</pre>
                </div>
              ) : output ? (
                <pre>{output}</pre>
              ) : (
                <div className="text-gray-500 italic">Run the script to see output here</div>
              )}
            </div>
          </TabsContent>
          {showDocumentation && (
            <TabsContent value="docs" className="mt-0">
              <div className="border rounded-md" style={{ height, overflowY: "auto" }}>
                {bashDocumentation}
              </div>
            </TabsContent>
          )}
        </CardContent>
      </Tabs>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">Bash 5.1.16</div>
        <Button variant="default" size="sm" onClick={() => handleRunCode(code)} disabled={readOnly}>
          <Play className="h-4 w-4 mr-1" />
          Run Script
        </Button>
      </CardFooter>
    </Card>
  )
}

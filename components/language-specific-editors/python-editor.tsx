"use client"

import { useState } from "react"
import { EnhancedCodeEditor } from "@/components/enhanced-code-editor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Terminal, BookOpen, FileText, Play } from "lucide-react"

interface PythonEditorProps {
  initialCode?: string
  onCodeChange?: (code: string) => void
  readOnly?: boolean
  height?: string
  showDocumentation?: boolean
}

const DEFAULT_PYTHON_CODE = `# Python Example
def fibonacci(n):
    """Generate the Fibonacci sequence up to n"""
    a, b = 0, 1
    result = []
    while a < n:
        result.append(a)
        a, b = b, a + b
    return result

# Print the Fibonacci sequence up to 100
print(fibonacci(100))
`

export function PythonEditor({
  initialCode = DEFAULT_PYTHON_CODE,
  onCodeChange,
  readOnly = false,
  height = "300px",
  showDocumentation = true,
}: PythonEditorProps) {
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
      // In a real implementation, this would execute the Python code
      // For now, we'll just simulate execution
      setOutput(
        "Simulated Python execution output:\n" +
          "Running fibonacci(100)...\n" +
          "[0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]",
      )
      return "Execution completed successfully"
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const pythonDocumentation = (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">Python Quick Reference</h3>

      <div>
        <h4 className="font-medium">Basic Syntax</h4>
        <pre className="bg-muted p-2 rounded-md text-sm mt-1">
          <code>{`# This is a comment
print("Hello, World!")  # Print to console
x = 5  # Variable assignment
if x > 0:
    print("Positive")  # Indentation is important!`}</code>
        </pre>
      </div>

      <div>
        <h4 className="font-medium">Data Structures</h4>
        <pre className="bg-muted p-2 rounded-md text-sm mt-1">
          <code>{`# Lists
my_list = [1, 2, 3]
my_list.append(4)  # [1, 2, 3, 4]

# Dictionaries
my_dict = {"name": "John", "age": 30}
print(my_dict["name"])  # John

# Tuples (immutable)
my_tuple = (1, 2, 3)`}</code>
        </pre>
      </div>

      <div>
        <h4 className="font-medium">Functions</h4>
        <pre className="bg-muted p-2 rounded-md text-sm mt-1">
          <code>{`def greet(name, greeting="Hello"):
    """This is a docstring"""
    return f"{greeting}, {name}!"

# Call the function
message = greet("World")
print(message)  # Hello, World!`}</code>
        </pre>
      </div>

      <div>
        <h4 className="font-medium">Common Libraries</h4>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>
            <code>numpy</code> - Numerical computing
          </li>
          <li>
            <code>pandas</code> - Data analysis
          </li>
          <li>
            <code>matplotlib</code> - Data visualization
          </li>
          <li>
            <code>requests</code> - HTTP requests
          </li>
          <li>
            <code>flask</code> / <code>django</code> - Web frameworks
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
          Python Editor
        </CardTitle>
        <CardDescription>Write, edit, and run Python code</CardDescription>
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
              language="python"
              height={height}
              readOnly={readOnly}
              onRun={handleRunCode}
              filename="script.py"
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
                <div className="text-gray-500 italic">Run the code to see output here</div>
              )}
            </div>
          </TabsContent>
          {showDocumentation && (
            <TabsContent value="docs" className="mt-0">
              <div className="border rounded-md" style={{ height, overflowY: "auto" }}>
                {pythonDocumentation}
              </div>
            </TabsContent>
          )}
        </CardContent>
      </Tabs>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">Python 3.10</div>
        <Button variant="default" size="sm" onClick={() => handleRunCode(code)} disabled={readOnly}>
          <Play className="h-4 w-4 mr-1" />
          Run Code
        </Button>
      </CardFooter>
    </Card>
  )
}

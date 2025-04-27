"use client"

import { useState } from "react"
import { EnhancedCodeEditor } from "@/components/enhanced-code-editor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Terminal, BookOpen, FileText, Play } from "lucide-react"

interface CEditorProps {
  initialCode?: string
  onCodeChange?: (code: string) => void
  readOnly?: boolean
  height?: string
  showDocumentation?: boolean
}

const DEFAULT_C_CODE = `#include <stdio.h>

/**
 * Calculate the factorial of a number
 * @param n The number to calculate factorial for
 * @return The factorial of n
 */
unsigned long factorial(unsigned int n) {
    if (n == 0 || n == 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

int main() {
    int num = 5;
    printf("Factorial of %d is %lu\\n", num, factorial(num));
    return 0;
}
`

export function CEditor({
  initialCode = DEFAULT_C_CODE,
  onCodeChange,
  readOnly = false,
  height = "300px",
  showDocumentation = true,
}: CEditorProps) {
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
      // In a real implementation, this would compile and execute the C code
      // For now, we'll just simulate execution
      setOutput(
        "Simulated C execution output:\n" + "Compiling program...\n" + "Running program...\n" + "Factorial of 5 is 120",
      )
      return "Execution completed successfully"
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const cDocumentation = (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">C Programming Quick Reference</h3>

      <div>
        <h4 className="font-medium">Basic Syntax</h4>
        <pre className="bg-muted p-2 rounded-md text-sm mt-1">
          <code>{`#include <stdio.h>  // Include standard I/O library

// Main function - program entry point
int main() {
    // Print to console
    printf("Hello, World!\\n");
    
    // Variable declaration
    int x = 5;
    
    // Conditional statement
    if (x > 0) {
        printf("Positive\\n");
    }
    
    return 0;  // Return status
}`}</code>
        </pre>
      </div>

      <div>
        <h4 className="font-medium">Data Types</h4>
        <pre className="bg-muted p-2 rounded-md text-sm mt-1">
          <code>{`// Basic data types
int i = 42;            // Integer
float f = 3.14;        // Single-precision floating point
double d = 3.14159;    // Double-precision floating point
char c = 'A';          // Character
char str[] = "Hello";  // String (character array)

// Arrays
int numbers[5] = {1, 2, 3, 4, 5};

// Pointers
int *ptr = &i;  // Pointer to integer i`}</code>
        </pre>
      </div>

      <div>
        <h4 className="font-medium">Functions</h4>
        <pre className="bg-muted p-2 rounded-md text-sm mt-1">
          <code>{`// Function declaration
int add(int a, int b);

// Function definition
int add(int a, int b) {
    return a + b;
}

// Function call
int result = add(5, 3);  // result = 8`}</code>
        </pre>
      </div>

      <div>
        <h4 className="font-medium">Common Libraries</h4>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>
            <code>stdio.h</code> - Standard I/O functions
          </li>
          <li>
            <code>stdlib.h</code> - General utilities
          </li>
          <li>
            <code>string.h</code> - String manipulation
          </li>
          <li>
            <code>math.h</code> - Mathematical functions
          </li>
          <li>
            <code>time.h</code> - Date and time functions
          </li>
        </ul>
      </div>
    </div>
  )

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Terminal className="h-5 w-5" />C Editor
        </CardTitle>
        <CardDescription>Write, edit, and run C code</CardDescription>
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
              language="c"
              height={height}
              readOnly={readOnly}
              onRun={handleRunCode}
              filename="program.c"
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
                {cDocumentation}
              </div>
            </TabsContent>
          )}
        </CardContent>
      </Tabs>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">GCC 11.2.0</div>
        <Button variant="default" size="sm" onClick={() => handleRunCode(code)} disabled={readOnly}>
          <Play className="h-4 w-4 mr-1" />
          Compile & Run
        </Button>
      </CardFooter>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { EnhancedCodeEditor } from "@/components/enhanced-code-editor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Terminal, BookOpen, FileText, Play } from "lucide-react"

interface PowerShellEditorProps {
  initialCode?: string
  onCodeChange?: (code: string) => void
  readOnly?: boolean
  height?: string
  showDocumentation?: boolean
}

const DEFAULT_POWERSHELL_CODE = `# PowerShell script example

# Function to get system information
function Get-SystemInfo {
    param (
        [Parameter(Mandatory=$false)]
        [switch]$Detailed
    )
    
    $computerSystem = Get-CimInstance CIM_ComputerSystem
    $operatingSystem = Get-CimInstance CIM_OperatingSystem
    
    $info = [PSCustomObject]@{
        ComputerName = $computerSystem.Name
        OSName = $operatingSystem.Caption
        OSVersion = $operatingSystem.Version
        LastBootTime = $operatingSystem.LastBootUpTime
    }
    
    if ($Detailed) {
        $processor = Get-CimInstance CIM_Processor
        $info | Add-Member -MemberType NoteProperty -Name "CPU" -Value $processor.Name
        $info | Add-Member -MemberType NoteProperty -Name "RAM(GB)" -Value ([math]::Round($computerSystem.TotalPhysicalMemory / 1GB, 2))
    }
    
    return $info
}

# Main script execution
Write-Host "System Information:" -ForegroundColor Cyan
$sysInfo = Get-SystemInfo -Detailed
$sysInfo | Format-List

# Example of working with arrays
$fruits = @("Apple", "Banana", "Cherry", "Date", "Elderberry")
Write-Host "Fruit List:" -ForegroundColor Green
foreach ($fruit in $fruits) {
    Write-Host "- $fruit"
}

# Example of error handling
try {
    $nonExistentFile = Get-Content "NonExistentFile.txt" -ErrorAction Stop
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "Script completed successfully!" -ForegroundColor Green
`

export function PowerShellEditor({
  initialCode = DEFAULT_POWERSHELL_CODE,
  onCodeChange,
  readOnly = false,
  height = "300px",
  showDocumentation = true,
}: PowerShellEditorProps) {
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
      // In a real implementation, this would execute the PowerShell script
      // For now, we'll just simulate execution
      setOutput(
        "Simulated PowerShell execution output:\n\n" +
          "System Information:\n" +
          "ComputerName  : DESKTOP-ABC123\n" +
          "OSName        : Microsoft Windows 11 Pro\n" +
          "OSVersion     : 10.0.22000\n" +
          "LastBootTime  : 4/8/2025 7:30:15 AM\n" +
          "CPU           : Intel(R) Core(TM) i7-11700K @ 3.60GHz\n" +
          "RAM(GB)       : 32\n\n" +
          "Fruit List:\n" +
          "- Apple\n" +
          "- Banana\n" +
          "- Cherry\n" +
          "- Date\n" +
          "- Elderberry\n\n" +
          "Error: Cannot find path 'C:\\NonExistentFile.txt' because it does not exist.\n\n" +
          "Script completed successfully!",
      )
      return "Execution completed successfully"
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const powershellDocumentation = (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">PowerShell Quick Reference</h3>

      <div>
        <h4 className="font-medium">Basic Syntax</h4>
        <pre className="bg-muted p-2 rounded-md text-sm mt-1">
          <code>{`# This is a comment
Write-Host "Hello, World!"  # Print to console

# Variables
$name = "John"
Write-Host "Hello, $name"   # Variable expansion`}</code>
        </pre>
      </div>

      <div>
        <h4 className="font-medium">Control Structures</h4>
        <pre className="bg-muted p-2 rounded-md text-sm mt-1">
          <code>{`# If statement
if ($x -gt 0) {
    Write-Host "Positive"
} elseif ($x -eq 0) {
    Write-Host "Zero"
} else {
    Write-Host "Negative"
}

# ForEach loop
$numbers = 1..5
foreach ($num in $numbers) {
    Write-Host "Number: $num"
}

# While loop
$count = 1
while ($count -le 5) {
    Write-Host "Count: $count"
    $count++
}`}</code>
        </pre>
      </div>

      <div>
        <h4 className="font-medium">Functions</h4>
        <pre className="bg-muted p-2 rounded-md text-sm mt-1">
          <code>{`# Function definition
function Greet {
    param (
        [string]$Name = "World"
    )
    
    Write-Host "Hello, $Name!"
}

# Function call
Greet -Name "PowerShell"  # Outputs: Hello, PowerShell!`}</code>
        </pre>
      </div>

      <div>
        <h4 className="font-medium">Common Cmdlets</h4>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>
            <code>Get-Command</code> - List available commands
          </li>
          <li>
            <code>Get-Help</code> - Get help on commands
          </li>
          <li>
            <code>Get-Process</code> - List running processes
          </li>
          <li>
            <code>Get-Service</code> - List services
          </li>
          <li>
            <code>Get-Content</code> - Read file contents
          </li>
          <li>
            <code>Set-Content</code> - Write to a file
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
          PowerShell Editor
        </CardTitle>
        <CardDescription>Write, edit, and run PowerShell scripts</CardDescription>
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
              language="powershell"
              height={height}
              readOnly={readOnly}
              onRun={handleRunCode}
              filename="script.ps1"
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
                {powershellDocumentation}
              </div>
            </TabsContent>
          )}
        </CardContent>
      </Tabs>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">PowerShell 7.3.0</div>
        <Button variant="default" size="sm" onClick={() => handleRunCode(code)} disabled={readOnly}>
          <Play className="h-4 w-4 mr-1" />
          Run Script
        </Button>
      </CardFooter>
    </Card>
  )
}

"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  Copy,
  CheckCheck,
  Download,
  Upload,
  Settings,
  Trash2,
  Table,
  FileJson,
  Terminal,
  AlertCircle,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"

// Import CodeMirror components and extensions
import { EditorView, basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state"
import { javascript } from "@codemirror/lang-javascript"
import { python } from "@codemirror/lang-python"
import { sql } from "@codemirror/lang-sql"
import { html } from "@codemirror/lang-html"
import { css } from "@codemirror/lang-css"
import { json } from "@codemirror/lang-json"
import { cpp } from "@codemirror/lang-cpp"
import { markdown } from "@codemirror/lang-markdown"
import { StreamLanguage } from "@codemirror/language"
import { shell } from "@codemirror/legacy-modes/mode/shell"
import { oneDark } from "@codemirror/theme-one-dark"

// Import autocompletion extensions
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
  type CompletionContext,
  type CompletionResult,
} from "@codemirror/autocomplete"
import { lintKeymap } from "@codemirror/lint"
import { indentWithTab } from "@codemirror/commands"
import { keymap } from "@codemirror/view"

interface EnhancedCodeEditorProps {
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
  filename?: string
}

// Execution result type
interface ExecutionEntry {
  id: string
  timestamp: Date
  code: string
  result?: any
  error?: string
  duration: number
}

// Custom completions for different languages
const customCompletions = {
  javascript: [
    { label: "function", type: "keyword", info: "Define a function" },
    { label: "const", type: "keyword", info: "Declare a constant variable" },
    { label: "let", type: "keyword", info: "Declare a block-scoped variable" },
    { label: "var", type: "keyword", info: "Declare a variable" },
    { label: "return", type: "keyword", info: "Return a value from a function" },
    { label: "if", type: "keyword", info: "Conditional statement" },
    { label: "else", type: "keyword", info: "Alternative conditional statement" },
    { label: "for", type: "keyword", info: "Loop statement" },
    { label: "while", type: "keyword", info: "Loop statement" },
    { label: "switch", type: "keyword", info: "Switch statement" },
    { label: "case", type: "keyword", info: "Case in a switch statement" },
    { label: "break", type: "keyword", info: "Break statement" },
    { label: "continue", type: "keyword", info: "Continue statement" },
    { label: "try", type: "keyword", info: "Try-catch statement" },
    { label: "catch", type: "keyword", info: "Catch block in try-catch" },
    { label: "finally", type: "keyword", info: "Finally block in try-catch" },
    { label: "throw", type: "keyword", info: "Throw an exception" },
    { label: "async", type: "keyword", info: "Define an asynchronous function" },
    { label: "await", type: "keyword", info: "Wait for a promise to resolve" },
    { label: "class", type: "keyword", info: "Define a class" },
    { label: "console.log", type: "function", info: "Log to the console" },
    { label: "document.getElementById", type: "function", info: "Get element by ID" },
    { label: "document.querySelector", type: "function", info: "Query selector" },
    { label: "document.querySelectorAll", type: "function", info: "Query selector all" },
    { label: "fetch", type: "function", info: "Fetch API" },
    { label: "Promise", type: "class", info: "Promise object" },
    { label: "Array", type: "class", info: "Array object" },
    { label: "Object", type: "class", info: "Object constructor" },
    { label: "String", type: "class", info: "String object" },
    { label: "Number", type: "class", info: "Number object" },
    { label: "Boolean", type: "class", info: "Boolean object" },
    { label: "Math", type: "namespace", info: "Math object" },
    { label: "JSON", type: "namespace", info: "JSON object" },
  ],
  python: [
    { label: "def", type: "keyword", info: "Define a function" },
    { label: "class", type: "keyword", info: "Define a class" },
    { label: "if", type: "keyword", info: "Conditional statement" },
    { label: "elif", type: "keyword", info: "Else if conditional" },
    { label: "else", type: "keyword", info: "Alternative conditional" },
    { label: "for", type: "keyword", info: "For loop" },
    { label: "while", type: "keyword", info: "While loop" },
    { label: "try", type: "keyword", info: "Try-except block" },
    { label: "except", type: "keyword", info: "Exception handler" },
    { label: "finally", type: "keyword", info: "Finally block in try-except" },
    { label: "with", type: "keyword", info: "Context manager" },
    { label: "as", type: "keyword", info: "Alias" },
    { label: "import", type: "keyword", info: "Import module" },
    { label: "from", type: "keyword", info: "Import specific items" },
    { label: "return", type: "keyword", info: "Return from function" },
    { label: "yield", type: "keyword", info: "Generator function" },
    { label: "break", type: "keyword", info: "Break statement" },
    { label: "continue", type: "keyword", info: "Continue statement" },
    { label: "pass", type: "keyword", info: "No-op statement" },
    { label: "lambda", type: "keyword", info: "Anonymous function" },
    { label: "global", type: "keyword", info: "Global variable" },
    { label: "nonlocal", type: "keyword", info: "Nonlocal variable" },
    { label: "print", type: "function", info: "Print to console" },
    { label: "len", type: "function", info: "Get length" },
    { label: "range", type: "function", info: "Range generator" },
    { label: "list", type: "class", info: "List constructor" },
    { label: "dict", type: "class", info: "Dictionary constructor" },
    { label: "set", type: "class", info: "Set constructor" },
    { label: "tuple", type: "class", info: "Tuple constructor" },
    { label: "str", type: "class", info: "String constructor" },
    { label: "int", type: "class", info: "Integer constructor" },
    { label: "float", type: "class", info: "Float constructor" },
    { label: "bool", type: "class", info: "Boolean constructor" },
    { label: "open", type: "function", info: "Open a file" },
  ],
  sql: [
    { label: "SELECT", type: "keyword", info: "Select data from a table" },
    { label: "FROM", type: "keyword", info: "Specify table to select from" },
    { label: "WHERE", type: "keyword", info: "Filter records" },
    { label: "JOIN", type: "keyword", info: "Join tables" },
    { label: "LEFT JOIN", type: "keyword", info: "Left join tables" },
    { label: "RIGHT JOIN", type: "keyword", info: "Right join tables" },
    { label: "INNER JOIN", type: "keyword", info: "Inner join tables" },
    { label: "GROUP BY", type: "keyword", info: "Group results" },
    { label: "HAVING", type: "keyword", info: "Filter groups" },
    { label: "ORDER BY", type: "keyword", info: "Sort results" },
    { label: "LIMIT", type: "keyword", info: "Limit results" },
    { label: "INSERT INTO", type: "keyword", info: "Insert data" },
    { label: "VALUES", type: "keyword", info: "Values for insert" },
    { label: "UPDATE", type: "keyword", info: "Update data" },
    { label: "SET", type: "keyword", info: "Set values for update" },
    { label: "DELETE FROM", type: "keyword", info: "Delete data" },
    { label: "CREATE TABLE", type: "keyword", info: "Create a table" },
    { label: "ALTER TABLE", type: "keyword", info: "Alter a table" },
    { label: "DROP TABLE", type: "keyword", info: "Drop a table" },
    { label: "CREATE INDEX", type: "keyword", info: "Create an index" },
    { label: "DROP INDEX", type: "keyword", info: "Drop an index" },
    { label: "COUNT", type: "function", info: "Count rows" },
    { label: "SUM", type: "function", info: "Sum values" },
    { label: "AVG", type: "function", info: "Average values" },
    { label: "MIN", type: "function", info: "Minimum value" },
    { label: "MAX", type: "function", info: "Maximum value" },
    { label: "DISTINCT", type: "keyword", info: "Unique values" },
    { label: "AS", type: "keyword", info: "Alias" },
  ],
  bash: [
    { label: "if", type: "keyword", info: "Conditional statement" },
    { label: "then", type: "keyword", info: "Then part of if statement" },
    { label: "else", type: "keyword", info: "Alternative conditional" },
    { label: "elif", type: "keyword", info: "Else if conditional" },
    { label: "fi", type: "keyword", info: "End if statement" },
    { label: "for", type: "keyword", info: "For loop" },
    { label: "while", type: "keyword", info: "While loop" },
    { label: "do", type: "keyword", info: "Do part of loop" },
    { label: "done", type: "keyword", info: "End loop" },
    { label: "case", type: "keyword", info: "Case statement" },
    { label: "esac", type: "keyword", info: "End case statement" },
    { label: "function", type: "keyword", info: "Define function" },
    { label: "return", type: "keyword", info: "Return from function" },
    { label: "exit", type: "keyword", info: "Exit script" },
    { label: "export", type: "keyword", info: "Export variable" },
    { label: "echo", type: "command", info: "Print to console" },
    { label: "cd", type: "command", info: "Change directory" },
    { label: "ls", type: "command", info: "List directory contents" },
    { label: "mkdir", type: "command", info: "Make directory" },
    { label: "rm", type: "command", info: "Remove files or directories" },
    { label: "cp", type: "command", info: "Copy files or directories" },
    { label: "mv", type: "command", info: "Move files or directories" },
    { label: "grep", type: "command", info: "Search text" },
    { label: "find", type: "command", info: "Find files" },
    { label: "sed", type: "command", info: "Stream editor" },
    { label: "awk", type: "command", info: "Text processing" },
    { label: "cat", type: "command", info: "Concatenate files" },
    { label: "head", type: "command", info: "Show first lines" },
    { label: "tail", type: "command", info: "Show last lines" },
    { label: "chmod", type: "command", info: "Change file permissions" },
    { label: "chown", type: "command", info: "Change file owner" },
  ],
  c: [
    { label: "int", type: "keyword", info: "Integer type" },
    { label: "char", type: "keyword", info: "Character type" },
    { label: "float", type: "keyword", info: "Float type" },
    { label: "double", type: "keyword", info: "Double type" },
    { label: "void", type: "keyword", info: "Void type" },
    { label: "struct", type: "keyword", info: "Structure definition" },
    { label: "union", type: "keyword", info: "Union definition" },
    { label: "enum", type: "keyword", info: "Enumeration" },
    { label: "typedef", type: "keyword", info: "Type definition" },
    { label: "const", type: "keyword", info: "Constant" },
    { label: "static", type: "keyword", info: "Static variable" },
    { label: "extern", type: "keyword", info: "External variable" },
    { label: "if", type: "keyword", info: "Conditional statement" },
    { label: "else", type: "keyword", info: "Alternative conditional" },
    { label: "switch", type: "keyword", info: "Switch statement" },
    { label: "case", type: "keyword", info: "Case in switch" },
    { label: "default", type: "keyword", info: "Default case" },
    { label: "for", type: "keyword", info: "For loop" },
    { label: "while", type: "keyword", info: "While loop" },
    { label: "do", type: "keyword", info: "Do-while loop" },
    { label: "break", type: "keyword", info: "Break statement" },
    { label: "continue", type: "keyword", info: "Continue statement" },
    { label: "return", type: "keyword", info: "Return statement" },
    { label: "sizeof", type: "keyword", info: "Size of operator" },
    { label: "printf", type: "function", info: "Print formatted output" },
    { label: "scanf", type: "function", info: "Read formatted input" },
    { label: "malloc", type: "function", info: "Allocate memory" },
    { label: "free", type: "function", info: "Free allocated memory" },
    { label: "fopen", type: "function", info: "Open a file" },
    { label: "fclose", type: "function", info: "Close a file" },
    { label: "fread", type: "function", info: "Read from file" },
    { label: "fwrite", type: "function", info: "Write to file" },
    { label: "strlen", type: "function", info: "String length" },
    { label: "strcpy", type: "function", info: "Copy string" },
    { label: "strcat", type: "function", info: "Concatenate strings" },
    { label: "strcmp", type: "function", info: "Compare strings" },
  ],
}

// Custom completion function
function myCompletions(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/\w*/)
  if (word === null || (word.from === word.to && !context.explicit)) return null

  // Get language from editor state
  const state = context.state
  const languageField = state.field({ provides: "language" }, false)
  let language = "text"

  // Try to determine language from the editor state
  if (languageField) {
    if (languageField.name.includes("javascript")) language = "javascript"
    else if (languageField.name.includes("python")) language = "python"
    else if (languageField.name.includes("sql")) language = "sql"
    else if (languageField.name.includes("shell")) language = "bash"
    else if (languageField.name.includes("cpp")) language = "c"
  }

  // Get completions for the detected language
  const completions = customCompletions[language as keyof typeof customCompletions] || []

  return {
    from: word.from,
    options: completions,
    filter: true,
  }
}

export function EnhancedCodeEditor({
  value,
  onChange,
  language,
  height = "300px",
  readOnly = false,
  onRun,
  filename,
}: EnhancedCodeEditorProps) {
  const [code, setCode] = useState(value || "")
  const [isCopied, setIsCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"edit" | "output">("edit")
  const [executionHistory, setExecutionHistory] = useState<ExecutionEntry[]>([])
  const [currentExecutionId, setCurrentExecutionId] = useState<string | null>(null)
  const [isOutputCopied, setIsOutputCopied] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [autoCompleteEnabled, setAutoCompleteEnabled] = useState(true)
  const [outputView, setOutputView] = useState<"console" | "json" | "table">("console")
  const [isExecuting, setIsExecuting] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const editorViewRef = useRef<EditorView | null>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  // Setup CodeMirror editor
  useEffect(() => {
    if (!editorRef.current) return

    // Clean up previous editor instance
    if (editorViewRef.current) {
      editorViewRef.current.destroy()
    }

    // Get language extension
    const languageExtension = getLanguageExtension(language)

    // Create editor state with autocompletion
    const extensions = [
      basicSetup,
      languageExtension,
      oneDark,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const newCode = update.state.doc.toString()
          setCode(newCode)
          onChange(newCode)
        }
      }),
      EditorView.theme({
        "&": {
          height: height,
          fontSize: "14px",
        },
        ".cm-scroller": {
          overflow: "auto",
        },
      }),
      EditorState.readOnly.of(readOnly),
      keymap.of([...closeBracketsKeymap, ...completionKeymap, ...lintKeymap, indentWithTab]),
    ]

    // Add autocompletion if enabled
    if (autoCompleteEnabled) {
      extensions.push(
        autocompletion({
          override: [myCompletions],
          defaultKeymap: true,
          closeBrackets: true,
          icons: true,
        }),
        closeBrackets(),
      )
    }

    // Create editor state
    const startState = EditorState.create({
      doc: code,
      extensions,
    })

    // Create editor view
    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    })

    editorViewRef.current = view

    return () => {
      view.destroy()
    }
  }, [language, readOnly, autoCompleteEnabled]) // Don't include code or onChange to prevent recreation on every edit

  // Update editor content when value prop changes (for external updates)
  useEffect(() => {
    if (editorViewRef.current && value !== code) {
      const currentDoc = editorViewRef.current.state.doc.toString()
      if (value !== currentDoc) {
        editorViewRef.current.dispatch({
          changes: { from: 0, to: currentDoc.length, insert: value },
        })
      }
    }
  }, [value])

  // Scroll to bottom of output when new results are added
  useEffect(() => {
    if (outputRef.current && activeTab === "output") {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [executionHistory, activeTab])

  const getLanguageExtension = (lang: string) => {
    switch (lang) {
      case "javascript":
        return javascript()
      case "typescript":
        return javascript({ typescript: true })
      case "python":
        return python()
      case "json":
        return json()
      case "html":
        return html()
      case "css":
        return css()
      case "sql":
        return sql()
      case "c":
      case "cpp":
        return cpp()
      case "bash":
        return StreamLanguage.define(shell)
      case "powershell":
        // Since we don't have a direct PowerShell mode, we'll use shell as a fallback
        return StreamLanguage.define(shell)
      default:
        return markdown() // Fallback for text and other formats
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)

    toast({
      title: "Code copied",
      description: "Code has been copied to clipboard",
      duration: 2000,
    })
  }

  const handleRun = async () => {
    if (onRun) {
      setIsExecuting(true)
      const executionId = Date.now().toString()
      setCurrentExecutionId(executionId)

      const startTime = performance.now()

      try {
        const result = await onRun(code)
        const endTime = performance.now()
        const duration = Math.round(endTime - startTime)

        const newExecution: ExecutionEntry = {
          id: executionId,
          timestamp: new Date(),
          code,
          result,
          duration,
        }

        setExecutionHistory((prev) => [...prev, newExecution])
      } catch (error) {
        const endTime = performance.now()
        const duration = Math.round(endTime - startTime)

        const newExecution: ExecutionEntry = {
          id: executionId,
          timestamp: new Date(),
          code,
          error: error instanceof Error ? error.message : String(error),
          duration,
        }

        setExecutionHistory((prev) => [...prev, newExecution])
      }

      setIsExecuting(false)
      // Switch to output tab to show results
      setActiveTab("output")
    }
  }

  const handleCopyOutput = () => {
    if (!currentExecutionId) return

    const execution = executionHistory.find((e) => e.id === currentExecutionId)
    if (!execution) return

    const outputText = execution.error
      ? `Error: ${execution.error}`
      : typeof execution.result === "object"
        ? JSON.stringify(execution.result, null, 2)
        : String(execution.result)

    navigator.clipboard.writeText(outputText)
    setIsOutputCopied(true)
    setTimeout(() => setIsOutputCopied(false), 2000)

    toast({
      title: "Output copied",
      description: "Execution output has been copied to clipboard",
      duration: 2000,
    })
  }

  const handleClearOutput = () => {
    setExecutionHistory([])
    setCurrentExecutionId(null)

    toast({
      title: "Output cleared",
      description: "Execution history has been cleared",
      duration: 2000,
    })
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename || `code.${getFileExtension(language)}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Code downloaded",
      description: `File saved as ${filename || `code.${getFileExtension(language)}`}`,
      duration: 2000,
    })
  }

  const handleDownloadOutput = () => {
    if (!currentExecutionId) return

    const execution = executionHistory.find((e) => e.id === currentExecutionId)
    if (!execution) return

    const outputText = execution.error
      ? `Error: ${execution.error}`
      : typeof execution.result === "object"
        ? JSON.stringify(execution.result, null, 2)
        : String(execution.result)

    const blob = new Blob([outputText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `output-${new Date().toISOString().replace(/[:.]/g, "-")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Output downloaded",
      description: "Execution output has been downloaded",
      duration: 2000,
    })
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (content) {
        setCode(content)
        onChange(content)

        // Update CodeMirror content
        if (editorViewRef.current) {
          const currentDoc = editorViewRef.current.state.doc.toString()
          editorViewRef.current.dispatch({
            changes: { from: 0, to: currentDoc.length, insert: content },
          })
        }

        toast({
          title: "File loaded",
          description: `${file.name} has been loaded into the editor`,
          duration: 2000,
        })
      }
    }
    reader.readAsText(file)

    // Reset the input so the same file can be uploaded again
    e.target.value = ""
  }

  const toggleAutoComplete = () => {
    setAutoCompleteEnabled(!autoCompleteEnabled)
    toast({
      title: autoCompleteEnabled ? "Autocompletion disabled" : "Autocompletion enabled",
      duration: 2000,
    })
  }

  const getLanguageLabel = () => {
    switch (language) {
      case "javascript":
        return "JavaScript"
      case "python":
        return "Python"
      case "json":
        return "JSON"
      case "c":
        return "C"
      case "cpp":
        return "C++"
      case "bash":
        return "Bash"
      case "powershell":
        return "PowerShell"
      case "sql":
        return "SQL"
      case "html":
        return "HTML"
      case "css":
        return "CSS"
      case "typescript":
        return "TypeScript"
      default:
        return "Text"
    }
  }

  const getFileExtension = (lang: string): string => {
    const extensionMap: Record<string, string> = {
      javascript: "js",
      python: "py",
      json: "json",
      c: "c",
      cpp: "cpp",
      bash: "sh",
      powershell: "ps1",
      sql: "sql",
      html: "html",
      css: "css",
      typescript: "ts",
      text: "txt",
    }

    return extensionMap[lang] || "txt"
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  // Check if result is a table-like structure
  const isTableData = (data: any) => {
    if (!data || typeof data !== "object" || Array.isArray(data)) return false
    if (data.columns && Array.isArray(data.columns) && data.rows && Array.isArray(data.rows)) return true
    return false
  }

  // Check if result is an array of objects with consistent keys
  const isArrayOfObjects = (data: any) => {
    if (!Array.isArray(data) || data.length === 0) return false
    if (typeof data[0] !== "object" || data[0] === null) return false

    // Check if all items have the same keys
    const firstItemKeys = Object.keys(data[0]).sort().join(",")
    return data.every(
      (item) => typeof item === "object" && item !== null && Object.keys(item).sort().join(",") === firstItemKeys,
    )
  }

  // Render table from data
  const renderTable = (data: any) => {
    if (isTableData(data)) {
      // Handle explicit table format with columns and rows
      return (
        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">
                {data.columns.map((col: string, i: number) => (
                  <th key={i} className="border px-3 py-2 text-left">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row: any[], i: number) => (
                <tr key={i} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                  {row.map((cell: any, j: number) => (
                    <td key={j} className="border px-3 py-2">
                      {String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    } else if (isArrayOfObjects(data)) {
      // Handle array of objects
      const columns = Object.keys(data[0])
      return (
        <div className="overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">
                {columns.map((col, i) => (
                  <th key={i} className="border px-3 py-2 text-left">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-muted/20" : ""}>
                  {columns.map((col, j) => (
                    <td key={j} className="border px-3 py-2">
                      {String(row[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
    return null
  }

  // Render current execution output
  const renderOutput = () => {
    if (!currentExecutionId) {
      if (executionHistory.length > 0) {
        // Show the most recent execution
        const latestExecution = executionHistory[executionHistory.length - 1]
        return renderExecutionOutput(latestExecution)
      }
      return (
        <div className="text-gray-500 italic flex items-center justify-center h-full">
          Run the code to see output here
        </div>
      )
    }

    const execution = executionHistory.find((e) => e.id === currentExecutionId)
    if (!execution) return null

    return renderExecutionOutput(execution)
  }

  // Render specific execution output
  const renderExecutionOutput = (execution: ExecutionEntry) => {
    if (execution.error) {
      return (
        <div className="text-red-400">
          <div className="font-bold flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4" /> Error:
          </div>
          <pre className="whitespace-pre-wrap">{execution.error}</pre>
        </div>
      )
    }

    if (outputView === "table" && (isTableData(execution.result) || isArrayOfObjects(execution.result))) {
      return renderTable(execution.result)
    }

    if (outputView === "json" && typeof execution.result === "object") {
      return (
        <pre className="whitespace-pre-wrap text-green-400 font-mono">{JSON.stringify(execution.result, null, 2)}</pre>
      )
    }

    // Default console view
    return (
      <pre className="whitespace-pre-wrap text-green-400 font-mono">
        {typeof execution.result === "object" ? JSON.stringify(execution.result, null, 2) : String(execution.result)}
      </pre>
    )
  }

  return (
    <div className="border rounded-md">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "edit" | "output")}>
        <div className="flex items-center justify-between p-2 border-b bg-muted/50">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{getLanguageLabel()}</span>
            <TabsList className="h-8">
              <TabsTrigger value="edit" className="text-xs px-3">
                Editor
              </TabsTrigger>
              <TabsTrigger value="output" className="text-xs px-3">
                Output
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
                    <Settings className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editor Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {!readOnly && (
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  className="sr-only"
                  onChange={handleUpload}
                  accept={`.${getFileExtension(language)},text/plain`}
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="h-3.5 w-3.5 mr-1" />
                      Import
                    </span>
                  </Button>
                </label>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-3.5 w-3.5 mr-1" />
              Export
            </Button>
            {!readOnly && onRun && (
              <Button
                variant="default"
                size="sm"
                onClick={handleRun}
                disabled={isExecuting}
                className={isExecuting ? "opacity-70 cursor-not-allowed" : ""}
              >
                <Play className="h-3.5 w-3.5 mr-1" />
                {isExecuting ? "Running..." : "Run"}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {isCopied ? <CheckCheck className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>

        {showSettings && (
          <div className="p-2 border-b bg-muted/20 flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoCompleteEnabled}
                onChange={toggleAutoComplete}
                className="rounded border-gray-300"
              />
              Enable autocompletion
            </label>
            <div className="text-xs text-muted-foreground ml-4">
              Press <kbd className="px-1 py-0.5 bg-muted rounded border">Ctrl</kbd>+
              <kbd className="px-1 py-0.5 bg-muted rounded border">Space</kbd> to trigger suggestions
            </div>
          </div>
        )}

        <TabsContent value="edit" className="mt-0 p-0">
          <div ref={editorRef} className="w-full" style={{ height }} />
        </TabsContent>

        <TabsContent value="output" className="mt-0 p-0">
          <div className="border-b bg-muted/20 p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Output View:</span>
              <div className="flex border rounded-md overflow-hidden">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={outputView === "console" ? "default" : "ghost"}
                        size="sm"
                        className="h-7 px-2 rounded-none"
                        onClick={() => setOutputView("console")}
                      >
                        <Terminal className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Console View</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={outputView === "json" ? "default" : "ghost"}
                        size="sm"
                        className="h-7 px-2 rounded-none"
                        onClick={() => setOutputView("json")}
                      >
                        <FileJson className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>JSON View</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={outputView === "table" ? "default" : "ghost"}
                        size="sm"
                        className="h-7 px-2 rounded-none"
                        onClick={() => setOutputView("table")}
                      >
                        <Table className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Table View</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={handleCopyOutput} disabled={!currentExecutionId}>
                      {isOutputCopied ? <CheckCheck className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy Output</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={handleDownloadOutput} disabled={!currentExecutionId}>
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download Output</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearOutput}
                      disabled={executionHistory.length === 0}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear Output</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="flex h-full" style={{ height: `calc(${height} - 41px)` }}>
            {executionHistory.length > 0 && (
              <div className="w-48 border-r overflow-y-auto">
                <ScrollArea className="h-full">
                  <div className="p-2">
                    <h4 className="text-xs font-medium mb-2 text-muted-foreground">EXECUTION HISTORY</h4>
                    <div className="space-y-1">
                      {executionHistory.map((execution, index) => (
                        <Button
                          key={execution.id}
                          variant={currentExecutionId === execution.id ? "secondary" : "ghost"}
                          size="sm"
                          className="w-full justify-start text-xs h-auto py-1.5"
                          onClick={() => setCurrentExecutionId(execution.id)}
                        >
                          <div className="flex flex-col items-start">
                            <div className="flex items-center gap-1.5 w-full justify-between">
                              <span className="font-medium">Run #{executionHistory.length - index}</span>
                              {execution.error ? (
                                <Badge variant="destructive" className="text-[10px] h-4">
                                  Error
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-[10px] h-4">
                                  {execution.duration}ms
                                </Badge>
                              )}
                            </div>
                            <span className="text-[10px] text-muted-foreground">{formatDate(execution.timestamp)}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </div>
            )}

            <div
              ref={outputRef}
              className="flex-1 p-4 overflow-auto bg-black"
              style={{ height: `calc(${height} - 41px)` }}
            >
              {renderOutput()}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  X,
  Plus,
  Minus,
  Settings,
  Workflow,
  GitCompare,
  FileCode,
  ArrowLeftRight,
  Download,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  RotateCcw,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NodeChange {
  id: string
  type: "added" | "removed" | "modified"
  name: string
  nodeType: string
  details: string[]
  code?: string
}

interface EdgeChange {
  id: string
  type: "added" | "removed" | "modified"
  source: string
  target: string
  details: string[]
}

interface ConfigChange {
  id: string
  type: "added" | "removed" | "modified"
  name: string
  details: string[]
  before?: string
  after?: string
}

// Update the props interface to include isLoading
interface VersionComparisonProps {
  version1: {
    id: string
    number: string
    createdAt: string
    author: string
  }
  version2: {
    id: string
    number: string
    createdAt: string
    author: string
  }
  onClose: () => void
  onRestore: (versionId: string) => void
  isLoading?: boolean
}

// Update the component to handle loading state
export default function VersionComparison({
  version1,
  version2,
  onClose,
  onRestore,
  isLoading = false,
}: VersionComparisonProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedNodeChange, setSelectedNodeChange] = useState<string | null>(null)
  const [selectedConfigChange, setSelectedConfigChange] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copied, setCopied] = useState(false)

  // Mock data - would come from API in real app
  const nodeChanges: NodeChange[] = [
    {
      id: "n1",
      type: "added",
      name: "AI Processing",
      nodeType: "ai",
      details: ["Added new AI processing node", "Configured with GPT-4 model", "Connected to data source"],
      code: `{
  "id": "ai-processing",
  "type": "ai",
  "position": { "x": 250, "y": 200 },
  "data": {
    "model": "gpt-4",
    "prompt": "Analyze the following data: {{data}}",
    "temperature": 0.7,
    "maxTokens": 1000
  }
}`,
    },
    {
      id: "n2",
      type: "modified",
      name: "Email Notification",
      nodeType: "action",
      details: ["Changed email template", "Added CC recipients", "Updated subject line"],
      code: `// Before
{
  "id": "email-notification",
  "type": "email",
  "data": {
    "to": ["user@example.com"],
    "subject": "Notification",
    "template": "basic"
  }
}

// After
{
  "id": "email-notification",
  "type": "email",
  "data": {
    "to": ["user@example.com"],
    "cc": ["manager@example.com"],
    "subject": "Important: Workflow Notification",
    "template": "enhanced"
  }
}`,
    },
    {
      id: "n3",
      type: "removed",
      name: "Legacy Data Processing",
      nodeType: "code",
      details: ["Removed deprecated node", "Functionality replaced by AI Processing"],
      code: `{
  "id": "legacy-processing",
  "type": "code",
  "position": { "x": 250, "y": 350 },
  "data": {
    "language": "javascript",
    "code": "function processData(data) {\\n  // Legacy processing logic\\n  return data.map(item => item.value * 2);\\n}"
  }
}`,
    },
  ]

  const edgeChanges: EdgeChange[] = [
    {
      id: "e1",
      type: "added",
      source: "Trigger",
      target: "AI Processing",
      details: ["Created new connection", "Added condition for processing"],
    },
    {
      id: "e2",
      type: "removed",
      source: "Trigger",
      target: "Legacy Data Processing",
      details: ["Removed connection to deprecated node"],
    },
  ]

  const configChanges: ConfigChange[] = [
    {
      id: "c1",
      type: "modified",
      name: "Workflow Settings",
      details: ["Changed execution timeout from 30s to 60s", "Enabled error logging", "Added retry mechanism"],
      before: `{
  "name": "Data Processing Workflow",
  "timeout": 30000,
  "errorHandling": {
    "logging": false,
    "retryCount": 0
  }
}`,
      after: `{
  "name": "Data Processing Workflow",
  "timeout": 60000,
  "errorHandling": {
    "logging": true,
    "retryCount": 3,
    "retryDelay": 5000
  }
}`,
    },
  ]

  const totalChanges = nodeChanges.length + edgeChanges.length + configChanges.length
  const addedCount =
    nodeChanges.filter((n) => n.type === "added").length +
    edgeChanges.filter((e) => e.type === "added").length +
    configChanges.filter((c) => c.type === "added").length
  const modifiedCount =
    nodeChanges.filter((n) => n.type === "modified").length +
    edgeChanges.filter((e) => e.type === "modified").length +
    configChanges.filter((c) => c.type === "modified").length
  const removedCount =
    nodeChanges.filter((n) => n.type === "removed").length +
    edgeChanges.filter((e) => e.type === "removed").length +
    configChanges.filter((c) => c.type === "removed").length

  const getChangeTypeColor = (type: "added" | "removed" | "modified") => {
    switch (type) {
      case "added":
        return "text-green-500"
      case "removed":
        return "text-red-500"
      case "modified":
        return "text-amber-500"
    }
  }

  const getChangeTypeBgColor = (type: "added" | "removed" | "modified") => {
    switch (type) {
      case "added":
        return "bg-green-500/5 border-green-500/20"
      case "removed":
        return "bg-red-500/5 border-red-500/20"
      case "modified":
        return "bg-amber-500/5 border-amber-500/20"
    }
  }

  const getChangeTypeIcon = (type: "added" | "removed" | "modified") => {
    switch (type) {
      case "added":
        return <Plus className="h-4 w-4" />
      case "removed":
        return <Minus className="h-4 w-4" />
      case "modified":
        return <Settings className="h-4 w-4" />
    }
  }

  const getNodeTypeIcon = (nodeType: string) => {
    switch (nodeType) {
      case "ai":
        return "AI"
      case "action":
        return "Action"
      case "code":
        return "Code"
      default:
        return "Node"
    }
  }

  // Add loading state handling to the restore button
  const handleRestore = (versionId: string) => {
    if (isLoading) return
    onRestore(versionId)
    toast({
      title: "Version Restored",
      description: `Workflow restored to version ${versionId === version1.id ? version1.number : version2.number}`,
    })
    onClose()
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Copied to clipboard",
      description: "Code has been copied to your clipboard",
    })
  }

  const handleExportChanges = () => {
    // Create a JSON object with all changes
    const changes = {
      versions: {
        from: version1,
        to: version2,
      },
      changes: {
        nodes: nodeChanges,
        edges: edgeChanges,
        config: configChanges,
      },
      summary: {
        total: totalChanges,
        added: addedCount,
        modified: modifiedCount,
        removed: removedCount,
      },
    }

    // Convert to JSON string
    const jsonString = JSON.stringify(changes, null, 2)

    // Create a blob and download
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `changes-${version1.number}-to-${version2.number}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Changes Exported",
      description: "Changes have been exported as JSON",
    })
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className={`h-full flex flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-background" : ""}`}>
      <div className="flex justify-between items-center border-b p-4 bg-background">
        <div className="flex items-center">
          <GitCompare className="h-5 w-5 mr-2 text-primary" />
          <h2 className="text-lg font-semibold">Version Comparison</h2>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleExportChanges}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export changes as JSON</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFullscreen ? "Exit fullscreen" : "Fullscreen"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-muted/30 border-b">
        <div className="flex items-center gap-5">
          <div className="bg-background border rounded-md px-3 py-2">
            <div className="text-xs text-muted-foreground">From</div>
            <div className="text-sm font-medium">Version {version1.number}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {version1.author} · {version1.createdAt}
            </div>
          </div>

          <ArrowRight className="h-5 w-5 text-muted-foreground" />

          <div className="bg-background border rounded-md px-3 py-2">
            <div className="text-xs text-muted-foreground">To</div>
            <div className="text-sm font-medium">Version {version2.number}</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {version2.author} · {version2.createdAt}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleRestore(version1.id)} disabled={isLoading}>
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Restore {version1.number}
          </Button>
          <Button size="sm" onClick={() => handleRestore(version2.id)} disabled={isLoading}>
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Restore {version2.number}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              Overview
              <Badge className="ml-2" variant="outline">
                {totalChanges}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="nodes">
              Nodes
              <Badge className="ml-2" variant="outline">
                {nodeChanges.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="connections">
              Connections
              <Badge className="ml-2" variant="outline">
                {edgeChanges.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="config">
              Configuration
              <Badge className="ml-2" variant="outline">
                {configChanges.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="flex-1 p-4 overflow-auto">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-md p-4 bg-green-500/5 border-green-500/20">
                <div className="flex items-center gap-2 text-green-500">
                  <Plus className="h-5 w-5" />
                  <h3 className="font-medium">Added</h3>
                </div>
                <div className="text-2xl font-bold mt-2">{addedCount}</div>
                <div className="text-sm text-muted-foreground mt-1">New components</div>
              </div>

              <div className="border rounded-md p-4 bg-amber-500/5 border-amber-500/20">
                <div className="flex items-center gap-2 text-amber-500">
                  <Settings className="h-5 w-5" />
                  <h3 className="font-medium">Modified</h3>
                </div>
                <div className="text-2xl font-bold mt-2">{modifiedCount}</div>
                <div className="text-sm text-muted-foreground mt-1">Changed components</div>
              </div>

              <div className="border rounded-md p-4 bg-red-500/5 border-red-500/20">
                <div className="flex items-center gap-2 text-red-500">
                  <Minus className="h-5 w-5" />
                  <h3 className="font-medium">Removed</h3>
                </div>
                <div className="text-2xl font-bold mt-2">{removedCount}</div>
                <div className="text-sm text-muted-foreground mt-1">Deleted components</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Summary of Changes</h3>
              <div className="space-y-4">
                {nodeChanges.length > 0 && (
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <Workflow className="h-4 w-4" />
                      Nodes
                    </h4>
                    <ul className="space-y-2">
                      {nodeChanges.map((change) => (
                        <li key={change.id} className="flex items-start gap-2">
                          <span className={getChangeTypeColor(change.type)}>{getChangeTypeIcon(change.type)}</span>
                          <span>
                            <span className="font-medium">{change.name}</span>
                            <span className="text-sm text-muted-foreground"> ({getNodeTypeIcon(change.nodeType)})</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {edgeChanges.length > 0 && (
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <ArrowRight className="h-4 w-4" />
                      Connections
                    </h4>
                    <ul className="space-y-2">
                      {edgeChanges.map((change) => (
                        <li key={change.id} className="flex items-start gap-2">
                          <span className={getChangeTypeColor(change.type)}>{getChangeTypeIcon(change.type)}</span>
                          <span>
                            <span className="font-medium">{change.source}</span>
                            <span className="text-muted-foreground"> → </span>
                            <span className="font-medium">{change.target}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {configChanges.length > 0 && (
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <Settings className="h-4 w-4" />
                      Configuration
                    </h4>
                    <ul className="space-y-2">
                      {configChanges.map((change) => (
                        <li key={change.id} className="flex items-start gap-2">
                          <span className={getChangeTypeColor(change.type)}>{getChangeTypeIcon(change.type)}</span>
                          <span className="font-medium">{change.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="nodes" className="flex-1 p-4 overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 md:pr-2 space-y-4 overflow-auto mb-4 md:mb-0">
            {nodeChanges.map((change) => (
              <div
                key={change.id}
                className={`border rounded-md p-4 ${getChangeTypeBgColor(change.type)} cursor-pointer ${
                  selectedNodeChange === change.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedNodeChange(change.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={getChangeTypeColor(change.type)}>{getChangeTypeIcon(change.type)}</span>
                  <h3 className="font-medium">{change.name}</h3>
                  <Badge variant="outline">{getNodeTypeIcon(change.nodeType)}</Badge>
                </div>
                <div className="pl-6 space-y-1 text-sm">
                  {change.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="w-full md:w-1/2 md:pl-2 md:border-l border-t md:border-t-0 pt-4 md:pt-0">
            {selectedNodeChange ? (
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">
                    <FileCode className="h-4 w-4 inline mr-1" />
                    Node Configuration
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8"
                    onClick={() => handleCopyCode(nodeChanges.find((n) => n.id === selectedNodeChange)?.code || "")}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <ScrollArea className="flex-1 border rounded-md bg-muted/30 p-2">
                  <pre className="text-xs font-mono whitespace-pre-wrap">
                    {nodeChanges.find((n) => n.id === selectedNodeChange)?.code || "No code available"}
                  </pre>
                </ScrollArea>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <ArrowLeftRight className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Select a node to view its configuration</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="connections" className="flex-1 p-4 overflow-auto">
          <div className="space-y-4">
            {edgeChanges.map((change) => (
              <div key={change.id} className={`border rounded-md p-4 ${getChangeTypeBgColor(change.type)}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={getChangeTypeColor(change.type)}>{getChangeTypeIcon(change.type)}</span>
                  <h3 className="font-medium">
                    {change.source} <ArrowRight className="h-3.5 w-3.5 inline mx-1" /> {change.target}
                  </h3>
                </div>
                <div className="pl-6 space-y-1 text-sm">
                  {change.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="config" className="flex-1 p-4 overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 md:pr-2 space-y-4 overflow-auto mb-4 md:mb-0">
            {configChanges.map((change) => (
              <div
                key={change.id}
                className={`border rounded-md p-4 ${getChangeTypeBgColor(change.type)} cursor-pointer ${
                  selectedConfigChange === change.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedConfigChange(change.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={getChangeTypeColor(change.type)}>{getChangeTypeIcon(change.type)}</span>
                  <h3 className="font-medium">{change.name}</h3>
                </div>
                <div className="pl-6 space-y-1 text-sm">
                  {change.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="w-full md:w-1/2 md:pl-2 md:border-l border-t md:border-t-0 pt-4 md:pt-0">
            {selectedConfigChange ? (
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">
                    <FileCode className="h-4 w-4 inline mr-1" />
                    Configuration Changes
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8"
                    onClick={() => {
                      const config = configChanges.find((c) => c.id === selectedConfigChange)
                      const textToCopy = `// Before\n${config?.before || ""}\n\n// After\n${config?.after || ""}`
                      handleCopyCode(textToCopy)
                    }}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex-1 flex flex-col space-y-2">
                  <div className="flex-1 border rounded-md bg-red-500/5 p-2">
                    <div className="text-xs font-medium text-red-500 mb-1">Before</div>
                    <ScrollArea className="h-[calc(100%-20px)]">
                      <pre className="text-xs font-mono whitespace-pre-wrap">
                        {configChanges.find((c) => c.id === selectedConfigChange)?.before || "No data available"}
                      </pre>
                    </ScrollArea>
                  </div>
                  <div className="flex-1 border rounded-md bg-green-500/5 p-2">
                    <div className="text-xs font-medium text-green-500 mb-1">After</div>
                    <ScrollArea className="h-[calc(100%-20px)]">
                      <pre className="text-xs font-mono whitespace-pre-wrap">
                        {configChanges.find((c) => c.id === selectedConfigChange)?.after || "No data available"}
                      </pre>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Settings className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Select a configuration to view changes</p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

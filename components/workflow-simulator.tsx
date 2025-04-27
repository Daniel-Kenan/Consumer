"use client"

import { useState, useEffect, useRef } from "react"
import { useReactFlow } from "reactflow"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Clock,
  AlertCircle,
  CheckCircle,
  Database,
  MessageSquare,
  Bot,
  Zap,
  Filter,
  Code,
  Globe,
  Save,
  Download,
  Settings,
  Info,
  X,
  Copy,
  CheckCheck,
  ArrowRight,
  Layers,
  BarChart,
  FileJson,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

interface WorkflowSimulatorProps {
  isOpen: boolean
  onClose: () => void
}

export default function WorkflowSimulator({ isOpen, onClose }: WorkflowSimulatorProps) {
  const { getNodes, getEdges, setNodes, setEdges, fitView } = useReactFlow()
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null)
  const [executionPath, setExecutionPath] = useState<string[]>([])
  const [nodeStates, setNodeStates] = useState<Record<string, "pending" | "active" | "completed" | "error">>({})
  const [edgeStates, setEdgeStates] = useState<Record<string, "inactive" | "active">>({})
  const [executionSpeed, setExecutionSpeed] = useState<"slow" | "normal" | "fast">("normal")
  const [executionLogs, setExecutionLogs] = useState<
    Array<{ time: string; level: "info" | "warning" | "error"; message: string }>
  >([])
  const [nodeData, setNodeData] = useState<Record<string, any>>({})
  const [activeTab, setActiveTab] = useState("overview")
  const [testInputs, setTestInputs] = useState<Record<string, any>>({})
  const [simulationStartTime, setSimulationStartTime] = useState<Date | null>(null)
  const [simulationElapsedTime, setSimulationElapsedTime] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showTestInputPanel, setShowTestInputPanel] = useState(true)
  const [progress, setProgress] = useState(0)
  const [savedScenarios, setSavedScenarios] = useState<Array<{ name: string; inputs: Record<string, any> }>>([
    { name: "Default Scenario", inputs: {} },
    { name: "Error Scenario", inputs: {} },
  ])
  const [currentScenario, setCurrentScenario] = useState("Default Scenario")
  const [isNodeDataCopied, setIsNodeDataCopied] = useState(false)
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)
  const [autoFitView, setAutoFitView] = useState(true)
  const [highlightPath, setHighlightPath] = useState(true)
  const [showDataFlow, setShowDataFlow] = useState(true)
  const [showNodeDetails, setShowNodeDetails] = useState(true)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const elapsedTimerRef = useRef<NodeJS.Timeout | null>(null)
  const simulatorRef = useRef<HTMLDivElement>(null)

  // Get speed in milliseconds
  const getSpeedMs = () => {
    switch (executionSpeed) {
      case "slow":
        return 2000
      case "fast":
        return 500
      default:
        return 1000
    }
  }

  // Initialize the simulation
  const initializeSimulation = () => {
    const nodes = getNodes()
    const edges = getEdges()

    // Reset all states
    setNodeStates({})
    setEdgeStates({})
    setExecutionPath([])
    setNodeData({})
    setExecutionLogs([])
    setCurrentNodeId(null)
    setProgress(0)

    // Find trigger nodes (starting points)
    const triggerNodes = nodes.filter((node) => node.type === "trigger")

    if (triggerNodes.length === 0) {
      addLog("error", "No trigger nodes found in the workflow")
      return false
    }

    // Set all nodes to pending
    const initialNodeStates: Record<string, "pending" | "active" | "completed" | "error"> = {}
    nodes.forEach((node) => {
      initialNodeStates[node.id] = "pending"
    })

    // Set all edges to inactive
    const initialEdgeStates: Record<string, "inactive" | "active"> = {}
    edges.forEach((edge) => {
      initialEdgeStates[edge.id] = "inactive"
    })

    setNodeStates(initialNodeStates)
    setEdgeStates(initialEdgeStates)

    // Start with the first trigger node
    setCurrentNodeId(triggerNodes[0].id)

    // Initialize execution path with the first node
    setExecutionPath([triggerNodes[0].id])

    // Set the first node as active
    setNodeStates((prev) => ({
      ...prev,
      [triggerNodes[0].id]: "active",
    }))

    // Initialize node data with test inputs
    setNodeData({
      [triggerNodes[0].id]: { ...testInputs },
    })

    addLog("info", `Simulation started with trigger: ${triggerNodes[0].data.label}`)

    return true
  }

  // Start the simulation
  const startSimulation = () => {
    if (initializeSimulation()) {
      setIsRunning(true)
      setIsPaused(false)
      setSimulationStartTime(new Date())

      // Start elapsed time counter
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current)
      }

      elapsedTimerRef.current = setInterval(() => {
        if (simulationStartTime) {
          const elapsed = Math.floor((new Date().getTime() - simulationStartTime.getTime()) / 1000)
          setSimulationElapsedTime(elapsed)
        }
      }, 1000)

      // Highlight the workflow area containing the active nodes
      if (autoFitView) {
        setTimeout(() => {
          fitView({
            padding: 0.2,
            includeHiddenNodes: false,
            nodes: getNodes().filter((n) => executionPath.includes(n.id)),
          })
        }, 100)
      }
    }
  }

  // Pause the simulation
  const pauseSimulation = () => {
    setIsPaused(true)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    addLog("info", "Simulation paused")
  }

  // Resume the simulation
  const resumeSimulation = () => {
    setIsPaused(false)
    addLog("info", "Simulation resumed")
    processCurrentNode()
  }

  // Stop the simulation
  const stopSimulation = () => {
    setIsRunning(false)
    setIsPaused(false)

    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current)
      elapsedTimerRef.current = null
    }

    addLog("info", "Simulation stopped")

    // Reset node visual states
    resetNodeVisualStates()
  }

  // Reset node visual states without clearing logs
  const resetNodeVisualStates = () => {
    const nodes = getNodes()
    const edges = getEdges()

    // Reset all nodes to pending
    const resetNodeStates: Record<string, "pending" | "active" | "completed" | "error"> = {}
    nodes.forEach((node) => {
      resetNodeStates[node.id] = "pending"
    })

    // Reset all edges to inactive
    const resetEdgeStates: Record<string, "inactive" | "active"> = {}
    edges.forEach((edge) => {
      resetEdgeStates[edge.id] = "inactive"
    })

    setNodeStates(resetNodeStates)
    setEdgeStates(resetEdgeStates)
    setCurrentNodeId(null)
    setProgress(0)
  }

  // Step forward in the simulation
  const stepForward = () => {
    if (!isRunning) {
      if (initializeSimulation()) {
        setIsRunning(true)
        setIsPaused(true)
        setSimulationStartTime(new Date())
        processCurrentNode(true)
      }
    } else if (isPaused) {
      processCurrentNode(true)
    }
  }

  // Add a log entry
  const addLog = (level: "info" | "warning" | "error", message: string) => {
    const now = new Date()
    const timeString = now.toLocaleTimeString()
    setExecutionLogs((prev) => [...prev, { time: timeString, level, message }])
  }

  // Process the current node
  const processCurrentNode = (isSingleStep = false) => {
    if (!currentNodeId) return

    const nodes = getNodes()
    const edges = getEdges()

    // Find the current node
    const currentNode = nodes.find((node) => node.id === currentNodeId)
    if (!currentNode) return

    // Mark the current node as completed
    setNodeStates((prev) => ({
      ...prev,
      [currentNodeId]: "completed",
    }))

    // Process the node based on its type
    const nodeType = currentNode.type
    const nodeData = currentNode.data

    // Simulate node processing
    let outputData: any = {}
    let nextNodeId: string | null = null
    let processingError = false

    try {
      // Process different node types
      switch (nodeType) {
        case "trigger":
          addLog("info", `Trigger node "${nodeData.label}" activated`)
          outputData = simulateNodeOutput(nodeType, nodeData)
          break

        case "action":
          addLog("info", `Executing action "${nodeData.label}"`)
          outputData = simulateNodeOutput(nodeType, nodeData)
          break

        case "logic":
          if (nodeData.type === "if") {
            const condition = nodeData.config?.condition || ""
            addLog("info", `Evaluating condition: ${condition}`)

            // Simulate condition evaluation
            const conditionResult = Math.random() > 0.5 // Random true/false for demo
            addLog("info", `Condition evaluated to: ${conditionResult}`)

            // Find the appropriate edge based on condition result
            const outgoingEdges = edges.filter((edge) => edge.source === currentNodeId)
            const targetEdge =
              outgoingEdges.find((edge) => {
                if (conditionResult && edge.sourceHandle === "true") return true
                if (!conditionResult && edge.sourceHandle === "false") return true
                return false
              }) || outgoingEdges[0]

            if (targetEdge) {
              nextNodeId = targetEdge.target

              // Activate the edge
              setEdgeStates((prev) => ({
                ...prev,
                [targetEdge.id]: "active",
              }))
            }

            outputData = { result: conditionResult }
          } else {
            outputData = simulateNodeOutput(nodeType, nodeData)
          }
          break

        case "code":
          addLog("info", `Executing code in "${nodeData.label}"`)

          if (nodeData.type === "javascript" || nodeData.type === "python") {
            const customCode = nodeData.config?.code || ""
            if (customCode.trim()) {
              addLog("info", `Executing custom ${nodeData.type} code`)

              // In a real implementation, this would safely execute the code
              // For the simulator, we'll just log it
              if (nodeData.config?.customInputs) {
                addLog("info", `Using custom input parameters: ${nodeData.config.customInputs}`)
              }

              // Simulate code execution with potential errors
              if (Math.random() < 0.05) {
                throw new Error(`Error in custom code: Syntax error in ${nodeData.type} code`)
              }
            }
          }

          outputData = simulateNodeOutput(nodeType, nodeData)
          break

        case "ai":
          addLog("info", `AI processing in "${nodeData.label}"`)

          if (nodeData.type === "ai-agent") {
            // Check for custom instructions and fine-tuning
            if (nodeData.config?.customInstructions) {
              addLog("info", `Using custom instructions for AI behavior`)
            }

            if (nodeData.config?.model === "custom-fine-tuned") {
              addLog("info", `Using custom fine-tuned model: ${nodeData.config.customModelId || "unnamed model"}`)
            }

            if (nodeData.config?.persona && nodeData.config.persona !== "default") {
              addLog(
                "info",
                `Using ${nodeData.config.persona === "custom" ? "custom" : nodeData.config.persona} persona`,
              )
            }

            if (nodeData.config?.trainingData && nodeData.config.trainingData !== "none") {
              addLog("info", `Using training data from ${nodeData.config.trainingData} source`)
            }
          }

          outputData = simulateNodeOutput(nodeType, nodeData)
          break

        case "message":
          addLog("info", `Sending message: "${nodeData.config?.message || "No message content"}"`)
          outputData = { sent: true, timestamp: new Date().toISOString() }
          break

        case "integration":
          addLog("info", `Connecting to integration "${nodeData.label}"`)

          // Simulate occasional integration errors
          if (Math.random() < 0.1) {
            throw new Error(`Integration error: Could not connect to ${nodeData.label}`)
          }

          outputData = simulateNodeOutput(nodeType, nodeData)
          break

        case "banking":
          addLog("info", `Processing banking operation "${nodeData.label}"`)
          outputData = simulateNodeOutput(nodeType, nodeData)
          break

        default:
          addLog("warning", `Unknown node type: ${nodeType}`)
          outputData = {}
      }
    } catch (error) {
      processingError = true
      addLog("error", `Error in node "${nodeData.label}": ${error instanceof Error ? error.message : "Unknown error"}`)

      // Mark the node as error
      setNodeStates((prev) => ({
        ...prev,
        [currentNodeId]: "error",
      }))
    }

    // Store the node output data
    setNodeData((prev) => ({
      ...prev,
      [currentNodeId]: outputData,
    }))

    // Find the next node if not already determined
    if (!processingError && !nextNodeId) {
      // Find outgoing edges from the current node
      const outgoingEdges = edges.filter((edge) => edge.source === currentNodeId)

      if (outgoingEdges.length > 0) {
        // For simplicity, take the first edge
        const nextEdge = outgoingEdges[0]
        nextNodeId = nextEdge.target

        // Activate the edge
        setEdgeStates((prev) => ({
          ...prev,
          [nextEdge.id]: "active",
        }))
      }
    }

    // Calculate progress
    const totalNodes = getNodes().length
    const completedNodes =
      Object.values(nodeStates).filter((state) => state === "completed" || state === "error").length + 1
    const progressPercentage = Math.min(Math.round((completedNodes / totalNodes) * 100), 100)
    setProgress(progressPercentage)

    // If there's a next node, continue the execution
    if (nextNodeId) {
      // Add the next node to the execution path
      setExecutionPath((prev) => [...prev, nextNodeId])

      // Set the next node as active
      setNodeStates((prev) => ({
        ...prev,
        [nextNodeId]: "active",
      }))

      // Update the current node
      setCurrentNodeId(nextNodeId)

      // If not in single step mode and not paused, schedule the next node processing
      if (!isSingleStep && !isPaused) {
        timerRef.current = setTimeout(() => {
          processCurrentNode()
        }, getSpeedMs())
      }
    } else {
      // End of workflow
      addLog("info", "Workflow execution completed")
      setIsRunning(true)
      setIsPaused(true)
      setProgress(100)
    }

    // Update the view to focus on the active part of the workflow
    if (autoFitView) {
      setTimeout(() => {
        fitView({
          padding: 0.2,
          includeHiddenNodes: false,
          nodes: getNodes().filter((n) => executionPath.includes(n.id)),
        })
      }, 100)
    }
  }

  // Simulate node output based on node type and data
  const simulateNodeOutput = (nodeType: string, nodeData: any) => {
    // Generate realistic sample data based on node type
    switch (nodeType) {
      case "trigger":
        if (nodeData.type === "webhook") {
          return {
            method: "POST",
            path: nodeData.config?.path || "/webhook",
            headers: {
              "content-type": "application/json",
              "user-agent": "Mozilla/5.0",
              "x-request-id": `req-${Math.random().toString(36).substring(2, 10)}`,
            },
            body: testInputs.webhookPayload || {
              event: "user.created",
              data: { id: 123, name: "John Doe", email: "john@example.com" },
            },
            timestamp: new Date().toISOString(),
          }
        } else if (nodeData.type === "schedule") {
          return {
            scheduledTime: new Date().toISOString(),
            frequency: nodeData.config?.frequency || "daily",
            executionId: `exec-${Math.random().toString(36).substring(2, 10)}`,
          }
        } else {
          return {
            triggered: true,
            timestamp: new Date().toISOString(),
            source: nodeData.type,
          }
        }

      case "action":
        if (nodeData.type === "http") {
          return {
            status: 200,
            statusText: "OK",
            headers: {
              "content-type": "application/json",
              server: "nginx/1.18.0",
            },
            data: {
              success: true,
              id: Math.floor(Math.random() * 1000),
              timestamp: new Date().toISOString(),
            },
            duration: Math.floor(Math.random() * 500) + 100, // 100-600ms
          }
        } else if (nodeData.type === "database") {
          return {
            operation: nodeData.config?.operation || "query",
            affectedRows: Math.floor(Math.random() * 10) + 1,
            data: [
              { id: 1, name: "Item 1", status: "active" },
              { id: 2, name: "Item 2", status: "pending" },
              { id: 3, name: "Item 3", status: "active" },
            ],
            duration: Math.floor(Math.random() * 100) + 50, // 50-150ms
          }
        } else {
          return {
            success: true,
            timestamp: new Date().toISOString(),
            result: `Action ${nodeData.type} completed successfully`,
          }
        }

      case "logic":
        if (nodeData.type === "if") {
          return {
            condition: nodeData.config?.condition || "",
            result: Math.random() > 0.5, // Random true/false
            evaluatedAt: new Date().toISOString(),
          }
        } else if (nodeData.type === "switch") {
          const cases = ["case1", "case2", "case3", "default"]
          const selectedCase = cases[Math.floor(Math.random() * cases.length)]
          return {
            expression: nodeData.config?.expression || "",
            result: selectedCase,
            evaluatedAt: new Date().toISOString(),
          }
        } else {
          return {
            type: nodeData.type,
            processed: true,
            timestamp: new Date().toISOString(),
          }
        }

      case "code":
        if (nodeData.type === "javascript" || nodeData.type === "python") {
          const hasCustomCode = nodeData.config?.code && nodeData.config.code.length > 0

          return {
            executed: true,
            duration: Math.floor(Math.random() * 200) + 50, // 50-250ms
            codeType: nodeData.type,
            customCode: hasCustomCode,
            sandboxMode: nodeData.config?.enableSandbox !== false,
            result: {
              success: true,
              data: {
                processed: true,
                items: [
                  { id: "a1", value: Math.random() * 100 },
                  { id: "a2", value: Math.random() * 100 },
                  { id: "a3", value: Math.random() * 100 },
                ],
                customOutput: hasCustomCode ? "Output from custom code execution" : undefined,
              },
            },
          }
        } else {
          return {
            executed: true,
            duration: Math.floor(Math.random() * 200) + 50, // 50-250ms
            result: {
              success: true,
              data: {
                processed: true,
                items: [
                  { id: "a1", value: Math.random() * 100 },
                  { id: "a2", value: Math.random() * 100 },
                  { id: "a3", value: Math.random() * 100 },
                ],
              },
            },
          }
        }

      case "ai":
        if (nodeData.type === "ai-agent") {
          const hasCustomInstructions =
            nodeData.config?.customInstructions && nodeData.config.customInstructions.length > 0
          const isFineTuned = nodeData.config?.model === "custom-fine-tuned" || nodeData.config?.trainingData !== "none"
          const customPersona = nodeData.config?.persona !== "default" && nodeData.config?.persona

          let responseStyle = "standard"
          if (customPersona === "customer-support") responseStyle = "helpful and supportive"
          else if (customPersona === "technical") responseStyle = "technical and detailed"
          else if (customPersona === "creative") responseStyle = "creative and imaginative"
          else if (customPersona === "custom") responseStyle = "custom-defined"

          return {
            model: nodeData.config?.model || "gpt-4",
            customModel: nodeData.config?.model === "custom-fine-tuned" ? nodeData.config.customModelId : undefined,
            prompt: nodeData.config?.systemPrompt || "You are a helpful assistant",
            completion:
              testInputs.aiResponse ||
              (hasCustomInstructions
                ? "I'm following your custom instructions while helping you."
                : "I'm an AI assistant. How can I help you today?"),
            responseStyle: customPersona ? responseStyle : "standard",
            fineTuned: isFineTuned,
            customInstructions: hasCustomInstructions,
            tokens: {
              prompt: Math.floor(Math.random() * 100) + 50,
              completion: Math.floor(Math.random() * 200) + 100,
              total: Math.floor(Math.random() * 300) + 150,
            },
            duration: Math.floor(Math.random() * 2000) + 1000, // 1-3 seconds
          }
        } else if (nodeData.type === "sentiment-analysis") {
          const sentiments = ["positive", "negative", "neutral"]
          const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)]
          return {
            text: testInputs.sentimentText || "I really enjoyed using this product!",
            sentiment: sentiment,
            confidence: Math.random() * 0.5 + 0.5, // 0.5-1.0
            scores: {
              positive: sentiment === "positive" ? Math.random() * 0.5 + 0.5 : Math.random() * 0.3,
              negative: sentiment === "negative" ? Math.random() * 0.5 + 0.5 : Math.random() * 0.3,
              neutral: sentiment === "neutral" ? Math.random() * 0.5 + 0.5 : Math.random() * 0.3,
            },
          }
        } else {
          return {
            processed: true,
            aiType: nodeData.type,
            result: "AI processing completed successfully",
            confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
          }
        }

      case "integration":
        return {
          service: nodeData.type,
          operation: nodeData.config?.operation || "query",
          status: "success",
          data: {
            id: `${nodeData.type}-${Math.floor(Math.random() * 1000)}`,
            timestamp: new Date().toISOString(),
            details: {
              account: "Business Account",
              plan: "Enterprise",
              usage: Math.floor(Math.random() * 1000),
            },
          },
        }

      case "banking":
        if (nodeData.type === "transaction-processing") {
          return {
            transactionId: `txn-${Math.random().toString(36).substring(2, 10)}`,
            amount: Number.parseFloat((Math.random() * 1000 + 100).toFixed(2)),
            currency: nodeData.config?.currency || "USD",
            status: "completed",
            timestamp: new Date().toISOString(),
            accountId: nodeData.config?.accountId || "ACC123456789",
            reference: `REF-${Math.floor(Math.random() * 1000000)}`,
          }
        } else if (nodeData.type === "fraud-detection") {
          const riskScore = Math.floor(Math.random() * 100)
          return {
            transactionId: `txn-${Math.random().toString(36).substring(2, 10)}`,
            riskScore: riskScore,
            riskLevel: riskScore < 30 ? "low" : riskScore < 70 ? "medium" : "high",
            flags: riskScore > 70 ? ["unusual_location", "high_value"] : [],
            recommendation: riskScore > 70 ? "block" : "allow",
            confidence: Math.random() * 0.2 + 0.8, // 0.8-1.0
          }
        } else {
          return {
            operation: nodeData.type,
            status: "success",
            timestamp: new Date().toISOString(),
            details: `Banking operation ${nodeData.type} completed successfully`,
          }
        }

      default:
        return {
          processed: true,
          timestamp: new Date().toISOString(),
        }
    }
  }

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Format JSON for display
  const formatJson = (data: any) => {
    try {
      return JSON.stringify(data, null, 2)
    } catch (e) {
      return String(data)
    }
  }

  // Save current test scenario
  const saveCurrentScenario = (name: string) => {
    const newScenario = {
      name,
      inputs: { ...testInputs },
    }

    // Check if scenario with this name already exists
    const existingIndex = savedScenarios.findIndex((s) => s.name === name)

    if (existingIndex >= 0) {
      // Update existing scenario
      const updatedScenarios = [...savedScenarios]
      updatedScenarios[existingIndex] = newScenario
      setSavedScenarios(updatedScenarios)
    } else {
      // Add new scenario
      setSavedScenarios([...savedScenarios, newScenario])
    }

    setCurrentScenario(name)

    toast({
      title: "Scenario Saved",
      description: `Test scenario "${name}" has been saved`,
      duration: 2000,
    })
  }

  // Load a saved scenario
  const loadScenario = (name: string) => {
    const scenario = savedScenarios.find((s) => s.name === name)
    if (scenario) {
      setTestInputs(scenario.inputs)
      setCurrentScenario(name)

      toast({
        title: "Scenario Loaded",
        description: `Test scenario "${name}" has been loaded`,
        duration: 2000,
      })
    }
  }

  // Export test scenarios
  const exportScenarios = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedScenarios, null, 2))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "workflow-test-scenarios.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()

    toast({
      title: "Scenarios Exported",
      description: "Test scenarios exported as JSON",
      duration: 2000,
    })
  }

  // Copy node data to clipboard
  const copyNodeData = (data: any) => {
    navigator.clipboard.writeText(formatJson(data))
    setIsNodeDataCopied(true)

    setTimeout(() => {
      setIsNodeDataCopied(false)
    }, 2000)

    toast({
      title: "Copied to Clipboard",
      description: "Node data copied to clipboard",
      duration: 2000,
    })
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      simulatorRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Update node styles based on simulation state
  useEffect(() => {
    if (!isOpen) return

    const nodes = getNodes()
    const edges = getEdges()

    // Apply visual states to nodes
    const updatedNodes = nodes.map((node) => {
      const state = nodeStates[node.id]

      let className = ""
      if (state === "active") className = "simulation-node-active"
      else if (state === "completed") className = "simulation-node-completed"
      else if (state === "error") className = "simulation-node-error"

      return {
        ...node,
        className,
      }
    })

    // Apply visual states to edges
    const updatedEdges = edges.map((edge) => {
      const state = edgeStates[edge.id]

      let className = edge.className || ""
      if (state === "active") {
        className = `${className} simulation-edge-active`.trim()
      }

      return {
        ...edge,
        className,
      }
    })

    setNodes(updatedNodes)
    setEdges(updatedEdges)
  }, [isOpen, nodeStates, edgeStates, getNodes, getEdges, setNodes, setEdges])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current)
      }
    }
  }, [])

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      stopSimulation()
    }
  }, [isOpen])

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-16 pb-6 px-4">
        <div
          className="w-full max-w-6xl bg-background border rounded-lg shadow-lg flex flex-col max-h-[90vh]"
          ref={simulatorRef}
        >
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">Workflow Simulator</h2>
              <Badge variant={isRunning ? (isPaused ? "outline" : "default") : "secondary"} className="ml-2">
                {!isRunning ? "Ready" : isPaused ? "Paused" : "Running"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 mr-4 bg-muted/50 px-3 py-1 rounded-md">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-mono">{formatTime(simulationElapsedTime)}</span>
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={toggleFullscreen}>
                      {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Select
                value={executionSpeed}
                onValueChange={(value: "slow" | "normal" | "fast") => setExecutionSpeed(value)}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Speed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">Slow</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="fast">Fast</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>

          {progress > 0 && (
            <div className="px-4 py-1 border-b">
              <div className="flex items-center gap-2">
                <Progress value={progress} className="h-2" />
                <span className="text-xs font-medium">{progress}%</span>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-hidden flex">
            {showTestInputPanel && (
              <div className="w-72 border-r p-4 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Test Inputs</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowTestInputPanel(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4 flex-1 overflow-y-auto">
                  <div className="space-y-2">
                    <Label htmlFor="webhookPayload">Webhook Payload</Label>
                    <Textarea
                      id="webhookPayload"
                      placeholder="Enter JSON payload"
                      className="h-24 font-mono text-xs"
                      value={formatJson(
                        testInputs.webhookPayload || { event: "user.created", data: { id: 123, name: "John Doe" } },
                      )}
                      onChange={(e) => {
                        try {
                          const json = JSON.parse(e.target.value)
                          setTestInputs((prev) => ({ ...prev, webhookPayload: json }))
                        } catch {
                          // Keep the text value even if not valid JSON
                          setTestInputs((prev) => ({ ...prev, webhookPayload: e.target.value }))
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aiResponse">AI Response</Label>
                    <Textarea
                      id="aiResponse"
                      placeholder="Enter AI response"
                      className="h-24"
                      value={testInputs.aiResponse || "I'm an AI assistant. How can I help you today?"}
                      onChange={(e) => setTestInputs((prev) => ({ ...prev, aiResponse: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sentimentText">Sentiment Text</Label>
                    <Textarea
                      id="sentimentText"
                      placeholder="Enter text for sentiment analysis"
                      className="h-24"
                      value={testInputs.sentimentText || "I really enjoyed using this product!"}
                      onChange={(e) => setTestInputs((prev) => ({ ...prev, sentimentText: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="scenarioSelect">Test Scenarios</Label>
                    <div className="flex gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={exportScenarios}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Export Scenarios</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const name = prompt("Enter scenario name", currentScenario)
                                if (name) saveCurrentScenario(name)
                              }}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Save Current Scenario</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <Select value={currentScenario} onValueChange={loadScenario}>
                    <SelectTrigger id="scenarioSelect">
                      <SelectValue placeholder="Select scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      {savedScenarios.map((scenario) => (
                        <SelectItem key={scenario.name} value={scenario.name}>
                          {scenario.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setTestInputs({
                        webhookPayload: {
                          event: "user.created",
                          data: { id: 123, name: "John Doe", email: "john@example.com" },
                        },
                        aiResponse: "I'm an AI assistant. How can I help you today?",
                        sentimentText: "I really enjoyed using this product!",
                      })
                    }}
                  >
                    Reset to Defaults
                  </Button>
                </div>
              </div>
            )}

            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center gap-2">
                  {!isRunning ? (
                    <Button onClick={startSimulation} className="bg-green-600 hover:bg-green-700">
                      <Play className="h-4 w-4 mr-2" />
                      Start Simulation
                    </Button>
                  ) : isPaused ? (
                    <>
                      <Button onClick={resumeSimulation} className="bg-green-600 hover:bg-green-700">
                        <Play className="h-4 w-4 mr-2" />
                        Resume
                      </Button>
                      <Button variant="outline" onClick={stopSimulation}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={pauseSimulation} variant="secondary">
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                      <Button variant="outline" onClick={stopSimulation}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Stop
                      </Button>
                    </>
                  )}

                  <Button variant="outline" onClick={stepForward} disabled={isRunning && !isPaused}>
                    <SkipForward className="h-4 w-4 mr-2" />
                    Step
                  </Button>

                  {!showTestInputPanel && (
                    <Button variant="outline" size="sm" onClick={() => setShowTestInputPanel(true)}>
                      Show Test Inputs
                    </Button>
                  )}

                  <Button variant="ghost" size="icon" onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>

                {showAdvancedSettings && (
                  <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="autoFitView" checked={autoFitView} onCheckedChange={setAutoFitView} />
                      <Label htmlFor="autoFitView">Auto-fit View</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="highlightPath" checked={highlightPath} onCheckedChange={setHighlightPath} />
                      <Label htmlFor="highlightPath">Highlight Path</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="showDataFlow" checked={showDataFlow} onCheckedChange={setShowDataFlow} />
                      <Label htmlFor="showDataFlow">Show Data Flow</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="showNodeDetails" checked={showNodeDetails} onCheckedChange={setShowNodeDetails} />
                      <Label htmlFor="showNodeDetails">Show Node Details</Label>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                  <div className="px-4 pt-2 border-b">
                    <TabsList>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="logs">Logs</TabsTrigger>
                      <TabsTrigger value="data">Node Data</TabsTrigger>
                      <TabsTrigger value="stats">Statistics</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="overview" className="flex-1 p-4 overflow-auto">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center">
                              <Zap className="h-4 w-4 mr-2 text-blue-500" />
                              Execution Status
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Status:</span>
                                <Badge variant={isRunning ? (isPaused ? "outline" : "default") : "secondary"}>
                                  {!isRunning ? "Not Started" : isPaused ? "Paused" : "Running"}
                                </Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Current Node:</span>
                                <span className="font-medium">
                                  {currentNodeId
                                    ? getNodes().find((n) => n.id === currentNodeId)?.data.label || currentNodeId
                                    : "None"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Steps Completed:</span>
                                <span className="font-medium">{executionPath.length}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Execution Speed:</span>
                                <span className="font-medium capitalize">{executionSpeed}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center">
                              <BarChart className="h-4 w-4 mr-2 text-green-500" />
                              Statistics
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Elapsed Time:</span>
                                <span className="font-mono">{formatTime(simulationElapsedTime)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Nodes Processed:</span>
                                <span className="font-medium">
                                  {
                                    Object.values(nodeStates).filter(
                                      (state) => state === "completed" || state === "error",
                                    ).length
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Errors:</span>
                                <span className="font-medium text-destructive">
                                  {Object.values(nodeStates).filter((state) => state === "error").length}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Active Connections:</span>
                                <span className="font-medium">
                                  {Object.values(edgeStates).filter((state) => state === "active").length}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center">
                            <Layers className="h-4 w-4 mr-2 text-indigo-500" />
                            Execution Path
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {executionPath.length === 0 ? (
                            <div className="text-sm text-muted-foreground italic">No nodes have been executed yet</div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-1">
                                {executionPath.map((nodeId, index) => {
                                  const node = getNodes().find((n) => n.id === nodeId)
                                  if (!node) return null

                                  const nodeState = nodeStates[nodeId]
                                  const isLast = index === executionPath.length - 1

                                  return (
                                    <div key={nodeId} className="flex items-center">
                                      {index > 0 && <ArrowRight className="h-4 w-4 text-muted-foreground mx-1" />}
                                      <div
                                        className={cn(
                                          "px-2 py-1 rounded-md text-sm flex items-center gap-2",
                                          nodeState === "active" &&
                                            "bg-primary/10 text-primary border border-primary/20",
                                          nodeState === "completed" &&
                                            "bg-success/10 text-success border border-success/20",
                                          nodeState === "error" &&
                                            "bg-destructive/10 text-destructive border border-destructive/20",
                                          isLast && "font-medium",
                                        )}
                                      >
                                        {getNodeIcon(node.type, node.data.type)}
                                        <span>{node.data.label}</span>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {executionLogs.filter((log) => log.level === "error").length > 0 && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Errors Detected</AlertTitle>
                          <AlertDescription>
                            There are {executionLogs.filter((log) => log.level === "error").length} errors in the
                            workflow execution. Check the logs tab for details.
                          </AlertDescription>
                        </Alert>
                      )}

                      {isRunning && isPaused && executionPath.length > 0 && !currentNodeId && (
                        <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900">
                          <CheckCircle className="h-4 w-4" />
                          <AlertTitle>Workflow Completed</AlertTitle>
                          <AlertDescription>The workflow execution has completed successfully.</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="logs" className="flex-1 p-4 overflow-auto">
                    <ScrollArea className="h-full pr-4">
                      {executionLogs.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          No logs available. Start the simulation to see logs.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {executionLogs.map((log, index) => (
                            <div
                              key={index}
                              className={cn(
                                "text-sm border-l-2 pl-3 py-1",
                                log.level === "info" && "border-primary",
                                log.level === "warning" && "border-yellow-500",
                                log.level === "error" && "border-destructive",
                              )}
                            >
                              <span className="font-mono text-xs text-muted-foreground mr-2">{log.time}</span>
                              <span
                                className={cn(
                                  "font-medium",
                                  log.level === "info" && "text-primary",
                                  log.level === "warning" && "text-yellow-500",
                                  log.level === "error" && "text-destructive",
                                )}
                              >
                                {log.level.toUpperCase()}
                              </span>
                              <span className="ml-2">{log.message}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="data" className="flex-1 overflow-hidden">
                    <div className="h-full flex">
                      <div className="w-64 border-r overflow-y-auto">
                        <div className="p-4">
                          <h3 className="font-medium mb-2">Nodes</h3>
                          <div className="space-y-1">
                            {getNodes().map((node) => (
                              <Button
                                key={node.id}
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "w-full justify-start text-left",
                                  Object.keys(nodeData).includes(node.id) && "font-medium",
                                  nodeStates[node.id] === "active" && "bg-primary/10 text-primary",
                                  nodeStates[node.id] === "completed" && "bg-success/10 text-success",
                                  nodeStates[node.id] === "error" && "bg-destructive/10 text-destructive",
                                )}
                                onClick={() => setCurrentNodeId(node.id)}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  {getNodeIcon(node.type, node.data.type)}
                                  <span className="truncate">{node.data.label}</span>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 p-4 overflow-auto">
                        {currentNodeId ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium flex items-center gap-2">
                                {getNodeIcon(
                                  getNodes().find((n) => n.id === currentNodeId)?.type || "",
                                  getNodes().find((n) => n.id === currentNodeId)?.data.type || "",
                                )}
                                Node Data: {getNodes().find((n) => n.id === currentNodeId)?.data.label || currentNodeId}
                              </h3>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    nodeStates[currentNodeId] === "active"
                                      ? "default"
                                      : nodeStates[currentNodeId] === "completed"
                                        ? "success"
                                        : nodeStates[currentNodeId] === "error"
                                          ? "destructive"
                                          : "outline"
                                  }
                                >
                                  {nodeStates[currentNodeId] || "pending"}
                                </Badge>

                                {nodeData[currentNodeId] && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => copyNodeData(nodeData[currentNodeId])}
                                  >
                                    {isNodeDataCopied ? (
                                      <CheckCheck className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>

                            {nodeData[currentNodeId] ? (
                              <Card>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm flex items-center">
                                    <FileJson className="h-4 w-4 mr-2" />
                                    Node Output
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <pre className="bg-muted p-4 rounded-md overflow-auto text-xs font-mono">
                                    {formatJson(nodeData[currentNodeId])}
                                  </pre>
                                </CardContent>
                              </Card>
                            ) : (
                              <div className="text-muted-foreground italic">No data available for this node yet</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground py-8">Select a node to view its data</div>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="stats" className="flex-1 p-4 overflow-auto">
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center">
                            <BarChart className="h-4 w-4 mr-2 text-blue-500" />
                            Execution Statistics
                          </CardTitle>
                          <CardDescription>Detailed metrics about the workflow execution</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium mb-1">Execution Time</h4>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Total Time:</span>
                                  <span className="font-mono">{formatTime(simulationElapsedTime)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Average Per Node:</span>
                                  <span className="font-mono">
                                    {executionPath.length > 0
                                      ? formatTime(Math.floor(simulationElapsedTime / executionPath.length))
                                      : "0:00"}
                                  </span>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium mb-1">Node Types</h4>
                                <div className="space-y-1">
                                  {["trigger", "action", "logic", "code", "ai", "integration", "banking"].map(
                                    (type) => {
                                      const count = getNodes().filter((n) => n.type === type).length
                                      if (count === 0) return null
                                      return (
                                        <div key={type} className="flex items-center justify-between">
                                          <span className="text-sm text-muted-foreground capitalize">{type}:</span>
                                          <span className="font-medium">{count}</span>
                                        </div>
                                      )
                                    },
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium mb-1">Execution Status</h4>
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Total Nodes:</span>
                                    <span className="font-medium">{getNodes().length}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Completed:</span>
                                    <span className="font-medium text-success">
                                      {Object.values(nodeStates).filter((state) => state === "completed").length}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Active:</span>
                                    <span className="font-medium text-primary">
                                      {Object.values(nodeStates).filter((state) => state === "active").length}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Errors:</span>
                                    <span className="font-medium text-destructive">
                                      {Object.values(nodeStates).filter((state) => state === "error").length}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Pending:</span>
                                    <span className="font-medium">
                                      {Object.values(nodeStates).filter((state) => state === "pending").length}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium mb-1">Connections</h4>
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Total Connections:</span>
                                    <span className="font-medium">{getEdges().length}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Active:</span>
                                    <span className="font-medium">
                                      {Object.values(edgeStates).filter((state) => state === "active").length}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center">
                            <Info className="h-4 w-4 mr-2 text-amber-500" />
                            Performance Insights
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {executionPath.length > 0 ? (
                              <>
                                <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-900 dark:text-blue-400">
                                  <Info className="h-4 w-4" />
                                  <AlertTitle>Workflow Analysis</AlertTitle>
                                  <AlertDescription>
                                    This workflow has {getNodes().length} nodes and {getEdges().length} connections.
                                    {Object.values(nodeStates).filter((state) => state === "error").length > 0
                                      ? " There are errors that need to be addressed."
                                      : " The execution is proceeding as expected."}
                                  </AlertDescription>
                                </Alert>

                                {Object.values(nodeStates).filter((state) => state === "error").length > 0 && (
                                  <div className="mt-2 space-y-2">
                                    <h4 className="text-sm font-medium">Error Analysis</h4>
                                    <ul className="list-disc pl-5 text-sm space-y-1">
                                      {executionLogs
                                        .filter((log) => log.level === "error")
                                        .map((log, index) => (
                                          <li key={index} className="text-destructive">
                                            {log.message}
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                )}

                                <div className="mt-4">
                                  <h4 className="text-sm font-medium mb-2">Performance Bottlenecks</h4>
                                  {Object.entries(nodeData).length > 0 ? (
                                    <div className="space-y-2">
                                      {Object.entries(nodeData)
                                        .filter(([_, data]) => data.duration)
                                        .sort((a, b) => b[1].duration - a[1].duration)
                                        .slice(0, 3)
                                        .map(([nodeId, data]) => {
                                          const node = getNodes().find((n) => n.id === nodeId)
                                          return (
                                            <div key={nodeId} className="flex items-center justify-between">
                                              <span className="text-sm">{node?.data.label || nodeId}:</span>
                                              <Badge variant="outline" className="font-mono">
                                                {data.duration}ms
                                              </Badge>
                                            </div>
                                          )
                                        })}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">No performance data available yet.</p>
                                  )}
                                </div>
                              </>
                            ) : (
                              <div className="text-center text-muted-foreground py-4">
                                Run the simulation to see performance insights
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="border-t pt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => {
                              // Export performance report
                              const report = {
                                workflow: {
                                  nodes: getNodes().length,
                                  edges: getEdges().length,
                                  executionTime: simulationElapsedTime,
                                  completed: Object.values(nodeStates).filter((state) => state === "completed").length,
                                  errors: Object.values(nodeStates).filter((state) => state === "error").length,
                                },
                                nodeData,
                                executionLogs,
                              }

                              const dataStr =
                                "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2))
                              const downloadAnchorNode = document.createElement("a")
                              downloadAnchorNode.setAttribute("href", dataStr)
                              downloadAnchorNode.setAttribute("download", "workflow-performance-report.json")
                              document.body.appendChild(downloadAnchorNode)
                              downloadAnchorNode.click()
                              downloadAnchorNode.remove()

                              toast({
                                title: "Report Exported",
                                description: "Performance report exported as JSON",
                                duration: 2000,
                              })
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export Performance Report
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to get node icon based on type
function getNodeIcon(nodeType: string, dataType: string) {
  switch (nodeType) {
    case "trigger":
      return <Zap className="h-4 w-4" />
    case "action":
      if (dataType === "database") return <Database className="h-4 w-4" />
      return <Globe className="h-4 w-4" />
    case "logic":
      return <Filter className="h-4 w-4" />
    case "code":
      return <Code className="h-4 w-4" />
    case "ai":
      return <Bot className="h-4 w-4" />
    case "message":
      return <MessageSquare className="h-4 w-4" />
    case "integration":
      return <Database className="h-4 w-4" />
    case "banking":
      return <Database className="h-4 w-4" />
    default:
      return <Zap className="h-4 w-4" />
  }
}

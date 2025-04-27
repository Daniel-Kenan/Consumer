"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Link2,
  Plus,
  Trash2,
  MoreHorizontal,
  Search,
  Workflow,
  Bot,
  ArrowRight,
  ArrowDown,
  GitMerge,
  GitBranch,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  MoveHorizontal,
} from "lucide-react"

interface WorkflowItem {
  id: string
  name: string
  description: string
  type: "standard" | "ai"
  updatedAt: string
  dependencies: string[]
  subworkflows: string[]
}

export default function WorkflowDependencies() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)
  const [addDependencyDialogOpen, setAddDependencyDialogOpen] = useState(false)
  const [addSubworkflowDialogOpen, setAddSubworkflowDialogOpen] = useState(false)
  const [dependencyGraphDialogOpen, setDependencyGraphDialogOpen] = useState(false)
  const [graphZoom, setGraphZoom] = useState(1)
  const [graphPosition, setGraphPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const graphRef = useRef<HTMLDivElement>(null)

  // Add local state and handlers
  const handleAddDependency = (workflowId: string, dependencyId: string) => {
    console.log(`Adding dependency ${dependencyId} to workflow ${workflowId}`)
  }

  const handleRemoveDependency = (workflowId: string, dependencyId: string) => {
    console.log(`Removing dependency ${dependencyId} from workflow ${workflowId}`)
  }

  const handleAddSubworkflow = (workflowId: string, subworkflowId: string) => {
    console.log(`Adding subworkflow ${subworkflowId} to workflow ${workflowId}`)
  }

  const handleRemoveSubworkflow = (workflowId: string, subworkflowId: string) => {
    console.log(`Removing subworkflow ${subworkflowId} from workflow ${workflowId}`)
  }

  const handleSelectWorkflow = (workflowId: string) => {
    console.log(`Selected workflow ${workflowId}`)
  }

  // Mock data - would come from API in real app
  const workflows: WorkflowItem[] = [
    {
      id: "w1",
      name: "Customer Onboarding",
      description: "Process new customer applications and send welcome emails",
      type: "standard",
      updatedAt: "2023-06-15",
      dependencies: ["w3"],
      subworkflows: ["w6"],
    },
    {
      id: "w2",
      name: "Transaction Monitoring",
      description: "Monitor transactions for suspicious activity",
      type: "standard",
      updatedAt: "2023-06-14",
      dependencies: [],
      subworkflows: [],
    },
    {
      id: "w3",
      name: "Account Reconciliation",
      description: "Daily account reconciliation process",
      type: "standard",
      updatedAt: "2023-06-10",
      dependencies: ["w2"],
      subworkflows: [],
    },
    {
      id: "w4",
      name: "AI Data Processing",
      description: "Process data from Google Sheets using AI models",
      type: "ai",
      updatedAt: "2023-06-20",
      dependencies: [],
      subworkflows: ["w5"],
    },
    {
      id: "w5",
      name: "Customer Support AI",
      description: "AI-powered customer support response generation",
      type: "ai",
      updatedAt: "2023-06-18",
      dependencies: [],
      subworkflows: [],
    },
    {
      id: "w6",
      name: "Email Campaign",
      description: "Automated email campaign workflow",
      type: "standard",
      updatedAt: "2023-06-05",
      dependencies: [],
      subworkflows: [],
    },
  ]

  // Filter workflows based on search query
  const filteredWorkflows = searchQuery
    ? workflows.filter(
        (workflow) =>
          workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workflow.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : workflows

  // Get workflow by ID
  const getWorkflow = (id: string) => {
    return workflows.find((w) => w.id === id)
  }

  // Get dependencies for a workflow
  const getWorkflowDependencies = (workflowId: string) => {
    const workflow = getWorkflow(workflowId)
    if (!workflow) return []
    return workflow.dependencies.map((id) => getWorkflow(id)).filter(Boolean) as WorkflowItem[]
  }

  // Get subworkflows for a workflow
  const getWorkflowSubworkflows = (workflowId: string) => {
    const workflow = getWorkflow(workflowId)
    if (!workflow) return []
    return workflow.subworkflows.map((id) => getWorkflow(id)).filter(Boolean) as WorkflowItem[]
  }

  // Get workflows that depend on this workflow
  const getDependentWorkflows = (workflowId: string) => {
    return workflows.filter((w) => w.dependencies.includes(workflowId))
  }

  // Get workflows that use this workflow as a subworkflow
  const getParentWorkflows = (workflowId: string) => {
    return workflows.filter((w) => w.subworkflows.includes(workflowId))
  }

  // Get available workflows for dependencies (workflows that are not already dependencies and not the workflow itself)
  const getAvailableDependencies = (workflowId: string) => {
    const workflow = getWorkflow(workflowId)
    if (!workflow) return []

    // Check for circular dependencies
    const wouldCreateCircular = (dependencyId: string): boolean => {
      // If the potential dependency already depends on this workflow, it would create a circular dependency
      const potentialDependency = getWorkflow(dependencyId)
      if (!potentialDependency) return false

      // Direct circular dependency
      if (potentialDependency.dependencies.includes(workflowId)) return true

      // Check for indirect circular dependencies
      return potentialDependency.dependencies.some((id) => wouldCreateCircular(id))
    }

    return workflows.filter(
      (w) => w.id !== workflowId && !workflow.dependencies.includes(w.id) && !wouldCreateCircular(w.id),
    )
  }

  // Get available workflows for subworkflows (workflows that are not already subworkflows and not the workflow itself)
  const getAvailableSubworkflows = (workflowId: string) => {
    const workflow = getWorkflow(workflowId)
    if (!workflow) return []

    // Check for circular subworkflow references
    const wouldCreateCircular = (subworkflowId: string): boolean => {
      // If the potential subworkflow already includes this workflow as a subworkflow, it would create a circular reference
      const potentialSubworkflow = getWorkflow(subworkflowId)
      if (!potentialSubworkflow) return false

      // Direct circular reference
      if (potentialSubworkflow.subworkflows.includes(workflowId)) return true

      // Check for indirect circular references
      return potentialSubworkflow.subworkflows.some((id) => wouldCreateCircular(id))
    }

    return workflows.filter(
      (w) => w.id !== workflowId && !workflow.subworkflows.includes(w.id) && !wouldCreateCircular(w.id),
    )
  }

  // Graph interaction handlers
  const handleZoomIn = () => {
    setGraphZoom((prev) => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setGraphZoom((prev) => Math.max(prev - 0.1, 0.5))
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0) {
      // Left mouse button
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x
      const dy = e.clientY - dragStart.y
      setGraphPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // Reset graph position and zoom when dialog opens
  useEffect(() => {
    if (dependencyGraphDialogOpen) {
      setGraphZoom(1)
      setGraphPosition({ x: 0, y: 0 })
    }
  }, [dependencyGraphDialogOpen])

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Workflow Dependencies</h2>
        <Button onClick={() => setDependencyGraphDialogOpen(true)}>
          <GitBranch className="h-4 w-4 mr-2" />
          View Dependency Graph
        </Button>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workflows..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {filteredWorkflows.map((workflow) => (
            <div
              key={workflow.id}
              className="rounded-md border hover:bg-accent cursor-pointer"
              onClick={() => handleSelectWorkflow(workflow.id)}
            >
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {workflow.type === "ai" ? (
                      <Bot className="h-4 w-4 text-cyan-500" />
                    ) : (
                      <Workflow className="h-4 w-4 text-blue-500" />
                    )}
                    <div>
                      <div className="font-medium">{workflow.name}</div>
                      <div className="text-xs text-muted-foreground">Updated: {workflow.updatedAt}</div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedWorkflow(workflow.id)
                          setAddDependencyDialogOpen(true)
                        }}
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Add Dependency
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedWorkflow(workflow.id)
                          setAddSubworkflowDialogOpen(true)
                        }}
                      >
                        <ArrowDown className="h-4 w-4 mr-2" />
                        Add Subworkflow
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="p-3 border-b">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <ArrowRight className="h-3.5 w-3.5" />
                  Dependencies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getWorkflowDependencies(workflow.id).map((dependency) => (
                    <Badge key={dependency.id} variant="outline" className="flex items-center gap-1">
                      {dependency.type === "ai" ? (
                        <Bot className="h-3 w-3 text-cyan-500" />
                      ) : (
                        <Workflow className="h-3 w-3 text-blue-500" />
                      )}
                      {dependency.name}
                      <button
                        className="ml-1 hover:bg-background/20 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveDependency(workflow.id, dependency.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {getWorkflowDependencies(workflow.id).length === 0 && (
                    <span className="text-xs text-muted-foreground">No dependencies</span>
                  )}
                </div>
              </div>

              <div className="p-3 border-b">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <ArrowDown className="h-3.5 w-3.5" />
                  Subworkflows
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getWorkflowSubworkflows(workflow.id).map((subworkflow) => (
                    <Badge key={subworkflow.id} variant="outline" className="flex items-center gap-1">
                      {subworkflow.type === "ai" ? (
                        <Bot className="h-3 w-3 text-cyan-500" />
                      ) : (
                        <Workflow className="h-3 w-3 text-blue-500" />
                      )}
                      {subworkflow.name}
                      <button
                        className="ml-1 hover:bg-background/20 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveSubworkflow(workflow.id, subworkflow.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {getWorkflowSubworkflows(workflow.id).length === 0 && (
                    <span className="text-xs text-muted-foreground">No subworkflows</span>
                  )}
                </div>
              </div>

              <div className="p-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Link2 className="h-3.5 w-3.5 rotate-180" />
                      Used by
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {getDependentWorkflows(workflow.id).map((dependent) => (
                        <Badge key={dependent.id} variant="outline" className="flex items-center gap-1">
                          {dependent.type === "ai" ? (
                            <Bot className="h-3 w-3 text-cyan-500" />
                          ) : (
                            <Workflow className="h-3 w-3 text-blue-500" />
                          )}
                          {dependent.name}
                        </Badge>
                      ))}
                      {getDependentWorkflows(workflow.id).length === 0 && (
                        <span className="text-xs text-muted-foreground">Not used by any workflow</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                      <GitMerge className="h-3.5 w-3.5" />
                      Parent workflows
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {getParentWorkflows(workflow.id).map((parent) => (
                        <Badge key={parent.id} variant="outline" className="flex items-center gap-1">
                          {parent.type === "ai" ? (
                            <Bot className="h-3 w-3 text-cyan-500" />
                          ) : (
                            <Workflow className="h-3 w-3 text-blue-500" />
                          )}
                          {parent.name}
                        </Badge>
                      ))}
                      {getParentWorkflows(workflow.id).length === 0 && (
                        <span className="text-xs text-muted-foreground">Not used as a subworkflow</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Add Dependency Dialog */}
      <Dialog open={addDependencyDialogOpen} onOpenChange={setAddDependencyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Dependency</DialogTitle>
            <DialogDescription>
              Select a workflow that "{getWorkflow(selectedWorkflow || "")?.name}" will depend on.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              {selectedWorkflow &&
                getAvailableDependencies(selectedWorkflow).map((workflow) => (
                  <div
                    key={workflow.id}
                    className="flex items-center justify-between p-3 rounded-md border hover:bg-accent cursor-pointer"
                    onClick={() => {
                      handleAddDependency(selectedWorkflow, workflow.id)
                      setAddDependencyDialogOpen(false)
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {workflow.type === "ai" ? (
                        <Bot className="h-4 w-4 text-cyan-500" />
                      ) : (
                        <Workflow className="h-4 w-4 text-blue-500" />
                      )}
                      <div>
                        <div className="font-medium">{workflow.name}</div>
                        <div className="text-xs text-muted-foreground">{workflow.description}</div>
                      </div>
                    </div>
                    <Plus className="h-4 w-4" />
                  </div>
                ))}
              {selectedWorkflow && getAvailableDependencies(selectedWorkflow).length === 0 && (
                <div className="text-center p-4 text-muted-foreground">
                  No available workflows to add as dependencies.
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDependencyDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subworkflow Dialog */}
      <Dialog open={addSubworkflowDialogOpen} onOpenChange={setAddSubworkflowDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subworkflow</DialogTitle>
            <DialogDescription>
              Select a workflow to add as a subworkflow to "{getWorkflow(selectedWorkflow || "")?.name}".
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              {selectedWorkflow &&
                getAvailableSubworkflows(selectedWorkflow).map((workflow) => (
                  <div
                    key={workflow.id}
                    className="flex items-center justify-between p-3 rounded-md border hover:bg-accent cursor-pointer"
                    onClick={() => {
                      handleAddSubworkflow(selectedWorkflow, workflow.id)
                      setAddSubworkflowDialogOpen(false)
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {workflow.type === "ai" ? (
                        <Bot className="h-4 w-4 text-cyan-500" />
                      ) : (
                        <Workflow className="h-4 w-4 text-blue-500" />
                      )}
                      <div>
                        <div className="font-medium">{workflow.name}</div>
                        <div className="text-xs text-muted-foreground">{workflow.description}</div>
                      </div>
                    </div>
                    <Plus className="h-4 w-4" />
                  </div>
                ))}
              {selectedWorkflow && getAvailableSubworkflows(selectedWorkflow).length === 0 && (
                <div className="text-center p-4 text-muted-foreground">
                  No available workflows to add as subworkflows.
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddSubworkflowDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dependency Graph Dialog */}
      <Dialog open={dependencyGraphDialogOpen} onOpenChange={setDependencyGraphDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Workflow Dependency Graph</DialogTitle>
            <DialogDescription>Visual representation of workflow dependencies and relationships.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="border rounded-md p-4 h-[500px] relative overflow-hidden">
              {/* Graph controls */}
              <div className="absolute top-4 right-4 flex gap-2 z-10 bg-background/80 p-2 rounded-md shadow-sm">
                <Button variant="outline" size="icon" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" title="Reset Position">
                  <MoveHorizontal
                    className="h-4 w-4"
                    onClick={() => {
                      setGraphZoom(1)
                      setGraphPosition({ x: 0, y: 0 })
                    }}
                  />
                </Button>
              </div>

              {/* Graph container */}
              <div
                className="w-full h-full cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                ref={graphRef}
              >
                <div
                  className="relative w-full h-full"
                  style={{
                    transform: `scale(${graphZoom}) translate(${graphPosition.x}px, ${graphPosition.y}px)`,
                    transformOrigin: "center",
                    transition: isDragging ? "none" : "transform 0.1s ease-out",
                  }}
                >
                  {/* Graph visualization */}
                  <svg width="100%" height="100%" className="absolute inset-0">
                    {/* Dependency arrows */}
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" className="fill-muted-foreground" />
                      </marker>
                      <marker
                        id="subworkflow-arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon points="0 0, 10 3.5, 0 7" className="fill-blue-500" />
                      </marker>
                    </defs>

                    {/* Customer Onboarding -> Account Reconciliation */}
                    <line
                      x1="150"
                      y1="100"
                      x2="350"
                      y2="200"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth="2"
                      strokeDasharray="4"
                      markerEnd="url(#arrowhead)"
                    />

                    {/* Account Reconciliation -> Transaction Monitoring */}
                    <line
                      x1="450"
                      y1="200"
                      x2="550"
                      y2="100"
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth="2"
                      strokeDasharray="4"
                      markerEnd="url(#arrowhead)"
                    />

                    {/* Customer Onboarding -> Email Campaign (subworkflow) */}
                    <line
                      x1="150"
                      y1="150"
                      x2="150"
                      y2="300"
                      stroke="hsl(var(--blue-500))"
                      strokeWidth="2"
                      markerEnd="url(#subworkflow-arrowhead)"
                    />

                    {/* AI Data Processing -> Customer Support AI (subworkflow) */}
                    <line
                      x1="550"
                      y1="350"
                      x2="450"
                      y2="450"
                      stroke="hsl(var(--blue-500))"
                      strokeWidth="2"
                      markerEnd="url(#subworkflow-arrowhead)"
                    />
                  </svg>

                  {/* Workflow nodes */}
                  <div className="absolute left-[100px] top-[50px] w-[200px]">
                    <div className="bg-background border-2 border-blue-500 rounded-md p-3 shadow-md">
                      <div className="flex items-center gap-2">
                        <Workflow className="h-5 w-5 text-blue-500" />
                        <div className="font-medium">Customer Onboarding</div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Process new customer applications</div>
                    </div>
                  </div>

                  <div className="absolute left-[500px] top-[50px] w-[200px]">
                    <div className="bg-background border-2 border-blue-500 rounded-md p-3 shadow-md">
                      <div className="flex items-center gap-2">
                        <Workflow className="h-5 w-5 text-blue-500" />
                        <div className="font-medium">Transaction Monitoring</div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Monitor transactions</div>
                    </div>
                  </div>

                  <div className="absolute left-[350px] top-[200px] w-[200px]">
                    <div className="bg-background border-2 border-blue-500 rounded-md p-3 shadow-md">
                      <div className="flex items-center gap-2">
                        <Workflow className="h-5 w-5 text-blue-500" />
                        <div className="font-medium">Account Reconciliation</div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Daily account reconciliation</div>
                    </div>
                  </div>

                  <div className="absolute left-[100px] top-[300px] w-[200px]">
                    <div className="bg-background border-2 border-blue-500 rounded-md p-3 shadow-md">
                      <div className="flex items-center gap-2">
                        <Workflow className="h-5 w-5 text-blue-500" />
                        <div className="font-medium">Email Campaign</div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Automated email campaign</div>
                    </div>
                  </div>

                  <div className="absolute left-[500px] top-[300px] w-[200px]">
                    <div className="bg-background border-2 border-cyan-500 rounded-md p-3 shadow-md">
                      <div className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-cyan-500" />
                        <div className="font-medium">AI Data Processing</div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Process data using AI models</div>
                    </div>
                  </div>

                  <div className="absolute left-[350px] top-[400px] w-[200px]">
                    <div className="bg-background border-2 border-cyan-500 rounded-md p-3 shadow-md">
                      <div className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-cyan-500" />
                        <div className="font-medium">Customer Support AI</div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">AI-powered customer support</div>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="absolute left-[20px] bottom-[20px] bg-background/90 p-3 rounded-md border shadow-sm">
                    <div className="text-sm font-medium mb-2">Legend</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Workflow className="h-4 w-4 text-blue-500" />
                        <span className="text-xs">Standard Workflow</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-cyan-500" />
                        <span className="text-xs">AI Workflow</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-0 border-t-2 border-dashed border-muted-foreground"></div>
                        <span className="text-xs">Dependency</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-0 border-t-2 border-blue-500"></div>
                        <span className="text-xs">Subworkflow</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDependencyGraphDialogOpen(false)}>
              Close
            </Button>
            <Button>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Full Screen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

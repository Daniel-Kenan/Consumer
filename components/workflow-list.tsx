"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, MoreHorizontal, Play, Pause, Trash2, Copy, Edit, Bot, ArrowUpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

type Environment = "DEV" | "ETE" | "QA" | "PROD"

type Workflow = {
  id: string
  name: string
  description: string
  status: "active" | "inactive"
  lastRun: string
  createdAt: string
  type: "standard" | "ai"
  folder?: string
  tags?: string[]
  environment: Environment
  version: string
}

export default function WorkflowList() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [environmentFilter, setEnvironmentFilter] = useState<string>("all")

  const [promotionDialogOpen, setPromotionDialogOpen] = useState(false)
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string | null>(null)
  const [promotionNotes, setPromotionNotes] = useState("")

  // Fetch workflows from Flask endpoint
  useEffect(() => {
    async function fetchWorkflows() {
      try {
        const res = await fetch("http://localhost:5000/workflows")
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`)
        const data: Workflow[] = await res.json()
        setWorkflows(data)
      } catch (err: any) {
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchWorkflows()
  }, [])

  // Toggle active/inactive status
  const toggleStatus = (id: string) => {
    setWorkflows(
      workflows.map((w) =>
        w.id === id ? { ...w, status: w.status === "active" ? "inactive" : "active" } : w
      )
    )
  }

  // Delete a workflow
  const deleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter((w) => w.id !== id))
  }

  // Duplicate a workflow
  const duplicateWorkflow = (id: string) => {
    const wf = workflows.find((w) => w.id === id)
    if (wf) {
      const copy: Workflow = {
        ...wf,
        id: Date.now().toString(),
        name: `${wf.name} (Copy)`,
        status: "inactive",
        createdAt: new Date().toISOString().split("T")[0],
        environment: "DEV",
      }
      setWorkflows([...workflows, copy])
    }
  }

  // Determine next environment
  const getNextEnvironment = (env: Environment): Environment | null => {
    const list: Environment[] = ["DEV", "ETE", "QA", "PROD"]
    const idx = list.indexOf(env)
    return idx < list.length - 1 ? list[idx + 1] : null
  }

  // Promote workflow with version bump
  const promoteWorkflow = () => {
    if (!selectedWorkflowId) return
    setWorkflows(
      workflows.map((w) => {
        if (w.id === selectedWorkflowId) {
          const nextEnv = getNextEnvironment(w.environment)
          if (!nextEnv) {
            toast({
              title: "Cannot Promote",
              description: `Workflow is already in ${w.environment}`,
              variant: "destructive",
            })
            return w
          }
          const [major, minor, patch] = w.version.split('.').map(Number)
          let newVersion = w.version
          if (nextEnv === "PROD") newVersion = `${major + 1}.0.0`
          else if (nextEnv === "QA") newVersion = `${major}.${minor + 1}.0`
          else newVersion = `${major}.${minor}.${patch + 1}`

          toast({
            title: "Workflow Promoted",
            description: `${w.name} promoted to ${nextEnv} (v${newVersion})`,
          })
          return { ...w, environment: nextEnv, version: newVersion }
        }
        return w
      })
    )
    setPromotionDialogOpen(false)
  }

  // Filter workflows
  const filteredWorkflows = workflows.filter((w) => {
    const matchesSearch =
      !searchQuery ||
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || w.status === statusFilter
    const matchesType = typeFilter === "all" || w.type === typeFilter
    const matchesEnv = environmentFilter === "all" || w.environment === environmentFilter
    return matchesSearch && matchesStatus && matchesType && matchesEnv
  })

  // Badge colors
  const getEnvironmentColor = (env: Environment) => {
    switch (env) {
      case "DEV": return "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20 border-slate-500/20"
      case "ETE": return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20"
      case "QA":  return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20"
      case "PROD":return "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
    }
  }

  if (loading) return <p>Loading workflows...</p>
  if (error) return <p className="text-red-500">Error: {error}</p>

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status"/></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Type"/></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="ai">AI</SelectItem>
          </SelectContent>
        </Select>
        <Select value={environmentFilter} onValueChange={setEnvironmentFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Environment"/></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Environments</SelectItem>
            <SelectItem value="DEV">DEV</SelectItem>
            <SelectItem value="ETE">ETE</SelectItem>
            <SelectItem value="QA">QA</SelectItem>
            <SelectItem value="PROD">PROD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Workflow Cards */}
      {filteredWorkflows.map((workflow) => (
        <Card key={workflow.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className={`flex items-center border-l-4 ${workflow.type === "ai" ? "border-cyan-500" : "border-[#007A33]"} p-4`}>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-medium">{workflow.name}</h3>
                  <Badge variant={workflow.status === "active" ? "default" : "outline"} className={workflow.status === "active" ? "bg-[#007A33] hover:bg-[#006128]" : ""}>
                    {workflow.status}
                  </Badge>
                  {workflow.type === "ai" && (
                    <Badge variant="outline" className="bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20 border-cyan-500/20">
                      <Bot className="h-3 w-3 mr-1"/>AI
                    </Badge>
                  )}
                  <Badge variant="outline" className={getEnvironmentColor(workflow.environment)}>
                    {workflow.environment}
                  </Badge>
                  <Badge variant="outline">v{workflow.version}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{workflow.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1"/>Created: {workflow.createdAt}
                  </div>
                  <div>Last run: {workflow.lastRun}</div>
                  {workflow.folder && <Badge variant="outline" className="text-xs">Folder: {workflow.folder}</Badge>}
                  {workflow.tags?.map((tag) => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => toggleStatus(workflow.id)} title={workflow.status === "active" ? "Deactivate" : "Activate"}>
                  {workflow.status === "active" ? <Pause className="h-4 w-4"/> : <Play className="h-4 w-4"/>}
                </Button>
                <Link href={`/workflows/${workflow.id}`}><Button variant="outline" size="icon" title="Edit"><Edit className="h-4 w-4"/></Button></Link>
                {workflow.environment !== "PROD" && (
                  <Button variant="outline" size="icon" onClick={() => setPromotionDialogOpen(true) & setSelectedWorkflowId(workflow.id)} title={`Promote to ${getNextEnvironment(workflow.environment)}`}>
                    <ArrowUpCircle className="h-4 w-4"/>
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="outline" size="icon"><MoreHorizontal className="h-4 w-4"/></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => duplicateWorkflow(workflow.id)}><Copy className="h-4 w-4 mr-2"/>Duplicate</DropdownMenuItem>
                    {workflow.environment !== "PROD" && <DropdownMenuItem onClick={() => setPromotionDialogOpen(true) & setSelectedWorkflowId(workflow.id)}><ArrowUpCircle className="h-4 w-4 mr-2"/>Promote to {getNextEnvironment(workflow.environment)}</DropdownMenuItem>}
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem onClick={() => deleteWorkflow(workflow.id)} className="text-red-500 focus:text-red-500"><Trash2 className="h-4 w-4 mr-2"/>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {filteredWorkflows.length === 0 && (
        <div className="text-center p-8 border rounded-md">
          <p className="text-muted-foreground">No workflows found matching your filters.</p>
        </div>
      )}

      {/* Promotion Dialog */}
      <Dialog open={promotionDialogOpen} onOpenChange={setPromotionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Promote Workflow</DialogTitle>
            <DialogDescription>
              {selectedWorkflowId && `Promote \"${workflows.find(w => w.id === selectedWorkflowId)?.name}\" from ${workflows.find(w => w.id === selectedWorkflowId)?.environment} to ${getNextEnvironment(workflows.find(w => w.id === selectedWorkflowId)?.environment as Environment)}`}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Promotion Notes</h4>
              <Textarea placeholder="Add notes (optional)" value={promotionNotes} onChange={(e) => setPromotionNotes(e.target.value)} rows={4}/>
            </div>
            <div className="text-sm">
              <p className="font-medium">Version Change:</p>
              {selectedWorkflowId && (() => {
                const wf = workflows.find(w => w.id === selectedWorkflowId)
                if (!wf) return null
                const nextEnv = getNextEnvironment(wf.environment)
                const [major, minor, patch] = wf.version.split('.').map(Number)
                const change = nextEnv === 'PROD'
                  ? `v${wf.version} → v${major+1}.0.0`
                  : nextEnv === 'QA'
                    ? `v${wf.version} → v${major}.${minor+1}.0`
                    : `v${wf.version} → v${major}.${minor}.${patch+1}`
                return <p className="text-muted-foreground">{change}</p>
              })()}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPromotionDialogOpen(false)}>Cancel</Button>
            <Button onClick={promoteWorkflow}>Promote Workflow</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

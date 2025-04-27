"use client"

import { useState, useEffect } from "react"
import { DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  FolderTree,
  FolderPlus,
  FolderEdit,
  FolderX,
  MoreHorizontal,
  Search,
  Workflow as WorkflowIcon,
  Bot,
  ArrowRight,
} from "lucide-react"

type Environment = "DEV" | "ETE" | "QA" | "PROD"

interface Folder {
  id: string
  name: string
  description: string
  workflows: number
  parent: string | null
  createdAt: string
  updatedAt: string
}

interface WorkflowItem {
  id: string
  name: string
  description: string
  type: "standard" | "ai"
  updatedAt: string
  folderId: string
}

export default function FolderManagement() {
  const [folders, setFolders] = useState<Folder[]>([])
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false)
  const [editFolderDialogOpen, setEditFolderDialogOpen] = useState(false)
  const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false)
  const [moveWorkflowDialogOpen, setMoveWorkflowDialogOpen] = useState(false)
  const [selectedWorkflowForMove, setSelectedWorkflowForMove] = useState<string | null>(null)
  const [targetFolderForMove, setTargetFolderForMove] = useState<string | null>(null)

  const [newFolderName, setNewFolderName] = useState("")
  const [newFolderDescription, setNewFolderDescription] = useState("")
  const [newFolderParent, setNewFolderParent] = useState<string | null>(null)
  const [editFolderName, setEditFolderName] = useState("")
  const [editFolderDescription, setEditFolderDescription] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const [wRes] = await Promise.all([
          fetch("http://localhost:5000/workflows"),
        ]);
        if (!wRes.ok) throw new Error(`Fetch error`);
        const wData = await wRes.json();
        // map your workflows into the shape you already expect
        const mapped: WorkflowItem[] = wData.map((w: any) => ({
          id: w.id,
          name: w.name,
          description: w.description,
          type: w.type,
          updatedAt: w.lastRun || w.updatedAt || w.createdAt,
          createdAt: w.createdAt,       // make sure we carry this through
          folderId: w.folder            // folderId is the literal folder name
        }));
        setWorkflows(mapped);
  
        // now generate folders _from_ those workflows:
        const folderMap: Record<string, Folder> = {};
        mapped.forEach((wf) => {
          const name = wf.folderId || "Unsorted";
          if (!folderMap[name]) {
            folderMap[name] = {
              id: name,                   // **use the name** so it lines up
              name,
              description: "",
              workflows: 0,
              parent: null,
              createdAt: wf.createdAt,
              updatedAt: wf.updatedAt,
            };
          }
          const f = folderMap[name];
          f.workflows += 1;
          // keep track of earliest createdAt / latest updatedAt
          if (new Date(wf.createdAt) < new Date(f.createdAt)) f.createdAt = wf.createdAt;
          if (new Date(wf.updatedAt) > new Date(f.updatedAt))   f.updatedAt = wf.updatedAt;
        });
        setFolders(Object.values(folderMap));
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Handlers: wrap service calls as needed
  const handleCreateFolder = (name: string, description: string, parentId?: string) => {
    /* call POST /folders */
    toast({ title: "Folder Created", description: name })
  }
  const handleUpdateFolder = (id: string, name: string, description: string) => {
    /* call PUT /folders/:id */
    toast({ title: "Folder Updated", description: name })
  }
  const handleDeleteFolder = (id: string) => {
    /* call DELETE /folders/:id */
    toast({ title: "Folder Deleted" })
  }
  const handleMoveWorkflow = (workflowId: string, folderId: string) => {
    /* call PATCH /workflows/:workflowId/move */
    toast({ title: "Workflow Moved" })
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p className="text-red-500">Error: {error}</p>

  // Filter logic
  const filteredFolders = searchQuery
    ? folders.filter(
        (f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : folders

  const filteredWorkflows = searchQuery
    ? workflows.filter(
        (w) => w.name.toLowerCase().includes(searchQuery.toLowerCase()) || w.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : workflows

  const topLevelFolders = filteredFolders.filter((f) => f.parent === null)
  const getChildFolders = (parentId: string) => filteredFolders.filter((f) => f.parent === parentId)
  const getFolderWorkflows = (folderId: string) => filteredWorkflows.filter((w) => w.folderId === folderId)

  const renderFolder = (folder: Folder) => {
    const childFolders = getChildFolders(folder.id)
    const folderWorkflows = getFolderWorkflows(folder.id)
    return (
      <div key={folder.id} className="mb-4">
        <div
          className="flex items-center justify-between p-3 rounded-md border hover:bg-accent cursor-pointer"
          onClick={() => setSelectedFolder(folder.id)}
        >
          <div className="flex items-center gap-2">
            <FolderTree className="h-5 w-5 text-[#007A33]" />
            <div>
              <div className="font-medium">{folder.name}</div>
              <div className="text-xs text-muted-foreground">{folder.description}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{folder.workflows}</Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => { setSelectedFolder(folder.id); setEditFolderName(folder.name); setEditFolderDescription(folder.description); setEditFolderDialogOpen(true) }}>
                  <FolderEdit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setNewFolderParent(folder.id); setNewFolderDialogOpen(true) }}>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Subfolder
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { setSelectedFolder(folder.id); setDeleteFolderDialogOpen(true) }} className="text-red-500">
                  <FolderX className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {childFolders.length > 0 && <div className="ml-6 mt-2 border-l pl-4">{childFolders.map(renderFolder)}</div>}
        {folderWorkflows.length > 0 && (
          <div className="ml-6 mt-2 border-l pl-4 space-y-2">
            {folderWorkflows.map((wf) => (
              <div
                key={wf.id}
                className="flex items-center justify-between p-2 rounded-md border hover:bg-accent cursor-pointer"
                onClick={() => toast({ title: wf.name })}
              >
                <div className="flex items-center gap-2">
                  {wf.type === "ai" ? <Bot className="h-4 w-4 text-cyan-500" /> : <WorkflowIcon className="h-4 w-4 text-blue-500" />}
                  <div>
                    <div className="text-sm font-medium">{wf.name}</div>
                    <div className="text-xs text-muted-foreground">Updated: {wf.updatedAt}</div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { setSelectedWorkflowForMove(wf.id); setMoveWorkflowDialogOpen(true) }}>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Move
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Folder Management</h2>
        <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
          <DialogTrigger asChild>
            <Button><FolderPlus className="h-4 w-4 mr-2" />New Folder</Button>
          </DialogTrigger>
          <DialogContent>
            {/* New folder form... */}
          </DialogContent>
        </Dialog>
      </div>
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search folders and workflows..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">{topLevelFolders.map(renderFolder)}</div>
      </ScrollArea>
      {/* Edit, Delete, Move dialogs... */}
    </div>
  )
}

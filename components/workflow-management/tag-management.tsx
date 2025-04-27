"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tag, Plus, Edit, Trash2, MoreHorizontal, Search, Workflow, Bot, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface TagItem {
  id: string
  name: string
  color: string
  workflows: number
  createdAt: string
}

interface WorkflowItem {
  id: string
  name: string
  description: string
  type: "standard" | "ai"
  updatedAt: string
  tags: string[]
}

export default function TagManagement() {
  // Add local state and handlers
  const handleCreateTag = (name: string, color: string) => {
    console.log(`Creating tag ${name}`)
  }

  const handleUpdateTag = (id: string, name: string, color: string) => {
    console.log(`Updating tag ${id}`)
  }

  const handleDeleteTag = (id: string) => {
    console.log(`Deleting tag ${id}`)
  }

  const handleAddTagToWorkflow = (workflowId: string, tagId: string) => {
    console.log(`Adding tag ${tagId} to workflow ${workflowId}`)
  }

  const handleRemoveTagFromWorkflow = (workflowId: string, tagId: string) => {
    console.log(`Removing tag ${tagId} from workflow ${workflowId}`)
  }

  const handleSelectTag = (tagId: string) => {
    console.log(`Selected tag ${tagId}`)
  }

  const handleSelectWorkflow = (workflowId: string) => {
    console.log(`Selected workflow ${workflowId}`)
  }

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [newTagDialogOpen, setNewTagDialogOpen] = useState(false)
  const [editTagDialogOpen, setEditTagDialogOpen] = useState(false)
  const [deleteTagDialogOpen, setDeleteTagDialogOpen] = useState(false)
  const [addTagToWorkflowDialogOpen, setAddTagToWorkflowDialogOpen] = useState(false)
  const [selectedWorkflowForTag, setSelectedWorkflowForTag] = useState<string | null>(null)
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("#007A33")
  const [editTagName, setEditTagName] = useState("")
  const [editTagColor, setEditTagColor] = useState("")

  // Predefined colors
  const tagColors = [
    "#007A33", // Nedbank green
    "#0ea5e9", // sky blue
    "#f59e0b", // amber
    "#10b981", // emerald
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#ef4444", // red
    "#6b7280", // gray
  ]

  // Mock data - would come from API in real app
  const tags: TagItem[] = [
    {
      id: "t1",
      name: "Production",
      color: "#007A33",
      workflows: 7,
      createdAt: "2023-05-10",
    },
    {
      id: "t2",
      name: "Development",
      color: "#0ea5e9",
      workflows: 4,
      createdAt: "2023-05-12",
    },
    {
      id: "t3",
      name: "Automated",
      color: "#f59e0b",
      workflows: 6,
      createdAt: "2023-05-15",
    },
    {
      id: "t4",
      name: "Manual",
      color: "#10b981",
      workflows: 3,
      createdAt: "2023-05-20",
    },
    {
      id: "t5",
      name: "Critical",
      color: "#ef4444",
      workflows: 2,
      createdAt: "2023-05-25",
    },
    {
      id: "t6",
      name: "AI",
      color: "#8b5cf6",
      workflows: 4,
      createdAt: "2023-05-28",
    },
  ]

  const workflows: WorkflowItem[] = [
    {
      id: "w1",
      name: "Customer Onboarding",
      description: "Process new customer applications and send welcome emails",
      type: "standard",
      updatedAt: "2023-06-15",
      tags: ["t1", "t3"],
    },
    {
      id: "w2",
      name: "Transaction Monitoring",
      description: "Monitor transactions for suspicious activity",
      type: "standard",
      updatedAt: "2023-06-14",
      tags: ["t1", "t3", "t5"],
    },
    {
      id: "w3",
      name: "Account Reconciliation",
      description: "Daily account reconciliation process",
      type: "standard",
      updatedAt: "2023-06-10",
      tags: ["t1", "t3"],
    },
    {
      id: "w4",
      name: "AI Data Processing",
      description: "Process data from Google Sheets using AI models",
      type: "ai",
      updatedAt: "2023-06-20",
      tags: ["t2", "t6"],
    },
    {
      id: "w5",
      name: "Customer Support AI",
      description: "AI-powered customer support response generation",
      type: "ai",
      updatedAt: "2023-06-18",
      tags: ["t1", "t6"],
    },
    {
      id: "w6",
      name: "Email Campaign",
      description: "Automated email campaign workflow",
      type: "standard",
      updatedAt: "2023-06-05",
      tags: ["t2", "t4"],
    },
  ]

  // Filter tags and workflows based on search query
  const filteredTags = searchQuery
    ? tags.filter((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : tags

  const filteredWorkflows = searchQuery
    ? workflows.filter(
        (workflow) =>
          workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workflow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workflow.tags.some((tagId) => {
            const tag = tags.find((t) => t.id === tagId)
            return tag?.name.toLowerCase().includes(searchQuery.toLowerCase())
          }),
      )
    : workflows

  // Get workflows for a tag
  const getTagWorkflows = (tagId: string) => {
    return filteredWorkflows.filter((workflow) => workflow.tags.includes(tagId))
  }

  // Get tags for a workflow
  const getWorkflowTags = (workflowId: string) => {
    const workflow = workflows.find((w) => w.id === workflowId)
    if (!workflow) return []
    return workflow.tags.map((tagId) => tags.find((t) => t.id === tagId)).filter(Boolean) as TagItem[]
  }

  // Get available tags for a workflow (tags that are not already assigned)
  const getAvailableTagsForWorkflow = (workflowId: string) => {
    const workflow = workflows.find((w) => w.id === workflowId)
    if (!workflow) return []
    return tags.filter((tag) => !workflow.tags.includes(tag.id))
  }

  const handleCreateTagLocal = () => {
    if (newTagName.trim()) {
      handleCreateTag(newTagName, newTagColor)
      setNewTagDialogOpen(false)
      setNewTagName("")
      setNewTagColor("#007A33")
      toast({
        title: "Tag Created",
        description: `Tag "${newTagName}" created successfully`,
      })
    }
  }

  const handleEditTagLocal = () => {
    if (selectedTag && editTagName.trim()) {
      handleUpdateTag(selectedTag, editTagName, editTagColor)
      setEditTagDialogOpen(false)
      setEditTagName("")
      setEditTagColor("")
      toast({
        title: "Tag Updated",
        description: `Tag "${editTagName}" updated successfully`,
      })
    }
  }

  const handleDeleteTagLocal = () => {
    if (selectedTag) {
      const tag = tags.find((t) => t.id === selectedTag)
      handleDeleteTag(selectedTag)
      setDeleteTagDialogOpen(false)
      setSelectedTag(null)
      toast({
        title: "Tag Deleted",
        description: `Tag "${tag?.name}" deleted successfully`,
      })
    }
  }

  const handleAddTagToWorkflowLocal = (workflowId: string, tagId: string) => {
    handleAddTagToWorkflow(workflowId, tagId)
    const workflow = workflows.find((w) => w.id === workflowId)
    const tag = tags.find((t) => t.id === tagId)
    toast({
      title: "Tag Added",
      description: `Tag "${tag?.name}" added to "${workflow?.name}"`,
    })
  }

  const handleRemoveTagFromWorkflowLocal = (workflowId: string, tagId: string) => {
    handleRemoveTagFromWorkflow(workflowId, tagId)
    const workflow = workflows.find((w) => w.id === workflowId)
    const tag = tags.find((t) => t.id === tagId)
    toast({
      title: "Tag Removed",
      description: `Tag "${tag?.name}" removed from "${workflow?.name}"`,
    })
  }

  const handleSelectEditTag = (tag: TagItem) => {
    setSelectedTag(tag.id)
    setEditTagName(tag.name)
    setEditTagColor(tag.color)
    setEditTagDialogOpen(true)
  }

  const handleSelectDeleteTag = (tagId: string) => {
    setSelectedTag(tagId)
    setDeleteTagDialogOpen(true)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Tag Management</h2>
        <Dialog open={newTagDialogOpen} onOpenChange={setNewTagDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Tag</DialogTitle>
              <DialogDescription>Create a new tag to categorize your workflows.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="tag-name">Tag Name</Label>
                <Input
                  id="tag-name"
                  placeholder="My Tag"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Tag Color</Label>
                <div className="flex flex-wrap gap-2">
                  {tagColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full ${newTagColor === color ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewTagColor(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewTagDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTagLocal} disabled={!newTagName.trim()}>
                Create Tag
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tags and workflows..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Tags</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-3 rounded-md border hover:bg-accent cursor-pointer"
                  onClick={() => handleSelectTag(tag.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tag.color }} />
                    <div>
                      <div className="font-medium">{tag.name}</div>
                      <div className="text-xs text-muted-foreground">{tag.workflows} workflows</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleSelectEditTag(tag)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Tag
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleSelectDeleteTag(tag.id)}
                          className="text-red-500 focus:text-red-500"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Tag
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Workflows</h3>
            <div className="space-y-3">
              {filteredWorkflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="flex flex-col p-3 rounded-md border hover:bg-accent cursor-pointer"
                  onClick={() => handleSelectWorkflow(workflow.id)}
                >
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedWorkflowForTag(workflow.id)
                        setAddTagToWorkflowDialogOpen(true)
                      }}
                    >
                      <Tag className="h-4 w-4 mr-1" />
                      Manage Tags
                    </Button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {getWorkflowTags(workflow.id).map((tag) => (
                      <Badge
                        key={tag.id}
                        className="flex items-center gap-1"
                        style={{
                          backgroundColor: `${tag.color}20`,
                          color: tag.color,
                          borderColor: `${tag.color}40`,
                        }}
                      >
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
                        {tag.name}
                        <button
                          className="ml-1 hover:bg-background/20 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveTagFromWorkflowLocal(workflow.id, tag.id)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Edit Tag Dialog */}
      <Dialog open={editTagDialogOpen} onOpenChange={setEditTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>Update tag details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-tag-name">Tag Name</Label>
              <Input id="edit-tag-name" value={editTagName} onChange={(e) => setEditTagName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Tag Color</Label>
              <div className="flex flex-wrap gap-2">
                {tagColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded-full ${editTagColor === color ? "ring-2 ring-offset-2 ring-primary" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setEditTagColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTagDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTagLocal} disabled={!editTagName.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Tag Dialog */}
      <Dialog open={deleteTagDialogOpen} onOpenChange={setDeleteTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tag</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this tag? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              This tag will be removed from all workflows it is currently assigned to.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTagDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTagLocal}>
              Delete Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Tag to Workflow Dialog */}
      <Dialog open={addTagToWorkflowDialogOpen} onOpenChange={setAddTagToWorkflowDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Tags</DialogTitle>
            <DialogDescription>Add or remove tags for this workflow.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <h4 className="text-sm font-medium mb-2">Current Tags</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedWorkflowForTag &&
                getWorkflowTags(selectedWorkflowForTag).map((tag) => (
                  <Badge
                    key={tag.id}
                    className="flex items-center gap-1"
                    style={{
                      backgroundColor: `${tag.color}20`,
                      color: tag.color,
                      borderColor: `${tag.color}40`,
                    }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
                    {tag.name}
                    <button
                      className="ml-1 hover:bg-background/20 rounded-full"
                      onClick={() => handleRemoveTagFromWorkflowLocal(selectedWorkflowForTag, tag.id)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              {selectedWorkflowForTag && getWorkflowTags(selectedWorkflowForTag).length === 0 && (
                <p className="text-sm text-muted-foreground">No tags assigned yet.</p>
              )}
            </div>

            <h4 className="text-sm font-medium mb-2">Available Tags</h4>
            <div className="flex flex-wrap gap-2">
              {selectedWorkflowForTag &&
                getAvailableTagsForWorkflow(selectedWorkflowForTag).map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="flex items-center gap-1 cursor-pointer"
                    style={{
                      color: tag.color,
                      borderColor: `${tag.color}40`,
                    }}
                    onClick={() => handleAddTagToWorkflowLocal(selectedWorkflowForTag, tag.id)}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }} />
                    {tag.name}
                    <Plus className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              {selectedWorkflowForTag && getAvailableTagsForWorkflow(selectedWorkflowForTag).length === 0 && (
                <p className="text-sm text-muted-foreground">All available tags have been assigned.</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setAddTagToWorkflowDialogOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

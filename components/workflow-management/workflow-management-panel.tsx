"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FolderTree, Tag, Link2 } from "lucide-react"
import FolderManagement from "@/components/workflow-management/folder-management"
import TagManagement from "@/components/workflow-management/tag-management"
import WorkflowDependencies from "@/components/workflow-management/workflow-dependencies"

interface WorkflowManagementPanelProps {
  onSelectWorkflow: (workflowId: string) => void
}

export default function WorkflowManagementPanel({ onSelectWorkflow }: WorkflowManagementPanelProps) {
  const [activeTab, setActiveTab] = useState("folders")

  const handleCreateFolder = (name: string, description: string, parentId: string | null) => {
    // In a real app, this would call an API to create a new folder
    console.log(`Creating folder ${name} with parent ${parentId}`)
  }

  const handleUpdateFolder = (id: string, name: string, description: string) => {
    // In a real app, this would call an API to update a folder
    console.log(`Updating folder ${id} to ${name}`)
  }

  const handleDeleteFolder = (id: string) => {
    // In a real app, this would call an API to delete a folder
    console.log(`Deleting folder ${id}`)
  }

  const handleMoveWorkflow = (workflowId: string, folderId: string) => {
    // In a real app, this would call an API to move a workflow to a different folder
    console.log(`Moving workflow ${workflowId} to folder ${folderId}`)
  }

  const handleSelectFolder = (folderId: string) => {
    // In a real app, this would navigate to the folder or filter workflows by folder
    console.log(`Selected folder ${folderId}`)
  }

  const handleCreateTag = (name: string, color: string) => {
    // In a real app, this would call an API to create a new tag
    console.log(`Creating tag ${name} with color ${color}`)
  }

  const handleUpdateTag = (id: string, name: string, color: string) => {
    // In a real app, this would call an API to update a tag
    console.log(`Updating tag ${id} to ${name} with color ${color}`)
  }

  const handleDeleteTag = (id: string) => {
    // In a real app, this would call an API to delete a tag
    console.log(`Deleting tag ${id}`)
  }

  const handleAddTagToWorkflow = (workflowId: string, tagId: string) => {
    // In a real app, this would call an API to add a tag to a workflow
    console.log(`Adding tag ${tagId} to workflow ${workflowId}`)
  }

  const handleRemoveTagFromWorkflow = (workflowId: string, tagId: string) => {
    // In a real app, this would call an API to remove a tag from a workflow
    console.log(`Removing tag ${tagId} from workflow ${workflowId}`)
  }

  const handleSelectTag = (tagId: string) => {
    // In a real app, this would navigate to the tag or filter workflows by tag
    console.log(`Selected tag ${tagId}`)
  }

  const handleAddDependency = (workflowId: string, dependencyId: string) => {
    // In a real app, this would call an API to add a dependency to a workflow
    console.log(`Adding dependency ${dependencyId} to workflow ${workflowId}`)
  }

  const handleRemoveDependency = (workflowId: string, dependencyId: string) => {
    // In a real app, this would call an API to remove a dependency from a workflow
    console.log(`Removing dependency ${dependencyId} from workflow ${workflowId}`)
  }

  const handleAddSubworkflow = (workflowId: string, subworkflowId: string) => {
    // In a real app, this would call an API to add a subworkflow to a workflow
    console.log(`Adding subworkflow ${subworkflowId} to workflow ${workflowId}`)
  }

  const handleRemoveSubworkflow = (workflowId: string, subworkflowId: string) => {
    // In a real app, this would call an API to remove a subworkflow from a workflow
    console.log(`Removing subworkflow ${subworkflowId} from workflow ${workflowId}`)
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="folders" className="flex items-center gap-1">
              <FolderTree className="h-4 w-4" />
              <span>Folders</span>
            </TabsTrigger>
            <TabsTrigger value="tags" className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              <span>Tags</span>
            </TabsTrigger>
            <TabsTrigger value="dependencies" className="flex items-center gap-1">
              <Link2 className="h-4 w-4" />
              <span>Dependencies</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="folders" className="flex-1 pt-0">
          <FolderManagement
            onCreateFolder={handleCreateFolder}
            onUpdateFolder={handleUpdateFolder}
            onDeleteFolder={handleDeleteFolder}
            onMoveWorkflow={handleMoveWorkflow}
            onSelectFolder={handleSelectFolder}
            onSelectWorkflow={onSelectWorkflow}
          />
        </TabsContent>

        <TabsContent value="tags" className="flex-1 pt-0">
          <TagManagement
            onCreateTag={handleCreateTag}
            onUpdateTag={handleUpdateTag}
            onDeleteTag={handleDeleteTag}
            onAddTagToWorkflow={handleAddTagToWorkflow}
            onRemoveTagFromWorkflow={handleRemoveTagFromWorkflow}
            onSelectTag={handleSelectTag}
            onSelectWorkflow={onSelectWorkflow}
          />
        </TabsContent>

        <TabsContent value="dependencies" className="flex-1 pt-0">
          <WorkflowDependencies
            onAddDependency={handleAddDependency}
            onRemoveDependency={handleRemoveDependency}
            onAddSubworkflow={handleAddSubworkflow}
            onRemoveSubworkflow={handleRemoveSubworkflow}
            onSelectWorkflow={onSelectWorkflow}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { History, ArrowLeft, ArrowRight, RotateCcw, GitBranch, GitMerge, Save, Clock } from "lucide-react"

interface VersionHistoryProps {
  workflowId: string
  workflowName: string
  onRestore: (versionId: string) => void
  onCompare: (versionId1: string, versionId2: string) => void
}

export default function VersionHistory({ workflowId, workflowName, onRestore, onCompare }: VersionHistoryProps) {
  const [open, setOpen] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)
  const [compareVersion, setCompareVersion] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("history")

  // Mock data - would come from API in real app
  const versions = [
    {
      id: "v10",
      number: "1.0",
      createdAt: "2023-06-15 14:30",
      author: "John Doe",
      changes: "Initial version",
      isCurrent: true,
    },
    {
      id: "v9",
      number: "0.9",
      createdAt: "2023-06-14 16:45",
      author: "Jane Smith",
      changes: "Added error handling to transaction monitoring",
    },
    {
      id: "v8",
      number: "0.8",
      createdAt: "2023-06-13 11:20",
      author: "John Doe",
      changes: "Implemented AI data processing node",
    },
    {
      id: "v7",
      number: "0.7",
      createdAt: "2023-06-12 09:15",
      author: "Sarah Johnson",
      changes: "Added email notification step",
    },
    {
      id: "v6",
      number: "0.6",
      createdAt: "2023-06-10 15:30",
      author: "John Doe",
      changes: "Fixed conditional logic bug",
    },
  ]

  const branches = [
    {
      id: "main",
      name: "main",
      lastUpdated: "2023-06-15 14:30",
      author: "John Doe",
      isCurrent: true,
    },
    {
      id: "feature-ai",
      name: "feature/ai-integration",
      lastUpdated: "2023-06-13 11:20",
      author: "John Doe",
    },
    {
      id: "experimental",
      name: "experimental",
      lastUpdated: "2023-06-10 15:30",
      author: "Sarah Johnson",
    },
  ]

  const handleRestore = () => {
    if (selectedVersion) {
      onRestore(selectedVersion)
      setOpen(false)
    }
  }

  const handleCompare = () => {
    if (selectedVersion && compareVersion) {
      onCompare(selectedVersion, compareVersion)
      setOpen(false)
    }
  }

  const handleSelectVersion = (versionId: string) => {
    if (selectedVersion === versionId) {
      setSelectedVersion(null)
    } else {
      setSelectedVersion(versionId)
    }
  }

  const handleSelectCompareVersion = (versionId: string) => {
    if (compareVersion === versionId) {
      setCompareVersion(null)
    } else {
      setCompareVersion(versionId)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="h-4 w-4 mr-2" />
          Version History
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
          <DialogDescription>View and restore previous versions of "{workflowName}"</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="branches">Branches</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {selectedVersion && compareVersion ? (
                  <span>Comparing two versions</span>
                ) : selectedVersion ? (
                  <span>Select another version to compare</span>
                ) : (
                  <span>Select a version to restore or compare</span>
                )}
              </div>
              <div className="space-x-2">
                {selectedVersion && compareVersion && (
                  <Button size="sm" onClick={handleCompare}>
                    <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                    <ArrowRight className="h-3.5 w-3.5 mr-2" />
                    Compare
                  </Button>
                )}
                {selectedVersion && !compareVersion && (
                  <Button size="sm" onClick={handleRestore}>
                    <RotateCcw className="h-3.5 w-3.5 mr-2" />
                    Restore
                  </Button>
                )}
              </div>
            </div>

            <ScrollArea className="h-[400px] rounded-md border">
              <div className="p-4 space-y-4">
                {versions.map((version) => (
                  <div
                    key={version.id}
                    className={`p-3 rounded-md border ${
                      selectedVersion === version.id
                        ? "border-primary bg-primary/5"
                        : compareVersion === version.id
                          ? "border-blue-500 bg-blue-500/5"
                          : "hover:bg-accent"
                    } cursor-pointer transition-colors`}
                    onClick={() => {
                      if (selectedVersion && selectedVersion !== version.id) {
                        handleSelectCompareVersion(version.id)
                      } else {
                        handleSelectVersion(version.id)
                      }
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="font-medium">Version {version.number}</div>
                        {version.isCurrent && <Badge className="ml-2 bg-[#007A33]">Current</Badge>}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {version.createdAt}
                      </div>
                    </div>
                    <div className="text-sm mt-1">By {version.author}</div>
                    <div className="text-sm text-muted-foreground mt-2">{version.changes}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="branches" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Manage workflow branches</div>
              <Button size="sm">
                <GitBranch className="h-3.5 w-3.5 mr-2" />
                New Branch
              </Button>
            </div>

            <ScrollArea className="h-[400px] rounded-md border">
              <div className="p-4 space-y-4">
                {branches.map((branch) => (
                  <div
                    key={branch.id}
                    className="p-3 rounded-md border hover:bg-accent cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <GitBranch className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div className="font-medium">{branch.name}</div>
                        {branch.isCurrent && <Badge className="ml-2 bg-[#007A33]">Current</Badge>}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <GitMerge className="h-3.5 w-3.5 mr-1" />
                          Merge
                        </Button>
                        <Button size="sm" variant="outline">
                          <Save className="h-3.5 w-3.5 mr-1" />
                          Switch
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm mt-1">Last updated by {branch.author}</div>
                    <div className="text-sm text-muted-foreground mt-1">{branch.lastUpdated}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

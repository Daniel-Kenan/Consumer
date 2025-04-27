"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Clock, RotateCcw, GitCompare } from "lucide-react"

interface Version {
  id: string
  number: string
  createdAt: string
  author: string
  changes: string
  isCurrent: boolean
}

interface VersionHistoryPanelProps {
  workflowId: string
  workflowName: string
  onRestore: (versionId: string) => void
  onCompare: (versionId1: string, versionId2: string) => void
}

export default function VersionHistoryPanel({
  workflowId,
  workflowName,
  onRestore,
  onCompare,
}: VersionHistoryPanelProps) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)
  const [compareVersion, setCompareVersion] = useState<string | null>(null)

  // Mock data - would come from API in real app
  const versions: Version[] = [
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

  const handleRestoreVersion = () => {
    if (selectedVersion) {
      onRestore(selectedVersion)
    }
  }

  const handleCompareVersions = () => {
    if (selectedVersion && compareVersion) {
      onCompare(selectedVersion, compareVersion)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Version History</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Versions of "{workflowName}"</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCompareVersions} disabled={!selectedVersion}>
            <GitCompare className="h-3.5 w-3.5 mr-1.5" />
            Compare
          </Button>
          <Button size="sm" onClick={handleRestoreVersion} disabled={!selectedVersion}>
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Restore
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[350px] rounded-md border bg-background">
        <div className="divide-y">
          {versions.map((version) => (
            <div
              key={version.id}
              className={`px-4 py-3 hover:bg-accent/50 cursor-pointer transition-colors ${
                selectedVersion === version.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
              }`}
              onClick={() => setSelectedVersion(version.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="font-medium">Version {version.number}</div>
                  {version.isCurrent && (
                    <Badge className="ml-2 bg-[#007A33] text-white text-xs font-normal">Current</Badge>
                  )}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {version.createdAt}
                </div>
              </div>
              <div className="text-sm mt-1 text-muted-foreground">By {version.author}</div>
              <div className="text-sm mt-1.5 text-muted-foreground">{version.changes}</div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

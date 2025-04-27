"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Save } from "lucide-react"
import WorkflowEditor from "@/components/workflow-editor"

export default function CreateWorkflowPage() {
  const [workflowName, setWorkflowName] = useState("")
  const [workflowDescription, setWorkflowDescription] = useState("")

  return (
    <div className="flex flex-col h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="font-medium">Create New Workflow</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="grid gap-1">
              <Input
                id="name"
                placeholder="Workflow Name"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="h-9 w-[250px]"
              />
            </div>
            <div className="grid gap-1">
              <Textarea
                id="description"
                placeholder="Description"
                value={workflowDescription}
                onChange={(e) => setWorkflowDescription(e.target.value)}
                className="h-9 min-h-0 py-1.5 w-[350px] resize-none"
              />
            </div>
            <Button className="bg-[#007A33] hover:bg-[#006128] text-white">
              <Save className="mr-2 h-4 w-4" />
              Save Workflow
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <WorkflowEditor />
      </main>
    </div>
  )
}

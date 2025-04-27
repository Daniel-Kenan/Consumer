"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Save, History, Globe, Server, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import WorkflowEditor from "@/components/workflow-editor"
import WorkflowExecutions from "@/components/workflow-executions"
import WorkflowSettings from "@/components/workflow-settings"
import VersionControlPanel from "@/components/version-control/version-control-panel"
import ApiTriggerDialog from "@/components/api-trigger-dialog"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface WorkflowPageProps {
  params: {
    id: string
  }
}

export default function WorkflowPage({ params }: WorkflowPageProps) {
  const [workflowName, setWorkflowName] = useState("")
  const [workflowDescription, setWorkflowDescription] = useState("")
  const [activeTab, setActiveTab] = useState("editor")
  const [versionControlOpen, setVersionControlOpen] = useState(false)
  const [versionControlAnimating, setVersionControlAnimating] = useState(false)
  const [versionControlVisible, setVersionControlVisible] = useState(false)
  const [apiDialogOpen, setApiDialogOpen] = useState(false)
  const [currentEnvironment, setCurrentEnvironment] = useState("development")

  // Define environment colors and labels
  const environmentConfig = {
    development: { color: "bg-blue-500", label: "Development", shortLabel: "DEV" },
    ete: { color: "bg-purple-500", label: "End-to-End Testing", shortLabel: "ETE" },
    qa: { color: "bg-amber-500", label: "Quality Assurance", shortLabel: "QA" },
    production: { color: "bg-green-600", label: "Production", shortLabel: "PROD" },
  }

  // In a real app, we would fetch the workflow data from an API
  useEffect(() => {
    // Simulate API call
    const mockWorkflows = [
      {
        id: "1",
        name: "Customer Onboarding",
        description: "Process new customer applications and send welcome emails",
      },
      {
        id: "2",
        name: "Transaction Monitoring",
        description: "Monitor transactions for suspicious activity",
      },
      {
        id: "3",
        name: "Account Reconciliation",
        description: "Daily account reconciliation process",
      },
    ]

    const workflow = mockWorkflows.find((w) => w.id === params.id)
    if (workflow) {
      setWorkflowName(workflow.name)
      setWorkflowDescription(workflow.description)
    }
  }, [params.id])

  // Handle animation states for version control panel
  useEffect(() => {
    if (versionControlOpen) {
      setVersionControlVisible(true)
      setVersionControlAnimating(true)
      // Wait for animation to complete
      const timer = setTimeout(() => {
        setVersionControlAnimating(false)
      }, 400) // Match this with the CSS transition duration
      return () => clearTimeout(timer)
    } else {
      setVersionControlAnimating(true)
      // Wait for animation to complete before hiding
      const timer = setTimeout(() => {
        setVersionControlVisible(false)
        setVersionControlAnimating(false)
      }, 400) // Match this with the CSS transition duration
      return () => clearTimeout(timer)
    }
  }, [versionControlOpen])

  const toggleVersionControl = () => {
    setVersionControlOpen(!versionControlOpen)
  }

  // Render environment badge
  const renderEnvironmentBadge = (environment: string) => {
    const config = environmentConfig[environment as keyof typeof environmentConfig] || {
      color: "bg-gray-500",
      label: environment,
      shortLabel: environment.toUpperCase(),
    }

    return <Badge className={`${config.color} text-white`}>{config.shortLabel}</Badge>
  }

  // Replace the main div with the following:
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="font-medium whitespace-nowrap">Edit Workflow</h1>
            <div className="flex items-center gap-2 ml-4">
              <Server className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Environment:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="link" className="p-0 h-auto text-sm font-medium ml-1 flex items-center">
                    {renderEnvironmentBadge(currentEnvironment)}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {Object.keys(environmentConfig).map((env) => (
                    <DropdownMenuItem key={env} onClick={() => setCurrentEnvironment(env)}>
                      {environmentConfig[env].label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setApiDialogOpen(true)}
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 border-blue-200 dark:border-blue-800"
            >
              <Globe className="h-4 w-4 mr-2" />
              API Access
            </Button>
            <Button className="bg-[#007A33] hover:bg-[#006128] text-white">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
            <Button
              variant={versionControlOpen ? "default" : "outline"}
              size="icon"
              onClick={toggleVersionControl}
              title="Version Control"
            >
              <History className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 overflow-hidden flex items-stretch h-[calc(100vh-4rem)] relative">
        <div className="flex-1 overflow-hidden flex">
          {/* Ensure the Tabs container uses flex-col so that its items stack from the top */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full">
            <TabsList className="workflow-tabs">
              <TabsTrigger value="editor" className="workflow-tab">
                Editor
              </TabsTrigger>
              <TabsTrigger value="executions" className="workflow-tab">
                Executions
              </TabsTrigger>
              <TabsTrigger value="settings" className="workflow-tab">
                Settings
              </TabsTrigger>
            </TabsList>
            <TabsContent value="editor" className="flex-1 overflow-hidden h-full">
              <WorkflowEditor />
            </TabsContent>
            <TabsContent value="executions" className="flex-1 p-6">
              <div className="container">
                <WorkflowExecutions />
              </div>
            </TabsContent>
            <TabsContent value="settings" className="flex-1 p-6">
              <div className="container">
                <WorkflowSettings />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Version control panel overlay */}
        {versionControlVisible && (
          <>
            {/* Backdrop overlay */}
            <div
              className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-400 ease-in-out ${
                versionControlOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              onClick={toggleVersionControl}
            />

            {/* Panel */}
            <div
              className={`absolute top-0 right-0 bottom-0 w-[400px] lg:w-1/3 border-l bg-background shadow-xl overflow-hidden flex flex-col z-50 transition-transform duration-400 ease-out ${
                versionControlOpen ? "translate-x-0" : "translate-x-full"
              }`}
              style={{
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <VersionControlPanel workflowId={params.id} workflowName={workflowName} />
            </div>
          </>
        )}
      </main>

      {/* API Trigger Dialog */}
      <ApiTriggerDialog
        isOpen={apiDialogOpen}
        onClose={() => setApiDialogOpen(false)}
        workflowId={params.id}
        workflowName={workflowName}
      />
    </div>
  )
}

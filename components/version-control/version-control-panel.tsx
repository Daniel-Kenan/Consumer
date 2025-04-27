"use client"

import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  History,
  GitBranch,
  GitMerge,
  Clock,
  GitCommit,
  GitCompare,
  ChevronRight,
  MoreHorizontal,
  Loader2,
  AlertCircle,
  FileJson,
  ChevronDown,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import VersionHistoryPanel from "@/components/version-control/version-history-panel"
import VersionComparison from "@/components/version-control/version-comparison"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useHotkeys } from "react-hotkeys-hook"
// Add these imports at the top of the file
import { Eye, Upload, Server, LoaderCircleIcon as Loader2Circle } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"

// Update the props interface to include environment-related functions
interface VersionControlPanelProps {
  workflowId: string
  workflowName: string
}

// Update the component to include environment management
export default function VersionControlPanel({ workflowId, workflowName }: VersionControlPanelProps) {
  const [activeTab, setActiveTab] = useState<"history" | "changes">("history")
  const [comparisonDialogOpen, setComparisonDialogOpen] = useState(false)
  const [compareVersions, setCompareVersions] = useState<{
    version1: { id: string; number: string; createdAt: string; author: string }
    version2: { id: string; number: string; createdAt: string; author: string }
  } | null>(null)
  const [commitDialogOpen, setCommitDialogOpen] = useState(false)
  const [hasUncommittedChanges, setHasUncommittedChanges] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [currentEnvironment, setCurrentEnvironment] = useState("development")
  const [environmentsDialogOpen, setEnvironmentsDialogOpen] = useState(false)
  const [deploymentInProgress, setDeploymentInProgress] = useState(false)
  const [deploymentProgress, setDeploymentProgress] = useState(0)
  const [deploymentStatus, setDeploymentStatus] = useState<string | null>(null)
  const [environmentOverviewOpen, setEnvironmentOverviewOpen] = useState(false)

  // Define environment colors and labels
  const environmentConfig = {
    development: { color: "bg-blue-500", label: "Development", shortLabel: "DEV" },
    ete: { color: "bg-purple-500", label: "End-to-End Testing", shortLabel: "ETE" },
    qa: { color: "bg-amber-500", label: "Quality Assurance", shortLabel: "QA" },
    production: { color: "bg-green-600", label: "Production", shortLabel: "PROD" },
  }

  // Mock environment data
  const environments = [
    {
      id: "development",
      name: "Development",
      currentVersion: "1.0",
      lastDeployed: "2023-06-15 14:30",
      status: "active",
      color: "bg-blue-500",
    },
    {
      id: "ete",
      name: "End-to-End Testing",
      currentVersion: "0.9",
      lastDeployed: "2023-06-14 16:45",
      status: "active",
      color: "bg-purple-500",
    },
    {
      id: "qa",
      name: "Quality Assurance",
      currentVersion: "0.7",
      lastDeployed: "2023-06-12 09:15",
      status: "active",
      color: "bg-amber-500",
    },
    {
      id: "production",
      name: "Production",
      currentVersion: "0.6",
      lastDeployed: "2023-06-10 15:30",
      status: "active",
      color: "bg-green-600",
    },
  ]

  // Add keyboard shortcuts
  useHotkeys("ctrl+alt+c", () => setCommitDialogOpen(true), { enableOnFormTags: true }, [])
  useHotkeys("ctrl+alt+e", () => setExportDialogOpen(true), { enableOnFormTags: true }, [])
  useHotkeys("ctrl+alt+d", () => setEnvironmentsDialogOpen(true), { enableOnFormTags: true }, [])

  // Simulate loading data
  useEffect(() => {
    const loadVersionControlData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800))
        // In a real app, this would be an API call to fetch version control data
        setIsLoading(false)
      } catch (err) {
        setError("Failed to load version control data. Please try again.")
        setIsLoading(false)
      }
    }

    loadVersionControlData()
  }, [workflowId])

  const handleRestore = useCallback((versionId: string) => {
    setIsLoading(true)
    // In a real app, this would call an API to restore the workflow to this version
    setTimeout(() => {
      console.log(`Restoring workflow to version ${versionId}`)
      toast({
        title: "Version Restored",
        description: `Workflow restored to version ${versionId}`,
      })
      setIsLoading(false)
    }, 800)
  }, [])

  const handleCompare = useCallback((versionId1: string, versionId2: string) => {
    setIsLoading(true)
    // Mock data for the comparison
    setTimeout(() => {
      const version1 = {
        id: versionId1,
        number: "0.8",
        createdAt: "2023-06-13 11:20",
        author: "John Doe",
      }

      const version2 = {
        id: versionId2,
        number: "1.0",
        createdAt: "2023-06-15 14:30",
        author: "John Doe",
      }

      setCompareVersions({ version1, version2 })
      setComparisonDialogOpen(true)
      setIsLoading(false)
    }, 600)
  }, [])

  const handleCommitChanges = useCallback(() => {
    setIsLoading(true)
    // In a real app, this would call an API to commit changes
    setTimeout(() => {
      console.log("Committing changes")
      setCommitDialogOpen(false)
      setHasUncommittedChanges(false)
      toast({
        title: "Changes Committed",
        description: "Your changes have been committed successfully",
      })
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleExportVersionHistory = useCallback(() => {
    setIsLoading(true)
    // In a real app, this would generate and download a version history report
    setTimeout(() => {
      console.log("Exporting version history")
      toast({
        title: "Version History Exported",
        description: "Version history has been exported successfully",
      })
      setExportDialogOpen(false)
      setIsLoading(false)
    }, 800)
  }, [])

  // Add function to handle deployment to environment
  const handleDeployToEnvironment = useCallback((versionId: string, environment: string) => {
    setDeploymentInProgress(true)
    setDeploymentProgress(0)
    setDeploymentStatus("Preparing deployment...")

    // Simulate deployment progress
    const interval = setInterval(() => {
      setDeploymentProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }

        // Update status based on progress
        if (prev === 0) {
          setDeploymentStatus("Validating workflow...")
        } else if (prev === 25) {
          setDeploymentStatus("Packaging workflow...")
        } else if (prev === 50) {
          setDeploymentStatus("Deploying to environment...")
        } else if (prev === 75) {
          setDeploymentStatus("Running tests...")
        } else if (prev >= 95) {
          setDeploymentStatus("Finalizing deployment...")
        }

        return prev + 5
      })
    }, 200)

    // Simulate deployment completion
    setTimeout(() => {
      clearInterval(interval)
      setDeploymentProgress(100)
      setDeploymentStatus("Deployment complete!")

      setTimeout(() => {
        setDeploymentInProgress(false)
        setDeploymentStatus(null)
        setCurrentEnvironment(environment)

        toast({
          title: "Deployment Successful",
          description: `Workflow deployed to ${environmentConfig[environment as keyof typeof environmentConfig]?.label || environment}`,
        })
      }, 1000)
    }, 5000)
  }, [])

  // Add function to view workflow in a specific environment
  const handleViewInEnvironment = useCallback((environment: string) => {
    setCurrentEnvironment(environment)

    toast({
      title: "Environment Switched",
      description: `Now viewing workflow in ${environmentConfig[environment as keyof typeof environmentConfig]?.label || environment}`,
    })
  }, [])

  if (error) {
    return (
      <div className="h-full flex flex-col bg-background border rounded-md shadow-sm p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" className="mt-4 mx-auto" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
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

  return (
    <div className="h-full flex flex-col bg-background border rounded-md shadow-sm">
      <div className="border-b bg-background">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <GitBranch className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Version Control</h2>
            {isLoading && <Loader2 className="ml-2 h-3.5 w-3.5 animate-spin text-muted-foreground" />}
          </div>

          <div className="flex items-center gap-2">
            {hasUncommittedChanges && (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200 mr-1">
                <Clock className="h-3 w-3 mr-1" />
                Uncommitted
              </Badge>
            )}

            <Button
              variant={hasUncommittedChanges ? "default" : "outline"}
              size="sm"
              onClick={() => setCommitDialogOpen(true)}
              disabled={isLoading}
              className={hasUncommittedChanges ? "bg-amber-500 hover:bg-amber-600 text-white" : ""}
            >
              <GitCommit className="h-3.5 w-3.5 mr-1.5" />
              Commit
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled={isLoading}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEnvironmentOverviewOpen(true)}>
                  <Server className="h-4 w-4 mr-2" />
                  Environments
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setExportDialogOpen(true)}>
                  <FileJson className="h-4 w-4 mr-2" />
                  Export History
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast({ title: "Creating branch..." })}>
                  <GitBranch className="h-4 w-4 mr-2" />
                  Create Branch
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast({ title: "Merging branch..." })}>
                  <GitMerge className="h-4 w-4 mr-2" />
                  Merge Branch
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast({ title: "Comparing versions..." })}>
                  <GitCompare className="h-4 w-4 mr-2" />
                  Compare Versions
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Branch and Environment Info */}
        <div className="px-5 py-2.5 bg-muted/30 flex items-center justify-between text-sm border-t">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <span className="text-muted-foreground">Branch:</span>
              <span className="font-medium ml-1.5">main</span>
            </div>

            <div className="flex items-center">
              <span className="text-muted-foreground">Environment:</span>
              <Button
                variant="link"
                className="p-0 h-auto font-medium ml-1.5 flex items-center"
                onClick={() => setEnvironmentsDialogOpen(true)}
              >
                {renderEnvironmentBadge(currentEnvironment)}
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Progress Bar */}
      {deploymentInProgress && (
        <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm font-medium text-blue-700 flex items-center">
              <Loader2Circle className="h-3.5 w-3.5 mr-2 animate-spin" />
              {deploymentStatus}
            </div>
            <div className="text-xs text-blue-700">{deploymentProgress}%</div>
          </div>
          <Progress value={deploymentProgress} className="h-1.5" />
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-5 pt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history" disabled={isLoading} className="py-2">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="changes" disabled={isLoading} className="py-2">
              <GitCompare className="h-4 w-4 mr-2" />
              Changes
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="history" className="flex-1 px-5 py-4">
          <VersionHistoryPanel
            workflowId={workflowId}
            workflowName={workflowName}
            onRestore={handleRestore}
            onCompare={handleCompare}
          />
        </TabsContent>

        <TabsContent value="changes" className="flex-1 px-5 py-4">
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">Modified Files</h3>
                <Badge variant="outline" className="bg-background">
                  {hasUncommittedChanges ? 3 : 0}
                </Badge>
              </div>

              {hasUncommittedChanges && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={handleCommitChanges}
                  disabled={isLoading}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {isLoading ? (
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <GitCommit className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  Commit Changes
                </Button>
              )}
            </div>

            <div className="border rounded-md flex-1 overflow-hidden bg-background">
              {hasUncommittedChanges ? (
                <div className="divide-y">
                  <div className="px-3 py-2.5 hover:bg-accent/50 flex items-center justify-between cursor-pointer transition-colors">
                    <div className="flex items-center">
                      <Badge className="mr-2.5 bg-amber-500/10 text-amber-600 border-amber-200">M</Badge>
                      <span className="font-medium text-sm">workflow-config.json</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="px-3 py-2.5 hover:bg-accent/50 flex items-center justify-between cursor-pointer transition-colors">
                    <div className="flex items-center">
                      <Badge className="mr-2.5 bg-green-500/10 text-green-600 border-green-200">A</Badge>
                      <span className="font-medium text-sm">email-template.html</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="px-3 py-2.5 hover:bg-accent/50 flex items-center justify-between cursor-pointer transition-colors">
                    <div className="flex items-center">
                      <Badge className="mr-2.5 bg-red-500/10 text-red-600 border-red-200">D</Badge>
                      <span className="font-medium text-sm">old-node-config.json</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  <p>No uncommitted changes</p>
                  <p className="text-sm mt-1">Make changes to your workflow to see them here</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Version Comparison Dialog */}
      <Dialog open={comparisonDialogOpen} onOpenChange={setComparisonDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          {compareVersions && (
            <VersionComparison
              version1={compareVersions.version1}
              version2={compareVersions.version2}
              onClose={() => setComparisonDialogOpen(false)}
              onRestore={handleRestore}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Commit Dialog */}
      <Dialog open={commitDialogOpen} onOpenChange={setCommitDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Commit Changes</h2>
              <p className="text-sm text-muted-foreground">Save your changes with a descriptive message</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="commit-message" className="text-sm font-medium">
                Commit Message
              </label>
              <textarea
                id="commit-message"
                className="w-full min-h-[100px] p-2 border rounded-md"
                placeholder="Describe your changes..."
              />
            </div>

            <div className="border rounded-md">
              <div className="bg-muted/50 p-2 border-b">
                <span className="text-sm font-medium">Files to be committed</span>
              </div>
              <div className="p-2 max-h-[200px] overflow-y-auto space-y-1">
                <div className="text-sm flex items-center">
                  <Badge className="mr-2 bg-amber-500/10 text-amber-600 border-amber-200">M</Badge>
                  <span>workflow-config.json</span>
                </div>
                <div className="text-sm flex items-center">
                  <Badge className="mr-2 bg-green-500/10 text-green-600 border-green-200">A</Badge>
                  <span>email-template.html</span>
                </div>
                <div className="text-sm flex items-center">
                  <Badge className="mr-2 bg-red-500/10 text-red-600 border-red-200">D</Badge>
                  <span>old-node-config.json</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCommitDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleCommitChanges} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <GitCommit className="h-4 w-4 mr-2" />}
                Commit Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Export Version History</h2>
              <p className="text-sm text-muted-foreground">Export your version history in various formats</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input type="radio" id="export-json" name="export-format" defaultChecked />
                <label htmlFor="export-json" className="text-sm font-medium">
                  JSON Format
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input type="radio" id="export-csv" name="export-format" />
                <label htmlFor="export-csv" className="text-sm font-medium">
                  CSV Format
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input type="radio" id="export-pdf" name="export-format" />
                <label htmlFor="export-pdf" className="text-sm font-medium">
                  PDF Report
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="export-range" className="text-sm font-medium">
                Date Range
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  id="export-from"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <span className="flex items-center">to</span>
                <input
                  type="date"
                  id="export-to"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setExportDialogOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleExportVersionHistory} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileJson className="h-4 w-4 mr-2" />}
                Export
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Environments Dialog */}
      <Dialog open={environmentsDialogOpen} onOpenChange={setEnvironmentsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Switch Environment</DialogTitle>
            <DialogDescription>
              Select an environment to view the workflow as it appears in that environment
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <RadioGroup
              value={currentEnvironment}
              onValueChange={(value) => {
                setCurrentEnvironment(value)
                setEnvironmentsDialogOpen(false)
                handleViewInEnvironment(value)
              }}
              className="space-y-2"
            >
              {environments.map((env) => (
                <div key={env.id} className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value={env.id} id={env.id} />
                  <Label htmlFor={env.id} className="flex items-center gap-2 w-full">
                    <div className={`h-3 w-3 rounded-full ${env.color}`}></div>
                    <div className="flex-1">
                      <div className="font-medium">{env.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Current version: {env.currentVersion} (Last deployed: {env.lastDeployed})
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEnvironmentsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Environment Overview Dialog */}
      <Dialog open={environmentOverviewOpen} onOpenChange={setEnvironmentOverviewOpen} className="sm:max-w-[700px]">
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Environment Overview</DialogTitle>
            <DialogDescription>View and manage workflow deployments across environments</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              {environments.map((env) => (
                <div key={env.id} className="border rounded-md overflow-hidden">
                  <div className={`${env.color} text-white p-3 flex justify-between items-center`}>
                    <div className="font-medium">{env.name}</div>
                    <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                      {env.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Current Version</div>
                        <div className="font-medium">{env.currentVersion}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Last Deployed</div>
                        <div className="font-medium">{env.lastDeployed}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setEnvironmentOverviewOpen(false)
                          setCurrentEnvironment(env.id)
                          handleViewInEnvironment(env.id)
                        }}
                      >
                        <Eye className="h-3.5 w-3.5 mr-2" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setEnvironmentOverviewOpen(false)
                          // This would open a deployment dialog in a real implementation
                          toast({
                            title: "Deployment",
                            description: `Preparing to deploy to ${env.name}...`,
                          })
                        }}
                      >
                        <Upload className="h-3.5 w-3.5 mr-2" />
                        Deploy
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setEnvironmentOverviewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, Calendar } from "lucide-react"
import Link from "next/link"

type Environment = "DEV" | "ETE" | "QA" | "PROD"

type Workflow = {
  id: string
  name: string
  description: string
  status: "active" | "inactive"
  lastRun: string
  createdAt: string
  type: "standard" | "ai"
  environment: Environment
  version: string
}

export default function EnvironmentPipelineView() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "1",
      name: "Customer Onboarding",
      description: "Process new customer applications and send welcome emails",
      status: "active",
      lastRun: "2 hours ago",
      createdAt: "2023-04-01",
      type: "standard",
      environment: "PROD",
      version: "1.2.0",
    },
    {
      id: "2",
      name: "Transaction Monitoring",
      description: "Monitor transactions for suspicious activity",
      status: "active",
      lastRun: "5 minutes ago",
      createdAt: "2023-03-15",
      type: "standard",
      environment: "QA",
      version: "2.0.1",
    },
    {
      id: "3",
      name: "Account Reconciliation",
      description: "Daily account reconciliation process",
      status: "inactive",
      lastRun: "1 day ago",
      createdAt: "2023-02-20",
      type: "standard",
      environment: "DEV",
      version: "0.9.5",
    },
    {
      id: "4",
      name: "AI Data Processing",
      description: "Process data from Google Sheets using AI models",
      status: "active",
      lastRun: "10 minutes ago",
      createdAt: "2023-05-10",
      type: "ai",
      environment: "ETE",
      version: "1.5.0",
    },
    {
      id: "5",
      name: "Customer Support AI",
      description: "AI-powered customer support response generation",
      status: "active",
      lastRun: "1 hour ago",
      createdAt: "2023-05-15",
      type: "ai",
      environment: "PROD",
      version: "2.1.0",
    },
    {
      id: "6",
      name: "Transaction Monitoring",
      description: "Monitor transactions for suspicious activity",
      status: "active",
      lastRun: "1 day ago",
      createdAt: "2023-03-15",
      type: "standard",
      environment: "DEV",
      version: "1.8.3",
    },
    {
      id: "7",
      name: "Transaction Monitoring",
      description: "Monitor transactions for suspicious activity",
      status: "active",
      lastRun: "12 hours ago",
      createdAt: "2023-03-15",
      type: "standard",
      environment: "ETE",
      version: "1.9.0",
    },
  ])

  // Group workflows by name to show their progression through environments
  const workflowsByName = workflows.reduce(
    (acc, workflow) => {
      if (!acc[workflow.name]) {
        acc[workflow.name] = []
      }
      acc[workflow.name].push(workflow)
      return acc
    },
    {} as Record<string, Workflow[]>,
  )

  // Get environment badge color
  const getEnvironmentColor = (env: Environment) => {
    switch (env) {
      case "DEV":
        return "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20 border-slate-500/20"
      case "ETE":
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20"
      case "QA":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20"
      case "PROD":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
    }
  }

  // Sort environments in the correct order
  const sortEnvironments = (a: Workflow, b: Workflow) => {
    const order: Record<Environment, number> = {
      DEV: 0,
      ETE: 1,
      QA: 2,
      PROD: 3,
    }
    return order[a.environment] - order[b.environment]
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Environment Pipeline</h2>

      {Object.entries(workflowsByName).map(([name, workflowVersions]) => (
        <Card key={name} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              {name}
              {workflowVersions.some((w) => w.type === "ai") && (
                <Badge
                  variant="outline"
                  className="bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20 border-cyan-500/20"
                >
                  <Bot className="h-3 w-3 mr-1" />
                  AI
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 overflow-x-auto pb-4">
              {/* Sort workflows by environment */}
              {workflowVersions.sort(sortEnvironments).map((workflow, index, array) => (
                <div key={workflow.id} className="flex items-center">
                  <div className="min-w-[200px]">
                    <div className="border rounded-md p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className={getEnvironmentColor(workflow.environment)}>
                          {workflow.environment}
                        </Badge>
                        <Badge variant="outline">v{workflow.version}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center mb-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        Last run: {workflow.lastRun}
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <Badge
                          variant={workflow.status === "active" ? "default" : "outline"}
                          className={workflow.status === "active" ? "bg-[#007A33] hover:bg-[#006128]" : ""}
                        >
                          {workflow.status}
                        </Badge>
                        <Link href={`/workflows/${workflow.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/* Add arrow between environments except for the last one */}
                  {index < array.length - 1 && <ArrowRight className="mx-2 text-muted-foreground" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EnvironmentPipelineView from "@/components/environment-pipeline-view"

export default function EnvironmentsPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Environment Management</h1>

      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline View</TabsTrigger>
          <TabsTrigger value="dev">Development</TabsTrigger>
          <TabsTrigger value="ete">End-to-End Testing</TabsTrigger>
          <TabsTrigger value="qa">Quality Assurance</TabsTrigger>
          <TabsTrigger value="prod">Production</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline">
          <EnvironmentPipelineView />
        </TabsContent>

        <TabsContent value="dev">
          <div className="border rounded-md p-6">
            <h2 className="text-xl font-semibold mb-4">Development Environment</h2>
            <p className="text-muted-foreground mb-4">
              This environment is used for initial development and testing of workflows. Workflows in this environment
              are not connected to production systems.
            </p>
            {/* We would include a filtered list of DEV workflows here */}
          </div>
        </TabsContent>

        <TabsContent value="ete">
          <div className="border rounded-md p-6">
            <h2 className="text-xl font-semibold mb-4">End-to-End Testing Environment</h2>
            <p className="text-muted-foreground mb-4">
              This environment is used for comprehensive testing of workflows across integrated systems. Workflows are
              tested with simulated data that mimics production scenarios.
            </p>
            {/* We would include a filtered list of ETE workflows here */}
          </div>
        </TabsContent>

        <TabsContent value="qa">
          <div className="border rounded-md p-6">
            <h2 className="text-xl font-semibold mb-4">Quality Assurance Environment</h2>
            <p className="text-muted-foreground mb-4">
              This environment is used for final validation before production deployment. Workflows undergo rigorous
              testing by QA teams to ensure they meet all requirements.
            </p>
            {/* We would include a filtered list of QA workflows here */}
          </div>
        </TabsContent>

        <TabsContent value="prod">
          <div className="border rounded-md p-6">
            <h2 className="text-xl font-semibold mb-4">Production Environment</h2>
            <p className="text-muted-foreground mb-4">
              This is the live environment where workflows process real data and interact with production systems.
              Changes to workflows in this environment require approval and follow strict change management procedures.
            </p>
            {/* We would include a filtered list of PROD workflows here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

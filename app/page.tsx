import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, FolderTree, Tag, Link2 } from "lucide-react"
import WorkflowList from "@/components/workflow-list"
import { ModeToggle } from "@/components/mode-toggle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FolderManagement from "@/components/workflow-management/folder-management"
import TagManagement from "@/components/workflow-management/tag-management"
import WorkflowDependencies from "@/components/workflow-management/workflow-dependencies"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              
              <span className="font-bold">Nedflow</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                Documentation
              </Button>
              <Button variant="ghost" size="sm">
                Settings
              </Button>
              <ModeToggle />
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Workflow Management</h1>
            <Link href="/workflows/create">
              <Button className="bg-[#007A33] hover:bg-[#006128] text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Workflow
              </Button>
            </Link>
          </div>

          <Tabs defaultValue="workflows" className="space-y-4">
            <TabsList>
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
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

            <TabsContent value="workflows" className="space-y-4">
              <WorkflowList />
            </TabsContent>

            <TabsContent value="folders" className="border rounded-md min-h-[500px]">
              <FolderManagement />
            </TabsContent>

            <TabsContent value="tags" className="border rounded-md min-h-[500px]">
              <TagManagement />
            </TabsContent>

            <TabsContent value="dependencies" className="border rounded-md min-h-[500px]">
              <WorkflowDependencies />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="border-t py-4">
        <div className="container flex items-center justify-between">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Flow. All rights reserved.</p>
          <p className="text-sm text-muted-foreground">Powered by Next.js</p>
        </div>
      </footer>
    </div>
  )
}

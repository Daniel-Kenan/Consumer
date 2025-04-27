"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, FolderTree, Clock, Star, Tag, Settings, PlusCircle, Users, History, Trash2, Bot } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

interface WorkflowSidebarProps {
  activeWorkflowId?: string
}

export default function WorkflowSidebar({ activeWorkflowId }: WorkflowSidebarProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data - would come from API in real app
  const recentWorkflows = [
    { id: "1", name: "Customer Onboarding", updatedAt: "2 hours ago", type: "standard" },
    { id: "2", name: "Transaction Monitoring", updatedAt: "5 minutes ago", type: "standard" },
    { id: "4", name: "AI Data Processing", updatedAt: "10 minutes ago", type: "ai" },
  ]

  const starredWorkflows = [
    { id: "1", name: "Customer Onboarding", updatedAt: "2 hours ago", type: "standard" },
    { id: "5", name: "Customer Support AI", updatedAt: "1 hour ago", type: "ai" },
  ]

  const folders = [
    { id: "f1", name: "Banking", count: 5 },
    { id: "f2", name: "Customer Service", count: 3 },
    { id: "f3", name: "Marketing", count: 2 },
    { id: "f4", name: "AI Workflows", count: 4 },
  ]

  const tags = [
    { id: "t1", name: "Production", count: 7 },
    { id: "t2", name: "Development", count: 4 },
    { id: "t3", name: "Automated", count: 6 },
    { id: "t4", name: "Manual", count: 3 },
  ]

  const filteredRecent = searchQuery
    ? recentWorkflows.filter((w) => w.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : recentWorkflows

  const filteredStarred = searchQuery
    ? starredWorkflows.filter((w) => w.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : starredWorkflows

  const filteredFolders = searchQuery
    ? folders.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : folders

  const filteredTags = searchQuery ? tags.filter((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase())) : tags

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 bg-[#007A33] rounded-sm" />
              <span className="font-bold">FlowBank</span>
            </div>
            <ModeToggle />
          </div>
          <div className="px-4 pb-2">
            <Button
              className="w-full bg-[#007A33] hover:bg-[#006128] text-white"
              onClick={() => router.push("/workflows/create")}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Workflow
            </Button>
          </div>
          <div className="p-4 pt-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <SidebarInput
                placeholder="Search workflows..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <ScrollArea className="h-full">
            <SidebarGroup>
              <SidebarGroupLabel>
                <Clock className="h-4 w-4 mr-2" />
                Recent
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredRecent.map((workflow) => (
                    <SidebarMenuItem key={workflow.id}>
                      <SidebarMenuButton asChild isActive={workflow.id === activeWorkflowId}>
                        <a href={`/workflows/${workflow.id}`} className="flex items-center justify-between w-full">
                          <span className="truncate">{workflow.name}</span>
                          {workflow.type === "ai" && (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20 border-cyan-500/20"
                            >
                              <Bot className="h-3 w-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>
                <Star className="h-4 w-4 mr-2" />
                Starred
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredStarred.map((workflow) => (
                    <SidebarMenuItem key={workflow.id}>
                      <SidebarMenuButton asChild isActive={workflow.id === activeWorkflowId}>
                        <a href={`/workflows/${workflow.id}`} className="flex items-center justify-between w-full">
                          <span className="truncate">{workflow.name}</span>
                          {workflow.type === "ai" && (
                            <Badge
                              variant="outline"
                              className="ml-2 bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20 border-cyan-500/20"
                            >
                              <Bot className="h-3 w-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>
                <FolderTree className="h-4 w-4 mr-2" />
                Folders
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredFolders.map((folder) => (
                    <SidebarMenuItem key={folder.id}>
                      <SidebarMenuButton asChild>
                        <a href={`/folders/${folder.id}`} className="flex items-center justify-between w-full">
                          <span className="truncate">{folder.name}</span>
                          <Badge variant="outline" className="ml-2">
                            {folder.count}
                          </Badge>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>
                <Tag className="h-4 w-4 mr-2" />
                Tags
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredTags.map((tag) => (
                    <SidebarMenuItem key={tag.id}>
                      <SidebarMenuButton asChild>
                        <a href={`/tags/${tag.id}`} className="flex items-center justify-between w-full">
                          <span className="truncate">{tag.name}</span>
                          <Badge variant="outline" className="ml-2">
                            {tag.count}
                          </Badge>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </ScrollArea>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/team" className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Team Members
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/history" className="flex items-center">
                  <History className="h-4 w-4 mr-2" />
                  Version History
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/trash" className="flex items-center">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Trash
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/settings" className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}

"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  Calendar,
  Zap,
  MessageSquare,
  Mail,
  FileInput,
  Database,
  Timer,
  Globe,
  FileSpreadsheet,
  FileText,
  Phone,
  FileCheck,
  Filter,
  SplitSquareVertical,
  Repeat,
  Merge,
  Pause,
  Layers,
  Workflow,
  Code,
  Terminal,
  FileJson,
  Bot,
  Sparkles,
  FileOutput,
  Building,
  CreditCard,
  BarChart,
  Users,
  Briefcase,
  ImageIcon,
  AlertCircle,
  Fingerprint,
  Gauge,
  Scroll,
  Share2,
  Webhook as WebhookIcon,
  FileInput as FormInputIcon,
} from "lucide-react"


import { BASE_URL } from "@/lib/env-config"

// Mapping string keys from API to Lucide icon components
const iconMapping: Record<string, React.ReactNode> = {
  Clock: <Clock className="h-4 w-4 text-white" />,
  Calendar: <Calendar className="h-4 w-4 text-white" />,
  Zap: <Zap className="h-4 w-4 text-white" />,
  MessageSquare: <MessageSquare className="h-4 w-4 text-white" />,
  Mail: <Mail className="h-4 w-4 text-white" />,
  FileInput: <FileInput className="h-4 w-4 text-white" />,
  Database: <Database className="h-4 w-4 text-white" />,
  Timer: <Timer className="h-4 w-4 text-white" />,
  Globe: <Globe className="h-4 w-4 text-white" />,
  FileSpreadsheet: <FileSpreadsheet className="h-4 w-4 text-white" />,
  FileText: <FileText className="h-4 w-4 text-white" />,
  Phone: <Phone className="h-4 w-4 text-white" />,
  FileCheck: <FileCheck className="h-4 w-4 text-white" />,
  Filter: <Filter className="h-4 w-4 text-white" />,
  SplitSquareVertical: <SplitSquareVertical className="h-4 w-4 text-white" />,
  Repeat: <Repeat className="h-4 w-4 text-white" />,
  Merge: <Merge className="h-4 w-4 text-white" />,
  Pause: <Pause className="h-4 w-4 text-white" />,
  Layers: <Layers className="h-4 w-4 text-white" />,
  Workflow: <Workflow className="h-4 w-4 text-white" />,
  Code: <Code className="h-4 w-4 text-white" />,
  Terminal: <Terminal className="h-4 w-4 text-white" />,
  FileJson: <FileJson className="h-4 w-4 text-white" />,
  Bot: <Bot className="h-4 w-4 text-white" />,
  Sparkles: <Sparkles className="h-4 w-4 text-white" />,
  FileOutput: <FileOutput className="h-4 w-4 text-white" />,
  Building: <Building className="h-4 w-4 text-white" />,
  CreditCard: <CreditCard className="h-4 w-4 text-white" />,
  BarChart: <BarChart className="h-4 w-4 text-white" />,
  Users: <Users className="h-4 w-4 text-white" />,
  Briefcase: <Briefcase className="h-4 w-4 text-white" />,
  ImageIcon: <ImageIcon className="h-4 w-4 text-white" />,
  AlertCircle: <AlertCircle className="h-4 w-4 text-white" />,
  Fingerprint: <Fingerprint className="h-4 w-4 text-white" />,
  Gauge: <Gauge className="h-4 w-4 text-white" />,
  Scroll: <Scroll className="h-4 w-4 text-white" />,
  Share2: <Share2 className="h-4 w-4 text-white" />,
  Webhook: <WebhookIcon className="h-4 w-4 text-white" />,
  FormInput: <FormInputIcon className="h-4 w-4 text-white" />,
}

// Color map based on node type
const typeColorMap: Record<string, string> = {
  trigger: "bg-[#007A33]",
  action: "bg-blue-500",
  logic: "bg-purple-500",
  integration: "bg-orange-500",
  banking: "bg-emerald-500",
  ai: "bg-cyan-500",
  message: "bg-cyan-500",
  code: "bg-amber-500",
}

type RawNode = {
  id: string
  name: string
  type: string
  description: string
  iconKey: string
}

type RawCategory = {
  id: string
  name: string
  iconKey: string
  nodes: RawNode[]
}

interface NodeSelectorProps {
  onAddNode: (type: string, data: any) => void
}

export default function NodeSelector({ onAddNode }: NodeSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categories, setCategories] = useState<RawCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  

  useEffect(() => {
    fetch(`${BASE_URL}/node-categories`)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText)
        return res.json()
      })
      .then((data: RawCategory[]) => setCategories(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = (node: RawNode) => {
    onAddNode(node.type, { label: node.name, type: node.id, config: {} })
  }

  const handleDrag = (e: React.DragEvent, node: RawNode) => {
    e.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type: node.type, data: { label: node.name, type: node.id, config: {} } })
    )
    e.dataTransfer.effectAllowed = "move"
  }

  if (loading) return <p>Fetching nodes...</p>
  if (error) return <p className="text-red-500">Error: {error}</p>

  // filter nodes
  const filtered = categories
    .map((cat) => ({
      ...cat,
      nodes: cat.nodes.filter(
        (node) =>
          node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          node.description.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((cat) => cat.nodes.length > 0)

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Add Node</h3>
      <Input
        placeholder="Search nodes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      {searchTerm ? (
        filtered.map((cat) => (
          <div key={cat.id} className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-1 text-muted-foreground">
              {iconMapping[cat.iconKey] || null}
              {cat.name}
            </h4>
            <div className="space-y-1">
              {cat.nodes.map((node) => (
                <div
                  key={node.id}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-grab active:cursor-grabbing"
                  onClick={() => handleAdd(node)}
                  draggable
                  onDragStart={(e) => handleDrag(e, node)}
                >
                  <div
                    className={`h-6 w-6 rounded-full ${typeColorMap[node.type] || "bg-gray-200"} text-white flex items-center justify-center`}
                  >
                    {iconMapping[node.iconKey] || null}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span>{node.name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-sm bg-gray-100 text-gray-800">
                        {cat.name}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">{node.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <Tabs defaultValue={categories[0]?.id} className="w-full">
          <TabsList className="w-full overflow-x-auto flex">
            {categories.map((cat) => (
              <TabsTrigger key={cat.id} value={cat.id} className="flex items-center gap-1.5 px-3 py-1.5">
                {iconMapping[cat.iconKey] || null}
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((cat) => (
            <TabsContent key={cat.id} value={cat.id} className="space-y-1 mt-2">
              <div className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground mb-2">
                {iconMapping[cat.iconKey] || null}
                <span>{cat.name} Components</span>
              </div>
              {cat.nodes.map((node) => (
                <div
                  key={node.id}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-grab active:cursor-grabbing"
                  onClick={() => handleAdd(node)}
                  draggable
                  onDragStart={(e) => handleDrag(e, node)}
                >
                  <div
                    className={`h-6 w-6 rounded-full ${typeColorMap[node.type] || "bg-gray-200"} text-white flex items-center justify-center`}
                  >
                    {iconMapping[node.iconKey] || null}
                  </div>
                  <div>
                    <div>{node.name}</div>
                    <div className="text-xs text-muted-foreground">{node.description}</div>
                  </div>
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}
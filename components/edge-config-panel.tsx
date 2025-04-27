"use client"

import { useState, useEffect } from "react"
import type { Edge } from "reactflow"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EdgeConfigPanelProps {
  edge: Edge
  onUpdateConfig: (edgeId: string, config: any) => void
}

export default function EdgeConfigPanel({ edge, onUpdateConfig }: EdgeConfigPanelProps) {
  const [config, setConfig] = useState<any>({
    style: edge.style || {},
    animated: edge.animated || false,
    className: edge.className || "",
    type: edge.type || "default",
    label: edge.label || "",
    labelStyle: edge.labelStyle || {},
    labelShowBg: edge.labelShowBg !== false,
    labelBgStyle: edge.labelBgStyle || {},
    labelBgPadding: edge.labelBgPadding || [2, 4],
    labelBgBorderRadius: edge.labelBgBorderRadius || 4,
    hideArrowhead: edge.data?.hideArrowhead || false,
  })

  useEffect(() => {
    setConfig({
      style: edge.style || {},
      animated: edge.animated || false,
      className: edge.className || "",
      type: edge.type || "default",
      label: edge.label || "",
      labelStyle: edge.labelStyle || {},
      labelShowBg: edge.labelShowBg !== false,
      labelBgStyle: edge.labelBgStyle || {},
      labelBgPadding: edge.labelBgPadding || [2, 4],
      labelBgBorderRadius: edge.labelBgBorderRadius || 4,
      hideArrowhead: edge.data?.hideArrowhead || false,
    })
  }, [edge])

  const handleChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)

    // Special handling for hideArrowhead which needs to be in the data property
    if (key === "hideArrowhead") {
      onUpdateConfig(edge.id, {
        ...newConfig,
        data: {
          ...edge.data,
          hideArrowhead: value,
        },
      })
    } else {
      onUpdateConfig(edge.id, newConfig)
    }
  }

  const handleStyleChange = (key: string, value: any) => {
    const newStyle = { ...config.style, [key]: value }
    handleChange("style", newStyle)
  }

  const handleLabelStyleChange = (key: string, value: any) => {
    const newLabelStyle = { ...config.labelStyle, [key]: value }
    handleChange("labelStyle", newLabelStyle)
  }

  const handleLabelBgStyleChange = (key: string, value: any) => {
    const newLabelBgStyle = { ...config.labelBgStyle, [key]: value }
    handleChange("labelBgStyle", newLabelBgStyle)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Edge Configuration</h3>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="style">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="label">Label</TabsTrigger>
        </TabsList>

        <TabsContent value="style" className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="edgeType">Edge Type</Label>
            <Select value={config.type} onValueChange={(value) => handleChange("type", value)}>
              <SelectTrigger id="edgeType">
                <SelectValue placeholder="Select edge type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="straight">Straight</SelectItem>
                <SelectItem value="step">Step</SelectItem>
                <SelectItem value="smoothstep">Smooth Step</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
                <SelectItem value="noArrow">No Arrow</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edgeClass">Edge Style</Label>
            <Select value={config.className} onValueChange={(value) => handleChange("className", value)}>
              <SelectTrigger id="edgeClass">
                <SelectValue placeholder="Select edge style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="ai">AI</SelectItem>
                <SelectItem value="condition-true">Condition True</SelectItem>
                <SelectItem value="condition-false">Condition False</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="strokeWidth">Stroke Width</Label>
            <Input
              id="strokeWidth"
              type="number"
              min="1"
              max="10"
              value={config.style.strokeWidth || "1.5"}
              onChange={(e) => handleStyleChange("strokeWidth", Number.parseFloat(e.target.value))}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="animated"
              checked={config.animated}
              onCheckedChange={(checked) => handleChange("animated", checked)}
            />
            <Label htmlFor="animated">Animated</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="hideArrowhead"
              checked={config.hideArrowhead}
              onCheckedChange={(checked) => handleChange("hideArrowhead", checked)}
            />
            <Label htmlFor="hideArrowhead">Hide Arrowhead</Label>
          </div>
        </TabsContent>

        <TabsContent value="label" className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="edgeLabel">Label Text</Label>
            <Input
              id="edgeLabel"
              value={config.label}
              onChange={(e) => handleChange("label", e.target.value)}
              placeholder="Edge label"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="labelFontSize">Font Size</Label>
            <Input
              id="labelFontSize"
              type="number"
              min="8"
              max="24"
              value={config.labelStyle.fontSize || "10"}
              onChange={(e) => handleLabelStyleChange("fontSize", `${e.target.value}px`)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="labelShowBg"
              checked={config.labelShowBg}
              onCheckedChange={(checked) => handleChange("labelShowBg", checked)}
            />
            <Label htmlFor="labelShowBg">Show Background</Label>
          </div>

          {config.labelShowBg && (
            <div className="grid gap-2">
              <Label htmlFor="labelBgPadding">Background Padding</Label>
              <div className="flex gap-2">
                <Input
                  id="labelBgPaddingX"
                  type="number"
                  min="0"
                  max="20"
                  value={config.labelBgPadding[0]}
                  onChange={(e) =>
                    handleChange("labelBgPadding", [Number.parseInt(e.target.value), config.labelBgPadding[1]])
                  }
                  className="w-20"
                />
                <Input
                  id="labelBgPaddingY"
                  type="number"
                  min="0"
                  max="20"
                  value={config.labelBgPadding[1]}
                  onChange={(e) =>
                    handleChange("labelBgPadding", [config.labelBgPadding[0], Number.parseInt(e.target.value)])
                  }
                  className="w-20"
                />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

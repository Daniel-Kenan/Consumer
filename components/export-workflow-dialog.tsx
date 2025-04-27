"use client"

import { useState, useEffect } from "react"
import { FileImage, FileJson } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Slider } from "@/components/ui/slider"
import html2canvas from "html2canvas"

// Define the size presets with their resolutions
const SIZE_PRESETS = {
  small: { width: 800, height: 600, label: "Small (800×600)" },
  medium: { width: 1200, height: 800, label: "Medium (1200×800)" },
  large: { width: 1920, height: 1080, label: "Large (1920×1080)" },
}

// Define min and max sizes for the slider
const MIN_SIZE = 400
const MAX_SIZE = 3840
const STEP_SIZE = 100

// Define the export options type
type ExportOptions = {
  format: string
  background: string
  size: string
  width: number
  height: number
}

type ExportWorkflowDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExport: (options: ExportOptions) => void
  reactFlowInstance: any
}

export function ExportWorkflowDialog({ open, onOpenChange, onExport, reactFlowInstance }: ExportWorkflowDialogProps) {
  // State for export options
  const [exportType, setExportType] = useState("png")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [useTransparentBg, setUseTransparentBg] = useState(false)
  const [exportSize, setExportSize] = useState("medium")
  const [customWidth, setCustomWidth] = useState(SIZE_PRESETS.medium.width)
  const [customHeight, setCustomHeight] = useState(SIZE_PRESETS.medium.height)
  const [sliderValue, setSliderValue] = useState(SIZE_PRESETS.medium.width)
  const [aspectRatio, setAspectRatio] = useState(SIZE_PRESETS.medium.width / SIZE_PRESETS.medium.height)
  const [isExporting, setIsExporting] = useState(false)

  // Update aspect ratio when size preset changes
  useEffect(() => {
    if (exportSize !== "custom") {
      const preset = SIZE_PRESETS[exportSize]
      setAspectRatio(preset.width / preset.height)
      setSliderValue(preset.width)
      setCustomWidth(preset.width)
      setCustomHeight(preset.height)
    }
  }, [exportSize])

  // Update height when slider changes, maintaining aspect ratio
  useEffect(() => {
    if (exportSize !== "custom") {
      setCustomWidth(sliderValue)
      setCustomHeight(Math.round(sliderValue / aspectRatio))
    }
  }, [sliderValue, aspectRatio, exportSize])

  // Handle export action
  const handleExport = async () => {
    if (!reactFlowInstance) {
      toast({
        title: "Export Failed",
        description: "Could not access the workflow instance",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    try {
      if (exportType === "json") {
        // Export as JSON
        let flowObject

        // Handle different ReactFlow versions
        if (typeof reactFlowInstance.toObject === "function") {
          flowObject = reactFlowInstance.toObject()
        } else if (
          typeof reactFlowInstance.getNodes === "function" &&
          typeof reactFlowInstance.getEdges === "function"
        ) {
          flowObject = {
            nodes: reactFlowInstance.getNodes(),
            edges: reactFlowInstance.getEdges(),
            viewport: reactFlowInstance.getViewport ? reactFlowInstance.getViewport() : { x: 0, y: 0, zoom: 1 },
          }
        } else {
          // Fallback for other versions
          flowObject = {
            nodes: reactFlowInstance.nodes || [],
            edges: reactFlowInstance.edges || [],
            viewport: reactFlowInstance.viewport || { x: 0, y: 0, zoom: 1 },
          }
        }

        const jsonString = JSON.stringify(flowObject, null, 2)
        const blob = new Blob([jsonString], { type: "application/json" })
        const url = URL.createObjectURL(blob)

        // Create a download link and trigger the download
        const link = document.createElement("a")
        link.href = url
        link.download = "workflow.json"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        toast({
          title: "Export Successful",
          description: "Workflow exported as JSON",
          duration: 2000,
        })

        onOpenChange(false)
      } else {
        // For image exports, we need to focus on just the workflow content
        // First, find the viewport element that contains just the nodes and edges
        const viewportElement = document.querySelector(".react-flow__viewport") as HTMLElement
        const reactFlowContainer = document.querySelector(".react-flow") as HTMLElement

        if (!viewportElement || !reactFlowContainer) {
          throw new Error("Could not find ReactFlow viewport element")
        }

        // Store original styles to restore later
        const originalStyles = {
          container: reactFlowContainer.style.cssText,
          viewport: viewportElement.style.cssText,
        }

        // Store elements we need to hide temporarily
        const controlsElement = document.querySelector(".react-flow__controls") as HTMLElement
        const minimapElement = document.querySelector(".react-flow__minimap") as HTMLElement
        const backgroundElement = document.querySelector(".react-flow__background") as HTMLElement

        // Store visibility states
        const elementsToHide = [controlsElement, minimapElement]
        const visibilityStates = elementsToHide.map((el) => (el ? el.style.display : null))

        // Hide UI controls
        elementsToHide.forEach((el) => {
          if (el) el.style.display = "none"
        })

        // Set background color
        if (backgroundElement) {
          backgroundElement.style.opacity = useTransparentBg ? "0" : "1"
        }

        // Prepare the viewport for capture
        // We need to adjust the transform to center the content
        const nodes = reactFlowInstance.getNodes ? reactFlowInstance.getNodes() : reactFlowInstance.nodes || []

        if (nodes.length > 0) {
          try {
            // Get the current viewport
            const viewport = reactFlowInstance.getViewport ? reactFlowInstance.getViewport() : { x: 0, y: 0, zoom: 1 }

            // Store original transform
            const originalTransform = viewportElement.style.transform

            // Center the viewport on the nodes
            if (typeof reactFlowInstance.fitView === "function") {
              reactFlowInstance.fitView({ padding: 0.2 })
            }

            // Apply background color to the container
            reactFlowContainer.style.backgroundColor = useTransparentBg ? "transparent" : backgroundColor

            // Use html2canvas to capture just the viewport
            const canvas = await html2canvas(viewportElement, {
              backgroundColor: useTransparentBg ? null : backgroundColor,
              scale: 2, // Higher scale for better quality
              logging: false,
              allowTaint: true,
              useCORS: true,
            })

            // Create a new canvas with the desired export dimensions
            const exportCanvas = document.createElement("canvas")
            exportCanvas.width = customWidth
            exportCanvas.height = customHeight
            const exportCtx = exportCanvas.getContext("2d")

            if (!exportCtx) {
              throw new Error("Could not create export canvas context")
            }

            // Fill background if not transparent
            if (!useTransparentBg) {
              exportCtx.fillStyle = backgroundColor
              exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height)
            }

            // Calculate scaling to fit the canvas while maintaining aspect ratio
            const scale = Math.min(exportCanvas.width / canvas.width, exportCanvas.height / canvas.height)

            const scaledWidth = canvas.width * scale
            const scaledHeight = canvas.height * scale

            // Center the image on the canvas
            const x = (exportCanvas.width - scaledWidth) / 2
            const y = (exportCanvas.height - scaledHeight) / 2

            // Draw the captured image onto the export canvas
            exportCtx.drawImage(canvas, x, y, scaledWidth, scaledHeight)

            // Convert to the appropriate format
            let dataUrl
            if (exportType === "png") {
              dataUrl = exportCanvas.toDataURL("image/png")
            } else if (exportType === "jpg") {
              dataUrl = exportCanvas.toDataURL("image/jpeg", 0.95)
            } else if (exportType === "svg") {
              // For SVG, we need a different approach
              // Create an SVG representation of the canvas
              const svgData = `
                <svg xmlns="http://www.w3.org/2000/svg" width="${customWidth}" height="${customHeight}">
                  <rect width="100%" height="100%" fill="${useTransparentBg ? "none" : backgroundColor}"/>
                  <image href="${exportCanvas.toDataURL("image/png")}" x="${x}" y="${y}" width="${scaledWidth}" height="${scaledHeight}"/>
                </svg>
              `
              const blob = new Blob([svgData], { type: "image/svg+xml" })
              dataUrl = URL.createObjectURL(blob)
            }

            // Create a download link and trigger the download
            const link = document.createElement("a")
            link.href = dataUrl
            link.download = `workflow.${exportType}`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // Clean up blob URL if needed
            if (exportType === "svg") {
              URL.revokeObjectURL(dataUrl)
            }

            toast({
              title: "Export Successful",
              description: `Workflow exported as ${exportType.toUpperCase()}`,
              duration: 2000,
            })

            // Restore original viewport transform
            viewportElement.style.transform = originalTransform

            // If we used fitView, restore the original viewport
            if (typeof reactFlowInstance.setViewport === "function") {
              reactFlowInstance.setViewport(viewport)
            }

            onOpenChange(false)
          } catch (error) {
            console.error("Error during export:", error)
            throw error
          }
        } else {
          throw new Error("No nodes found in the workflow")
        }

        // Restore original styles and visibility
        reactFlowContainer.style.cssText = originalStyles.container
        viewportElement.style.cssText = originalStyles.viewport

        // Restore visibility of UI elements
        elementsToHide.forEach((el, index) => {
          if (el && visibilityStates[index] !== null) {
            el.style.display = visibilityStates[index] || ""
          }
        })

        // Restore background
        if (backgroundElement) {
          backgroundElement.style.opacity = ""
        }
      }
    } catch (error) {
      console.error("Export failed:", error)
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Format the current resolution for display
  const currentResolution = `${customWidth}×${customHeight}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Export Workflow</DialogTitle>
          <DialogDescription>Customize and export your workflow diagram.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={exportType} onValueChange={setExportType} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="png">PNG</TabsTrigger>
            <TabsTrigger value="jpg">JPEG</TabsTrigger>
            <TabsTrigger value="svg">SVG</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>

          {/* Content for image exports (PNG, JPG, SVG) */}
          <TabsContent value="png" className="space-y-4 min-h-[280px]">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Background</h3>
                <div className="flex items-center gap-4 h-10">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="png-transparent-bg"
                      checked={useTransparentBg}
                      onChange={(e) => setUseTransparentBg(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="png-transparent-bg" className="text-sm">
                      Transparent
                    </label>
                  </div>

                  {!useTransparentBg && (
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                      <span className="text-sm">{backgroundColor}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Size</h3>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {Object.entries(SIZE_PRESETS).map(([key, preset]) => (
                    <Button
                      key={key}
                      variant={exportSize === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setExportSize(key)}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Button>
                  ))}
                  <Button
                    variant={exportSize === "custom" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setExportSize("custom")}
                  >
                    Custom
                  </Button>
                </div>

                {exportSize !== "custom" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Resolution: {currentResolution}</span>
                      <span className="text-sm">{sliderValue}px wide</span>
                    </div>
                    <Slider
                      value={[sliderValue]}
                      min={MIN_SIZE}
                      max={MAX_SIZE}
                      step={STEP_SIZE}
                      onValueChange={(value) => setSliderValue(value[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{MIN_SIZE}px</span>
                      <span>{MAX_SIZE}px</span>
                    </div>
                  </div>
                )}

                <div
                  className={`grid grid-cols-2 gap-4 transition-all duration-200 ${exportSize === "custom" ? "opacity-100 mt-4" : "opacity-0 h-0 overflow-hidden"}`}
                >
                  <div>
                    <label className="text-xs mb-1 block">Width (px)</label>
                    <input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(Number.parseInt(e.target.value) || 1200)}
                      className="w-full p-2 border rounded text-sm"
                      min="100"
                      max="4000"
                      disabled={exportSize !== "custom"}
                    />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block">Height (px)</label>
                    <input
                      type="number"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(Number.parseInt(e.target.value) || 800)}
                      className="w-full p-2 border rounded text-sm"
                      min="100"
                      max="4000"
                      disabled={exportSize !== "custom"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="jpg" className="space-y-4 min-h-[280px]">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Background</h3>
                <div className="flex items-center gap-4 h-10">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <span className="text-sm">{backgroundColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Size</h3>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {Object.entries(SIZE_PRESETS).map(([key, preset]) => (
                    <Button
                      key={key}
                      variant={exportSize === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setExportSize(key)}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Button>
                  ))}
                  <Button
                    variant={exportSize === "custom" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setExportSize("custom")}
                  >
                    Custom
                  </Button>
                </div>

                {exportSize !== "custom" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Resolution: {currentResolution}</span>
                      <span className="text-sm">{sliderValue}px wide</span>
                    </div>
                    <Slider
                      value={[sliderValue]}
                      min={MIN_SIZE}
                      max={MAX_SIZE}
                      step={STEP_SIZE}
                      onValueChange={(value) => setSliderValue(value[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{MIN_SIZE}px</span>
                      <span>{MAX_SIZE}px</span>
                    </div>
                  </div>
                )}

                <div
                  className={`grid grid-cols-2 gap-4 transition-all duration-200 ${exportSize === "custom" ? "opacity-100 mt-4" : "opacity-0 h-0 overflow-hidden"}`}
                >
                  <div>
                    <label className="text-xs mb-1 block">Width (px)</label>
                    <input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(Number.parseInt(e.target.value) || 1200)}
                      className="w-full p-2 border rounded text-sm"
                      min="100"
                      max="4000"
                      disabled={exportSize !== "custom"}
                    />
                  </div>
                  <div>
                    <label className="text-xs mb-1 block">Height (px)</label>
                    <input
                      type="number"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(Number.parseInt(e.target.value) || 800)}
                      className="w-full p-2 border rounded text-sm"
                      min="100"
                      max="4000"
                      disabled={exportSize !== "custom"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="svg" className="space-y-4 min-h-[280px]">
            <div>
              <h3 className="text-sm font-medium mb-2">Background</h3>
              <div className="flex items-center gap-4 h-10">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="svg-transparent-bg"
                    checked={useTransparentBg}
                    onChange={(e) => setUseTransparentBg(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="svg-transparent-bg" className="text-sm">
                    Transparent
                  </label>
                </div>

                {!useTransparentBg && (
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    <span className="text-sm">{backgroundColor}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Size</h3>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {Object.entries(SIZE_PRESETS).map(([key, preset]) => (
                  <Button
                    key={key}
                    variant={exportSize === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setExportSize(key)}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Button>
                ))}
                <Button
                  variant={exportSize === "custom" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setExportSize("custom")}
                >
                  Custom
                </Button>
              </div>

              {exportSize !== "custom" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Resolution: {currentResolution}</span>
                    <span className="text-sm">{sliderValue}px wide</span>
                  </div>
                  <Slider
                    value={[sliderValue]}
                    min={MIN_SIZE}
                    max={MAX_SIZE}
                    step={STEP_SIZE}
                    onValueChange={(value) => setSliderValue(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{MIN_SIZE}px</span>
                    <span>{MAX_SIZE}px</span>
                  </div>
                </div>
              )}

              <div
                className={`grid grid-cols-2 gap-4 transition-all duration-200 ${exportSize === "custom" ? "opacity-100 mt-4" : "opacity-0 h-0 overflow-hidden"}`}
              >
                <div>
                  <label className="text-xs mb-1 block">Width (px)</label>
                  <input
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Number.parseInt(e.target.value) || 1200)}
                    className="w-full p-2 border rounded text-sm"
                    min="100"
                    max="4000"
                    disabled={exportSize !== "custom"}
                  />
                </div>
                <div>
                  <label className="text-xs mb-1 block">Height (px)</label>
                  <input
                    type="number"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Number.parseInt(e.target.value) || 800)}
                    className="w-full p-2 border rounded text-sm"
                    min="100"
                    max="4000"
                    disabled={exportSize !== "custom"}
                  />
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground mt-4">
              <p>SVG exports maintain vector quality at any scale.</p>
              <p className="mt-2">
                Perfect for including in documentation or further editing in vector graphics software.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="json" className="space-y-4 min-h-[280px]">
            <div className="text-sm text-muted-foreground">
              <p>JSON export includes all workflow data including:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Node positions, types, and configurations</li>
                <li>Edge connections and properties</li>
                <li>Viewport state and zoom level</li>
              </ul>
              <p className="mt-4">This format is ideal for:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Backing up your workflow</li>
                <li>Sharing with team members</li>
                <li>Importing into other instances</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              "Exporting..."
            ) : exportType === "json" ? (
              <>
                <FileJson className="mr-2 h-4 w-4" />
                Download JSON
              </>
            ) : (
              <>
                <FileImage className="mr-2 h-4 w-4" />
                Download {exportType.toUpperCase()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

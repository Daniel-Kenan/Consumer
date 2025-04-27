"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface KeyboardShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function KeyboardShortcutsDialog({ open, onOpenChange }: KeyboardShortcutsDialogProps) {
  const shortcuts = [
    {
      category: "General",
      items: [
        { keys: ["?"], description: "Show keyboard shortcuts" },
        { keys: ["Ctrl", "S"], description: "Save workflow" },
        { keys: ["Ctrl", "O"], description: "Open workflow templates" },
        { keys: ["Ctrl", "E"], description: "Export workflow" },
        { keys: ["F11"], description: "Toggle fullscreen" },
        { keys: ["Esc"], description: "Close dialogs / Cancel operations" },
      ],
    },
    {
      category: "Editor",
      items: [
        { keys: ["Delete"], description: "Delete selected node/edge" },
        { keys: ["Ctrl", "Z"], description: "Undo" },
        { keys: ["Ctrl", "Y"], description: "Redo" },
        { keys: ["Ctrl", "C"], description: "Copy selected node" },
        { keys: ["Ctrl", "V"], description: "Paste node" },
        { keys: ["Ctrl", "A"], description: "Select all nodes" },
        { keys: ["Ctrl", "D"], description: "Duplicate selected node" },
        { keys: ["Ctrl", "B"], description: "Toggle sidebar" },
      ],
    },
    {
      category: "Navigation",
      items: [
        { keys: ["Ctrl", "+"], description: "Zoom in" },
        { keys: ["Ctrl", "-"], description: "Zoom out" },
        { keys: ["Ctrl", "0"], description: "Fit view" },
        { keys: ["Space"], description: "Toggle panning mode" },
        { keys: ["Arrow Keys"], description: "Move selected node" },
        { keys: ["Tab"], description: "Select next node" },
        { keys: ["Shift", "Tab"], description: "Select previous node" },
      ],
    },
    {
      category: "Simulation",
      items: [
        { keys: ["F5"], description: "Run workflow simulation" },
        { keys: ["F6"], description: "Pause/Resume simulation" },
        { keys: ["F7"], description: "Step forward in simulation" },
        { keys: ["F8"], description: "Stop simulation" },
      ],
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to work more efficiently with the workflow editor.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {shortcuts.map((category) => (
              <div key={category.category}>
                <h3 className="font-medium text-lg mb-2">{category.category}</h3>
                <div className="rounded-md border">
                  {category.items.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between py-2 px-4 border-b last:border-b-0">
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <kbd
                            key={keyIndex}
                            className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

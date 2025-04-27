"use client"

import { useEffect, useCallback, useState } from "react"

type ShortcutHandler = (event: KeyboardEvent) => void

interface ShortcutMap {
  [key: string]: ShortcutHandler
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap, enabled = true) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())

  // Generate a key string from a keyboard event
  const getKeyString = useCallback((event: KeyboardEvent): string => {
    const modifiers = []
    if (event.ctrlKey) modifiers.push("Ctrl")
    if (event.altKey) modifiers.push("Alt")
    if (event.shiftKey) modifiers.push("Shift")
    if (event.metaKey) modifiers.push("Meta")

    const key = event.key.toLowerCase()
    if (!modifiers.includes(key) && key !== "control" && key !== "alt" && key !== "shift" && key !== "meta") {
      modifiers.push(key)
    }

    return modifiers.join("+")
  }, [])

  // Handle keydown events
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      // Don't trigger shortcuts when typing in input fields
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        document.activeElement instanceof HTMLSelectElement
      ) {
        return
      }

      const keyString = getKeyString(event)
      setPressedKeys((prev) => {
        const newSet = new Set(prev)
        newSet.add(keyString)
        return newSet
      })

      if (shortcuts[keyString]) {
        event.preventDefault()
        shortcuts[keyString](event)
      }
    },
    [enabled, getKeyString, shortcuts],
  )

  // Handle keyup events
  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      const keyString = getKeyString(event)
      setPressedKeys((prev) => {
        const newSet = new Set(prev)
        newSet.delete(keyString)
        return newSet
      })
    },
    [getKeyString],
  )

  // Set up event listeners
  useEffect(() => {
    if (enabled) {
      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("keyup", handleKeyUp)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [enabled, handleKeyDown, handleKeyUp])

  return { pressedKeys }
}

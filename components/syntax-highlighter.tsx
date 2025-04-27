"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface SyntaxHighlighterProps {
  code: string
  language: string
  className?: string
}

export function SyntaxHighlighter({ code, language, className }: SyntaxHighlighterProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>("")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Dynamically import highlight.js
    import("highlight.js").then((hljs) => {
      // Register languages
      import("highlight.js/lib/languages/javascript").then((javascript) => {
        hljs.default.registerLanguage("javascript", javascript.default)
      })
      import("highlight.js/lib/languages/python").then((python) => {
        hljs.default.registerLanguage("python", python.default)
      })
      import("highlight.js/lib/languages/c").then((c) => {
        hljs.default.registerLanguage("c", c.default)
      })
      import("highlight.js/lib/languages/bash").then((bash) => {
        hljs.default.registerLanguage("bash", bash.default)
      })
      import("highlight.js/lib/languages/powershell").then((powershell) => {
        hljs.default.registerLanguage("powershell", powershell.default)
      })
      import("highlight.js/lib/languages/sql").then((sql) => {
        hljs.default.registerLanguage("sql", sql.default)
      })
      import("highlight.js/lib/languages/xml").then((xml) => {
        hljs.default.registerLanguage("xml", xml.default)
        hljs.default.registerLanguage("html", xml.default)
      })
      import("highlight.js/lib/languages/css").then((css) => {
        hljs.default.registerLanguage("css", css.default)
      })
      import("highlight.js/lib/languages/typescript").then((typescript) => {
        hljs.default.registerLanguage("typescript", typescript.default)
      })
      import("highlight.js/lib/languages/json").then((json) => {
        hljs.default.registerLanguage("json", json.default)
      })

      // Highlight the code
      const lang = language === "text" ? null : language
      const highlighted = lang
        ? hljs.default.highlight(code, { language: lang }).value
        : hljs.default.highlightAuto(code).value

      setHighlightedCode(highlighted)
      setIsLoaded(true)
    })
  }, [code, language])

  if (!isLoaded) {
    return (
      <pre className={cn("p-4 overflow-auto font-mono text-sm", className)}>
        <code>{code}</code>
      </pre>
    )
  }

  return (
    <pre className={cn("p-4 overflow-auto font-mono text-sm", className)}>
      <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
    </pre>
  )
}

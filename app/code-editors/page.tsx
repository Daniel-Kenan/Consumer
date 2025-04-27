"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PythonEditor } from "@/components/language-specific-editors/python-editor"
import { CEditor } from "@/components/language-specific-editors/c-editor"
import { BashEditor } from "@/components/language-specific-editors/bash-editor"
import { PowerShellEditor } from "@/components/language-specific-editors/powershell-editor"
import { SQLEditor } from "@/components/language-specific-editors/sql-editor"

export default function CodeEditorsPage() {
  const [activeTab, setActiveTab] = useState("python")

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Code Editors</h1>
      <p className="text-muted-foreground mb-8">
        Interactive code editors with syntax highlighting for various programming languages.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="python">Python</TabsTrigger>
          <TabsTrigger value="c">C</TabsTrigger>
          <TabsTrigger value="bash">Bash</TabsTrigger>
          <TabsTrigger value="powershell">PowerShell</TabsTrigger>
          <TabsTrigger value="sql">SQL</TabsTrigger>
        </TabsList>

        <TabsContent value="python" className="mt-0">
          <PythonEditor height="500px" />
        </TabsContent>

        <TabsContent value="c" className="mt-0">
          <CEditor height="500px" />
        </TabsContent>

        <TabsContent value="bash" className="mt-0">
          <BashEditor height="500px" />
        </TabsContent>

        <TabsContent value="powershell" className="mt-0">
          <PowerShellEditor height="500px" />
        </TabsContent>

        <TabsContent value="sql" className="mt-0">
          <SQLEditor height="500px" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

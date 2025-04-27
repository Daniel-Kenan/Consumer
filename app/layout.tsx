import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/use-toast"
import Link from "next/link"
import { Home, GitBranch, Settings, FileText } from "lucide-react"
import Image from "next/image"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Flow - Workflow Automation",
  description: "Workflow automation platform",
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`${inter.className} h-full overflow-hidden`}>
        <ThemeProvider defaultTheme="dark">
          {/* Sidebar fixed on the left */}
          <aside className="fixed top-0 left-0 h-screen w-14 border-r flex flex-col items-center py-4 bg-background">
            <Link href="/" className="p-2 rounded-md hover:bg-accent mb-6">
              <Image
                src="/images/flowbank-logo.png"
                alt="FlowBank Logo"
                width={80}
                height={80}
              />
            </Link>
            <nav className="flex flex-col items-center gap-4">
              <Link href="/" className="p-2 rounded-md hover:bg-accent" title="Home">
                <Home className="h-5 w-5" />
              </Link>
              <Link href="/environments" className="p-2 rounded-md hover:bg-accent" title="Environments">
                <GitBranch className="h-5 w-5" />
              </Link>
              <Link href="/documentation" className="p-2 rounded-md hover:bg-accent" title="Documentation">
                <FileText className="h-5 w-5" />
              </Link>
              <Link href="/settings" className="p-2 rounded-md hover:bg-accent" title="Settings">
                <Settings className="h-5 w-5" />
              </Link>
            </nav>
          </aside>

          {/* Main content fixed to the right of sidebar */}
          <main className="fixed top-0 left-14 right-0 bottom-0 flex flex-col overflow-y-auto">
            {children}
          </main>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

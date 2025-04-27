"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, FileText, Globe, Search, Zap, Shield, Save, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Node, Edge } from "reactflow"
import { MarkerType } from "reactflow"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type WorkflowTemplate = {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  icon: React.ReactNode
  nodes: Node[]
  edges: Edge[]
}

// Define workflow templates
const workflowTemplates: WorkflowTemplate[] = [
  {
    id: "ai-chat-assistant",
    name: "AI Chat Assistant",
    description: "A workflow that processes incoming chat messages with an AI agent and responds accordingly.",
    category: "ai",
    tags: ["AI", "Chat", "Customer Support"],
    icon: <Bot className="h-5 w-5" />,
    nodes: [
      {
        id: "1",
        type: "trigger",
        data: {
          label: "When chat message received",
          type: "chat",
          config: {},
        },
        position: { x: 100, y: 200 },
      },
      {
        id: "2",
        type: "ai",
        data: {
          label: "AI Agent",
          subtitle: "Tools Agent",
          type: "ai-agent",
          tools: ["Chat Model", "Memory", "Tools"],
          config: {
            model: "gpt-4",
            systemPrompt: "You are a helpful assistant.",
          },
        },
        position: { x: 400, y: 200 },
      },
      {
        id: "3",
        type: "logic",
        data: {
          label: "If",
          type: "if",
          config: {
            condition: '{{$node["AI Agent"].json["success"] === true}}',
          },
        },
        position: { x: 700, y: 200 },
      },
      {
        id: "4",
        type: "message",
        data: {
          label: "Success",
          type: "message",
          config: {
            message: '{{$node["AI Agent"].json["response"]}}',
          },
        },
        position: { x: 1000, y: 100 },
      },
      {
        id: "5",
        type: "message",
        data: {
          label: "Failure",
          type: "message",
          config: {
            message: "Sorry, I couldn't process your request.",
          },
        },
        position: { x: 1000, y: 300 },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        className: "green",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        className: "ai",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        sourceHandle: "true",
        className: "condition-true",
        label: "true",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-5",
        source: "3",
        target: "5",
        sourceHandle: "false",
        className: "condition-false",
        label: "false",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ],
  },
  {
    id: "data-processing",
    name: "Data Processing Pipeline",
    description: "Extract data from Google Sheets, process it, and store in a database.",
    category: "data",
    tags: ["Data", "Google Sheets", "Database"],
    icon: <FileText className="h-5 w-5" />,
    nodes: [
      {
        id: "1",
        type: "trigger",
        data: {
          label: "Schedule",
          type: "schedule",
          config: {
            frequency: "daily",
            time: "08:00",
          },
        },
        position: { x: 100, y: 200 },
      },
      {
        id: "2",
        type: "action",
        data: {
          label: "Google Sheets",
          type: "googlesheets",
          config: {
            operation: "read",
            spreadsheetId: "",
            range: "Sheet1!A1:D100",
          },
        },
        position: { x: 350, y: 200 },
      },
      {
        id: "3",
        type: "code",
        data: {
          label: "Process Data",
          type: "javascript",
          config: {
            code: "// Process the data\nreturn { processedData: $input.data.map(row => ({ name: row[0], value: parseInt(row[1]) })) }",
          },
        },
        position: { x: 600, y: 200 },
      },
      {
        id: "4",
        type: "action",
        data: {
          label: "Database",
          type: "database",
          config: {
            operation: "insert",
            table: "processed_data",
          },
        },
        position: { x: 850, y: 200 },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ],
  },
  {
    id: "customer-onboarding",
    name: "Customer Onboarding",
    description: "Process new customer applications and send welcome emails.",
    category: "automation",
    tags: ["Email", "Customer", "Onboarding"],
    icon: <Globe className="h-5 w-5" />,
    nodes: [
      {
        id: "1",
        type: "trigger",
        data: {
          label: "Webhook",
          type: "webhook",
          config: {
            path: "/new-customer",
            method: "POST",
          },
        },
        position: { x: 100, y: 200 },
      },
      {
        id: "2",
        type: "logic",
        data: {
          label: "Validate Data",
          type: "if",
          config: {
            condition: '{{$node["Webhook"].json["email"] && $node["Webhook"].json["name"]}}',
          },
        },
        position: { x: 350, y: 200 },
      },
      {
        id: "3",
        type: "action",
        data: {
          label: "Create Account",
          type: "database",
          config: {
            operation: "insert",
            table: "customers",
          },
        },
        position: { x: 600, y: 100 },
      },
      {
        id: "4",
        type: "action",
        data: {
          label: "Send Welcome Email",
          type: "email",
          config: {
            to: '{{$node["Webhook"].json["email"]}}',
            subject: "Welcome to Our Service!",
            body: '{{$node["Webhook"].json["name"]}}, thank you for signing up!',
          },
        },
        position: { x: 850, y: 100 },
      },
      {
        id: "5",
        type: "action",
        data: {
          label: "Send Error Response",
          type: "http",
          config: {
            status: 400,
            body: '{"error": "Invalid data"}',
          },
        },
        position: { x: 600, y: 300 },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        sourceHandle: "true",
        className: "condition-true",
        label: "valid",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e2-5",
        source: "2",
        target: "5",
        sourceHandle: "false",
        className: "condition-false",
        label: "invalid",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ],
  },
  {
    id: "search-and-respond",
    name: "Search and Respond",
    description: "Search for information and respond to user queries using AI.",
    category: "ai",
    tags: ["AI", "Search", "Information Retrieval"],
    icon: <Search className="h-5 w-5" />,
    nodes: [
      {
        id: "1",
        type: "trigger",
        data: {
          label: "Chat Message",
          type: "chat",
          config: {},
        },
        position: { x: 100, y: 200 },
      },
      {
        id: "2",
        type: "ai",
        data: {
          label: "Classify Query",
          type: "ai-agent",
          config: {
            model: "gpt-3.5-turbo",
            systemPrompt: "Classify if this query requires search or can be answered directly.",
          },
        },
        position: { x: 350, y: 200 },
      },
      {
        id: "3",
        type: "logic",
        data: {
          label: "Needs Search?",
          type: "if",
          config: {
            condition: '{{$node["Classify Query"].json["needsSearch"] === true}}',
          },
        },
        position: { x: 600, y: 200 },
      },
      {
        id: "4",
        type: "action",
        data: {
          label: "Search",
          type: "http",
          config: {
            url: "https://api.search.com",
            method: "GET",
          },
        },
        position: { x: 850, y: 100 },
      },
      {
        id: "5",
        type: "ai",
        data: {
          label: "Generate Response",
          type: "ai-agent",
          config: {
            model: "gpt-4",
            systemPrompt: "Generate a response based on the search results.",
          },
        },
        position: { x: 1100, y: 100 },
      },
      {
        id: "6",
        type: "ai",
        data: {
          label: "Direct Response",
          type: "ai-agent",
          config: {
            model: "gpt-4",
            systemPrompt: "Answer the user's question directly.",
          },
        },
        position: { x: 850, y: 300 },
      },
      {
        id: "7",
        type: "message",
        data: {
          label: "Send Response",
          type: "message",
          config: {
            channel: "reply",
          },
        },
        position: { x: 1100, y: 200 },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        sourceHandle: "true",
        className: "condition-true",
        label: "yes",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e4-5",
        source: "4",
        target: "5",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e5-7",
        source: "5",
        target: "7",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-6",
        source: "3",
        target: "6",
        sourceHandle: "false",
        className: "condition-false",
        label: "no",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e6-7",
        source: "6",
        target: "7",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ],
  },
  {
    id: "transaction-monitoring",
    name: "Transaction Monitoring",
    description: "Monitor transactions for suspicious activity and alert if needed.",
    category: "monitoring",
    tags: ["Transactions", "Monitoring", "Alerts"],
    icon: <Zap className="h-5 w-5" />,
    nodes: [
      {
        id: "1",
        type: "trigger",
        data: {
          label: "New Transaction",
          type: "webhook",
          config: {
            path: "/transaction",
            method: "POST",
          },
        },
        position: { x: 100, y: 200 },
      },
      {
        id: "2",
        type: "code",
        data: {
          label: "Risk Analysis",
          type: "javascript",
          config: {
            code: "// Calculate risk score\nconst amount = $input.amount;\nconst country = $input.country;\nlet riskScore = 0;\n\nif (amount > 10000) riskScore += 50;\nif (country === 'high-risk') riskScore += 50;\n\nreturn { riskScore };",
          },
        },
        position: { x: 350, y: 200 },
      },
      {
        id: "3",
        type: "logic",
        data: {
          label: "High Risk?",
          type: "if",
          config: {
            condition: '{{$node["Risk Analysis"].json["riskScore"] > 70}}',
          },
        },
        position: { x: 600, y: 200 },
      },
      {
        id: "4",
        type: "action",
        data: {
          label: "Flag Transaction",
          type: "database",
          config: {
            operation: "update",
            table: "transactions",
          },
        },
        position: { x: 850, y: 100 },
      },
      {
        id: "5",
        type: "action",
        data: {
          label: "Send Alert",
          type: "email",
          config: {
            to: "security@example.com",
            subject: "High Risk Transaction Detected",
          },
        },
        position: { x: 1100, y: 100 },
      },
      {
        id: "6",
        type: "action",
        data: {
          label: "Log Transaction",
          type: "database",
          config: {
            operation: "insert",
            table: "transaction_logs",
          },
        },
        position: { x: 850, y: 300 },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        sourceHandle: "true",
        className: "condition-true",
        label: "high risk",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e4-5",
        source: "4",
        target: "5",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-6",
        source: "3",
        target: "6",
        sourceHandle: "false",
        className: "condition-false",
        label: "normal",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ],
  },
  {
    id: "advanced-due-diligence",
    name: "Advanced Due Diligence with AI Governance",
    description: "Comprehensive due diligence with AI agents using MCP, RAG, and governance controls.",
    category: "compliance",
    tags: ["Compliance", "Due Diligence", "AI Governance", "RAG", "MCP"],
    icon: <Shield className="h-5 w-5" />,
    nodes: [
      {
        id: "1",
        type: "trigger",
        data: {
          label: "New Entity Check",
          type: "webhook",
          config: {
            path: "/due-diligence",
            method: "POST",
          },
        },
        position: { x: 100, y: 200 },
      },
      {
        id: "2",
        type: "action",
        data: {
          label: "Identity Verification",
          type: "http",
          config: {
            url: "https://api.identity-verify.com/check",
            method: "POST",
          },
        },
        position: { x: 350, y: 100 },
      },
      {
        id: "3",
        type: "action",
        data: {
          label: "Document Retrieval",
          type: "database",
          config: {
            operation: "query",
            query: "SELECT * FROM entity_documents WHERE entity_id = {{$input.entityId}}",
          },
        },
        position: { x: 350, y: 300 },
      },
      {
        id: "4",
        type: "ai",
        data: {
          label: "RAG Document Analysis",
          subtitle: "Retrieval Augmented Generation",
          type: "ai-rag",
          config: {
            model: "gpt-4",
            systemPrompt:
              "Analyze the provided documents for risk factors, compliance issues, and key information about the entity.",
            documents: "{{$node['Document Retrieval'].json}}",
            retrieverType: "hybrid",
            embeddingModel: "text-embedding-3-large",
          },
        },
        position: { x: 600, y: 300 },
      },
      {
        id: "5",
        type: "action",
        data: {
          label: "Regulatory Database Search",
          type: "http",
          config: {
            url: "https://api.regulatory-database.com/search",
            method: "POST",
            body: '{"entityName": "{{$input.entityName}}", "jurisdiction": "{{$input.jurisdiction}}"}',
          },
        },
        position: { x: 600, y: 100 },
      },
      {
        id: "6",
        type: "ai",
        data: {
          label: "MCP Risk Analysis",
          subtitle: "Multi-Context Processing",
          type: "ai-mcp",
          config: {
            model: "gpt-4",
            systemPrompt: "Analyze multiple data sources to identify risks, connections, and compliance issues.",
            contexts: [
              { name: "identity", data: "{{$node['Identity Verification'].json}}" },
              { name: "regulatory", data: "{{$node['Regulatory Database Search'].json}}" },
              { name: "documents", data: "{{$node['RAG Document Analysis'].json}}" },
            ],
          },
        },
        position: { x: 850, y: 200 },
      },
      {
        id: "7",
        type: "code",
        data: {
          label: "Risk Score Calculation",
          type: "javascript",
          config: {
            code: "// Calculate comprehensive risk score\nconst mcpResults = $node['MCP Risk Analysis'].json;\nconst identityVerification = $node['Identity Verification'].json;\nconst regulatoryResults = $node['Regulatory Database Search'].json;\n\nlet riskScore = 0;\nlet riskFactors = [];\n\n// Identity verification risks\nif (!identityVerification.verified) {\n  riskScore += 50;\n  riskFactors.push('Identity verification failed');\n}\n\n// Regulatory database risks\nif (regulatoryResults.sanctions && regulatoryResults.sanctions.length > 0) {\n  riskScore += 100;\n  riskFactors.push(`${regulatoryResults.sanctions.length} sanctions found`);\n}\n\nif (regulatoryResults.pep) {\n  riskScore += 75;\n  riskFactors.push('Politically Exposed Person');\n}\n\n// MCP identified risks\nif (mcpResults.identifiedRisks) {\n  mcpResults.identifiedRisks.forEach(risk => {\n    riskScore += risk.severity * 25;\n    riskFactors.push(risk.description);\n  });\n}\n\nconst riskLevel = riskScore > 100 ? 'high' : riskScore > 50 ? 'medium' : 'low';\n\nreturn {\n  riskScore,\n  riskLevel,\n  riskFactors,\n  detailedAnalysis: mcpResults.analysis,\n  entityData: {\n    name: $input.entityName,\n    jurisdiction: $input.jurisdiction,\n    identityVerified: identityVerification.verified\n  }\n};",
          },
        },
        position: { x: 1100, y: 200 },
      },
      {
        id: "8",
        type: "ai",
        data: {
          label: "Generate Due Diligence Report",
          type: "ai-agent",
          config: {
            model: "gpt-4",
            systemPrompt:
              "Generate a comprehensive due diligence report based on the analysis results. Include risk factors, compliance issues, and recommendations.",
            input: "{{$node['Risk Score Calculation'].json}}",
          },
        },
        position: { x: 1350, y: 200 },
      },
      {
        id: "9",
        type: "ai",
        data: {
          label: "Governance AI Check",
          subtitle: "Compliance & Bias Detection",
          type: "ai-governance",
          config: {
            model: "gpt-4",
            systemPrompt:
              "You are a governance AI that checks for sensitive information exposure, bias, and compliance issues in AI-generated content. Flag any issues found.",
            content: "{{$node['Generate Due Diligence Report'].json.content}}",
            sensitiveDataTypes: ["PII", "Financial", "Legal"],
            biasCategories: ["Gender", "Race", "Age", "Geographic"],
            complianceFrameworks: ["GDPR", "CCPA", "AML", "KYC"],
          },
        },
        position: { x: 1600, y: 200 },
      },
      {
        id: "10",
        type: "logic",
        data: {
          label: "Issues Detected?",
          type: "if",
          config: {
            condition: '{{$node["Governance AI Check"].json["issuesDetected"] === true}}',
          },
        },
        position: { x: 1850, y: 200 },
      },
      {
        id: "11",
        type: "ai",
        data: {
          label: "Remediate Issues",
          type: "ai-agent",
          config: {
            model: "gpt-4",
            systemPrompt:
              "Remediate the identified issues in the report while maintaining accuracy and completeness. Remove sensitive information, correct bias, and ensure compliance.",
            input: {
              originalReport: "{{$node['Generate Due Diligence Report'].json.content}}",
              issues: "{{$node['Governance AI Check'].json.issues}}",
              entityData: "{{$node['Risk Score Calculation'].json.entityData}}",
            },
          },
        },
        position: { x: 2100, y: 100 },
      },
      {
        id: "12",
        type: "action",
        data: {
          label: "Store Final Report",
          type: "database",
          config: {
            operation: "insert",
            table: "due_diligence_reports",
            data: '{\n  "entityId": "{{$input.entityId}}",\n  "entityName": "{{$input.entityName}}",\n  "reportContent": "{{$node[\'Remediate Issues\'].json.remediatedReport || $node[\'Generate Due Diligence Report\'].json.content}}",\n  "riskLevel": "{{$node[\'Risk Score Calculation\'].json.riskLevel}}",\n  "riskScore": "{{$node[\'Risk Score Calculation\'].json.riskScore}}",\n  "timestamp": "{{$now}}",\n  "governanceChecked": true,\n  "issuesRemediated": {{$node["Governance AI Check"].json["issuesDetected"]}}\n}',
          },
        },
        position: { x: 2350, y: 200 },
      },
      {
        id: "13",
        type: "logic",
        data: {
          label: "High Risk?",
          type: "if",
          config: {
            condition: '{{$node["Risk Score Calculation"].json["riskLevel"] === "high"}}',
          },
        },
        position: { x: 2600, y: 200 },
      },
      {
        id: "14",
        type: "action",
        data: {
          label: "Alert Compliance Team",
          type: "email",
          config: {
            to: "compliance@company.com",
            subject: "High Risk Entity Detected - {{$input.entityName}}",
            body: "A high risk entity has been detected in the due diligence process. Risk score: {{$node['Risk Score Calculation'].json.riskScore}}. Please review the report.",
            attachments: ["{{$node['Store Final Report'].json.reportId}}"],
          },
        },
        position: { x: 2850, y: 100 },
      },
      {
        id: "15",
        type: "action",
        data: {
          label: "Return Report",
          type: "http",
          config: {
            status: 200,
            body: '{\n  "reportId": "{{$node[\'Store Final Report\'].json.reportId}}",\n  "entityName": "{{$input.entityName}}",\n  "riskLevel": "{{$node[\'Risk Score Calculation\'].json.riskLevel}}",\n  "riskScore": "{{$node[\'Risk Score Calculation\'].json.riskScore}}",\n  "summary": "{{$node[\'Risk Score Calculation\'].json.riskFactors}}"\n}',
          },
        },
        position: { x: 2850, y: 300 },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e1-3",
        source: "1",
        target: "3",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e2-5",
        source: "2",
        target: "5",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e4-6",
        source: "4",
        target: "6",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e5-6",
        source: "5",
        target: "6",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e6-7",
        source: "6",
        target: "7",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e7-8",
        source: "7",
        target: "8",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e8-9",
        source: "8",
        target: "9",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e9-10",
        source: "9",
        target: "10",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e10-11",
        source: "10",
        target: "11",
        sourceHandle: "true",
        className: "condition-true",
        label: "issues found",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e11-12",
        source: "11",
        target: "12",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e10-12",
        source: "10",
        target: "12",
        sourceHandle: "false",
        className: "condition-false",
        label: "no issues",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e12-13",
        source: "12",
        target: "13",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e13-14",
        source: "13",
        target: "14",
        sourceHandle: "true",
        className: "condition-true",
        label: "high risk",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e14-15",
        source: "14",
        target: "15",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e13-15",
        source: "13",
        target: "15",
        sourceHandle: "false",
        className: "condition-false",
        label: "medium/low risk",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ],
  },
  {
    id: "chatgpt-integration",
    name: "ChatGPT Integration",
    description: "Create a custom ChatGPT-powered assistant with specific knowledge and capabilities.",
    category: "ai",
    tags: ["AI", "ChatGPT", "Assistant"],
    icon: <Bot className="h-5 w-5" />,
    nodes: [
      {
        id: "1",
        type: "trigger",
        data: {
          label: "User Message",
          type: "webhook",
          config: {
            path: "/chat",
            method: "POST",
          },
        },
        position: { x: 100, y: 200 },
      },
      {
        id: "2",
        type: "code",
        data: {
          label: "Message Preprocessing",
          type: "javascript",
          config: {
            code: "// Extract user message and context\nconst userMessage = $input.message;\nconst userId = $input.userId;\nconst sessionId = $input.sessionId || Math.random().toString(36).substring(2, 15);\n\n// Format for next steps\nreturn {\n  userMessage,\n  userId,\n  sessionId,\n  timestamp: new Date().toISOString()\n};",
          },
        },
        position: { x: 350, y: 200 },
      },
      {
        id: "3",
        type: "action",
        data: {
          label: "Retrieve Chat History",
          type: "database",
          config: {
            operation: "query",
            query:
              "SELECT * FROM chat_history WHERE session_id = {{$node['Message Preprocessing'].json.sessionId}} ORDER BY timestamp DESC LIMIT 10",
          },
        },
        position: { x: 600, y: 200 },
      },
      {
        id: "4",
        type: "code",
        data: {
          label: "Format Context",
          type: "javascript",
          config: {
            code: "// Format chat history and system instructions\nconst chatHistory = $node['Retrieve Chat History'].json || [];\n\n// Create conversation context\nconst messages = [\n  {\n    role: 'system',\n    content: 'You are a helpful assistant with expertise in [SPECIFIC DOMAIN]. Provide accurate and concise information.'\n  }\n];\n\n// Add chat history\nchatHistory.reverse().forEach(msg => {\n  messages.push({\n    role: msg.is_user ? 'user' : 'assistant',\n    content: msg.message\n  });\n});\n\n// Add current message\nmessages.push({\n  role: 'user',\n  content: $node['Message Preprocessing'].json.userMessage\n});\n\nreturn { messages };",
          },
        },
        position: { x: 850, y: 200 },
      },
      {
        id: "5",
        type: "ai",
        data: {
          label: "ChatGPT Request",
          type: "ai-completion",
          config: {
            model: "gpt-4",
            messages: "{{$node['Format Context'].json.messages}}",
            temperature: 0.7,
            max_tokens: 500,
          },
        },
        position: { x: 1100, y: 200 },
      },
      {
        id: "6",
        type: "action",
        data: {
          label: "Save to History",
          type: "database",
          config: {
            operation: "insert",
            table: "chat_history",
            data: '{\n  "session_id": "{{$node[\'Message Preprocessing\'].json.sessionId}}",\n  "user_id": "{{$node[\'Message Preprocessing\'].json.userId}}",\n  "message": "{{$node[\'ChatGPT Request\'].json.choices[0].message.content}}",\n  "is_user": false,\n  "timestamp": "{{$node[\'Message Preprocessing\'].json.timestamp}}"\n}',
          },
        },
        position: { x: 1350, y: 200 },
      },
      {
        id: "7",
        type: "action",
        data: {
          label: "Send Response",
          type: "http",
          config: {
            status: 200,
            body: '{\n  "response": "{{$node[\'ChatGPT Request\'].json.choices[0].message.content}}",\n  "sessionId": "{{$node[\'Message Preprocessing\'].json.sessionId}}"\n}',
          },
        },
        position: { x: 1600, y: 200 },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e4-5",
        source: "4",
        target: "5",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e5-6",
        source: "5",
        target: "6",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e6-7",
        source: "6",
        target: "7",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ],
  },
  {
    id: "hr-assistant",
    name: "HR Assistant",
    description: "Automate HR processes including employee onboarding, document processing, and approvals.",
    category: "automation",
    tags: ["HR", "Onboarding", "Employee"],
    icon: <Globe className="h-5 w-5" />,
    nodes: [
      {
        id: "1",
        type: "trigger",
        data: {
          label: "New Employee Form",
          type: "form",
          config: {
            fields: [
              { name: "fullName", type: "text", required: true },
              { name: "email", type: "email", required: true },
              { name: "position", type: "text", required: true },
              { name: "startDate", type: "date", required: true },
              { name: "department", type: "select", options: ["Engineering", "Marketing", "Sales", "HR", "Finance"] },
            ],
          },
        },
        position: { x: 100, y: 200 },
      },
      {
        id: "2",
        type: "action",
        data: {
          label: "Create Employee Record",
          type: "database",
          config: {
            operation: "insert",
            table: "employees",
            data: '{\n  "name": "{{$node[\'New Employee Form\'].json.fullName}}",\n  "email": "{{$node[\'New Employee Form\'].json.email}}",\n  "position": "{{$node[\'New Employee Form\'].json.position}}",\n  "start_date": "{{$node[\'New Employee Form\'].json.startDate}}",\n  "department": "{{$node[\'New Employee Form\'].json.department}}",\n  "status": "onboarding"\n}',
          },
        },
        position: { x: 350, y: 200 },
      },
      {
        id: "3",
        type: "action",
        data: {
          label: "Generate Welcome Email",
          type: "ai",
          config: {
            model: "gpt-3.5-turbo",
            prompt:
              "Generate a welcome email for {{$node['New Employee Form'].json.fullName}} who is joining as a {{$node['New Employee Form'].json.position}} in the {{$node['New Employee Form'].json.department}} department on {{$node['New Employee Form'].json.startDate}}. Include information about first day orientation and required documents.",
          },
        },
        position: { x: 600, y: 100 },
      },
      {
        id: "4",
        type: "action",
        data: {
          label: "Send Welcome Email",
          type: "email",
          config: {
            to: "{{$node['New Employee Form'].json.email}}",
            cc: "hr@company.com",
            subject: "Welcome to Company - Onboarding Information",
            body: "{{$node['Generate Welcome Email'].json.content}}",
          },
        },
        position: { x: 850, y: 100 },
      },
      {
        id: "5",
        type: "action",
        data: {
          label: "Create IT Access Request",
          type: "http",
          config: {
            url: "https://api.it-system.com/access-request",
            method: "POST",
            body: '{\n  "employeeName": "{{$node[\'New Employee Form\'].json.fullName}}",\n  "email": "{{$node[\'New Employee Form\'].json.email}}",\n  "department": "{{$node[\'New Employee Form\'].json.department}}",\n  "startDate": "{{$node[\'New Employee Form\'].json.startDate}}",\n  "accessLevel": "standard"\n}',
          },
        },
        position: { x: 600, y: 300 },
      },
      {
        id: "6",
        type: "action",
        data: {
          label: "Generate Onboarding Docs",
          type: "document",
          config: {
            template: "onboarding_package",
            data: '{\n  "employeeName": "{{$node[\'New Employee Form\'].json.fullName}}",\n  "position": "{{$node[\'New Employee Form\'].json.position}}",\n  "department": "{{$node[\'New Employee Form\'].json.department}}",\n  "startDate": "{{$node[\'New Employee Form\'].json.startDate}}"\n}',
            format: "pdf",
          },
        },
        position: { x: 850, y: 300 },
      },
      {
        id: "7",
        type: "action",
        data: {
          label: "Notify Department Manager",
          type: "email",
          config: {
            to: "{{getDepartmentManager($node['New Employee Form'].json.department)}}",
            subject: "New Team Member Joining - {{$node['New Employee Form'].json.fullName}}",
            body: "A new team member, {{$node['New Employee Form'].json.fullName}}, will be joining your department as {{$node['New Employee Form'].json.position}} on {{$node['New Employee Form'].json.startDate}}. Please prepare for their arrival.",
          },
        },
        position: { x: 1100, y: 200 },
      },
      {
        id: "8",
        type: "action",
        data: {
          label: "Schedule Orientation",
          type: "calendar",
          config: {
            event: "New Employee Orientation - {{$node['New Employee Form'].json.fullName}}",
            date: "{{$node['New Employee Form'].json.startDate}}",
            time: "09:00",
            duration: 120,
            attendees: [
              "{{$node['New Employee Form'].json.email}}",
              "hr@company.com",
              "{{getDepartmentManager($node['New Employee Form'].json.department)}}",
            ],
          },
        },
        position: { x: 1350, y: 200 },
      },
      {
        id: "9",
        type: "action",
        data: {
          label: "Update Onboarding Status",
          type: "database",
          config: {
            operation: "update",
            table: "employees",
            where: "email = '{{$node['New Employee Form'].json.email}}'",
            data: '{\n  "onboarding_status": "documents_sent",\n  "orientation_scheduled": true\n}',
          },
        },
        position: { x: 1600, y: 200 },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e2-3",
        source: "2",
        target: "3",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e2-5",
        source: "2",
        target: "5",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e3-4",
        source: "3",
        target: "4",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e5-6",
        source: "5",
        target: "6",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e4-7",
        source: "4",
        target: "7",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e6-7",
        source: "6",
        target: "7",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e7-8",
        source: "7",
        target: "8",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
      {
        id: "e8-9",
        source: "8",
        target: "9",
        markerEnd: { type: MarkerType.ArrowClosed },
      },
    ],
  },
]

interface WorkflowTemplatesProps {
  onSelectTemplate: (template: WorkflowTemplate) => void
  currentWorkflow?: { nodes: Node[]; edges: Edge[] }
}

export default function WorkflowTemplates({ onSelectTemplate, currentWorkflow }: WorkflowTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [saveTemplateDialogOpen, setSaveTemplateDialogOpen] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    category: "automation",
    tags: "",
  })

  // Filter templates based on category and search query
  const filteredTemplates = workflowTemplates
    .filter((template) => selectedCategory === "all" || template.category === selectedCategory)
    .filter((template) => {
      if (!searchQuery) return true

      const query = searchQuery.toLowerCase()
      return (
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    })

  const handleSelectTemplate = (template: WorkflowTemplate) => {
    setSelectedTemplate(template)
    setDialogOpen(true)
  }

  const handleConfirmTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate)
      setDialogOpen(false)
    }
  }

  const handleSaveAsTemplate = () => {
    if (!currentWorkflow) {
      return
    }

    setSaveTemplateDialogOpen(true)
  }

  const handleCreateTemplate = () => {
    if (!currentWorkflow || !newTemplate.name) {
      return
    }

    // Create a new template from the current workflow
    const template: WorkflowTemplate = {
      id: `custom-${Date.now()}`,
      name: newTemplate.name,
      description: newTemplate.description,
      category: newTemplate.category,
      tags: newTemplate.tags.split(",").map((tag) => tag.trim()),
      icon: getCategoryIcon(newTemplate.category),
      nodes: currentWorkflow.nodes,
      edges: currentWorkflow.edges,
    }

    // In a real application, this would save to a database
    // For this demo, we'll just show a success message

    setSaveTemplateDialogOpen(false)
    setNewTemplate({
      name: "",
      description: "",
      category: "automation",
      tags: "",
    })

    // Show success message
    alert(`Template "${template.name}" saved successfully!`)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "ai":
        return <Bot className="h-5 w-5" />
      case "data":
        return <FileText className="h-5 w-5" />
      case "compliance":
        return <Shield className="h-5 w-5" />
      case "monitoring":
        return <Zap className="h-5 w-5" />
      default:
        return <Globe className="h-5 w-5" />
    }
  }

  const categories = [
    { id: "all", name: "All Templates" },
    { id: "ai", name: "AI" },
    { id: "data", name: "Data" },
    { id: "automation", name: "Automation" },
    { id: "monitoring", name: "Monitoring" },
    { id: "compliance", name: "Compliance" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Workflow Templates</h3>
        {currentWorkflow && currentWorkflow.nodes.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleSaveAsTemplate}>
            <Save className="h-4 w-4 mr-2" />
            Save as Template
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="mb-4">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {filteredTemplates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No templates found matching your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleSelectTemplate(template)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-primary/10 text-primary">{template.icon}</div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <CardDescription>{template.description}</CardDescription>
                </CardContent>
                <CardFooter className="pt-0 flex flex-wrap gap-1">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Load Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to load the "{selectedTemplate?.name}" template? This will replace your current
              workflow.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmTemplate}>Load Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={saveTemplateDialogOpen} onOpenChange={setSaveTemplateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save as Template</DialogTitle>
            <DialogDescription>Save your current workflow as a reusable template.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                placeholder="My Custom Workflow"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what this workflow does..."
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newTemplate.category}
                onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai">AI</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                  <SelectItem value="automation">Automation</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                placeholder="workflow, custom, automation"
                value={newTemplate.tags}
                onChange={(e) => setNewTemplate({ ...newTemplate, tags: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveTemplateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate} disabled={!newTemplate.name}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

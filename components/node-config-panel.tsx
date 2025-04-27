"use client"

import { useState, useEffect } from "react"
import type { Node } from "reactflow"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

interface NodeConfigPanelProps {
  node: Node
  onUpdateConfig: (config: any) => void
  onOpenFullEditor?: (node: Node) => void
}

export default function NodeConfigPanel({ node, onUpdateConfig, onOpenFullEditor }: NodeConfigPanelProps) {
  const [config, setConfig] = useState<any>(node.data.config || {})
  const [activeTab, setActiveTab] = useState("settings")

  useEffect(() => {
    setConfig(node.data.config || {})
  }, [node])

  const handleChange = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    onUpdateConfig({ config: newConfig })
  }

  // Find the handleNameChange function and update it
  const handleNameChange = (name: string) => {
    // This function is called when the node name input changes
    // We need to update the node's label in the parent component
    onUpdateConfig({ label: name })
  }

  // Determine if this node type should have connection options
  const isIntegration = node.type === "integration"
  const isBanking = node.type === "banking"
  const showConnectionOptions = true // Show for all node types

  // Common connection configuration section
  const renderConnectionOptions = () => {
    if (!showConnectionOptions) return null

    return (
      <div className="space-y-4 pt-4 border-t mt-4">
        <h4 className="font-medium text-sm">Connection Options</h4>

        {(isIntegration || isBanking) && (
          <div className="flex items-center space-x-2">
            <Switch
              id="isDataSource"
              checked={config.isDataSource || false}
              onCheckedChange={(checked) => handleChange("isDataSource", checked)}
            />
            <Label htmlFor="isDataSource">Is Data Source</Label>
            <div className="ml-1 text-xs text-muted-foreground">(Hides all connections)</div>
          </div>
        )}

        {!config.isDataSource && (
          <>
            <div className="flex items-center space-x-2">
              <Switch
                id="showInputConnections"
                checked={config.showInputConnections !== false}
                onCheckedChange={(checked) => handleChange("showInputConnections", checked)}
              />
              <Label htmlFor="showInputConnections">Show Input Connections</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="showOutputConnections"
                checked={config.showOutputConnections !== false}
                onCheckedChange={(checked) => handleChange("showOutputConnections", checked)}
              />
              <Label htmlFor="showOutputConnections">Show Output Connections</Label>
            </div>
          </>
        )}
      </div>
    )
  }

  const renderConfigFields = () => {
    switch (node.data.type) {
      // Trigger nodes
      case "webhook":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="path">Webhook Path</Label>
              <Input
                id="path"
                value={config.path || ""}
                onChange={(e) => handleChange("path", e.target.value)}
                placeholder="/webhook"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="method">HTTP Method</Label>
              <Select value={config.method || "POST"} onValueChange={(value) => handleChange("method", value)}>
                <SelectTrigger id="method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent className="fullscreen-dropdown-fix">
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {renderConnectionOptions()}
          </>
        )

      case "schedule":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select value={config.frequency || "daily"} onValueChange={(value) => handleChange("frequency", value)}>
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="fullscreen-dropdown-fix">
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="custom">Custom (CRON)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {config.frequency === "custom" ? (
              <div className="grid gap-2">
                <Label htmlFor="cron">CRON Expression</Label>
                <Input
                  id="cron"
                  value={config.cron || ""}
                  onChange={(e) => handleChange("cron", e.target.value)}
                  placeholder="0 0 * * *"
                />
                <p className="text-xs text-muted-foreground">CRON format: minute hour day month weekday</p>
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={config.time || ""}
                  onChange={(e) => handleChange("time", e.target.value)}
                />
              </div>
            )}
            {renderConnectionOptions()}
          </>
        )

      case "email":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="emailAccount">Email Account</Label>
              <Select value={config.emailAccount || ""} onValueChange={(value) => handleChange("emailAccount", value)}>
                <SelectTrigger id="emailAccount">
                  <SelectValue placeholder="Select email account" />
                </SelectTrigger>
                <SelectContent className="fullscreen-dropdown-fix">
                  <SelectItem value="support">support@example.com</SelectItem>
                  <SelectItem value="info">info@example.com</SelectItem>
                  <SelectItem value="sales">sales@example.com</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter">Filter Criteria</Label>
              <Input
                id="filter"
                value={config.filter || ""}
                onChange={(e) => handleChange("filter", e.target.value)}
                placeholder="from:example.com subject:important"
              />
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                id="includeAttachments"
                checked={config.includeAttachments || false}
                onCheckedChange={(checked) => handleChange("includeAttachments", checked)}
              />
              <Label htmlFor="includeAttachments">Include Attachments</Label>
            </div>
            {renderConnectionOptions()}
          </>
        )

      case "form":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="formId">Form ID</Label>
              <Select value={config.formId || ""} onValueChange={(value) => handleChange("formId", value)}>
                <SelectTrigger id="formId">
                  <SelectValue placeholder="Select form" />
                </SelectTrigger>
                <SelectContent className="fullscreen-dropdown-fix">
                  <SelectItem value="contact">Contact Form</SelectItem>
                  <SelectItem value="signup">Sign Up Form</SelectItem>
                  <SelectItem value="feedback">Feedback Form</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                id="validateData"
                checked={config.validateData || false}
                onCheckedChange={(checked) => handleChange("validateData", checked)}
              />
              <Label htmlFor="validateData">Validate Form Data</Label>
            </div>
            {renderConnectionOptions()}
          </>
        )

      case "database-change":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="database">Database</Label>
              <Select value={config.database || ""} onValueChange={(value) => handleChange("database", value)}>
                <SelectTrigger id="database">
                  <SelectValue placeholder="Select database" />
                </SelectTrigger>
                <SelectContent className="fullscreen-dropdown-fix">
                  <SelectItem value="customers">Customers</SelectItem>
                  <SelectItem value="orders">Orders</SelectItem>
                  <SelectItem value="products">Products</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="operation">Operation</Label>
              <Select value={config.operation || "any"} onValueChange={(value) => handleChange("operation", value)}>
                <SelectTrigger id="operation">
                  <SelectValue placeholder="Select operation" />
                </SelectTrigger>
                <SelectContent className="fullscreen-dropdown-fix">
                  <SelectItem value="any">Any Change</SelectItem>
                  <SelectItem value="insert">Insert</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="condition">Condition (Optional)</Label>
              <Textarea
                id="condition"
                value={config.condition || ""}
                onChange={(e) => handleChange("condition", e.target.value)}
                placeholder="WHERE status = 'new'"
              />
            </div>
            {renderConnectionOptions()}
          </>
        )

      case "interval":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="intervalValue">Interval</Label>
              <div className="flex gap-2">
                <Input
                  id="intervalValue"
                  type="number"
                  min="1"
                  value={config.intervalValue || "5"}
                  onChange={(e) => handleChange("intervalValue", e.target.value)}
                  className="w-20"
                />
                <Select
                  value={config.intervalUnit || "minutes"}
                  onValueChange={(value) => handleChange("intervalUnit", value)}
                >
                  <SelectTrigger id="intervalUnit" className="flex-1">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className="fullscreen-dropdown-fix">
                    <SelectItem value="seconds">Seconds</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                id="runImmediately"
                checked={config.runImmediately || false}
                onCheckedChange={(checked) => handleChange("runImmediately", checked)}
              />
              <Label htmlFor="runImmediately">Run Immediately</Label>
            </div>
            {renderConnectionOptions()}
          </>
        )

      // Action nodes
      case "chat":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="channel">Channel</Label>
              <Select value={config.channel || "all"} onValueChange={(value) => handleChange("channel", value)}>
                <SelectTrigger id="channel">
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent className="fullscreen-dropdown-fix">
                  <SelectItem value="all">All Channels</SelectItem>
                  <SelectItem value="web">Web Chat</SelectItem>
                  <SelectItem value="slack">Slack</SelectItem>
                  <SelectItem value="discord">Discord</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter">Message Filter</Label>
              <Input
                id="filter"
                value={config.filter || ""}
                onChange={(e) => handleChange("filter", e.target.value)}
                placeholder="Optional filter expression"
              />
            </div>
            {renderConnectionOptions()}
          </>
        )

      case "http":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={config.url || ""}
                onChange={(e) => handleChange("url", e.target.value)}
                placeholder="https://api.example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="method">HTTP Method</Label>
              <Select value={config.method || "GET"} onValueChange={(value) => handleChange("method", value)}>
                <SelectTrigger id="method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent className="fullscreen-dropdown-fix">
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="body">Request Body</Label>
              <Textarea
                id="body"
                value={config.body || ""}
                onChange={(e) => handleChange("body", e.target.value)}
                placeholder="{}"
              />
            </div>
            {renderConnectionOptions()}
          </>
        )

      case "googlesheets":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="operation">Operation</Label>
              <Select value={config.operation || "read"} onValueChange={(value) => handleChange("operation", value)}>
                <SelectTrigger id="operation">
                  <SelectValue placeholder="Select operation" />
                </SelectTrigger>
                <SelectContent className="fullscreen-dropdown-fix">
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="write">Write</SelectItem>
                  <SelectItem value="append">Append</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="spreadsheetId">Spreadsheet ID</Label>
              <Input
                id="spreadsheetId"
                value={config.spreadsheetId || ""}
                onChange={(e) => handleChange("spreadsheetId", e.target.value)}
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="range">Range</Label>
              <Input
                id="range"
                value={config.range || ""}
                onChange={(e) => handleChange("range", e.target.value)}
                placeholder="Sheet1!A1:D10"
              />
            </div>
            {renderConnectionOptions()}
          </>
        )

      case "file-operations":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="operation">Operation</Label>
              <Select value={config.operation || "read"} onValueChange={(value) => handleChange("operation", value)}>
                <SelectTrigger id="operation">
                  <SelectValue placeholder="Select operation" />
                </SelectTrigger>
                <SelectContent className="fullscreen-dropdown-fix">
                  <SelectItem value="read">Read File</SelectItem>
                  <SelectItem value="write">Write File</SelectItem>
                  <SelectItem value="append">Append to File</SelectItem>
                  <SelectItem value="delete">Delete File</SelectItem>
                  <SelectItem value="copy">Copy File</SelectItem>
                  <SelectItem value="move">Move File</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filePath">File Path</Label>
              <Input
                id="filePath"
                value={config.filePath || ""}
                onChange={(e) => handleChange("filePath", e.target.value)}
                placeholder="/path/to/file.txt"
              />
            </div>
            {(config.operation === "write" || config.operation === "append") && (
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={config.content || ""}
                  onChange={(e) => handleChange("content", e.target.value)}
                  placeholder="File content"
                />
              </div>
            )}
            {(config.operation === "copy" || config.operation === "move") && (
              <div className="grid gap-2">
                <Label htmlFor="destination">Destination Path</Label>
                <Input
                  id="destination"
                  value={config.destination || ""}
                  onChange={(e) => handleChange("destination", e.target.value)}
                  placeholder="/path/to/destination.txt"
                />
              </div>
            )}
            {renderConnectionOptions()}
          </>
        )

      case "sms":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="to">To Number</Label>
              <Input
                id="to"
                value={config.to || ""}
                onChange={(e) => handleChange("to", e.target.value)}
                placeholder="+1234567890"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={config.message || ""}
                onChange={(e) => handleChange("message", e.target.value)}
                placeholder="SMS message content"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="provider">Provider</Label>
              <Select value={config.provider || "twilio"} onValueChange={(value) => handleChange("provider", value)}>
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent className="fullscreen-dropdown-fix">
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="nexmo">Nexmo</SelectItem>
                  <SelectItem value="aws">AWS SNS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {renderConnectionOptions()}
          </>
        )

      case "pdf":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="template">Template</Label>
              <Select value={config.template || "invoice"} onValueChange={(value) => handleChange("template", value)}>
                <SelectTrigger id="template">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent className="fullscreen-dropdown-fix">
                  <SelectItem value="invoice">Invoice</SelectItem>
                  <SelectItem value="report">Report</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="outputPath">Output Path</Label>
              <Input
                id="outputPath"
                value={config.outputPath || ""}
                onChange={(e) => handleChange("outputPath", e.target.value)}
                placeholder="/path/to/output.pdf"
              />
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                id="sendEmail"
                checked={config.sendEmail || false}
                onCheckedChange={(checked) => handleChange("sendEmail", checked)}
              />
              <Label htmlFor="sendEmail">Send via Email</Label>
            </div>
            {renderConnectionOptions()}
          </>
        )

      case "calendar":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="operation">Operation</Label>
              <Select value={config.operation || "create"} onValueChange={(value) => handleChange("operation", value)}>
                <SelectTrigger id="operation">
                  <SelectValue placeholder="Select operation" />
                </SelectTrigger>
                <SelectContent className="fullscreen-dropdown-fix">
                  <SelectItem value="create">Create Event</SelectItem>
                  <SelectItem value="update">Update Event</SelectItem>
                  <SelectItem value="delete">Delete Event</SelectItem>
                  <SelectItem value="list">List Events</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(config.operation === "create" || config.operation === "update") && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={config.title || ""}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Meeting with Client"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="start">Start Date/Time</Label>
                  <Input
                    id="start"
                    type="datetime-local"
                    value={config.start || ""}
                    onChange={(e) => handleChange("start", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end">End Date/Time</Label>
                  <Input
                    id="end"
                    type="datetime-local"
                    value={config.end || ""}
                    onChange={(e) => handleChange("end", e.target.value)}
                  />
                </div>
              </>
            )}
            {renderConnectionOptions()}
          </>
        )

      // Logic nodes
      case "if":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="condition">Condition</Label>
              <Textarea
                id="condition"
                value={config.condition || ""}
                onChange={(e) => handleChange("condition", e.target.value)}
                placeholder={'{{$node["Previous Node"].json["property"] === true}}'}
                className="min-h-[100px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use expressions to define the condition. The "true" path will be taken if the condition evaluates to
                true.
              </p>
            </div>
            {renderConnectionOptions()}
          </>
        )

      case "switch":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="expression">Expression</Label>
              <Textarea
                id="expression"
                value={config.expression || ""}
                onChange={(e) => handleChange("expression", e.target.value)}
                placeholder={'{{$node["Previous Node"].json["status"]}}'}
                className="min-h-[80px] font-mono text-sm"
              />
            </div>
            <div className="grid gap-2 mt-4">
              <Label className="flex items-center justify-between">
                <span>Cases</span>
                <Button variant="outline" size="sm">
                  Add Case
                </Button>
              </Label>
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Case value"
                    value={config.case1 || ""}
                    onChange={(e) => handleChange("case1", e.target.value)}
                  />
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Case value"
                    value={config.case2 || ""}
                    onChange={(e) => handleChange("case2", e.target.value)}
                  />
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            {renderConnectionOptions()}
          </>
        )

      case "delay":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="delayValue">Delay Duration</Label>
              <div className="flex gap-2">
                <Input
                  id="delayValue"
                  type="number"
                  min="1"
                  value={config.delayValue || "5"}
                  onChange={(e) => handleChange("delayValue", e.target.value)}
                  className="w-20"
                />
                <Select
                  value={config.delayUnit || "seconds"}
                  onValueChange={(value) => handleChange("delayUnit", value)}
                >
                  <SelectTrigger id="delayUnit" className="flex-1">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className="fullscreen-dropdown-fix">
                    <SelectItem value="seconds">Seconds</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {renderConnectionOptions()}
          </>
        )

      case "filter-array":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="inputArray">Input Array</Label>
              <Textarea
                id="inputArray"
                value={config.inputArray || ""}
                onChange={(e) => handleChange("inputArray", e.target.value)}
                placeholder={'{{$node["Previous Node"].json["items"]}}'}
                className="min-h-[80px] font-mono text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filterCondition">Filter Condition</Label>
              <Textarea
                id="filterCondition"
                value={config.filterCondition || ""}
                onChange={(e) => handleChange("filterCondition", e.target.value)}
                placeholder={'item => item.status === "active"'}
                className="min-h-[80px] font-mono text-sm"
              />
            </div>
            {renderConnectionOptions()}
          </>
        )

      // Code nodes
      case "javascript":
      case "python":
      case "c":
      case "bash":
      case "powershell":
        return (
          <>
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="code">Code</Label>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                  onClick={() => onOpenFullEditor && onOpenFullEditor(node)}
                >
                  Edit in Full Editor
                </Button>
              </div>
              <Textarea
                id="code"
                value={config.code || ""}
                onChange={(e) => handleChange("code", e.target.value)}
                placeholder={
                  node.data.type === "javascript"
                    ? "// Write your JavaScript code here\n// You can access input data via the 'input' variable\n// Example: return { result: input.value * 2 };"
                    : node.data.type === "python"
                      ? "# Write your Python code here\n# You can access input data via the 'input' variable\n# Example: return { 'result': input['value'] * 2 }"
                      : node.data.type === "c"
                        ? "// Write your C code here\n#include <stdio.h>\n\nint main() {\n  // Your code here\n  return 0;\n}"
                        : node.data.type === "bash"
                          ? '#!/bin/bash\n# Write your Bash script here\n\n# Example:\n# echo "Processing input: $1"'
                          : '# Write your PowerShell script here\n\n# Example:\n$input | ForEach-Object { Write-Output "Processing: $_" }'
                }
                className="min-h-200px font-mono text-sm"
                rows={15}
              />
            </div>
            <div className="grid gap-2 mt-4">
              <Label htmlFor="customInputs">Custom Input Parameters</Label>
              <Textarea
                id="customInputs"
                value={config.customInputs || ""}
                onChange={(e) => handleChange("customInputs", e.target.value)}
                placeholder="Enter parameter names, one per line (e.g. apiKey, threshold)"
                className="min-h-[80px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">These parameters will be available in your code</p>
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <Switch
                id="enableSandbox"
                checked={config.enableSandbox !== false}
                onCheckedChange={(checked) => handleChange("enableSandbox", checked)}
              />
              <Label htmlFor="enableSandbox">Enable Sandbox Mode</Label>
              <div className="ml-1 text-xs text-muted-foreground">(Recommended for security)</div>
            </div>
            {renderConnectionOptions()}
          </>
        )

      case "transform":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="inputData">Input Data</Label>
              <Textarea
                id="inputData"
                value={config.inputData || ""}
                onChange={(e) => handleChange("inputData", e.target.value)}
                placeholder={'{{$node["Previous Node"].json}}'}
                className="min-h-[80px] font-mono text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="transformationCode">Transformation Code</Label>
              <Textarea
                id="transformationCode"
                value={config.transformationCode || ""}
                onChange={(e) => handleChange("transformationCode", e.target.value)}
                placeholder={"// Transform the input data\nreturn {\n  result: input.map(item => item.value * 2)\n}"}
                className="min-h-[120px] font-mono text-sm"
              />
            </div>
            {renderConnectionOptions()}
          </>
        )

      // AI nodes
      case "ai-agent":
        return (
          <>
            <Tabs defaultValue="settings" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="prompt">Prompt</TabsTrigger>
                <TabsTrigger value="tools">Tools</TabsTrigger>
                <TabsTrigger value="fine-tuning">Fine-tuning</TabsTrigger>
              </TabsList>
              <TabsContent value="settings" className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="model">AI Model</Label>
                  <Select value={config.model || "gpt-4"} onValueChange={(value) => handleChange("model", value)}>
                    <SelectTrigger id="model">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent className="fullscreen-dropdown-fix">
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude-3">Claude 3</SelectItem>
                      <SelectItem value="custom-fine-tuned">Custom Fine-tuned Model</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {config.model === "custom-fine-tuned" && (
                  <div className="grid gap-2">
                    <Label htmlFor="customModelId">Custom Model ID</Label>
                    <Input
                      id="customModelId"
                      value={config.customModelId || ""}
                      onChange={(e) => handleChange("customModelId", e.target.value)}
                      placeholder="ft:gpt-4:my-org:custom-model:1234"
                    />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={config.temperature || "0.7"}
                    onChange={(e) => handleChange("temperature", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maxTokens">Max Tokens</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    min="1"
                    value={config.maxTokens || "2048"}
                    onChange={(e) => handleChange("maxTokens", e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="useMemory"
                    checked={config.useMemory || false}
                    onCheckedChange={(checked) => handleChange("useMemory", checked)}
                  />
                  <Label htmlFor="useMemory">Use Memory</Label>
                </div>
              </TabsContent>
              <TabsContent value="prompt" className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="systemPrompt">System Prompt</Label>
                  <Textarea
                    id="systemPrompt"
                    value={config.systemPrompt || ""}
                    onChange={(e) => handleChange("systemPrompt", e.target.value)}
                    placeholder="You are a helpful assistant."
                    className="min-h-[150px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="userPrompt">User Prompt Template</Label>
                  <Textarea
                    id="userPrompt"
                    value={config.userPrompt || ""}
                    onChange={(e) => handleChange("userPrompt", e.target.value)}
                    placeholder={'{{$node["Previous Node"].json["message"]}}'}
                    className="min-h-[100px]"
                  />
                </div>
              </TabsContent>
              <TabsContent value="tools" className="space-y-4">
                <div className="grid gap-2">
                  <Label className="flex items-center justify-between">
                    <span>Available Tools</span>
                    <Button variant="outline" size="sm">
                      Add Tool
                    </Button>
                  </Label>
                  <div className="border rounded-md p-2 space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          Chat Model
                        </Badge>
                        <span className="text-sm">OpenAI Chat</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          Memory
                        </Badge>
                        <span className="text-sm">Window Buffer</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          Tool
                        </Badge>
                        <span className="text-sm">SerpAPI</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="fine-tuning" className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="customInstructions">Custom Instructions</Label>
                  <Textarea
                    id="customInstructions"
                    value={config.customInstructions || ""}
                    onChange={(e) => handleChange("customInstructions", e.target.value)}
                    placeholder="Provide specific instructions for how the AI should behave, what knowledge it should have, and any constraints it should follow."
                    className="min-h-[150px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    These instructions will guide the AI's behavior when responding to user prompts
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="persona">AI Persona</Label>
                  <Select value={config.persona || "default"} onValueChange={(value) => handleChange("persona", value)}>
                    <SelectTrigger id="persona">
                      <SelectValue placeholder="Select persona" />
                    </SelectTrigger>
                    <SelectContent className="fullscreen-dropdown-fix">
                      <SelectItem value="default">Default Assistant</SelectItem>
                      <SelectItem value="customer-support">Customer Support</SelectItem>
                      <SelectItem value="technical">Technical Expert</SelectItem>
                      <SelectItem value="creative">Creative Assistant</SelectItem>
                      <SelectItem value="custom">Custom Persona</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {config.persona === "custom" && (
                  <div className="grid gap-2">
                    <Label htmlFor="customPersona">Custom Persona Description</Label>
                    <Textarea
                      id="customPersona"
                      value={config.customPersona || ""}
                      onChange={(e) => handleChange("customPersona", e.target.value)}
                      placeholder="Describe the persona the AI should adopt (e.g., tone, style, expertise level)"
                      className="min-h-[100px]"
                    />
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="trainingData">Training Data Source</Label>
                  <Select
                    value={config.trainingData || "none"}
                    onValueChange={(value) => handleChange("trainingData", value)}
                  >
                    <SelectTrigger id="trainingData">
                      <SelectValue placeholder="Select training data source" />
                    </SelectTrigger>
                    <SelectContent className="fullscreen-dropdown-fix">
                      <SelectItem value="none">None (Use Base Model)</SelectItem>
                      <SelectItem value="file-upload">File Upload</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="api">External API</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {config.trainingData !== "none" && (
                  <div className="grid gap-2">
                    <Label htmlFor="trainingDataConfig">Training Data Configuration</Label>
                    <Textarea
                      id="trainingDataConfig"
                      value={config.trainingDataConfig || ""}
                      onChange={(e) => handleChange("trainingDataConfig", e.target.value)}
                      placeholder={
                        config.trainingData === "file-upload"
                          ? "Enter file paths or IDs"
                          : config.trainingData === "database"
                            ? "Enter database query or table name"
                            : "Enter API endpoint and parameters"
                      }
                      className="min-h-[80px]"
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
            {renderConnectionOptions()}
          </>
        )

      case "text-classification":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="model">Model</Label>
              <Select value={config.model || "gpt-4"} onValueChange={(value) => handleChange("model", value)}>
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent className="fullscreen-dropdown-fix">
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="bert">BERT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="inputText">Input Text</Label>
              <Textarea
                id="inputText"
                value={config.inputText || ""}
                onChange={(e) => handleChange("inputText", e.target.value)}
                placeholder={'{{$node["Previous Node"].json["text"]}}'}
                className="min-h-[80px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="categories">Categories</Label>
              <Textarea
                id="categories"
                value={config.categories || ""}
                onChange={(e) => handleChange("categories", e.target.value)}
                placeholder="support, sales, feedback, complaint"
                className="min-h-[60px]"
              />
              <p className="text-xs text-muted-foreground">Comma-separated list of categories</p>
            </div>
            {renderConnectionOptions()}
          </>
        )

      case "sentiment-analysis":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="inputText">Input Text</Label>
              <Textarea
                id="inputText"
                value={config.inputText || ""}
                onChange={(e) => handleChange("inputText", e.target.value)}
                placeholder={'{{$node["Previous Node"].json["text"]}}'}
                className="min-h-[80px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="outputFormat">Output Format</Label>
              <Select
                value={config.outputFormat || "basic"}
                onValueChange={(value) => handleChange("outputFormat", value)}
              >
                <SelectTrigger id="outputFormat">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent className="fullscreen-dropdown-fix">
                  <SelectItem value="basic">Basic (Positive/Negative/Neutral)</SelectItem>
                  <SelectItem value="score">Numerical Score (-1 to 1)</SelectItem>
                  <SelectItem value="detailed">Detailed Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {renderConnectionOptions()}
          </>
        )

      // Integration nodes
      case "salesforce":
      case "stripe":
      case "google-analytics":
      case "slack":
      case "zendesk":
      case "hubspot":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="operation">Operation</Label>
              <Select value={config.operation || "query"} onValueChange={(value) => handleChange("operation", value)}>
                <SelectTrigger id="operation">
                  <SelectValue placeholder="Select operation" />
                </SelectTrigger>
                <SelectContent className="fullscreen-dropdown-fix">
                  <SelectItem value="query">Query</SelectItem>
                  <SelectItem value="create">Create Record</SelectItem>
                  <SelectItem value="update">Update Record</SelectItem>
                  <SelectItem value="delete">Delete Record</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="object">Object</Label>
              <Select value={config.object || "Account"} onValueChange={(value) => handleChange("object", value)}>
                <SelectTrigger id="object">
                  <SelectValue placeholder="Select object" />
                </SelectTrigger>
                <SelectContent className="fullscreen-dropdown-fix">
                  <SelectItem value="Account">Account</SelectItem>
                  <SelectItem value="Contact">Contact</SelectItem>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Opportunity">Opportunity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {config.operation === "query" && (
              <div className="grid gap-2">
                <Label htmlFor="soql">SOQL Query</Label>
                <Textarea
                  id="soql"
                  value={config.soql || ""}
                  onChange={(e) => handleChange("soql", e.target.value)}
                  placeholder="SELECT Id, Name FROM Account LIMIT 10"
                  className="min-h-[80px] font-mono text-sm"
                />
              </div>
            )}
            {(config.operation === "create" || config.operation === "update") && (
              <div className="grid gap-2">
                <Label htmlFor="fields">Fields</Label>
                <Textarea
                  id="fields"
                  value={config.fields || ""}
                  onChange={(e) => handleChange("fields", e.target.value)}
                  placeholder={'{\n  "Name": "New Account",\n  "Industry": "Technology"\n}'}
                  className="min-h-[120px] font-mono text-sm"
                />
              </div>
            )}
            {renderConnectionOptions()}
          </>
        )

      // Banking nodes
      case "transaction-processing":
      case "account-verification":
      case "fraud-detection":
      case "kyc":
      case "loan-approval":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor="transactionType">Transaction Type</Label>
              <Select
                value={config.transactionType || "payment"}
                onValueChange={(value) => handleChange("transactionType", value)}
              >
                <SelectTrigger id="transactionType">
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent className="fullscreen-dropdown-fix">
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {renderConnectionOptions()}
          </>
        )

      case "message":
        return (
          <>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={config.message || ""}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder={'Enter message content or use an expression like {{$node["AI Agent"].json["response"]}}'}
                  className="min-h-[150px]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="channel">Channel</Label>
                <Select value={config.channel || "reply"} onValueChange={(value) => handleChange("channel", value)}>
                  <SelectTrigger id="channel">
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent className="fullscreen-dropdown-fix">
                    <SelectItem value="reply">Reply to Original</SelectItem>
                    <SelectItem value="web">Web Chat</SelectItem>
                    <SelectItem value="slack">Slack</SelectItem>
                    <SelectItem value="discord">Discord</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {renderConnectionOptions()}
          </>
        )

      default:
        return (
          <>
            <div className="text-sm text-muted-foreground">
              No specific configuration options available for this node type.
            </div>
            {renderConnectionOptions()}
          </>
        )
    }
  }

  return (
    <div className="space-y-4">
      // Find the Input component for the node name and update it
      <div className="grid gap-2">
        <Label htmlFor="name">Node Name</Label>
        <Input id="name" value={node.data.label} onChange={(e) => handleNameChange(e.target.value)} />
      </div>
      {renderConfigFields()}
    </div>
  )
}

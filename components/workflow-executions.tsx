"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Calendar,
  RefreshCw,
  Eye,
  Play,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  Download,
} from "lucide-react"

// Mock data for executions
const mockExecutions = [
  {
    id: "exec-001",
    status: "success",
    startTime: "2023-04-08T10:15:30Z",
    endTime: "2023-04-08T10:16:45Z",
    duration: "1m 15s",
    triggeredBy: "John Doe",
    triggerType: "manual",
    nodeCount: 8,
    dataProcessed: "1.2 MB",
  },
  {
    id: "exec-002",
    status: "failed",
    startTime: "2023-04-08T09:30:00Z",
    endTime: "2023-04-08T09:30:22Z",
    duration: "22s",
    triggeredBy: "API Webhook",
    triggerType: "webhook",
    nodeCount: 5,
    dataProcessed: "450 KB",
    error: "Connection timeout at 'Database Query' node",
  },
  {
    id: "exec-003",
    status: "running",
    startTime: "2023-04-08T11:05:12Z",
    endTime: null,
    duration: "running",
    triggeredBy: "Scheduler",
    triggerType: "scheduled",
    nodeCount: 12,
    dataProcessed: "3.5 MB",
  },
  {
    id: "exec-004",
    status: "success",
    startTime: "2023-04-07T16:22:45Z",
    endTime: "2023-04-07T16:24:10Z",
    duration: "1m 25s",
    triggeredBy: "Sarah Johnson",
    triggerType: "manual",
    nodeCount: 8,
    dataProcessed: "2.1 MB",
  },
  {
    id: "exec-005",
    status: "failed",
    startTime: "2023-04-07T14:10:30Z",
    endTime: "2023-04-07T14:11:02Z",
    duration: "32s",
    triggeredBy: "Integration Trigger",
    triggerType: "integration",
    nodeCount: 6,
    dataProcessed: "780 KB",
    error: "Invalid data format at 'Data Transformation' node",
  },
  {
    id: "exec-006",
    status: "success",
    startTime: "2023-04-07T11:45:20Z",
    endTime: "2023-04-07T11:46:15Z",
    duration: "55s",
    triggeredBy: "Scheduler",
    triggerType: "scheduled",
    nodeCount: 10,
    dataProcessed: "1.8 MB",
  },
  {
    id: "exec-007",
    status: "success",
    startTime: "2023-04-06T09:30:00Z",
    endTime: "2023-04-06T09:31:20Z",
    duration: "1m 20s",
    triggeredBy: "Michael Brown",
    triggerType: "manual",
    nodeCount: 7,
    dataProcessed: "950 KB",
  },
  {
    id: "exec-008",
    status: "cancelled",
    startTime: "2023-04-06T15:20:10Z",
    endTime: "2023-04-06T15:20:45Z",
    duration: "35s",
    triggeredBy: "Emily Davis",
    triggerType: "manual",
    nodeCount: 4,
    dataProcessed: "320 KB",
  },
  {
    id: "exec-009",
    status: "success",
    startTime: "2023-04-05T13:15:30Z",
    endTime: "2023-04-05T13:17:00Z",
    duration: "1m 30s",
    triggeredBy: "API Webhook",
    triggerType: "webhook",
    nodeCount: 9,
    dataProcessed: "2.5 MB",
  },
  {
    id: "exec-010",
    status: "failed",
    startTime: "2023-04-05T10:05:15Z",
    endTime: "2023-04-05T10:05:45Z",
    duration: "30s",
    triggeredBy: "Scheduler",
    triggerType: "scheduled",
    nodeCount: 11,
    dataProcessed: "1.5 MB",
    error: "Authentication failed at 'API Request' node",
  },
]

export default function WorkflowExecutions() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [triggerFilter, setTriggerFilter] = useState("all")
  const [selectedExecution, setSelectedExecution] = useState(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  // Filter executions based on search and filters
  const filteredExecutions = mockExecutions.filter((execution) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      execution.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      execution.triggeredBy.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || execution.status === statusFilter

    // Trigger filter
    const matchesTrigger = triggerFilter === "all" || execution.triggerType === triggerFilter

    return matchesSearch && matchesStatus && matchesTrigger
  })

  const viewExecutionDetails = (execution) => {
    setSelectedExecution(execution)
    setDetailsOpen(true)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Success
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        )
      case "running":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400">
            <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
            Running
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            <AlertCircle className="mr-1 h-3 w-3" />
            Cancelled
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search executions..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="h-9">
            <Calendar className="mr-2 h-4 w-4" />
            Date Range
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Select value={triggerFilter} onValueChange={setTriggerFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Trigger" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Triggers</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
                <SelectItem value="integration">Integration</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm" className="h-9">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="h-9">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Triggered By</TableHead>
              <TableHead>Data Processed</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExecutions.map((execution) => (
              <TableRow key={execution.id}>
                <TableCell className="font-mono text-xs">{execution.id}</TableCell>
                <TableCell>{getStatusBadge(execution.status)}</TableCell>
                <TableCell>{new Date(execution.startTime).toLocaleString()}</TableCell>
                <TableCell>
                  {execution.status === "running" ? (
                    <span className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      Running
                    </span>
                  ) : (
                    execution.duration
                  )}
                </TableCell>
                <TableCell>{execution.triggeredBy}</TableCell>
                <TableCell>{execution.dataProcessed}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => viewExecutionDetails(execution)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {execution.status === "failed" && (
                      <Button variant="ghost" size="icon" title="Retry Execution">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Execution Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Execution Details: {selectedExecution?.id}</DialogTitle>
            <DialogDescription>
              {selectedExecution?.status === "running"
                ? "This workflow execution is currently running."
                : `This workflow execution ${
                    selectedExecution?.status === "success" ? "completed successfully" : "failed"
                  }.`}
            </DialogDescription>
          </DialogHeader>

          {selectedExecution && (
            <ScrollArea className="max-h-[500px]">
              <div className="space-y-6 p-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                    <div>{getStatusBadge(selectedExecution.status)}</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Trigger Type</h4>
                    <p className="capitalize">{selectedExecution.triggerType}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Start Time</h4>
                    <p>{new Date(selectedExecution.startTime).toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">End Time</h4>
                    <p>
                      {selectedExecution.endTime
                        ? new Date(selectedExecution.endTime).toLocaleString()
                        : "Still running"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Duration</h4>
                    <p>{selectedExecution.duration}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Triggered By</h4>
                    <p>{selectedExecution.triggeredBy}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Nodes Executed</h4>
                    <p>{selectedExecution.nodeCount}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Data Processed</h4>
                    <p>{selectedExecution.dataProcessed}</p>
                  </div>
                </div>

                {selectedExecution.error && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Error</h4>
                    <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-md p-3 text-red-800 dark:text-red-300">
                      {selectedExecution.error}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Execution Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500"></div>
                      <div>
                        <p className="font-medium">Workflow Started</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(selectedExecution.startTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500"></div>
                      <div>
                        <p className="font-medium">HTTP Trigger Activated</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(new Date(selectedExecution.startTime).getTime() + 2000).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500"></div>
                      <div>
                        <p className="font-medium">Data Transformation Completed</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(new Date(selectedExecution.startTime).getTime() + 15000).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {selectedExecution.status === "failed" ? (
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-red-500"></div>
                        <div>
                          <p className="font-medium">Execution Failed</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedExecution.endTime ? new Date(selectedExecution.endTime).toLocaleString() : "N/A"}
                          </p>
                          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{selectedExecution.error}</p>
                        </div>
                      </div>
                    ) : selectedExecution.status === "success" ? (
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500"></div>
                        <div>
                          <p className="font-medium">Execution Completed Successfully</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedExecution.endTime ? new Date(selectedExecution.endTime).toLocaleString() : "N/A"}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                        <div>
                          <p className="font-medium">Execution In Progress</p>
                          <p className="text-sm text-muted-foreground">Current step: Database Update</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Input/Output Data</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Input Payload</p>
                      <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto">
                        {JSON.stringify(
                          {
                            customerId: "cust-12345",
                            orderDetails: {
                              orderId: "ord-9876",
                              items: [
                                { productId: "prod-001", quantity: 2, price: 29.99 },
                                { productId: "prod-005", quantity: 1, price: 49.99 },
                              ],
                              totalAmount: 109.97,
                            },
                            shippingAddress: {
                              street: "123 Main St",
                              city: "Anytown",
                              state: "CA",
                              zipCode: "12345",
                            },
                          },
                          null,
                          2,
                        )}
                      </pre>
                    </div>
                    {selectedExecution.status === "success" && (
                      <div>
                        <p className="text-sm font-medium mb-1">Output Result</p>
                        <pre className="bg-muted p-2 rounded-md text-xs overflow-x-auto">
                          {JSON.stringify(
                            {
                              success: true,
                              orderId: "ord-9876",
                              orderStatus: "processed",
                              transactionId: "tx-87654321",
                              estimatedDelivery: "2023-04-12T00:00:00Z",
                              customerNotified: true,
                            },
                            null,
                            2,
                          )}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

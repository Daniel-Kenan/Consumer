"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Shield,
  Settings,
  Bell,
  Clock,
  Save,
  PlusCircle,
  HelpCircle,
  Trash2,
  Edit,
  Info,
  CheckCircle2,
  Calendar,
  Mail,
  Smartphone,
  Webhook,
  FileText,
  Download,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

// Mock data for users and roles
const mockUsers = [
  {
    id: "user-001",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    lastActive: "2023-04-07T15:30:00Z",
  },
  {
    id: "user-002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "editor",
    lastActive: "2023-04-08T09:15:00Z",
  },
  {
    id: "user-003",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "viewer",
    lastActive: "2023-04-06T11:45:00Z",
  },
  {
    id: "user-004",
    name: "Alice Williams",
    email: "alice.williams@example.com",
    role: "editor",
    lastActive: "2023-04-08T10:20:00Z",
  },
  {
    id: "user-005",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    role: "viewer",
    lastActive: "2023-04-05T14:10:00Z",
  },
]

const rolePermissions = {
  admin: {
    name: "Administrator",
    description: "Full access to all workflow features and settings",
    permissions: [
      "Create workflows",
      "Edit workflows",
      "Delete workflows",
      "Execute workflows",
      "Manage users",
      "Configure settings",
      "View audit logs",
      "Manage credentials",
    ],
  },
  editor: {
    name: "Editor",
    description: "Can create and edit workflows, but cannot manage users or system settings",
    permissions: ["Create workflows", "Edit workflows", "Execute workflows", "View audit logs", "Use credentials"],
  },
  viewer: {
    name: "Viewer",
    description: "Read-only access to workflows and executions",
    permissions: ["View workflows", "View executions", "View audit logs"],
  },
}

// Mock audit logs
const auditLogs = [
  {
    id: "log-001",
    timestamp: "2023-04-08T10:15:30Z",
    user: "John Doe",
    action: "Workflow Edited",
    details: "Modified 'Customer Onboarding' workflow",
    ip: "192.168.1.100",
  },
  {
    id: "log-002",
    timestamp: "2023-04-08T09:30:00Z",
    user: "Jane Smith",
    action: "Workflow Executed",
    details: "Manually triggered 'Transaction Monitoring' workflow",
    ip: "192.168.1.101",
  },
  {
    id: "log-003",
    timestamp: "2023-04-07T16:45:20Z",
    user: "System",
    action: "Credential Updated",
    details: "API key for 'Payment Gateway' updated",
    ip: "192.168.1.1",
  },
  {
    id: "log-004",
    timestamp: "2023-04-07T14:20:15Z",
    user: "Bob Johnson",
    action: "User Login",
    details: "Successful login",
    ip: "192.168.1.102",
  },
  {
    id: "log-005",
    timestamp: "2023-04-07T11:10:05Z",
    user: "Alice Williams",
    action: "Workflow Created",
    details: "Created new 'Customer Data Sync' workflow",
    ip: "192.168.1.103",
  },
]

export default function WorkflowSettings() {
  const [settingsTab, setSettingsTab] = useState("general")
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false)
  const [editRoleDialogOpen, setEditRoleDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)

  const openEditRoleDialog = (role) => {
    setSelectedRole(role)
    setEditRoleDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <Tabs value={settingsTab} onValueChange={setSettingsTab} className="w-full">
        <TabsList className="w-full grid grid-cols-5 mb-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="access" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Access Control
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="scheduling" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Scheduling
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Audit Logs
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Configuration</CardTitle>
              <CardDescription>Configure general settings for this workflow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeout">Execution Timeout (seconds)</Label>
                  <Input id="timeout" type="number" defaultValue={300} />
                  <p className="text-sm text-muted-foreground">
                    Maximum time a workflow can run before being terminated
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retries">Max Retries</Label>
                  <Input id="retries" type="number" defaultValue={3} />
                  <p className="text-sm text-muted-foreground">Number of times to retry the workflow on failure</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="error-workflow">Error Handling Workflow</Label>
                <Select defaultValue="none">
                  <SelectTrigger id="error-workflow">
                    <SelectValue placeholder="Select error handling workflow" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="error-logger">Error Logger</SelectItem>
                    <SelectItem value="notification">Notification Workflow</SelectItem>
                    <SelectItem value="retry-manager">Retry Manager</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Workflow to execute when this workflow fails</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="active-switch">Active</Label>
                  <Switch id="active-switch" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">Enable or disable this workflow</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="logging-switch">Detailed Logging</Label>
                  <Switch id="logging-switch" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">Enable detailed execution logging for debugging</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Version Control</CardTitle>
              <CardDescription>Configure version control settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="versioning-switch">Enable Versioning</Label>
                  <Switch id="versioning-switch" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">Keep track of workflow changes with version history</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-versions">Maximum Versions to Keep</Label>
                <Input id="max-versions" type="number" defaultValue={10} />
                <p className="text-sm text-muted-foreground">Number of previous versions to retain</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Access Control */}
        <TabsContent value="access" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Access</CardTitle>
                <CardDescription>Manage user access to this workflow</CardDescription>
              </div>
              <Button onClick={() => setAddUserDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={user.role === "admin" ? "default" : user.role === "editor" ? "outline" : "secondary"}
                        >
                          {rolePermissions[user.role].name}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.lastActive).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Role Management</CardTitle>
                <CardDescription>Configure roles and permissions</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(rolePermissions).map(([roleKey, role]) => (
                  <div key={roleKey} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium">{role.name}</h3>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                      </div>
                      <Button variant="outline" onClick={() => openEditRoleDialog(roleKey)}>
                        Edit Role
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {role.permissions.map((permission) => (
                        <div key={permission} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure when and how to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Events</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-success">Workflow Execution Success</Label>
                    <Switch id="notify-success" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-failure">Workflow Execution Failure</Label>
                    <Switch id="notify-failure" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-start">Workflow Execution Started</Label>
                    <Switch id="notify-start" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-modified">Workflow Modified</Label>
                    <Switch id="notify-modified" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Channels</h3>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        <Label htmlFor="email-notify">Email Notifications</Label>
                      </div>
                      <Switch id="email-notify" defaultChecked />
                    </div>
                    <div className="pt-2">
                      <Input
                        placeholder="Enter email addresses (comma separated)"
                        defaultValue="john.doe@example.com, jane.smith@example.com"
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        <Label htmlFor="sms-notify">SMS Notifications</Label>
                      </div>
                      <Switch id="sms-notify" />
                    </div>
                    <div className="pt-2">
                      <Input placeholder="Enter phone numbers (comma separated)" />
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Webhook className="h-5 w-5" />
                        <Label htmlFor="webhook-notify">Webhook Notifications</Label>
                      </div>
                      <Switch id="webhook-notify" defaultChecked />
                    </div>
                    <div className="pt-2">
                      <Input
                        placeholder="Webhook URL"
                        defaultValue="https://example.com/webhook/workflow-notifications"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Scheduling */}
        <TabsContent value="scheduling" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Schedule</CardTitle>
              <CardDescription>Configure when this workflow should run automatically</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="schedule-enabled">Enable Scheduled Execution</Label>
                  <Switch id="schedule-enabled" defaultChecked />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Schedule Type</Label>
                <Select defaultValue="cron">
                  <SelectTrigger>
                    <SelectValue placeholder="Select schedule type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interval">Interval</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="cron">Custom (Cron)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cron-expression">Cron Expression</Label>
                <div className="flex gap-2">
                  <Input id="cron-expression" defaultValue="0 0 * * *" />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="w-80">
                        <p>Cron expression format: minute hour day-of-month month day-of-week</p>
                        <p className="mt-2">Example: 0 0 * * * (runs daily at midnight)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground">Current schedule: Runs daily at midnight</p>
              </div>

              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Time (EST/EDT)</SelectItem>
                    <SelectItem value="cst">Central Time (CST/CDT)</SelectItem>
                    <SelectItem value="mst">Mountain Time (MST/MDT)</SelectItem>
                    <SelectItem value="pst">Pacific Time (PST/PDT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg border p-4 space-y-2 bg-muted/50">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Next Scheduled Runs</h3>
                </div>
                <div className="space-y-1 pt-2">
                  <p className="text-sm">April 9, 2023, 12:00 AM UTC</p>
                  <p className="text-sm">April 10, 2023, 12:00 AM UTC</p>
                  <p className="text-sm">April 11, 2023, 12:00 AM UTC</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Audit Logs */}
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>View all actions performed on this workflow</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.details}</TableCell>
                        <TableCell className="font-mono text-xs">{log.ip}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                Showing last 30 days of audit logs
              </div>
              <Button variant="outline" className="ml-auto">
                <Download className="mr-2 h-4 w-4" />
                Export Logs
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>Add a new user to this workflow and assign permissions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Enter user email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select defaultValue="viewer">
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="notify-user">Send Email Notification</Label>
                <Switch id="notify-user" defaultChecked />
              </div>
              <p className="text-sm text-muted-foreground">
                Notify the user that they have been added to this workflow
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAddUserDialogOpen(false)}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={editRoleDialogOpen} onOpenChange={setEditRoleDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Role: {selectedRole && rolePermissions[selectedRole].name}</DialogTitle>
            <DialogDescription>Configure permissions for this role</DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="role-name">Role Name</Label>
                <Input id="role-name" defaultValue={rolePermissions[selectedRole].name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-description">Description</Label>
                <Textarea id="role-description" defaultValue={rolePermissions[selectedRole].description} />
              </div>
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2 rounded-lg border p-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="create"
                      defaultChecked={rolePermissions[selectedRole].permissions.includes("Create workflows")}
                    />
                    <Label htmlFor="create">Create workflows</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit"
                      defaultChecked={rolePermissions[selectedRole].permissions.includes("Edit workflows")}
                    />
                    <Label htmlFor="edit">Edit workflows</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="delete"
                      defaultChecked={rolePermissions[selectedRole].permissions.includes("Delete workflows")}
                    />
                    <Label htmlFor="delete">Delete workflows</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="execute"
                      defaultChecked={rolePermissions[selectedRole].permissions.includes("Execute workflows")}
                    />
                    <Label htmlFor="execute">Execute workflows</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="manage-users"
                      defaultChecked={rolePermissions[selectedRole].permissions.includes("Manage users")}
                    />
                    <Label htmlFor="manage-users">Manage users</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="configure"
                      defaultChecked={rolePermissions[selectedRole].permissions.includes("Configure settings")}
                    />
                    <Label htmlFor="configure">Configure settings</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="view-logs"
                      defaultChecked={rolePermissions[selectedRole].permissions.includes("View audit logs")}
                    />
                    <Label htmlFor="view-logs">View audit logs</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="manage-creds"
                      defaultChecked={rolePermissions[selectedRole].permissions.includes("Manage credentials")}
                    />
                    <Label htmlFor="manage-creds">Manage credentials</Label>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setEditRoleDialogOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

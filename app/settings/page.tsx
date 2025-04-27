"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import {
  User,
  Key,
  Shield,
  Bell,
  Globe,
  Database,
  Palette,
  Sliders,
  Mail,
  Bot,
  Save,
  Plus,
  Trash2,
  RefreshCw,
  Check,
  AlertCircle,
} from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")
  const [darkMode, setDarkMode] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [apiKeys, setApiKeys] = useState([
    {
      id: "key1",
      name: "Production API Key",
      key: "sk_prod_*****************************",
      createdAt: "2023-05-10",
      lastUsed: "2023-06-15",
    },
    {
      id: "key2",
      name: "Development API Key",
      key: "sk_dev_*****************************",
      createdAt: "2023-05-15",
      lastUsed: "2023-06-14",
    },
  ])
  const [newApiKeyName, setNewApiKeyName] = useState("")
  const [showNewApiKeyDialog, setShowNewApiKeyDialog] = useState(false)
  const [newApiKey, setNewApiKey] = useState("")
  const [isGeneratingKey, setIsGeneratingKey] = useState(false)

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
      duration: 3000,
    })
  }

  const handleSavePassword = () => {
    toast({
      title: "Password Updated",
      description: "Your password has been updated successfully.",
      duration: 3000,
    })
  }

  const handleSaveNotifications = () => {
    toast({
      title: "Notification Settings Updated",
      description: "Your notification settings have been updated successfully.",
      duration: 3000,
    })
  }

  const handleSaveAppearance = () => {
    toast({
      title: "Appearance Settings Updated",
      description: "Your appearance settings have been updated successfully.",
      duration: 3000,
    })
  }

  const handleGenerateApiKey = () => {
    if (!newApiKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your API key.",
        variant: "destructive",
        duration: 3000,
      })
      return
    }

    setIsGeneratingKey(true)

    // Simulate API key generation
    setTimeout(() => {
      const generatedKey = `sk_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`
      setNewApiKey(generatedKey)
      setIsGeneratingKey(false)
      setShowNewApiKeyDialog(true)

      // Add the new key to the list
      setApiKeys([
        ...apiKeys,
        {
          id: `key${apiKeys.length + 1}`,
          name: newApiKeyName,
          key: generatedKey.substring(0, 7) + "*****************************",
          createdAt: new Date().toISOString().split("T")[0],
          lastUsed: "Never",
        },
      ])

      setNewApiKeyName("")
    }, 1000)
  }

  const handleDeleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id))

    toast({
      title: "API Key Deleted",
      description: "Your API key has been deleted successfully.",
      duration: 3000,
    })
  }

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(newApiKey)

    toast({
      title: "API Key Copied",
      description: "Your API key has been copied to clipboard.",
      duration: 3000,
    })
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 lg:w-72 flex-shrink-0">
          <Tabs orientation="vertical" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex flex-col h-auto w-full bg-transparent space-y-1">
              <TabsTrigger value="account" className="justify-start w-full">
                <User className="h-4 w-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="security" className="justify-start w-full">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="api" className="justify-start w-full">
                <Key className="h-4 w-4 mr-2" />
                API Keys
              </TabsTrigger>
              <TabsTrigger value="notifications" className="justify-start w-full">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="appearance" className="justify-start w-full">
                <Palette className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="integrations" className="justify-start w-full">
                <Globe className="h-4 w-4 mr-2" />
                Integrations
              </TabsTrigger>
              <TabsTrigger value="workflow" className="justify-start w-full">
                <Sliders className="h-4 w-4 mr-2" />
                Workflow Settings
              </TabsTrigger>
              <TabsTrigger value="ai" className="justify-start w-full">
                <Bot className="h-4 w-4 mr-2" />
                AI Settings
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <TabsContent value="account" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your account profile information and email address.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input id="jobTitle" defaultValue="Product Manager" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" defaultValue="Flow" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveProfile}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>Update your profile picture.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div>
                      <Button variant="outline" className="mb-2">
                        Upload New Picture
                      </Button>
                      <p className="text-sm text-muted-foreground">JPG, GIF or PNG. Max size of 800K.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSavePassword}>
                    <Save className="h-4 w-4 mr-2" />
                    Update Password
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Add an extra layer of security to your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Authenticator App</h3>
                      <p className="text-sm text-muted-foreground">
                        Use an authenticator app to generate one-time codes.
                      </p>
                    </div>
                    <Button variant="outline">Set Up</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">SMS Authentication</h3>
                      <p className="text-sm text-muted-foreground">Receive a code via SMS to verify your identity.</p>
                    </div>
                    <Button variant="outline">Set Up</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Login Sessions</CardTitle>
                  <CardDescription>Manage your active login sessions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <h3 className="font-medium">Chrome on Windows</h3>
                        <p className="text-sm text-muted-foreground">New York, USA · Current Session</p>
                      </div>
                      <Badge>Active Now</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <h3 className="font-medium">Safari on macOS</h3>
                        <p className="text-sm text-muted-foreground">San Francisco, USA · Last active 2 days ago</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Sign Out
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <h3 className="font-medium">Mobile App on iPhone</h3>
                        <p className="text-sm text-muted-foreground">New York, USA · Last active 5 hours ago</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Sign Out All Other Sessions
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage your API keys for accessing the Flow API.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {apiKeys.map((apiKey) => (
                      <div key={apiKey.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <h3 className="font-medium">{apiKey.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-xs bg-muted px-1 py-0.5 rounded">{apiKey.key}</code>
                            <span className="text-xs text-muted-foreground">Created: {apiKey.createdAt}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Last used: {apiKey.lastUsed}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteApiKey(apiKey.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-2">Create New API Key</h3>
                    <div className="flex gap-2">
                      <Input
                        placeholder="API Key Name"
                        value={newApiKeyName}
                        onChange={(e) => setNewApiKeyName(e.target.value)}
                      />
                      <Button onClick={handleGenerateApiKey} disabled={isGeneratingKey}>
                        {isGeneratingKey ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Generate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {showNewApiKeyDialog && (
                <Card className="border-green-500">
                  <CardHeader className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <CardTitle>API Key Generated</CardTitle>
                    </div>
                    <CardDescription>
                      Your API key has been generated successfully. Please copy it now as you won't be able to see it
                      again.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="bg-muted p-3 rounded-md flex items-center justify-between">
                      <code className="text-sm font-mono">{newApiKey}</code>
                      <Button variant="outline" size="sm" onClick={handleCopyApiKey}>
                        Copy
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setShowNewApiKeyDialog(false)}>
                      I've Copied My API Key
                    </Button>
                  </CardFooter>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>API Usage</CardTitle>
                  <CardDescription>Monitor your API usage and limits.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">API Calls (This Month)</span>
                        <span className="text-sm">12,345 / 50,000</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "25%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Workflow Executions (This Month)</span>
                        <span className="text-sm">5,678 / 20,000</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: "28%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Detailed Usage
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">Receive notifications via email.</p>
                      </div>
                      <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications in the app and on your desktop.
                        </p>
                      </div>
                      <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="font-medium mb-4">Notification Types</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">Workflow Executions</h4>
                          <p className="text-xs text-muted-foreground">Notifications about workflow executions.</p>
                        </div>
                        <Select defaultValue="all">
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="errors">Errors Only</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">System Updates</h4>
                          <p className="text-xs text-muted-foreground">
                            Notifications about system updates and maintenance.
                          </p>
                        </div>
                        <Select defaultValue="all">
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="important">Important Only</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">Team Activity</h4>
                          <p className="text-xs text-muted-foreground">Notifications about team member actions.</p>
                        </div>
                        <Select defaultValue="all">
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="mentions">Mentions Only</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveNotifications}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance Settings</CardTitle>
                  <CardDescription>Customize the appearance of the application.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Dark Mode</h3>
                        <p className="text-sm text-muted-foreground">Enable dark mode for the application.</p>
                      </div>
                      <ModeToggle />
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-4">Theme</h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="border rounded-md p-2 cursor-pointer bg-[#007A33]/10 border-[#007A33]">
                          <div className="h-12 bg-[#007A33] rounded-md mb-2"></div>
                          <div className="text-center text-sm font-medium">Green</div>
                        </div>
                        <div className="border rounded-md p-2 cursor-pointer">
                          <div className="h-12 bg-gray-800 rounded-md mb-2"></div>
                          <div className="text-center text-sm font-medium">Dark</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-4">Layout</h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium">Compact Mode</h4>
                            <p className="text-xs text-muted-foreground">
                              Use a more compact layout to fit more content on the screen.
                            </p>
                          </div>
                          <Switch defaultChecked={false} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium">Show Node Labels</h4>
                            <p className="text-xs text-muted-foreground">Show labels on workflow nodes.</p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveAppearance}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Services</CardTitle>
                  <CardDescription>Manage your connected services and integrations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                          <Database className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Salesforce</h3>
                          <p className="text-xs text-muted-foreground">Connected on June 15, 2023</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Disconnect
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-purple-100 rounded-md flex items-center justify-center">
                          <Mail className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Slack</h3>
                          <p className="text-xs text-muted-foreground">Connected on May 20, 2023</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Disconnect
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-green-100 rounded-md flex items-center justify-center">
                          <Database className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Google Sheets</h3>
                          <p className="text-xs text-muted-foreground">Connected on June 5, 2023</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Connect New Service
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Available Integrations</CardTitle>
                  <CardDescription>Browse and connect to available integrations.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4 hover:border-primary cursor-pointer transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 bg-orange-100 rounded-md flex items-center justify-center">
                          <Database className="h-4 w-4 text-orange-600" />
                        </div>
                        <h3 className="font-medium">Stripe</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Process payments and manage subscriptions.</p>
                    </div>

                    <div className="border rounded-md p-4 hover:border-primary cursor-pointer transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        <h3 className="font-medium">SendGrid</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Send transactional and marketing emails.</p>
                    </div>

                    <div className="border rounded-md p-4 hover:border-primary cursor-pointer transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 bg-red-100 rounded-md flex items-center justify-center">
                          <Database className="h-4 w-4 text-red-600" />
                        </div>
                        <h3 className="font-medium">Zendesk</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Manage customer support tickets.</p>
                    </div>

                    <div className="border rounded-md p-4 hover:border-primary cursor-pointer transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 bg-green-100 rounded-md flex items-center justify-center">
                          <Database className="h-4 w-4 text-green-600" />
                        </div>
                        <h3 className="font-medium">HubSpot</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Manage marketing, sales, and CRM.</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Integrations
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="workflow" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Settings</CardTitle>
                  <CardDescription>Configure default settings for your workflows.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Auto-Save</h3>
                        <p className="text-sm text-muted-foreground">Automatically save workflows while editing.</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Version History</h3>
                        <p className="text-sm text-muted-foreground">Keep a history of workflow versions.</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-4">Execution Settings</h3>

                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="defaultTimeout">Default Timeout (seconds)</Label>
                          <Input id="defaultTimeout" type="number" defaultValue="30" />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="maxRetries">Maximum Retries</Label>
                          <Input id="maxRetries" type="number" defaultValue="3" />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="retryDelay">Retry Delay (seconds)</Label>
                          <Input id="retryDelay" type="number" defaultValue="5" />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-4">Error Handling</h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium">Error Logging</h4>
                            <p className="text-xs text-muted-foreground">Log detailed error information.</p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium">Error Notifications</h4>
                            <p className="text-xs text-muted-foreground">Send notifications for workflow errors.</p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="errorWebhook">Error Webhook URL (Optional)</Label>
                          <Input id="errorWebhook" placeholder="https://example.com/webhook" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="ai" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Settings</CardTitle>
                  <CardDescription>Configure settings for AI features in your workflows.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Enable AI Features</h3>
                        <p className="text-sm text-muted-foreground">Enable AI features in your workflows.</p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-4">Default AI Models</h3>

                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="defaultTextModel">Default Text Model</Label>
                          <Select defaultValue="gpt-4">
                            <SelectTrigger id="defaultTextModel">
                              <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gpt-4">GPT-4</SelectItem>
                              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                              <SelectItem value="claude-3">Claude 3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="defaultImageModel">Default Image Model</Label>
                          <Select defaultValue="dall-e-3">
                            <SelectTrigger id="defaultImageModel">
                              <SelectValue placeholder="Select model" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dall-e-3">DALL-E 3</SelectItem>
                              <SelectItem value="dall-e-2">DALL-E 2</SelectItem>
                              <SelectItem value="stable-diffusion">Stable Diffusion</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-4">API Keys</h3>

                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="openaiKey">OpenAI API Key</Label>
                          <Input id="openaiKey" type="password" placeholder="sk-..." />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="anthropicKey">Anthropic API Key</Label>
                          <Input id="anthropicKey" type="password" placeholder="sk-ant-..." />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="stabilityKey">Stability AI API Key</Label>
                          <Input id="stabilityKey" type="password" placeholder="sk-..." />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-4">AI Safety</h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium">Content Filtering</h4>
                            <p className="text-xs text-muted-foreground">
                              Filter AI-generated content for inappropriate material.
                            </p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium">Human Review</h4>
                            <p className="text-xs text-muted-foreground">
                              Require human review for critical AI decisions.
                            </p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="maxTokens">Maximum Output Tokens</Label>
                          <Input id="maxTokens" type="number" defaultValue="2048" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <CardTitle>AI Usage Warning</CardTitle>
                  </div>
                  <CardDescription>You are approaching your AI usage limits for this month.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Token Usage (This Month)</span>
                        <span className="text-sm">8.2M / 10M</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: "82%" }}></div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      You have used 82% of your monthly AI token allocation. Consider upgrading your plan or optimizing
                      your AI usage to avoid disruptions.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Upgrade Plan
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

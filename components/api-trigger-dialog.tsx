"use client"

import { useState } from "react"
import { Check, Copy, Globe, Code, Zap, ExternalLink, Server, Key, Shield, Webhook, FileJson } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ApiTriggerDialogProps {
  isOpen: boolean
  onClose: () => void
  workflowId: string
  workflowName: string
}

export default function ApiTriggerDialog({ isOpen, onClose, workflowId, workflowName }: ApiTriggerDialogProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("endpoint")
  const [selectedIntegration, setSelectedIntegration] = useState("rest")
  const [selectedLanguage, setSelectedLanguage] = useState("curl")
  const [apiKey, setApiKey] = useState("YOUR_API_KEY")

  // In a real app, this would be based on the actual deployment URL
  const baseUrl = "https://api.yourcompany.com"
  const apiEndpoint = `${baseUrl}/api/workflows/${workflowId}/trigger`
  const webhookEndpoint = `${baseUrl}/api/webhooks/${workflowId}`

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)

    toast({
      title: "Copied to clipboard",
      description: "The content has been copied to your clipboard",
      duration: 2000,
    })

    setTimeout(() => setCopied(null), 2000)
  }

  const curlExample = `curl -X POST ${apiEndpoint} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{"data": {"customer_id": "cust_123", "amount": 100}}'`

  const nodeJsExample = `// Using fetch API
const response = await fetch("${apiEndpoint}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${apiKey}"
  },
  body: JSON.stringify({
    data: {
      customer_id: "cust_123",
      amount: 100
    }
  })
});

const result = await response.json();
console.log(result);`

  const pythonExample = `import requests

response = requests.post(
    "${apiEndpoint}",
    headers={
        "Content-Type": "application/json",
        "Authorization": "Bearer ${apiKey}"
    },
    json={
        "data": {
            "customer_id": "cust_123",
            "amount": 100
        }
    }
)

print(response.json())`

  const cSharpExample = `using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

class Program
{
    static async Task Main()
    {
        using (var client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("Authorization", "Bearer ${apiKey}");
            
            var payload = new
            {
                data = new
                {
                    customer_id = "cust_123",
                    amount = 100
                }
            };
            
            var content = new StringContent(
                JsonConvert.SerializeObject(payload),
                Encoding.UTF8,
                "application/json"
            );
            
            var response = await client.PostAsync("${apiEndpoint}", content);
            var result = await response.Content.ReadAsStringAsync();
            
            Console.WriteLine(result);
        }
    }
}`

  const powerAppsExample = `// Power Apps - When a button is clicked
Set(workflowPayload, {
    data: {
        customer_id: "cust_123",
        amount: 100
    }
});

// Call the workflow API
ClearCollect(
    workflowResponse,
    PostJsonAsync(
        "${apiEndpoint}",
        workflowPayload,
        {
            headers: {
                Authorization: "Bearer ${apiKey}",
                'Content-Type': "application/json"
            }
        }
    )
);

// Display the result
If(
    workflowResponse.success,
    Notify("Workflow executed successfully", NotificationType.Success),
    Notify("Error: " & workflowResponse.error, NotificationType.Error)
);`

  const powerAutomateExample = `# Microsoft Power Automate Flow

1. Add an HTTP action with these settings:
   - Method: POST
   - URI: ${apiEndpoint}
   - Headers:
     - Authorization: Bearer ${apiKey}
     - Content-Type: application/json
   - Body:
     {
       "data": {
         "customer_id": "cust_123",
         "amount": 100
       }
     }

2. Parse the JSON response in the next step
3. Add a condition to check if response.success is true
4. Handle success and error paths accordingly`

  const zapierExample = `# Zapier Integration

1. Add a "Webhooks by Zapier" action
2. Select "POST" as the method
3. Enter URL: ${apiEndpoint}
4. Set Headers:
   - Authorization: Bearer ${apiKey}
   - Content-Type: application/json
5. Set Data:
   {
     "data": {
       "customer_id": "{{customer_id}}",
       "amount": {{amount}}
     }
   }
6. Map the variables from your trigger step
7. Test the action to ensure it works correctly`

  const getCodeExample = () => {
    switch (selectedLanguage) {
      case "curl":
        return curlExample
      case "nodejs":
        return nodeJsExample
      case "python":
        return pythonExample
      case "csharp":
        return cSharpExample
      case "powerapps":
        return powerAppsExample
      case "powerautomate":
        return powerAutomateExample
      case "zapier":
        return zapierExample
      default:
        return curlExample
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Globe className="h-5 w-5 text-primary" />
            API Access for "{workflowName}"
          </DialogTitle>
          <DialogDescription className="text-base">
            Trigger this workflow programmatically using various integration methods.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="endpoint" className="flex items-center gap-1">
              <Server className="h-4 w-4" />
              <span>API Endpoints</span>
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              <span>Integrations</span>
            </TabsTrigger>
            <TabsTrigger value="examples" className="flex items-center gap-1">
              <Code className="h-4 w-4" />
              <span>Code Examples</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="endpoint" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Server className="h-4 w-4 text-primary" />
                    REST API Endpoint
                  </CardTitle>
                  <CardDescription>Use this endpoint to trigger the workflow via direct API calls</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                    >
                      POST
                    </Badge>
                    <Input value={apiEndpoint} readOnly className="font-mono text-sm" />
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(apiEndpoint, "endpoint")}>
                      {copied === "endpoint" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground">
                    Send a POST request with JSON data to trigger this workflow
                  </p>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Webhook className="h-4 w-4 text-primary" />
                    Webhook URL
                  </CardTitle>
                  <CardDescription>Configure external services to send data to this webhook</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
                      WEBHOOK
                    </Badge>
                    <Input value={webhookEndpoint} readOnly className="font-mono text-sm" />
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(webhookEndpoint, "webhook")}>
                      {copied === "webhook" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">Secure webhook URL for third-party integrations</p>
                  <Button variant="outline" size="sm">
                    Regenerate
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileJson className="h-4 w-4 text-primary" />
                  Request & Response Format
                </CardTitle>
                <CardDescription>Example of the expected request body and response format</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Request Body</h4>
                  <div className="bg-muted p-3 rounded-md font-mono text-xs overflow-x-auto">
                    {`{
  "data": {
    "customer_id": "cust_123",
    "amount": 100,
    // Any other parameters your workflow needs
  }
}`}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Response Format</h4>
                  <div className="bg-muted p-3 rounded-md font-mono text-xs overflow-x-auto">
                    {`{
  "success": true,
  "execution_id": "exec_123456",
  "status": "completed",
  "result": {
    // Workflow execution result data
  }
}`}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="overflow-hidden">
                <CardHeader className="pb-2 bg-gradient-to-r from-[#742774] to-[#a066a0] text-white">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21.3333 0H2.66667C1.2 0 0 1.2 0 2.66667V21.3333C0 22.8 1.2 24 2.66667 24H21.3333C22.8 24 24 22.8 24 21.3333V2.66667C24 1.2 22.8 0 21.3333 0Z" />
                      <path d="M7.2 18.6667H10.8V7.2H7.2V18.6667ZM13.2 18.6667H16.8V12H13.2V18.6667Z" fill="white" />
                    </svg>
                    PowerApps
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm">
                    Integrate this workflow with Microsoft PowerApps to build custom business applications.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => {
                      setActiveTab("examples")
                      setSelectedLanguage("powerapps")
                    }}
                  >
                    View PowerApps Example
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="pb-2 bg-gradient-to-r from-[#0066FF] to-[#4da6ff] text-white">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.2857 0H1.71429C0.771429 0 0 0.771429 0 1.71429V22.2857C0 23.2286 0.771429 24 1.71429 24H22.2857C23.2286 24 24 23.2286 24 22.2857V1.71429C24 0.771429 23.2286 0 22.2857 0Z" />
                      <path d="M5.14286 12L10.2857 18.8571H5.14286V12Z" fill="white" />
                      <path d="M5.14286 5.14285H10.2857L5.14286 12V5.14285Z" fill="white" />
                      <path d="M10.2857 5.14285H15.4286L10.2857 12V5.14285Z" fill="white" />
                      <path d="M10.2857 12L15.4286 5.14285H20.5714L10.2857 18.8571V12Z" fill="white" />
                      <path d="M15.4286 12L10.2857 18.8571H20.5714L15.4286 12Z" fill="white" />
                    </svg>
                    Power Automate
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm">
                    Create automated workflows with Microsoft Power Automate (Flow) to connect with this API.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => {
                      setActiveTab("examples")
                      setSelectedLanguage("powerautomate")
                    }}
                  >
                    View Power Automate Example
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="pb-2 bg-gradient-to-r from-[#FF4A00] to-[#ff8c66] text-white">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.9 0H1.1C0.5 0 0 0.5 0 1.1V22.9C0 23.5 0.5 24 1.1 24H22.9C23.5 24 24 23.5 24 22.9V1.1C24 0.5 23.5 0 22.9 0Z" />
                      <path d="M18 12L12 18L6 12L12 6L18 12Z" fill="white" />
                    </svg>
                    Zapier
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm">
                    Connect this workflow with 3,000+ apps using Zapier's easy integration platform.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => {
                      setActiveTab("examples")
                      setSelectedLanguage("zapier")
                    }}
                  >
                    View Zapier Example
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Additional Integration Options</CardTitle>
                <CardDescription>Other ways to connect with this workflow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <Server className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">REST API</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Standard REST API for direct integration with any system that can make HTTP requests.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <Webhook className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Webhooks</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Event-based triggers that can be integrated with any system that supports webhooks.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <Code className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Client Libraries</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Use our client libraries for JavaScript, Python, C#, and more for easier integration.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <ExternalLink className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Custom Connectors</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Build custom connectors for Microsoft Power Platform and other integration tools.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-6 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    Code Examples
                  </CardTitle>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="curl">cURL</SelectItem>
                      <SelectItem value="nodejs">Node.js</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="csharp">C#</SelectItem>
                      <SelectItem value="powerapps">PowerApps</SelectItem>
                      <SelectItem value="powerautomate">Power Automate</SelectItem>
                      <SelectItem value="zapier">Zapier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <CardDescription>Ready-to-use code examples for different languages and platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md font-mono text-xs overflow-x-auto max-h-[400px] overflow-y-auto">
                  <pre>{getCodeExample()}</pre>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => copyToClipboard(getCodeExample(), "code")}
                >
                  {copied === "code" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  Copy Example
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">API Key Configuration</CardTitle>
                <CardDescription>Enter your API key to generate accurate code examples</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Input
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="YOUR_API_KEY"
                    className="font-mono"
                  />
                  <Button variant="outline">
                    <Key className="h-4 w-4 mr-2" />
                    Generate New Key
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This is for example purposes only. Your actual API key should be kept secure.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Security Best Practices
                </CardTitle>
                <CardDescription>Recommendations for securely using the API</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <Key className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">API Key Security</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Never expose your API key in client-side code. Always make API calls from your server or a
                        secure environment.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">HTTPS Only</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Always use HTTPS for API calls to ensure data is encrypted in transit.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Webhook Verification</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Verify webhook signatures to ensure requests are coming from our service and haven't been
                        tampered with.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Rate Limiting</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Implement proper error handling for rate limits (429 responses) with exponential backoff.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Access Control</CardTitle>
                <CardDescription>Manage who can access this workflow via API</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Active</Badge>
                      <span className="font-medium">Production API Key</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Revoke
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Active</Badge>
                      <span className="font-medium">Development API Key</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Revoke
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                        Revoked
                      </Badge>
                      <span className="font-medium">Test API Key</span>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Revoked
                    </Button>
                  </div>

                  <Button className="w-full">
                    <Key className="h-4 w-4 mr-2" />
                    Generate New API Key
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

"use client"
import { Handle, Position, getBezierPath, getStraightPath } from "reactflow"
import {
  Bot,
  Code,
  Database,
  Filter,
  Globe,
  Merge,
  MessageSquare,
  Zap,
  RotateCcw,
  Mail,
  FileText,
  Phone,
  Calendar,
  Pause,
  Layers,
  SplitSquareVertical,
  FileJson,
  ImageIcon,
  Gauge,
  Share2,
  Building,
  CreditCard,
  BarChart,
  Coins,
  ShieldCheck,
  AlertCircle,
  Fingerprint,
  Scroll,
  FormInput,
  Timer,
  Webhook,
  Clock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Custom node components
export const TriggerNode = ({ data, id, selected }) => {
  const getIcon = () => {
    switch (data.type) {
      case "webhook":
        return <Webhook size={14} />
      case "schedule":
        return <Clock size={14} />
      case "click":
        return <Zap size={14} />
      case "chat":
        return <MessageSquare size={14} />
      case "email":
        return <Mail size={14} />
      case "form":
        return <FormInput size={14} />
      case "database-change":
        return <Database size={14} />
      case "interval":
        return <Timer size={14} />
      default:
        return <Zap size={14} />
    }
  }

  const getSubtitle = () => {
    switch (data.type) {
      case "webhook":
        return "Webhook Trigger"
      case "schedule":
        return "Schedule Trigger"
      case "click":
        return "Manual Trigger"
      case "chat":
        return "Chat Message Trigger"
      case "email":
        return "Email Trigger"
      case "form":
        return "Form Submission Trigger"
      case "database-change":
        return "Database Change Trigger"
      case "interval":
        return "Timer Interval Trigger"
      default:
        return "Trigger"
    }
  }

  // Only show the handle if connections are not disabled
  const showConnections = data.config?.showConnections !== false

  return (
    <div className={cn("node-content", selected && "ring-2 ring-primary ring-offset-2")}>
      <div className="node-header">
        <div className="node-icon">{getIcon()}</div>
        <div className="node-title">{data.label}</div>
      </div>
      <div className="node-subtitle">{getSubtitle()}</div>

      {showConnections && <Handle type="source" position={Position.Right} />}
    </div>
  )
}

export const ActionNode = ({ data, id, selected }) => {
  const getIcon = () => {
    switch (data.type) {
      case "http":
        return <Globe size={14} />
      case "email-send":
        return <Mail size={14} />
      case "database":
        return <Database size={14} />
      case "googlesheets":
        return <FileText size={14} />
      case "file-operations":
        return <FileText size={14} />
      case "sms":
        return <Phone size={14} />
      case "pdf":
        return <FileText size={14} />
      case "calendar":
        return <Calendar size={14} />
      default:
        return <Globe size={14} />
    }
  }

  const getSubtitle = () => {
    switch (data.type) {
      case "http":
        return "HTTP Request"
      case "email-send":
        return "Send Email"
      case "database":
        return "Database Query"
      case "googlesheets":
        return "Google Sheets"
      case "file-operations":
        return "File Operations"
      case "sms":
        return "SMS Message"
      case "pdf":
        return "PDF Generator"
      case "calendar":
        return "Calendar"
      default:
        return "Action"
    }
  }

  // Only show handles if connections are not disabled
  const showInputConnections = data.config?.showInputConnections !== false
  const showOutputConnections = data.config?.showOutputConnections !== false

  return (
    <div className={cn("node-content", selected && "ring-2 ring-primary ring-offset-2")}>
      <div className="node-header">
        <div className="node-icon">{getIcon()}</div>
        <div className="node-title">{data.label}</div>
      </div>
      <div className="node-subtitle">{getSubtitle()}</div>
      {showInputConnections && <Handle type="target" position={Position.Left} />}
      {showOutputConnections && <Handle type="source" position={Position.Right} />}
    </div>
  )
}

export const LogicNode = ({ data, id, selected }) => {
  const getIcon = () => {
    switch (data.type) {
      case "if":
        return <Filter size={14} />
      case "switch":
        return <SplitSquareVertical size={14} />
      case "loop":
        return <RotateCcw size={14} />
      case "merge":
        return <Merge size={14} />
      case "delay":
        return <Pause size={14} />
      case "filter-array":
        return <Layers size={14} />
      case "split":
        return <SplitSquareVertical size={14} />
      case "join":
        return <Merge size={14} />
      default:
        return <Filter size={14} />
    }
  }

  const getSubtitle = () => {
    switch (data.type) {
      case "if":
        return "Conditional Logic"
      case "switch":
        return "Switch Statement"
      case "loop":
        return "Loop Over Items"
      case "merge":
        return "Merge Branches"
      case "delay":
        return "Time Delay"
      case "filter-array":
        return "Filter Array"
      case "split":
        return "Split Paths"
      case "join":
        return "Join Paths"
      default:
        return "Logic"
    }
  }

  // Only show handles if connections are not disabled
  const showInputConnections = data.config?.showInputConnections !== false
  const showOutputConnections = data.config?.showOutputConnections !== false

  return (
    <div className={cn("node-content", selected && "ring-2 ring-primary ring-offset-2")}>
      <div className="node-header">
        <div className="node-icon">{getIcon()}</div>
        <div className="node-title">{data.label}</div>
      </div>
      <div className="node-subtitle">{getSubtitle()}</div>
      {showInputConnections && <Handle type="target" position={Position.Left} />}
      {showOutputConnections && (
        <>
          <Handle type="source" position={Position.Right} id="default" />

          {data.type === "if" && (
            <>
              <Handle type="source" position={Position.Bottom} id="true" style={{ left: "30%" }} />
              <Handle type="source" position={Position.Bottom} id="false" style={{ left: "70%" }} />
            </>
          )}

          {data.type === "switch" && (
            <>
              <Handle type="source" position={Position.Bottom} id="case1" style={{ left: "20%" }} />
              <Handle type="source" position={Position.Bottom} id="case2" style={{ left: "40%" }} />
              <Handle type="source" position={Position.Bottom} id="case3" style={{ left: "60%" }} />
              <Handle type="source" position={Position.Bottom} id="default" style={{ left: "80%" }} />
            </>
          )}

          {data.type === "split" && (
            <>
              <Handle type="source" position={Position.Bottom} id="path1" style={{ left: "30%" }} />
              <Handle type="source" position={Position.Bottom} id="path2" style={{ left: "70%" }} />
            </>
          )}
        </>
      )}

      {data.type === "join" && showInputConnections && (
        <>
          <Handle type="target" position={Position.Top} id="path1" style={{ left: "30%" }} />
          <Handle type="target" position={Position.Top} id="path2" style={{ left: "70%" }} />
        </>
      )}
    </div>
  )
}

export const CodeNode = ({ data, id, selected }) => {
  const getIcon = () => {
    switch (data.type) {
      case "javascript":
      case "python":
        return <Code size={14} />
      case "transform":
      case "json-path":
        return <FileJson size={14} />
      default:
        return <Code size={14} />
    }
  }

  const getSubtitle = () => {
    switch (data.type) {
      case "javascript":
        return "JavaScript Code"
      case "python":
        return "Python Code"
      case "c":
        return "C Code"
      case "bash":
        return "Bash Script"
      case "powershell":
        return "PowerShell Script"
      case "transform":
        return "Data Transformation"
      case "json-path":
        return "JSON Path"
      default:
        return "Code"
    }
  }

  // Only show handles if connections are not disabled
  const showInputConnections = data.config?.showInputConnections !== false
  const showOutputConnections = data.config?.showOutputConnections !== false

  // Check if the node has custom code
  const hasCustomCode = data.config?.code && data.config.code.length > 0
  const hasCustomInputs = data.config?.customInputs && data.config.customInputs.length > 0

  return (
    <div className={cn("node-content", selected && "ring-2 ring-primary ring-offset-2")}>
      <div className="node-header">
        <div className="node-icon">{getIcon()}</div>
        <div className="node-title">{data.label}</div>
      </div>
      <div className="node-subtitle">{getSubtitle()}</div>

      {(hasCustomCode || hasCustomInputs) && (
        <div className="mt-2 flex flex-wrap gap-1">
          {hasCustomCode && (
            <Badge variant="outline" className="text-xs bg-violet-100 text-violet-800 border-violet-200">
              Custom Code
            </Badge>
          )}
          {hasCustomInputs && (
            <Badge variant="outline" className="text-xs bg-emerald-100 text-emerald-800 border-emerald-200">
              Custom Inputs
            </Badge>
          )}
        </div>
      )}

      {showInputConnections && <Handle type="target" position={Position.Left} />}
      {showOutputConnections && <Handle type="source" position={Position.Right} />}
    </div>
  )
}

export const AINode = ({ data, id, selected }) => {
  const getIcon = () => {
    switch (data.type) {
      case "ai-agent":
      case "ai-transform":
        return <Bot size={14} />
      case "text-classification":
        return <Layers size={14} />
      case "sentiment-analysis":
        return <Gauge size={14} />
      case "image-recognition":
        return <ImageIcon size={14} />
      case "data-extraction":
        return <FileJson size={14} />
      default:
        return <Bot size={14} />
    }
  }

  const getSubtitle = () => {
    switch (data.type) {
      case "ai-agent":
        return data.subtitle || "AI Agent"
      case "ai-transform":
        return "AI Transform"
      case "text-classification":
        return "Text Classification"
      case "sentiment-analysis":
        return "Sentiment Analysis"
      case "image-recognition":
        return "Image Recognition"
      case "data-extraction":
        return "Data Extraction"
      default:
        return "AI"
    }
  }

  // Only show handles if connections are not disabled
  const showInputConnections = data.config?.showInputConnections !== false
  const showOutputConnections = data.config?.showOutputConnections !== false

  // Check if the node has custom instructions or fine-tuning
  const hasCustomInstructions = data.config?.customInstructions && data.config.customInstructions.length > 0
  const isFineTuned = data.config?.model === "custom-fine-tuned" || data.config?.trainingData !== "none"

  return (
    <div className={cn("node-content", selected && "ring-2 ring-primary ring-offset-2")}>
      <div className="node-header">
        <div className="node-icon">{getIcon()}</div>
        <div className="node-title">{data.label}</div>
      </div>
      <div className="node-subtitle">{getSubtitle()}</div>

      {data.tools && data.tools.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {data.tools.map((tool, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tool}
            </Badge>
          ))}
        </div>
      )}

      {(hasCustomInstructions || isFineTuned) && (
        <div className="mt-2 flex flex-wrap gap-1">
          {isFineTuned && (
            <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 border-amber-200">
              Fine-tuned
            </Badge>
          )}
          {hasCustomInstructions && (
            <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
              Custom Instructions
            </Badge>
          )}
        </div>
      )}

      {showInputConnections && <Handle type="target" position={Position.Left} />}
      {showOutputConnections && <Handle type="source" position={Position.Right} />}

      {/* Additional handles for AI Agent sub-connections */}
      {data.type === "ai-agent" && showOutputConnections && (
        <>
          <Handle type="source" position={Position.Bottom} id="chat-model" style={{ left: "20%" }} />
          <Handle type="source" position={Position.Bottom} id="memory" style={{ left: "40%" }} />
          <Handle type="source" position={Position.Bottom} id="tool1" style={{ left: "60%" }} />
          <Handle type="source" position={Position.Bottom} id="tool2" style={{ left: "80%" }} />
        </>
      )}
    </div>
  )
}

export const MessageNode = ({ data, id, selected }) => {
  // Only show handles if connections are not disabled
  const showInputConnections = data.config?.showInputConnections !== false
  const showOutputConnections = data.config?.showOutputConnections !== false

  return (
    <div className={cn("node-content", selected && "ring-2 ring-primary ring-offset-2")}>
      <div className="node-header">
        <div className="node-icon">
          <MessageSquare size={14} />
        </div>
        <div className="node-title">{data.label}</div>
      </div>
      <div className="node-subtitle">Send message</div>
      {showInputConnections && <Handle type="target" position={Position.Left} />}
      {showOutputConnections && <Handle type="source" position={Position.Right} />}
    </div>
  )
}

export const IntegrationNode = ({ data, id, selected }) => {
  const getIcon = () => {
    switch (data.type) {
      case "salesforce":
        return <Building size={14} />
      case "stripe":
        return <CreditCard size={14} />
      case "google-analytics":
        return <BarChart size={14} />
      case "slack":
        return <MessageSquare size={14} />
      case "zendesk":
      case "hubspot":
        return <Share2 size={14} />
      default:
        return <Share2 size={14} />
    }
  }

  const getSubtitle = () => {
    switch (data.type) {
      case "salesforce":
        return "Salesforce CRM"
      case "stripe":
        return "Stripe Payments"
      case "google-analytics":
        return "Google Analytics"
      case "slack":
        return "Slack"
      case "zendesk":
        return "Zendesk"
      case "hubspot":
        return "HubSpot"
      default:
        return "Integration"
    }
  }

  // For integration nodes, default to hiding connections unless explicitly enabled
  const isDataSource = data.config?.isDataSource === true
  const showInputConnections = !isDataSource && data.config?.showInputConnections !== false
  const showOutputConnections = !isDataSource && data.config?.showOutputConnections !== false

  return (
    <div className={cn("node-content", selected && "ring-2 ring-primary ring-offset-2")}>
      <div className="node-header">
        <div className="node-icon">{getIcon()}</div>
        <div className="node-title">{data.label}</div>
      </div>
      <div className="node-subtitle">{getSubtitle()}</div>
      {showInputConnections && <Handle type="target" position={Position.Left} />}
      {showOutputConnections && <Handle type="source" position={Position.Right} />}
    </div>
  )
}

export const BankingNode = ({ data, id, selected }) => {
  const getIcon = () => {
    switch (data.type) {
      case "transaction-processing":
        return <CreditCard size={14} />
      case "account-verification":
        return <ShieldCheck size={14} />
      case "fraud-detection":
        return <AlertCircle size={14} />
      case "kyc":
        return <Fingerprint size={14} />
      case "loan-approval":
        return <Scroll size={14} />
      default:
        return <Coins size={14} />
    }
  }

  const getSubtitle = () => {
    switch (data.type) {
      case "transaction-processing":
        return "Transaction Processing"
      case "account-verification":
        return "Account Verification"
      case "fraud-detection":
        return "Fraud Detection"
      case "kyc":
        return "KYC Process"
      case "loan-approval":
        return "Loan Approval"
      default:
        return "Banking"
    }
  }

  // Only show handles if connections are not disabled
  const isDataSource = data.config?.isDataSource === true
  const showInputConnections = !isDataSource && data.config?.showInputConnections !== false
  const showOutputConnections = !isDataSource && data.config?.showOutputConnections !== false

  return (
    <div className={cn("node-content", selected && "ring-2 ring-primary ring-offset-2")}>
      <div className="node-header">
        <div className="node-icon">{getIcon()}</div>
        <div className="node-title">{data.label}</div>
      </div>
      <div className="node-subtitle">{getSubtitle()}</div>
      {showInputConnections && <Handle type="target" position={Position.Left} />}
      {showOutputConnections && <Handle type="source" position={Position.Right} />}
    </div>
  )
}

export const AIToolNode = ({ data, id, selected }) => {
  return (
    <div className={cn("node-content", selected && "ring-2 ring-primary ring-offset-2")}>
      <div className="node-header">
        <div className="node-icon">{data.icon && data.icon}</div>
        <div className="node-title">{data.label}</div>
      </div>
      <div className="node-subtitle">{data.subtitle}</div>
      <Handle type="target" position={Position.Top} />
    </div>
  )
}

// Custom edge components
export const DashedEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  // Check if we should hide the arrowhead
  const hideArrowhead = data?.hideArrowhead === true
  const finalMarkerEnd = hideArrowhead ? undefined : markerEnd

  return (
    <path
      id={id}
      style={{
        ...style,
        strokeDasharray: "5,5",
      }}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={finalMarkerEnd}
    />
  )
}

export const DottedEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  // Check if we should hide the arrowhead
  const hideArrowhead = data?.hideArrowhead === true
  const finalMarkerEnd = hideArrowhead ? undefined : markerEnd

  return (
    <path
      id={id}
      style={{
        ...style,
        strokeDasharray: "2,2",
      }}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={finalMarkerEnd}
    />
  )
}

export const StraightEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  // Check if we should hide the arrowhead
  const hideArrowhead = data?.hideArrowhead === true
  const finalMarkerEnd = hideArrowhead ? undefined : markerEnd

  return <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={finalMarkerEnd} />
}

// Default edge without arrowhead
export const NoArrowEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {} }) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return <path id={id} style={style} className="react-flow__edge-path" d={edgePath} />
}

// Node types mapping
export const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  logic: LogicNode,
  code: CodeNode,
  ai: AINode,
  message: MessageNode,
  aitool: AIToolNode,
  integration: IntegrationNode,
  banking: BankingNode,
}

// Edge types mapping
export const edgeTypes = {
  dashed: DashedEdge,
  dotted: DottedEdge,
  straight: StraightEdge,
  noArrow: NoArrowEdge,
}

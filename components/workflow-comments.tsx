"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Send, Edit, Trash2, X, Check } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Comment {
  id: string
  text: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: Date
  nodeId?: string
  position?: { x: number; y: number }
}

interface WorkflowCommentsProps {
  workflowId: string
  onAddComment: (comment: Omit<Comment, "id" | "createdAt">) => void
  onUpdateComment: (id: string, text: string) => void
  onDeleteComment: (id: string) => void
}

export default function WorkflowComments({
  workflowId,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}: WorkflowCommentsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Mock data - would come from API in real app
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "c1",
      text: "We should add error handling to the transaction monitoring node.",
      author: {
        id: "u1",
        name: "John Doe",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    },
    {
      id: "c2",
      text: "I've updated the AI processing node to use the latest model.",
      author: {
        id: "u2",
        name: "Jane Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
    },
    {
      id: "c3",
      text: "The email notification template needs to be updated with the new branding.",
      author: {
        id: "u3",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      createdAt: new Date(Date.now() - 172800000), // 2 days ago
    },
  ])

  // Current user - would come from auth context in real app
  const currentUser = {
    id: "u1",
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
  }

  useEffect(() => {
    if (isOpen && editingId === null) {
      textareaRef.current?.focus()
    }
  }, [isOpen, editingId])

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment = {
        text: newComment,
        author: currentUser,
      }

      // In a real app, this would call the API and then update state
      const newCommentWithId: Comment = {
        ...comment,
        id: `c${comments.length + 1}`,
        createdAt: new Date(),
      }

      setComments([newCommentWithId, ...comments])
      onAddComment(comment)
      setNewComment("")
    }
  }

  const handleEditComment = (id: string) => {
    const comment = comments.find((c) => c.id === id)
    if (comment) {
      setEditingId(id)
      setEditText(comment.text)
    }
  }

  const handleSaveEdit = (id: string) => {
    if (editText.trim()) {
      setComments(comments.map((c) => (c.id === id ? { ...c, text: editText } : c)))
      onUpdateComment(id, editText)
      setEditingId(null)
      setEditText("")
    }
  }

  const handleDeleteComment = (id: string) => {
    setComments(comments.filter((c) => c.id !== id))
    onDeleteComment(id)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditText("")
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col">
      {isOpen && (
        <div className="mb-2 w-80 rounded-lg border bg-background shadow-lg flex flex-col">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-medium">Comments</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 max-h-[400px]">
            <div className="p-3 space-y-4">
              {comments.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No comments yet. Start the conversation!</div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                      <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-sm">{comment.author.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                          </span>
                        </div>
                        {comment.author.id === currentUser.id && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleEditComment(comment.id)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {editingId === comment.id ? (
                        <div className="mt-1">
                          <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="min-h-[60px] text-sm"
                            autoFocus
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                              Cancel
                            </Button>
                            <Button size="sm" onClick={() => handleSaveEdit(comment.id)}>
                              <Check className="h-3.5 w-3.5 mr-1" />
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm mt-1">{comment.text}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Textarea
                ref={textareaRef}
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[60px] text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    handleSubmitComment()
                  }
                }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">Press Ctrl+Enter to submit</span>
              <Button size="sm" onClick={handleSubmitComment} disabled={!newComment.trim()}>
                <Send className="h-3.5 w-3.5 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
      )}

      <Button
        variant={isOpen ? "default" : "outline"}
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
    </div>
  )
}

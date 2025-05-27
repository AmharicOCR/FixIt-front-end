"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type React from "react"
import { useState, useEffect, use } from "react"
import Link from "next/link"
import { ArrowLeft, Bug, CheckCircle2, Clock, MessageSquare, MoreHorizontal, Share2, ThumbsUp, ThumbsDown, Trash2, Edit, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { getCookie } from "@/utils/cookies"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ErrorDetails {
  id: number
  created_by: string
  title: string
  description: string
  priority: string
  status: string
  environment: string
  error_message: string
  stack_trace: string
  steps_to_reproduce: string
  expected_behaviour: string
  actual_behaviour: string
  attachments: string | null
  visible_to_public: boolean
  created_at: string
  updated_at?: string
  category: string
  language: string | null
  framework: string | null
  tags: string[]
  solutions: Solution[]
  error_comments: Comment[]
}

interface Comment {
  id: number
  content: string
  created_by: string
  created_at: string
}

interface Solution {
  id: number
  title: string
  solution: string
  is_private: boolean
  created_by: string
  created_at: string
  upvotes: number
  downvotes: number
  comments?: Comment[]
}

interface Activity {
  id: string
  type: string
  user: {
    name: string
    avatar?: string
    initials: string
  }
  timestamp: string
  old_status?: string
  new_status?: string
  assignee?: {
    name: string
    avatar?: string
    initials: string
  }
}

export default function ErrorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const { authenticated, username } = useAuth()
  const csrfToken = getCookie("csrftoken")

  // State management
  const [activeTab, setActiveTab] = useState("details")
  const [comment, setComment] = useState("")
  const [solutionTitle, setSolutionTitle] = useState("")
  const [solutionDescription, setSolutionDescription] = useState("")
  const [isPrivateSolution, setIsPrivateSolution] = useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isSubmittingSolution, setIsSubmittingSolution] = useState(false)
  const [error, setError] = useState<ErrorDetails | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [activity, setActivity] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentStatus, setCurrentStatus] = useState("")
  const [currentPriority, setCurrentPriority] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedError, setEditedError] = useState<Partial<ErrorDetails>>({
    title: '',
    description: '',
    environment: '',
    category: '',
    language: '',
    framework: '',
    tags: [],
    visible_to_public: false,
  })
  const [solutionComments, setSolutionComments] = useState<Record<number, string>>({})
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editingCommentText, setEditingCommentText] = useState("")

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!csrfToken) {
          throw new Error("CSRF token not found")
        }

        // Fetch error details
        const errorRes = await fetch(`http://127.0.0.1:8000/bugtracker/errors/${id}/`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'X-CSRFToken': csrfToken,
          }
        })

        if (!errorRes.ok) {
          throw new Error('Failed to fetch error details')
        }

        const errorData = await errorRes.json()
        setError(errorData)
        setCurrentStatus(errorData.status)
        setCurrentPriority(errorData.priority)
        setEditedError({
          title: errorData.title,
          description: errorData.description,
          environment: errorData.environment,
          category: errorData.category,
          language: errorData.language,
          framework: errorData.framework,
          tags: [...errorData.tags],
          visible_to_public: errorData.visible_to_public,
        })
        setComments(errorData.error_comments || [])
        setSolutions(errorData.solutions || [])

        setIsLoading(false)

      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: "Error",
          description: "Failed to load error details. Please try again later.",
          variant: "destructive"
        })
        setIsLoading(false)
      }
    }

    if (authenticated) {
      fetchData()
    }
  }, [id, csrfToken, toast, authenticated])

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: error?.title || "Error Details",
          text: `Check out this error: ${error?.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "The URL has been copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Error",
        description: "Failed to share. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    try {
      if(!csrfToken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/errors/${id}/`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          status: newStatus
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      setCurrentStatus(newStatus)
      if (error) {
        setError({ ...error, status: newStatus })
      }

      toast({
        title: "Success",
        description: "Status updated successfully",
      })
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      })
    }
  }

  // Handle priority change
  const handlePriorityChange = async (newPriority: string) => {
    try {
      if(!csrfToken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/errors/${id}/`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          priority: newPriority
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update priority')
      }

      setCurrentPriority(newPriority)
      if (error) {
        setError({ ...error, priority: newPriority })
      }

      toast({
        title: "Success",
        description: "Priority updated successfully",
      })
    } catch (error) {
      console.error('Error updating priority:', error)
      toast({
        title: "Error",
        description: "Failed to update priority",
        variant: "destructive"
      })
    }
  }

  // Handle error update
  const handleUpdateError = async () => {
    try {
      if(!csrfToken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/errors/${id}/`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(editedError)
      })

      if (!response.ok) {
        throw new Error('Failed to update error')
      }

      const updatedError = await response.json()
      setError(updatedError)
      setIsEditing(false)
      
      toast({
        title: "Success",
        description: "Error updated successfully",
      })
    } catch (error) {
      console.error('Error updating error:', error)
      toast({
        title: "Error",
        description: "Failed to update error",
        variant: "destructive"
      })
    }
  }

  // Handle error deletion
  const handleDeleteError = async () => {
    setIsDeleting(true)
    try {
      if(!csrfToken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/errors/${id}/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-CSRFToken': csrfToken,
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete error')
      }

      toast({
        title: "Success",
        description: "Error deleted successfully",
      })
      router.push('/dashboard')
    } catch (error) {
      console.error('Error deleting error:', error)
      toast({
        title: "Error",
        description: "Failed to delete error",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim() || !csrfToken) return
    if (!authenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to post comments",
        variant: "destructive"
      })
      return
    }

    setIsSubmittingComment(true)

    try {
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/comments/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          error: parseInt(id),
          content: comment
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit comment')
      }

      const newComment = await response.json()
      setComments([...comments, newComment])
      setComment("")
      toast({
        title: "Success",
        description: "Comment added successfully",
      })
    } catch (error) {
      console.error('Error submitting comment:', error)
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      })
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleSolutionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!solutionDescription.trim() || !csrfToken) return
    if (!authenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to propose solutions",
        variant: "destructive"
      })
      return
    }

    setIsSubmittingSolution(true)

    try {
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/solutions/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          error: parseInt(id),
          title: solutionTitle || `Solution for error ${id}`,
          solution: solutionDescription,
          is_private: isPrivateSolution
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to submit solution')
      }

      const newSolution = await response.json()
      setSolutions([...solutions, newSolution])
      setSolutionTitle("")
      setSolutionDescription("")
      setIsPrivateSolution(false)
      
      toast({
        title: "Success",
        description: "Solution added successfully!",
      })
    } catch (error: any) {
      console.error('Error submitting solution:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to add solution",
        variant: "destructive"
      })
    } finally {
      setIsSubmittingSolution(false)
    }
  }

  const handleSolutionCommentSubmit = async (solutionId: number) => {
    const commentText = solutionComments[solutionId]
    if (!commentText?.trim() || !csrfToken) return

    try {
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/comments/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          solution: solutionId,
          content: commentText
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit comment')
      }

      const newComment = await response.json()
      
      // Update the solution's comments
      setSolutions(solutions.map(solution => {
        if (solution.id === solutionId) {
          return {
            ...solution,
            comments: [...(solution.comments ?? []), newComment]
          }
        }
        return solution
      }))

      // Clear the comment input
      setSolutionComments({
        ...solutionComments,
        [solutionId]: ""
      })

      toast({
        title: "Success",
        description: "Comment added to solution",
      })
    } catch (error) {
      console.error('Error submitting solution comment:', error)
      toast({
        title: "Error",
        description: "Failed to add comment to solution",
        variant: "destructive"
      })
    }
  }

  const handleUpdateComment = async (commentId: number) => {
    if (!editingCommentText.trim() || !csrfToken) return

    try {
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/comments/${commentId}/`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          content: editingCommentText
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update comment')
      }

      // Update comments in state
      setComments(comments.map(comment => 
        comment.id === commentId ? { ...comment, content: editingCommentText } : comment
      ));

      // Also update in solutions if needed
      setSolutions(solutions.map(solution => ({
        ...solution,
        comments: (solution.comments ?? []).map(comment => 
          comment.id === commentId ? { ...comment, content: editingCommentText } : comment
        )
      })));

      setEditingCommentId(null)
      setEditingCommentText("")
      
      toast({
        title: "Success",
        description: "Comment updated successfully",
      })
    } catch (error) {
      console.error('Error updating comment:', error)
      toast({
        title: "Error",
        description: "Failed to update comment",
        variant: "destructive"
      })
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    try {
      if(!csrfToken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/comments/${commentId}/`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-CSRFToken': csrfToken,
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete comment')
      }

      // Remove from comments
      setComments(comments.filter(comment => comment.id !== commentId))

      // Also remove from solutions if needed
      setSolutions(solutions.map(solution => ({
        ...solution,
        comments: (solution.comments ?? []).filter(comment => comment.id !== commentId)
      })))

      toast({
        title: "Success",
        description: "Comment deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive"
      })
    }
  }

  const handleVote = async (solutionId: number, voteType: number) => {
    try {
      if(!csrfToken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/votes/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          solution: solutionId,
          vote_type: voteType
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit vote')
      }

      // Update the solution's votes
      setSolutions(solutions.map(solution => {
        if (solution.id === solutionId) {
          return {
            ...solution,
            upvotes: voteType === 1 ? solution.upvotes + 1 : solution.upvotes,
            downvotes: voteType === -1 ? solution.downvotes + 1 : solution.downvotes
          }
        }
        return solution
      }))

      toast({
        title: "Success",
        description: `Your ${voteType === 1 ? 'upvote' : 'downvote'} has been recorded`,
      })
    } catch (error) {
      console.error('Error submitting vote:', error)
      toast({
        title: "Error",
        description: "Failed to submit vote",
        variant: "destructive"
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Authentication Required</h1>
          <p className="text-muted-foreground">Please sign in to view this error details</p>
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading || !error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p>Loading error details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the error and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteError}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          {isEditing ? (
            <Input
              value={editedError.title}
              onChange={(e) => setEditedError({...editedError, title: e.target.value})}
              className="text-2xl font-bold tracking-tight h-auto py-1 px-2"
            />
          ) : (
            <h1 className="text-2xl font-bold tracking-tight">{error.title}</h1>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(false)}
                className="rounded-lg gap-1"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleUpdateError}
                className="rounded-lg gap-1"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" className="rounded-lg" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(true)}
                className="rounded-lg gap-1"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <MoreHorizontal className="mr-2 h-4 w-4" />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleStatusChange("resolved")}>
                    Mark as resolved
                  </DropdownMenuItem>
                  <DropdownMenuItem>Reassign error</DropdownMenuItem>
                  <DropdownMenuItem>Change priority</DropdownMenuItem>
                  <DropdownMenuItem>Add to favorites</DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-500" 
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete error
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>Error Details</CardTitle>
                  <CardDescription>
                    Reported by {error.created_by} on {formatDate(error.created_at)}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className={`
                    ${
                      error.status === "open"
                        ? "border-amber-500 text-amber-500"
                        : error.status === "in progress"
                          ? "border-blue-500 text-blue-500"
                          : "border-green-500 text-green-500"
                    }
                  `}
                  >
                    {error.status === "open" && <Clock className="mr-1 h-3 w-3" />}
                    {error.status === "in progress" && <Clock className="mr-1 h-3 w-3" />}
                    {error.status === "resolved" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                    {error.status?.replace('_', ' ') || ''}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`
                    ${
                      error.priority === "critical"
                        ? "border-red-500 text-red-500"
                        : error.priority === "high"
                          ? "border-amber-500 text-amber-500"
                          : error.priority === "medium"
                            ? "border-blue-500 text-blue-500"
                            : "border-green-500 text-green-500"
                    }
                  `}
                  >
                    {error.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details" className="space-y-4" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 rounded-lg">
                  <TabsTrigger value="details" className="rounded-lg">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="solutions" className="rounded-lg">
                    Solutions
                  </TabsTrigger>
                  <TabsTrigger value="comments" className="rounded-lg">
                    Comments
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                      {isEditing ? (
                        <Textarea
                          value={editedError.description}
                          onChange={(e) => setEditedError({...editedError, description: e.target.value})}
                          className="min-h-[100px]"
                        />
                      ) : (
                        <p className="text-sm">{error.description}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Category</h3>
                        {isEditing ? (
                          <Input
                            value={editedError.category}
                            onChange={(e) => setEditedError({...editedError, category: e.target.value})}
                          />
                        ) : (
                          <Badge variant="secondary" className="rounded-full">
                            {error.category || "Not specified"}
                          </Badge>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Environment</h3>
                        {isEditing ? (
                          <Select
                            value={editedError.environment}
                            onValueChange={(value) => setEditedError({...editedError, environment: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select environment" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="development">Development</SelectItem>
                              <SelectItem value="staging">Staging</SelectItem>
                              <SelectItem value="production">Production</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline">{error.environment}</Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Language</h3>
                        {isEditing ? (
                          <Input
                            value={editedError.language || ''}
                            onChange={(e) => setEditedError({...editedError, language: e.target.value})}
                          />
                        ) : (
                          <Badge variant="secondary" className="rounded-full">
                            {error.language || "Not specified"}
                          </Badge>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Framework</h3>
                        {isEditing ? (
                          <Input
                            value={editedError.framework || ''}
                            onChange={(e) => setEditedError({...editedError, framework: e.target.value})}
                          />
                        ) : (
                          <Badge variant="secondary" className="rounded-full">
                            {error.framework || "Not specified"}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Error Message</h3>
                      <div className="bg-muted p-3 rounded-md text-sm font-mono">{error.error_message}</div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Stack Trace</h3>
                      <div className="bg-muted p-3 rounded-md text-sm font-mono whitespace-pre-wrap overflow-x-auto max-h-[200px]">
                        {error.stack_trace}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Steps to Reproduce</h3>
                      {isEditing ? (
                        <Textarea
                          value={editedError.steps_to_reproduce}
                          onChange={(e) => setEditedError({...editedError, steps_to_reproduce: e.target.value})}
                          className="min-h-[100px]"
                        />
                      ) : (
                        <div className="text-sm whitespace-pre-wrap">{error.steps_to_reproduce}</div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Expected Behavior</h3>
                        {isEditing ? (
                          <Textarea
                            value={editedError.expected_behaviour}
                            onChange={(e) => setEditedError({...editedError, expected_behaviour: e.target.value})}
                            className="min-h-[80px]"
                          />
                        ) : (
                          <p className="text-sm">{error.expected_behaviour}</p>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Actual Behavior</h3>
                        {isEditing ? (
                          <Textarea
                            value={editedError.actual_behaviour}
                            onChange={(e) => setEditedError({...editedError, actual_behaviour: e.target.value})}
                            className="min-h-[80px]"
                          />
                        ) : (
                          <p className="text-sm">{error.actual_behaviour}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Tags</h3>
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            placeholder="Add tags (comma separated)"
                            value={editedError.tags?.join(', ') || ''}
                            onChange={(e) => {
                              const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                              setEditedError({...editedError, tags});
                            }}
                          />
                          <p className="text-xs text-muted-foreground">
                            Separate tags with commas
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {error.tags?.map((tag, index) => (
                            <Badge key={index} variant="outline" className="rounded-full">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Visibility</h3>
                      {isEditing ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="visibility"
                            checked={editedError.visible_to_public || false}
                            onChange={(e) => setEditedError({...editedError, visible_to_public: e.target.checked})}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <Label htmlFor="visibility">Visible to public</Label>
                        </div>
                      ) : (
                        <Badge variant="outline">{error.visible_to_public ? "Public" : "Private"}</Badge>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="solutions" className="space-y-6">
                  <div className="space-y-4">
                    <form onSubmit={handleSolutionSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="solution-title">Title (optional)</Label>
                        <Input
                          id="solution-title"
                          value={solutionTitle}
                          onChange={(e) => setSolutionTitle(e.target.value)}
                          placeholder="Solution title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="solution-description">Solution</Label>
                        <Textarea
                          id="solution-description"
                          value={solutionDescription}
                          onChange={(e) => setSolutionDescription(e.target.value)}
                          placeholder="Describe your solution..."
                          className="min-h-[150px]"
                          required
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="private-solution"
                            checked={isPrivateSolution}
                            onChange={(e) => setIsPrivateSolution(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <Label htmlFor="private-solution">Private solution</Label>
                        </div>
                        <Button type="submit" disabled={isSubmittingSolution}>
                          {isSubmittingSolution ? "Submitting..." : "Submit Solution"}
                        </Button>
                      </div>
                    </form>

                    <div className="space-y-4">
                      {solutions.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No solutions yet. Be the first to propose one!</p>
                        </div>
                      ) : (
                        solutions.map((solution) => (
                          <Card key={solution.id} className="border-border/40 shadow-sm">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-lg">{solution.title}</CardTitle>
                                  <CardDescription>
                                    Proposed by {solution.created_by} on {formatDate(solution.created_at)}
                                  </CardDescription>
                                </div>
                                {solution.is_private && (
                                  <Badge variant="outline">Private</Badge>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="prose prose-sm max-w-none">
                                <p>{solution.solution}</p>
                              </div>

                              <div className="flex items-center gap-4 mt-4">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleVote(solution.id, 1)}
                                  className="flex items-center gap-1"
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                  <span>{solution.upvotes}</span>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleVote(solution.id, -1)}
                                  className="flex items-center gap-1"
                                >
                                  <ThumbsDown className="h-4 w-4" />
                                  <span>{solution.downvotes}</span>
                                </Button>
                              </div>

                              <div className="mt-6 space-y-4">
                                <h4 className="text-sm font-medium">Comments ({solution.comments?.length || 0})</h4>
                                <div className="space-y-4">
                                  {(solution.comments ?? []).map((comment) => (
                                    <div key={comment.id} className="flex gap-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarFallback>
                                          {comment.created_by ? comment.created_by.substring(0, 2).toUpperCase() : "US"}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm font-medium">{comment.created_by}</span>
                                          <span className="text-xs text-muted-foreground">
                                            {formatDate(comment.created_at)}
                                          </span>
                                        </div>
                                        {editingCommentId === comment.id ? (
                                          <div className="mt-1 space-y-2">
                                            <Textarea
                                              value={editingCommentText}
                                              onChange={(e) => setEditingCommentText(e.target.value)}
                                              className="min-h-[80px]"
                                            />
                                            <div className="flex gap-2">
                                              <Button 
                                                size="sm" 
                                                onClick={() => handleUpdateComment(comment.id)}
                                              >
                                                Save
                                              </Button>
                                              <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => {
                                                  setEditingCommentId(null)
                                                  setEditingCommentText("")
                                                }}
                                              >
                                                Cancel
                                              </Button>
                                            </div>
                                          </div>
                                        ) : (
                                          <>
                                            <p className="text-sm mt-1">{comment.content}</p>
                                            {comment.created_by === username && (
                                              <div className="flex gap-2 mt-1">
                                                <Button 
                                                  variant="ghost" 
                                                  size="sm" 
                                                  onClick={() => {
                                                    setEditingCommentId(comment.id)
                                                    setEditingCommentText(comment.content)
                                                  }}
                                                >
                                                  Edit
                                                </Button>
                                                <Button 
                                                  variant="ghost" 
                                                  size="sm" 
                                                  onClick={() => handleDeleteComment(comment.id)}
                                                  className="text-red-500"
                                                >
                                                  Delete
                                                </Button>
                                              </div>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex gap-2 mt-4">
                                  <Input
                                    value={solutionComments[solution.id] || ""}
                                    onChange={(e) => setSolutionComments({
                                      ...solutionComments,
                                      [solution.id]: e.target.value
                                    })}
                                    placeholder="Add a comment..."
                                    className="flex-1"
                                  />
                                  <Button 
                                    onClick={() => handleSolutionCommentSubmit(solution.id)}
                                    disabled={!solutionComments[solution.id]?.trim()}
                                  >
                                    Post
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="comments" className="space-y-6">
                  <div className="space-y-4">
                    <form onSubmit={handleCommentSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="comment">Add a comment</Label>
                        <Textarea
                          id="comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share your thoughts..."
                          className="min-h-[100px]"
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmittingComment || !comment.trim()}>
                          {isSubmittingComment ? "Posting..." : "Post Comment"}
                        </Button>
                      </div>
                    </form>

                    <div className="space-y-4">
                      {comments.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
                        </div>
                      ) : (
                        comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {comment.created_by ? comment.created_by.substring(0, 2).toUpperCase() : "US"}
                                </AvatarFallback>
                              </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{comment.created_by}</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(comment.created_at)}
                                </span>
                              </div>
                              {editingCommentId === comment.id ? (
                                <div className="mt-1 space-y-2">
                                  <Textarea
                                    value={editingCommentText}
                                    onChange={(e) => setEditingCommentText(e.target.value)}
                                    className="min-h-[80px]"
                                  />
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleUpdateComment(comment.id)}
                                    >
                                      Save
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => {
                                        setEditingCommentId(null)
                                        setEditingCommentText("")
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="text-sm mt-1">{comment.content}</p>
                                  {comment.created_by === username && (
                                    <div className="flex gap-2 mt-1">
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => {
                                          setEditingCommentId(comment.id)
                                          setEditingCommentText(comment.content)
                                        }}
                                      >
                                        Edit
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className="text-red-500"
                                      >
                                        Delete
                                      </Button>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Current Status</Label>
                <Select 
                  value={currentStatus}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={currentPriority}
                  onValueChange={handlePriorityChange}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Created</span>
                  <span className="text-sm text-muted-foreground">{formatDate(error.created_at)}</span>
                </div>
                {error.updated_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Updated</span>
                    <span className="text-sm text-muted-foreground">{formatDate(error.updated_at)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-medium">Similar Errors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">Similar errors will appear here</p>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button variant="ghost" size="sm" className="w-full justify-center" asChild>
                <Link href="/dashboard/search">Search All Errors</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
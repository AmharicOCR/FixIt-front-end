"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type React from "react"
import { useState, useEffect, use } from "react"
import Link from "next/link"
import { ArrowLeft, Bug, CheckCircle2, Clock, MessageSquare, MoreHorizontal, Share2, ThumbsUp } from "lucide-react"
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
}

interface Comment {
  id: string
  text: string
  author: {
    name: string
    avatar?: string
    initials: string
  }
  created_at: string
}

interface Solution {
  id: string
  title: string
  description: string
  author: {
    name: string
    avatar?: string
    initials: string
  }
  created_at: string
  upvotes: number
  is_accepted: boolean
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
  const { toast } = useToast()

  const csrfToken = getCookie("csrftoken")

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

        // Fetch comments
        const commentsRes = await fetch(`http://127.0.0.1:8000/bugtracker/errors/${id}/comments/`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'X-CSRFToken': csrfToken,
          }
        })

        if (commentsRes.ok) {
          const commentsData = await commentsRes.json()
          setComments(commentsData)
        }

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

    fetchData()
  }, [id, csrfToken, toast])

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim() || !csrfToken) return

    setIsSubmittingComment(true)

    try {
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/errors/${id}/comments/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          text: comment
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{error.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-lg">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-lg">
                <MoreHorizontal className="mr-2 h-4 w-4" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark as resolved</DropdownMenuItem>
              <DropdownMenuItem>Reassign error</DropdownMenuItem>
              <DropdownMenuItem>Change priority</DropdownMenuItem>
              <DropdownMenuItem>Add to favorites</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">Delete error</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                        : error.status === "in_progress"
                          ? "border-blue-500 text-blue-500"
                          : "border-green-500 text-green-500"
                    }
                  `}
                  >
                    {error.status === "open" && <Clock className="mr-1 h-3 w-3" />}
                    {error.status === "in_progress" && <Clock className="mr-1 h-3 w-3" />}
                    {error.status === "resolved" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                    {error.status.replace('_', ' ')}
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
                  <TabsTrigger value="activity" className="rounded-lg">
                    Activity
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                      <p className="text-sm">{error.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Category</h3>
                        <Badge variant="secondary" className="rounded-full">
                          {error.category || "Not specified"}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Programming Language</h3>
                        <Badge variant="secondary" className="rounded-full">
                          {error.language || "Not specified"}
                        </Badge>
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
                      <div className="text-sm whitespace-pre-wrap">{error.steps_to_reproduce}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Expected Behavior</h3>
                        <p className="text-sm">{error.expected_behaviour}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Actual Behavior</h3>
                        <p className="text-sm">{error.actual_behaviour}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {error.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="rounded-full">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="solutions" className="space-y-6">
                  <div className="space-y-4">
                    {solutions.length > 0 ? (
                      solutions.map((solution) => (
                        <div key={solution.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{solution.title}</h3>
                              <p className="text-xs text-muted-foreground">
                                {/* //{solution.author} */}
                                Proposed by you on  today
                                {/* //{formatDate(solution.created_at)} */}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-8 gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{solution.upvotes}</span>
                              </Button>
                              {solution.is_accepted && (
                                <Badge variant="success" className="bg-green-500 text-white">
                                  Accepted Solution
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-sm whitespace-pre-wrap">{solution.description}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Bug className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-medium mb-2">No Solutions Yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Be the first to propose a solution to this error.
                        </p>
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <h3 className="font-medium mb-3">Add Your Solution</h3>
                      <form onSubmit={handleSolutionSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="solution-title">Solution Title</Label>
                          <Input 
                            id="solution-title" 
                            placeholder="Brief title for your solution" 
                            value={solutionTitle}
                            onChange={(e) => setSolutionTitle(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="solution-description">Solution Description</Label>
                          <Textarea
                            id="solution-description"
                            placeholder="Describe your solution in detail. You can use code snippets and markdown."
                            className="min-h-[150px]"
                            value={solutionDescription}
                            onChange={(e) => setSolutionDescription(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            You can use markdown for code formatting. Wrap code in \`\`\`language code\`\`\` blocks.
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="private-solution"
                            checked={isPrivateSolution}
                            onChange={(e) => setIsPrivateSolution(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <Label htmlFor="private-solution">Make this solution private</Label>
                        </div>
                        <Button
                          type="submit"
                          className="rounded-lg"
                          disabled={isSubmittingSolution || !solutionDescription.trim()}
                        >
                          {isSubmittingSolution ? "Submitting..." : "Submit Solution"}
                        </Button>
                      </form>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="comments" className="space-y-6">
                  <div className="space-y-4">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                            <AvatarFallback>{comment.author.initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{comment.author.name}</span>
                              <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                            </div>
                            <p className="text-sm">{comment.text}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-medium mb-2">No Comments Yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">Be the first to comment on this error.</p>
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <form onSubmit={handleCommentSubmit} className="space-y-4">
                        <div className="flex gap-4">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <Textarea
                              placeholder="Add a comment..."
                              className="min-h-[100px]"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            className="rounded-lg"
                            disabled={isSubmittingComment || !comment.trim()}
                          >
                            {isSubmittingComment ? "Posting..." : "Post Comment"}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-6">
                  <div className="space-y-4">
                    {activity.length > 0 ? (
                      activity.map((activityItem) => (
                        <div key={activityItem.id} className="flex gap-4">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={activityItem.user.avatar || "/placeholder.svg"} alt={activityItem.user.name} />
                            <AvatarFallback>{activityItem.user.initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{activityItem.user.name}</span>
                              <span className="text-xs text-muted-foreground">{formatDate(activityItem.timestamp)}</span>
                            </div>
                            <p className="text-sm">
                              {activityItem.type === "created" && "created this error"}
                              {activityItem.type === "comment_added" && "added a comment"}
                              {activityItem.type === "assigned" && (
                                <>
                                  assigned this error to <span className="font-medium">{activityItem.assignee?.name}</span>
                                </>
                              )}
                              {activityItem.type === "status_changed" && (
                                <>
                                  changed status from{" "}
                                  <Badge variant="outline" className="text-xs font-normal">
                                    {activityItem.old_status}
                                  </Badge>{" "}
                                  to{" "}
                                  <Badge variant="outline" className="text-xs font-normal">
                                    {activityItem.new_status}
                                  </Badge>
                                </>
                              )}
                              {activityItem.type === "solution_added" && "proposed a solution"}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground">No activity yet</p>
                      </div>
                    )}
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
                <Select defaultValue={error.status}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select defaultValue={error.priority}>
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
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Environment</span>
                  <Badge variant="outline">{error.environment}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Visibility</span>
                  <Badge variant="outline">{error.visible_to_public ? "Public" : "Private"}</Badge>
                </div>
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
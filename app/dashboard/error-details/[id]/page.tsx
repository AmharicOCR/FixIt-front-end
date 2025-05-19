"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type React from "react"
import { useState } from "react"
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
import { useEffect } from "react"

export default function ErrorDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("details")
  const [comment, setComment] = useState("")
  const [solution, setSolution] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [isSubmittingSolution, setIsSubmittingSolution] = useState(false)

  // Join the error room when the component mounts
  useEffect(() => {}, [])

  // Mock error data - in a real app, this would be fetched from an API
  const error = {
    id: params.id,
    title: "TypeError in React useEffect Hook",
    description:
      "Cannot read property 'data' of undefined in useEffect dependency array. This occurs when trying to access nested properties of API response data before it's available.",
    category: "React",
    priority: "High",
    status: "In Progress",
    createdAt: "2023-05-15T10:30:00Z",
    updatedAt: "2023-05-16T14:22:00Z",
    reportedBy: {
      name: "John Assefa",
      avatar: "/placeholder.svg",
      initials: "JA",
    },
    assignedTo: {
      name: "Abiy Shiferaw",
      avatar: "/placeholder.svg",
      initials: "AS",
    },
    programmingLanguage: "JavaScript",
    errorMessage: "TypeError: Cannot read property 'items' of undefined",
    stackTrace: `TypeError: Cannot read property 'items' of undefined
    at processData (App.js:42)
    at Component (App.js:28)
    at processChild (react-dom.development.js:13131)
    at finishClassComponent (react-dom.development.js:13187)
    at updateClassComponent (react-dom.development.js:13140)
    at beginWork (react-dom.development.js:13855)
    at HTMLUnknownElement.callCallback (react-dom.development.js:188)`,
    stepsToReproduce:
      "1. Navigate to the dashboard page\n2. Click on the 'Load Data' button\n3. The error appears in the console and the UI fails to render properly",
    expectedBehavior: "The data should be displayed in a table format with proper error handling for missing data.",
    actualBehavior: "The application crashes with a TypeError in the console.",
    environment: "Development",
    tags: ["react", "useEffect", "api", "frontend"],
    isPublic: true,
    comments: [
      {
        id: "1",
        text: "I've seen this issue before. It's likely because you're trying to access the data before the API response is complete.",
        author: {
          name: "Netsanet Alemu",
          avatar: "/placeholder.svg",
          initials: "NA",
        },
        createdAt: "2023-05-15T11:45:00Z",
      },
      {
        id: "2",
        text: "Have you tried adding a conditional check before accessing the nested property?",
        author: {
          name: "John Assefa",
          avatar: "/placeholder.svg",
          initials: "JA",
        },
        createdAt: "2023-05-15T13:20:00Z",
      },
    ],
    solutions: [
      {
        id: "1",
        title: "Add conditional check in useEffect",
        description:
          "Add a conditional check before accessing nested properties to prevent the TypeError:\n\n```javascript\nuseEffect(() => {\n  if (data && data.items) {\n    // Now it's safe to access data.items\n    processItems(data.items);\n  }\n}, [data]);\n```",
        author: {
          name: "Abiy Shiferaw",
          avatar: "/placeholder.svg",
          initials: "AS",
        },
        createdAt: "2023-05-16T09:15:00Z",
        upvotes: 5,
        isAccepted: false,
      },
    ],
    activity: [
      {
        id: "1",
        type: "created",
        user: {
          name: "John Assefa",
          avatar: "/placeholder.svg",
          initials: "JA",
        },
        timestamp: "2023-05-15T10:30:00Z",
      },
      {
        id: "2",
        type: "comment_added",
        user: {
          name: "Netsanet Alemu",
          avatar: "/placeholder.svg",
          initials: "NA",
        },
        timestamp: "2023-05-15T11:45:00Z",
      },
      {
        id: "3",
        type: "assigned",
        user: {
          name: "John Assefa",
          avatar: "/placeholder.svg",
          initials: "JA",
        },
        assignee: {
          name: "Abiy Shiferaw",
          avatar: "/placeholder.svg",
          initials: "AS",
        },
        timestamp: "2023-05-15T12:30:00Z",
      },
      {
        id: "4",
        type: "status_changed",
        user: {
          name: "Abiy Shiferaw",
          avatar: "/placeholder.svg",
          initials: "AS",
        },
        oldStatus: "Open",
        newStatus: "In Progress",
        timestamp: "2023-05-15T14:10:00Z",
      },
      {
        id: "5",
        type: "solution_added",
        user: {
          name: "Abiy Shiferaw",
          avatar: "/placeholder.svg",
          initials: "AS",
        },
        timestamp: "2023-05-16T09:15:00Z",
      },
    ],
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return

    setIsSubmittingComment(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmittingComment(false)

      // Create a new comment object
      const newComment = {
        id: `comment-${Date.now()}`,
        text: comment,
        author: {
          name: "John Doe",
          avatar: "/placeholder.svg",
          initials: "JD",
        },
        createdAt: new Date().toISOString(),
      }

      // In a real app, you would send this to your API
      // and then emit the WebSocket event after successful creation

      setComment("")
      // In a real app, you would update the comments array with the new comment
    }, 1000)
  }

  const handleSolutionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!solution.trim()) return

    setIsSubmittingSolution(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmittingSolution(false)

      // Create a new solution object
      const newSolution = {
        id: `solution-${Date.now()}`,
        title: "Your solution",
        description: solution,
        author: {
          name: "John Doe",
          avatar: "/placeholder.svg",
          initials: "JD",
        },
        createdAt: new Date().toISOString(),
        upvotes: 0,
        isAccepted: false,
      }

      // In a real app, you would send this to your API
      // and then emit the WebSocket event after successful creation

      setSolution("")
      // In a real app, you would update the solutions array with the new solution
    }, 1000)
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
                    Reported by {error.reportedBy.name} on {formatDate(error.createdAt)}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className={`
                    ${
                      error.status === "Open"
                        ? "border-amber-500 text-amber-500"
                        : error.status === "In Progress"
                          ? "border-blue-500 text-blue-500"
                          : "border-green-500 text-green-500"
                    }
                  `}
                  >
                    {error.status === "Open" && <Clock className="mr-1 h-3 w-3" />}
                    {error.status === "In Progress" && <Clock className="mr-1 h-3 w-3" />}
                    {error.status === "Resolved" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                    {error.status}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`
                    ${
                      error.priority === "Critical"
                        ? "border-red-500 text-red-500"
                        : error.priority === "High"
                          ? "border-amber-500 text-amber-500"
                          : error.priority === "Medium"
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
                          {error.category}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Programming Language</h3>
                        <Badge variant="secondary" className="rounded-full">
                          {error.programmingLanguage}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Error Message</h3>
                      <div className="bg-muted p-3 rounded-md text-sm font-mono">{error.errorMessage}</div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Stack Trace</h3>
                      <div className="bg-muted p-3 rounded-md text-sm font-mono whitespace-pre-wrap overflow-x-auto max-h-[200px]">
                        {error.stackTrace}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Steps to Reproduce</h3>
                      <div className="text-sm whitespace-pre-wrap">{error.stepsToReproduce}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Expected Behavior</h3>
                        <p className="text-sm">{error.expectedBehavior}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Actual Behavior</h3>
                        <p className="text-sm">{error.actualBehavior}</p>
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
                    {error.solutions.length > 0 ? (
                      error.solutions.map((solution) => (
                        <div key={solution.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{solution.title}</h3>
                              <p className="text-xs text-muted-foreground">
                                Proposed by {solution.author.name} on {formatDate(solution.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-8 gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{solution.upvotes}</span>
                              </Button>
                              {solution.isAccepted ? (
                                <Badge variant="success" className="bg-green-500 text-white">
                                  Accepted Solution
                                </Badge>
                              ) : (
                                <Button variant="outline" size="sm" className="h-8">
                                  Accept Solution
                                </Button>
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
                          <Input id="solution-title" placeholder="Brief title for your solution" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="solution-description">Solution Description</Label>
                          <Textarea
                            id="solution-description"
                            placeholder="Describe your solution in detail. You can use code snippets and markdown."
                            className="min-h-[150px]"
                            value={solution}
                            onChange={(e) => setSolution(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            You can use markdown for code formatting. Wrap code in \`\`\`language code\`\`\` blocks.
                          </p>
                        </div>
                        <Button
                          type="submit"
                          className="rounded-lg"
                          disabled={isSubmittingSolution || !solution.trim()}
                        >
                          {isSubmittingSolution ? "Submitting..." : "Submit Solution"}
                        </Button>
                      </form>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="comments" className="space-y-6">
                  <div className="space-y-4">
                    {error.comments.length > 0 ? (
                      error.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                            <AvatarFallback>{comment.author.initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{comment.author.name}</span>
                              <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
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
                    {error.activity.map((activity) => (
                      <div key={activity.id} className="flex gap-4">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                          <AvatarFallback>{activity.user.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{activity.user.name}</span>
                            <span className="text-xs text-muted-foreground">{formatDate(activity.timestamp)}</span>
                          </div>
                          <p className="text-sm">
                            {activity.type === "created" && "created this error"}
                            {activity.type === "comment_added" && "added a comment"}
                            {activity.type === "assigned" && (
                              <>
                                assigned this error to <span className="font-medium">{activity.assignee?.name}</span>
                              </>
                            )}
                            {activity.type === "status_changed" && (
                              <>
                                changed status from{" "}
                                <Badge variant="outline" className="text-xs font-normal">
                                  {activity.oldStatus}
                                </Badge>{" "}
                                to{" "}
                                <Badge variant="outline" className="text-xs font-normal">
                                  {activity.newStatus}
                                </Badge>
                              </>
                            )}
                            {activity.type === "solution_added" && "proposed a solution"}
                          </p>
                        </div>
                      </div>
                    ))}
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
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
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
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignee">Assigned To</Label>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={error.assignedTo.avatar || "/placeholder.svg"} alt={error.assignedTo.name} />
                    <AvatarFallback>{error.assignedTo.initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{error.assignedTo.name}</span>
                  <Button variant="ghost" size="sm" className="ml-auto h-8 px-2">
                    Change
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Created</span>
                  <span className="text-sm text-muted-foreground">{formatDate(error.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Updated</span>
                  <span className="text-sm text-muted-foreground">{formatDate(error.updatedAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Environment</span>
                  <Badge variant="outline">{error.environment}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-medium">Similar Errors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  id: "err-123",
                  title: "Cannot read property of undefined in React component",
                  status: "Resolved",
                },
                {
                  id: "err-456",
                  title: "TypeError when accessing nested API response data",
                  status: "Open",
                },
                {
                  id: "err-789",
                  title: "React useEffect dependency array causing TypeError",
                  status: "In Progress",
                },
              ].map((similarError) => (
                <div key={similarError.id} className="space-y-1">
                  <Link href={`/dashboard/error-details/${similarError.id}`} className="text-sm hover:underline">
                    {similarError.title}
                  </Link>
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        similarError.status === "Open"
                          ? "border-amber-500 text-amber-500"
                          : similarError.status === "In Progress"
                            ? "border-blue-500 text-blue-500"
                            : "border-green-500 text-green-500"
                      }`}
                    >
                      {similarError.status}
                    </Badge>
                  </div>
                </div>
              ))}
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

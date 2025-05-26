"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Bug, CheckCircle2, Clock, MessageSquare, ThumbsUp, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

interface ErrorData {
  id: number
  created_by: string
  tags: string[]
  category: string
  language: string
  framework: string
  solutions: {
    id: number
    title: string
    solution: string
    is_private: boolean
    created_by: string
    created_at: string
  }[]
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
  created_at: string
  updated_at: string
  comments: any[]
  visible_to_public: boolean
}

export default function PublicErrorDetailsPage() {
  const params = useParams()
  const id = params.id as string
  const [activeTab, setActiveTab] = useState("details")
  const [upvoted, setUpvoted] = useState(false)
  const [upvoteCount, setUpvoteCount] = useState(0)
  const [error, setError] = useState<ErrorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchErrorDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/bugtracker/public-errors/${id}/`)
        if (!response.ok) {
          throw new Error('Failed to fetch error details')
        }
        const data = await response.json()
        setError(data)
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchErrorDetails()
  }, [id])

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


  const handleUpvote = () => {
    if (upvoted) {
      setUpvoteCount(upvoteCount - 1)
    } else {
      setUpvoteCount(upvoteCount + 1)
    }
    setUpvoted(!upvoted)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 bg-background/80 shadow-sm">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
                <Bug className="size-5" />
              </div>
              <span>FixIt</span>
            </Link>
            <div className="flex gap-4 items-center">
              <Button variant="outline" className="rounded-lg" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button className="rounded-lg" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          </div>
        </header>
        <main className="container py-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Loading error details...</p>
          </div>
        </main>
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 bg-background/80 shadow-sm">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
                <Bug className="size-5" />
              </div>
              <span>FixIt</span>
            </Link>
            <div className="flex gap-4 items-center">
              <Button variant="outline" className="rounded-lg" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button className="rounded-lg" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          </div>
        </header>
        <main className="container py-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500">{errorMessage}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </main>
      </div>
    )
  }

  if (!error) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 bg-background/80 shadow-sm">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
                <Bug className="size-5" />
              </div>
              <span>FixIt</span>
            </Link>
            <div className="flex gap-4 items-center">
              <Button variant="outline" className="rounded-lg" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button className="rounded-lg" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          </div>
        </header>
        <main className="container py-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Error not found</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/public-errors">Back to Public Errors</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 bg-background/80 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
              <Bug className="size-5" />
            </div>
            <span>FixIt</span>
          </Link>
          <div className="flex gap-4 items-center">
            <Button variant="outline" className="rounded-lg" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button className="rounded-lg" asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/public-errors">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">Back to Public Errors</span>
                </Link>
              </Button>
              <h1 className="text-2xl font-bold tracking-tight">{error.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={upvoted ? "default" : "outline"}
                size="sm"
                className="rounded-lg gap-1"
                onClick={handleUpvote}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{upvoteCount}</span>
              </Button>
              <Button variant="outline" size="sm" className="rounded-lg" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
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
                        {error.status.charAt(0).toUpperCase() + error.status.slice(1)}
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
                        {error.priority.charAt(0).toUpperCase() + error.priority.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="details" className="space-y-4" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3 rounded-lg">
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
                              {error.language}
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
                        {error.solutions.length > 0 ? (
                          error.solutions.map((solution) => (
                            <div key={solution.id} className="border rounded-lg p-4 space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-medium">{solution.title}</h3>
                                  <p className="text-xs text-muted-foreground">
                                    Proposed by {solution.created_by} on {formatDate(solution.created_at)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-sm whitespace-pre-wrap">{solution.solution}</div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <Bug className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <h3 className="font-medium mb-2">No Solutions Yet</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              No solutions have been proposed for this error yet.
                            </p>
                          </div>
                        )}

                        <div className="border-t pt-4">
                          <div className="flex flex-col items-center justify-center py-4 space-y-4">
                            <h3 className="font-medium">Want to propose a solution?</h3>
                            <Button asChild>
                              <Link href="/login">Sign in to contribute</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* <TabsContent value="comments" className="space-y-6">
                      <div className="space-y-4">
                        {error.comments.length > 0 ? (
                          error.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-4">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src="/placeholder.svg" alt={comment.author?.name || "Anonymous"} />
                                <AvatarFallback>{comment.author?.name?.charAt(0) || "A"}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">{comment.author?.name || "Anonymous"}</span>
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
                            <p className="text-sm text-muted-foreground mb-4">
                              No one has commented on this error yet.
                            </p>
                          </div>
                        )}

                        <div className="border-t pt-4">
                          <div className="flex flex-col items-center justify-center py-4 space-y-4">
                            <h3 className="font-medium">Want to join the discussion?</h3>
                            <Button asChild>
                              <Link href="/login">Sign in to comment</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent> */}
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border-border/40 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-medium">Error Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status</span>
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
                        {error.status.charAt(0).toUpperCase() + error.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Priority</span>
                      <Badge
                        variant="outline"
                        className={`
                        ${
                          error.priority === "critical"
                            ? "border-red-500 text-red-500"
                            : error.priority === "high"
                              ? "border-amber-500 text-amber-500"
                              : "border-blue-500 text-blue-500"
                        }
                      `}
                      >
                        {error.priority.charAt(0).toUpperCase() + error.priority.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Created</span>
                      <span className="text-sm text-muted-foreground">{formatDate(error.created_at)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Last Updated</span>
                      <span className="text-sm text-muted-foreground">{formatDate(error.updated_at || error.created_at)}</span>
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
                  {error.tags.slice(0, 3).map((tag, index) => (
                    <div key={index} className="space-y-1">
                      <Link href="#" className="text-sm hover:underline">
                        Similar error related to {tag}
                      </Link>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          Related
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button variant="ghost" size="sm" className="w-full justify-center" asChild>
                    <Link href="/public-errors">Browse All Public Errors</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-border/40 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-medium">Join FixIt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">
                    Sign up to contribute solutions, upvote errors, and collaborate with other developers.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button className="w-full" asChild>
                      <Link href="/signup">Create an Account</Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/login">Sign In</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full border-t bg-background/95 backdrop-blur-sm">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-bold">
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
              <Bug className="size-5" />
            </div>
            <span>FixIt</span>
          </div>
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} FixIt. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
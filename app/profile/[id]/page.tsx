"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Bug, CheckCircle2, Clock, Github, LinkIcon, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { getCookie } from "@/utils/cookies"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface UserData {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  profile_picture?: string
  bio?: string
  jobtitle?: string
  company?: string
  location?: string
  github?: string
  website?: string
  date_joined?: string
  skills?: string
  stats?: {
    errors_reported?: number
    errors_solved?: number
    solutions_submitted?: number
    upvotes_received?: number
  }
  permissions?: {
    canCreateErrors: boolean
    canCreateSolutions: boolean
    canModerate: boolean
    canAssignErrors: boolean
  }
}

export default function UserProfilePage() {
  const { id } = useParams()
  const [user, setUser] = useState<UserData | null>(null)
  interface Activity {
    id: string
    type: "error_resolved" | "solution_added"
    title: string
    timestamp: string
  }
  interface ErrorItem {
    id: string
    title: string
    status: "Open" | "Resolved"
    priority: "High" | "Low"
    timestamp: string
  }
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [errors, setErrors] = useState<ErrorItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const csrftoken = getCookie('csrftoken')
        if (!csrftoken) {
          throw new Error("CSRF token not found")
        }

        const response = await fetch(`http://127.0.0.1:8000/user/${id}/`, {
          method: "GET",
          credentials: "include",
          headers: {
            "X-CSRFToken": csrftoken,
          }
        })

        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }

        const data = await response.json()
        const userWithPermissions = {
          ...data,
          permissions: data.permissions || {
            canCreateErrors: true,
            canCreateSolutions: true,
            canModerate: false,
            canAssignErrors: true,
          }
        }
        setUser(userWithPermissions)

        // TODO: Fetch recent activity and errors from API if available
        setRecentActivity([
          {
            id: "1",
            type: "error_resolved",
            title: "TypeError in React useEffect Hook",
            timestamp: "2 hours ago",
          },
          {
            id: "2",
            type: "solution_added",
            title: "Database Connection Pool Exhausted",
            timestamp: "Yesterday",
          },
        ])

        setErrors([
          {
            id: "err-001",
            title: "TypeError in React useEffect Hook",
            status: "Resolved",
            priority: "High",
            timestamp: "1 week ago",
          },
        ])

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setError(errorMessage)
        toast({
          title: "Error loading user data",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchUserData()
    }
  }, [id, toast])

  if (loading) {
    return (
      <div className="container py-10 max-w-6xl flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="container py-10 max-w-6xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "User not found"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  // Format the user data for display
  const displayUser = {
    name: `${user.first_name} ${user.last_name}`,
    username: user.username,
    avatar: user.profile_picture || "/placeholder.svg",
    initials: `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`,
    bio: user.bio || "",
    jobTitle: user.jobtitle || "",
    company: user.company || "",
    location: user.location || "",
    github: user.github || "",
    website: user.website || "",
    email: user.email || "",
    joined: user.date_joined ? new Date(user.date_joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "",
    skills: user.skills ? user.skills.split(",").map((s: string) => s.trim()) : [],
    stats: {
      errorsReported: user.stats?.errors_reported || 0,
      errorsSolved: user.stats?.errors_solved || 0,
      solutionsSubmitted: user.stats?.solutions_submitted || 0,
      upvotesReceived: user.stats?.upvotes_received || 0,
    },
    permissions: user.permissions
  }

  return (
    <div className="container py-10 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/40 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 h-24"></div>
            <div className="px-6 pb-6">
              <div className="-mt-12 flex justify-center">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
                  <AvatarFallback>{displayUser.initials}</AvatarFallback>
                </Avatar>
              </div>
              <div className="mt-4 text-center">
                <h1 className="text-2xl font-bold">{displayUser.name}</h1>
                <p className="text-muted-foreground">@{displayUser.username}</p>
                <p className="mt-1">{displayUser.jobTitle}</p>
                <p className="text-sm text-muted-foreground">{displayUser.company}</p>
              </div>
              {displayUser.permissions?.canModerate && (
                <div className="mt-6 flex justify-center">
                  <Button variant="outline" className="rounded-lg">
                    Manage User
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{displayUser.bio}</p>

              <div className="space-y-2">
                {displayUser.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{displayUser.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{displayUser.email}</span>
                </div>
                {displayUser.github && (
                  <div className="flex items-center gap-2 text-sm">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={displayUser.github}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub Profile
                    </a>
                  </div>
                )}
                {displayUser.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={displayUser.website}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {displayUser.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
                {displayUser.joined && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Joined {displayUser.joined}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {displayUser.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="rounded-full px-3 py-1">
                    {skill}
                  </Badge>
                ))}
                {displayUser.skills.length === 0 && (
                  <p className="text-sm text-muted-foreground">No skills added yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 text-center">
                  <p className="text-2xl font-bold">{displayUser.stats.errorsReported}</p>
                  <p className="text-xs text-muted-foreground">Errors Reported</p>
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-2xl font-bold">{displayUser.stats.errorsSolved}</p>
                  <p className="text-xs text-muted-foreground">Errors Solved</p>
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-2xl font-bold">{displayUser.stats.solutionsSubmitted}</p>
                  <p className="text-xs text-muted-foreground">Solutions Added</p>
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-2xl font-bold">{displayUser.stats.upvotesReceived}</p>
                  <p className="text-xs text-muted-foreground">Upvotes Received</p>
                </div>
              </div>

              {displayUser.stats.errorsReported > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Resolution Rate</span>
                    <span className="font-medium">
                      {Math.round((displayUser.stats.errorsSolved / displayUser.stats.errorsReported) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={Math.round((displayUser.stats.errorsSolved / displayUser.stats.errorsReported) * 100)}
                    className="h-2"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="activity" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 rounded-lg">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="errors">Errors</TabsTrigger>
              <TabsTrigger value="solutions">Solutions</TabsTrigger>
            </TabsList>

            <Card className="border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-4">
                      <div className="mt-0.5">
                        {activity.type === "error_resolved" && (
                          <div className="bg-green-500/20 text-green-500 p-2 rounded-full">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                        )}
                        {activity.type === "solution_added" && (
                          <div className="bg-blue-500/20 text-blue-500 p-2 rounded-full">
                            <LinkIcon className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          {activity.type === "error_resolved" && <span>Resolved error: </span>}
                          {activity.type === "solution_added" && <span>Added solution to: </span>}
                          <Link href="#" className="font-medium hover:underline">
                            {activity.title}
                          </Link>
                        </p>
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                  {recentActivity.length === 0 && (
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle>Recent Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {errors.map((error) => (
                    <div key={error.id} className="flex justify-between items-center">
                      <div>
                        <Link href={`/dashboard/error-details/${error.id}`} className="font-medium hover:underline">
                          {error.title}
                        </Link>
                        <div className="flex gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              error.status === "Open"
                                ? "border-amber-500 text-amber-500"
                                : "border-green-500 text-green-500"
                            }`}
                          >
                            {error.status}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              error.priority === "High"
                                ? "border-amber-500 text-amber-500"
                                : "border-blue-500 text-blue-500"
                            }`}
                          >
                            {error.priority}
                          </Badge>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{error.timestamp}</span>
                    </div>
                  ))}
                  {errors.length === 0 && (
                    <p className="text-sm text-muted-foreground">No recent errors</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function MessageSquare(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  )
}
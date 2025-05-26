"use client"

import React, { useState, useEffect } from "react"
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

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "",
    username: "",
    avatar: "/placeholder.svg",
    initials: "",
    bio: "",
    jobTitle: "",
    company: "",
    location: "",
    github: "",
    website: "",
    email: "",
    joined: "",
    skills: [] as string[],
    stats: {
      errorsReported: 0,
      errorsSolved: 0,
      solutionsSubmitted: 0,
      upvotesReceived: 0,
    },
  })

  type RecentActivity = {
    id: string
    type: string
    title: string
    timestamp: string
  }

  type ErrorItem = {
    id: number
    title: string
    status: string
    priority: string
    created_at: string
    language: string
    framework: string
    category: string
  }

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [errors, setErrors] = useState<ErrorItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const csrftoken = getCookie('csrftoken')
        if (!csrftoken) {
          throw new Error("CSRF token not found")
        }
        
        // Fetch user profile data
        const profileResponse = await fetch("http://127.0.0.1:8000/user/profile/", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
        })

        if (!profileResponse.ok) {
          throw new Error("Failed to fetch user data")
        }

        const profileData = await profileResponse.json()
        
        // Format the data to match our UI structure
        setUser({
          name: `${profileData.first_name} ${profileData.last_name}`,
          username: profileData.username,
          avatar: profileData.profile_picture || "/placeholder.svg",
          initials: `${profileData.first_name.charAt(0)}${profileData.last_name.charAt(0)}`,
          bio: profileData.bio || "",
          jobTitle: profileData.jobtitle || "",
          company: profileData.company || "",
          location: profileData.location || "",
          github: profileData.github || "",
          website: profileData.website || "",
          email: profileData.email || "",
          joined: profileData.date_joined ? new Date(profileData.date_joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "",
          skills: profileData.skills ? profileData.skills.split(",").map((s: string) => s.trim()) : [],
          stats: {
            errorsReported: profileData.stats?.errors_reported || 0,
            errorsSolved: profileData.stats?.errors_solved || 0,
            solutionsSubmitted: profileData.stats?.solutions_submitted || 0,
            upvotesReceived: profileData.stats?.upvotes_received || 0,
          }
        })

        // Fetch user's errors
        const errorsResponse = await fetch("http://127.0.0.1:8000/bugtracker/my-errors/", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
        })

        if (!errorsResponse.ok) {
          throw new Error("Failed to fetch user errors")
        }

        const errorsData = await errorsResponse.json()
        setErrors(errorsData.map((error: any) => ({
          id: error.id,
          title: error.title,
          status: error.status,
          priority: error.priority,
          created_at: new Date(error.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          language: error.language,
          framework: error.framework,
          category: error.category
        })))

        // Generate recent activity based on errors
        const activity = errorsData.slice(0, 3).map((error: any) => ({
          id: error.id.toString(),
          type: "error_reported",
          title: error.title,
          timestamp: formatTimeAgo(new Date(error.created_at))
        }))

        setRecentActivity(activity)

      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  function formatTimeAgo(date: Date): string {
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (seconds < 60) return `${Math.floor(seconds)} seconds ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`
    return `${Math.floor(seconds / 2592000)} months ago`
  }

  if (loading) {
    return (
      <div className="container py-10 max-w-6xl flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-10 max-w-6xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
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
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.initials}</AvatarFallback>
                </Avatar>
              </div>
              <div className="mt-4 text-center">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">@{user.username}</p>
                <p className="mt-1">{user.jobTitle}</p>
                <p className="text-sm text-muted-foreground">{user.company}</p>
              </div>
              <div className="mt-6 flex justify-center">
                <Button className="rounded-lg" asChild>
                  <Link href="/dashboard/settings">Edit Profile</Link>
                </Button>
              </div>
            </div>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{user.bio}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{user.location || "No location specified"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                {user.github && (
                  <div className="flex items-center gap-2 text-sm">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={user.github}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub Profile
                    </a>
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={user.website}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {user.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
                {user.joined && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Joined {user.joined}</span>
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
                {user.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="rounded-full px-3 py-1">
                    {skill}
                  </Badge>
                ))}
                {user.skills.length === 0 && (
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
                  <p className="text-2xl font-bold">{user.stats.errorsReported}</p>
                  <p className="text-xs text-muted-foreground">Errors Reported</p>
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-2xl font-bold">{user.stats.errorsSolved}</p>
                  <p className="text-xs text-muted-foreground">Errors Solved</p>
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-2xl font-bold">{user.stats.solutionsSubmitted}</p>
                  <p className="text-xs text-muted-foreground">Solutions Added</p>
                </div>
                <div className="space-y-1 text-center">
                  <p className="text-2xl font-bold">{user.stats.upvotesReceived}</p>
                  <p className="text-xs text-muted-foreground">Upvotes Received</p>
                </div>
              </div>

              {user.stats.errorsReported > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Resolution Rate</span>
                    <span className="font-medium">
                      {Math.round((user.stats.errorsSolved / user.stats.errorsReported) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={Math.round((user.stats.errorsSolved / user.stats.errorsReported) * 100)}
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
                        {activity.type === "error_reported" && (
                          <div className="bg-amber-500/20 text-amber-500 p-2 rounded-full">
                            <Bug className="h-4 w-4" />
                          </div>
                        )}
                        {activity.type === "solution_added" && (
                          <div className="bg-blue-500/20 text-blue-500 p-2 rounded-full">
                            <LinkIcon className="h-4 w-4" />
                          </div>
                        )}
                        {activity.type === "comment_added" && (
                          <div className="bg-purple-500/20 text-purple-500 p-2 rounded-full">
                            <MessageSquare className="h-4 w-4" />
                          </div>
                        )}
                        {activity.type === "solution_upvoted" && (
                          <div className="bg-pink-500/20 text-pink-500 p-2 rounded-full">
                            <ThumbsUp className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          {activity.type === "error_resolved" && <span>Resolved error: </span>}
                          {activity.type === "error_reported" && <span>Reported error: </span>}
                          {activity.type === "solution_added" && <span>Added solution to: </span>}
                          {activity.type === "comment_added" && <span>Commented on: </span>}
                          {activity.type === "solution_upvoted" && <span>Received upvote on solution for: </span>}
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
                              error.status === "open"
                                ? "border-amber-500 text-amber-500"
                                : error.status === "in progress"
                                  ? "border-blue-500 text-blue-500"
                                  : "border-green-500 text-green-500"
                            }`}
                          >
                            {error.status.charAt(0).toUpperCase() + error.status.slice(1)}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              error.priority === "critical"
                                ? "border-red-500 text-red-500"
                                : error.priority === "high"
                                  ? "border-amber-500 text-amber-500"
                                  : "border-blue-500 text-blue-500"
                            }`}
                          >
                            {error.priority.charAt(0).toUpperCase() + error.priority.slice(1)}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {error.language}
                          </Badge>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{error.created_at}</span>
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

function ThumbsUp(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M7 10v12"></path>
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
    </svg>
  )
}
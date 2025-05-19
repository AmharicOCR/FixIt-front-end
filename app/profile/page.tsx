"use client"

import type React from "react"

import { Bug, CheckCircle2, Clock, Github, LinkIcon, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function ProfilePage() {
  // Mock user data
  const user = {
    name: "John Doe",
    username: "johndoe",
    avatar: "/placeholder.svg",
    initials: "JD",
    bio: "Frontend developer with 5+ years experience. Passionate about fixing bugs and optimizing code performance.",
    jobTitle: "Senior Frontend Developer",
    company: "Acme Inc.",
    location: "San Francisco, CA",
    github: "https://github.com/johndoe",
    website: "https://johndoe.dev",
    email: "john.doe@example.com",
    joined: "November 2022",
    skills: ["JavaScript", "React", "TypeScript", "Next.js", "Node.js", "CSS", "HTML", "Git"],
    stats: {
      errorsReported: 42,
      errorsSolved: 35,
      solutionsSubmitted: 28,
      upvotesReceived: 156,
    },
  }

  // Mock activity data
  const recentActivity = [
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
    {
      id: "3",
      type: "comment_added",
      title: "JWT Authentication Failure",
      timestamp: "3 days ago",
    },
    {
      id: "4",
      type: "error_reported",
      title: "CSS Grid Layout Overflow on Mobile",
      timestamp: "1 week ago",
    },
    {
      id: "5",
      type: "solution_upvoted",
      title: "Memory Leak in Service Worker",
      timestamp: "2 weeks ago",
    },
  ]

  // Mock errors data
  const errors = [
    {
      id: "err-001",
      title: "TypeError in React useEffect Hook",
      status: "Resolved",
      priority: "High",
      timestamp: "1 week ago",
    },
    {
      id: "err-002",
      title: "CSS Grid Layout Overflow on Mobile",
      status: "Open",
      priority: "Medium",
      timestamp: "1 week ago",
    },
    {
      id: "err-003",
      title: "JWT Authentication Failure",
      status: "Resolved",
      priority: "High",
      timestamp: "3 weeks ago",
    },
  ]

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
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
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
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
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
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {user.joined}</span>
                </div>
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
                                : error.status === "In Progress"
                                  ? "border-blue-500 text-blue-500"
                                  : "border-green-500 text-green-500"
                            }`}
                          >
                            {error.status}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              error.priority === "Critical"
                                ? "border-red-500 text-red-500"
                                : error.priority === "High"
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

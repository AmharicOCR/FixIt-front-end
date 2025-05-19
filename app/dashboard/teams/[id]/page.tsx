"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, MessageSquare, MoreHorizontal, Plus, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSocket } from "@/contexts/socket-context"

export default function TeamDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("members")
  const { socket } = useSocket()

  // Mock team data - in a real app, this would be fetched from an API
  const team = {
    id: params.id,
    name: "Frontend Development",
    description: "Responsible for UI/UX implementation and frontend architecture",
    members: [
      {
        id: "user-1",
        name: "John Assefa",
        avatar: "/placeholder.svg",
        initials: "JA",
        role: "Team Lead",
        status: "online",
      },
      {
        id: "user-2",
        name: "Abiy Shiferaw",
        avatar: "/placeholder.svg",
        initials: "AS",
        role: "Senior Developer",
        status: "offline",
      },
      {
        id: "user-3",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg",
        initials: "SJ",
        role: "UI Designer",
        status: "online",
      },
      {
        id: "user-4",
        name: "Michael Chen",
        avatar: "/placeholder.svg",
        initials: "MC",
        role: "Developer",
        status: "away",
      },
    ],
    errors: [
      {
        id: "err-001",
        title: "TypeError in React useEffect Hook",
        status: "In Progress",
        priority: "High",
        assignedTo: { name: "Abiy Shiferaw", avatar: "/placeholder.svg", initials: "AS" },
      },
      {
        id: "err-002",
        title: "CSS Grid Layout Overflow on Mobile",
        status: "Open",
        priority: "Medium",
        assignedTo: { name: "Sarah Johnson", avatar: "/placeholder.svg", initials: "SJ" },
      },
      {
        id: "err-003",
        title: "Redux State Management Bug",
        status: "Resolved",
        priority: "Medium",
        assignedTo: { name: "John Assefa", avatar: "/placeholder.svg", initials: "JA" },
      },
    ],
    discussions: [
      {
        id: "disc-001",
        title: "Weekly Sprint Planning",
        lastMessage: "Let's discuss the upcoming tasks for this sprint",
        lastActivity: "2 hours ago",
        participants: 4,
      },
      {
        id: "disc-002",
        title: "UI Component Library",
        lastMessage: "We need to standardize our component approach",
        lastActivity: "Yesterday",
        participants: 3,
      },
      {
        id: "disc-003",
        title: "Performance Optimization",
        lastMessage: "The dashboard is loading slowly on mobile devices",
        lastActivity: "3 days ago",
        participants: 4,
      },
    ],
  }

  // Join the team room when the component mounts
  useEffect(() => {
    if (socket && team.id) {
      // Join the room for this specific team
      socket.emit("join_team_room", team.id)

      // Listen for team updates
      const handleTeamUpdate = (update: any) => {
        console.log("Team updated:", update)
        // In a real app, you would update the team state with the new data
      }

      const handleNewTeamMember = (member: any) => {
        console.log("New team member:", member)
        // In a real app, you would add this member to the team members array
      }

      const handleNewError = (error: any) => {
        console.log("New error assigned to team:", error)
        // In a real app, you would add this error to the team errors array
      }

      socket.on(`team_${team.id}_update`, handleTeamUpdate)
      socket.on(`team_${team.id}_new_member`, handleNewTeamMember)
      socket.on(`team_${team.id}_new_error`, handleNewError)

      // Clean up when component unmounts
      return () => {
        socket.emit("leave_team_room", team.id)
        socket.off(`team_${team.id}_update`, handleTeamUpdate)
        socket.off(`team_${team.id}_new_member`, handleNewTeamMember)
        socket.off(`team_${team.id}_new_error`, handleNewError)
      }
    }
  }, [socket, team.id])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/teams">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Teams</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{team.name}</h1>
            <p className="text-muted-foreground">{team.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-lg" asChild>
            <Link href={`/dashboard/teams/${team.id}/settings`}>
              <Settings className="mr-2 h-4 w-4" />
              Team Settings
            </Link>
          </Button>
          <Button className="rounded-lg">
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      <Tabs defaultValue="members" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3 rounded-lg">
          <TabsTrigger value="members" className="rounded-lg">
            <Users className="mr-2 h-4 w-4" />
            Members
          </TabsTrigger>
          <TabsTrigger value="errors" className="rounded-lg">
            Errors
          </TabsTrigger>
          <TabsTrigger value="discussions" className="rounded-lg">
            <MessageSquare className="mr-2 h-4 w-4" />
            Discussions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Team Members</CardTitle>
              <CardDescription>{team.members.length} members in this team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {team.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.initials}</AvatarFallback>
                        </Avatar>
                        <span
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background 
                            ${
                              member.status === "online"
                                ? "bg-green-500"
                                : member.status === "away"
                                  ? "bg-amber-500"
                                  : "bg-gray-300"
                            }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View profile</DropdownMenuItem>
                        <DropdownMenuItem>Send message</DropdownMenuItem>
                        <DropdownMenuItem>Change role</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">Remove from team</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Team Errors</CardTitle>
              <CardDescription>Errors assigned to this team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {team.errors.map((error) => (
                  <div key={error.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
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
                        {error.status}
                      </Badge>
                      <div>
                        <Link href={`/dashboard/error-details/${error.id}`} className="font-medium hover:underline">
                          {error.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">Assigned to:</span>
                          <div className="flex items-center gap-1">
                            <Avatar className="h-5 w-5">
                              <AvatarImage
                                src={error.assignedTo.avatar || "/placeholder.svg"}
                                alt={error.assignedTo.name}
                              />
                              <AvatarFallback>{error.assignedTo.initials}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs">{error.assignedTo.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`
                        ${
                          error.priority === "Critical"
                            ? "border-red-500 text-red-500"
                            : error.priority === "High"
                              ? "border-amber-500 text-amber-500"
                              : "border-blue-500 text-blue-500"
                        }
                      `}
                    >
                      {error.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discussions" className="space-y-4">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Team Discussions</CardTitle>
              <CardDescription>Ongoing discussions within the team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {team.discussions.map((discussion) => (
                  <div key={discussion.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{discussion.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{discussion.lastMessage}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-1">
                        {discussion.participants} participants
                      </Badge>
                      <p className="text-xs text-muted-foreground">{discussion.lastActivity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { MoreHorizontal, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [newTeamName, setNewTeamName] = useState("")
  const [newTeamDescription, setNewTeamDescription] = useState("")
  const [isCreatingTeam, setIsCreatingTeam] = useState(false)
  const [activeTab, setActiveTab] = useState("my-teams")

  // Mock teams data
  const myTeams = [
    {
      id: "team-1",
      name: "Frontend Development",
      description: "Responsible for UI/UX implementation and frontend architecture",
      members: [
        { name: "John Assefa", avatar: "/placeholder.svg", initials: "JA", role: "Team Lead" },
        { name: "Abiy Shiferaw", avatar: "/placeholder.svg", initials: "AS", role: "Senior Developer" },
        { name: "Sarah Johnson", avatar: "/placeholder.svg", initials: "SJ", role: "UI Designer" },
        { name: "Michael Chen", avatar: "/placeholder.svg", initials: "MC", role: "Developer" },
      ],
      activeErrors: 12,
      resolvedErrors: 45,
      progress: 78,
    },
    {
      id: "team-2",
      name: "Backend Services",
      description: "API development, database optimization, and server infrastructure",
      members: [
        { name: "Netsanet Alemu", avatar: "/placeholder.svg", initials: "NA", role: "Team Lead" },
        { name: "David Kim", avatar: "/placeholder.svg", initials: "DK", role: "Database Specialist" },
        { name: "Emily Rodriguez", avatar: "/placeholder.svg", initials: "ER", role: "Backend Developer" },
      ],
      activeErrors: 8,
      resolvedErrors: 37,
      progress: 82,
    },
  ]

  const allTeams = [
    ...myTeams,
    {
      id: "team-3",
      name: "DevOps",
      description: "CI/CD pipeline, deployment automation, and infrastructure management",
      members: [
        { name: "James Wilson", avatar: "/placeholder.svg", initials: "JW", role: "DevOps Engineer" },
        { name: "Lisa Patel", avatar: "/placeholder.svg", initials: "LP", role: "Cloud Architect" },
        { name: "Robert Taylor", avatar: "/placeholder.svg", initials: "RT", role: "System Administrator" },
      ],
      activeErrors: 5,
      resolvedErrors: 28,
      progress: 85,
    },
    {
      id: "team-4",
      name: "QA & Testing",
      description: "Quality assurance, automated testing, and test case management",
      members: [
        { name: "Sophia Martinez", avatar: "/placeholder.svg", initials: "SM", role: "QA Lead" },
        { name: "Daniel Lee", avatar: "/placeholder.svg", initials: "DL", role: "Test Automation Engineer" },
        { name: "Olivia Brown", avatar: "/placeholder.svg", initials: "OB", role: "QA Analyst" },
      ],
      activeErrors: 14,
      resolvedErrors: 52,
      progress: 79,
    },
  ]

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreatingTeam(true)

    // Simulate API call
    setTimeout(() => {
      setIsCreatingTeam(false)
      setNewTeamName("")
      setNewTeamDescription("")
      // In a real app, you would add the new team to the teams array
    }, 1000)
  }

  const filteredTeams =
    activeTab === "my-teams"
      ? myTeams.filter((team) => team.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : allTeams.filter((team) => team.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">Manage your teams and collaborate on error resolution</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-lg">
                <Plus className="mr-2 h-4 w-4" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreateTeam}>
                <DialogHeader>
                  <DialogTitle>Create New Team</DialogTitle>
                  <DialogDescription>Create a new team to collaborate on error resolution.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="team-name">Team Name</Label>
                    <Input
                      id="team-name"
                      placeholder="e.g., Frontend Development"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="team-description">Description</Label>
                    <Input
                      id="team-description"
                      placeholder="Brief description of the team's focus"
                      value={newTeamDescription}
                      onChange={(e) => setNewTeamDescription(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Initial Members</Label>
                    <div className="flex flex-wrap gap-2 border rounded-md p-2">
                      <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <span className="text-xs">You (Team Lead)</span>
                      </div>
                      <Button type="button" variant="ghost" size="sm" className="rounded-full h-8">
                        <Plus className="h-3 w-3 mr-1" />
                        Add Member
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isCreatingTeam || !newTeamName.trim()}>
                    {isCreatingTeam ? "Creating..." : "Create Team"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search teams..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Tabs defaultValue="my-teams" className="w-full sm:w-auto" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 sm:w-[300px]">
              <TabsTrigger value="my-teams">My Teams</TabsTrigger>
              <TabsTrigger value="all-teams">All Teams</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTeams.length > 0 ? (
            filteredTeams.map((team) => (
              <Card key={team.id} className="border-border/40 shadow-sm overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <CardDescription className="line-clamp-1">{team.description}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/teams/${team.id}`}>View team</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/teams/${team.id}/settings`}>Team settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Leave team</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex -space-x-2 overflow-hidden mb-4">
                    {team.members.slice(0, 4).map((member, i) => (
                      <Avatar key={i} className="border-2 border-background h-8 w-8">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.initials}</AvatarFallback>
                      </Avatar>
                    ))}
                    {team.members.length > 4 && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                        +{team.members.length - 4}
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Resolution Rate</span>
                      <span className="font-medium">{team.progress}%</span>
                    </div>
                    <Progress value={team.progress} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <div>
                        <Badge variant="outline" className="border-amber-500 text-amber-500">
                          {team.activeErrors} Active Errors
                        </Badge>
                      </div>
                      <div>
                        <Badge variant="outline" className="border-green-500 text-green-500">
                          {team.resolvedErrors} Resolved Errors
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No teams found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

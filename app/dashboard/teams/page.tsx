"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Plus, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { useAuth } from "@/hooks/useAuth"
import { getCookie } from "@/utils/cookies"

interface TeamMember {
  id: number
  name: string
}

interface Team {
  id: number
  name: string
  description: string
  created_by: string
  team_members: TeamMember[]
  activeErrors?: number
  resolvedErrors?: number
  progress?: number
}

interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error'
}

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [newTeamName, setNewTeamName] = useState("")
  const [newTeamDescription, setNewTeamDescription] = useState("")
  const [isCreatingTeam, setIsCreatingTeam] = useState(false)
  const [activeTab, setActiveTab] = useState("my-teams")
  const [memberEmails, setMemberEmails] = useState<string[]>([])
  const [currentEmailInput, setCurrentEmailInput] = useState("")
  const [myTeams, setMyTeams] = useState<Team[]>([])
  const [allTeams, setAllTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const { username, email } = useAuth()
  const csrftoken = getCookie("csrftoken")
  const router = useRouter()

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 5000)
  }

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        if (!csrftoken) {
          throw new Error("CSRF token not found")
        }
        const response = await fetch("http://127.0.0.1:8000/bugtracker/teams/", {
          method: "GET",
          credentials: 'include',
          headers: {
            "X-CSRFToken": csrftoken,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch teams')
        }

        const data = await response.json()
        
        // Add mock stats for demonstration (replace with actual data when available)
        const teamsWithStats = data.map((team: Team) => ({
          ...team,
          activeErrors: Math.floor(Math.random() * 20),
          resolvedErrors: Math.floor(Math.random() * 50),
          progress: Math.floor(Math.random() * 100),
        }))

        setMyTeams(teamsWithStats)
        setAllTeams(teamsWithStats)
        setIsLoading(false)
      } catch (error) {
        showToast(error instanceof Error ? error.message : "Failed to load teams", 'error')
        setIsLoading(false)
      }
    }

    fetchTeams()
  }, [csrftoken])

  const handleAddMember = () => {
    if (currentEmailInput && !memberEmails.includes(currentEmailInput)) {
      setMemberEmails([...memberEmails, currentEmailInput])
      setCurrentEmailInput("")
    }
  }

  const handleRemoveMember = (emailToRemove: string) => {
    setMemberEmails(memberEmails.filter(email => email !== emailToRemove))
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTeamName.trim()) return

    setIsCreatingTeam(true)
    
    try {
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch("http://127.0.0.1:8000/bugtracker/teams/", {
        method: "POST",
        credentials: 'include',
        headers: {
          "X-CSRFToken": csrftoken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newTeamName,
          description: newTeamDescription,
          team_members: [...memberEmails, email]
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create team')
      }

      const newTeam = await response.json()
      
      showToast(`Team "${newTeamName}" created successfully`, 'success')

      // Add the new team to the state
      const teamWithStats = {
        ...newTeam,
        activeErrors: 0,
        resolvedErrors: 0,
        progress: 0,
      }
      
      setMyTeams([teamWithStats, ...myTeams])
      setAllTeams([teamWithStats, ...allTeams])

      // Reset form
      setNewTeamName("")
      setNewTeamDescription("")
      setMemberEmails([])
      setIsDialogOpen(false)
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to create team", 'error')
    } finally {
      setIsCreatingTeam(false)
    }
  }

  const filteredTeams =
    activeTab === "my-teams"
      ? myTeams.filter((team) => 
          team.name?.toLowerCase().includes(searchQuery.toLowerCase()))
      : allTeams.filter((team) => 
          team.name?.toLowerCase().includes(searchQuery.toLowerCase()))

  const formatTeamMembers = (team: Team) => {
    return team.team_members.map((member, index) => ({
      name: member.name,
      initials: member.name.substring(0, 2).toUpperCase(),
      role: index === 0 ? "Team Lead" : "Member"
    }))
  }

  const handleCardClick = (teamId: number) => {
    router.push(`/dashboard/teams/${teamId}`)
  }

  return (
    <div className="space-y-6 relative">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-[1000] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-md shadow-lg ${
              toast.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{toast.message}</span>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="ml-4"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">Manage your teams and collaborate on error resolution</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                    <Label>Members</Label>
                    <div className="flex flex-wrap gap-2 border rounded-md p-2">
                      <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-1">
                        <span className="text-xs">{username} (you)</span>
                      </div>
                      {memberEmails.map((email) => (
                        <div key={email} className="flex items-center gap-1 bg-muted rounded-full px-3 py-1">
                          <span className="text-xs">{email}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(email)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="Enter member email"
                        value={currentEmailInput}
                        onChange={(e) => setCurrentEmailInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddMember()
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddMember}
                        disabled={!currentEmailInput}
                      >
                        Add
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

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <Card 
                  key={team.id} 
                  className="border-border/40 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleCardClick(team.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{team.name}</CardTitle>
                        <CardDescription className="line-clamp-1">{team.description}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
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
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex -space-x-2 overflow-hidden mb-4">
                      {formatTeamMembers(team).slice(0, 4).map((member, i) => (
                        <Avatar key={i} className="border-2 border-background h-8 w-8">
                          <AvatarFallback className="bg-muted text-foreground">
                            {member.initials}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {team.team_members.length > 4 && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                          +{team.team_members.length - 4}
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
        )}
      </div>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { use } from "react" // Add this import
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, MessageSquare, MoreHorizontal, Plus, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
}

export default function TeamDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params promise
  const { id } = use(params)
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("members")
  const [team, setTeam] = useState<Team | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [toasts, setToasts] = useState<{id: string, message: string, type: 'success' | 'error'}[]>([])
  const csrftoken = getCookie("csrftoken")

  const showToast = (message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 5000)
  }

  const fetchTeam = async () => {
    try {
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/teams/${id}/`, {
        method: "GET",
        credentials: 'include',
        headers: {
          "X-CSRFToken": csrftoken,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch team')
      }

      const data = await response.json()
      setTeam(data)
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to load team", 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTeam()
  }, [id])

  const handleRemoveMember = async (memberId: number) => {
    try {
      if (!team) return
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }
      const updatedMembers = team.team_members.filter(member => member.id !== memberId)
      const memberEmails = updatedMembers.map(member => member.name) // Using name as email placeholder

      const response = await fetch(`http://127.0.0.1:8000/bugtracker/teams/${team.id}/`, {
        method: "PUT",
        credentials: 'include',
        headers: {
          "X-CSRFToken": csrftoken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: team.name,
          description: team.description,
          team_members: memberEmails
        })
      })

      if (!response.ok) {
        throw new Error('Failed to remove member')
      }

      showToast("Member removed successfully", 'success')
      fetchTeam() // Refetch data
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to remove member", 'error')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p>Team not found</p>
        <Button asChild>
          <Link href="/dashboard/teams">Back to Teams</Link>
        </Button>
      </div>
    )
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
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

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
              <CardDescription>{team.team_members.length} members in this team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {team.team_members.map((member) => {
                  const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase()
                  
                  return (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-muted text-foreground">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
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
                          <DropdownMenuItem onClick={() => router.push(`/profile/${member.id}`)}>
                            View profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500" onClick={() => handleRemoveMember(member.id)}>
                            Remove from team
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )
                })}
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
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No errors assigned to this team</p>
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
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No discussions in this team</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
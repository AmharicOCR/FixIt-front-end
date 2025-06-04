"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Info, MoreHorizontal, PlusCircle, Save, Trash2, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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

export default function TeamSettingsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("general")
  const [team, setTeam] = useState<Team | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [isSaving, setIsSaving] = useState(false)
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
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/teams/${params.id}/`, {
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
      console.log("Fetched team data:", data) // Debugging line
      setTeam(data)
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to load team", 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTeam()
  }, [params.id])

  const handleSaveGeneral = async () => {
    if (!team) return

    setIsSaving(true)
    
    try {
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }
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
          members: team.team_members.map(member => member.name) // Using name as email placeholder
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update team')
      }

      showToast("Team updated successfully", 'success')
      fetchTeam() // Refetch data
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to update team", 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (!team) return

      // Add new member to the team
      const updatedMembers = [
        ...team.team_members,
        { id: 0, name: inviteEmail } // Temporary ID, will be replaced after refetch
      ]
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }
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
          members: updatedMembers.map(member => member.name)
        })
      })

      if (!response.ok) {
        
        const errorData = await response.json()
        console.log("Error data:", errorData)
        throw new Error(errorData.members[0] || 'Failed to add member')
      }


      showToast(`Member ${inviteEmail} added successfully`, 'success')
      setShowInviteDialog(false)
      setInviteEmail("")
      fetchTeam() // Refetch data
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error adding member:ss", error.message)
      } else {
        console.log("Error adding member:", error)
      }
      showToast(error instanceof Error ? error.message : "Failed to add member", 'error')
    }
  }

  const handleDeleteTeam = async () => {
    try {
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/teams/${params.id}/`, {
        method: "DELETE",
        credentials: 'include',
        headers: {
          "X-CSRFToken": csrftoken,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete team')
      }

      showToast("Team deleted successfully", 'success')
      router.push("/dashboard/teams")
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Failed to delete team", 'error')
      setShowDeleteConfirm(false)
    }
  }

  const handleRemoveMember = async (memberId: number) => {
    try {
      if (!team) return
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }

      const updatedMembers = team.team_members.filter(member => member.id !== memberId)

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
          members: updatedMembers.map(member => member.name)
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
            <Link href={`/dashboard/teams/${team.id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Team</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Team Settings</h1>
            <p className="text-muted-foreground">Manage team settings and members</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3 rounded-lg">
          <TabsTrigger value="general" className="rounded-lg">
            General
          </TabsTrigger>
          <TabsTrigger value="members" className="rounded-lg">
            Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle>Team Information</CardTitle>
              <CardDescription>Manage your team's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  value={team.name}
                  onChange={(e) => setTeam({...team, name: e.target.value})}
                  className="max-w-md"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-description">Description</Label>
                <Textarea
                  id="team-description"
                  value={team.description}
                  onChange={(e) => setTeam({...team, description: e.target.value})}
                  className="max-w-md"
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="rounded-lg" onClick={handleSaveGeneral} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>Destructive actions that cannot be undone</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-red-200 dark:border-red-900 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-red-500">Delete Team</h3>
                    <p className="text-sm text-muted-foreground">
                      This will permanently delete the team and all associated data
                    </p>
                  </div>
                  <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="rounded-lg">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Team
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the "{team.name}" team and all of its data. This action cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteTeam} className="bg-red-500 hover:bg-red-600">
                          Delete Team
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage members and their roles</CardDescription>
                </div>
                <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                  <DialogTrigger asChild>
                    <Button className="rounded-lg">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Member</DialogTitle>
                      <DialogDescription>Add a new member to this team</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleInviteUser}>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="example@email.com"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="rounded-lg">
                          Add Member
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {team.team_members.map((member) => {
                  const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase()
                  
                  return (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-muted text-foreground">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
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
                          <DropdownMenuItem 
                            className="text-red-500"
                            onClick={() => handleRemoveMember(member.id)}
                          >
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
      </Tabs>
    </div>
  )
}
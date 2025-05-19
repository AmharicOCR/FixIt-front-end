"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Info, MoreHorizontal, PlusCircle, Save, Trash2, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

export default function TeamSettingsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("general")
  const [teamName, setTeamName] = useState("Frontend Development")
  const [teamDescription, setTeamDescription] = useState(
    "Responsible for UI/UX implementation and frontend architecture",
  )
  const [isPublic, setIsPublic] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("member")
  const [isSaving, setIsSaving] = useState(false)

  // Mock team members data
  const members = [
    {
      id: "user-1",
      name: "John Assefa",
      email: "john@example.com",
      avatar: "/placeholder.svg",
      initials: "JA",
      role: "admin",
      joinedAt: "Jan 15, 2023",
    },
    {
      id: "user-2",
      name: "Abiy Shiferaw",
      email: "abiy@example.com",
      avatar: "/placeholder.svg",
      initials: "AS",
      role: "member",
      joinedAt: "Feb 23, 2023",
    },
    {
      id: "user-3",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      avatar: "/placeholder.svg",
      initials: "SJ",
      role: "member",
      joinedAt: "Mar 11, 2023",
    },
    {
      id: "user-4",
      name: "Michael Chen",
      email: "michael@example.com",
      avatar: "/placeholder.svg",
      initials: "MC",
      role: "member",
      joinedAt: "Apr 5, 2023",
    },
  ]

  const handleSaveGeneral = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      // In a real app, you would make an API call to update the team
    }, 1000)
  }

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would make an API call to invite the user
    setShowInviteDialog(false)
    setInviteEmail("")
    setInviteRole("member")
  }

  const handleDeleteTeam = () => {
    // In a real app, you would make an API call to delete the team
    setShowDeleteConfirm(false)
    window.location.href = "/dashboard/teams"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/teams/${params.id}`}>
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
          <TabsTrigger value="permissions" className="rounded-lg">
            Permissions
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
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-description">Description</Label>
                <Textarea
                  id="team-description"
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  className="max-w-md"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between max-w-md">
                  <div className="space-y-0.5">
                    <Label htmlFor="public-team">Public Team</Label>
                    <p className="text-sm text-muted-foreground">
                      Make this team accessible to all users in your organization
                    </p>
                  </div>
                  <Switch id="public-team" checked={isPublic} onCheckedChange={setIsPublic} />
                </div>
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
                  <AlertDialog>
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
                          This will permanently delete the "{teamName}" team and all of its data. This action cannot be
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
                      Invite Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite New Member</DialogTitle>
                      <DialogDescription>Send an invitation to join the team</DialogDescription>
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
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select value={inviteRole} onValueChange={setInviteRole}>
                            <SelectTrigger id="role">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="member">Member</SelectItem>
                              <SelectItem value="viewer">Viewer (Read Only)</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground mt-1">
                            <Info className="inline-block h-3 w-3 mr-1" />
                            Admins can manage team settings and members. Members can create and edit errors. Viewers can
                            only view errors.
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="rounded-lg">
                          Send Invitation
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>{member.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {member.role === "admin" ? "Admin" : member.role === "member" ? "Member" : "Viewer"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Joined {member.joinedAt}</span>
                        </div>
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
                        <DropdownMenuItem>
                          Change role to{" "}
                          {member.role === "admin" ? "Member" : member.role === "member" ? "Admin" : "Member"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">Remove from team</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>Invitations that have not been accepted yet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No pending invitations</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle>Team Permissions</CardTitle>
              <CardDescription>Configure access rights for team members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Role Capabilities</h3>
                <div className="rounded-lg border overflow-hidden">
                  <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 font-medium">
                    <div>Permission</div>
                    <div className="text-center">Admin</div>
                    <div className="text-center">Member</div>
                    <div className="text-center">Viewer</div>
                  </div>
                  <Separator />
                  {[
                    { name: "View errors and solutions", admin: true, member: true, viewer: true },
                    { name: "Log new errors", admin: true, member: true, viewer: false },
                    { name: "Edit errors", admin: true, member: true, viewer: false },
                    { name: "Delete errors", admin: true, member: false, viewer: false },
                    { name: "Assign errors", admin: true, member: true, viewer: false },
                    { name: "Manage team settings", admin: true, member: false, viewer: false },
                    { name: "Invite new members", admin: true, member: false, viewer: false },
                    { name: "Remove team members", admin: true, member: false, viewer: false },
                  ].map((permission, i) => (
                    <div key={i} className="grid grid-cols-4 gap-4 p-4 border-t">
                      <div>{permission.name}</div>
                      <div className="text-center">{permission.admin ? "✓" : "✗"}</div>
                      <div className="text-center">{permission.member ? "✓" : "✗"}</div>
                      <div className="text-center">{permission.viewer ? "✓" : "✗"}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Custom Permissions</h3>
                <p className="text-sm text-muted-foreground">
                  Set custom permissions for specific team members beyond their roles
                </p>
                <Button className="rounded-lg" variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Custom Permission
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="rounded-lg">
                <Save className="mr-2 h-4 w-4" />
                Save Permission Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

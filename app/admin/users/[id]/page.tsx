"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { UserActivityLog } from "@/components/admin/user-activity-log"
import { UserErrorsList } from "@/components/admin/user-errors-list"
import { UserSolutionsList } from "@/components/admin/user-solutions-list"
import { ArrowLeft, Save, Trash2, Shield, Mail } from "lucide-react"
import Link from "next/link"

export default function UserDetailsPage() {
  const { id } = useParams()
  const [userData, setUserData] = useState({
    id: id,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Premium",
    status: "Active",
    joined: "Jan 15, 2023",
    lastActive: "May 19, 2023",
    organization: "Tech Solutions Inc.",
    bio: "Senior developer with 8 years of experience in React and Node.js.",
    isActive: true,
    isEmailVerified: true,
    permissions: {
      canCreateErrors: true,
      canCreateSolutions: true,
      canModerate: false,
      canAssignErrors: true,
    },
  })

  const handleSwitchChange = (field: string) => {
    setUserData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [field]: !prev.permissions[field as keyof typeof prev.permissions],
      },
    }))
  }

  const handleStatusChange = () => {
    setUserData((prev) => ({
      ...prev,
      isActive: !prev.isActive,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>User information and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-semibold">
                  {userData.name.charAt(0)}
                </div>
                <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-1">
                  <div className={`h-4 w-4 rounded-full ${userData.isActive ? "bg-green-500" : "bg-red-500"}`}></div>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-center">
              <h3 className="text-xl font-semibold">{userData.name}</h3>
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{userData.email}</span>
              </div>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                {userData.role}
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Joined</span>
                <span className="text-sm text-muted-foreground">{userData.joined}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Last Active</span>
                <span className="text-sm text-muted-foreground">{userData.lastActive}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Organization</span>
                <span className="text-sm text-muted-foreground">{userData.organization}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2">
          <Tabs defaultValue="details">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Account Information</CardTitle>
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>Manage user account details and permissions</CardDescription>
            </CardHeader>

            <TabsContent value="details">
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={userData.role}
                      onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                    >
                      <option value="Free">Free User</option>
                      <option value="Premium">Premium User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      value={userData.organization}
                      onChange={(e) => setUserData({ ...userData, organization: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={userData.bio}
                    onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="active-status" checked={userData.isActive} onCheckedChange={handleStatusChange} />
                  <Label htmlFor="active-status">Account Active</Label>
                </div>
              </CardContent>
            </TabsContent>

            <TabsContent value="permissions">
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">User Permissions</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="create-errors" className="text-base">
                          Create Errors
                        </Label>
                        <p className="text-sm text-muted-foreground">Allow user to log new errors in the system</p>
                      </div>
                      <Switch
                        id="create-errors"
                        checked={userData.permissions.canCreateErrors}
                        onCheckedChange={() => handleSwitchChange("canCreateErrors")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="create-solutions" className="text-base">
                          Create Solutions
                        </Label>
                        <p className="text-sm text-muted-foreground">Allow user to submit solutions to errors</p>
                      </div>
                      <Switch
                        id="create-solutions"
                        checked={userData.permissions.canCreateSolutions}
                        onCheckedChange={() => handleSwitchChange("canCreateSolutions")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="moderate" className="text-base">
                          Moderate Content
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Allow user to approve/reject errors and solutions
                        </p>
                      </div>
                      <Switch
                        id="moderate"
                        checked={userData.permissions.canModerate}
                        onCheckedChange={() => handleSwitchChange("canModerate")}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="assign-errors" className="text-base">
                          Assign Errors
                        </Label>
                        <p className="text-sm text-muted-foreground">Allow user to assign errors to team members</p>
                      </div>
                      <Switch
                        id="assign-errors"
                        checked={userData.permissions.canAssignErrors}
                        onCheckedChange={() => handleSwitchChange("canAssignErrors")}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </TabsContent>

            <CardFooter>
              <Button className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Tabs>
        </Card>
      </div>

      <Tabs defaultValue="activity">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="solutions">Solutions</TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="mt-6">
          <UserActivityLog userId={id as string} />
        </TabsContent>
        <TabsContent value="errors" className="mt-6">
          <UserErrorsList userId={id as string} />
        </TabsContent>
        <TabsContent value="solutions" className="mt-6">
          <UserSolutionsList userId={id as string} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

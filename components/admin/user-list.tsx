"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, UserCheck, UserX } from "lucide-react"
import Link from "next/link"
import { getCookie } from "@/utils/cookies"
import { toast } from "@/components/ui/use-toast"
import { format, subDays, startOfYear } from "date-fns"

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  role: string
  status: string
  last_joined: string | null
  is_active: boolean
}

interface UserListProps {
  searchQuery: string
  roleFilter: string
  statusFilter: string
  joinedDateFilter: string[]
  sortBy: string
}

export function UserList({ searchQuery, roleFilter, statusFilter, joinedDateFilter, sortBy }: UserListProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const csrftoken = getCookie('csrftoken')
        if (!csrftoken) {
          throw new Error("CSRF token not found")
        }

        const response = await fetch("http://127.0.0.1:8000/user/user-list/", {
          method: "GET",
          credentials: "include",
          headers: {
            "X-CSRFToken": csrftoken,
          }
        })

        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }

        const data = await response.json()
        setUsers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        toast({
          title: "Error fetching users",
          description: error,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch {
      return dateString
    }
  }

  const isWithinDateRange = (dateString: string | null, range: string) => {
    if (!dateString) return false
    const date = new Date(dateString)
    const now = new Date()
    
    switch (range) {
      case "last-7-days":
        return date >= subDays(now, 7)
      case "last-30-days":
        return date >= subDays(now, 30)
      case "last-90-days":
        return date >= subDays(now, 90)
      case "this-year":
        return date >= startOfYear(now)
      default:
        return false
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = 
      roleFilter === "all" || 
      (roleFilter === "free" && user.role === "Free") ||
      (roleFilter === "premium" && user.role === "Premium") ||
      (roleFilter === "admin" && user.role === "Super Admin") ||
      (roleFilter === "moderator" && user.role === "Moderator")
    
    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "active" && user.is_active) ||
      (statusFilter === "inactive" && !user.is_active)
    
    const matchesJoinedDate = 
      joinedDateFilter.length === 0 ||
      joinedDateFilter.some(range => isWithinDateRange(user.last_joined, range))
    
    return matchesSearch && matchesRole && matchesStatus && matchesJoinedDate
  }).sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.last_joined || 0).getTime() - new Date(a.last_joined || 0).getTime()
      case "oldest":
        return new Date(a.last_joined || 0).getTime() - new Date(b.last_joined || 0).getTime()
      case "name-asc":
        return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
      case "name-desc":
        return `${b.first_name} ${b.last_name}`.localeCompare(`${a.first_name} ${a.last_name}`)
      default:
        return 0
    }
  })

  const updateUserRoleAndStatus = async (userId: number, accountType: string, status: string) => {
    try {
      const csrftoken = getCookie('csrftoken')
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }

      const response = await fetch(`http://127.0.0.1:8000/user/role-status/${userId}/`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "X-CSRFToken": csrftoken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: accountType, is_active: status === "true" })
      })

      if (!response.ok) {
        throw new Error("Failed to update user role and status")
      }

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: accountType, status } : user
      ))

      toast({
        title: "User updated",
        description: `User role changed to ${accountType} and status to ${status}`,
      })
    } catch (err) {
      toast({
        title: "Error updating user",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  const toggleUserActivation = async (userId: number, isActive: boolean) => {
    try {
      const csrftoken = getCookie('csrftoken')
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }

      const response = await fetch(`http://127.0.0.1:8000/user/toggle-activation/${userId}/`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "X-CSRFToken": csrftoken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: isActive })
      })

      if (!response.ok) {
        throw new Error("Failed to toggle user activation")
      }

      setUsers(users.map(user => 
        user.id === userId ? { 
          ...user, 
          is_active: isActive,
          status: isActive ? "Active" : "Inactive"
        } : user
      ))
      
      toast({
        title: "User activation updated",
        description: `User is now ${isActive ? 'active' : 'inactive'}`,
      })
    } catch (err) {
      toast({
        title: "Error updating activation",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="rounded-md border p-4">
        <div className="flex justify-center items-center h-24">
          <p>Loading users...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md border p-4">
        <div className="flex justify-center items-center h-24 text-destructive">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Joined</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Last Active</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{user.first_name.charAt(0)}{user.last_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Link href={`/admin/users/${user.id}`} className="font-medium hover:underline">
                          {user.first_name} {user.last_name}
                        </Link>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge
                      variant={user.role === "Admin" ? "default" : user.role === "Premium" ? "outline" : "secondary"}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge variant={user.status === "Active" ? "success" : "destructive"}>{user.status}</Badge>
                  </td>
                  <td className="p-4 align-middle">{formatDate(user.last_joined)}</td>
                  <td className="p-4 align-middle">{formatDate(user.last_joined)}</td>
                  <td className="p-4 align-middle">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/users/${user.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => toggleUserActivation(
                            user.id, 
                            !user.is_active
                          )}
                        >
                          {user.is_active ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenu>
                          <DropdownMenuTrigger className="w-full">
                            <div className="flex items-center px-2 py-1.5 text-sm">
                              <span className="mr-2">Change Role</span>
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => updateUserRoleAndStatus(user.id, "Free", user.status)}>
                              Free User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateUserRoleAndStatus(user.id, "Premium", user.status)}>
                              Premium User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateUserRoleAndStatus(user.id, "Moderator", user.status)}>
                              Moderator
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateUserRoleAndStatus(user.id, "Super Admin", user.status)}>
                              Super Admin
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="h-24 text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
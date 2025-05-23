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
import { format } from "date-fns"

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  role: string
  status: string
  last_joined: string | null
}

interface UserListProps {
  searchQuery: string
}

export function UserList({ searchQuery }: UserListProps) {
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

  const filteredUsers = users.filter(
    (user) =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleStatusChange = async (userId: number, newStatus: string) => {
    try {
      const csrftoken = getCookie('csrftoken')
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }

      // Implement your API call to change user status here
      // await fetch(`http://127.0.0.1:8000/user/update-status/${userId}/`, {
      //   method: "POST",
      //   credentials: "include",
      //   headers: {
      //     "X-CSRFToken": csrftoken,
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ status: newStatus })
      // })

      // For now, just update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ))

      toast({
        title: "User status updated",
        description: `User status changed to ${newStatus}`,
      })
    } catch (err) {
      toast({
        title: "Error updating status",
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
                      variant={user.role === "Super Admin" ? "default" : user.role === "Premium" ? "outline" : "secondary"}
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
                          onClick={() => handleStatusChange(
                            user.id, 
                            user.status === "Active" ? "Inactive" : "Active"
                          )}
                        >
                          {user.status === "Active" ? (
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
                        <DropdownMenuItem 
                          className="text-destructive"
                          // onClick={() => handleDelete(user.id)}
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
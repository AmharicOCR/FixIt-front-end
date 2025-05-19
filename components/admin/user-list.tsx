"use client"

import { useState } from "react"
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

interface UserListProps {
  searchQuery: string
}

export function UserList({ searchQuery }: UserListProps) {
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Free",
      status: "Active",
      joined: "Jan 15, 2023",
      lastActive: "May 19, 2023",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Premium",
      status: "Active",
      joined: "Feb 3, 2023",
      lastActive: "May 20, 2023",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      role: "Free",
      status: "Inactive",
      joined: "Mar 12, 2023",
      lastActive: "Apr 5, 2023",
    },
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      role: "Premium",
      status: "Active",
      joined: "Dec 8, 2022",
      lastActive: "May 18, 2023",
    },
    {
      id: "5",
      name: "David Brown",
      email: "david.brown@example.com",
      role: "Admin",
      status: "Active",
      joined: "Nov 20, 2022",
      lastActive: "May 20, 2023",
    },
  ])

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Link href={`/admin/users/${user.id}`} className="font-medium hover:underline">
                          {user.name}
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
                  <td className="p-4 align-middle">{user.joined}</td>
                  <td className="p-4 align-middle">{user.lastActive}</td>
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
                        <DropdownMenuItem>
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
                        <DropdownMenuItem className="text-destructive">
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

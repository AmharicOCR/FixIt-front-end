"use client"

import { useState } from "react"
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
import { MoreHorizontal, Trash2, Check, X, Eye } from "lucide-react"
import Link from "next/link"

interface ErrorListProps {
  searchQuery: string
}

export function ErrorList({ searchQuery }: ErrorListProps) {
  const [errors, setErrors] = useState([
    {
      id: "1",
      title: "TypeError: Cannot read property 'map' of undefined in React component",
      status: "pending",
      category: "React",
      language: "JavaScript",
      submittedBy: "John Doe",
      submittedAt: "May 15, 2023",
      views: 245,
      solutions: 8,
    },
    {
      id: "2",
      title: "SyntaxError: Unexpected token in JSON at position 0",
      status: "approved",
      category: "JavaScript",
      language: "JavaScript",
      submittedBy: "Jane Smith",
      submittedAt: "May 16, 2023",
      views: 187,
      solutions: 5,
    },
    {
      id: "3",
      title: "ImportError: No module named 'tensorflow'",
      status: "rejected",
      category: "Python",
      language: "Python",
      submittedBy: "Mike Johnson",
      submittedAt: "May 17, 2023",
      views: 132,
      solutions: 3,
    },
    {
      id: "4",
      title: "NullPointerException in Java Spring Controller",
      status: "approved",
      category: "Spring",
      language: "Java",
      submittedBy: "Sarah Williams",
      submittedAt: "May 18, 2023",
      views: 98,
      solutions: 2,
    },
    {
      id: "5",
      title: "Cannot resolve module 'react-router-dom'",
      status: "pending",
      category: "React",
      language: "JavaScript",
      submittedBy: "David Brown",
      submittedAt: "May 19, 2023",
      views: 76,
      solutions: 1,
    },
  ])

  const filteredErrors = errors.filter((error) => error.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Error</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Language</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Submitted</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Stats</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {filteredErrors.length > 0 ? (
              filteredErrors.map((error) => (
                <tr
                  key={error.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <Link href={`/admin/errors/${error.id}`} className="font-medium hover:underline">
                      {error.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">By {error.submittedBy}</p>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge
                      variant={
                        error.status === "approved"
                          ? "success"
                          : error.status === "rejected"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {error.status.charAt(0).toUpperCase() + error.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">{error.category}</td>
                  <td className="p-4 align-middle">{error.language}</td>
                  <td className="p-4 align-middle">{error.submittedAt}</td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center text-xs">
                        <Eye className="mr-1 h-3 w-3" />
                        {error.views}
                      </span>
                      <span className="flex items-center text-xs">
                        <Check className="mr-1 h-3 w-3" />
                        {error.solutions}
                      </span>
                    </div>
                  </td>
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
                          <Link href={`/admin/errors/${error.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        {error.status === "pending" && (
                          <>
                            <DropdownMenuItem>
                              <Check className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <X className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
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
                <td colSpan={7} className="h-24 text-center">
                  No errors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

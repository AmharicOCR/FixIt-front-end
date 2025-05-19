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
import { MoreHorizontal, Trash2, Check, X, Eye, ThumbsUp, MessageSquare } from "lucide-react"
import Link from "next/link"

interface SolutionListProps {
  searchQuery: string
}

export function SolutionList({ searchQuery }: SolutionListProps) {
  const [solutions, setSolutions] = useState([
    {
      id: "1",
      title: "Fix for TypeError: Cannot read property 'map' of undefined",
      status: "pending",
      errorId: "1",
      errorTitle: "TypeError: Cannot read property 'map' of undefined in React component",
      submittedBy: "Jane Smith",
      submittedAt: "May 17, 2023",
      votes: 32,
      comments: 5,
    },
    {
      id: "2",
      title: "Solution for SyntaxError in JSON parsing",
      status: "approved",
      errorId: "2",
      errorTitle: "SyntaxError: Unexpected token in JSON at position 0",
      submittedBy: "Mike Johnson",
      submittedAt: "May 18, 2023",
      votes: 24,
      comments: 3,
    },
    {
      id: "3",
      title: "Installing TensorFlow properly",
      status: "rejected",
      errorId: "3",
      errorTitle: "ImportError: No module named 'tensorflow'",
      submittedBy: "Sarah Williams",
      submittedAt: "May 19, 2023",
      votes: 12,
      comments: 2,
    },
    {
      id: "4",
      title: "Fixing NullPointerException in Spring Controller",
      status: "approved",
      errorId: "4",
      errorTitle: "NullPointerException in Java Spring Controller",
      submittedBy: "David Brown",
      submittedAt: "May 20, 2023",
      votes: 18,
      comments: 4,
    },
    {
      id: "5",
      title: "Resolving React Router DOM dependency issue",
      status: "pending",
      errorId: "5",
      errorTitle: "Cannot resolve module 'react-router-dom'",
      submittedBy: "John Doe",
      submittedAt: "May 21, 2023",
      votes: 8,
      comments: 1,
    },
  ])

  const filteredSolutions = solutions.filter((solution) =>
    solution.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Solution</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">For Error</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Submitted</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Stats</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {filteredSolutions.length > 0 ? (
              filteredSolutions.map((solution) => (
                <tr
                  key={solution.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <Link href={`/admin/solutions/${solution.id}`} className="font-medium hover:underline">
                      {solution.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">By {solution.submittedBy}</p>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge
                      variant={
                        solution.status === "approved"
                          ? "success"
                          : solution.status === "rejected"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {solution.status.charAt(0).toUpperCase() + solution.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle">
                    <Link href={`/admin/errors/${solution.errorId}`} className="text-sm hover:underline">
                      {solution.errorTitle.length > 30
                        ? solution.errorTitle.substring(0, 30) + "..."
                        : solution.errorTitle}
                    </Link>
                  </td>
                  <td className="p-4 align-middle">{solution.submittedAt}</td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center text-xs">
                        <ThumbsUp className="mr-1 h-3 w-3" />
                        {solution.votes}
                      </span>
                      <span className="flex items-center text-xs">
                        <MessageSquare className="mr-1 h-3 w-3" />
                        {solution.comments}
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
                          <Link href={`/admin/solutions/${solution.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        {solution.status === "pending" && (
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
                <td colSpan={6} className="h-24 text-center">
                  No solutions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

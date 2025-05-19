"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Filter, MoreHorizontal, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SolutionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Mock solutions data
  const solutions = [
    {
      id: "sol-001",
      title: "Fixing TypeError in React useEffect Hook",
      description:
        "A comprehensive solution to the common issue of accessing undefined properties in React useEffect's dependency array.",
      category: "React",
      upvotes: 42,
      author: {
        name: "John Assefa",
        avatar: "/placeholder.svg",
        initials: "JA",
      },
      createdAt: "2 weeks ago",
      isAccepted: true,
      errorTitle: "TypeError in React useEffect Hook",
    },
    {
      id: "sol-002",
      title: "Optimizing Database Connection Pools",
      description:
        "How to properly configure and manage database connection pools to prevent 'connection exhausted' errors during peak traffic.",
      category: "Database",
      upvotes: 38,
      author: {
        name: "Netsanet Alemu",
        avatar: "/placeholder.svg",
        initials: "NA",
      },
      createdAt: "3 weeks ago",
      isAccepted: true,
      errorTitle: "Database Connection Pool Exhausted",
    },
    {
      id: "sol-003",
      title: "Responsive CSS Grid Layout for Mobile",
      description:
        "Fixing horizontal overflow issues with CSS Grid layouts on mobile devices using modern CSS techniques.",
      category: "CSS",
      upvotes: 31,
      author: {
        name: "Abiy Shiferaw",
        avatar: "/placeholder.svg",
        initials: "AS",
      },
      createdAt: "1 month ago",
      isAccepted: true,
      errorTitle: "CSS Grid Layout Overflow on Mobile",
    },
    {
      id: "sol-004",
      title: "Secure JWT Authentication Implementation",
      description:
        "A complete guide to implementing secure JWT authentication and fixing common token validation issues.",
      category: "Authentication",
      upvotes: 27,
      author: {
        name: "John Assefa",
        avatar: "/placeholder.svg",
        initials: "JA",
      },
      createdAt: "1 month ago",
      isAccepted: false,
      errorTitle: "JWT Authentication Failure",
    },
    {
      id: "sol-005",
      title: "Eliminating Memory Leaks in Service Workers",
      description:
        "How to identify, debug and fix memory leaks in Service Workers that cause issues after multiple page refreshes.",
      category: "Performance",
      upvotes: 19,
      author: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg",
        initials: "SJ",
      },
      createdAt: "2 months ago",
      isAccepted: false,
      errorTitle: "Memory Leak in Service Worker",
    },
  ]

  // Filter solutions based on search and category
  const filteredSolutions = solutions.filter((solution) => {
    const matchesSearch =
      solution.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solution.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solution.errorTitle.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || solution.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  // Sort solutions based on sortBy
  const sortedSolutions = [...filteredSolutions].sort((a, b) => {
    if (sortBy === "newest") {
      // This is mock data so we're using the existing order
      return 0
    } else if (sortBy === "oldest") {
      // Reverse the existing order
      return 1
    } else if (sortBy === "most-upvotes") {
      return b.upvotes - a.upvotes
    } else if (sortBy === "least-upvotes") {
      return a.upvotes - b.upvotes
    }
    return 0
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this might trigger an API call
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Solutions</h1>
          <p className="text-muted-foreground">Discover and learn from solutions submitted by the community</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search solutions by title, description, or error..."
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" className="rounded-lg">
              Search
            </Button>
            <Button variant="outline" className="rounded-lg">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </form>

        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="React">React</SelectItem>
              <SelectItem value="Database">Database</SelectItem>
              <SelectItem value="CSS">CSS</SelectItem>
              <SelectItem value="Authentication">Authentication</SelectItem>
              <SelectItem value="Performance">Performance</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="most-upvotes">Most Upvotes</SelectItem>
              <SelectItem value="least-upvotes">Least Upvotes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          {filteredSolutions.length} solution{filteredSolutions.length !== 1 ? "s" : ""} found
        </div>

        {sortedSolutions.length > 0 ? (
          sortedSolutions.map((solution) => (
            <Card key={solution.id} className="border-border/40 shadow-sm">
              <CardHeader className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{solution.title}</CardTitle>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                      Solution for: {solution.errorTitle}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="rounded-full">
                      {solution.category}
                    </Badge>
                    <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="m18 15-6-6-6 6" />
                      </svg>
                      <span>{solution.upvotes}</span>
                    </div>
                    {solution.isAccepted && <Badge className="bg-green-500 text-white">Accepted</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-sm">{solution.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={solution.author.avatar || "/placeholder.svg"} alt={solution.author.name} />
                    <AvatarFallback>{solution.author.initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    By {solution.author.name} • {solution.createdAt}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="rounded-lg" asChild>
                    <Link href="#">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Copy link</DropdownMenuItem>
                      <DropdownMenuItem>Save solution</DropdownMenuItem>
                      <DropdownMenuItem>Report</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card className="border-border/40 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No solutions found</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                We couldn't find any solutions matching your search criteria. Try adjusting your filters or search
                terms.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setCategoryFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {sortedSolutions.length > 0 && (
          <div className="flex justify-between">{/* Additional content or actions can be placed here */}</div>
        )}
      </div>
    </div>
  )
}

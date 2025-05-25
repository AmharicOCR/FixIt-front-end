"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Bug, Filter, MoreHorizontal, SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useAuth } from "@/hooks/useAuth";
export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const { authenticated, username, accountType, loading } = useAuth();
  // Mock search results - in a real app, this would be fetched based on search and filters
  const searchResults = [
    {
      id: "err-001",
      title: "TypeError in React useEffect Hook",
      description: "Cannot read property 'data' of undefined in useEffect dependency array",
      category: "React",
      priority: "High",
      status: "Open",
      reportedBy: {
        name: "John Assefa",
        avatar: "/placeholder.svg",
        initials: "JA",
      },
      reportedAt: "2 hours ago",
      programmingLanguage: "JavaScript",
      tags: ["react", "useEffect", "api"],
    },
    {
      id: "err-002",
      title: "Database Connection Pool Exhausted",
      description: "PostgreSQL connection pool is being exhausted during peak traffic",
      category: "Database",
      priority: "Critical",
      status: "In Progress",
      reportedBy: {
        name: "Netsanet Alemu",
        avatar: "/placeholder.svg",
        initials: "NA",
      },
      reportedAt: "5 hours ago",
      programmingLanguage: "Python",
      tags: ["postgresql", "database", "connection-pool"],
    },
    {
      id: "err-003",
      title: "CSS Grid Layout Overflow on Mobile",
      description: "Grid layout causes horizontal overflow on mobile devices",
      category: "CSS",
      priority: "Medium",
      status: "Open",
      reportedBy: {
        name: "Abiy Shiferaw",
        avatar: "/placeholder.svg",
        initials: "AS",
      },
      reportedAt: "Yesterday",
      programmingLanguage: "CSS",
      tags: ["css", "responsive", "mobile"],
    },
    {
      id: "err-004",
      title: "JWT Authentication Failure",
      description: "Token validation fails intermittently in production environment",
      category: "Authentication",
      priority: "High",
      status: "Resolved",
      reportedBy: {
        name: "John Assefa",
        avatar: "/placeholder.svg",
        initials: "JA",
      },
      reportedAt: "2 days ago",
      programmingLanguage: "JavaScript",
      tags: ["jwt", "authentication", "security"],
    },
    {
      id: "err-005",
      title: "Memory Leak in Service Worker",
      description: "Service worker is causing memory leaks after multiple refreshes",
      category: "Performance",
      priority: "Medium",
      status: "In Progress",
      reportedBy: {
        name: "Abiy Shiferaw",
        avatar: "/placeholder.svg",
        initials: "AS",
      },
      reportedAt: "3 days ago",
      programmingLanguage: "JavaScript",
      tags: ["service-worker", "memory-leak", "performance"],
    },
    {
      id: "err-006",
      title: "API Rate Limiting Issue",
      description: "Third-party API rate limiting causing intermittent failures",
      category: "API",
      priority: "High",
      status: "Open",
      reportedBy: {
        name: "Netsanet Alemu",
        avatar: "/placeholder.svg",
        initials: "NA",
      },
      reportedAt: "4 days ago",
      programmingLanguage: "Python",
      tags: ["api", "rate-limiting", "third-party"],
    },
    {
      id: "err-007",
      title: "Redux State Management Bug",
      description: "State not updating correctly after async action completion",
      category: "React",
      priority: "Medium",
      status: "Resolved",
      reportedBy: {
        name: "Abiy Shiferaw",
        avatar: "/placeholder.svg",
        initials: "AS",
      },
      reportedAt: "1 week ago",
      programmingLanguage: "JavaScript",
      tags: ["redux", "react", "state-management"],
    },
  ]

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      setSelectedStatuses([...selectedStatuses, status])
    } else {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status))
    }
  }

  const handlePriorityChange = (priority: string, checked: boolean) => {
    if (checked) {
      setSelectedPriorities([...selectedPriorities, priority])
    } else {
      setSelectedPriorities(selectedPriorities.filter((p) => p !== priority))
    }
  }

  const handleLanguageChange = (language: string, checked: boolean) => {
    if (checked) {
      setSelectedLanguages([...selectedLanguages, language])
    } else {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== language))
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would trigger a search API call
    console.log("Searching for:", searchQuery)
    console.log("Filters:", {
      categories: selectedCategories,
      statuses: selectedStatuses,
      priorities: selectedPriorities,
      languages: selectedLanguages,
      sortBy,
    })
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedStatuses([])
    setSelectedPriorities([])
    setSelectedLanguages([])
    setSortBy("newest")
  }

  // Filter results based on selected filters
  const filteredResults = searchResults.filter((result) => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(result.category)
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(result.status)
    const matchesPriority = selectedPriorities.length === 0 || selectedPriorities.includes(result.priority)
    const matchesLanguage = selectedLanguages.length === 0 || selectedLanguages.includes(result.programmingLanguage)

    return matchesCategory && matchesStatus && matchesPriority && matchesLanguage
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search Errors</h1>
          <p className="text-muted-foreground">Find and filter errors across the repository</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className={`md:block ${showFilters ? "block" : "hidden"}`}>
          <Card className="border-border/40 shadow-sm sticky top-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Filters</CardTitle>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="multiple" defaultValue={["category", "status", "priority"]} className="space-y-2">
                <AccordionItem value="category" className="border-b-0">
                  <AccordionTrigger className="py-2 text-sm font-medium">Categories</AccordionTrigger>
                  <AccordionContent className="space-y-2 pt-1 pb-3">
                    {["React", "Database", "CSS", "Authentication", "Performance", "API"].map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                        />
                        <Label htmlFor={`category-${category}`} className="text-sm font-normal">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="status" className="border-b-0">
                  <AccordionTrigger className="py-2 text-sm font-medium">Status</AccordionTrigger>
                  <AccordionContent className="space-y-2 pt-1 pb-3">
                    {["Open", "In Progress", "Resolved"].map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={`status-${status}`}
                          checked={selectedStatuses.includes(status)}
                          onCheckedChange={(checked) => handleStatusChange(status, checked as boolean)}
                        />
                        <Label htmlFor={`status-${status}`} className="text-sm font-normal">
                          {status}
                        </Label>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="priority" className="border-b-0">
                  <AccordionTrigger className="py-2 text-sm font-medium">Priority</AccordionTrigger>
                  <AccordionContent className="space-y-2 pt-1 pb-3">
                    {["Critical", "High", "Medium", "Low"].map((priority) => (
                      <div key={priority} className="flex items-center space-x-2">
                        <Checkbox
                          id={`priority-${priority}`}
                          checked={selectedPriorities.includes(priority)}
                          onCheckedChange={(checked) => handlePriorityChange(priority, checked as boolean)}
                        />
                        <Label htmlFor={`priority-${priority}`} className="text-sm font-normal">
                          {priority}
                        </Label>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="language" className="border-b-0">
                  <AccordionTrigger className="py-2 text-sm font-medium">Programming Language</AccordionTrigger>
                  <AccordionContent className="space-y-2 pt-1 pb-3">
                    {["JavaScript", "Python", "CSS", "Java", "C#", "PHP"].map((language) => (
                      <div key={language} className="flex items-center space-x-2">
                        <Checkbox
                          id={`language-${language}`}
                          checked={selectedLanguages.includes(language)}
                          onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                        />
                        <Label htmlFor={`language-${language}`} className="text-sm font-normal">
                          {language}
                        </Label>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Search Results */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex flex-col gap-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search errors by title, description, or tags..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="rounded-lg">
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-lg md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                <span className="sr-only">Toggle Filters</span>
              </Button>
            </form>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {selectedCategories.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Categories:</span>
                    {selectedCategories.map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs rounded-full">
                        {category}
                      </Badge>
                    ))}
                  </div>
                )}

                {selectedStatuses.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Status:</span>
                    {selectedStatuses.map((status) => (
                      <Badge key={status} variant="secondary" className="text-xs rounded-full">
                        {status}
                      </Badge>
                    ))}
                  </div>
                )}

                {selectedPriorities.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Priority:</span>
                    {selectedPriorities.map((priority) => (
                      <Badge key={priority} variant="secondary" className="text-xs rounded-full">
                        {priority}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px] h-8 text-xs">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="priority">Priority (High to Low)</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">Showing {filteredResults.length} results</div>

            <Card className="border-border/40 shadow-sm">
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredResults.length > 0 ? (
                    filteredResults.map((result) => (
                      <div
                        key={result.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-muted/50"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full 
                              ${
                                result.priority === "Critical"
                                  ? "bg-red-500/20 text-red-500"
                                  : result.priority === "High"
                                    ? "bg-amber-500/20 text-amber-500"
                                    : "bg-blue-500/20 text-blue-500"
                              }`}
                            >
                              <Bug className="h-5 w-5" />
                            </div>
                            <div>
                              <Link
                                href={`/dashboard/error-details/${result.id}`}
                                className="font-medium text-sm hover:underline"
                              >
                                {result.title}
                              </Link>
                              <p className="text-xs text-muted-foreground line-clamp-1">{result.description}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0 ml-0 sm:ml-4">
                            <Badge variant="secondary" className="text-xs rounded-full">
                              {result.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs rounded-full ${
                                result.status === "Open"
                                  ? "border-amber-500 text-amber-500"
                                  : result.status === "In Progress"
                                    ? "border-blue-500 text-blue-500"
                                    : "border-green-500 text-green-500"
                              }`}
                            >
                              {result.status}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs rounded-full ${
                                result.priority === "Critical"
                                  ? "border-red-500 text-red-500"
                                  : result.priority === "High"
                                    ? "border-amber-500 text-amber-500"
                                    : "border-blue-500 text-blue-500"
                              }`}
                            >
                              {result.priority}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-14 sm:ml-0 mt-2 sm:mt-0">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage
                                src={result.reportedBy.avatar || "/placeholder.svg"}
                                alt={result.reportedBy.name}
                              />
                              <AvatarFallback>{result.reportedBy.initials}</AvatarFallback>
                            </Avatar>
                            <span className="sr-only sm:not-sr-only">{result.reportedAt}</span>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/error-details/${result.id}`}>View details</Link>
                              </DropdownMenuItem>
                              {!loading && authenticated && accountType === "premium" && activeTab === "created" && (
                            <DropdownMenuItem>
                              Assign to someone
                            </DropdownMenuItem>
                          )}
                              <DropdownMenuItem>Mark as resolved</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <SearchIcon className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No results found</h3>
                      <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                        We couldn't find any errors matching your search criteria. Try adjusting your filters or search
                        terms.
                      </p>
                      <Button variant="outline" onClick={clearFilters}>
                        Clear All Filters
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
              {filteredResults.length > 0 && (
                <CardFooter className="border-t px-6 py-4 flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {filteredResults.length} of {searchResults.length} errors
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

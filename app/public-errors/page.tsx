"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bug, Filter, MoreHorizontal, SearchIcon, ThumbsUp, ArrowLeft, Menu, X, Moon, Sun } from "lucide-react"
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
import { useTheme } from "next-themes"

interface ErrorItem {
  id: string
  title: string
  description: string
  category: string
  priority: string
  status: string
  reportedBy: {
    name: string
    avatar: string
    initials: string
  }
  reportedAt: string
  programmingLanguage: string
  tags: string[]
  upvotes: number
}

export default function PublicErrorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<ErrorItem[]>([])

  useEffect(() => {
    const fetchPublicErrors = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/bugtracker/public-errors/')
        if (!response.ok) {
          throw new Error('Failed to fetch public errors')
        }
        const data = await response.json()
        setSearchResults(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchPublicErrors()
  }, [])

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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Extract unique values for filter options from the API data
  const allCategories = Array.from(new Set(searchResults.map(result => result.category)))
  const allStatuses = Array.from(new Set(searchResults.map(result => result.status)))
  const allPriorities = Array.from(new Set(searchResults.map(result => result.priority)))
  const allLanguages = Array.from(new Set(searchResults.map(result => result.programmingLanguage)))

  // Filter results based on selected filters
  const filteredResults = searchResults.filter((result) => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(result.category)
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(result.status)
    const matchesPriority = selectedPriorities.length === 0 || selectedPriorities.includes(result.priority)
    const matchesLanguage = selectedLanguages.length === 0 || selectedLanguages.includes(result.programmingLanguage)
    const matchesSearch = searchQuery === "" || 
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      result.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
      result.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesStatus && matchesPriority && matchesLanguage && matchesSearch
  })

  // Sort results based on selected sort option
  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
    } else if (sortBy === "oldest") {
      return new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime()
    } else if (sortBy === "priority") {
      const priorityOrder = ["Critical", "High", "Medium", "Low"]
      return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
    } else if (sortBy === "upvotes") {
      return b.upvotes - a.upvotes
    }
    return 0
  })

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] flex-col">
        <header className="sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 bg-background/80 shadow-sm">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
                <Bug className="size-5" />
              </div>
              <span>FixIt</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 container py-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Loading public errors...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[100dvh] flex-col">
        <header className="sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 bg-background/80 shadow-sm">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
                <Bug className="size-5" />
              </div>
              <span>FixIt</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
                {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 container py-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500">Error loading public errors: {error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 bg-background/80 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
              <Bug className="size-5" />
            </div>
            <span>FixIt</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <Link
              href="/#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="/#howitworks"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <Link
              href="/#faq"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              FAQ
            </Link>
          </nav>
          <div className="hidden md:flex gap-4 items-center">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Log in
            </Link>
            <Button className="rounded-full" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
          <div className="flex items-center gap-4 md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 inset-x-0 bg-background/95 backdrop-blur-lg border-b">
            <div className="container py-4 flex flex-col gap-4">
              <Link href="/#features" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Features
              </Link>
              <Link href="/#howitworks" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </Link>
              <Link href="/#pricing" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </Link>
              <Link href="/#faq" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                FAQ
              </Link>
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Link href="/login" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Log in
                </Link>
                <Button className="rounded-full" asChild>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 container py-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Public Error Repository</h1>
              <p className="text-muted-foreground">Browse and search public coding errors from the community</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className={`md:block ${showFilters ? "block" : "hidden"}`}>
              <Card className="border-border/40 shadow-sm sticky top-24">
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
                        {allCategories.map((category) => (
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
                        {allStatuses.map((status) => (
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
                        {allPriorities.map((priority) => (
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
                        {allLanguages.map((language) => (
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
                        <SelectItem value="upvotes">Most Upvotes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">Showing {sortedResults.length} results</div>

                <Card className="border-border/40 shadow-sm">
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {sortedResults.length > 0 ? (
                        sortedResults.map((result) => (
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
                                    href={`/public-errors/${result.id}`}
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
                              <Button variant="ghost" size="sm" className="h-8 gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{result.upvotes}</span>
                              </Button>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Avatar className="h-6 w-6 mr-2">
                                  {/* <AvatarImage
                                    src={result.reportedBy.avatar || "/placeholder.svg"}
                                    alt={result.reportedBy.name}
                                  /> */}
                                  {/* <AvatarFallback>{result.reportedBy.initials}</AvatarFallback> */}
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
                                    <Link href={`/public-errors/${result.id}`}>View details</Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href="/login">Sign in to save</Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href="/signup">Sign up to contribute</Link>
                                  </DropdownMenuItem>
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
                            We couldn't find any errors matching your search criteria. Try adjusting your filters or
                            search terms.
                          </p>
                          <Button variant="outline" onClick={clearFilters}>
                            Clear All Filters
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  {sortedResults.length > 0 && (
                    <CardFooter className="border-t px-6 py-4 flex justify-between">
                      <div className="text-sm text-muted-foreground">
                        Showing {sortedResults.length} of {searchResults.length} errors
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
      </main>

      <footer className="w-full border-t bg-background/95 backdrop-blur-sm">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-bold">
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
              <Bug className="size-5" />
            </div>
            <span>FixIt</span>
          </div>
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} FixIt. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
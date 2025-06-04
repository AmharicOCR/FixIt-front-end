"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Bug, Upload, X, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { getCookie } from "@/utils/cookies"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"
import { PopoverClose } from "@radix-ui/react-popover"

interface Category {
  id: number
  name: string
  description: string
  status: string
}

interface Tag {
  id: number
  name: string
  status: string
}

interface Language {
  id: number
  name: string
}

interface Framework {
  id: number
  name: string
  language: number
}

interface TeamMember {
  id: number
  name: string
  email: string
}

interface CustomToastProps {
  title: string
  description: string
  variant: "success" | "error" | "warning"
  onClose?: () => void
}

const CustomToast = ({ title, description, variant, onClose }: CustomToastProps) => {
  const iconMap = {
    success: <Check className="h-5 w-5 text-green-500" />,
    error: <X className="h-5 w-5 text-red-500" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
  }

  const bgColorMap = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    warning: "bg-yellow-50 border-yellow-200",
  }

  return (
    <div className={cn(
      "border rounded-lg p-4 shadow-lg w-full max-w-md relative",
      bgColorMap[variant]
    )}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {iconMap[variant]}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default function NewErrorPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [frameworks, setFrameworks] = useState<Framework[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [showTagDialog, setShowTagDialog] = useState(false)
  const [showLanguageDialog, setShowLanguageDialog] = useState(false)
  const [showFrameworkDialog, setShowFrameworkDialog] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryDescription, setNewCategoryDescription] = useState("")
  const [newTagName, setNewTagName] = useState("")
  const [newLanguageName, setNewLanguageName] = useState("")
  const [newFrameworkName, setNewFrameworkName] = useState("")
  const [selectedLanguageForFramework, setSelectedLanguageForFramework] = useState("")
  const [tagInputValue, setTagInputValue] = useState("")
  const [tagSuggestionsOpen, setTagSuggestionsOpen] = useState(false)
  const [deadline, setDeadline] = useState<Date | undefined>(undefined)
  const [deadlineOpen, setDeadlineOpen] = useState(false)
  const { toast } = useToast()
  const tagInputRef = useRef<HTMLInputElement>(null)

  const [errorDetails, setErrorDetails] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    language: "",
    framework: "",
    error_message: "",
    stack_trace: "",
    steps_to_reproduce: "",
    expected_behaviour: "",
    actual_behaviour: "",
    environment: "",
    assigned_to: "",
    visible_to_public: false,
    tags: [] as number[],
  })

  const showCustomToast = (title: string, description: string, variant: "success" | "error" | "warning") => {
    toast({
      title,
      description,
      // Optionally, you can add a variant property if your toast system supports it
      // variant,
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!csrfToken) {
          throw new Error("CSRF token not found")
        }
        
        const [categoriesRes, tagsRes, languagesRes, frameworksRes, teamRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/bugtracker/categories/', {
            method: 'GET',
            credentials: "include",
            headers: {
              "X-CSRFToken": csrfToken,
            }
          }),
          fetch('http://127.0.0.1:8000/bugtracker/tags/', {
            method: 'GET',
            credentials: "include",
            headers: {
              "X-CSRFToken": csrfToken,
            }
          }),
          fetch('http://127.0.0.1:8000/bugtracker/languages/', {
            method: 'GET',
            credentials: "include",
            headers: {
              "X-CSRFToken": csrfToken,
            }
          }),
          fetch('http://127.0.0.1:8000/bugtracker/frameworks/', {
            method: 'GET',
            credentials: "include",
            headers: {
              "X-CSRFToken": csrfToken,
            }
          }),
          fetch('http://127.0.0.1:8000/bugtracker/teams/', {
            method: "GET",
          credentials: 'include',
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
          })
        ])

        if (!categoriesRes.ok || !tagsRes.ok || !languagesRes.ok || !frameworksRes.ok || !teamRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const categoriesData = await categoriesRes.json()
        const tagsData = await tagsRes.json()
        const languagesData = await languagesRes.json()
        const frameworksData = await frameworksRes.json()
        const teamData = await teamRes.json()

        setCategories(categoriesData)
        setTags(tagsData)
        setLanguages(languagesData)
        setFrameworks(frameworksData)
        setTeamMembers(teamData)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        showCustomToast(
          "Error",
          "Failed to load required data. Please try again later.",
          "error"
        )
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const csrfToken = getCookie("csrftoken")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setErrorDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === "category" && value === "other") {
      setShowCategoryDialog(true)
      return
    }
    
    if (name === "language" && value === "other") {
      setShowLanguageDialog(true)
      return
    }
    
    if (name === "framework" && value === "other") {
      setShowFrameworkDialog(true)
      return
    }
    
    setErrorDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setErrorDetails((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!csrfToken) {
        throw new Error("CSRF token not found")
      }

      const payload = {
        title: errorDetails.title,
        description: errorDetails.description,
        category: parseInt(errorDetails.category),
        priority: errorDetails.priority,
        language: errorDetails.language ? parseInt(errorDetails.language) : null,
        framework: errorDetails.framework ? parseInt(errorDetails.framework) : null,
        environment: errorDetails.environment,
        error_message: errorDetails.error_message,
        stack_trace: errorDetails.stack_trace,
        steps_to_reproduce: errorDetails.steps_to_reproduce,
        expected_behaviour: errorDetails.expected_behaviour,
        actual_behaviour: errorDetails.actual_behaviour,
        visible_to_public: errorDetails.visible_to_public,
        tags: errorDetails.tags,
        assigned_to: errorDetails.assigned_to ? parseInt(errorDetails.assigned_to) : null,
        deadline: deadline ? deadline.toISOString() : null
      }

      const response = await fetch('http://127.0.0.1:8000/bugtracker/errors/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error submitting form:', errorData)
        throw new Error(errorData.message || 'Failed to submit error report')
      }

      const data = await response.json()
      showCustomToast(
        "Success",
        "Error report submitted successfully!",
        "success"
      )
      // Redirect to dashboard or error details page
      window.location.href = `/dashboard/error-details/${data.id}`
    } catch (error) {
      console.error('Error submitting form:', error)
      showCustomToast(
        "Error",
        error instanceof Error ? error.message : "Failed to submit error report",
        "error"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateCategory = async () => {
    try {
      if (!csrfToken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch('http://127.0.0.1:8000/bugtracker/categories/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          name: newCategoryName,
          description: newCategoryDescription
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create category')
      }

      const newCategory = await response.json()
      setCategories([...categories, newCategory])
      setErrorDetails(prev => ({ ...prev, category: newCategory.id.toString() }))
      setShowCategoryDialog(false)
      setNewCategoryName("")
      setNewCategoryDescription("")
      showCustomToast(
        "Success",
        "New category created successfully",
        "success"
      )
    } catch (error) {
      console.error('Error creating category:', error)
      showCustomToast(
        "Error",
        "Failed to create new category",
        "error"
      )
    }
  }

  const handleCreateTag = async () => {
    try {
      if (!csrfToken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch('http://127.0.0.1:8000/bugtracker/tags/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          name: newTagName
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create tag')
      }

      const newTag = await response.json()
      setTags([...tags, newTag])
      setErrorDetails(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.id]
      }))
      setShowTagDialog(false)
      setNewTagName("")
      showCustomToast(
        "Success",
        "New tag created successfully",
        "success"
      )
    } catch (error) {
      console.error('Error creating tag:', error)
      showCustomToast(
        "Error",
        "Failed to create new tag",
        "error"
      )
    }
  }

  const handleCreateLanguage = async () => {
    try {
      if (!csrfToken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch('http://127.0.0.1:8000/bugtracker/languages/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          name: newLanguageName
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create language')
      }

      const newLanguage = await response.json()
      setLanguages([...languages, newLanguage])
      setErrorDetails(prev => ({ ...prev, language: newLanguage.id.toString() }))
      setShowLanguageDialog(false)
      setNewLanguageName("")
      showCustomToast(
        "Success",
        "New language created successfully",
        "success"
      )
    } catch (error) {
      console.error('Error creating language:', error)
      showCustomToast(
        "Error",
        "Failed to create new language",
        "error"
      )
    }
  }

  const handleCreateFramework = async () => {
    try {
      if (!csrfToken || !selectedLanguageForFramework) {
        throw new Error("CSRF token or language not found")
      }
      const response = await fetch('http://127.0.0.1:8000/bugtracker/frameworks/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({
          name: newFrameworkName,
          language: parseInt(selectedLanguageForFramework)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create framework')
      }

      const newFramework = await response.json()
      setFrameworks([...frameworks, newFramework])
      setErrorDetails(prev => ({ ...prev, framework: newFramework.id.toString() }))
      setShowFrameworkDialog(false)
      setNewFrameworkName("")
      setSelectedLanguageForFramework("")
      showCustomToast(
        "Success",
        "New framework created successfully",
        "success"
      )
    } catch (error) {
      console.error('Error creating framework:', error)
      showCustomToast(
        "Error",
        "Failed to create new framework",
        "error"
      )
    }
  }

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTagInputValue(value)
    
    // Open suggestions when user starts typing
    if (value.trim().length > 0) {
      setTagSuggestionsOpen(true)
    } else {
      setTagSuggestionsOpen(false)
    }
  }

  const handleTagSelect = (tagId: number) => {
    if (!errorDetails.tags.includes(tagId)) {
      setErrorDetails(prev => ({
        ...prev,
        tags: [...prev.tags, tagId]
      }))
    }
    
    setTagInputValue("")
    setTagSuggestionsOpen(false)
    if (tagInputRef.current) {
      tagInputRef.current.focus()
    }
  }

  const handleTagCreate = () => {
    if (tagInputValue.trim()) {
      setNewTagName(tagInputValue.trim())
      setShowTagDialog(true)
      setTagSuggestionsOpen(false)
    }
  }

  const handleTagRemove = (tagId: number) => {
    setErrorDetails(prev => ({
      ...prev,
      tags: prev.tags.filter(id => id !== tagId)
    }))
  }

  const filteredTagSuggestions = tags.filter(tag => 
    tag.name.toLowerCase().includes(tagInputValue.toLowerCase()) &&
    !errorDetails.tags.includes(tag.id)
  )

  const filteredFrameworks = frameworks.filter(
    framework => framework.language.toString() === errorDetails.language
  )

  const selectedTags = tags.filter(tag => errorDetails.tags.includes(tag.id))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Dashboard</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Log New Error</h1>
      </div>

      <Card className="border-border/40 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Bug className="size-5" />
            </div>
            <div>
              <CardTitle>Error Details</CardTitle>
              <CardDescription>Provide information about the error you encountered</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs value={activeTab} defaultValue="details" className="space-y-6" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 rounded-lg">
                <TabsTrigger value="details" className="rounded-lg">
                  Basic Details
                </TabsTrigger>
                <TabsTrigger value="technical" className="rounded-lg">
                  Technical Info
                </TabsTrigger>
                <TabsTrigger value="additional" className="rounded-lg">
                  Additional Info
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Error Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Brief description of the error"
                      value={errorDetails.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Detailed Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Provide a detailed description of the error"
                      className="min-h-[120px]"
                      value={errorDetails.description}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">
                        Error Category <span className="text-red-500">*</span>
                      </Label>
                      {isLoading ? (
                        <Select disabled>
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Loading categories..." />
                          </SelectTrigger>
                        </Select>
                      ) : (
                        <Select
                          value={errorDetails.category}
                          onValueChange={(value) => handleSelectChange("category", value)}
                          required
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                            <SelectItem value="other">Other (Add New)</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">
                        Priority <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={errorDetails.priority}
                        onValueChange={(value) => handleSelectChange("priority", value)}
                        required
                      >
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">Critical - Blocking Production</SelectItem>
                          <SelectItem value="high">High - Major Functionality Broken</SelectItem>
                          <SelectItem value="medium">Medium - Partial Functionality Affected</SelectItem>
                          <SelectItem value="low">Low - Minor Issue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Programming Language</Label>
                      {isLoading ? (
                        <Select disabled>
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Loading languages..." />
                          </SelectTrigger>
                        </Select>
                      ) : (
                        <Select
                          value={errorDetails.language}
                          onValueChange={(value) => handleSelectChange("language", value)}
                        >
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((language) => (
                              <SelectItem key={language.id} value={language.id.toString()}>
                                {language.name}
                              </SelectItem>
                            ))}
                            <SelectItem value="other">Other (Add New)</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="framework">Framework</Label>
                      {isLoading ? (
                        <Select disabled>
                          <SelectTrigger id="framework">
                            <SelectValue placeholder="Loading frameworks..." />
                          </SelectTrigger>
                        </Select>
                      ) : (
                        <Select
                          value={errorDetails.framework}
                          onValueChange={(value) => handleSelectChange("framework", value)}
                          disabled={!errorDetails.language}
                        >
                          <SelectTrigger id="framework">
                            <SelectValue placeholder={errorDetails.language ? "Select framework" : "Select language first"} />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredFrameworks.map((framework) => (
                              <SelectItem key={framework.id} value={framework.id.toString()}>
                                {framework.name}
                              </SelectItem>
                            ))}
                            <SelectItem value="other">Other (Add New)</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="environment">Environment</Label>
                    <Select
                      value={errorDetails.environment}
                      onValueChange={(value) => handleSelectChange("environment", value)}
                    >
                      <SelectTrigger id="environment">
                        <SelectValue placeholder="Select environment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="testing">Testing/QA</SelectItem>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={() => setActiveTab("technical")} className="rounded-lg">
                    Next: Technical Info
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="technical" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="error_message">Error Message</Label>
                    <Input
                      id="error_message"
                      name="error_message"
                      placeholder="The exact error message you received"
                      value={errorDetails.error_message}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stack_trace">Stack Trace</Label>
                    <Textarea
                      id="stack_trace"
                      name="stack_trace"
                      placeholder="Paste the full stack trace here"
                      className="min-h-[120px] font-mono text-sm"
                      value={errorDetails.stack_trace}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="steps_to_reproduce">Steps to Reproduce</Label>
                    <Textarea
                      id="steps_to_reproduce"
                      name="steps_to_reproduce"
                      placeholder="Step-by-step instructions to reproduce the error"
                      className="min-h-[120px]"
                      value={errorDetails.steps_to_reproduce}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expected_behaviour">Expected Behavior</Label>
                      <Textarea
                        id="expected_behaviour"
                        name="expected_behaviour"
                        placeholder="What should have happened"
                        className="min-h-[100px]"
                        value={errorDetails.expected_behaviour}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="actual_behaviour">Actual Behavior</Label>
                      <Textarea
                        id="actual_behaviour"
                        name="actual_behaviour"
                        placeholder="What actually happened"
                        className="min-h-[100px]"
                        value={errorDetails.actual_behaviour}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("details")}
                    className="rounded-lg"
                  >
                    Back: Basic Details
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("additional")} className="rounded-lg">
                    Next: Additional Info
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="additional" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="assigned_to">Assign To</Label>
                    <Select
                      value={errorDetails.assigned_to}
                      onValueChange={(value) => handleSelectChange("assigned_to", value)}
                    >
                      <SelectTrigger id="assigned_to">
                        <SelectValue placeholder="Select team " />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id.toString()}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Deadline (optional)</Label>
                    <Popover open={deadlineOpen} onOpenChange={setDeadlineOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !deadline && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {deadline ? format(deadline, "PPP") : <span>Pick a deadline</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={deadline}
                          onSelect={(date) => {
                            setDeadline(date)
                            setDeadlineOpen(false)
                          }}
                          initialFocus
                        />
                        <div className="p-2 border-t flex justify-end">
                          <PopoverClose asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeadline(undefined)}
                            >
                              Clear
                            </Button>
                          </PopoverClose>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Popover open={tagSuggestionsOpen} onOpenChange={setTagSuggestionsOpen}>
                          <PopoverTrigger asChild>
                            <Input
                              ref={tagInputRef}
                              placeholder="Type to search or add tags"
                              value={tagInputValue}
                              onChange={handleTagInputChange}
                              onFocus={() => {
                                if (tagInputValue.trim().length > 0) {
                                  setTagSuggestionsOpen(true)
                                }
                              }}
                            />
                          </PopoverTrigger>
                          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search tags..." />
                              <CommandEmpty>
                                <div className="p-2 text-sm text-muted-foreground">
                                  No tags found. <Button variant="link" className="h-auto p-0" onClick={handleTagCreate}>Create "{tagInputValue}"</Button>
                                </div>
                              </CommandEmpty>
                              <CommandGroup>
                                {filteredTagSuggestions.map((tag) => (
                                  <CommandItem
                                    key={tag.id}
                                    value={tag.name}
                                    onSelect={() => handleTagSelect(tag.id)}
                                  >
                                    {tag.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowTagDialog(true)}
                        >
                          Add New
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedTags.map((tag) => (
                          <span key={tag.id} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-sm flex items-center gap-1">
                            {tag.name}
                            <button
                              type="button"
                              onClick={() => handleTagRemove(tag.id)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="visible_to_public"
                      checked={errorDetails.visible_to_public}
                      onCheckedChange={(checked) => handleCheckboxChange("visible_to_public", checked as boolean)}
                    />
                    <Label htmlFor="visible_to_public" className="text-sm font-normal">
                      Make this error public (visible to all users)
                    </Label>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("technical")}
                    className="rounded-lg"
                  >
                    Back: Technical Info
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="rounded-lg">
                    {isSubmitting ? "Submitting..." : "Submit Error Report"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </CardContent>
      </Card>

      {/* New Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new error category that will be available for all users
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newCategoryName">Category Name</Label>
              <Input
                id="newCategoryName"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newCategoryDescription">Description</Label>
              <Textarea
                id="newCategoryDescription"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Enter category description"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCategory} disabled={!newCategoryName.trim()}>
              Create Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Tag Dialog */}
      <Dialog open={showTagDialog} onOpenChange={setShowTagDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tag</DialogTitle>
            <DialogDescription>
              Create a new tag that can be used to categorize errors
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newTagName">Tag Name</Label>
              <Input
                id="newTagName"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Enter tag name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTagDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTag} disabled={!newTagName.trim()}>
              Create Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Language Dialog */}
      <Dialog open={showLanguageDialog} onOpenChange={setShowLanguageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Language</DialogTitle>
            <DialogDescription>
              Create a new programming language that will be available for selection
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newLanguageName">Language Name</Label>
              <Input
                id="newLanguageName"
                value={newLanguageName}
                onChange={(e) => setNewLanguageName(e.target.value)}
                placeholder="Enter language name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLanguageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateLanguage} disabled={!newLanguageName.trim()}>
              Create Language
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Framework Dialog */}
      <Dialog open={showFrameworkDialog} onOpenChange={setShowFrameworkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Framework</DialogTitle>
            <DialogDescription>
              Create a new framework that will be available for selection
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newFrameworkName">Framework Name</Label>
              <Input
                id="newFrameworkName"
                value={newFrameworkName}
                onChange={(e) => setNewFrameworkName(e.target.value)}
                placeholder="Enter framework name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frameworkLanguage">Language</Label>
              <Select
                value={selectedLanguageForFramework}
                onValueChange={setSelectedLanguageForFramework}
              >
                <SelectTrigger id="frameworkLanguage">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.id} value={language.id.toString()}>
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFrameworkDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateFramework} 
              disabled={!newFrameworkName.trim() || !selectedLanguageForFramework}
            >
              Create Framework
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
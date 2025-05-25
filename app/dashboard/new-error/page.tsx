"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Bug, Upload } from "lucide-react"
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
import {getCookie} from "@/utils/cookies"

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

export default function NewErrorPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [showTagDialog, setShowTagDialog] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryDescription, setNewCategoryDescription] = useState("")
  const [newTagName, setNewTagName] = useState("")
  const { toast } = useToast()
  const csrfToken = getCookie("csrftoken")
  

  const [errorDetails, setErrorDetails] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    programmingLanguage: "",
    errorMessage: "",
    stackTrace: "",
    stepsToReproduce: "",
    expectedBehavior: "",
    actualBehavior: "",
    environment: "",
    assignTo: "",
    isPublic: false,
    tags: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
      if(!csrfToken) {
        throw new Error("CSRF token not found")}
        const [categoriesRes, tagsRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/bugtracker/categories/',{
          method: 'GET',
          credentials: "include",
          headers: {
            "X-CSRFToken": csrfToken,
          }
        }),
        fetch('http://127.0.0.1:8000/bugtracker/tags/',{
          method: 'GET',
          credentials: "include",
          headers: {
            "X-CSRFToken": csrfToken,
          }
        })
      ])

        if (!categoriesRes.ok || !tagsRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const categoriesData = await categoriesRes.json()
        const tagsData = await tagsRes.json()

        setCategories(categoriesData)
        setTags(tagsData)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: "Error",
          description: "Failed to load categories and tags",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setErrorDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === "category" && value === "other") {
      setShowCategoryDialog(true)
      return
    }
    setErrorDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setErrorDetails((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // Redirect to dashboard or error details page
      window.location.href = "/dashboard"
    }, 1500)
  }

  const handleCreateCategory = async () => {
    try {
      if(!csrfToken) {
        throw new Error("CSRF token not found")}
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
      toast({
        title: "Success",
        description: "New category created successfully",
      })
    } catch (error) {
      console.error('Error creating category:', error)
      toast({
        title: "Error",
        description: "Failed to create new category",
        variant: "destructive",
      })
    }
  }

  const handleCreateTag = async () => {
    try {
      if(!csrfToken) {
        throw new Error("CSRF token not found")}
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
        tags: prev.tags ? `${prev.tags},${newTag.name}` : newTag.name
      }))
      setShowTagDialog(false)
      setNewTagName("")
      toast({
        title: "Success",
        description: "New tag created successfully",
      })
    } catch (error) {
      console.error('Error creating tag:', error)
      toast({
        title: "Error",
        description: "Failed to create new tag",
        variant: "destructive",
      })
    }
  }

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
            <Tabs defaultValue="details" className="space-y-6" onValueChange={setActiveTab}>
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
                      <Label htmlFor="programmingLanguage">Programming Language/Framework</Label>
                      <Select
                        value={errorDetails.programmingLanguage}
                        onValueChange={(value) => handleSelectChange("programmingLanguage", value)}
                      >
                        <SelectTrigger id="programmingLanguage">
                          <SelectValue placeholder="Select language/framework" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="typescript">TypeScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="java">Java</SelectItem>
                          <SelectItem value="csharp">C#</SelectItem>
                          <SelectItem value="php">PHP</SelectItem>
                          <SelectItem value="go">Go</SelectItem>
                          <SelectItem value="ruby">Ruby</SelectItem>
                          <SelectItem value="react">React</SelectItem>
                          <SelectItem value="angular">Angular</SelectItem>
                          <SelectItem value="vue">Vue.js</SelectItem>
                          <SelectItem value="nextjs">Next.js</SelectItem>
                          <SelectItem value="django">Django</SelectItem>
                          <SelectItem value="laravel">Laravel</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
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
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={() => setActiveTab("technical")} className="rounded-lg">
                    Next: Technical Info
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="technical" className="space-y-6">
                {/* Technical Info tab content remains the same as before */}
                {/* ... */}
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
                    <Label htmlFor="assignTo">Assign To</Label>
                    <Select
                      value={errorDetails.assignTo}
                      onValueChange={(value) => handleSelectChange("assignTo", value)}
                    >
                      <SelectTrigger id="assignTo">
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        <SelectItem value="john">John Assefa</SelectItem>
                        <SelectItem value="netsanet">Netsanet Alemu</SelectItem>
                        <SelectItem value="abiy">Abiy Shiferaw</SelectItem>
                        <SelectItem value="team">Entire Team</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        name="tags"
                        placeholder="Add tags separated by commas (e.g., frontend, api, authentication)"
                        value={errorDetails.tags}
                        onChange={handleChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowTagDialog(true)}
                      >
                        Add New
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags
                        .filter(tag => errorDetails.tags.split(',').map(t => t.trim()).includes(tag.name))
                        .map(tag => (
                          <span key={tag.id} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                            {tag.name}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="isPublic"
                      checked={errorDetails.isPublic}
                      onCheckedChange={(checked) => handleCheckboxChange("isPublic", checked as boolean)}
                    />
                    <Label htmlFor="isPublic" className="text-sm font-normal">
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
    </div>
  )
}
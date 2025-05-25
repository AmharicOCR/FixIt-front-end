"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Trash2, Edit, Plus, Check, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { getCookie } from "@/utils/cookies"

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
  status: string
}

interface Framework {
  id: number
  name: string
  language: number
  language_name: string
  status: string
}

export default function AdminCategoriesTagsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [frameworks, setFrameworks] = useState<Framework[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("categories")
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [showTagDialog, setShowTagDialog] = useState(false)
  const [showLanguageDialog, setShowLanguageDialog] = useState(false)
  const [showFrameworkDialog, setShowFrameworkDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null)
  const [editingFramework, setEditingFramework] = useState<Framework | null>(null)
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })
  const [newTag, setNewTag] = useState({ name: "" })
  const [newLanguage, setNewLanguage] = useState({ name: "" })
  const [newFramework, setNewFramework] = useState({ name: "", language: "" })
  const { toast } = useToast()
  const csrftoken = getCookie('csrftoken')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }
      
      const [categoriesRes, tagsRes, languagesRes, frameworksRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/bugtracker/categories/', {
          method: 'GET',
          credentials: "include",
          headers: {
            "X-CSRFToken": csrftoken,
          }
        }),
        fetch('http://127.0.0.1:8000/bugtracker/tags/', {
          method: 'GET',
          credentials: "include",
          headers: {
            "X-CSRFToken": csrftoken,
          }
        }),
        fetch('http://127.0.0.1:8000/bugtracker/languages/', {
          method: 'GET',
          credentials: "include",
          headers: {
            "X-CSRFToken": csrftoken,
          }
        }),
        fetch('http://127.0.0.1:8000/bugtracker/frameworks/', {
          method: 'GET',
          credentials: "include",
          headers: {
            "X-CSRFToken": csrftoken,
          }
        })
      ])

      if (!categoriesRes.ok || !tagsRes.ok || !languagesRes.ok || !frameworksRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const categoriesData = await categoriesRes.json()
      const tagsData = await tagsRes.json()
      const languagesData = await languagesRes.json()
      const frameworksData = await frameworksRes.json()

      setCategories(categoriesData)
      setTags(tagsData)
      setLanguages(languagesData)
      setFrameworks(frameworksData)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  // Category handlers
  const handleCreateCategory = async () => {
    try {
      const csrftoken = getCookie('csrftoken')
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }

      const response = await fetch('http://127.0.0.1:8000/bugtracker/categories/', {
        method: 'POST',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(newCategory)
      })

      if (!response.ok) {
        throw new Error('Failed to create category')
      }

      const createdCategory = await response.json()
      setCategories([...categories, createdCategory])
      setShowCategoryDialog(false)
      setNewCategory({ name: "", description: "" })
      toast({
        title: "Success",
        description: "Category created successfully",
      })
    } catch (error) {
      console.error('Error creating category:', error)
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      })
    }
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory) return

    try {
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/categories/${editingCategory.id}/`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(editingCategory)
      })

      if (!response.ok) {
        throw new Error('Failed to update category')
      }

      const updatedCategory = await response.json()
      setCategories(categories.map(c => c.id === updatedCategory.id ? updatedCategory : c))
      setEditingCategory(null)
      toast({
        title: "Success",
        description: "Category updated successfully",
      })
    } catch (error) {
      console.error('Error updating category:', error)
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async (id: number) => {
    try {
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/categories/${id}/`, {
        method: 'DELETE',
        credentials: "include",
        headers: {
          "X-CSRFToken": csrftoken,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete category')
      }

      setCategories(categories.filter(c => c.id !== id))
      toast({
        title: "Success",
        description: "Category deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting category:', error)
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  const handleUpdateCategoryStatus = async (id: number, status: string) => {
    try {
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/categories/status/${id}/`, {
        method: 'PATCH',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({ status })
      })

      if (!response.ok) {
        throw new Error('Failed to update category status')
      }

      const updatedCategory = await response.json()
      setCategories(categories.map(c => c.id === id ? updatedCategory : c))
      toast({
        title: "Success",
        description: `Category status updated to ${status}`,
      })
    } catch (error) {
      console.error('Error updating category status:', error)
      toast({
        title: "Error",
        description: "Failed to update category status",
        variant: "destructive",
      })
    }
  }

  // Tag handlers
  const handleCreateTag = async () => {
    try {
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch('http://127.0.0.1:8000/bugtracker/tags/', {
        method: 'POST',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(newTag)
      })

      if (!response.ok) {
        throw new Error('Failed to create tag')
      }

      const createdTag = await response.json()
      setTags([...tags, createdTag])
      setShowTagDialog(false)
      setNewTag({ name: "" })
      toast({
        title: "Success",
        description: "Tag created successfully",
      })
    } catch (error) {
      console.error('Error creating tag:', error)
      toast({
        title: "Error",
        description: "Failed to create tag",
        variant: "destructive",
      })
    }
  }

  const handleUpdateTag = async () => {
    if (!editingTag) return

    try {
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/tags/${editingTag.id}/`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(editingTag)
      })

      if (!response.ok) {
        throw new Error('Failed to update tag')
      }

      const updatedTag = await response.json()
      setTags(tags.map(t => t.id === updatedTag.id ? updatedTag : t))
      setEditingTag(null)
      toast({
        title: "Success",
        description: "Tag updated successfully",
      })
    } catch (error) {
      console.error('Error updating tag:', error)
      toast({
        title: "Error",
        description: "Failed to update tag",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTag = async (id: number) => {
    try {
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/tags/${id}/`, {
        method: 'DELETE',
        credentials: "include",
        headers: {
          "X-CSRFToken": csrftoken,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete tag')
      }

      setTags(tags.filter(t => t.id !== id))
      toast({
        title: "Success",
        description: "Tag deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting tag:', error)
      toast({
        title: "Error",
        description: "Failed to delete tag",
        variant: "destructive",
      })
    }
  }

  const handleUpdateTagStatus = async (id: number, status: string) => {
    try {
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/tags/status/${id}/`, {
        method: 'PATCH',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({ status })
      })

      if (!response.ok) {
        throw new Error('Failed to update tag status')
      }

      const updatedTag = await response.json()
      setTags(tags.map(t => t.id === id ? updatedTag : t))
      toast({
        title: "Success",
        description: `Tag status updated to ${status}`,
      })
    } catch (error) {
      console.error('Error updating tag status:', error)
      toast({
        title: "Error",
        description: "Failed to update tag status",
        variant: "destructive",
      })
    }
  }

  // Language handlers
  const handleCreateLanguage = async () => {
    try {
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch('http://127.0.0.1:8000/bugtracker/languages/', {
        method: 'POST',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(newLanguage)
      })

      if (!response.ok) {
        throw new Error('Failed to create language')
      }

      const createdLanguage = await response.json()
      setLanguages([...languages, createdLanguage])
      setShowLanguageDialog(false)
      setNewLanguage({ name: "" })
      toast({
        title: "Success",
        description: "Language created successfully",
      })
    } catch (error) {
      console.error('Error creating language:', error)
      toast({
        title: "Error",
        description: "Failed to create language",
        variant: "destructive",
      })
    }
  }

  const handleUpdateLanguage = async () => {
    if (!editingLanguage) return

    try {
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/languages/${editingLanguage.id}/`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(editingLanguage)
      })

      if (!response.ok) {
        throw new Error('Failed to update language')
      }

      const updatedLanguage = await response.json()
      setLanguages(languages.map(l => l.id === updatedLanguage.id ? updatedLanguage : l))
      setEditingLanguage(null)
      toast({
        title: "Success",
        description: "Language updated successfully",
      })
    } catch (error) {
      console.error('Error updating language:', error)
      toast({
        title: "Error",
        description: "Failed to update language",
        variant: "destructive",
      })
    }
  }

  const handleDeleteLanguage = async (id: number) => {
    try {
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/languages/${id}/`, {
        method: 'DELETE',
        credentials: "include",
        headers: {
          "X-CSRFToken": csrftoken,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete language')
      }

      setLanguages(languages.filter(l => l.id !== id))
      setFrameworks(frameworks.filter(f => f.language !== id))
      toast({
        title: "Success",
        description: "Language deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting language:', error)
      toast({
        title: "Error",
        description: "Failed to delete language",
        variant: "destructive",
      })
    }
  }

  const handleUpdateLanguageStatus = async (id: number, status: string) => {
    try {
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/languages/status/${id}/`, {
        method: 'PATCH',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({ status })
      })

      if (!response.ok) {
        throw new Error('Failed to update language status')
      }

      const updatedLanguage = await response.json()
      setLanguages(languages.map(l => l.id === id ? updatedLanguage : l))
      toast({
        title: "Success",
        description: `Language status updated to ${status}`,
      })
    } catch (error) {
      console.error('Error updating language status:', error)
      toast({
        title: "Error",
        description: "Failed to update language status",
        variant: "destructive",
      })
    }
  }

  // Framework handlers
  const handleCreateFramework = async () => {
    try {
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }
      if (!newFramework.language) {
        throw new Error("Please select a language")
      }
      
      const response = await fetch('http://127.0.0.1:8000/bugtracker/frameworks/', {
        method: 'POST',
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({
          ...newFramework,
          language: parseInt(newFramework.language)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create framework')
      }

      const createdFramework = await response.json()
      setFrameworks([...frameworks, createdFramework])
      setShowFrameworkDialog(false)
      setNewFramework({ name: "", language: "" })
      toast({
        title: "Success",
        description: "Framework created successfully",
      })
    } catch (error) {
      console.error('Error creating framework:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create framework",
        variant: "destructive",
      })
    }
  }

  const handleUpdateFramework = async () => {
    if (!editingFramework) return

    try {
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/frameworks/${editingFramework.id}/`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({
          ...editingFramework,
          language: parseInt(editingFramework.language.toString())
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update framework')
      }

      const updatedFramework = await response.json()
      setFrameworks(frameworks.map(f => f.id === updatedFramework.id ? updatedFramework : f))
      setEditingFramework(null)
      toast({
        title: "Success",
        description: "Framework updated successfully",
      })
    } catch (error) {
      console.error('Error updating framework:', error)
      toast({
        title: "Error",
        description: "Failed to update framework",
        variant: "destructive",
      })
    }
  }

  const handleDeleteFramework = async (id: number) => {
    try {
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/frameworks/${id}/`, {
        method: 'DELETE',
        credentials: "include",
        headers: {
          "X-CSRFToken": csrftoken,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete framework')
      }

      setFrameworks(frameworks.filter(f => f.id !== id))
      toast({
        title: "Success",
        description: "Framework deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting framework:', error)
      toast({
        title: "Error",
        description: "Failed to delete framework",
        variant: "destructive",
      })
    }
  }

  const handleUpdateFrameworkStatus = async (id: number, status: string) => {
    try {
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch(`http://127.0.0.1:8000/bugtracker/frameworks/status/${id}/`, {
        method: 'PATCH',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({ status })
      })

      if (!response.ok) {
        throw new Error('Failed to update framework status')
      }

      const updatedFramework = await response.json()
      setFrameworks(frameworks.map(f => f.id === id ? updatedFramework : f))
      toast({
        title: "Success",
        description: `Framework status updated to ${status}`,
      })
    } catch (error) {
      console.error('Error updating framework status:', error)
      toast({
        title: "Error",
        description: "Failed to update framework status",
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
        <h1 className="text-2xl font-bold tracking-tight">Categories & Tags Management</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Manage Categories, Tags, Languages & Frameworks</CardTitle>
              <CardDescription>Create, edit, and delete categories, tags, languages and frameworks</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeTab === "categories" ? "default" : "outline"}
                onClick={() => setActiveTab("categories")}
              >
                Categories
              </Button>
              <Button
                variant={activeTab === "tags" ? "default" : "outline"}
                onClick={() => setActiveTab("tags")}
              >
                Tags
              </Button>
              <Button
                variant={activeTab === "languages" ? "default" : "outline"}
                onClick={() => setActiveTab("languages")}
              >
                Languages
              </Button>
              <Button
                variant={activeTab === "frameworks" ? "default" : "outline"}
                onClick={() => setActiveTab("frameworks")}
              >
                Frameworks
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "categories" ? (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={() => setShowCategoryDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <p>Loading categories...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>
                          <Select
                            value={category.status}
                            onValueChange={(value) => handleUpdateCategoryStatus(category.id, value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEditingCategory(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          ) : activeTab === "tags" ? (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={() => setShowTagDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tag
                </Button>
              </div>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <p>Loading tags...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tags.map((tag) => (
                      <TableRow key={tag.id}>
                        <TableCell className="font-medium">{tag.name}</TableCell>
                        <TableCell>
                          <Select
                            value={tag.status}
                            onValueChange={(value) => handleUpdateTagStatus(tag.id, value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEditingTag(tag)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteTag(tag.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          ) : activeTab === "languages" ? (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={() => setShowLanguageDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Language
                </Button>
              </div>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <p>Loading languages...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {languages.map((language) => (
                      <TableRow key={language.id}>
                        <TableCell className="font-medium">{language.name}</TableCell>
                        <TableCell>
                          <Select
                            value={language.status}
                            onValueChange={(value) => handleUpdateLanguageStatus(language.id, value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEditingLanguage(language)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteLanguage(language.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={() => setShowFrameworkDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Framework
                </Button>
              </div>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <p>Loading frameworks...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {frameworks.map((framework) => (
                      <TableRow key={framework.id}>
                        <TableCell className="font-medium">{framework.name}</TableCell>
                        <TableCell>{framework.language_name}</TableCell>
                        <TableCell>
                          <Select
                            value={framework.status}
                            onValueChange={(value) => handleUpdateFrameworkStatus(framework.id, value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEditingFramework(framework)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteFramework(framework.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category that will be available for error classification
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">Name</Label>
              <Input
                id="categoryName"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryDescription">Description</Label>
              <Textarea
                id="categoryDescription"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Enter category description"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCategory} disabled={!newCategory.name.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        {editingCategory && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update the category details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editCategoryName">Name</Label>
                <Input
                  id="editCategoryName"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCategoryDescription">Description</Label>
                <Textarea
                  id="editCategoryDescription"
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingCategory(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateCategory}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
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
              <Label htmlFor="tagName">Name</Label>
              <Input
                id="tagName"
                value={newTag.name}
                onChange={(e) => setNewTag({ name: e.target.value })}
                placeholder="Enter tag name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTagDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTag} disabled={!newTag.name.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={!!editingTag} onOpenChange={(open) => !open && setEditingTag(null)}>
        {editingTag && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Tag</DialogTitle>
              <DialogDescription>
                Update the tag details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editTagName">Name</Label>
                <Input
                  id="editTagName"
                  value={editingTag.name}
                  onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingTag(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateTag}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* New Language Dialog */}
      <Dialog open={showLanguageDialog} onOpenChange={setShowLanguageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Language</DialogTitle>
            <DialogDescription>
              Create a new programming language for error classification
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="languageName">Name</Label>
              <Input
                id="languageName"
                value={newLanguage.name}
                onChange={(e) => setNewLanguage({ name: e.target.value })}
                placeholder="Enter language name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLanguageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateLanguage} disabled={!newLanguage.name.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Language Dialog */}
      <Dialog open={!!editingLanguage} onOpenChange={(open) => !open && setEditingLanguage(null)}>
        {editingLanguage && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Language</DialogTitle>
              <DialogDescription>
                Update the language details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editLanguageName">Name</Label>
                <Input
                  id="editLanguageName"
                  value={editingLanguage.name}
                  onChange={(e) => setEditingLanguage({ ...editingLanguage, name: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingLanguage(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateLanguage}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* New Framework Dialog */}
      <Dialog open={showFrameworkDialog} onOpenChange={setShowFrameworkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Framework</DialogTitle>
            <DialogDescription>
              Create a new framework for a programming language
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="frameworkName">Name</Label>
              <Input
                id="frameworkName"
                value={newFramework.name}
                onChange={(e) => setNewFramework({ ...newFramework, name: e.target.value })}
                placeholder="Enter framework name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frameworkLanguage">Language</Label>
              <Select
                value={newFramework.language}
                onValueChange={(value) => setNewFramework({ ...newFramework, language: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.length > 0 ? (
                    languages.map((language) => (
                      <SelectItem key={language.id} value={language.id.toString()}>
                        {language.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No languages available
                    </SelectItem>
                  )}
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
              disabled={!newFramework.name.trim() || !newFramework.language}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Framework Dialog */}
      <Dialog open={!!editingFramework} onOpenChange={(open) => !open && setEditingFramework(null)}>
        {editingFramework && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Framework</DialogTitle>
              <DialogDescription>
                Update the framework details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="editFrameworkName">Name</Label>
                <Input
                  id="editFrameworkName"
                  value={editingFramework.name}
                  onChange={(e) => setEditingFramework({ ...editingFramework, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editFrameworkLanguage">Language</Label>
                <Select
                  value={editingFramework.language.toString()}
                  onValueChange={(value) => setEditingFramework({ ...editingFramework, language: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.length > 0 ? (
                      languages.map((language) => (
                        <SelectItem key={language.id} value={language.id.toString()}>
                          {language.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        No languages available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingFramework(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateFramework}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
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

export default function AdminCategoriesTagsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("categories")
  const [showCategoryDialog, setShowCategoryDialog] = useState(false)
  const [showTagDialog, setShowTagDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })
  const [newTag, setNewTag] = useState({ name: "" })
  const { toast } = useToast()
      const csrftoken = getCookie('csrftoken')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
              if (!csrftoken) {
                throw new Error("CSRF token not found")
              }//
      const [categoriesRes, tagsRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/bugtracker/categories/',{
          method: 'GET',
          credentials: "include",
          headers: {
            "X-CSRFToken": csrftoken,
          }
        }),
        fetch('http://127.0.0.1:8000/bugtracker/tags/',{
          method: 'GET',
          credentials: "include",
          headers: {
            "X-CSRFToken": csrftoken,
          }
        })
      ])
// 
      if (!categoriesRes.ok || !tagsRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const categoriesData = await categoriesRes.json()
      const tagsData = await tagsRes.json()
      console.log("Fetched categories:", categoriesData)
      console.log("Fetched tags:", tagsData)

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

  const handleCreateCategory = async () => {
    try {
      const csrftoken = getCookie('csrftoken')
              if (!csrftoken) {
                throw new Error("CSRF token not found")
              }

              console.log("Creating ", newCategory)
      const response = await fetch('http://127.0.0.1:8000/bugtracker/categories/', {
        method: 'POST',
        credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
        body: JSON.stringify(newCategory)
      })
      console.log("Response status:", response)

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
      if(!csrftoken) {
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
      if(!csrftoken) {
        throw new Error("CSRF token not found")}
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
      if(!csrftoken) {
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

  const handleCreateTag = async () => {
    try {
      if(!csrftoken) {
        throw new Error("CSRF token not found")
      }
      const response = await fetch('http://127.0.0.1:8000/bugtracker/tags/', {
        method: 'POST',
        credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
        body: JSON.stringify(
          
          newTag
        )
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
      if(!csrftoken) {
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
      if(!csrftoken) {
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
      if(!csrftoken) {
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
              <CardTitle>Manage Categories & Tags</CardTitle>
              <CardDescription>Create, edit, and delete categories and tags</CardDescription>
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
          ) : (
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
                  onChange={(e: { target: { value: any } }) => setEditingCategory({ ...editingCategory, description: e.target.value })}
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
    </div>
  )
}
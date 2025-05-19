"use client"

import type React from "react"

import { useState } from "react"
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

export default function NewErrorPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setErrorDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
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
                      <Select
                        value={errorDetails.category}
                        onValueChange={(value) => handleSelectChange("category", value)}
                        required
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="syntax">Syntax Error</SelectItem>
                          <SelectItem value="runtime">Runtime Exception</SelectItem>
                          <SelectItem value="logical">Logical Error</SelectItem>
                          <SelectItem value="compilation">Compilation Error</SelectItem>
                          <SelectItem value="network">Network Issue</SelectItem>
                          <SelectItem value="database">Database Error</SelectItem>
                          <SelectItem value="ui">UI/UX Issue</SelectItem>
                          <SelectItem value="performance">Performance Problem</SelectItem>
                          <SelectItem value="security">Security Vulnerability</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
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
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="errorMessage">Error Message</Label>
                    <Input
                      id="errorMessage"
                      name="errorMessage"
                      placeholder="Exact error message displayed"
                      value={errorDetails.errorMessage}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stackTrace">Stack Trace</Label>
                    <Textarea
                      id="stackTrace"
                      name="stackTrace"
                      placeholder="Paste the stack trace here"
                      className="min-h-[150px] font-mono text-sm"
                      value={errorDetails.stackTrace}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stepsToReproduce">
                      Steps to Reproduce <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="stepsToReproduce"
                      name="stepsToReproduce"
                      placeholder="List the steps to reproduce this error"
                      className="min-h-[120px]"
                      value={errorDetails.stepsToReproduce}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expectedBehavior">Expected Behavior</Label>
                      <Textarea
                        id="expectedBehavior"
                        name="expectedBehavior"
                        placeholder="What should happen"
                        className="min-h-[100px]"
                        value={errorDetails.expectedBehavior}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="actualBehavior">Actual Behavior</Label>
                      <Textarea
                        id="actualBehavior"
                        name="actualBehavior"
                        placeholder="What actually happens"
                        className="min-h-[100px]"
                        value={errorDetails.actualBehavior}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Attachments</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">Drag and drop files here or click to browse</p>
                      <p className="text-xs text-muted-foreground">
                        Upload screenshots, logs, or other relevant files (max 10MB each)
                      </p>
                      <Input type="file" className="hidden" id="file-upload" multiple />
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4 rounded-lg"
                        onClick={() => document.getElementById("file-upload")?.click()}
                      >
                        Select Files
                      </Button>
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
                    <Input
                      id="tags"
                      name="tags"
                      placeholder="Add tags separated by commas (e.g., frontend, api, authentication)"
                      value={errorDetails.tags}
                      onChange={handleChange}
                    />
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
    </div>
  )
}

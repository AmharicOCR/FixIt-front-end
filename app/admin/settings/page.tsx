"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save } from "lucide-react"

export default function SettingsPage() {
  const [emailTemplates, setEmailTemplates] = useState({
    welcome: "Welcome to fix it, {{user}}! We're excited to have you join our community.",
    verification: "Please verify your email by clicking this link: {{verification_link}}",
    passwordReset: "You requested a password reset. Click here to reset your password: {{reset_link}}",
    errorNotification: "A new error has been submitted: {{error}}",
    solutionNotification: "A new solution has been submitted for your error: {{solution}}",
  })

  const handleTemplateChange = (template: string, value: string) => {
    setEmailTemplates((prev) => ({
      ...prev,
      [template]: value,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="email">Email Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input id="site-name" defaultValue="Fix it" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea
                  id="site-description"
                  defaultValue="A centralized system designed to store, categorize, and resolve software development errors."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-language">Default Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="default-language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="items-per-page">Items Per Page</Label>
                <Select defaultValue="10">
                  <SelectTrigger id="items-per-page">
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="maintenance-mode" />
                <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and access settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input id="session-timeout" type="number" defaultValue={60} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                <Input id="max-login-attempts" type="number" defaultValue={5} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="two-factor-auth" defaultChecked />
                <Label htmlFor="two-factor-auth">Enable Two-Factor Authentication</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="require-email-verification" defaultChecked />
                <Label htmlFor="require-email-verification">Require Email Verification</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="password-complexity" defaultChecked />
                <Label htmlFor="password-complexity">Enforce Password Complexity</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure when and how notifications are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Admin Notifications</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-new-user">New User Registration</Label>
                  <Switch id="notify-new-user" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-new-error">New Error Submission</Label>
                  <Switch id="notify-new-error" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-new-solution">New Solution Submission</Label>
                  <Switch id="notify-new-solution" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-reported-content">Reported Content</Label>
                  <Switch id="notify-reported-content" defaultChecked />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">User Notifications</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-solution-to-error">Solution to User's Error</Label>
                  <Switch id="notify-solution-to-error" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-comment-on-error">Comment on User's Error</Label>
                  <Switch id="notify-comment-on-error" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-comment-on-solution">Comment on User's Solution</Label>
                  <Switch id="notify-comment-on-solution" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-error-status">Error Status Change</Label>
                  <Switch id="notify-error-status" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Customize email templates sent to users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="welcome-email">Welcome Email</Label>
                <Textarea
                  id="welcome-email"
                  rows={4}
                  value={emailTemplates.welcome}
                  onChange={(e) => handleTemplateChange("welcome", e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Available variables: {"{{user}}"}, {"{{login_link}}"}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="verification-email">Email Verification</Label>
                <Textarea
                  id="verification-email"
                  rows={4}
                  value={emailTemplates.verification}
                  onChange={(e) => handleTemplateChange("verification", e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Available variables: {"{{user}}"}, {"{{verification_link}}"}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-reset">Password Reset</Label>
                <Textarea
                  id="password-reset"
                  rows={4}
                  value={emailTemplates.passwordReset}
                  onChange={(e) => handleTemplateChange("passwordReset", e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Available variables: {"{{user}}"}, {"{{reset_link}}"}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="error-notification">Error Notification</Label>
                <Textarea
                  id="error-notification"
                  rows={4}
                  value={emailTemplates.errorNotification}
                  onChange={(e) => handleTemplateChange("errorNotification", e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Available variables: {"{{user}}"}, {"{{error}}"}, {"{{error_link}}"}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="solution-notification">Solution Notification</Label>
                <Textarea
                  id="solution-notification"
                  rows={4}
                  value={emailTemplates.solutionNotification}
                  onChange={(e) => handleTemplateChange("solutionNotification", e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Available variables: {"{{user}}"}, {"{{error}}"}, {"{{solution}}"}, {"{{solution_link}}"}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Bell, Check, LockIcon, Save, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift();
}


export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isSaving, setIsSaving] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    bio: "",
    profile_picture: null as File | null,
    jobtitle: "",
    company: "",
    skills: [] as string[],
    github: "",
    website: ""
  })
  const [profileImageUrl, setProfileImageUrl] = useState("/placeholder.svg")
  const [newSkill, setNewSkill] = useState("")
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  })
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    number: false,
    uppercase: false,
    specialChar: false,
    match: true
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const csrftoken = getCookie('csrftoken')
        if (!csrftoken) {
        throw new Error("CSRF token not found")
      }
        const response = await fetch("http://127.0.0.1:8000/user/profile/", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }

        const data = await response.json()
        setFormData({
          username: data.username || "",
          email: data.email || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          bio: data.bio || "",
          profile_picture: null,
          jobtitle: data.jobtitle || "",
          company: data.company || "",
          skills: data.skills ? data.skills.split(",").map((s: string) => s.trim()) : [],
          github: data.github || "",
          website: data.website || ""
        })
        
        if (data.profile_picture) {
          setProfileImageUrl(data.profile_picture)
        }
      } catch (err) {
        console.error("Error fetching user data:", err)
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    // Validate password strength whenever new_password changes
    if (passwordData.new_password) {
      setPasswordErrors({
        length: passwordData.new_password.length >= 8,
        number: /\d/.test(passwordData.new_password),
        uppercase: /[A-Z]/.test(passwordData.new_password),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.new_password),
        match: passwordData.new_password === passwordData.confirm_password
      })
    } else {
      // Reset validation if password is empty
      setPasswordErrors({
        length: false,
        number: false,
        uppercase: false,
        specialChar: false,
        match: true
      })
    }
  }, [passwordData.new_password, passwordData.confirm_password])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData(prev => ({ ...prev, profile_picture: file }))
      
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImageUrl(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSkillRemove = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill("")
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)

    try {
      const csrftoken = getCookie('csrftoken')
      if (!csrftoken) {
        throw new Error("CSRF token not found")
      }

      const formDataToSend = new FormData()
      formDataToSend.append("username", formData.username)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("first_name", formData.first_name)
      formDataToSend.append("last_name", formData.last_name)
      formDataToSend.append("bio", formData.bio)
      if (formData.profile_picture) {
        formDataToSend.append("profile_picture", formData.profile_picture)
      }
      formDataToSend.append("jobtitle", formData.jobtitle)
      formDataToSend.append("company", formData.company)
      formDataToSend.append("skills", formData.skills.join(", "))
      formDataToSend.append("github", formData.github)
      formDataToSend.append("website", formData.website)

      const response = await fetch("http://127.0.0.1:8000/user/edit-profile/", {
        method: "PUT",
        credentials: "include",
        headers: {
          "X-CSRFToken": csrftoken,
        },
        body: formDataToSend
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.detail) {
          throw new Error(data.detail)
        } else if (data.message) {
          throw new Error(data.message)
        } else if (typeof data === 'object') {
          const fieldErrors = Object.entries(data)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('\n')
          throw new Error(fieldErrors)
        } else {
          throw new Error('Failed to update profile')
        }
      }

      setShowSuccessAlert(true)
      setTimeout(() => setShowSuccessAlert(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordUpdate = async () => {
    setIsSaving(true)
    setError(null)

    try {
      const csrftoken = getCookie('csrftoken')

      if (!csrftoken) {
        throw new Error("Authentication tokens not found")
      }

      if (passwordData.new_password !== passwordData.confirm_password) {
        throw new Error("New passwords don't match")
      }

      if (!passwordErrors.length || !passwordErrors.number || !passwordErrors.uppercase) {
        throw new Error("Password doesn't meet requirements")
      }

      const response = await fetch("http://127.0.0.1:8000/user/change-password/", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.detail) {
          throw new Error(data.detail)
        } else if (data.message) {
          throw new Error(data.message)
        } else {
          throw new Error('Failed to update password')
        }
      }

      setShowSuccessAlert(true)
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: ""
      })
      setTimeout(() => setShowSuccessAlert(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showSuccessAlert && (
        <Alert className="bg-green-500/10 border-green-500 text-green-500">
          <Check className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            {activeTab === "account" ? "Password updated successfully" : "Your profile has been updated successfully."}
          </AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSuccessAlert(false)}
            className="absolute right-2 top-2 rounded-full h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3 rounded-lg">
          <TabsTrigger value="profile" className="rounded-lg">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="account" className="rounded-lg">
            <LockIcon className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and profile picture</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileImageUrl} alt="User" />
                    <AvatarFallback>
                      {formData.first_name.charAt(0)}{formData.last_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    id="profile-picture"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button variant="outline" className="rounded-lg mt-2" asChild>
                    <label htmlFor="profile-picture">
                      Change Picture
                    </label>
                  </Button>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input 
                        id="first-name" 
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input 
                        id="last-name" 
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="flex-1" 
                      />
                      <Button
                        variant="outline"
                        className="whitespace-nowrap"
                        onClick={() => setIsVerified(!isVerified)}
                      >
                        {isVerified ? "Verified" : "Verify Email"}
                      </Button>
                    </div>
                    {!isVerified && (
                      <p className="text-xs text-amber-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" />
                        Please verify your email address
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself"
                  className="min-h-32"
                  value={formData.bio}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">
                  Brief description for your profile. URLs are hyperlinked.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="job-title">Job Title</Label>
                <Input 
                  id="job-title" 
                  name="jobtitle"
                  value={formData.jobtitle}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company / Organization</Label>
                <Input 
                  id="company" 
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="rounded-lg ml-auto" onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
              <CardDescription>Add information about your skills and experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1">
                      {skill}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 ml-1 p-0"
                        onClick={() => handleSkillRemove(skill)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </Badge>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add new skill"
                      className="h-7 w-32"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-full h-7"
                      onClick={handleAddSkill}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="github">GitHub Profile</Label>
                <Input
                  id="github"
                  name="github"
                  placeholder="https://github.com/username"
                  value={formData.github}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website / Portfolio</Label>
                <Input 
                  id="website" 
                  name="website"
                  placeholder="https://example.com" 
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="rounded-lg ml-auto" onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Details
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Manage your password and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input 
                  id="current-password" 
                  name="current_password"
                  type="password" 
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password" 
                    name="new_password"
                    type="password" 
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input 
                    id="confirm-password" 
                    name="confirm_password"
                    type="password" 
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Password Requirements:</p>
                <ul className="space-y-1 text-sm">
                  <li className={`flex items-center gap-2 ${passwordErrors.length ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {passwordErrors.length ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    <span>At least 8 characters</span>
                  </li>
                  <li className={`flex items-center gap-2 ${passwordErrors.number ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {passwordErrors.number ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    <span>At least one number</span>
                  </li>
                  <li className={`flex items-center gap-2 ${passwordErrors.uppercase ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {passwordErrors.uppercase ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    <span>At least one uppercase letter</span>
                  </li>
                  <li className={`flex items-center gap-2 ${passwordErrors.specialChar ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {passwordErrors.specialChar ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    <span>At least one special character</span>
                  </li>
                  <li className={`flex items-center gap-2 ${passwordErrors.match && passwordData.new_password ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {passwordErrors.match && passwordData.new_password ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    <span>Passwords match</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="rounded-lg" 
                onClick={handlePasswordUpdate}
                disabled={
                  isSaving || 
                  !passwordData.current_password || 
                  !passwordData.new_password || 
                  !passwordData.confirm_password ||
                  !passwordErrors.length ||
                  !passwordErrors.number ||
                  !passwordErrors.uppercase ||
                  !passwordErrors.match
                }
              >
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-muted-foreground">
                    Enhance your account security by requiring a verification code when signing in
                  </div>
                </div>
                <Switch />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Session Management</div>
                  <div className="text-sm text-muted-foreground">You're currently logged in on 2 devices</div>
                </div>
                <Button variant="outline">Manage Sessions</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-red-200 dark:border-red-900 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-red-500">Delete Account</h3>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button variant="destructive" className="rounded-lg">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Control how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Email Notifications</h3>

                {[
                  {
                    id: "error-assigned",
                    title: "Error Assigned",
                    description: "When an error is assigned to you",
                    defaultChecked: true,
                  },
                  {
                    id: "comment-added",
                    title: "Comments",
                    description: "When someone comments on your errors",
                    defaultChecked: true,
                  },
                  {
                    id: "solution-added",
                    title: "Solutions",
                    description: "When someone adds a solution to your errors",
                    defaultChecked: true,
                  },
                  {
                    id: "status-change",
                    title: "Status Changes",
                    description: "When an error's status changes",
                    defaultChecked: false,
                  },
                  {
                    id: "team-invite",
                    title: "Team Invitations",
                    description: "When you're invited to join a team",
                    defaultChecked: true,
                  },
                  {
                    id: "digest",
                    title: "Weekly Digest",
                    description: "Weekly summary of activity",
                    defaultChecked: false,
                  },
                ].map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor={notification.id} className="font-medium">
                        {notification.title}
                      </Label>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                    <Switch id={notification.id} defaultChecked={notification.defaultChecked} />
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">In-App Notifications</h3>

                {[
                  {
                    id: "in-app-mentions",
                    title: "Mentions",
                    description: "When someone mentions you in a comment",
                    defaultChecked: true,
                  },
                  {
                    id: "in-app-errors",
                    title: "Error Updates",
                    description: "Real-time updates on errors you're involved with",
                    defaultChecked: true,
                  },
                  {
                    id: "in-app-team",
                    title: "Team Activity",
                    description: "Activity in teams you belong to",
                    defaultChecked: true,
                  },
                ].map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor={notification.id} className="font-medium">
                        {notification.title}
                      </Label>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                    <Switch id={notification.id} defaultChecked={notification.defaultChecked} />
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="notification-frequency">Email Notification Frequency</Label>
                <Select defaultValue="instant">
                  <SelectTrigger id="notification-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instant</SelectItem>
                    <SelectItem value="hourly">Hourly Digest</SelectItem>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Digest</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  This setting affects how frequently email notifications are batched and sent.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="rounded-lg ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
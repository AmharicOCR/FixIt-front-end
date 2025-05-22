"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff, Shield, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate authentication - this would be replaced with actual authentication logic
    setTimeout(() => {
      setIsLoading(false)

      // For demo purposes, we'll redirect to an admin dashboard
      // In a real app, you would validate credentials and only redirect if valid
      window.location.href = "/admin"
      // console.log(getCookie('csrftoken'))
    }, 1500)
  }


  return (
    <div className="flex min-h-[100dvh] items-center justify-center p-4 bg-muted/30">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

      <Card className="mx-auto w-full max-w-md border-border/40 shadow-md overflow-hidden bg-gradient-to-b from-background to-muted/10 backdrop-blur">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="size-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
              <Shield className="size-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>Sign in to access the admin dashboard and system management.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input id="email" type="email" placeholder="admin@example.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/admin/forgot-password" className="text-xs text-primary underline underline-offset-2">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In to Admin"}
                {!isLoading && <ArrowRight className="ml-2 size-4" />}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center">
          <div className="text-sm text-muted-foreground">
            Not an admin?{" "}
            <Link href="/login" className="text-primary underline underline-offset-2">
              Regular user login
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">
            <Link href="/" className="text-primary underline underline-offset-2">
              Back to home
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

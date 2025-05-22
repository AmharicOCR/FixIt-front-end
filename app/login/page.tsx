"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff, Bug, Github, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setErrors({})

    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)
    
    const loginData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/user/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        credentials: 'include' // Include cookies if using session-based auth
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle different error response formats
        if (data.detail) {
          // If error is in 'detail' field (common in DRF)
          throw new Error(data.detail)
        } else if (data.message) {
          // If error is in 'message' field
          throw new Error(data.message)
        } else if (data.non_field_errors) {
          // If there are non-field errors
          throw new Error(data.non_field_errors.join(', '))
        } else if (typeof data === 'object') {
          // Handle field-specific errors
          const fieldErrors: Record<string, string> = {}
          Object.entries(data).forEach(([field, error]) => {
            if (Array.isArray(error)) {
              fieldErrors[field] = error.join(', ')
            } else if (typeof error === 'string') {
              fieldErrors[field] = error
            }
          })
          setErrors(fieldErrors)
          throw new Error('Please fix the errors below')
        } else {
          throw new Error('Login failed')
        }
      }

      // Login successful - redirect to dashboard
      window.location.href = "/dashboard/settings"
      // console.log(getCookie('csrftoken'))
      // console.log(document.cookie);
//       const csrfToken = Cookies.get();
// console.log('CSRF Token:', csrfToken);
// console.log(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setIsLoading(false)
    }
  }
    function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(';').shift();
}

  return (
    <div className="flex min-h-[100dvh] items-center justify-center p-4 bg-muted/30">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

      <Card className="mx-auto w-full max-w-md border-border/40 shadow-md overflow-hidden bg-gradient-to-b from-background to-muted/10 backdrop-blur">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="size-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
            <Link href = "/">
              <Bug className="size-6" />
            </Link>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to FixIt</CardTitle>
          <CardDescription>Sign in to your account to log and resolve code errors.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg">
              <div className="font-medium">There was a problem with your login:</div>
              <div className="mt-1">{error}</div>
              {Object.entries(errors).length > 0 && (
                <ul className="mt-2 list-disc list-inside">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-primary underline underline-offset-2">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password"
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    required 
                    className={errors.password ? 'border-red-500' : ''}
                  />
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
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>
              <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
                {!isLoading && <ArrowRight className="ml-2 size-4" />}
              </Button>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="mr-2 size-5">
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              <span>Google</span>
            </Button>
            <Button variant="outline" className="rounded-lg">
              <Github className="mr-2 size-5" />
              <span>GitHub</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center">
          <div className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary underline underline-offset-2">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { getCookie } from "@/utils/cookies";

// Form schema
const adminSignupSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  firstName: z.string().min(1, {
    message: "First name is required.",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required.",
  }),
  accountType: z.enum(["Free", "Premium"]),
  adminType: z.enum(["Super Admin", "Moderator"]),
});

type AdminSignupFormValues = z.infer<typeof adminSignupSchema>;

export default function AdminSignupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AdminSignupFormValues>({
    resolver: zodResolver(adminSignupSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      firstName: "",
      lastName: "",
      accountType: "Free",
      adminType: "Moderator",
    },
  });

  async function onSubmit(data: AdminSignupFormValues) {
    setIsSubmitting(true);
    setError(null);

    try {
      const csrftoken = getCookie('csrftoken');
      if (!csrftoken) {
        throw new Error("Super admin access token not found");
      }

      const response = await fetch("http://127.0.0.1:8000/user/create-admin/", {
        method: "POST",
        headers: {
            "X-CSRFToken": csrftoken,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          accountType: "Premium",
          admin_type: data.adminType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create admin account");
      }

      toast({
        title: "Admin account created successfully",
        description: `${data.username} has been registered as a ${data.adminType}`,
      });

      // Redirect to admin dashboard or refresh admin list
      router.push("/admin/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast({
        title: "Error creating admin account",
        description: error,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create Admin Account</h1>
          <p className="text-muted-foreground mt-2">
            Register a new admin user for the platform
          </p>
        </div>

        {error && (
          <div className="bg-destructive/15 p-4 rounded-md text-destructive">
            {error}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="admin_user01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Free">Free</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="adminType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select admin type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Super Admin">Super Admin</SelectItem>
                        <SelectItem value="Moderator">Moderator</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Admin Account"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
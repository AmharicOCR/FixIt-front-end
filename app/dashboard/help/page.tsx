"use client"

import Link from "next/link"
import { ArrowRight, FileQuestion, Headphones, LifeBuoy, MessageSquareText, PenLine, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">Get help with FixIt and learn how to use the platform</p>
      </div>

      <div className="bg-muted/50 border rounded-lg p-6">
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4 text-center">How can we help you?</h2>
          <div className="flex gap-2">
            <Input placeholder="Search documentation, FAQs, guides..." className="flex-1" />
            <Button className="rounded-lg">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground text-center mb-2">Popular searches:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary">Error logging</Badge>
              <Badge variant="secondary">Team management</Badge>
              <Badge variant="secondary">API integration</Badge>
              <Badge variant="secondary">Permissions</Badge>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="documentation" className="space-y-4">
        <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 rounded-lg">
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <FileQuestion className="h-5 w-5 text-primary" />
                Getting Started
              </CardTitle>
              <CardDescription>Learn the basics of using FixIt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">
                New to FixIt? Start here to learn the platform essentials and get up and running quickly.
              </p>
              <ul className="text-sm space-y-1 mt-4">
                <li className="text-primary hover:underline">
                  <Link href="#">Platform Overview</Link>
                </li>
                <li className="text-primary hover:underline">
                  <Link href="#">Creating Your First Error Report</Link>
                </li>
                <li className="text-primary hover:underline">
                  <Link href="#">Understanding Error States</Link>
                </li>
                <li className="text-primary hover:underline">
                  <Link href="#">Team Collaboration Basics</Link>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full justify-between" asChild>
                <Link href="#">
                  View all guides
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <PenLine className="h-5 w-5 text-primary" />
                Error Management
              </CardTitle>
              <CardDescription>Master error logging and resolution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">Learn how to effectively log, track, and resolve errors with best practices.</p>
              <ul className="text-sm space-y-1 mt-4">
                <li className="text-primary hover:underline">
                  <Link href="#">Error Logging Best Practices</Link>
                </li>
                <li className="text-primary hover:underline">
                  <Link href="#">Categorizing and Prioritizing Errors</Link>
                </li>
                <li className="text-primary hover:underline">
                  <Link href="#">Adding Detailed Debugging Information</Link>
                </li>
                <li className="text-primary hover:underline">
                  <Link href="#">Resolving and Tracking Solutions</Link>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full justify-between" asChild>
                <Link href="#">
                  View all guides
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MessageSquareText className="h-5 w-5 text-primary" />
                Team Collaboration
              </CardTitle>
              <CardDescription>Work effectively with your team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">Discover how to maximize team productivity and streamline collaboration.</p>
              <ul className="text-sm space-y-1 mt-4">
                <li className="text-primary hover:underline">
                  <Link href="#">Setting Up Teams and Roles</Link>
                </li>
                <li className="text-primary hover:underline">
                  <Link href="#">Assigning and Managing Errors</Link>
                </li>
                <li className="text-primary hover:underline">
                  <Link href="#">Real-time Collaboration Features</Link>
                </li>
                <li className="text-primary hover:underline">
                  <Link href="#">Team Performance Analytics</Link>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full justify-between" asChild>
                <Link href="#">
                  View all guides
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-primary" />
                Contact Support
              </CardTitle>
              <CardDescription>Get help from our support team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">Can't find what you're looking for? Our support team is here to help.</p>
              <div className="space-y-3">
                <Button className="w-full justify-start rounded-lg" asChild>
                  <Link href="#">
                    <MessageSquareText className="h-4 w-4 mr-2" />
                    Chat with Support
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start rounded-lg" asChild>
                  <Link href="mailto:support@fixit.com">
                    <LifeBuoy className="h-4 w-4 mr-2" />
                    Email Support
                  </Link>
                </Button>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              Support hours: Monday-Friday, 9am-5pm (UTC)
            </CardFooter>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <LifeBuoy className="h-5 w-5 text-primary" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    question: "How do I reset my password?",
                    answer:
                      "Go to the login page and click 'Forgot password?' to receive reset instructions via email.",
                  },
                  {
                    question: "Can I transfer errors between teams?",
                    answer: "Yes, you can reassign errors to different teams from the error details page.",
                  },
                  {
                    question: "How do I export error reports?",
                    answer:
                      "Use the export feature in the Reports section to download error data in CSV or PDF format.",
                  },
                ].map((faq, i) => (
                  <div key={i} className="space-y-1">
                    <h3 className="text-sm font-medium">{faq.question}</h3>
                    <p className="text-xs text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full justify-between" asChild>
                <Link href="#">
                  View all FAQs
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <FileQuestion className="h-5 w-5 text-primary" />
                Video Tutorials
              </CardTitle>
              <CardDescription>Learn through step-by-step videos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">Watch our tutorial videos to see FixIt in action and learn advanced features.</p>
              <ul className="text-sm space-y-1 mt-4">
                <li className="text-primary hover:underline">
                  <Link href="#">Getting Started with FixIt (5:20)</Link>
                </li>
                <li className="text-primary hover:underline">
                  <Link href="#">Advanced Error Tracking (8:45)</Link>
                </li>
                <li className="text-primary hover:underline">
                  <Link href="#">Team Collaboration Features (6:12)</Link>
                </li>
                <li className="text-primary hover:underline">
                  <Link href="#">Generating Custom Reports (7:30)</Link>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full justify-between" asChild>
                <Link href="#">
                  View all videos
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Tabs>
    </div>
  )
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Bug,
  CheckCircle2,
  Clock,
  Filter,
  HelpCircle,
  MoreHorizontal,
  PlusCircle,
  Search,
  Users,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { authenticated, username, accountType, loading } = useAuth();
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Track, manage and resolve your code errors.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-lg">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button className="rounded-lg" asChild>
            <Link href="/dashboard/new-error">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Error
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Errors",
            value: "128",
            icon: Bug,
            color: "bg-blue-500/20",
            textColor: "text-blue-500",
          },
          {
            title: "Resolved",
            value: "86",
            icon: CheckCircle2,
            color: "bg-green-500/20",
            textColor: "text-green-500",
          },
          {
            title: "Pending",
            value: "42",
            icon: Clock,
            color: "bg-amber-500/20",
            textColor: "text-amber-500",
          },
          {
            title: "Critical",
            value: "7",
            icon: AlertCircle,
            color: "bg-red-500/20",
            textColor: "text-red-500",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full overflow-hidden border-border/40 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div
                  className={`flex items-center justify-center rounded-full ${item.color} h-12 w-12`}
                >
                  <item.icon className={`h-6 w-6 ${item.textColor}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.title}
                  </p>
                  <h3 className="text-2xl font-bold">{item.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs
        defaultValue="overview"
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        {!loading && authenticated && (
          <TabsList
            className={`grid w-full max-w-lg rounded-lg ${
              accountType === "premium" ? "grid-cols-3" : "grid-cols-2"
            }`}
          >
            <TabsTrigger value="overview" className="rounded-lg">
              Overview
            </TabsTrigger>
            <TabsTrigger value="recent-errors" className="rounded-lg">
              Recent Errors
            </TabsTrigger>
            {accountType === "premium" && (
              <TabsTrigger value="assigned-to-me">Assigned to Me</TabsTrigger>
            )}
          </TabsList>
        )}

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Activity Chart */}
            <Card className="col-span-4 border-border/40 shadow-sm h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  Error Activity
                </CardTitle>
                <Select defaultValue="thisWeek">
                  <SelectTrigger className="w-[160px] text-xs h-8">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="thisWeek">This Week</SelectItem>
                    <SelectItem value="thisMonth">This Month</SelectItem>
                    <SelectItem value="last3Months">Last 3 Months</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-end gap-2">
                  {[40, 25, 60, 42, 38, 65, 55].map((height, index) => (
                    <div
                      key={index}
                      // Add h-full here
                      className="flex-1 space-y-2 flex flex-col items-center justify-end h-full"
                    >
                      <div
                        className="w-full rounded-md bg-primary/80 transition-all hover:bg-primary relative group"
                        style={{ height: `${height}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          {index === 0 && "Mon"}
                          {index === 1 && "Tue"}
                          {index === 2 && "Wed"}
                          {index === 3 && "Thu"}
                          {index === 4 && "Fri"}
                          {index === 5 && "Sat"}
                          {index === 6 && "Sun"}:{" "}
                          {Math.floor((height / 100) * 20)} errors
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {index === 0 && "M"}
                        {index === 1 && "T"}
                        {index === 2 && "W"}
                        {index === 3 && "T"}
                        {index === 4 && "F"}
                        {index === 5 && "S"}
                        {index === 6 && "S"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Error Categories */}
            <Card className="col-span-3 border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Error Categories
                </CardTitle>
                <CardDescription>
                  Distribution of errors by category
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {[
                    {
                      category: "Syntax Errors",
                      percentage: 32,
                      color: "bg-blue-500",
                    },
                    {
                      category: "Runtime Exceptions",
                      percentage: 28,
                      color: "bg-purple-500",
                    },
                    {
                      category: "Network Issues",
                      percentage: 20,
                      color: "bg-green-500",
                    },
                    {
                      category: "Database Errors",
                      percentage: 12,
                      color: "bg-yellow-500",
                    },
                    { category: "Other", percentage: 8, color: "bg-gray-500" },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.category}</span>
                        <span className="font-medium">{item.percentage}%</span>
                      </div>
                      <Progress
                        value={item.percentage}
                        className={item.color}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Popular Solutions */}
            <Card className="border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Popular Solutions
                </CardTitle>
                <CardDescription>
                  Most upvoted solutions this month
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6">
                <div className="space-y-4">
                  {[
                    {
                      title: "React useEffect cleanup",
                      upvotes: 42,
                      user: "Sarah K.",
                    },
                    {
                      title: "NextJS API route handling",
                      upvotes: 38,
                      user: "Mike L.",
                    },
                    {
                      title: "PostgreSQL connection pooling",
                      upvotes: 31,
                      user: "Aisha J.",
                    },
                  ].map((solution, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {solution.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            by {solution.user}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-auto">
                        ↑ {solution.upvotes}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center"
                  asChild
                >
                  <Link href="/dashboard/solutions">
                    View all solutions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Team Activity */}
            <Card className="border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Team Activity
                </CardTitle>
                <CardDescription>
                  Recent activity from your team
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6">
                <div className="space-y-4">
                  {[
                    {
                      action: "resolved an error",
                      errorTitle: "Authentication Middleware Issue",
                      user: {
                        name: "John A.",
                        avatar: "/placeholder.svg",
                        initials: "JA",
                      },
                      time: "10 minutes ago",
                    },
                    {
                      action: "commented on",
                      errorTitle: "Database Connection Timeout",
                      user: {
                        name: "Netsanet A.",
                        avatar: "/placeholder.svg",
                        initials: "NA",
                      },
                      time: "1 hour ago",
                    },
                    {
                      action: "logged a new error",
                      errorTitle: "CSS Animation Performance Bug",
                      user: {
                        name: "Abiy S.",
                        avatar: "/placeholder.svg",
                        initials: "AS",
                      },
                      time: "3 hours ago",
                    },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-start space-x-4 py-2">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={activity.user.avatar || "/placeholder.svg"}
                          alt={activity.user.name}
                        />
                        <AvatarFallback>
                          {activity.user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1 flex-1">
                        <p className="text-sm">
                          <span className="font-medium">
                            {activity.user.name}
                          </span>{" "}
                          {activity.action}{" "}
                          <Link
                            href="#"
                            className="text-primary hover:underline font-medium"
                          >
                            {activity.errorTitle}
                          </Link>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center"
                  asChild
                >
                  <Link href="/dashboard/activity">
                    View all activity
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Quick Actions & Resources */}
            <Card className="border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Quick Actions
                </CardTitle>
                <CardDescription>Frequently used features</CardDescription>
              </CardHeader>
              <CardContent className="px-6">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto justify-start gap-2 p-3 text-sm rounded-lg"
                    asChild
                  >
                    <Link href="/dashboard/new-error">
                      <PlusCircle className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <div className="font-medium">Log Error</div>
                        <div className="text-xs font-normal text-muted-foreground">
                          Report a new issue
                        </div>
                      </div>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto justify-start gap-2 p-3 text-sm rounded-lg"
                    asChild
                  >
                    <Link href="/dashboard/search">
                      <Search className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <div className="font-medium">Search</div>
                        <div className="text-xs font-normal text-muted-foreground">
                          Find solutions
                        </div>
                      </div>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto justify-start gap-2 p-3 text-sm rounded-lg"
                    asChild
                  >
                    <Link href="/dashboard/teams">
                      <Users className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <div className="font-medium">My Team</div>
                        <div className="text-xs font-normal text-muted-foreground">
                          Team workspace
                        </div>
                      </div>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto justify-start gap-2 p-3 text-sm rounded-lg"
                    asChild
                  >
                    <Link href="/dashboard/help">
                      <HelpCircle className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <div className="font-medium">Get Help</div>
                        <div className="text-xs font-normal text-muted-foreground">
                          Support resources
                        </div>
                      </div>
                    </Link>
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center"
                  asChild
                >
                  <Link href="/dashboard/documentation">
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Documentation
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent-errors" className="space-y-4">
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="px-6 py-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">
                  Recently Logged Errors
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-md"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {[
                  {
                    title: "TypeError in React useEffect Hook",
                    description:
                      "Cannot read property 'data' of undefined in useEffect dependency array",
                    category: "React",
                    priority: "High",
                    status: "Open",
                    reportedBy: {
                      name: "John Assefa",
                      avatar: "/placeholder.svg",
                      initials: "JA",
                    },
                    reportedAt: "2 hours ago",
                  },
                  {
                    title: "Database Connection Pool Exhausted",
                    description:
                      "PostgreSQL connection pool is being exhausted during peak traffic",
                    category: "Database",
                    priority: "Critical",
                    status: "In Progress",
                    reportedBy: {
                      name: "Netsanet Alemu",
                      avatar: "/placeholder.svg",
                      initials: "NA",
                    },
                    reportedAt: "5 hours ago",
                  },
                  {
                    title: "CSS Grid Layout Overflow on Mobile",
                    description:
                      "Grid layout causes horizontal overflow on mobile devices",
                    category: "CSS",
                    priority: "Medium",
                    status: "Open",
                    reportedBy: {
                      name: "Abiy Shiferaw",
                      avatar: "/placeholder.svg",
                      initials: "AS",
                    },
                    reportedAt: "Yesterday",
                  },
                  {
                    title: "JWT Authentication Failure",
                    description:
                      "Token validation fails intermittently in production environment",
                    category: "Authentication",
                    priority: "High",
                    status: "Resolved",
                    reportedBy: {
                      name: "John Assefa",
                      avatar: "/placeholder.svg",
                      initials: "JA",
                    },
                    reportedAt: "2 days ago",
                  },
                  {
                    title: "Memory Leak in Service Worker",
                    description:
                      "Service worker is causing memory leaks after multiple refreshes",
                    category: "Performance",
                    priority: "Medium",
                    status: "In Progress",
                    reportedBy: {
                      name: "Abiy Shiferaw",
                      avatar: "/placeholder.svg",
                      initials: "AS",
                    },
                    reportedAt: "3 days ago",
                  },
                ].map((error, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-muted/50 cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full 
                          ${
                            error.priority === "Critical"
                              ? "bg-red-500/20 text-red-500"
                              : error.priority === "High"
                              ? "bg-amber-500/20 text-amber-500"
                              : "bg-blue-500/20 text-blue-500"
                          }`}
                        >
                          <Bug className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{error.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {error.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2 sm:mt-0 ml-0 sm:ml-4">
                        <Badge
                          variant="secondary"
                          className="text-xs rounded-full"
                        >
                          {error.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs rounded-full ${
                            error.status === "Open"
                              ? "border-amber-500 text-amber-500"
                              : error.status === "In Progress"
                              ? "border-blue-500 text-blue-500"
                              : "border-green-500 text-green-500"
                          }`}
                        >
                          {error.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs rounded-full ${
                            error.priority === "Critical"
                              ? "border-red-500 text-red-500"
                              : error.priority === "High"
                              ? "border-amber-500 text-amber-500"
                              : "border-blue-500 text-blue-500"
                          }`}
                        >
                          {error.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-14 sm:ml-0 mt-2 sm:mt-0">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage
                            src={error.reportedBy.avatar || "/placeholder.svg"}
                            alt={error.reportedBy.name}
                          />
                          <AvatarFallback>
                            {error.reportedBy.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="sr-only sm:not-sr-only">
                          {error.reportedAt}
                        </span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Assign to me</DropdownMenuItem>
                          <DropdownMenuItem>Mark as resolved</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center"
                asChild
              >
                <Link href="/dashboard/errors">
                  View all errors
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="assigned-to-me" className="space-y-4">
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="px-6 py-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">
                  Errors Assigned to Me
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {[
                  {
                    title: "API Rate Limiting Issue",
                    description:
                      "Third-party API rate limiting causing intermittent failures",
                    category: "API",
                    priority: "High",
                    status: "In Progress",
                    assignedBy: {
                      name: "Netsanet Alemu",
                      avatar: "/placeholder.svg",
                      initials: "NA",
                    },
                    assignedAt: "Yesterday",
                  },
                  {
                    title: "Redux State Management Bug",
                    description:
                      "State not updating correctly after async action completion",
                    category: "React",
                    priority: "Medium",
                    status: "Open",
                    assignedBy: {
                      name: "Abiy Shiferaw",
                      avatar: "/placeholder.svg",
                      initials: "AS",
                    },
                    assignedAt: "2 days ago",
                  },
                  {
                    title: "Webpack Build Optimization",
                    description:
                      "Build times are excessive and bundle size needs optimization",
                    category: "Performance",
                    priority: "Low",
                    status: "Open",
                    assignedBy: {
                      name: "John Assefa",
                      avatar: "/placeholder.svg",
                      initials: "JA",
                    },
                    assignedAt: "3 days ago",
                  },
                ].map((error, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-muted/50 cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full 
                          ${
                            error.priority === "Critical"
                              ? "bg-red-500/20 text-red-500"
                              : error.priority === "High"
                              ? "bg-amber-500/20 text-amber-500"
                              : error.priority === "Medium"
                              ? "bg-blue-500/20 text-blue-500"
                              : "bg-green-500/20 text-green-500"
                          }`}
                        >
                          <Bug className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{error.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {error.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2 sm:mt-0 ml-0 sm:ml-4">
                        <Badge
                          variant="secondary"
                          className="text-xs rounded-full"
                        >
                          {error.category}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs rounded-full ${
                            error.status === "Open"
                              ? "border-amber-500 text-amber-500"
                              : error.status === "In Progress"
                              ? "border-blue-500 text-blue-500"
                              : "border-green-500 text-green-500"
                          }`}
                        >
                          {error.status}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs rounded-full ${
                            error.priority === "Critical"
                              ? "border-red-500 text-red-500"
                              : error.priority === "High"
                              ? "border-amber-500 text-amber-500"
                              : error.priority === "Medium"
                              ? "border-blue-500 text-blue-500"
                              : "border-green-500 text-green-500"
                          }`}
                        >
                          {error.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-14 sm:ml-0 mt-2 sm:mt-0">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage
                            src={error.assignedBy.avatar || "/placeholder.svg"}
                            alt={error.assignedBy.name}
                          />
                          <AvatarFallback>
                            {error.assignedBy.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="sr-only sm:not-sr-only">
                          Assigned {error.assignedAt}
                        </span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Update status</DropdownMenuItem>
                          <DropdownMenuItem>Add solution</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center"
                asChild
              >
                <Link href="/dashboard/assigned">
                  View all assigned errors
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

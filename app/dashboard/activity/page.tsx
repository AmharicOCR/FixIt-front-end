"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bug,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  MessageSquare,
  ThumbsUp,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth"

export default function ActivityPage() {
  const [dateRange, setDateRange] = useState("7days");
  const [activityType, setActivityType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const { authenticated, username, accountType, loading } = useAuth();

  // Mock activity data
  const activities = [
    {
      id: "1",
      type: "error_created",
      user: {
        name: "John Assefa",
        avatar: "/placeholder.svg",
        initials: "JA",
      },
      timestamp: "2023-05-18T10:30:00Z",
      error: {
        id: "err-001",
        title: "TypeError in React useEffect Hook",
        status: "Open",
      },
    },
    {
      id: "2",
      type: "comment_added",
      user: {
        name: "Netsanet Alemu",
        avatar: "/placeholder.svg",
        initials: "NA",
      },
      timestamp: "2023-05-18T11:45:00Z",
      error: {
        id: "err-001",
        title: "TypeError in React useEffect Hook",
        status: "Open",
      },
      comment:
        "I've seen this issue before. It's likely because you're trying to access the data before the API response is complete.",
    },
    {
      id: "3",
      type: "error_assigned",
      user: {
        name: "John Assefa",
        avatar: "/placeholder.svg",
        initials: "JA",
      },
      assignee: {
        name: "Abiy Shiferaw",
        avatar: "/placeholder.svg",
        initials: "AS",
      },
      timestamp: "2023-05-18T12:30:00Z",
      error: {
        id: "err-001",
        title: "TypeError in React useEffect Hook",
        status: "Open",
      },
    },
    {
      id: "4",
      type: "status_changed",
      user: {
        name: "Abiy Shiferaw",
        avatar: "/placeholder.svg",
        initials: "AS",
      },
      timestamp: "2023-05-18T14:10:00Z",
      error: {
        id: "err-001",
        title: "TypeError in React useEffect Hook",
        status: "In Progress",
      },
      oldStatus: "Open",
      newStatus: "In Progress",
    },
    {
      id: "5",
      type: "solution_added",
      user: {
        name: "Abiy Shiferaw",
        avatar: "/placeholder.svg",
        initials: "AS",
      },
      timestamp: "2023-05-19T09:15:00Z",
      error: {
        id: "err-001",
        title: "TypeError in React useEffect Hook",
        status: "In Progress",
      },
      solution: {
        title: "Add conditional check in useEffect",
      },
    },
    {
      id: "6",
      type: "error_created",
      user: {
        name: "Netsanet Alemu",
        avatar: "/placeholder.svg",
        initials: "NA",
      },
      timestamp: "2023-05-19T13:20:00Z",
      error: {
        id: "err-002",
        title: "Database Connection Pool Exhausted",
        status: "Open",
      },
    },
    {
      id: "7",
      type: "solution_upvoted",
      user: {
        name: "John Assefa",
        avatar: "/placeholder.svg",
        initials: "JA",
      },
      timestamp: "2023-05-19T15:45:00Z",
      error: {
        id: "err-001",
        title: "TypeError in React useEffect Hook",
        status: "In Progress",
      },
      solution: {
        title: "Add conditional check in useEffect",
        author: {
          name: "Abiy Shiferaw",
        },
      },
    },
    {
      id: "8",
      type: "team_joined",
      user: {
        name: "Netsanet Alemu",
        avatar: "/placeholder.svg",
        initials: "NA",
      },
      timestamp: "2023-05-20T09:30:00Z",
      team: {
        name: "Frontend Team",
      },
    },
    {
      id: "9",
      type: "status_changed",
      user: {
        name: "Abiy Shiferaw",
        avatar: "/placeholder.svg",
        initials: "AS",
      },
      timestamp: "2023-05-20T11:20:00Z",
      error: {
        id: "err-001",
        title: "TypeError in React useEffect Hook",
        status: "Resolved",
      },
      oldStatus: "In Progress",
      newStatus: "Resolved",
    },
    {
      id: "10",
      type: "error_assigned",
      user: {
        name: "John Assefa",
        avatar: "/placeholder.svg",
        initials: "JA",
      },
      assignee: {
        name: "Netsanet Alemu",
        avatar: "/placeholder.svg",
        initials: "NA",
      },
      timestamp: "2023-05-20T14:15:00Z",
      error: {
        id: "err-002",
        title: "Database Connection Pool Exhausted",
        status: "Open",
      },
    },
  ];

  // Filter activities based on selected filters
  const filteredActivities = activities.filter((activity) => {
    if (activityType !== "all" && !activity.type.includes(activityType)) {
      return false;
    }

    // Date filtering would be implemented here in a real app
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityIcon = (type: string) => {
    switch (true) {
      case type.includes("error_created"):
        return <Bug className="h-5 w-5 text-primary" />;
      case type.includes("comment"):
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case type.includes("solution"):
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case type.includes("status"):
        return <Clock className="h-5 w-5 text-amber-500" />;
      case type.includes("assigned"):
        return <User className="h-5 w-5 text-purple-500" />;
      case type.includes("team"):
        return <Users className="h-5 w-5 text-indigo-500" />;
      case type.includes("upvoted"):
        return <ThumbsUp className="h-5 w-5 text-pink-500" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityDescription = (activity: any) => {
    switch (activity.type) {
      case "error_created":
        return (
          <>
            <span className="font-medium">{activity.user.name}</span> created a
            new error{" "}
            <Link
              href={`/dashboard/error-details/${activity.error.id}`}
              className="font-medium text-primary hover:underline"
            >
              {activity.error.title}
            </Link>
          </>
        );
      case "comment_added":
        return (
          <>
            <span className="font-medium">{activity.user.name}</span> commented
            on{" "}
            <Link
              href={`/dashboard/error-details/${activity.error.id}`}
              className="font-medium text-primary hover:underline"
            >
              {activity.error.title}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              "{activity.comment.substring(0, 100)}..."
            </p>
          </>
        );
      case "error_assigned":
        return (
          <>
            <span className="font-medium">{activity.user.name}</span> assigned{" "}
            <Link
              href={`/dashboard/error-details/${activity.error.id}`}
              className="font-medium text-primary hover:underline"
            >
              {activity.error.title}
            </Link>{" "}
            to <span className="font-medium">{activity.assignee.name}</span>
          </>
        );
      case "status_changed":
        return (
          <>
            <span className="font-medium">{activity.user.name}</span> changed
            the status of{" "}
            <Link
              href={`/dashboard/error-details/${activity.error.id}`}
              className="font-medium text-primary hover:underline"
            >
              {activity.error.title}
            </Link>{" "}
            from{" "}
            <Badge variant="outline" className="text-xs font-normal">
              {activity.oldStatus}
            </Badge>{" "}
            to{" "}
            <Badge variant="outline" className="text-xs font-normal">
              {activity.newStatus}
            </Badge>
          </>
        );
      case "solution_added":
        return (
          <>
            <span className="font-medium">{activity.user.name}</span> proposed a
            solution for{" "}
            <Link
              href={`/dashboard/error-details/${activity.error.id}`}
              className="font-medium text-primary hover:underline"
            >
              {activity.error.title}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              Solution: {activity.solution.title}
            </p>
          </>
        );
      case "solution_upvoted":
        return (
          <>
            <span className="font-medium">{activity.user.name}</span> upvoted a
            solution by{" "}
            <span className="font-medium">{activity.solution.author.name}</span>{" "}
            for{" "}
            <Link
              href={`/dashboard/error-details/${activity.error.id}`}
              className="font-medium text-primary hover:underline"
            >
              {activity.error.title}
            </Link>
          </>
        );
      case "team_joined":
        return (
          <>
            <span className="font-medium">{activity.user.name}</span> joined the
            team <span className="font-medium">{activity.team.name}</span>
          </>
        );
      default:
        return <span>Unknown activity</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
          <p className="text-muted-foreground">
            Track all activity across your errors and teams
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 md:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className={`md:block ${showFilters ? "block" : "hidden"}`}>
          <Card className="border-border/40 shadow-sm sticky top-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">
                Filter Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="activity-type">Activity Type</Label>
                <Select value={activityType} onValueChange={setActivityType}>
                  <SelectTrigger id="activity-type">
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="error">Errors</SelectItem>
                    <SelectItem value="comment">Comments</SelectItem>
                    <SelectItem value="solution">Solutions</SelectItem>
                    <SelectItem value="status">Status Changes</SelectItem>
                    <SelectItem value="assigned">Assignments</SelectItem>
                    <SelectItem value="team">Team Activities</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Filter by User</Label>
                <div className="space-y-2">
                  {["John Assefa", "Netsanet Alemu", "Abiy Shiferaw"].map(
                    (user) => (
                      <div key={user} className="flex items-center space-x-2">
                        <Checkbox
                          id={`user-${user.replace(" ", "-").toLowerCase()}`}
                        />
                        <Label
                          htmlFor={`user-${user
                            .replace(" ", "-")
                            .toLowerCase()}`}
                          className="text-sm font-normal"
                        >
                          {user}
                        </Label>
                      </div>
                    )
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Filter by Team</Label>
                <div className="space-y-2">
                  {["Frontend Team", "Backend Team", "DevOps Team"].map(
                    (team) => (
                      <div key={team} className="flex items-center space-x-2">
                        <Checkbox
                          id={`team-${team.replace(" ", "-").toLowerCase()}`}
                        />
                        <Label
                          htmlFor={`team-${team
                            .replace(" ", "-")
                            .toLowerCase()}`}
                          className="text-sm font-normal"
                        >
                          {team}
                        </Label>
                      </div>
                    )
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Search</Label>
                <Input type="search" placeholder="Search activities..." />
              </div>

              <div className="pt-2">
                <Button className="w-full">Apply Filters</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Feed */}
        <div className="md:col-span-3 space-y-4">
          <Tabs defaultValue="all" className="w-full">
            {!loading && authenticated && (
              <TabsList
                className={`grid w-full rounded-lg ${
                  accountType === "premium" ? "grid-cols-4" : "grid-cols-3"
                }`}
              >
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="errors">Errors</TabsTrigger>
                <TabsTrigger value="solutions">Solutions</TabsTrigger>
                {accountType === "premium" && (
                  <TabsTrigger value="team">Team</TabsTrigger>
                )}
              </TabsList>
            )}
            <TabsContent value="all" className="mt-4">
              <Card className="border-border/40 shadow-sm">
                <CardContent className="p-0">
                  <div className="divide-y">
                    {filteredActivities.length > 0 ? (
                      filteredActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex gap-4 p-4 hover:bg-muted/50"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="text-sm">
                              {getActivityDescription(activity)}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <time dateTime={activity.timestamp}>
                                {formatDate(activity.timestamp)}
                              </time>
                            </div>
                          </div>
                          <div className="shrink-0">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={activity.user.avatar || "/placeholder.svg"}
                                alt={activity.user.name}
                              />
                              <AvatarFallback>
                                {activity.user.initials}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          No activities found
                        </h3>
                        <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                          There are no activities matching your current filters.
                          Try adjusting your filters or date range.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="errors" className="mt-4">
              <Card className="border-border/40 shadow-sm">
                <CardContent className="p-0">
                  <div className="divide-y">
                    {filteredActivities
                      .filter(
                        (activity) =>
                          activity.type.includes("error") ||
                          activity.type.includes("status")
                      )
                      .map((activity) => (
                        <div
                          key={activity.id}
                          className="flex gap-4 p-4 hover:bg-muted/50"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="text-sm">
                              {getActivityDescription(activity)}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <time dateTime={activity.timestamp}>
                                {formatDate(activity.timestamp)}
                              </time>
                            </div>
                          </div>
                          <div className="shrink-0">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={activity.user.avatar || "/placeholder.svg"}
                                alt={activity.user.name}
                              />
                              <AvatarFallback>
                                {activity.user.initials}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="solutions" className="mt-4">
              <Card className="border-border/40 shadow-sm">
                <CardContent className="p-0">
                  <div className="divide-y">
                    {filteredActivities
                      .filter((activity) => activity.type.includes("solution"))
                      .map((activity) => (
                        <div
                          key={activity.id}
                          className="flex gap-4 p-4 hover:bg-muted/50"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="text-sm">
                              {getActivityDescription(activity)}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <time dateTime={activity.timestamp}>
                                {formatDate(activity.timestamp)}
                              </time>
                            </div>
                          </div>
                          <div className="shrink-0">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={activity.user.avatar || "/placeholder.svg"}
                                alt={activity.user.name}
                              />
                              <AvatarFallback>
                                {activity.user.initials}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="team" className="mt-4">
              <Card className="border-border/40 shadow-sm">
                <CardContent className="p-0">
                  <div className="divide-y">
                    {filteredActivities
                      .filter(
                        (activity) =>
                          activity.type.includes("team") ||
                          activity.type.includes("assigned")
                      )
                      .map((activity) => (
                        <div
                          key={activity.id}
                          className="flex gap-4 p-4 hover:bg-muted/50"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="text-sm">
                              {getActivityDescription(activity)}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <time dateTime={activity.timestamp}>
                                {formatDate(activity.timestamp)}
                              </time>
                            </div>
                          </div>
                          <div className="shrink-0">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={activity.user.avatar || "/placeholder.svg"}
                                alt={activity.user.name}
                              />
                              <AvatarFallback>
                                {activity.user.initials}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

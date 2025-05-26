"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bug, Filter, MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { getCookie } from "@/utils/cookies";

interface ErrorItem {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  assigned_by?: {
    name: string;
    avatar?: string;
    initials: string;
  };
}

export default function MyErrorsPage() {
  const [activeTab, setActiveTab] = useState("created");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [createdErrors, setCreatedErrors] = useState<ErrorItem[]>([]);
  const [assignedErrors, setAssignedErrors] = useState<ErrorItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { authenticated, username, accountType, loading: authLoading } = useAuth();

  const csrfToken = getCookie("csrftoken");

  useEffect(() => {
    const fetchErrors = async () => {
      if (!authenticated || !csrfToken) return;

      try {
        const response = await fetch("http://127.0.0.1:8000/bugtracker/my-errors/", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch errors");
        }

        const data = await response.json();
        console.log(data)
        setCreatedErrors(data || []);
        setAssignedErrors(data || []);
      } catch (error) {
        console.error("Error fetching errors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchErrors();
  }, [authenticated, csrfToken]);

  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Filter errors based on current filters
  const filterErrors = (errors: ErrorItem[]) => {
    return errors.filter((error) => {
      if (statusFilter !== "all" && error.status !== statusFilter) return false;
      if (priorityFilter !== "all" && error.priority !== priorityFilter) return false;
      return true;
    });
  };

  // Get filtered error lists
  const filteredCreatedErrors = filterErrors(createdErrors);
  const filteredAssignedErrors = filterErrors(assignedErrors);

  // Get active errors list based on current tab
  const activeErrors = activeTab === "created" ? filteredCreatedErrors : filteredAssignedErrors;

  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p>Loading your errors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Errors</h1>
          <p className="text-muted-foreground">
            View errors you've created or that are assigned to you
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

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Tabs
            defaultValue="created"
            className="w-full sm:w-auto"
            onValueChange={setActiveTab}
          >
            {authenticated && accountType === "premium" && (
              <TabsList className="grid w-full grid-cols-2 sm:w-[400px]">
                <TabsTrigger value="created">Created By Me</TabsTrigger>
                <TabsTrigger value="assigned">Assigned To Me</TabsTrigger>
              </TabsList>
            )}
          </Tabs>

          <div className="flex flex-wrap gap-2">
            <Select defaultValue="all" onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all" onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="border-border/40 shadow-sm">
          <CardHeader className="px-6 py-5">
            <CardTitle className="text-base font-medium">
              {activeTab === "created"
                ? "Errors Created By Me"
                : "Errors Assigned To Me"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {activeErrors.length > 0 ? (
              <div className="divide-y">
                {activeErrors.map((error) => (
                  <div
                    key={error.id}
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
                          <Link
                            href={`/dashboard/error-details/${error.id}`}
                            className="font-medium text-sm hover:underline"
                          >
                            {error.title}
                          </Link>
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
                        {activeTab === "assigned" && error.assigned_by && (
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage
                              src={error.assigned_by.avatar || "/placeholder.svg"}
                              alt={error.assigned_by.name}
                            />
                            <AvatarFallback>
                              {error.assigned_by.initials}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <span className="sr-only sm:not-sr-only">
                          {activeTab === "created"
                            ? formatRelativeTime(error.created_at)
                            : error.assigned_by && `Assigned ${formatRelativeTime(error.created_at)}`}
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
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/error-details/${error.id}`}>
                              View details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Update status</DropdownMenuItem>
                          <DropdownMenuItem>Add solution</DropdownMenuItem>
                          {authenticated && accountType === "premium" && activeTab === "created" && (
                            <DropdownMenuItem>
                              Assign to someone
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Bug className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No errors found</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                  {activeTab === "created"
                    ? "You haven't created any errors that match the current filters."
                    : "You don't have any errors assigned to you that match the current filters."}
                </p>
                <Button asChild>
                  <Link href="/dashboard/new-error">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Log New Error
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
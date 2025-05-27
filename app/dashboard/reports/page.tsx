"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  ChevronDown,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "./date-range-picker";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { getCookie } from "@/utils/cookies";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("7days");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { authenticated, username, accountType, loading } = useAuth();
  type WeeklyError = { day: string; errors: number; height: number };

  const [weeklyErrors, setWeeklyErrors] = useState<WeeklyError[]>([
    { day: "Monday", errors: 0, height: 0 },
    { day: "Tuesday", errors: 0, height: 0 },
    { day: "Wednesday", errors: 0, height: 0 },
    { day: "Thursday", errors: 0, height: 0 },
    { day: "Friday", errors: 0, height: 0 },
    { day: "Saturday", errors: 0, height: 0 },
    { day: "Sunday", errors: 0, height: 0 },
  ]);
  const [stats, setStats] = useState({
    totalErrors: 0,
    resolvedRate: 0,
    avgResolutionTime: 0,
    criticalErrors: 0,
  });

  // Calculate proportional heights for the error activity graph
  const calculateBarHeights = (data: { day: string; errors: number }[]) => {
    const maxValue = Math.max(...data.map(item => item.errors), 1); // Ensure at least 1 to avoid division by zero
    return data.map(item => ({
      ...item,
      height: Math.min((item.errors / maxValue) * 100, 100) // Cap at 100%
    }));
  };

  const fetchWeeklyErrors = async () => {
    try {
      const csrftoken = getCookie('csrftoken');
      if (!csrftoken) {
        throw new Error("CSRF token not found");
      }

      const response = await fetch("http://127.0.0.1:8000/bugtracker/weekly-errors/", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch weekly errors");
      }

      const data = await response.json();
      
      // Transform the API data to match our format
      const transformedData = [
        { day: "Monday", errors: data[0].monday.errors },
        { day: "Tuesday", errors: data[1].tuesday.errors },
        { day: "Wednesday", errors: data[2].wednesday.errors },
        { day: "Thursday", errors: data[3].thursday.errors },
        { day: "Friday", errors: data[4].friday.errors },
        { day: "Saturday", errors: data[5].saturday.errors },
        { day: "Sunday", errors: data[6].sunday.errors },
      ];

      // Calculate proportional heights
      const dataWithHeights = calculateBarHeights(transformedData);
      setWeeklyErrors(dataWithHeights);

      // Calculate stats based on weekly errors
      const total = transformedData.reduce((sum, day) => sum + day.errors, 0);
      const resolved = Math.floor(total * 0.67); // Assuming 67% resolution rate
      const avgTime = total > 0 ? (2.4 * (total / 7)).toFixed(1) : "0";
      const critical = Math.floor(total * 0.05); // Assuming 5% are critical

      setStats({
        totalErrors: total,
        resolvedRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
        avgResolutionTime: parseFloat(avgTime),
        criticalErrors: critical,
      });

    } catch (error) {
      console.error("Error fetching weekly errors:", error);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchWeeklyErrors();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    fetchWeeklyErrors();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Analyze error data and track team performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="rounded-lg"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
          <Button variant="outline" className="rounded-lg">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Tabs
          defaultValue="overview"
          className="w-full sm:w-auto"
          onValueChange={setActiveTab}
        >
          <TabsList className={`grid w-full sm:w-[500px] ${
                  accountType === "Premium" ? "grid-cols-3" : "grid-cols-2"
                }`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {
              authenticated &&
              accountType === "Premium" &&
              (
                <TabsTrigger value="team">Team Performance</TabsTrigger>
              )}
            <TabsTrigger value="errors">Error Analysis</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] h-9">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              {/* <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem> */}
            </SelectContent>
          </Select>

          {timeRange === "custom" && (
            <DatePickerWithRange className="w-[280px]" />
          )}
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Total Errors",
                value: stats.totalErrors,
                change: "+12%",
                direction: "up",
              },
              {
                title: "Resolved Rate",
                value: `${stats.resolvedRate}%`,
                change: "+5%",
                direction: "up",
              },
              {
                title: "Avg. Resolution Time",
                value: `${stats.avgResolutionTime} days`,
                change: "-8%",
                direction: "down",
              },
              {
                title: "Critical Errors",
                value: stats.criticalErrors,
                change: "+2",
                direction: "up",
              },
            ].map((stat, i) => (
              <Card key={i} className="border-border/40 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                      <Badge
                        variant={
                          stat.direction === "down" ? "outline" : "secondary"
                        }
                        className={`text-xs ${
                          stat.direction === "up"
                            ? stat.title === "Critical Errors"
                              ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                      >
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-border/40 shadow-sm overflow-hidden">
            <CardHeader>
              <CardTitle>Error Activity</CardTitle>
              <CardDescription>
                Number of errors logged over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end gap-2">
                {weeklyErrors.map((day, index) => (
                  <div
                    key={index}
                    className="flex-1 space-y-2 flex flex-col items-center justify-end"
                  >
                    <div
                      className="w-full rounded-md bg-primary transition-all hover:bg-primary/90 relative group"
                      style={{ height: `${day.height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        {day.errors} error{day.errors !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {day.day.substring(0, 3)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle>Top Error Categories</CardTitle>
                <CardDescription>Distribution by error type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    category: "Syntax Errors",
                    count: Math.floor(stats.totalErrors * 0.33),
                    percentage: 33,
                    color: "bg-blue-500",
                  },
                  {
                    category: "Runtime Exceptions",
                    count: Math.floor(stats.totalErrors * 0.28),
                    percentage: 28,
                    color: "bg-purple-500",
                  },
                  {
                    category: "Network Issues",
                    count: Math.floor(stats.totalErrors * 0.20),
                    percentage: 20,
                    color: "bg-green-500",
                  },
                  {
                    category: "Database Errors",
                    count: Math.floor(stats.totalErrors * 0.12),
                    percentage: 12,
                    color: "bg-yellow-500",
                  },
                  {
                    category: "Other",
                    count: Math.floor(stats.totalErrors * 0.07),
                    percentage: 7,
                    color: "bg-gray-500",
                  },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{item.category}</span>
                      <span className="font-medium">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <Progress value={item.percentage} className={item.color} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle>Resolution Performance</CardTitle>
                <CardDescription>Time to resolve by priority</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {[
                    {
                      priority: "Critical",
                      avgTime: "1.2 days",
                      target: "1 day",
                      completion: 83,
                    },
                    {
                      priority: "High",
                      avgTime: "2.5 days",
                      target: "3 days",
                      completion: 120,
                    },
                    {
                      priority: "Medium",
                      avgTime: "4.8 days",
                      target: "5 days",
                      completion: 104,
                    },
                    {
                      priority: "Low",
                      avgTime: "8.3 days",
                      target: "10 days",
                      completion: 117,
                    },
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.priority}</span>
                            <Badge
                              variant="outline"
                              className={`${
                                item.priority === "Critical"
                                  ? "border-red-500 text-red-500"
                                  : item.priority === "High"
                                  ? "border-amber-500 text-amber-500"
                                  : item.priority === "Medium"
                                  ? "border-blue-500 text-blue-500"
                                  : "border-green-500 text-green-500"
                              }`}
                            >
                              {item.avgTime}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Target: {item.target}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold">
                            {item.completion}%
                          </span>
                          <p className="text-xs text-muted-foreground">
                            of target
                          </p>
                        </div>
                      </div>
                      <Progress
                        value={item.completion > 100 ? 100 : item.completion}
                        className={`${
                          item.completion >= 100
                            ? "bg-green-500"
                            : item.completion >= 80
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "team" && (
        <div className="space-y-6">
          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
              <CardDescription>
                Compare performance metrics across teams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <div className="grid grid-cols-7 gap-4 p-4 bg-muted/50 font-medium">
                  <div className="col-span-2">Team</div>
                  <div className="text-center">Errors Assigned</div>
                  <div className="text-center">Resolved</div>
                  <div className="text-center">Resolution Rate</div>
                  <div className="text-center">Avg. Resolution Time</div>
                  <div className="text-center">Performance</div>
                </div>
                {[
                  {
                    name: "Frontend Development",
                    assigned: 45,
                    resolved: 38,
                    rate: "84%",
                    time: "2.1 days",
                    performance: 92,
                  },
                  {
                    name: "Backend Services",
                    assigned: 62,
                    resolved: 54,
                    rate: "87%",
                    time: "1.8 days",
                    performance: 95,
                  },
                  {
                    name: "QA & Testing",
                    assigned: 33,
                    resolved: 29,
                    rate: "88%",
                    time: "2.3 days",
                    performance: 91,
                  },
                  {
                    name: "DevOps",
                    assigned: 21,
                    resolved: 16,
                    rate: "76%",
                    time: "3.2 days",
                    performance: 83,
                  },
                ].map((team, i) => (
                  <div key={i} className="grid grid-cols-7 gap-4 p-4 border-t">
                    <div className="col-span-2 font-medium">{team.name}</div>
                    <div className="text-center">{team.assigned}</div>
                    <div className="text-center">{team.resolved}</div>
                    <div className="text-center">{team.rate}</div>
                    <div className="text-center">{team.time}</div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Progress
                          value={team.performance}
                          className="w-16 h-2"
                        />
                        <span>{team.performance}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader>
              <CardTitle>Individual Performance</CardTitle>
              <CardDescription>Top performing team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <div className="grid grid-cols-7 gap-4 p-4 bg-muted/50 font-medium">
                  <div className="col-span-2">Member</div>
                  <div className="text-center">Errors Resolved</div>
                  <div className="text-center">Comments</div>
                  <div className="text-center">Solutions</div>
                  <div className="text-center">Avg. Resolution Time</div>
                  <div className="text-center">Efficiency</div>
                </div>
                {[
                  {
                    name: "John Assefa",
                    team: "Frontend Development",
                    resolved: 15,
                    comments: 34,
                    solutions: 12,
                    time: "1.8 days",
                    efficiency: 94,
                  },
                  {
                    name: "Netsanet Alemu",
                    team: "Backend Services",
                    resolved: 22,
                    comments: 41,
                    solutions: 18,
                    time: "1.5 days",
                    efficiency: 96,
                  },
                  {
                    name: "Abiy Shiferaw",
                    team: "Frontend Development",
                    resolved: 12,
                    comments: 28,
                    solutions: 10,
                    time: "2.1 days",
                    efficiency: 88,
                  },
                  {
                    name: "Sarah Johnson",
                    team: "QA & Testing",
                    resolved: 18,
                    comments: 37,
                    solutions: 14,
                    time: "1.9 days",
                    efficiency: 91,
                  },
                ].map((member, i) => (
                  <div key={i} className="grid grid-cols-7 gap-4 p-4 border-t">
                    <div className="col-span-2">
                      <div className="font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {member.team}
                      </div>
                    </div>
                    <div className="text-center">{member.resolved}</div>
                    <div className="text-center">{member.comments}</div>
                    <div className="text-center">{member.solutions}</div>
                    <div className="text-center">{member.time}</div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Progress
                          value={member.efficiency}
                          className="w-16 h-2"
                        />
                        <span>{member.efficiency}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="rounded-lg ml-auto">
                <ChevronDown className="mr-2 h-4 w-4" />
                Show More
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {activeTab === "errors" && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2 justify-end">
            <Button variant="outline" className="rounded-lg">
              <Filter className="mr-2 h-4 w-4" />
              Filter Results
            </Button>
          </div>

          <Card className="border-border/40 shadow-sm overflow-hidden">
            <CardHeader>
              <CardTitle>Error Trends</CardTitle>
              <CardDescription>Error patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-end gap-2">
                {[
                  {
                    month: "Jan",
                    syntax: 8,
                    runtime: 12,
                    network: 5,
                    database: 3,
                  },
                  {
                    month: "Feb",
                    syntax: 10,
                    runtime: 8,
                    network: 7,
                    database: 2,
                  },
                  {
                    month: "Mar",
                    syntax: 12,
                    runtime: 15,
                    network: 6,
                    database: 4,
                  },
                  {
                    month: "Apr",
                    syntax: 9,
                    runtime: 11,
                    network: 8,
                    database: 5,
                  },
                  {
                    month: "May",
                    syntax: 11,
                    runtime: 9,
                    network: 7,
                    database: 6,
                  },
                  {
                    month: "Jun",
                    syntax: 14,
                    runtime: 12,
                    network: 9,
                    database: 4,
                  },
                ].map((data, index) => (
                  <div
                    key={index}
                    className="flex-1 space-y-2 flex flex-col items-center justify-end"
                  >
                    <div
                      className="w-full relative group"
                      style={{ height: "100%" }}
                    >
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-yellow-500/80"
                        style={{ height: `${data.database * 5}%` }}
                      ></div>
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-green-500/80"
                        style={{
                          height: `${(data.database + data.network) * 5}%`,
                        }}
                      ></div>
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-purple-500/80"
                        style={{
                          height: `${
                            (data.database + data.network + data.runtime) * 5
                          }%`,
                        }}
                      ></div>
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-blue-500/80"
                        style={{
                          height: `${
                            (data.database +
                              data.network +
                              data.runtime +
                              data.syntax) *
                            5
                          }%`,
                        }}
                      ></div>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        {data.syntax +
                          data.runtime +
                          data.network +
                          data.database}{" "}
                        errors
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {data.month}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-6 gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-blue-500"></div>
                  <span className="text-xs">Syntax</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-purple-500"></div>
                  <span className="text-xs">Runtime</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-green-500"></div>
                  <span className="text-xs">Network</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-yellow-500"></div>
                  <span className="text-xs">Database</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle>Frequently Occurring Errors</CardTitle>
                <CardDescription>Most common error patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "TypeError: Cannot read property of undefined",
                      count: 28,
                      category: "Runtime",
                      increase: "+12%",
                    },
                    {
                      name: "Database connection timeout",
                      count: 23,
                      category: "Database",
                      increase: "+8%",
                    },
                    {
                      name: "API rate limit exceeded",
                      count: 19,
                      category: "Network",
                      increase: "+3%",
                    },
                    {
                      name: "Uncaught SyntaxError: Unexpected token",
                      count: 15,
                      category: "Syntax",
                      increase: "-5%",
                    },
                    {
                      name: "JWT authentication failure",
                      count: 12,
                      category: "Authentication",
                      increase: "+15%",
                    },
                  ].map((error, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{error.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{error.category}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {error.count} occurrences
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`${
                          error.increase.startsWith("+")
                            ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        }`}
                      >
                        {error.increase}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle>Root Cause Analysis</CardTitle>
                <CardDescription>Common causes of errors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      cause: "Missing error handling",
                      percentage: 35,
                      recommendation:
                        "Implement try/catch blocks and input validation",
                    },
                    {
                      cause: "Asynchronous code issues",
                      percentage: 28,
                      recommendation:
                        "Use await/async properly, handle promises",
                    },
                    {
                      cause: "Third-party service failures",
                      percentage: 18,
                      recommendation:
                        "Implement fallbacks and retry mechanisms",
                    },
                    {
                      cause: "Memory management",
                      percentage: 12,
                      recommendation:
                        "Fix memory leaks, optimize resource usage",
                    },
                    {
                      cause: "Other",
                      percentage: 7,
                      recommendation:
                        "Various causes requiring specific solutions",
                    },
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.cause}</span>
                        <span>{item.percentage}%</span>
                      </div>
                      <Progress value={item.percentage} />
                      <p className="text-xs text-muted-foreground">
                        {item.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
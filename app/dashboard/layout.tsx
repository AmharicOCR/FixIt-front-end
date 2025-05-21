"use client";

import type React from "react";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bug,
  LayoutDashboard,
  Search,
  PlusCircle,
  Users,
  BarChart2,
  Settings,
  Menu,
  LogOut,
  Sun,
  Moon,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useSearchParams, usePathname } from "next/navigation";
import { Suspense } from "react";
// Remove the SocketProvider import:
// import { SocketProvider } from "@/contexts/socket-context"

// Remove the NotificationProvider import:
// import { NotificationProvider } from "@/contexts/notification-context"

// Remove the NotificationBell import:
// import { NotificationBell } from "@/components/notification-bell"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const user = { accountType: "premium" };

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const NavItem = ({
    href,
    icon: Icon,
    children,
    active = false,
    onClick,
  }: {
    href: string;
    icon: React.ElementType;
    children: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
  }) => (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-muted",
        active
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground"
      )}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </Link>
  );

  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* Replace the SocketProvider and NotificationProvider wrappers: */}
      {/* <SocketProvider userId="user-123">
        {" "}
        {/* In a real app, use the actual user ID */}
      {/* <NotificationProvider> */}
      {/* Mobile Header */}
      <>
        <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-lg md:px-6 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Menu"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <Link
            href="/"
            className="ml-2 flex items-center gap-2 font-bold lg:ml-0"
          >
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
              <Bug className="size-5" />
            </div>
            <span>FixIt</span>
          </Link>
          <div className="flex-1"></div>
          {/* Replace this in the mobile header */}
          {/* <NotificationBell /> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>John Doe</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={toggleTheme}>
                {mounted && theme === "dark" ? (
                  <>
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark Mode</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Mobile Sidebar */}
        <div
          className={cn(
            "fixed inset-0 top-16 z-40 bg-background/80 backdrop-blur-sm lg:hidden",
            sidebarOpen ? "block" : "hidden"
          )}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={cn(
            "fixed top-16 bottom-0 left-0 z-40 w-64 border-r bg-background transition-transform lg:hidden",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-full flex-col py-4">
            <div className="px-4 py-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/dashboard/new-error">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Log New Error
                </Link>
              </Button>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid gap-1 px-2">
                <NavItem
                  href="/dashboard"
                  icon={LayoutDashboard}
                  active={pathname === "/dashboard"}
                  onClick={() => setSidebarOpen(false)}
                >
                  Dashboard
                </NavItem>
                <NavItem
                  href="/dashboard/search"
                  icon={Search}
                  active={pathname?.startsWith("/dashboard/search")}
                  onClick={() => setSidebarOpen(false)}
                >
                  Search Errors
                </NavItem>
                <NavItem
                  href="/dashboard/my-errors"
                  icon={Bug}
                  active={pathname?.startsWith("/dashboard/my-errors")}
                  onClick={() => setSidebarOpen(false)}
                >
                  My Errors
                </NavItem>
                {user.accountType === "premium" && (
                  <NavItem
                    href="/dashboard/teams"
                    icon={Users}
                    active={pathname?.startsWith("/dashboard/teams")}
                    onClick={() => setSidebarOpen(false)}
                  >
                    Teams
                  </NavItem>
                )}

                <NavItem
                  href="/dashboard/reports"
                  icon={BarChart2}
                  active={pathname?.startsWith("/dashboard/reports")}
                  onClick={() => setSidebarOpen(false)}
                >
                  Reports
                </NavItem>
              </nav>
            </div>
            <div className="border-t px-2 py-4">
              <nav className="grid gap-1">
                <NavItem
                  href="/dashboard/settings"
                  icon={Settings}
                  onClick={() => setSidebarOpen(false)}
                >
                  Settings
                </NavItem>
                <NavItem
                  href="/dashboard/help"
                  icon={HelpCircle}
                  onClick={() => setSidebarOpen(false)}
                >
                  Help & Support
                </NavItem>
              </nav>
            </div>
          </div>
        </div>

        <div className="flex flex-1">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r bg-background">
            <div className="px-6 py-5 flex items-center gap-2 font-bold border-b">
              <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
                <Bug className="size-5" />
              </div>
              <span>FixIt</span>
            </div>
            <div className="flex h-full flex-col py-4">
              <div className="px-4 py-2">
                <Button className="w-full justify-start rounded-lg" asChild>
                  <Link href="/dashboard/new-error">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Log New Error
                  </Link>
                </Button>
              </div>
              <div className="flex-1 overflow-auto py-2">
                <nav className="grid gap-1 px-2">
                  <NavItem
                    href="/dashboard"
                    icon={LayoutDashboard}
                    active={pathname === "/dashboard"}
                  >
                    Dashboard
                  </NavItem>
                  <NavItem
                    href="/dashboard/search"
                    icon={Search}
                    active={pathname?.startsWith("/dashboard/search")}
                  >
                    Search Errors
                  </NavItem>
                  <NavItem
                    href="/dashboard/my-errors"
                    icon={Bug}
                    active={pathname?.startsWith("/dashboard/my-errors")}
                  >
                    My Errors
                  </NavItem>
                  {user.accountType === "premium" && (
                    <NavItem
                      href="/dashboard/teams"
                      icon={Users}
                      active={pathname?.startsWith("/dashboard/teams")}
                    >
                      Teams
                    </NavItem>
                  )}

                  <NavItem
                    href="/dashboard/reports"
                    icon={BarChart2}
                    active={pathname?.startsWith("/dashboard/reports")}
                  >
                    Reports
                  </NavItem>
                </nav>
              </div>
              <div className="border-t px-2 py-4">
                <nav className="grid gap-1">
                  <NavItem href="/dashboard/settings" icon={Settings}>
                    Settings
                  </NavItem>
                  <NavItem href="/dashboard/help" icon={HelpCircle}>
                    Help & Support
                  </NavItem>
                </nav>
                <div className="px-3 pt-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start">
                        <Avatar className="mr-2 h-6 w-6">
                          <AvatarImage src="/placeholder.svg" alt="User" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <span>John Doe</span>
                        <ChevronDown className="ml-auto h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuLabel>John Doe</DropdownMenuLabel>
                      <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
                        john.doe@example.com
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings">Settings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={toggleTheme}>
                        {mounted && theme === "dark" ? (
                          <>
                            <Sun className="mr-2 h-4 w-4" />
                            <span>Light Mode</span>
                          </>
                        ) : (
                          <>
                            <Moon className="mr-2 h-4 w-4" />
                            <span>Dark Mode</span>
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="hidden h-16 items-center gap-4 border-b bg-background px-6 lg:flex">
              <nav className="flex-1">
                <form className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search errors..."
                    className="w-full max-w-sm rounded-lg pl-8"
                  />
                </form>
              </nav>
              <div className="flex items-center gap-4">
                {/* Replace this in the desktop header */}
                {/* <NotificationBell /> */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="rounded-full"
                >
                  {mounted && theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle theme</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>John Doe</DropdownMenuLabel>
                    <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
                      john.doe@example.com
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="p-6">
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </div>
          </main>
        </div>
      </>
      {/* </NotificationProvider> */}
      {/* </SocketProvider> */}
    </div>
  );
}

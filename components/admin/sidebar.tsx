"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  CheckCircle,
  BarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Errors",
      href: "/admin/errors",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    {
      title: "Solutions",
      href: "/admin/solutions",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      title: "Input Options",
      href: "/admin/manage-input-options",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-background h-screen",
        isCollapsed ? "w-[70px]" : "w-[240px]",
        className,
      )}
    >
      <div className="flex h-14 items-center px-4 border-b">
        {!isCollapsed && (
          <Link href="/admin" className="flex items-center gap-2 font-bold">
            <div className="size-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
              CER
            </div>
            <span>Error Repository</span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/admin" className="mx-auto">
            <div className="size-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground">
              CER
            </div>
          </Link>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-16 h-6 w-6 rounded-full border bg-background z-10"
        onClick={toggleSidebar}
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-muted",
                pathname === item.href ? "bg-muted" : "transparent",
                isCollapsed ? "justify-center" : "",
              )}
            >
              {item.icon}
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-4 border-t">
        <Button variant="ghost" className={cn("w-full justify-start", isCollapsed ? "justify-center px-0" : "")}>
          <LogOut className="h-5 w-5 mr-2" />
          {!isCollapsed && <span>Log Out</span>}
        </Button>
      </div>
    </div>
  )
}

import type React from "react"
import { Sidebar } from "@/components/admin/sidebar"
import { Header } from "@/components/admin/header"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

import type React from "react"
import { MainNav } from "@/components/main-nav"
import { UserInfo } from "@/components/user-info"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold md:text-2xl">OSINT Tool</h1>
          </div>
          <MainNav />
          <div className="hidden md:block">
            <UserInfo />
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">{children}</main>
    </div>
  )
}

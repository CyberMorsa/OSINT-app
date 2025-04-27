"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogOut, Search, Mail, Phone, Wifi } from "lucide-react"
import { useRouter } from "next/navigation"

export function MainNav() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    })
    router.push("/login")
    router.refresh()
  }

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
      icon: Search,
    },
    {
      href: "/dashboard/users",
      label: "Users",
      active: pathname === "/dashboard/users",
      icon: Search,
    },
    {
      href: "/dashboard/emails",
      label: "Emails",
      active: pathname === "/dashboard/emails",
      icon: Mail,
    },
    {
      href: "/dashboard/phones",
      label: "Phones",
      active: pathname === "/dashboard/phones",
      icon: Phone,
    },
    {
      href: "/dashboard/networks",
      label: "Networks",
      active: pathname === "/dashboard/networks",
      icon: Wifi,
    },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-primary" : "text-muted-foreground",
          )}
        >
          <route.icon className="mr-2 h-4 w-4" />
          {route.label}
        </Link>
      ))}
      <Button variant="ghost" size="sm" onClick={handleLogout} className="ml-auto">
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </nav>
  )
}

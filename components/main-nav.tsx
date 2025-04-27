"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogOut, Search, Mail, Phone, Wifi, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MainNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

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

  // Versión móvil con Sheet
  const MobileNav = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <div className="flex flex-col h-full">
          <div className="px-2 py-4 border-b">
            <h2 className="text-lg font-bold">OSINT Tool</h2>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                  route.active
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary hover:text-secondary-foreground",
                )}
              >
                <route.icon className="mr-2 h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </nav>
          <div className="px-2 py-4 border-t">
            <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <>
      <MobileNav />
      <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
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
    </>
  )
}

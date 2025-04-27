"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface User {
  username: string
  role: string
}

export function UserInfo() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Obtener la cookie de autenticación
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(";").shift()
    }

    const authCookie = getCookie("auth")
    if (authCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(authCookie))
        setUser(userData)
      } catch (e) {
        console.error("Error parsing auth cookie:", e)
      }
    }
  }, [])

  if (!user) return null

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="text-sm font-medium">{user.username}</p>
        <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
      </div>
    </div>
  )
}

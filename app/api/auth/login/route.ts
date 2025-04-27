import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Verificar que las variables de entorno estén configuradas
    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD
    const guestUsername = process.env.GUEST_USERNAME
    const guestPassword = process.env.GUEST_PASSWORD

    if (!adminUsername || !adminPassword || !guestUsername || !guestPassword) {
      console.error("Authentication environment variables are not properly configured")
      return NextResponse.json({ message: "Server configuration error" }, { status: 500 })
    }

    // Verificar credenciales
    const isAdmin = username === adminUsername && password === adminPassword
    const isGuest = username === guestUsername && password === guestPassword

    if (!isAdmin && !isGuest) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Crear un objeto de usuario simple (sin contraseña)
    const user = {
      username,
      role: isAdmin ? "admin" : "guest",
    }

    // Establecer cookie de autenticación
    cookies().set({
      name: "auth",
      value: JSON.stringify(user),
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 día
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

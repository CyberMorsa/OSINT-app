import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default function HomePage() {
  // Verificar si el usuario está autenticado
  const authCookie = cookies().get("auth")

  // Redirigir según el estado de autenticación
  if (authCookie) {
    redirect("/dashboard")
  } else {
    redirect("/login")
  }

  // Esto nunca se renderizará debido a las redirecciones
  return null
}

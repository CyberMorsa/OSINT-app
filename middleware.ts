import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth")?.value
  const url = request.nextUrl.clone()
  const path = url.pathname

  // Permitir acceso a la página principal
  if (path === "/") {
    return NextResponse.next()
  }

  // Si la ruta es la página de login, permitir acceso
  if (path === "/login") {
    // Si ya está autenticado, redirigir al dashboard
    if (authCookie) {
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // Para todas las demás rutas protegidas, verificar autenticación
  if (path.startsWith("/dashboard") && !authCookie) {
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}

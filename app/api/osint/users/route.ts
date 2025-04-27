import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ message: "Username parameter is required" }, { status: 400 })
  }

  try {
    // Aquí normalmente llamaríamos a una API externa como Sherlock o Maigret
    // Por ahora, simularemos algunos resultados

    // Simulación de búsqueda en plataformas sociales
    const platforms = [
      "Twitter",
      "Instagram",
      "Facebook",
      "LinkedIn",
      "GitHub",
      "Reddit",
      "TikTok",
      "YouTube",
      "Pinterest",
      "Snapchat",
    ]

    // Simular resultados aleatorios para demostración
    const profiles = platforms.map((platform) => {
      const found = Math.random() > 0.3 // 70% de probabilidad de encontrar
      return {
        platform,
        username: found ? username : null,
        found,
        url: found ? `https://${platform.toLowerCase()}.com/${username}` : null,
      }
    })

    return NextResponse.json({
      username,
      profiles: profiles.sort((a, b) => {
        // Ordenar por encontrados primero
        if (a.found && !b.found) return -1
        if (!a.found && b.found) return 1
        return 0
      }),
    })
  } catch (error: any) {
    console.error("Error searching for username:", error)
    return NextResponse.json({ message: error.message || "Failed to search for username" }, { status: 500 })
  }
}

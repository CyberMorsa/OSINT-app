import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ message: "Username parameter is required" }, { status: 400 })
  }

  try {
    // Aquí normalmente llamaríamos a herramientas como Sherlock o Maigret
    // Por ahora, simularemos algunos resultados

    // Plataformas populares para buscar
    const platforms = [
      { name: "Twitter", domain: "twitter.com", probability: 0.8 },
      { name: "Instagram", domain: "instagram.com", probability: 0.8 },
      { name: "Facebook", domain: "facebook.com", probability: 0.7 },
      { name: "LinkedIn", domain: "linkedin.com", probability: 0.6 },
      { name: "GitHub", domain: "github.com", probability: 0.5 },
      { name: "Reddit", domain: "reddit.com", probability: 0.6 },
      { name: "TikTok", domain: "tiktok.com", probability: 0.7 },
      { name: "YouTube", domain: "youtube.com", probability: 0.5 },
      { name: "Pinterest", domain: "pinterest.com", probability: 0.4 },
      { name: "Snapchat", domain: "snapchat.com", probability: 0.3 },
      { name: "Medium", domain: "medium.com", probability: 0.4 },
      { name: "Twitch", domain: "twitch.tv", probability: 0.5 },
      { name: "Telegram", domain: "t.me", probability: 0.3 },
      { name: "Spotify", domain: "open.spotify.com/user", probability: 0.4 },
      { name: "SoundCloud", domain: "soundcloud.com", probability: 0.3 },
    ]

    // Generar resultados basados en probabilidades
    const profiles = platforms.map((platform) => {
      const found = Math.random() < platform.probability
      let url = ""

      if (found) {
        if (platform.name === "Telegram") {
          url = `https://${platform.domain}/${username}`
        } else if (platform.name === "Spotify") {
          url = `https://${platform.domain}/${username}`
        } else {
          url = `https://${platform.domain}/${username}`
        }
      }

      return {
        platform: platform.name,
        username: found ? username : null,
        found,
        url: found ? url : null,
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

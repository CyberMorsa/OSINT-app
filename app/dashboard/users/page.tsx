"use client"

import { useState } from "react"
import { SearchForm } from "@/components/search-form"
import { SearchResults } from "@/components/search-results"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Clock } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

export default function UsersPage() {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<any | null>(null)

  const handleSearch = async () => {
    if (!username.trim()) return

    setIsLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch(`/api/osint/users?username=${encodeURIComponent(username)}`)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to search for username")
      }

      const data = await response.json()
      setResults(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const getPlatformIcon = (platform: string) => {
    // Devolver un emoji basado en la plataforma
    switch (platform.toLowerCase()) {
      case "twitter":
        return "🐦"
      case "instagram":
        return "📷"
      case "facebook":
        return "👤"
      case "linkedin":
        return "💼"
      case "github":
        return "💻"
      case "reddit":
        return "🔍"
      case "tiktok":
        return "🎵"
      case "youtube":
        return "▶️"
      case "pinterest":
        return "📌"
      case "snapchat":
        return "👻"
      case "medium":
        return "📝"
      case "twitch":
        return "🎮"
      case "telegram":
        return "📱"
      case "spotify":
        return "🎧"
      case "soundcloud":
        return "🔊"
      case "mastodon":
        return "🐘"
      case "flickr":
        return "📸"
      case "vimeo":
        return "🎬"
      case "behance":
        return "🎨"
      case "dribbble":
        return "🏀"
      case "deviantart":
        return "🖌️"
      case "patreon":
        return "💰"
      case "steam":
        return "🎲"
      default:
        return "🌐"
    }
  }

  const renderUserResults = (data: any) => {
    const foundProfiles = data.profiles.filter((profile: any) => profile.found)
    const notFoundProfiles = data.profiles.filter((profile: any) => !profile.found)

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-lg font-medium">Results Summary</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Clock className="mr-1 h-3 w-3" />
                {new Date(data.scanTime).toLocaleString()}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Found: {data.totalFound}/{data.totalChecked}
              </Badge>
            </div>
          </div>

          <Progress value={(data.totalFound / data.totalChecked) * 100} className="h-2" />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Found Profiles ({foundProfiles.length})</h3>
          {foundProfiles.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {foundProfiles.map((profile: any) => (
                <Card key={profile.platform} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <span className="mr-2 text-lg" aria-hidden="true">
                          {getPlatformIcon(profile.platform)}
                        </span>
                        {profile.platform}
                      </CardTitle>
                      <Badge>Found</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <CardDescription className="truncate max-w-[70%]">{profile.username}</CardDescription>
                      <Link
                        href={profile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Visit {profile.platform} profile</span>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No profiles found for this username.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {notFoundProfiles.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Not Found ({notFoundProfiles.length})</h3>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  {notFoundProfiles.map((profile: any) => (
                    <Badge key={profile.platform} variant="outline" className="text-muted-foreground">
                      <span className="mr-1" aria-hidden="true">
                        {getPlatformIcon(profile.platform)}
                      </span>
                      {profile.platform}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">User Search</h2>
        <p className="text-muted-foreground">Search for usernames across multiple social networks</p>
      </div>

      <SearchForm
        label="Username"
        placeholder="Enter a username to search"
        value={username}
        onChange={setUsername}
        onSubmit={handleSearch}
        isLoading={isLoading}
      />

      {(isLoading || error || results) && (
        <SearchResults
          title="Username Results"
          description="Platforms where this username was found"
          isLoading={isLoading}
          error={error}
          data={results}
          renderContent={renderUserResults}
        />
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { SearchForm } from "@/components/search-form"
import { SearchResults } from "@/components/search-results"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Clock, AlertCircle, CheckCircle, Info } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"

export default function UsersPage() {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<any | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(null)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

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

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
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
      <div className="space-y-6 animate-fade-in">
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

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Profile match rate</span>
              <span className="font-medium">{Math.round((data.totalFound / data.totalChecked) * 100)}%</span>
            </div>
            <Progress
              value={(data.totalFound / data.totalChecked) * 100}
              className="h-2"
              aria-label={`Found ${data.totalFound} out of ${data.totalChecked} profiles`}
            />
          </div>

          {data.totalFound > 0 && (
            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                Found {data.totalFound} profiles for username &quot;{data.username}&quot;. Click on any profile to
                visit.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            Found Profiles ({foundProfiles.length})
          </h3>
          {foundProfiles.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {foundProfiles.map((profile: any, index: number) => (
                <motion.div
                  key={profile.platform}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden card-hover result-card result-found">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium flex items-center">
                          <span className="mr-2 text-lg" aria-hidden="true">
                            {getPlatformIcon(profile.platform)}
                          </span>
                          {profile.platform}
                        </CardTitle>
                        <Badge className="badge-found">Found</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <CardDescription className="truncate max-w-[70%] text-foreground">
                          {profile.username}
                        </CardDescription>
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() => copyToClipboard(profile.url, profile.platform)}
                                  aria-label={`Copy ${profile.platform} URL`}
                                >
                                  {copied === profile.platform ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{copied === profile.platform ? "Copied!" : "Copy URL"}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <Link
                            href={profile.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors"
                            aria-label={`Visit ${profile.platform} profile`}
                          >
                            <Button size="icon" variant="outline" className="h-8 w-8">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Last checked: {new Date(profile.lastChecked).toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center p-4 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-center text-muted-foreground">No profiles found for this username.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {notFoundProfiles.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-muted-foreground" />
              Not Found ({notFoundProfiles.length})
            </h3>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  {notFoundProfiles.map((profile: any) => (
                    <Badge key={profile.platform} variant="outline" className="text-muted-foreground py-2">
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

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => {
              const exportData = {
                username: data.username,
                scanTime: data.scanTime,
                totalFound: data.totalFound,
                totalChecked: data.totalChecked,
                foundProfiles: foundProfiles,
              }
              const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = `${data.username}-profiles.json`
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)
            }}
          >
            Export Results
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      <div>
        <h2 className="text-3xl font-bold tracking-tight">User Search</h2>
        <p className="text-muted-foreground">Search for usernames across multiple social networks</p>
      </div>

      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Search for a username</CardTitle>
          <CardDescription>
            Enter a username to search across {results ? results.totalChecked : "20+"} social platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SearchForm
            label="Username"
            placeholder="Enter a username to search"
            value={username}
            onChange={setUsername}
            onSubmit={handleSearch}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <div id="main-content" tabIndex={-1}>
        {isLoading && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center space-x-4">
              <div className="animate-pulse-slow bg-muted h-8 w-48 rounded"></div>
              <div className="animate-pulse-slow bg-muted h-6 w-24 rounded-full ml-auto"></div>
            </div>
            <div className="animate-pulse-slow bg-muted h-2 w-full rounded"></div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse-slow bg-muted h-32 rounded-lg"></div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="animate-fade-in">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && results && (
          <SearchResults
            title="Username Results"
            description="Platforms where this username was found"
            isLoading={false}
            error={null}
            data={results}
            renderContent={renderUserResults}
          />
        )}
      </div>
    </div>
  )
}

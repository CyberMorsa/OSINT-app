"use client"

import { useState } from "react"
import { SearchForm } from "@/components/search-form"
import { SearchResults } from "@/components/search-results"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

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

  const renderUserResults = (data: any) => {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {data.profiles.map((profile: any) => (
            <Card key={profile.url}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{profile.platform}</CardTitle>
                  <Badge variant={profile.found ? "default" : "outline"}>{profile.found ? "Found" : "Not Found"}</Badge>
                </div>
              </CardHeader>
              {profile.found && (
                <CardContent>
                  <div className="flex justify-between items-center">
                    <CardDescription>{profile.username}</CardDescription>
                    <Link href={profile.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
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

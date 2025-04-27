"use client"

import { useState } from "react"
import { SearchForm } from "@/components/search-form"
import { SearchResults } from "@/components/search-results"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EmailsPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<any | null>(null)

  const handleSearch = async () => {
    if (!email.trim()) return

    setIsLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch(`/api/osint/emails?email=${encodeURIComponent(email)}`)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to search for email")
      }

      const data = await response.json()
      setResults(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const renderEmailResults = (data: any) => {
    return (
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="breaches">Breaches</TabsTrigger>
          <TabsTrigger value="reputation">Reputation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>{data.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Domain</span>
                  <span>{data.domain}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">First Seen</span>
                  <span>{data.firstSeen || "Unknown"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Breaches</span>
                  <Badge variant={data.breaches.length > 0 ? "destructive" : "outline"}>{data.breaches.length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breaches" className="space-y-4">
          {data.breaches.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {data.breaches.map((breach: any) => (
                <Card key={breach.name}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{breach.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date</span>
                        <span>{breach.date}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Data Types</span>
                        <span>{breach.dataTypes.join(", ")}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>No breaches found for this email.</p>
          )}
        </TabsContent>

        <TabsContent value="reputation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reputation Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Score</span>
                  <span className="font-bold">{data.reputation.score}/100</span>
                </div>
                <Progress value={data.reputation.score} />

                <div className="grid gap-2 mt-4">
                  {Object.entries(data.reputation.details).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground capitalize">{key.replace("_", " ")}</span>
                      <Badge variant={value ? "default" : "outline"}>{value ? "Yes" : "No"}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Email Search</h2>
        <p className="text-muted-foreground">
          Find information about email addresses, including breaches and reputation
        </p>
      </div>

      <SearchForm
        label="Email Address"
        placeholder="Enter an email address to search"
        value={email}
        onChange={setEmail}
        onSubmit={handleSearch}
        isLoading={isLoading}
      />

      {(isLoading || error || results) && (
        <SearchResults
          title="Email Results"
          description="Information found about this email address"
          isLoading={isLoading}
          error={error}
          data={results}
          renderContent={renderEmailResults}
        />
      )}
    </div>
  )
}

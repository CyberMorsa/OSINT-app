"use client"

import { useState } from "react"
import { SearchForm } from "@/components/search-form"
import { SearchResults } from "@/components/search-results"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, AlertCircle, User, Mail, Globe } from "lucide-react"

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
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="reputation">Reputation</TabsTrigger>
          {data.contact && data.contact.firstName && <TabsTrigger value="contact">Contact Info</TabsTrigger>}
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
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={data.status === "valid" ? "default" : "destructive"}>
                    {data.status === "valid" ? "Valid" : data.status === "invalid" ? "Invalid" : "Unknown"}
                  </Badge>
                </div>
                {data.firstSeen && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">First Seen</span>
                    <span>{data.firstSeen}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sources</span>
                  <span>{data.sources}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Security</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Valid Syntax</span>
                    {data.security.hasValidSyntax ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">MX Records</span>
                    {data.security.hasValidMX ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">SPF Record</span>
                    {data.security.hasSPF ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">DMARC Record</span>
                    {data.security.hasDMARC ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                    <span className="font-medium">Security Note</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    We cannot check for data breaches without the HaveIBeenPwned API. Consider checking manually at{" "}
                    <a
                      href="https://haveibeenpwned.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      haveibeenpwned.com
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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

        {data.contact && data.contact.firstName && (
          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>
                      {data.contact.firstName} {data.contact.lastName}
                    </span>
                  </div>

                  {data.contact.position && (
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>{data.contact.position}</span>
                    </div>
                  )}

                  {data.contact.company && (
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 mr-2 text-muted-foreground" />
                      <span>{data.contact.company}</span>
                    </div>
                  )}

                  {data.contact.twitter && (
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 text-muted-foreground"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                      <a
                        href={`https://twitter.com/${data.contact.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        @{data.contact.twitter}
                      </a>
                    </div>
                  )}

                  {data.contact.linkedin && (
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 text-muted-foreground"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                      <a
                        href={data.contact.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Email Search</h2>
        <p className="text-muted-foreground">
          Find information about email addresses, including validity and reputation
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

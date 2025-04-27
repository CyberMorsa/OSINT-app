"use client"

import { useState } from "react"
import { SearchForm } from "@/components/search-form"
import { SearchResults } from "@/components/search-results"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, PhoneIcon, Building, Globe, User, Mail, AlertTriangle, Tag } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PhonesPage() {
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<any | null>(null)

  const handleSearch = async () => {
    if (!phone.trim()) return

    setIsLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch(`/api/osint/phones?phone=${encodeURIComponent(phone)}`)

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to search for phone number")
      }

      const data = await response.json()
      setResults(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const renderPhoneResults = (data: any) => {
    return (
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {data.spam && <TabsTrigger value="spam">Spam Info</TabsTrigger>}
          {data.owner && <TabsTrigger value="owner">Owner Info</TabsTrigger>}
          <TabsTrigger value="sources">Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Phone Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center">
                  <PhoneIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground mr-2">Number:</span>
                  <span>{data.formatted}</span>
                  <Badge className="ml-2" variant={data.valid ? "default" : "destructive"}>
                    {data.valid ? "Valid" : "Invalid"}
                  </Badge>
                </div>

                <div className="flex items-center">
                  <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground mr-2">Country:</span>
                  <span>
                    {data.country.name} ({data.country.code})
                  </span>
                </div>

                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground mr-2">Location:</span>
                  <span>{data.location || "Unknown"}</span>
                </div>

                <div className="flex items-center">
                  <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground mr-2">Carrier:</span>
                  <span>{data.carrier || "Unknown"}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-2">Line Type:</span>
                    <Badge variant="outline">{data.line_type}</Badge>
                  </div>

                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-2">Risk Level:</span>
                    <Badge
                      variant={data.risk === "high" ? "destructive" : data.risk === "medium" ? "default" : "outline"}
                    >
                      {data.risk}
                    </Badge>
                  </div>
                </div>

                {data.tags && data.tags.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center mb-2">
                      <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Tags:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {data.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {data.spam && (
          <TabsContent value="spam" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Spam Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span>Spam Score</span>
                      <span className="font-bold">{data.spam.spamScore}/10</span>
                    </div>
                    <Progress
                      value={data.spam.spamScore * 10}
                      className={`${
                        data.spam.spamScore > 7
                          ? "bg-red-100 [&>div]:bg-red-500"
                          : data.spam.spamScore > 4
                            ? "bg-yellow-100 [&>div]:bg-yellow-500"
                            : "bg-green-100 [&>div]:bg-green-500"
                      }`}
                    />
                  </div>

                  {data.spam.spamType && (
                    <div className="flex items-center">
                      <AlertTriangle
                        className={`mr-2 h-5 w-5 ${
                          data.spam.spamScore > 7
                            ? "text-red-500"
                            : data.spam.spamScore > 4
                              ? "text-yellow-500"
                              : "text-green-500"
                        }`}
                      />
                      <span>
                        Classification: <strong>{data.spam.spamType}</strong>
                      </span>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      {data.spam.spamScore > 7
                        ? "This number has been reported as spam by many users. Be extremely cautious."
                        : data.spam.spamScore > 4
                          ? "This number has some suspicious activity. Exercise caution."
                          : "This number appears to be safe with no significant spam reports."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {data.owner && (
          <TabsContent value="owner" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Owner Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.owner.name && (
                    <div className="flex items-center">
                      <User className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span className="text-muted-foreground mr-2">Name:</span>
                      <span>{data.owner.name}</span>
                    </div>
                  )}

                  {data.owner.email && (
                    <div className="flex items-center">
                      <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span className="text-muted-foreground mr-2">Email:</span>
                      <span>{data.owner.email}</span>
                    </div>
                  )}

                  {data.owner.address && (
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span className="text-muted-foreground mr-2">Address:</span>
                      <span>{data.owner.address}</span>
                    </div>
                  )}

                  {!data.owner.name && !data.owner.email && !data.owner.address && (
                    <p className="text-muted-foreground">Limited owner information available.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Numverify API</span>
                    <Badge variant={data.sources.numverify ? "default" : "outline"}>
                      {data.sources.numverify ? "Data Available" : "No Data"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">TrueCaller API</span>
                    <Badge variant={data.sources.truecaller ? "default" : "outline"}>
                      {data.sources.truecaller ? "Data Available" : "No Data"}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    This information is compiled from multiple sources. Some data may be simulated if API access is
                    limited.
                  </p>
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
        <h2 className="text-3xl font-bold tracking-tight">Phone Search</h2>
        <p className="text-muted-foreground">Lookup phone numbers to find carrier information and location</p>
      </div>

      <SearchForm
        label="Phone Number"
        placeholder="Enter a phone number to search (e.g. +1234567890)"
        value={phone}
        onChange={setPhone}
        onSubmit={handleSearch}
        isLoading={isLoading}
      />

      {(isLoading || error || results) && (
        <SearchResults
          title="Phone Results"
          description="Information found about this phone number"
          isLoading={isLoading}
          error={error}
          data={results}
          renderContent={renderPhoneResults}
        />
      )}
    </div>
  )
}

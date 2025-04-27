"use client"

import { useState } from "react"
import { SearchForm } from "@/components/search-form"
import { SearchResults } from "@/components/search-results"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, PhoneIcon, Building, Globe } from "lucide-react"

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
      <div className="space-y-4">
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
            </div>
          </CardContent>
        </Card>

        {data.owner && (
          <Card>
            <CardHeader>
              <CardTitle>Owner Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span>{data.owner.name || "Unknown"}</span>
                </div>
                {data.owner.email && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span>{data.owner.email}</span>
                  </div>
                )}
                {data.owner.address && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address</span>
                    <span>{data.owner.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
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

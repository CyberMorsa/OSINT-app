"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchResults } from "@/components/search-results"
import { Badge } from "@/components/ui/badge"
import { Laptop, Smartphone, Server, WifiIcon, AlertTriangle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function NetworksPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<any | null>(null)
  const [scanProgress, setScanProgress] = useState(0)

  const handleScan = async () => {
    setIsLoading(true)
    setError(null)
    setResults(null)
    setScanProgress(0)

    try {
      // Simular progreso de escaneo
      const progressInterval = setInterval(() => {
        setScanProgress((prev) => {
          const newProgress = prev + Math.floor(Math.random() * 10)
          return newProgress >= 100 ? 100 : newProgress
        })
      }, 500)

      // Simular tiempo de escaneo
      await new Promise((resolve) => setTimeout(resolve, 5000))

      clearInterval(progressInterval)
      setScanProgress(100)

      const response = await fetch("/api/osint/networks")

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to scan network")
      }

      const data = await response.json()
      setResults(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "smartphone":
        return <Smartphone className="h-4 w-4" />
      case "laptop":
        return <Laptop className="h-4 w-4" />
      case "server":
        return <Server className="h-4 w-4" />
      default:
        return <WifiIcon className="h-4 w-4" />
    }
  }

  const renderNetworkResults = (data: any) => {
    return (
      <Tabs defaultValue="devices">
        <TabsList>
          <TabsTrigger value="devices">Devices ({data.devices.length})</TabsTrigger>
          <TabsTrigger value="summary">Network Summary</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities ({data.vulnerabilities.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {data.devices.map((device: any) => (
              <Card key={device.mac}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center">
                      {getDeviceIcon(device.type)}
                      <span className="ml-2">{device.name || device.ip}</span>
                    </CardTitle>
                    <Badge variant={device.status === "online" ? "default" : "outline"}>{device.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IP Address</span>
                      <span>{device.ip}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">MAC Address</span>
                      <span>{device.mac}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vendor</span>
                      <span>{device.vendor || "Unknown"}</span>
                    </div>
                    {device.openPorts && device.openPorts.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Open Ports</span>
                        <span>{device.openPorts.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Network Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network Name</span>
                    <span>{data.network.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IP Range</span>
                    <span>{data.network.ipRange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gateway</span>
                    <span>{data.network.gateway}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Devices</span>
                    <span>{data.devices.length}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Device Types</span>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(data.deviceTypes).map(([type, count]: [string, any]) => (
                      <div key={type} className="flex items-center">
                        <span className="text-muted-foreground capitalize w-24">{type}</span>
                        <Progress value={count.percentage} className="flex-1 mx-2" />
                        <span>{count.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vulnerabilities" className="space-y-4">
          {data.vulnerabilities.length > 0 ? (
            <div className="space-y-4">
              {data.vulnerabilities.map((vuln: any, index: number) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <AlertTriangle className="h-4 w-4 text-destructive mr-2" />
                        {vuln.title}
                      </CardTitle>
                      <Badge
                        variant={
                          vuln.severity === "high" ? "destructive" : vuln.severity === "medium" ? "default" : "outline"
                        }
                      >
                        {vuln.severity}
                      </Badge>
                    </div>
                    <CardDescription>{vuln.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Affected Device</span>
                        <span>{vuln.device}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Recommendation</span>
                        <span>{vuln.recommendation}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p>No vulnerabilities found in the network.</p>
          )}
        </TabsContent>
      </Tabs>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Network Scanner</h2>
        <p className="text-muted-foreground">Scan your local network to discover connected devices</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scan Network</CardTitle>
          <CardDescription>
            This will scan your local network for connected devices and potential vulnerabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Scanning network...</span>
                  <span>{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} />
              </div>
            )}

            <Button onClick={handleScan} disabled={isLoading} className="w-full">
              {isLoading ? "Scanning..." : "Start Network Scan"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {(error || results) && (
        <SearchResults
          title="Network Scan Results"
          description="Devices and information found on your network"
          isLoading={false}
          error={error}
          data={results}
          renderContent={renderNetworkResults}
        />
      )}
    </div>
  )
}

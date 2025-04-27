"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchResults } from "@/components/search-results"
import { Badge } from "@/components/ui/badge"
import {
  Laptop,
  Smartphone,
  Server,
  WifiIcon,
  AlertTriangle,
  ComputerIcon as Desktop,
  Router,
  Shield,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function NetworksPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<any | null>(null)
  const [scanProgress, setScanProgress] = useState(0)
  const [selectedDevice, setSelectedDevice] = useState<any>(null)

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
      case "desktop":
        return <Desktop className="h-4 w-4" />
      case "server":
        return <Server className="h-4 w-4" />
      case "router":
        return <Router className="h-4 w-4" />
      default:
        return <WifiIcon className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const DeviceDetails = ({ device }: { device: any }) => {
    if (!device) return null

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Basic Information</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">IP Address</TableCell>
                  <TableCell>{device.ip}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">MAC Address</TableCell>
                  <TableCell>{device.mac}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Hostname</TableCell>
                  <TableCell>{device.hostname || "Unknown"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Status</TableCell>
                  <TableCell>
                    <Badge variant={device.status === "online" ? "default" : "outline"}>{device.status}</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Hardware Details</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Device Type</TableCell>
                  <TableCell className="capitalize">{device.type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Brand</TableCell>
                  <TableCell>{device.brand || "Unknown"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Model</TableCell>
                  <TableCell>{device.model || "Unknown"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Vendor</TableCell>
                  <TableCell>{device.vendor || "Unknown"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {device.os && (
          <div>
            <h3 className="text-lg font-medium mb-2">Software Information</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Operating System</TableCell>
                  <TableCell>{device.os}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}

        {device.openPorts && device.openPorts.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-2">Open Ports</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Port</TableHead>
                  <TableHead>Service</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {device.openPorts.map((port: number) => (
                  <TableRow key={port}>
                    <TableCell>{port}</TableCell>
                    <TableCell>
                      {device.services && device.services[port] ? device.services[port] : "Unknown"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div>
          <h3 className="text-lg font-medium mb-2">Timeline</h3>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">First Seen</TableCell>
                <TableCell>{device.firstSeen ? formatDate(device.firstSeen) : "Unknown"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Last Seen</TableCell>
                <TableCell>{device.lastSeen ? formatDate(device.lastSeen) : "Unknown"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {device.signalStrength !== null && (
          <div>
            <h3 className="text-lg font-medium mb-2">Signal Strength</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{device.signalStrength}%</span>
              </div>
              <Progress
                value={device.signalStrength}
                className={`${
                  device.signalStrength > 70
                    ? "bg-green-100 [&>div]:bg-green-500"
                    : device.signalStrength > 30
                      ? "bg-yellow-100 [&>div]:bg-yellow-500"
                      : "bg-red-100 [&>div]:bg-red-500"
                }`}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderNetworkResults = (data: any) => {
    return (
      <Tabs defaultValue="devices">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-3">
          <TabsTrigger value="devices">Devices ({data.devices.length})</TabsTrigger>
          <TabsTrigger value="summary">Network Summary</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities ({data.vulnerabilities.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.devices.map((device: any, index: number) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center">
                      {getDeviceIcon(device.type)}
                      <span className="ml-2">{device.name || device.hostname || device.ip}</span>
                    </CardTitle>
                    <Badge variant={device.status === "online" ? "default" : "outline"}>{device.status}</Badge>
                  </div>
                  <CardDescription>
                    {device.brand} {device.model}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IP Address</span>
                      <span>{device.ip}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">MAC Address</span>
                      <span className="font-mono text-xs">{device.mac}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">OS</span>
                      <span>{device.os || "Unknown"}</span>
                    </div>
                    {device.openPorts && device.openPorts.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Open Ports</span>
                        <span>{device.openPorts.join(", ")}</span>
                      </div>
                    )}
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4"
                        onClick={() => setSelectedDevice(device)}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          {getDeviceIcon(device.type)}
                          <span className="ml-2">
                            {device.name || device.hostname || device.ip} ({device.ip})
                          </span>
                        </DialogTitle>
                        <DialogDescription>
                          {device.brand} {device.model} - {device.os || "Unknown OS"}
                        </DialogDescription>
                      </DialogHeader>
                      <DeviceDetails device={device} />
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="summary">
          <div className="grid gap-4 md:grid-cols-2">
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
                      <span className="text-muted-foreground">DNS Servers</span>
                      <span>{data.network.dns.join(", ")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Internet Connection</span>
                      <Badge variant={data.network.internetConnection ? "default" : "destructive"}>
                        {data.network.internetConnection ? "Connected" : "Disconnected"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Scan Time</span>
                      <span>{formatDate(data.network.scanTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Devices</span>
                      <span>{data.devices.length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(data.deviceTypes).map(([type, count]: [string, any]) => (
                    <div key={type} className="flex items-center">
                      <span className="text-muted-foreground capitalize w-24">{type}</span>
                      <Progress value={count.percentage} className="flex-1 mx-2" />
                      <span>{count.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
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
                      {vuln.deviceInfo && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Device Details</span>
                          <span>
                            {vuln.deviceInfo.brand} {vuln.deviceInfo.model} ({vuln.deviceInfo.os})
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Recommendation</span>
                        <span>{vuln.recommendation}</span>
                      </div>
                      {vuln.cve && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">CVE</span>
                          <span className="font-mono">{vuln.cve}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <Shield className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-lg font-medium">No vulnerabilities found</h3>
                  <p className="text-muted-foreground mt-2">
                    Your network appears to be secure. No vulnerabilities were detected during the scan.
                  </p>
                </div>
              </CardContent>
            </Card>
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

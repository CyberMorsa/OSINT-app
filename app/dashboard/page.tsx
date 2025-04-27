import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Mail, Phone, Wifi } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const modules = [
    {
      title: "User Search",
      description: "Search for usernames across social networks",
      icon: Search,
      href: "/dashboard/users",
      color: "bg-blue-500",
    },
    {
      title: "Email Search",
      description: "Find information about email addresses",
      icon: Mail,
      href: "/dashboard/emails",
      color: "bg-green-500",
    },
    {
      title: "Phone Search",
      description: "Lookup phone numbers and carrier information",
      icon: Phone,
      href: "/dashboard/phones",
      color: "bg-purple-500",
    },
    {
      title: "Network Scan",
      description: "Scan local networks for connected devices",
      icon: Wifi,
      href: "/dashboard/networks",
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Select a module to start your OSINT research</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {modules.map((module) => (
          <Link href={module.href} key={module.title}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{module.title}</CardTitle>
                <div className={`${module.color} p-2 rounded-full`}>
                  <module.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{module.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

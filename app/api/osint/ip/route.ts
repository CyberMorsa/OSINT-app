import { NextResponse } from "next/server"
import { getIpGeolocation, checkIpAbuse } from "@/lib/public-apis"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const ip = searchParams.get("ip")

  if (!ip) {
    return NextResponse.json({ message: "IP parameter is required" }, { status: 400 })
  }

  try {
    // Obtener información de geolocalización de la IP usando IPwhois
    const ipInfo = await getIpGeolocation(ip)

    if (!ipInfo || ipInfo.success === false) {
      return NextResponse.json({ message: "Failed to get IP information" }, { status: 404 })
    }

    // Verificar si la IP ha sido reportada por abuso
    const abuseInfo = await checkIpAbuse(ip)

    // Formatear la respuesta
    const ipData = {
      ip: ipInfo.ip,
      type: ipInfo.type,
      continent: ipInfo.continent,
      country: ipInfo.country,
      region: ipInfo.region,
      city: ipInfo.city,
      latitude: ipInfo.latitude,
      longitude: ipInfo.longitude,
      isp: {
        name: ipInfo.connection?.isp || "Unknown",
        domain: ipInfo.connection?.domain || null,
        asn: ipInfo.connection?.asn || null,
        org: ipInfo.connection?.org || null,
      },
      timezone: {
        id: ipInfo.timezone?.id || null,
        abbr: ipInfo.timezone?.abbr || null,
        utc: ipInfo.timezone?.utc || null,
        current_time: ipInfo.timezone?.current_time || null,
      },
      security: {
        isProxy: ipInfo.security?.proxy || false,
        isTor: ipInfo.security?.tor || false,
        isVpn: ipInfo.security?.vpn || false,
        isHosting: ipInfo.security?.hosting || false,
        threatLevel: ipInfo.security?.threat_level || "low",
      },
      flag: ipInfo.flag?.img || null,
      abuse: abuseInfo
        ? {
            checkUrl: abuseInfo.checkUrl,
            score: abuseInfo.score,
            reports: abuseInfo.reports,
            lastReported: abuseInfo.lastReported,
          }
        : null,
    }

    return NextResponse.json(ipData)
  } catch (error: any) {
    console.error("Error searching for IP:", error)
    return NextResponse.json({ message: error.message || "Failed to search for IP" }, { status: 500 })
  }
}

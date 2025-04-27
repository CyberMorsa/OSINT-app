import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Aquí normalmente llamaríamos a herramientas como Nmap o arp-scan
    // Por ahora, simularemos algunos resultados

    // Simular dispositivos en la red
    const deviceTypes = ["smartphone", "laptop", "server", "iot"]
    const vendors = ["Apple", "Samsung", "Dell", "HP", "Cisco", "Netgear", "TP-Link", null]

    // Generar entre 5 y 15 dispositivos
    const deviceCount = Math.floor(Math.random() * 10) + 5
    const devices = Array.from({ length: deviceCount }).map((_, index) => {
      const type = deviceTypes[Math.floor(Math.random() * deviceTypes.length)]
      const ip = `192.168.1.${index + 1}`
      const mac = Array.from({ length: 6 })
        .map(() =>
          Math.floor(Math.random() * 256)
            .toString(16)
            .padStart(2, "0"),
        )
        .join(":")

      return {
        ip,
        mac,
        name: Math.random() > 0.3 ? `Device-${index + 1}` : null,
        type,
        vendor: vendors[Math.floor(Math.random() * vendors.length)],
        status: Math.random() > 0.2 ? "online" : "offline",
        openPorts:
          Math.random() > 0.5
            ? Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map(
                () => [21, 22, 23, 25, 80, 443, 8080][Math.floor(Math.random() * 7)],
              )
            : [],
      }
    })

    // Contar tipos de dispositivos
    const deviceTypeCount: Record<string, { count: number; percentage: number }> = {}
    devices.forEach((device) => {
      if (!deviceTypeCount[device.type]) {
        deviceTypeCount[device.type] = { count: 0, percentage: 0 }
      }
      deviceTypeCount[device.type].count++
    })

    // Calcular porcentajes
    Object.keys(deviceTypeCount).forEach((type) => {
      deviceTypeCount[type].percentage = Math.round((deviceTypeCount[type].count / devices.length) * 100)
    })

    // Simular vulnerabilidades
    const vulnerabilityCount = Math.floor(Math.random() * 3)
    const vulnerabilities = Array.from({ length: vulnerabilityCount }).map(() => {
      const randomDevice = devices[Math.floor(Math.random() * devices.length)]
      const severities = ["low", "medium", "high"]
      const severity = severities[Math.floor(Math.random() * severities.length)]

      const vulnTypes = [
        {
          title: "Default credentials",
          description: "Device is using default login credentials",
          recommendation: "Change default username and password",
        },
        {
          title: "Open SSH port",
          description: "SSH port (22) is open and accessible",
          recommendation: "Restrict SSH access or disable if not needed",
        },
        {
          title: "Outdated firmware",
          description: "Device is running outdated firmware with known vulnerabilities",
          recommendation: "Update to the latest firmware version",
        },
      ]

      const vulnType = vulnTypes[Math.floor(Math.random() * vulnTypes.length)]

      return {
        device: randomDevice.name || randomDevice.ip,
        severity,
        ...vulnType,
      }
    })

    return NextResponse.json({
      network: {
        name: "Home Network",
        ipRange: "192.168.1.0/24",
        gateway: "192.168.1.1",
      },
      devices,
      deviceTypes: deviceTypeCount,
      vulnerabilities,
    })
  } catch (error: any) {
    console.error("Error scanning network:", error)
    return NextResponse.json({ message: error.message || "Failed to scan network" }, { status: 500 })
  }
}

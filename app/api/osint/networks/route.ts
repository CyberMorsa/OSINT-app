import { NextResponse } from "next/server"
import { getLocalNetworkDevices } from "@/lib/public-apis"

export async function GET() {
  try {
    // Intentar obtener información real de dispositivos en la red
    const realDevices = await getLocalNetworkDevices()

    // Explicación para el usuario sobre las limitaciones
    const networkScanExplanation = {
      message: "Información importante sobre el escaneo de red",
      details: [
        "El escaneo de red completo no es posible directamente desde un navegador web debido a restricciones de seguridad.",
        "Para obtener información real de dispositivos conectados, necesitarías ejecutar un servidor local con herramientas como nmap.",
        "Los datos mostrados son simulados para fines de demostración.",
        "Para una implementación real, considera usar una aplicación de escritorio o un servidor local.",
      ],
      alternatives: [
        "Usar herramientas como Advanced IP Scanner, Angry IP Scanner o Fing Desktop",
        "Configurar un servidor local con nmap y crear una API que se comunique con tu aplicación web",
        "Acceder directamente a la interfaz de administración de tu router",
      ],
    }

    // Aquí normalmente llamaríamos a herramientas como Nmap o arp-scan
    // Por ahora, simularemos resultados más detallados

    // Información más detallada sobre dispositivos
    const deviceTypes = [
      {
        type: "smartphone",
        models: [
          { brand: "Apple", model: "iPhone 13", os: "iOS 15.4" },
          { brand: "Samsung", model: "Galaxy S22", os: "Android 12" },
          { brand: "Google", model: "Pixel 6", os: "Android 12" },
          { brand: "Xiaomi", model: "Mi 11", os: "MIUI 13" },
        ],
      },
      {
        type: "laptop",
        models: [
          { brand: "Apple", model: "MacBook Pro", os: "macOS Monterey" },
          { brand: "Dell", model: "XPS 13", os: "Windows 11" },
          { brand: "HP", model: "Spectre x360", os: "Windows 11" },
          { brand: "Lenovo", model: "ThinkPad X1", os: "Ubuntu 22.04" },
        ],
      },
      {
        type: "desktop",
        models: [
          { brand: "Dell", model: "Inspiron Desktop", os: "Windows 11" },
          { brand: "HP", model: "Pavilion", os: "Windows 10" },
          { brand: "Apple", model: "iMac", os: "macOS Monterey" },
          { brand: "Custom", model: "Gaming PC", os: "Windows 11" },
        ],
      },
      {
        type: "iot",
        models: [
          { brand: "Amazon", model: "Echo Dot", os: "Amazon Voice Service" },
          { brand: "Google", model: "Nest Hub", os: "Google Assistant" },
          { brand: "Philips", model: "Hue Bridge", os: "Hue OS" },
          { brand: "Samsung", model: "SmartThings Hub", os: "SmartThings OS" },
        ],
      },
      {
        type: "router",
        models: [
          { brand: "Cisco", model: "Linksys EA8300", os: "Linksys OS" },
          { brand: "Netgear", model: "Nighthawk R7000", os: "Netgear OS" },
          { brand: "TP-Link", model: "Archer C7", os: "TP-Link OS" },
          { brand: "Asus", model: "RT-AX88U", os: "ASUSWRT" },
        ],
      },
    ]

    const vendors = [
      { prefix: "00:0C:29", name: "VMware" },
      { prefix: "00:50:56", name: "VMware" },
      { prefix: "00:1A:11", name: "Google" },
      { prefix: "00:03:93", name: "Apple" },
      { prefix: "00:0D:3A", name: "Microsoft" },
      { prefix: "00:13:3B", name: "Speed Dragon" },
      { prefix: "00:18:8B", name: "Dell" },
      { prefix: "00:25:00", name: "Apple" },
      { prefix: "00:26:BB", name: "Apple" },
      { prefix: "00:1E:C2", name: "Apple" },
      { prefix: "00:17:88", name: "Philips" },
      { prefix: "00:0E:8F", name: "Sercomm" },
      { prefix: "00:0F:66", name: "Cisco-Linksys" },
      { prefix: "00:14:6C", name: "Netgear" },
      { prefix: "00:18:4D", name: "Netgear" },
      { prefix: "00:26:F2", name: "Netgear" },
      { prefix: "00:1D:7E", name: "Cisco-Linksys" },
      { prefix: "00:21:29", name: "Cisco-Linksys" },
      { prefix: "00:23:69", name: "Cisco-Linksys" },
      { prefix: "00:25:9C", name: "Cisco-Linksys" },
      { prefix: "00:1A:70", name: "Cisco-Linksys" },
      { prefix: "00:0F:66", name: "Cisco-Linksys" },
      { prefix: "00:13:10", name: "Cisco-Linksys" },
      { prefix: "00:18:F8", name: "Cisco-Linksys" },
      { prefix: "00:1E:E5", name: "Cisco-Linksys" },
      { prefix: "00:21:29", name: "Cisco-Linksys" },
      { prefix: "00:23:69", name: "Cisco-Linksys" },
      { prefix: "00:25:9C", name: "Cisco-Linksys" },
      { prefix: "00:1A:70", name: "Cisco-Linksys" },
      { prefix: "00:0F:66", name: "Cisco-Linksys" },
      { prefix: "00:13:10", name: "Cisco-Linksys" },
      { prefix: "00:18:F8", name: "Cisco-Linksys" },
      { prefix: "00:1E:E5", name: "Cisco-Linksys" },
      { prefix: "00:21:29", name: "Cisco-Linksys" },
      { prefix: "00:23:69", name: "Cisco-Linksys" },
      { prefix: "00:25:9C", name: "Cisco-Linksys" },
      { prefix: "00:1A:70", name: "Cisco-Linksys" },
      { prefix: "00:0F:66", name: "Cisco-Linksys" },
      { prefix: "00:13:10", name: "Cisco-Linksys" },
      { prefix: "00:18:F8", name: "Cisco-Linksys" },
      { prefix: "00:1E:E5", name: "Cisco-Linksys" },
      { prefix: "00:21:29", name: "Cisco-Linksys" },
      { prefix: "00:23:69", name: "Cisco-Linksys" },
      { prefix: "00:25:9C", name: "Cisco-Linksys" },
      { prefix: "00:1A:70", name: "Cisco-Linksys" },
    ]

    // Generar entre 5 y 15 dispositivos
    const deviceCount = Math.floor(Math.random() * 10) + 5
    const devices = Array.from({ length: deviceCount }).map((_, index) => {
      // Seleccionar un tipo de dispositivo aleatorio
      const deviceTypeInfo = deviceTypes[Math.floor(Math.random() * deviceTypes.length)]
      const type = deviceTypeInfo.type

      // Seleccionar un modelo aleatorio para ese tipo
      const modelInfo = deviceTypeInfo.models[Math.floor(Math.random() * deviceTypeInfo.models.length)]

      // Generar MAC aleatoria
      const macParts = Array.from({ length: 6 }).map(() =>
        Math.floor(Math.random() * 256)
          .toString(16)
          .padStart(2, "0"),
      )

      const mac = macParts.join(":")

      // Buscar el fabricante basado en el prefijo MAC
      const macPrefix = mac.substring(0, 8)
      const vendorInfo = vendors.find((v) => v.prefix.toLowerCase() === macPrefix.toLowerCase())
      const vendor = vendorInfo ? vendorInfo.name : modelInfo.brand

      // Generar IP
      const ip = `192.168.1.${index + 1}`

      // Determinar si está online (la mayoría lo estarán)
      const status = Math.random() > 0.2 ? "online" : "offline"

      // Generar puertos abiertos para algunos dispositivos
      const hasOpenPorts = Math.random() > 0.5
      const openPorts = hasOpenPorts
        ? Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map(
            () => [21, 22, 23, 25, 80, 443, 8080, 8443, 3389, 5900][Math.floor(Math.random() * 10)],
          )
        : []

      // Generar servicios para los puertos abiertos
      const services = {}
      if (openPorts.length > 0) {
        openPorts.forEach((port) => {
          const serviceMap = {
            21: "FTP",
            22: "SSH",
            23: "Telnet",
            25: "SMTP",
            80: "HTTP",
            443: "HTTPS",
            8080: "HTTP-Proxy",
            8443: "HTTPS-Alt",
            3389: "RDP",
            5900: "VNC",
          }
          services[port] = serviceMap[port] || "Unknown"
        })
      }

      // Generar información adicional
      const lastSeen = new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString()
      const firstSeen = new Date(Date.now() - Math.floor(Math.random() * 86400000 * 30)).toISOString()

      return {
        ip,
        mac,
        name: Math.random() > 0.3 ? `Device-${index + 1}` : null,
        type,
        model: modelInfo.model,
        brand: modelInfo.brand,
        os: modelInfo.os,
        vendor,
        status,
        openPorts,
        services,
        lastSeen,
        firstSeen,
        signalStrength: type === "smartphone" || type === "laptop" ? Math.floor(Math.random() * 100) : null,
        hostname:
          Math.random() > 0.6 ? `${modelInfo.brand.toLowerCase()}-${Math.random().toString(36).substring(2, 6)}` : null,
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
          cve: Math.random() > 0.5 ? `CVE-2023-${Math.floor(Math.random() * 10000)}` : null,
        },
        {
          title: "Open SSH port",
          description: "SSH port (22) is open and accessible",
          recommendation: "Restrict SSH access or disable if not needed",
          cve: Math.random() > 0.5 ? `CVE-2022-${Math.floor(Math.random() * 10000)}` : null,
        },
        {
          title: "Outdated firmware",
          description: `Device is running outdated ${randomDevice.os} with known vulnerabilities`,
          recommendation: "Update to the latest firmware version",
          cve: Math.random() > 0.5 ? `CVE-2021-${Math.floor(Math.random() * 10000)}` : null,
        },
        {
          title: "Insecure web interface",
          description: "Web management interface uses HTTP instead of HTTPS",
          recommendation: "Enable HTTPS and disable HTTP access",
          cve: Math.random() > 0.5 ? `CVE-2022-${Math.floor(Math.random() * 10000)}` : null,
        },
        {
          title: "UPnP enabled",
          description: "Universal Plug and Play is enabled and could be exploited",
          recommendation: "Disable UPnP if not required",
          cve: Math.random() > 0.5 ? `CVE-2020-${Math.floor(Math.random() * 10000)}` : null,
        },
      ]

      const vulnType = vulnTypes[Math.floor(Math.random() * vulnTypes.length)]

      return {
        device: randomDevice.name || randomDevice.ip,
        deviceInfo: {
          ip: randomDevice.ip,
          mac: randomDevice.mac,
          model: randomDevice.model,
          brand: randomDevice.brand,
          os: randomDevice.os,
        },
        severity,
        ...vulnType,
      }
    })

    return NextResponse.json({
      explanation: networkScanExplanation,
      network: {
        name: "Home Network",
        ipRange: "192.168.1.0/24",
        gateway: "192.168.1.1",
        dns: ["8.8.8.8", "8.8.4.4"],
        scanTime: new Date().toISOString(),
        internetConnection: true,
      },
      devices,
      deviceTypes: deviceTypeCount,
      vulnerabilities,
      realDevicesInfo: realDevices,
    })
  } catch (error: any) {
    console.error("Error scanning network:", error)
    return NextResponse.json({ message: error.message || "Failed to scan network" }, { status: 500 })
  }
}

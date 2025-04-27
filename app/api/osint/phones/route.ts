import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const phone = searchParams.get("phone")

  if (!phone) {
    return NextResponse.json({ message: "Phone parameter is required" }, { status: 400 })
  }

  try {
    // Aquí normalmente llamaríamos a APIs como Numverify o Truecaller
    // Por ahora, simularemos algunos resultados

    // Determinar si el número es válido (formato simple)
    const valid = /^\+?[0-9]{10,15}$/.test(phone.replace(/\s+/g, ""))

    // Simular información del país basada en el prefijo
    let countryCode = "US"
    let countryName = "United States"

    if (phone.includes("+34") || phone.includes("34")) {
      countryCode = "ES"
      countryName = "Spain"
    } else if (phone.includes("+44") || phone.includes("44")) {
      countryCode = "GB"
      countryName = "United Kingdom"
    } else if (phone.includes("+33") || phone.includes("33")) {
      countryCode = "FR"
      countryName = "France"
    }

    // Simular operadores según el país
    const carriers = {
      US: ["AT&T", "Verizon", "T-Mobile", "Sprint"],
      ES: ["Movistar", "Vodafone", "Orange", "Yoigo"],
      GB: ["Vodafone UK", "EE", "O2", "Three"],
      FR: ["Orange", "SFR", "Bouygues Telecom", "Free Mobile"],
    }

    const carrier =
      carriers[countryCode as keyof typeof carriers][
        Math.floor(Math.random() * carriers[countryCode as keyof typeof carriers].length)
      ]

    // Simular ubicaciones según el país
    const locations = {
      US: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
      ES: ["Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza"],
      GB: ["London", "Manchester", "Birmingham", "Glasgow", "Liverpool"],
      FR: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice"],
    }

    const location =
      locations[countryCode as keyof typeof locations][
        Math.floor(Math.random() * locations[countryCode as keyof typeof locations].length)
      ]

    // Simular tipos de línea
    const lineTypes = ["mobile", "landline", "voip"]
    const lineType = lineTypes[Math.floor(Math.random() * lineTypes.length)]

    // Simular niveles de riesgo
    const risks = ["low", "medium", "high"]
    const risk = risks[Math.floor(Math.random() * risks.length)]

    // Simular información del propietario (solo a veces)
    const hasOwnerInfo = Math.random() > 0.5

    const ownerInfo = hasOwnerInfo
      ? {
          name: Math.random() > 0.3 ? "John Doe" : null,
          email: Math.random() > 0.7 ? "john.doe@example.com" : null,
          address: Math.random() > 0.8 ? "123 Main St, " + location : null,
        }
      : null

    return NextResponse.json({
      number: phone,
      formatted: phone.startsWith("+") ? phone : `+${phone}`,
      valid,
      country: {
        code: countryCode,
        name: countryName,
      },
      location,
      carrier,
      line_type: lineType,
      risk,
      owner: ownerInfo,
    })
  } catch (error: any) {
    console.error("Error searching for phone:", error)
    return NextResponse.json({ message: error.message || "Failed to search for phone number" }, { status: 500 })
  }
}

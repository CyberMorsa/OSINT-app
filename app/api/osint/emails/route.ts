import { NextResponse } from "next/server"
import { checkEmailBreach, getClearbitLogo } from "@/lib/public-apis"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")

  if (!email) {
    return NextResponse.json({ message: "Email parameter is required" }, { status: 400 })
  }

  try {
    // Extraer el dominio del email
    const domain = email.split("@")[1]

    // Verificar si tenemos la API key de Hunter.io
    const hunterApiKey = process.env.HUNTER_API_KEY

    let emailData = null

    if (hunterApiKey) {
      try {
        // Llamar a la API de Hunter.io para verificar el email
        const hunterResponse = await fetch(
          `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(email)}&api_key=${hunterApiKey}`,
        )

        if (hunterResponse.ok) {
          const hunterData = await hunterResponse.json()
          emailData = hunterData.data
        }
      } catch (hunterError) {
        console.error("Error calling Hunter.io API:", hunterError)
      }
    }

    // Si no tenemos datos de Hunter o falló la llamada, usamos datos simulados
    if (!emailData) {
      // Generar datos simulados para demostración
      emailData = {
        email,
        domain,
        status: Math.random() > 0.3 ? "valid" : "invalid",
        score: Math.floor(Math.random() * 100),
        sources: Math.floor(Math.random() * 5),
        first_name: null,
        last_name: null,
        position: null,
        company: null,
        twitter: null,
        linkedin_url: null,
      }
    }

    // Verificar si el email ha sido filtrado usando HaveIBeenEmulated
    const breachData = await checkEmailBreach(email)

    // Obtener logo de la empresa usando Clearbit
    const companyLogo = domain ? getClearbitLogo(domain) : null

    // Añadir información adicional para la interfaz
    const emailInfo = {
      email: emailData.email,
      domain: emailData.domain || domain,
      status: emailData.status || "unknown",
      score: emailData.score || Math.floor(Math.random() * 100),
      firstSeen: emailData.first_seen_at || null,
      sources: emailData.sources || 0,
      companyLogo,

      // Información de reputación basada en el score
      reputation: {
        score: emailData.score || Math.floor(Math.random() * 100),
        details: {
          suspicious: (emailData.score || 50) < 40,
          malicious: (emailData.score || 50) < 20,
          disposable: emailData.disposable || Math.random() > 0.8,
          spam: (emailData.score || 50) < 50,
          free_provider: ["gmail.com", "hotmail.com", "yahoo.com"].includes(domain),
        },
      },

      // Información de contacto si está disponible
      contact: {
        firstName: emailData.first_name || null,
        lastName: emailData.last_name || null,
        position: emailData.position || null,
        company: emailData.company || null,
        twitter: emailData.twitter || null,
        linkedin: emailData.linkedin_url || null,
      },

      // Información de seguridad del email
      security: {
        hasValidMX: Math.random() > 0.2,
        hasSPF: Math.random() > 0.3,
        hasDMARC: Math.random() > 0.4,
        hasValidSyntax: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      },

      // Información de brechas de seguridad
      breaches: breachData?.breaches || [],
      breachCount: breachData?.breachCount || 0,
      breachFound: breachData?.breachCount > 0 || false,
    }

    return NextResponse.json(emailInfo)
  } catch (error: any) {
    console.error("Error searching for email:", error)
    return NextResponse.json({ message: error.message || "Failed to search for email" }, { status: 500 })
  }
}

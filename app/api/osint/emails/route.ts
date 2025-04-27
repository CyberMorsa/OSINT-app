import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")

  if (!email) {
    return NextResponse.json({ message: "Email parameter is required" }, { status: 400 })
  }

  try {
    // Aquí normalmente llamaríamos a APIs como Hunter.io, EmailRep.io o HaveIBeenPwned
    // Por ahora, simularemos algunos resultados

    const domain = email.split("@")[1]

    // Simular breaches
    const possibleBreaches = [
      { name: "LinkedIn", date: "2021-06-22", dataTypes: ["Email", "Password", "Name"] },
      { name: "Adobe", date: "2020-10-15", dataTypes: ["Email", "Password"] },
      { name: "Dropbox", date: "2019-03-04", dataTypes: ["Email", "Password", "Name", "Phone"] },
      { name: "Canva", date: "2019-05-24", dataTypes: ["Email", "Password", "Name"] },
      { name: "Marriott", date: "2018-11-30", dataTypes: ["Email", "Name", "Phone", "Address"] },
    ]

    // Seleccionar aleatoriamente algunas brechas
    const breaches = possibleBreaches.filter(() => Math.random() > 0.6)

    // Simular puntuación de reputación
    const reputationScore = Math.floor(Math.random() * 100)

    return NextResponse.json({
      email,
      domain,
      firstSeen: Math.random() > 0.5 ? "2020-01-15" : null,
      breaches,
      reputation: {
        score: reputationScore,
        details: {
          suspicious: reputationScore < 40,
          malicious: reputationScore < 20,
          disposable: Math.random() > 0.8,
          spam: reputationScore < 50,
          free_provider: ["gmail.com", "hotmail.com", "yahoo.com"].includes(domain),
        },
      },
    })
  } catch (error: any) {
    console.error("Error searching for email:", error)
    return NextResponse.json({ message: error.message || "Failed to search for email" }, { status: 500 })
  }
}

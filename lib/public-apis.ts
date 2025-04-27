/**
 * Utilidades para APIs públicas gratuitas que no requieren API key
 */

// Clearbit Logo API - Obtener logos de empresas basado en dominio
export function getClearbitLogo(domain: string): string {
  return `https://logo.clearbit.com/${domain}`
}

// IP Geolocation by IPwhois - Información de geolocalización de IP
export async function getIpGeolocation(ip: string) {
  try {
    const response = await fetch(`https://ipwho.is/${ip}`)
    if (!response.ok) {
      throw new Error("Error al obtener información de geolocalización")
    }
    return await response.json()
  } catch (error) {
    console.error("Error en getIpGeolocation:", error)
    return null
  }
}

// HaveIBeenEmulated - Verificar si un email ha sido filtrado (alternativa a HIBP)
export async function checkEmailBreach(email: string) {
  try {
    const encodedEmail = encodeURIComponent(email)
    const response = await fetch(`https://haveibeenemulated.com/api?email=${encodedEmail}`)
    if (!response.ok) {
      throw new Error("Error al verificar filtraciones de email")
    }
    return await response.json()
  } catch (error) {
    console.error("Error en checkEmailBreach:", error)
    return null
  }
}

// GitHub Search API - Buscar usuarios en GitHub
export async function searchGitHubUser(username: string) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`)
    if (response.status === 404) {
      return { found: false }
    }
    if (!response.ok) {
      throw new Error("Error al buscar usuario en GitHub")
    }
    const userData = await response.json()

    // Obtener repositorios públicos
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=5&sort=updated`)
    const repos = reposResponse.ok ? await reposResponse.json() : []

    return {
      found: true,
      profile: userData,
      repos,
    }
  } catch (error) {
    console.error("Error en searchGitHubUser:", error)
    return { found: false }
  }
}

// AbuseIPDB - Comprobar si una IP ha sido reportada por abuso (versión limitada sin API key)
export async function checkIpAbuse(ip: string) {
  try {
    // Sin API key solo podemos devolver un enlace para verificación manual
    return {
      checkUrl: `https://www.abuseipdb.com/check/${ip}`,
      // Simulamos algunos datos básicos
      score: null,
      reports: null,
      lastReported: null,
    }
  } catch (error) {
    console.error("Error en checkIpAbuse:", error)
    return null
  }
}

// Función para obtener información de dispositivos en la red local
export async function getLocalNetworkDevices() {
  try {
    // Esta función simula la obtención de dispositivos de la red local
    // En un entorno real, esto requeriría acceso al router o usar herramientas como nmap
    // que no son accesibles desde un navegador por razones de seguridad

    // Para una implementación real, necesitarías:
    // 1. Un servidor local ejecutando herramientas como nmap
    // 2. Una API en ese servidor que devuelva los resultados
    // 3. Llamar a esa API desde tu aplicación web

    return {
      message:
        "Para obtener información real de dispositivos conectados, necesitas ejecutar un servidor local con herramientas como nmap",
      simulatedDevices: true,
    }
  } catch (error) {
    console.error("Error en getLocalNetworkDevices:", error)
    return null
  }
}

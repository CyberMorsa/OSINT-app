/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para optimizar el despliegue en Vercel
  reactStrictMode: true,
  swcMinify: true,
  // Configuración para manejar imágenes externas
  images: {
    domains: ['placeholder.com'],
    unoptimized: true,
  },
  // Configuración para el middleware
  experimental: {
    serverActions: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig

import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The old multi-page site lived at these paths — keep shared links working.
  async redirects() {
    return ["/about", "/projects", "/contact"].map((source) => ({ source, destination: "/", permanent: true }))
  },
}

export default nextConfig

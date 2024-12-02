/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/herbal-wisdom',
  assetPrefix: '/herbal-wisdom/',
  images: {
    domains: ['ptkbqrpxyoxfsigolskz.supabase.co'],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/herbal-wisdom/api/:path*',
          destination: '/api/:path*',
        },
      ],
    }
  },
}

module.exports = nextConfig

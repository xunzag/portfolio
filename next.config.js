/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [
        'cdn.jsdelivr.net',
        'upload.wikimedia.org',
        'raw.githubusercontent.com',
        'randomuser.me',
        'i.ibb.co',
        'cdn.myanimelist.net',
        'lh3.googleusercontent.com',
        'logo.clearbit.com'
      ],
    },
    typescript: {
      ignoreBuildErrors: true, // Ignores TypeScript errors during build
    },
  }
  
  module.exports = nextConfig
  
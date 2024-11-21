/**
 * @type {import('next').NextConfig}
 */


const nextConfig =  {
    reactStrictMode: false,
    trailingSlash: false,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
      ],
    },
  }

  module.exports = nextConfig


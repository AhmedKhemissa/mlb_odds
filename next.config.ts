import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static optimization for better performance
  trailingSlash: false,
  
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.mlb.com',
      },
      {
        protocol: 'https',
        hostname: 'logos.mlb.com',
      }
    ],
    // Optimize logo loading
    deviceSizes: [16, 32, 48, 64, 96, 128],
    imageSizes: [16, 32, 48, 64, 96, 128],
  },

  // Security headers for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  },

  // Build optimization
  compress: true,
  
  // Enable SWC minification for better performance
  swcMinify: true,
};

export default nextConfig;

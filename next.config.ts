import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eqrnhujkvvuipymdtekk.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/halal-restaurants-%D8%AF%D8%A8%D9%8A', // /halal-restaurants-دبي
        destination: '/halal-restaurants-dubai',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

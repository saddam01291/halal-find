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
      {
        source: '/bras-lia/coco-bambu-3',
        destination: '/bras-lia/c-o-c-o-b-a-m-b-u-2',
        permanent: true,
      },
      {
        source: '/gurgaon/d-u-n-k-i-n-d-o-n-u-t-s-3',
        destination: '/gurgaon/d-u-n-k-i-n-d-o-n-u-t-s',
        permanent: true,
      },
      {
        source: '/gurgaon/s-u-b-w-a-y-3',
        destination: '/gurgaon/s-u-b-w-a-y',
        permanent: true,
      },
      {
        source: '/gurgaon/m-c-d-o-n-a-l-d-s-2',
        destination: '/gurgaon/m-c-d-o-n-a-l-d-s',
        permanent: true,
      },
      {
        source: '/gurgaon/d-o-m-i-n-o-s-p-i-z-z-a-2',
        destination: '/gurgaon/d-o-m-i-n-o-s-p-i-z-z-a',
        permanent: true,
      },
      {
        source: '/gurgaon/c-a-f-e-c-o-f-f-e-e-d-a-y-2',
        destination: '/gurgaon/c-a-f-e-c-o-f-f-e-e-d-a-y',
        permanent: true,
      },
      {
        source: '/gurgaon/c-h-a-i-p-o-i-n-t',
        destination: '/gurgaon/c-h-a-i-p-o-i-n-t-2',
        permanent: true,
      },
      {
        source: '/gurgaon/t-e-a-h-a-l-t-2',
        destination: '/gurgaon/t-e-a-h-a-l-t',
        permanent: true,
      },
      {
        source: '/mumbai/t-e-a-v-i-l-l-a-c-a-f-e-3',
        destination: '/mumbai/t-e-a-v-i-l-l-a-c-a-f-e',
        permanent: true,
      },
      {
        source: '/mumbai/t-e-a-v-i-l-l-a-c-a-f-e-2',
        destination: '/mumbai/t-e-a-v-i-l-l-a-c-a-f-e',
        permanent: true,
      },
      {
        source: '/new-delhi/d-o-m-i-n-o-s-p-i-z-z-a',
        destination: '/new-delhi/d-o-m-i-n-o-s-p-i-z-z-a-4',
        permanent: true,
      },
      {
        source: '/new-delhi/d-o-m-i-n-o-s-p-i-z-z-a-3',
        destination: '/new-delhi/d-o-m-i-n-o-s-p-i-z-z-a-4',
        permanent: true,
      },
      {
        source: '/new-delhi/c-h-a-a-y-o-s',
        destination: '/new-delhi/c-h-a-a-y-o-s-2',
        permanent: true,
      },
      {
        source: '/new-delhi/c-h-a-a-y-o-s-3',
        destination: '/new-delhi/c-h-a-a-y-o-s-2',
        permanent: true,
      },
      {
        source: '/new-delhi/c-h-a-a-y-o-s-4',
        destination: '/new-delhi/c-h-a-a-y-o-s-2',
        permanent: true,
      },
      {
        source: '/new-delhi/s-u-b-w-a-y-2',
        destination: '/new-delhi/s-u-b-w-a-y-5',
        permanent: true,
      },
      {
        source: '/new-delhi/s-u-b-w-a-y',
        destination: '/new-delhi/s-u-b-w-a-y-5',
        permanent: true,
      },
      {
        source: '/new-delhi/c-a-f-e-c-o-f-f-e-e-d-a-y-3',
        destination: '/new-delhi/c-a-f-e-c-o-f-f-e-e-d-a-y',
        permanent: true,
      },
      {
        source: '/new-delhi/c-a-f-e-c-o-f-f-e-e-d-a-y-2',
        destination: '/new-delhi/c-a-f-e-c-o-f-f-e-e-d-a-y',
        permanent: true,
      },
      {
        source: '/new-delhi/b-u-r-g-e-r-k-i-n-g-3',
        destination: '/new-delhi/b-u-r-g-e-r-k-i-n-g-4',
        permanent: true,
      },
      {
        source: '/new-delhi/b-u-r-g-e-r-k-i-n-g',
        destination: '/new-delhi/b-u-r-g-e-r-k-i-n-g-4',
        permanent: true,
      },
      {
        source: '/new-delhi/k-e-v-e-n-t-e-r-s-2',
        destination: '/new-delhi/k-e-v-e-n-t-e-r-s-4',
        permanent: true,
      },
      {
        source: '/new-delhi/k-e-v-e-n-t-e-r-s',
        destination: '/new-delhi/k-e-v-e-n-t-e-r-s-4',
        permanent: true,
      },
      {
        source: '/new-delhi/k-e-v-e-n-t-e-r-s-3',
        destination: '/new-delhi/k-e-v-e-n-t-e-r-s-4',
        permanent: true,
      },
      {
        source: '/new-delhi/k-e-v-e-n-t-e-r-s-5',
        destination: '/new-delhi/k-e-v-e-n-t-e-r-s-4',
        permanent: true,
      },
      {
        source: '/new-delhi/a-l-b-a-k-e',
        destination: '/new-delhi/a-l-b-a-k-e-2',
        permanent: true,
      },
      {
        source: '/new-delhi/o-p-e-n-o-v-e-n',
        destination: '/new-delhi/o-p-e-n-o-v-e-n-2',
        permanent: true,
      },
      {
        source: '/new-delhi/m-c-d-o-n-a-l-d-s-2',
        destination: '/new-delhi/m-c-d-o-n-a-l-d-s',
        permanent: true,
      },
      {
        source: '/noida/b-a-r-i-s-t-a',
        destination: '/noida/barista-9',
        permanent: true,
      },
      {
        source: '/noida/chaayos-8',
        destination: '/noida/c-h-a-a-y-o-s',
        permanent: true,
      },
      {
        source: '/noida/c-h-a-a-y-o-s-2',
        destination: '/noida/c-h-a-a-y-o-s',
        permanent: true,
      },
      {
        source: '/noida/c-o-s-t-a-c-o-f-f-e-e',
        destination: '/noida/costa-coffee-6',
        permanent: true,
      },
      {
        source: '/noida/d-u-n-k-i-n-d-o-n-u-t-s',
        destination: '/noida/d-u-n-k-i-n-d-o-n-u-t-s-2',
        permanent: true,
      },
      {
        source: '/noida/p-i-z-z-a-h-u-t',
        destination: '/noida/pizza-hut-11',
        permanent: true,
      },
      {
        source: '/noida/pizza-hut-10',
        destination: '/noida/pizza-hut-11',
        permanent: true,
      },
      {
        source: '/noida/p-i-z-z-a-h-u-t-2',
        destination: '/noida/pizza-hut-11',
        permanent: true,
      },
      {
        source: '/noida/b-u-r-g-e-r-k-i-n-g',
        destination: '/noida/burger-king-5',
        permanent: true,
      },
      {
        source: '/noida/s-u-b-w-a-y',
        destination: '/noida/subway-12',
        permanent: true,
      },
      {
        source: '/noida/cafe-coffee-day-12',
        destination: '/noida/cafe-coffee-day-13',
        permanent: true,
      },
      {
        source: '/jakarta/talaga-sampireun-4',
        destination: '/jakarta/talaga-sampireun-3',
        permanent: true,
      },
      {
        source: '/ankara/timboo-cafe-4',
        destination: '/ankara/timboo-cafe-3',
        permanent: true,
      },
      {
        source: '/ankara/d-vero-lu-3',
        destination: '/ankara/d-vero-lu-4',
        permanent: true,
      }
    ];
  },
    ];
  },
};

export default nextConfig;

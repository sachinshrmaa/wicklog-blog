/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/blog',

  // Uncomment and set to your blog's deployment URL for production Multi-Zone:
  // assetPrefix: 'https://blog.wicklog.in',

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

};

module.exports = nextConfig;

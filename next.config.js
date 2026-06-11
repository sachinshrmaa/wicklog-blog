/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/blog',

  // Set NEXT_PUBLIC_ASSET_PREFIX to your blog's Vercel deployment URL in production.
  // e.g. https://wicklog-blog.vercel.app  OR  https://blog.wicklog.in
  // Without this, _next/static asset requests will 404 in the multi-zone setup.
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',

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

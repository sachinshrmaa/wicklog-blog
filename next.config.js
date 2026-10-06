const postRedirects = require('./redirects');

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/blog',

  // Set NEXT_PUBLIC_ASSET_PREFIX to your blog's Vercel deployment URL in production.
  // e.g. https://wicklog-blog.vercel.app  OR  https://blog.wicklog.in
  // Without this, _next/static asset requests will 404 in the multi-zone setup.
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',

  // All post images live in /public/images. If a post ever needs a remote image,
  // add its specific host here — a "**" wildcard turns the image optimizer into an open proxy.
  images: {
    remotePatterns: [],
  },

  async redirects() {
    return postRedirects.map((r) => ({ ...r, permanent: true }));
  },
};

module.exports = nextConfig;

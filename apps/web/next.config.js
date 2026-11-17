/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@wealthtrack/types', '@wealthtrack/utils'],
  async rewrites() {
    return [{ source: '/market/:path*', destination: `${process.env.MARKETDATA_URL}/v1/:path*` }];
  },
};
module.exports = nextConfig;

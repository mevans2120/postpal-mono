import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@postpal/ui', '@postpal/content'],
  async headers() {
    // concept PoC — same noindex treatment as the prototype deployment
    return [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] }];
  }
};
export default nextConfig;

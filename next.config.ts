import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    // Next.js 的 App Router 通过内联 <script> 传输 RSC 流数据用于 hydration，
    // 因此静态渲染场景下 script-src 需要保留 'unsafe-inline'
    // （若改用 nonce 方案会强制所有页面转为动态渲染，牺牲静态缓存，对本站不划算）。
    key: 'Content-Security-Policy',
    value:
      "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'"
  }
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/guide.html',
        destination: '/guide',
        permanent: true
      }
    ];
  }
};

export default nextConfig;

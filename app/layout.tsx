import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: '明远 & 佳玮 · 婚礼邀请',
  description: '2026.10.06，诚邀你来见证我们的婚礼。',
  openGraph: {
    title: '明远 & 佳玮 · 婚礼邀请',
    description: 'SAVE THE DATE · 2026.10.06 · 吉安',
    locale: 'zh_CN',
    type: 'website',
    siteName: '明远 & 佳玮 · 婚礼邀请'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#111111'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preload" href="/assets/fonts/invitation-serif-400.woff2?v=3" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/fonts/huang-kaihua-lawyer.ttf?v=2" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}

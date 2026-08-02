import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: '吾有嘉礼 · 婚礼请柬',
  description: '吾有嘉礼，敬邀君至。',
  openGraph: {
    title: '吾有嘉礼 · 婚礼请柬',
    description: '佳期已定，敬备喜筵，恭候光临。',
    locale: 'zh_CN',
    type: 'website',
    siteName: '吾有嘉礼 · 婚礼请柬'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#8f1d24'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

import { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { GuideChat } from '@/components/guide/GuideChat';
import './guide.css';

export const metadata: Metadata = {
  title: '婚礼小助手 · 明远 & 佳玮',
  description: '查询明远与佳玮婚礼的席位、时间和场馆信息'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#111111'
};

export default function GuidePage() {
  return (
    <Suspense fallback={null}>
      <GuideChat />
    </Suspense>
  );
}

import { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { GuideChat } from '@/components/guide/GuideChat';
import './guide.css';

export const metadata: Metadata = {
  title: '智能引座官 ·《共赴》',
  description: '《共赴》一生限定场智能引座官'
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#351f1c'
};

export default function GuidePage() {
  return (
    <Suspense fallback={null}>
      <GuideChat />
    </Suspense>
  );
}

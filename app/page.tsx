import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { InvitationApp } from '@/components/invitation/InvitationApp';
import { getShareInvitation, normalizeGuest } from '@/lib/share';
import './invitation.css';

interface InvitationPageProps {
  searchParams: Promise<{ guest?: string | string[] }>;
}

function getGuest(searchParams: { guest?: string | string[] }): string {
  return normalizeGuest(Array.isArray(searchParams.guest) ? searchParams.guest[0] : searchParams.guest);
}

function getMetadataBase(requestHeaders: Headers): URL | undefined {
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (configuredOrigin) {
    try {
      return new URL(configuredOrigin);
    } catch {
      // 环境变量格式不正确时，回退到本次请求的公开域名。
    }
  }

  const host = (requestHeaders.get('x-forwarded-host') || requestHeaders.get('host') || '').split(',')[0].trim();
  const protocol = (requestHeaders.get('x-forwarded-proto') || 'https').split(',')[0].trim();
  if (!/^[a-z0-9.-]+(?::\d+)?$/i.test(host) || !/^https?$/i.test(protocol)) return undefined;

  return new URL(`${protocol}://${host}`);
}

export async function generateMetadata({ searchParams }: InvitationPageProps): Promise<Metadata> {
  const [params, requestHeaders] = await Promise.all([searchParams, headers()]);
  const guest = getGuest(params);
  const invitation = getShareInvitation(guest);
  const query = guest ? `?guest=${encodeURIComponent(guest)}` : '';
  const shareImage = `/share-card${query}`;

  return {
    metadataBase: getMetadataBase(requestHeaders),
    title: invitation,
    description: invitation,
    alternates: { canonical: `/${query}` },
    openGraph: {
      type: 'website',
      locale: 'zh_CN',
      url: `/${query}`,
      title: invitation,
      description: invitation,
      siteName: '明远 & 佳玮 · 婚礼邀请',
      images: [{ url: shareImage, width: 600, height: 600, alt: invitation }]
    },
    twitter: {
      card: 'summary_large_image',
      title: invitation,
      description: invitation,
      images: [shareImage]
    }
  };
}

export default async function InvitationPage({ searchParams }: InvitationPageProps) {
  const guest = getGuest(await searchParams);

  return <InvitationApp guest={guest} />;
}

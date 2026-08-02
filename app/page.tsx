import type { Metadata } from 'next';
import { InvitationApp } from '@/components/invitation/InvitationApp';
import { getShareInvitation, normalizeGuest } from '@/lib/share';
import './invitation.css';

interface InvitationPageProps {
  searchParams: Promise<{ guest?: string | string[] }>;
}

function getGuest(searchParams: { guest?: string | string[] }): string {
  return normalizeGuest(Array.isArray(searchParams.guest) ? searchParams.guest[0] : searchParams.guest);
}

export async function generateMetadata({ searchParams }: InvitationPageProps): Promise<Metadata> {
  const guest = getGuest(await searchParams);
  const invitation = getShareInvitation(guest);
  const query = guest ? `?guest=${encodeURIComponent(guest)}` : '';
  const shareImage = `/share-card${query}`;

  return {
    title: invitation,
    description: invitation,
    alternates: { canonical: `/${query}` },
    openGraph: {
      type: 'website',
      locale: 'zh_CN',
      url: `/${query}`,
      title: invitation,
      description: invitation,
      siteName: '吾有嘉礼 · 婚礼请柬',
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

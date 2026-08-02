import { ImageResponse } from 'next/og';
import { getShareInvitation, normalizeGuest } from '@/lib/share';
import { wedding } from '@/lib/wedding';

export const runtime = 'edge';

const font = fetch(new URL('../../public/assets/fonts/invitation-serif.woff2', import.meta.url)).then((response) =>
  response.arrayBuffer()
);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const guest = normalizeGuest(url.searchParams.get('guest'));
  const invitation = getShareInvitation(guest);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          color: '#f8e8c7',
          background:
            'radial-gradient(circle at 86% 15%, rgba(232, 184, 104, .4), transparent 27%), radial-gradient(circle at 9% 92%, rgba(112, 9, 13, .65), transparent 32%), linear-gradient(135deg, #5a080c 0%, #9e2929 52%, #4a0609 100%)'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 30,
            display: 'flex',
            border: '2px solid rgba(240, 199, 122, .72)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 47,
            display: 'flex',
            border: '1px solid rgba(240, 199, 122, .45)'
          }}
        />
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 120px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 80,
              height: 80,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 28,
              border: '2px solid #f0c777',
              color: '#f0d395',
              fontSize: 48,
              lineHeight: 1
            }}
          >
            囍
          </div>
          <div style={{ display: 'flex', color: '#e8bd72', fontSize: 22, letterSpacing: 12 }}>吾 有 嘉 礼 · 敬 候 光 临</div>
          <div style={{ display: 'flex', marginTop: 23, fontSize: 64, letterSpacing: 10 }}>
            {wedding.groom}　与　{wedding.bride}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 34,
              padding: '18px 32px',
              borderTop: '1px solid rgba(240, 199, 122, .52)',
              borderBottom: '1px solid rgba(240, 199, 122, .52)',
              color: '#fff0d3',
              fontSize: 32,
              letterSpacing: 2
            }}
          >
            {invitation}
          </div>
          <div style={{ display: 'flex', marginTop: 30, color: '#e8bd72', fontSize: 24, letterSpacing: 6 }}>
            {wedding.city} · {wedding.venue} · 2026.10.06
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Invitation Serif', data: await font, weight: 400 }]
    }
  );
}

import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getShareInvitation, normalizeGuest } from '@/lib/share';
import { wedding } from '@/lib/wedding';

// EdgeOne Pages 的 Next.js 运行器不支持 App Router 的 Edge Runtime 入口。
// ImageResponse 在 Next.js 16 的 Node.js Runtime 中同样受支持。
export const runtime = 'nodejs';

const serifFont = readFile(join(process.cwd(), 'public', 'assets', 'fonts', 'invitation-serif-share.ttf'));
const nameFont = readFile(join(process.cwd(), 'public', 'assets', 'fonts', 'huang-kaihua-lawyer.ttf'));

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
          fontFamily: 'Invitation Serif',
          background:
            'radial-gradient(circle at 86% 15%, rgba(232, 184, 104, .4), transparent 27%), radial-gradient(circle at 9% 92%, rgba(112, 9, 13, .65), transparent 32%), linear-gradient(135deg, #5a080c 0%, #9e2929 52%, #4a0609 100%)'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 8,
            display: 'flex',
            border: '2px solid rgba(240, 199, 122, .72)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 15,
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
            padding: '16px 20px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 68,
              height: 68,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
              border: '2px solid #f0c777',
              color: '#f0d395',
              fontSize: 44,
              lineHeight: 1
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 35, letterSpacing: -7 }}>
              <span>喜</span>
              <span>喜</span>
            </div>
          </div>
          <div style={{ display: 'flex', color: '#e8bd72', fontSize: 18, letterSpacing: 5 }}>吾 有 嘉 礼 · 敬 候 光 临</div>
          <div style={{ display: 'flex', marginTop: 12, fontFamily: 'Huang Kaihua Lawyer', fontSize: 54, letterSpacing: 3 }}>
            {wedding.groom}　与　{wedding.bride}
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 20,
              padding: '13px 12px',
              borderTop: '1px solid rgba(240, 199, 122, .52)',
              borderBottom: '1px solid rgba(240, 199, 122, .52)',
              color: '#fff0d3',
              fontSize: 28,
              letterSpacing: 0
            }}
          >
            {invitation}
          </div>
          <div style={{ display: 'flex', marginTop: 15, color: '#e8bd72', fontSize: 18, letterSpacing: 2 }}>
            {wedding.city} · {wedding.venue} · 2026.10.06
          </div>
        </div>
      </div>
    ),
    {
      width: 600,
      height: 600,
      fonts: [
        { name: 'Invitation Serif', data: await serifFont, weight: 400 },
        { name: 'Huang Kaihua Lawyer', data: await nameFont, weight: 400 }
      ]
    }
  );
}

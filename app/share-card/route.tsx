import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getShareInvitation, normalizeGuest } from '@/lib/share';
import { wedding } from '@/lib/wedding';

// EdgeOne Pages 的 Next.js 运行器不支持 App Router 的 Edge Runtime 入口。
// ImageResponse 在 Next.js 16 的 Node.js Runtime 中同样受支持。
export const runtime = 'nodejs';

const serifFont = readFile(join(process.cwd(), 'public', 'assets', 'fonts', 'invitation-serif-share.ttf'));

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
          color: '#11110f',
          fontFamily: 'Invitation Serif',
          background: '#f3f0e9'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 126,
            height: '100%',
            display: 'flex',
            background: '#aa1e25'
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 26,
            right: 26,
            width: 74,
            height: 74,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            border: '1px solid rgba(255,255,255,.75)',
            fontSize: 22,
            fontFamily: 'Georgia'
          }}
        >
          M&amp;J
        </div>
        <div
          style={{
            width: 474,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '34px 32px 30px',
            textAlign: 'left'
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
              paddingBottom: 12,
              borderBottom: '1px solid #11110f',
              fontFamily: 'Arial',
              fontSize: 10,
              letterSpacing: 2
            }}
          >
            <span>WEDDING INVITATION</span>
            <span>VOL. 01</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', color: '#aa1e25', fontFamily: 'Arial', fontSize: 12, letterSpacing: 3 }}>
              SAVE THE DATE · 06 OCT 2026
            </div>
            <div style={{ display: 'flex', marginTop: 14, fontSize: 58, lineHeight: 1.08, letterSpacing: -2 }}>
              {wedding.groom}
              <br />
              &amp; {wedding.bride}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              width: '100%',
              paddingTop: 16,
              borderTop: '1px solid #11110f',
              color: '#383834',
              fontSize: 21,
              lineHeight: 1.4
            }}
          >
            {invitation}
          </div>
          <div style={{ display: 'flex', fontFamily: 'Arial', fontSize: 12, letterSpacing: 2 }}>
            {wedding.city} · {wedding.venue} · 2026.10.06
          </div>
        </div>
      </div>
    ),
    {
      width: 600,
      height: 600,
      fonts: [
        { name: 'Invitation Serif', data: await serifFont, weight: 400 }
      ]
    }
  );
}

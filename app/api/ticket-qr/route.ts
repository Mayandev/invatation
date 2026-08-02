import { NextResponse } from 'next/server';
import { TicketQrError, renderTicketQr } from '@/lib/ticket-qr';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const text = url.searchParams.get('text') || '';

  try {
    const requestProtocol = (request.headers.get('x-forwarded-proto') || 'https').split(',')[0].trim();
    const requestOrigin = `${requestProtocol}://${request.headers.get('host')}`;
    const svg = await renderTicketQr({ text, requestOrigin });
    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'private, max-age=300',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  } catch (error) {
    const status = error instanceof TicketQrError ? error.status : 400;
    const message = error instanceof Error ? error.message : '二维码生成失败';
    return NextResponse.json({ error: message }, { status });
  }
}

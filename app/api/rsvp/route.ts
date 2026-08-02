import { NextResponse } from 'next/server';
import { HttpError, submitRsvp } from '@/lib/rsvp';

export async function POST(request: Request) {
  let input: unknown = {};
  try {
    const raw = await request.text();
    input = raw ? JSON.parse(raw) : {};
  } catch {
    return NextResponse.json({ error: '提交内容格式不正确' }, { status: 400 });
  }

  try {
    const result = await submitRsvp((input && typeof input === 'object' ? input : {}) as Record<string, unknown>);
    return NextResponse.json(result, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    const message = error instanceof Error ? error.message : '登记暂未成功，请稍后再试';
    return NextResponse.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
  }
}

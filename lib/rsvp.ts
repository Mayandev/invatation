import { FEISHU_ENABLED, createFeishuRsvp } from './feishu';
import { RSVP_DEADLINE_LABEL, isRsvpClosed } from './wedding';

export interface RsvpInput {
  name?: unknown;
  attendance?: unknown;
  guestSide?: unknown;
  guests?: unknown;
  message?: unknown;
  ticketNumber?: unknown;
}

export interface RsvpResult {
  ok: true;
  recordId: string;
}

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function submitRsvp(input: RsvpInput): Promise<RsvpResult> {
  if (isRsvpClosed()) throw new HttpError(410, `回执已于${RSVP_DEADLINE_LABEL}截止`);
  if (!FEISHU_ENABLED) throw new HttpError(503, '飞书登记尚未配置');

  const name = String(input.name || '').trim().slice(0, 40);
  const attendance = input.attendance === 'no' ? 'no' : 'yes';
  const guestSide = input.guestSide === 'bride' ? 'bride' : 'groom';
  const guests = Math.min(20, Math.max(1, Number.parseInt(String(input.guests), 10) || 1));
  const message = String(input.message || '').trim().slice(0, 500);
  const ticketNumber = String(input.ticketNumber || '').trim().slice(0, 40);
  if (!name || !ticketNumber) throw new HttpError(400, '请填写宾客姓名');

  try {
    const recordId = await createFeishuRsvp({ name, attendance, guestSide, guests, message, ticketNumber });
    return { ok: true, recordId };
  } catch (error) {
    console.error('[feishu rsvp]', (error as Error).message);
    throw new HttpError(502, '登记暂未成功，请稍后再试');
  }
}

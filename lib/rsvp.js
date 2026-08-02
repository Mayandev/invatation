const { FEISHU_ENABLED, createFeishuRsvp } = require('./feishu');

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function submitRsvp(input) {
  if (!FEISHU_ENABLED) throw new HttpError(503, '飞书登记尚未配置');

  const name = String(input.name || '').trim().slice(0, 40);
  const attendance = input.attendance === 'no' ? 'no' : 'yes';
  const guests = Math.min(20, Math.max(1, Number.parseInt(input.guests, 10) || 1));
  const message = String(input.message || '').trim().slice(0, 500);
  const ticketNumber = String(input.ticketNumber || '').trim().slice(0, 40);
  if (!name || !ticketNumber) throw new HttpError(400, '请填写宾客姓名');

  try {
    const recordId = await createFeishuRsvp({ name, attendance, guests, message, ticketNumber });
    return { ok: true, recordId };
  } catch (error) {
    console.error('[feishu rsvp]', error.message);
    throw new HttpError(502, '登记暂未成功，请稍后再试');
  }
}

module.exports = { submitRsvp, HttpError };

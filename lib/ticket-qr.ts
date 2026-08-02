import QRCode from 'qrcode';

export interface RenderTicketQrParams {
  text: string;
  requestOrigin: string;
}

export class TicketQrError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function renderTicketQr({ text, requestOrigin }: RenderTicketQrParams): Promise<string> {
  let target: URL;
  try {
    target = new URL(text);
  } catch {
    throw new TicketQrError(400, '二维码生成失败');
  }

  const publicOrigin = (process.env.PUBLIC_ORIGIN || '').replace(/\/$/, '');
  const allowedOrigin = publicOrigin ? target.origin === publicOrigin : target.origin === requestOrigin;
  if (text.length > 800 || !allowedOrigin || target.pathname !== '/guide') {
    throw new TicketQrError(400, '无效的电子票二维码地址');
  }

  try {
    return await QRCode.toString(text, {
      type: 'svg',
      errorCorrectionLevel: 'M',
      margin: 1,
      color: { dark: '#351f1cff', light: '#faf3e3ff' }
    });
  } catch {
    throw new TicketQrError(400, '二维码生成失败');
  }
}

import QRCode from 'qrcode';

export interface RenderTicketQrParams {
  text: string;
}

export class TicketQrError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function renderTicketQr({ text }: RenderTicketQrParams): Promise<string> {
  if (!text) throw new TicketQrError(400, '二维码生成失败');
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

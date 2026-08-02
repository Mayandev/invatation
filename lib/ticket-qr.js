const QRCode = require('qrcode');

async function renderTicketQr({ text, requestOrigin }) {
  let target;
  try {
    target = new URL(text);
  } catch {
    const error = new Error('二维码生成失败');
    error.status = 400;
    throw error;
  }

  const publicOrigin = (process.env.PUBLIC_ORIGIN || '').replace(/\/$/, '');
  const allowedOrigin = publicOrigin ? target.origin === publicOrigin : target.origin === requestOrigin;
  if (text.length > 800 || !allowedOrigin || target.pathname !== '/guide.html') {
    const error = new Error('无效的电子票二维码地址');
    error.status = 400;
    throw error;
  }

  try {
    return await QRCode.toString(text, {
      type: 'svg',
      errorCorrectionLevel: 'M',
      margin: 1,
      color: { dark: '#351f1cff', light: '#faf3e3ff' }
    });
  } catch {
    const error = new Error('二维码生成失败');
    error.status = 400;
    throw error;
  }
}

module.exports = { renderTicketQr };

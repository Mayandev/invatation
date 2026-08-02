const { renderTicketQr } = require('../lib/ticket-qr');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const text = typeof req.query.text === 'string' ? req.query.text : '';
  try {
    const requestProtocol = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
    const requestOrigin = `${requestProtocol}://${req.headers.host}`;
    const svg = await renderTicketQr({ text, requestOrigin });
    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'private, max-age=300');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(200).send(svg);
  } catch (error) {
    return res.status(error.status || 400).json({ error: error.message || '二维码生成失败' });
  }
};

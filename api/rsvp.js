const { submitRsvp, HttpError } = require('../lib/rsvp');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const input = typeof req.body === 'object' && req.body ? req.body : {};
    const result = await submitRsvp(input);
    return res.status(201).json(result);
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    return res.status(status).json({ error: error.message || '登记暂未成功，请稍后再试' });
  }
};

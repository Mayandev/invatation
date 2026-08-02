const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { submitRsvp, HttpError } = require('./lib/rsvp');
const { renderTicketQr } = require('./lib/ticket-qr');

function loadLocalEnv() {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator < 1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadLocalEnv();

const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_DIR = path.join(__dirname, 'dist');
const PUBLIC_ORIGIN = (process.env.PUBLIC_ORIGIN || `http://localhost:${PORT}`).replace(/\/$/, '');
const IS_DEVELOPMENT = process.env.NODE_ENV !== 'production';
const IS_SECURE = PUBLIC_ORIGIN.startsWith('https://');

const wedding = {
  groom: process.env.GROOM_NAME || '邹明远',
  bride: process.env.BRIDE_NAME || '孙佳玮',
  date: process.env.WEDDING_DATE || '2026-10-06T11:58:00+08:00',
  venue: process.env.WEDDING_VENUE || '悦宴楼五楼',
  address: process.env.WEDDING_ADDRESS || '江西省吉安市悦宴楼五楼',
  city: process.env.WEDDING_CITY || '吉安'
};

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon'
};

function sendJson(res, status, value) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(value));
}

async function readJson(req, limit = 16 * 1024) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw new Error('提交内容过长');
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
  } catch {
    throw new Error('提交内容格式不正确');
  }
}

async function handleApi(req, res, url) {
  if (url.pathname === '/api/rsvp' && req.method === 'POST') {
    try {
      const input = await readJson(req);
      const result = await submitRsvp(input);
      return sendJson(res, 201, result);
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 500;
      return sendJson(res, status, { error: error.message || '登记暂未成功，请稍后再试' });
    }
  }

  if (url.pathname === '/api/ticket-qr' && req.method === 'GET') {
    const text = url.searchParams.get('text') || '';
    try {
      const requestProtocol = String(req.headers['x-forwarded-proto'] || (IS_SECURE ? 'https' : 'http')).split(',')[0].trim();
      const requestOrigin = `${requestProtocol}://${req.headers.host}`;
      const svg = await renderTicketQr({ text, requestOrigin });
      res.writeHead(200, {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'private, max-age=300',
        'X-Content-Type-Options': 'nosniff'
      });
      return res.end(svg);
    } catch (error) {
      return sendJson(res, error.status || 400, { error: error.message || '二维码生成失败' });
    }
  }

  return sendJson(res, 404, { error: 'Not found' });
}

function serveStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.resolve(PUBLIC_DIR, `.${pathname}`);
  if (!filePath.startsWith(`${PUBLIC_DIR}${path.sep}`)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.stat(filePath, (error, stat) => {
    if (error || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('未找到页面');
    }
    const ext = path.extname(filePath).toLowerCase();
    const cacheControl = ['.html', '.js', '.css'].includes(ext) ? 'no-cache' : 'public, max-age=86400';
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream',
      'Cache-Control': cacheControl,
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; style-src 'self' data:; script-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'"
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

async function startServer() {
  const vite = IS_DEVELOPMENT
    ? await import('vite').then(({ createServer }) =>
        createServer({
          server: { middlewareMode: true },
          appType: 'mpa'
        })
      )
    : null;

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, PUBLIC_ORIGIN);
    if (url.pathname.startsWith('/api/')) return handleApi(req, res, url);
    if (vite) {
      return vite.middlewares(req, res, () => {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('未找到页面');
      });
    }
    return serveStatic(req, res, url);
  });

  server.listen(PORT, HOST, () => {
    console.log(`\n古风婚礼请柬已启动：${PUBLIC_ORIGIN}`);
    console.log(`运行模式：${IS_DEVELOPMENT ? 'Vite 开发模式' : '生产模式'}\n`);
  });
}

startServer().catch((error) => {
  console.error('服务启动失败：', error);
  process.exit(1);
});

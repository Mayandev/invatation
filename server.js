const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const QRCode = require('qrcode');

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
const APP_ID = process.env.WECHAT_APP_ID || '';
const APP_SECRET = process.env.WECHAT_APP_SECRET || '';
const SESSION_SECRET = process.env.SESSION_SECRET || 'local-preview-only-change-before-deploying';
const WECHAT_ENABLED = Boolean(APP_ID && APP_SECRET && process.env.PUBLIC_ORIGIN && process.env.SESSION_SECRET);
const IS_SECURE = PUBLIC_ORIGIN.startsWith('https://');
const FEISHU_APP_ID = process.env.FEISHU_APP_ID || '';
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET || '';
const FEISHU_WIKI_TOKEN = process.env.FEISHU_WIKI_TOKEN || '';
const FEISHU_TABLE_ID = process.env.FEISHU_TABLE_ID || '';
const FEISHU_ENABLED = Boolean(FEISHU_APP_ID && FEISHU_APP_SECRET && FEISHU_WIKI_TOKEN && FEISHU_TABLE_ID);
let feishuTokenCache = null;
let feishuAppTokenCache = '';

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

function parseCookies(req) {
  return Object.fromEntries(
    (req.headers.cookie || '')
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf('=');
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      })
  );
}

function sign(value) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('base64url');
}

function createToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${sign(body)}`;
}

function readToken(token) {
  if (!token || !token.includes('.')) return null;
  const [body, signature] = token.split('.');
  const expected = sign(body);
  if (signature.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function cookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`, 'Path=/', `SameSite=${options.sameSite || 'Lax'}`];
  if (options.httpOnly !== false) parts.push('HttpOnly');
  if (IS_SECURE) parts.push('Secure');
  if (options.maxAge) parts.push(`Max-Age=${options.maxAge}`);
  return parts.join('; ');
}

function sendJson(res, status, value) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(value));
}

function redirect(res, location, cookies = []) {
  const headers = { Location: location, 'Cache-Control': 'no-store' };
  if (cookies.length) headers['Set-Cookie'] = cookies;
  res.writeHead(302, headers);
  res.end();
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

async function getFeishuTenantToken() {
  if (feishuTokenCache && feishuTokenCache.expiresAt > Date.now() + 60_000) {
    return feishuTokenCache.value;
  }
  const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ app_id: FEISHU_APP_ID, app_secret: FEISHU_APP_SECRET })
  });
  const data = await response.json();
  if (!response.ok || data.code || !data.tenant_access_token) {
    throw new Error(data.msg || '飞书应用认证失败');
  }
  feishuTokenCache = {
    value: data.tenant_access_token,
    expiresAt: Date.now() + Math.max(60, Number(data.expire || 7200) - 120) * 1000
  };
  return feishuTokenCache.value;
}

async function getFeishuAppToken(token) {
  if (feishuAppTokenCache) return feishuAppTokenCache;
  const response = await fetch(
    `https://open.feishu.cn/open-apis/wiki/v2/spaces/get_node?token=${encodeURIComponent(FEISHU_WIKI_TOKEN)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await response.json();
  if (!response.ok || data.code || data.data?.node?.obj_type !== 'bitable') {
    throw new Error(data.msg || '无法解析飞书多维表格链接');
  }
  feishuAppTokenCache = data.data.node.obj_token;
  return feishuAppTokenCache;
}

async function createFeishuRsvp(rsvp) {
  const token = await getFeishuTenantToken();
  const appToken = await getFeishuAppToken(token);
  const response = await fetch(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${FEISHU_TABLE_ID}/records`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          宾客姓名: rsvp.name,
          是否赴宴: rsvp.attendance === 'no' ? '遥寄祝福' : '欣然赴约',
          赴宴人数: rsvp.attendance === 'no' ? 0 : rsvp.guests,
          祝福: rsvp.message,
          电子票号: rsvp.ticketNumber,
          核销状态: '待核销'
        }
      })
    }
  );
  const data = await response.json();
  if (!response.ok || data.code) throw new Error(data.msg || '飞书登记写入失败');
  return data.data?.record?.record_id || '';
}

async function handleApi(req, res, url) {
  if (url.pathname === '/api/rsvp' && req.method === 'POST') {
    if (!FEISHU_ENABLED) return sendJson(res, 503, { error: '飞书登记尚未配置' });
    try {
      const input = await readJson(req);
      const name = String(input.name || '').trim().slice(0, 40);
      const attendance = input.attendance === 'no' ? 'no' : 'yes';
      const guests = Math.min(20, Math.max(1, Number.parseInt(input.guests, 10) || 1));
      const message = String(input.message || '').trim().slice(0, 500);
      const ticketNumber = String(input.ticketNumber || '').trim().slice(0, 40);
      if (!name || !ticketNumber) return sendJson(res, 400, { error: '请填写宾客姓名' });
      const recordId = await createFeishuRsvp({ name, attendance, guests, message, ticketNumber });
      return sendJson(res, 201, { ok: true, recordId });
    } catch (error) {
      console.error('[feishu rsvp]', error.message);
      return sendJson(res, 502, { error: '登记暂未成功，请稍后再试' });
    }
  }

  if (url.pathname === '/api/ticket-qr' && req.method === 'GET') {
    const text = url.searchParams.get('text') || '';
    try {
      const target = new URL(text);
      const requestProtocol = String(req.headers['x-forwarded-proto'] || (IS_SECURE ? 'https' : 'http')).split(',')[0].trim();
      const requestOrigin = `${requestProtocol}://${req.headers.host}`;
      const allowedOrigin = process.env.PUBLIC_ORIGIN ? target.origin === PUBLIC_ORIGIN : target.origin === requestOrigin;
      if (text.length > 800 || !allowedOrigin || target.pathname !== '/guide.html') {
        return sendJson(res, 400, { error: '无效的电子票二维码地址' });
      }
      const svg = await QRCode.toString(text, {
        type: 'svg',
        errorCorrectionLevel: 'M',
        margin: 1,
        color: { dark: '#351f1cff', light: '#faf3e3ff' }
      });
      res.writeHead(200, {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'private, max-age=300',
        'X-Content-Type-Options': 'nosniff'
      });
      return res.end(svg);
    } catch {
      return sendJson(res, 400, { error: '二维码生成失败' });
    }
  }

  if (url.pathname === '/api/auth/wechat' && req.method === 'GET') {
    if (!WECHAT_ENABLED) {
      return sendJson(res, 503, { error: '微信授权尚未配置，请参考 README.md。' });
    }

    const state = crypto.randomBytes(20).toString('base64url');
    const callback = `${PUBLIC_ORIGIN}/api/auth/wechat/callback`;
    const authorizeUrl = new URL('https://open.weixin.qq.com/connect/oauth2/authorize');
    authorizeUrl.searchParams.set('appid', APP_ID);
    authorizeUrl.searchParams.set('redirect_uri', callback);
    authorizeUrl.searchParams.set('response_type', 'code');
    authorizeUrl.searchParams.set('scope', 'snsapi_userinfo');
    authorizeUrl.searchParams.set('state', state);

    return redirect(res, `${authorizeUrl.toString()}#wechat_redirect`, [
      cookie('wechat_oauth_state', createToken({ state, exp: Date.now() + 10 * 60 * 1000 }), { maxAge: 600 })
    ]);
  }

  if (url.pathname === '/api/auth/wechat/callback' && req.method === 'GET') {
    const { code, state } = Object.fromEntries(url.searchParams);
    const stateCookie = readToken(parseCookies(req).wechat_oauth_state);
    if (!code || !state || !stateCookie || stateCookie.state !== state) {
      return redirect(res, `${PUBLIC_ORIGIN}/?auth=failed`);
    }

    try {
      const tokenUrl = new URL('https://api.weixin.qq.com/sns/oauth2/access_token');
      tokenUrl.searchParams.set('appid', APP_ID);
      tokenUrl.searchParams.set('secret', APP_SECRET);
      tokenUrl.searchParams.set('code', code);
      tokenUrl.searchParams.set('grant_type', 'authorization_code');
      const tokenResponse = await fetch(tokenUrl);
      const tokenData = await tokenResponse.json();
      if (!tokenResponse.ok || tokenData.errcode || !tokenData.access_token) {
        throw new Error(tokenData.errmsg || '微信 access_token 获取失败');
      }

      const userUrl = new URL('https://api.weixin.qq.com/sns/userinfo');
      userUrl.searchParams.set('access_token', tokenData.access_token);
      userUrl.searchParams.set('openid', tokenData.openid);
      userUrl.searchParams.set('lang', 'zh_CN');
      const userResponse = await fetch(userUrl);
      const userData = await userResponse.json();
      if (!userResponse.ok || userData.errcode) {
        throw new Error(userData.errmsg || '微信用户信息获取失败');
      }

      const session = createToken({
        nickname: userData.nickname || '亲爱的宾客',
        avatar: userData.headimgurl || '',
        openid: userData.openid,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000
      });
      return redirect(res, `${PUBLIC_ORIGIN}/?auth=success`, [
        cookie('wedding_session', session, { maxAge: 7 * 24 * 60 * 60 }),
        cookie('wechat_oauth_state', '', { maxAge: 1 })
      ]);
    } catch (error) {
      console.error('[wechat oauth]', error.message);
      return redirect(res, `${PUBLIC_ORIGIN}/?auth=failed`);
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
    console.log(`运行模式：${IS_DEVELOPMENT ? 'Vite 开发模式' : '生产模式'}`);
    console.log(WECHAT_ENABLED ? '微信网页授权：已启用\n' : '微信网页授权：预览模式（参照 README 配置后启用）\n');
  });
}

startServer().catch((error) => {
  console.error('服务启动失败：', error);
  process.exit(1);
});

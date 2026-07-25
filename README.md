# 古风微信婚礼请柬

一份移动端优先的古风电子请柬，包含启帖动效、婚期倒计时、喜宴流程、宴址复制、宾客回帖、带真实二维码的专属电子票、AI 引座官原型，以及安全的微信网页 OAuth 登录。

## 本地预览

需要 Node.js 18 或更高版本。

```bash
npm install
npm run dev
```

打开 `http://localhost:4173`。未配置微信公众号时会自动进入预览模式，所有页面功能均可查看。

## 修改婚礼信息

复制 `.env.example` 中的变量到部署平台的环境变量，修改新人姓名、日期与宴会地址。若在本地终端启动，可直接传入：

```bash
GROOM_NAME="新郎名" BRIDE_NAME="新娘名" WEDDING_DATE="2026-10-06T11:58:00+08:00" npm run dev
```

## 启用微信登录

微信网页登录需要已认证的服务号和一条公网 HTTPS 域名。请在微信公众平台配置“网页授权域名”，并在服务端设置：

```bash
PUBLIC_ORIGIN=https://你的请柬域名
SESSION_SECRET=至少32位随机字符串
WECHAT_APP_ID=你的AppID
WECHAT_APP_SECRET=你的AppSecret
```

回调地址由服务自动生成为：

```text
https://你的请柬域名/api/auth/wechat/callback
```

`AppSecret` 只存在服务端；前端不会收到 access token、openid 或密钥。登录会话使用 HttpOnly、SameSite Cookie，并带 OAuth state 校验。

## 部署提示

- 使用能长期运行 Node.js 的平台部署，而不是纯静态托管。
- 线上必须设置 `PUBLIC_ORIGIN`、随机 `SESSION_SECRET` 和 HTTPS。
- 生产构建使用 `npm run build`，随后使用 `npm start` 启动。
- 宾客登记会通过服务端同步到配置好的飞书多维表格。

## 主要文件

- `vite.config.mjs`：Vite 多页面构建配置
- `server.js`：Vite 开发中间件、飞书登记与微信 OAuth
- `index.html`：请柬页面
- `guide.html`：智能引座官页面
- `src/styles.css`：古风视觉和动效
- `src/app.js`：配置、倒计时、交互与回帖
- `public/assets/invitation-bg.jpg`：网页优化后的专属古风底图（PNG 为高清源图）
- `public/assets/fonts/invitation-serif.woff2`：移动端精简思源宋体；授权文本见同目录 `OFL.txt`

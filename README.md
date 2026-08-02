# 古风微信婚礼请柬

一份移动端优先的古风电子请柬，包含启帖动效、婚期倒计时、喜宴流程、宴址复制、宾客回帖、带真实二维码的专属电子票、AI 引座官原型。请柬无需任何登录，打开即可直接浏览与回帖。

## 本地预览

需要 Node.js 18 或更高版本。

```bash
npm install
npm run dev
```

打开 `http://localhost:4173`。

## 修改婚礼信息

复制 `.env.example` 中的变量到部署平台的环境变量，修改新人姓名、日期与宴会地址。若在本地终端启动，可直接传入：

```bash
GROOM_NAME="新郎名" BRIDE_NAME="新娘名" WEDDING_DATE="2026-10-06T11:58:00+08:00" npm run dev
```

## 部署到自己的服务器 / 云主机（推荐，架构最简单）

- 使用能长期运行 Node.js 的平台部署（VPS、云服务器 + PM2/systemd、Railway、Render、Fly.io 等），而不是纯静态托管。
- 线上必须设置 `PUBLIC_ORIGIN` 和 HTTPS。
- 生产构建使用 `npm run build`，随后使用 `npm start` 启动——`server.js` 会同时提供静态页面和 `/api/*` 接口。
- 宾客登记会通过服务端同步到配置好的飞书多维表格。

## 部署到 Vercel

Vercel 对 Vite 项目默认按纯静态站点处理，**不会**常驻运行 `server.js`，所以不能直接照搬上面的方式，否则 `/api/rsvp`、`/api/ticket-qr` 会 404。本项目已经把接口逻辑拆分到 `api/` 目录，Vercel 会自动把其中每个文件识别成一个 Serverless Function，无需额外配置路由：

- `api/rsvp.js` → `/api/rsvp`
- `api/ticket-qr.js` → `/api/ticket-qr`

两者内部都复用 `lib/` 下与 `server.js` 共用的业务逻辑（`lib/rsvp.js`、`lib/ticket-qr.js`、`lib/feishu.js`），不需要重复维护。

部署步骤：

1. 在 Vercel 项目里导入本仓库，构建命令、输出目录已经在 `vercel.json` 中声明好（`npm run build` → `dist`），无需手动改。
2. 在 Vercel 项目的 Environment Variables 里配置：`PUBLIC_ORIGIN`（你的 Vercel 域名，如 `https://xxx.vercel.app`）以及 `FEISHU_APP_ID`、`FEISHU_APP_SECRET`、`FEISHU_WIKI_TOKEN`、`FEISHU_TABLE_ID`。
3. 重新部署即可，`npm start` 在 Vercel 上不会被用到，静态页面走 CDN，接口走 Serverless Function。

## 主要文件

- `vite.config.mjs`：Vite 多页面构建配置
- `server.js`：自建服务器场景下的 Vite 开发中间件与接口入口
- `api/`：Vercel Serverless Functions 入口（`rsvp.js`、`ticket-qr.js`）
- `lib/`：`server.js` 与 `api/` 共用的业务逻辑（飞书登记、电子票二维码）
- `index.html`：请柬页面
- `guide.html`：智能引座官页面
- `src/styles.css`：古风视觉和动效
- `src/app.js`：配置、倒计时、交互与回帖
- `public/assets/invitation-bg.jpg`：网页优化后的专属古风底图（PNG 为高清源图）
- `public/assets/fonts/invitation-serif.woff2`：移动端精简思源宋体；授权文本见同目录 `OFL.txt`

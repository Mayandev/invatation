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

## 部署提示

- 使用能长期运行 Node.js 的平台部署，而不是纯静态托管。
- 线上必须设置 `PUBLIC_ORIGIN` 和 HTTPS。
- 生产构建使用 `npm run build`，随后使用 `npm start` 启动。
- 宾客登记会通过服务端同步到配置好的飞书多维表格。

## 主要文件

- `vite.config.mjs`：Vite 多页面构建配置
- `server.js`：Vite 开发中间件与飞书登记接口
- `index.html`：请柬页面
- `guide.html`：智能引座官页面
- `src/styles.css`：古风视觉和动效
- `src/app.js`：配置、倒计时、交互与回帖
- `public/assets/invitation-bg.jpg`：网页优化后的专属古风底图（PNG 为高清源图）
- `public/assets/fonts/invitation-serif.woff2`：移动端精简思源宋体；授权文本见同目录 `OFL.txt`

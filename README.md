# 古风微信婚礼请柬

一份移动端优先的古风电子请柬，包含启帖动效、婚期倒计时、喜宴流程、宴址复制、宾客回帖、带真实二维码的专属电子票、AI 引座官原型。请柬无需任何登录，打开即可直接浏览与回帖。

技术栈：Next.js 16（App Router）+ React 19 + TypeScript。

## 本地预览

需要 Node.js 20 或更高版本。

```bash
pnpm install
pnpm dev
```

打开 `http://localhost:3000`。

## 修改婚礼信息

新人姓名、婚期、宴会地址等展示信息集中在 [`lib/wedding.ts`](./lib/wedding.ts)，直接编辑该文件里的 `wedding` 对象即可，改完保存会自动热更新。

## 环境变量

复制 `.env.example` 为 `.env.local`（本地）或配置到部署平台的环境变量：

- `FEISHU_APP_ID` / `FEISHU_APP_SECRET` / `FEISHU_WIKI_TOKEN` / `FEISHU_TABLE_ID`：飞书多维表格登记所需，四者都配置齐才会真正写入，否则 `/api/rsvp` 会返回"飞书登记尚未配置"。
- `NEXT_PUBLIC_SITE_URL`：线上对外域名（如 `https://invatation-otrstjqf.edgeone.dev`）。它用于生成分享卡片图片的绝对 URL；使用 EdgeOne 等反向代理时必须填写最终的公开域名，不要填写 Vercel 源站地址。

宾客登记会通过 [`app/api/rsvp/route.ts`](./app/api/rsvp/route.ts) 同步到配置好的飞书多维表格。
多维表格需包含「宾客姓名」「是否赴宴」「亲友关系」「赴宴人数」「祝福」「电子票号」「核销状态」字段，其中「亲友关系」用于保存男方 / 女方亲友选项。

## 分享邀请链接

以 `guest` 参数指定受邀人姓名：

```text
https://your-domain.com/?guest=张三
```

页面会把“张三”预填到 RSVP 姓名栏，并在标准 Open Graph 分享元信息中使用“张三，诚挚邀请您来参加我们的婚礼”，同时提供 1200×630 的动态分享图片。

微信聊天卡片最终是否显示自定义标题、描述和图片由微信客户端决定。没有微信公众号/开放平台的 JSSDK AppID、AppSecret 与「JS 接口安全域名」时，微信可能仍降级为普通链接；标准 Open Graph 卡片则可供其他支持该协议的平台抓取。

## 部署

本项目是标准 Next.js 应用，`pnpm build && pnpm start` 即可在任意支持 Node.js 20+ 的平台运行（VPS、Railway、Render、Fly.io 等），也可以直接导入 Vercel（零配置，`/api/rsvp`、`/api/ticket-qr` 会被识别为对应的 Route Handler，无需额外的 `vercel.json` 或 Serverless Functions 目录）。

部署到 Vercel 时，记得在项目的 Environment Variables 里配置上面提到的飞书与 `NEXT_PUBLIC_SITE_URL` 变量。

## 主要目录

- `app/page.tsx`、`app/invitation.css`：请柬主页与样式
- `app/guide/page.tsx`、`app/guide/guide.css`：智能引座官页面与样式
- `app/api/rsvp/route.ts`：宾客回帖接口，写入飞书多维表格
- `app/api/ticket-qr/route.ts`：电子票二维码接口
- `components/invitation/`：请柬页面的 React 组件（封面、倒计时、时间线、地址、回帖表单、电子票弹窗）
- `components/guide/GuideChat.tsx`：AI 引座官聊天组件
- `components/shared/Toast.tsx`：全局轻提示
- `hooks/`：倒计时（`useCountdown`）、滚动显现（`useReveal`）、原生 `<dialog>` 封装（`useDialog`）
- `lib/wedding.ts`：新人信息与日期格式化工具，唯一需要手动改的展示数据
- `lib/rsvp.ts`、`lib/feishu.ts`：回帖校验与飞书 OpenAPI 调用
- `app/share-card/route.tsx`、`lib/share.ts`：动态 Open Graph 分享图及姓名文案
- `lib/ticket-qr.ts`：电子票二维码渲染
- `lib/guide-answers.ts`：引座官问答规则
- `public/assets/invitation-bg.jpg`：网页优化后的专属古风底图（PNG 为高清源图）
- `public/assets/fonts/invitation-serif-{400,500,600}.woff2`：按当前页面文案生成的思源宋体子集；授权文本见同目录 `OFL.txt`

# 2026 欧洲旅行网页应用

面向手机使用的 React 旅行手册，覆盖阿姆斯特丹、科隆、慕尼黑、萨尔茨堡和维也纳。页面包含旅行总览、逐日时间轴、路线、预订清单和预算概览。

## 当前行程基线

- 9月27日：IC 60403，Amsterdam Centraal 21:01 → Köln Hbf 23:45，直达、自由座
- 9月28日：Köln Hbf 18:54 → München Ost 23:34，约4小时40分、2次换乘
- 9月28–30日：Moxy Munich Ostbahnhof，共2晚；两笔连续订单
- 原“科隆→乌尔姆过夜→慕尼黑”方案已取消

详细文字版仍以 [`欧洲旅游攻略_2026.md`](./欧洲旅游攻略_2026.md) 为准。

## 本地运行

需要 Node.js 22 或更高版本：

```bash
npm install
npm run dev -- --port 4173
```

生产构建：

```bash
npm run typecheck
npm run build
npm run preview -- --port 4174
```

请勿使用 `8080` 端口；该端口属于 Loomi 生产后端。

## 项目结构

```text
src/
├── App.tsx       # 五个核心视图与本地交互
├── data.ts       # 行程、预订和路线的唯一数据源
├── styles.css    # 响应式设计系统
├── types.ts      # TypeScript 数据类型
└── main.tsx      # 应用入口
```

旧版单文件保留在 `legacy/europe-travel-2026.html`，便于对照和回滚。根目录的 `europe-travel-2026.html` 是已构建的新版应用入口，因此原网址保持不变。

## 数据与隐私

- 活动完成状态和预约勾选状态仅保存在浏览器 `localStorage`
- 应用不保存姓名、护照号码和订单确认号
- 修改交通或酒店时优先编辑 `src/data.ts`，并同步正式文字版攻略

## 部署

仓库沿用 GitHub Pages 的 `main` 分支静态发布方式。发布前运行 `npm run build`，再将 `dist/index.html` 复制为根目录的 `europe-travel-2026.html`，并同步 `dist/assets/`。Vite 的 `base` 已配置为 `/travel/`。

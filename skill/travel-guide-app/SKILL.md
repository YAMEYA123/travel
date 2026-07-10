---
name: travel-guide-app
description: 构建旅游攻略网页 App。适用于行程规划、景点攻略、费用计算、风险提示等旅行工具类页面。触发词：旅游攻略、旅行计划、行程安排、出行攻略、travel guide、itinerary。
version: 2.0.0
user-invocable: true
argument-hint: "[目的地] [天数] [人数]"
---

# 旅游攻略网页 App 构建指南

基于欧洲多城市 10 日游攻略的完整实现提炼，适用于任何目的地。

---

## 一、整体架构

### 单文件 HTML（强制要求）

所有 CSS / JS 内联，无外部依赖，可离线保存分享。唯一例外是 Leaflet 地图库（本地 `leaflet/` 目录）。

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="theme-color" content="#0D1B2E">
  <title>🗺 [目的地] 旅游攻略</title>
  <style>/* 所有样式 */</style>
</head>
<body>
  <header>…</header>
  <div class="nav-tabs">…</div>
  <!-- 5 个 tab-content -->
  <script>/* 所有 JS */</script>
</body>
```

### 页面布局结构

```
┌─ header（固定顶部，深色渐变）
├─ nav-tabs（5 个主 Tab）
└─ tab-content（5 个面板，只有 .active 显示）
   ├─ tab-map      ← 地图 + 右侧折叠日程侧边栏
   ├─ tab-booking  ← 子导航：待预约 / 风险清单 / 签证
   ├─ tab-tickets  ← 子导航：[按国家/城市分组]
   ├─ tab-finance  ← 子导航：费用汇总 / 分账
   └─ tab-essentials ← 子导航：天气/紧急/生活/购物/App/中英对照
```

---

## 二、CSS 变量与配色

```css
:root {
  /* 国家/城市主色（每个目的地一色） */
  --nl: #F97316;   /* 荷兰：橙 */
  --de: #3B82F6;   /* 德国：蓝 */
  --at: #10B981;   /* 奥地利：绿 */

  /* 系统色 */
  --bg:          #F0F4F8;
  --card:        #fff;
  --border:      #DDE3EC;
  --text:        #1A2332;
  --muted:       #60748A;
  --accent:      #3B82F6;
  --accent-soft: #EFF6FF;
  --r:           10px;
}
```

**状态/语义色约定：**

| 用途 | 颜色 |
|------|------|
| 价格 / 完成 | `#059669`（绿） |
| 高风险 | `#DC2626`（红），背景 `#FEF2F2` |
| 中等风险 | `#F97316`（橙），背景 `#FFF7ED` |
| 低风险 | `#EAB308`（黄），背景 `#FEFCE8` |
| 预约按钮 | `#2563EB`；紧急款 `.warn` 用 `#DC2626` |

---

## 三、Header

```html
<header>
  <div>
    <h1>🇪🇺 [目的地] 旅游攻略 [年份]</h1>
    <p>[日期范围] · [城市路线]</p>
  </div>
  <div class="legend"><!-- 国家图例 --></div>
  <button class="dl-btn" onclick="downloadPage()">⬇ 下载</button>
  <button class="rf-btn" onclick="location.reload()">↻</button>
</header>
```

```css
header {
  background: linear-gradient(135deg, #0D1B2E 0%, #1A3A5C 100%);
  color: #fff;
  padding: 10px 18px;
  /* iOS 安全区适配 */
  padding-top: max(10px, env(safe-area-inset-top));
  padding-left: max(18px, env(safe-area-inset-left));
  padding-right: max(18px, env(safe-area-inset-right));
  display: flex; align-items: center; gap: 12px; flex-shrink: 0;
}
```

---

## 四、主 Tab 导航

### HTML

```html
<div class="nav-tabs">
  <button class="tab-btn active" onclick="switchTab('map',this)">🗺 地图动线</button>
  <button class="tab-btn" onclick="switchTab('booking',this)">
    📋 预约 & 风险
    <span id="badge-todo" style="background:#EF4444;color:#fff;border-radius:10px;padding:1px 6px;font-size:.65rem;margin-left:3px"></span>
  </button>
  <button class="tab-btn" onclick="switchTab('tickets',this)">🎫 交通 & 住宿</button>
  <button class="tab-btn" onclick="switchTab('finance',this)">💰 费用 & 分账</button>
  <button class="tab-btn" onclick="switchTab('essentials',this)">🌤 实用速查</button>
</div>
```

### CSS（含移动端横向滚动）

```css
.nav-tabs {
  display: flex;
  flex-wrap: nowrap;           /* 禁止折行，强制横向滚动 */
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding: 0 6px;
  background: #fff;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.nav-tabs::-webkit-scrollbar { display: none; }

.tab-btn {
  padding: 10px 13px;
  min-height: 44px;            /* iOS 触控最小目标 */
  border: none;
  background: none;
  font-size: .78rem;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  border-radius: 6px 6px 0 0;
  border-bottom: 2px solid transparent;
  transition: color .15s, background .15s;
  -webkit-tap-highlight-color: transparent;
}
.tab-btn.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
  background: rgba(59,130,246,.08);
}

/* Tab 切换淡入动画 */
@keyframes tabFadeIn {
  from { opacity: .5; transform: translateY(3px); }
  to   { opacity: 1; transform: translateY(0); }
}
.tab-content { display: none; flex: 1; overflow: hidden; }
.tab-content.active { display: flex; animation: tabFadeIn .18s ease; }
```

### JS

```javascript
function switchTab(name, btn) {
  document.querySelectorAll('.tab-content').forEach(el => {
    el.classList.toggle('active', el.id === 'tab-' + name)
  })
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
  if (btn) btn.classList.add('active')
  if (name === 'map' && map) setTimeout(() => map.invalidateSize(), 50)
}
```

---

## 五、子导航系统（统一 subnav）

所有子 Tab **共用同一套 CSS**，不要每个 Tab 单独写样式。

### CSS

```css
.subnav {
  display: flex;
  padding: 10px 14px 0;
  background: #E8EDF4;
  flex-shrink: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  gap: 4px;
}
.subnav::-webkit-scrollbar { display: none; }

.snav-btn {
  padding: 8px 15px;
  border-radius: 8px 8px 0 0;
  font-size: .8rem;
  font-weight: 600;
  background: #C8D4E3;
  color: #4E6580;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  min-height: 38px;            /* 子导航触控最小目标 */
  transition: background .15s, color .15s;
  -webkit-tap-highlight-color: transparent;
}
.snav-btn.snav-active { background: #fff; color: #1A2332; }
.snav-btn:not(.snav-active):active { background: #B8C8D8; }

@media (max-width: 480px) {
  .snav-btn { padding: 7px 12px !important; font-size: .76rem !important; }
}
```

### HTML 结构（每个含子导航的 Tab 都照此格式）

```html
<div class="tab-content" id="tab-booking" style="flex-direction:column">
  <div id="bk-subnav" class="subnav">
    <button onclick="switchBooking('booking',this)" class="snav-btn bk-btn snav-active">📋 待预约</button>
    <button onclick="switchBooking('risk',this)"    class="snav-btn bk-btn">⚠️ 风险清单</button>
    <button onclick="switchBooking('visa',this)"    class="snav-btn bk-btn">🛂 签证清单</button>
  </div>
  <div style="overflow-y:auto;flex:1;padding:20px" id="booking-page">
    <div id="bk-booking">…</div>
    <div id="bk-risk"  style="display:none">…</div>
    <div id="bk-visa"  style="display:none">…</div>
  </div>
</div>
```

### JS（通用切换函数）

```javascript
// 通用子导航切换 — 只用 classList，禁止操作 inline style
function switchSubTab(sections, idPrefix, btnClass, name, btn) {
  sections.forEach(s => {
    const el = document.getElementById(idPrefix + s)
    if (el) el.style.display = s === name ? '' : 'none'
  })
  document.querySelectorAll('.' + btnClass).forEach(b => b.classList.remove('snav-active'))
  if (btn) {
    btn.classList.add('snav-active')
    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }
}

// 各 Tab 的封装调用
function switchBooking(name, btn) {
  switchSubTab(['booking','risk','visa'], 'bk-', 'bk-btn', name, btn)
}
function switchTickets(name, btn) {
  switchSubTab(['nl','de-at'], 'tk-', 'tk-btn', name, btn)
}
function switchFinance(name, btn) {
  switchSubTab(['summary','split'], 'fn-', 'fn-btn', name, btn)
}
function switchEssentials(name, btn) {
  switchSubTab(['weather','emergency','life','shopping','apps','bilingual'], 'es-', 'es-btn', name, btn)
}
```

**关键规则：** 激活态只通过 `classList.add/remove('snav-active')` 控制，绝不在 JS 里写 `btn.style.background = ...`，否则 CSS 类无法覆盖。

---

## 六、Tab 1：地图动线

### 布局

```css
/* 桌面：地图左 + 侧边栏右 */
#tab-map { display: flex; flex-direction: row; }
#map     { flex: 1; min-width: 0; position: relative; }
aside    { width: 380px; flex-shrink: 0; overflow-y: auto; background: #FAFCFF; border-left: 1px solid var(--border); }

/* 移动端：地图上 + 侧边栏下 */
@media (max-width: 768px) {
  .tab-content.active { flex-direction: column; }
  #map  { height: 42vw; min-height: 200px; flex: none; }
  aside { width: 100%; border-left: none; border-top: 1px solid var(--border); flex: 1; min-height: 0; overflow-y: auto; }
}
```

### 日程手风琴（侧边栏）

```html
<div class="acc-item">
  <div class="acc-hd" onclick="toggleAcc(this)">
    <div class="day-badge" style="background:var(--nl)">D1</div>
    <div class="acc-title">
      <strong>阿姆斯特丹</strong>
      <span>🇳🇱 9/25 · 抵达日</span>
    </div>
    <span class="acc-arrow">▼</span>
  </div>
  <div class="acc-body">
    <div class="hotel-pill">🏨 [酒店名]</div>
    <ul class="act-list">
      <li class="act-item">
        <div class="act-num key">1</div>
        <div class="act-body">
          <div class="act-time">14:00</div>
          <div class="act-name">安妮之家</div>
          <div class="act-en">Anne Frank House</div>
          <div class="act-desc">⚡ 必须提前预约，限时入场</div>
          <span class="act-transport tr-walk">🚶 步行 10min</span>
        </div>
      </li>
    </ul>
  </div>
</div>
```

```javascript
function toggleAcc(hd) {
  const wasOpen = hd.classList.contains('open')
  hd.classList.toggle('open', !wasOpen)
}
function setAllAcc(open) {
  document.querySelectorAll('.acc-hd').forEach(hd => hd.classList.toggle('open', open))
}
```

---

## 七、Tab 2：预约 & 风险

### 预约进度条

```html
<div style="background:#fff;border:1px solid var(--border);border-radius:10px;padding:14px 18px;margin-bottom:18px">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
    <span style="font-weight:700;font-size:.9rem">预约完成进度</span>
    <span id="progress-text" style="font-size:.8rem;color:var(--muted)"></span>
  </div>
  <div style="background:#F1F5F9;border-radius:99px;height:8px;overflow:hidden">
    <div id="progress-bar" style="height:100%;background:linear-gradient(90deg,#3B82F6,#10B981);border-radius:99px;transition:width .4s ease;width:0%"></div>
  </div>
</div>
<div id="booking-list"></div>
```

JS 通过 `bookingData` 数组动态渲染，`localStorage` 保存勾选状态：

```javascript
const bookingData = [
  {
    id: 'anne-frank',
    name: '安妮之家',
    date: 'D1 · 9/26',
    urgency: 'now',    // 'now' | 'soon' | 'early' | 'opt'
    url: 'https://www.annefrank.org/en/museum/tickets/',
    note: '旺季极易售罄，无法现场购票',
    price: '€16/人',
  },
  // …
]

function renderBooking() {
  const saved = JSON.parse(localStorage.getItem('booking-status') || '{}')
  // 按 urgency 排序，渲染勾选框 + 预约按钮
}

function toggleBooking(id, checkbox) {
  const saved = JSON.parse(localStorage.getItem('booking-status') || '{}')
  saved[id] = checkbox.checked
  localStorage.setItem('booking-status', JSON.stringify(saved))
  updateProgress()
}
```

### 风险清单（三级）

```html
<!-- 高风险 -->
<div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:14px 16px;margin-bottom:12px">
  <div style="font-weight:700;color:#991B1B;margin-bottom:10px">🔴 高风险 — 可能直接打乱计划</div>
  <div style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid #FECACA">
    <div style="font-weight:600;font-size:.82rem">1. [风险标题]</div>
    <div style="font-size:.75rem;color:#7F1D1D;margin-top:3px">[详细说明 + 处理建议]</div>
  </div>
</div>
<!-- 中等风险：background:#FFF7ED;border:#FED7AA;color:#92400E/#78350F -->
<!-- 低风险：background:#FEFCE8;border:#FEF08A;color:#854D0E/#713F12 -->
```

---

## 八、Tab 3：交通 & 住宿（表格 + 移动端卡片化）

### 交通票价表 `.tbl-ticket`

```html
<div class="tickets-table-wrap">
  <table class="tbl-ticket" style="width:100%;border-collapse:collapse;font-size:.74rem">
    <tr style="background:#1E293B;color:#E2E8F0">
      <th style="padding:8px 12px">区间</th>
      <th style="padding:8px 12px">票价</th>
      <th style="padding:8px 12px">建议方案</th>
    </tr>
    <tr>
      <td style="padding:7px 10px">阿姆→科隆</td>
      <td style="padding:7px 10px">€29–49</td>
      <td style="padding:7px 10px">Thalys 提前订早鸟</td>
    </tr>
  </table>
</div>
```

移动端只需放大字号并高亮价格列（不转为卡片，因结构简单）：

```css
@media (max-width: 640px) {
  .tbl-ticket { font-size: .8rem !important; min-width: 0 !important; }
  .tbl-ticket th, .tbl-ticket td { padding: 7px 9px !important; line-height: 1.45; }
  .tbl-ticket td:nth-child(2):not(:only-child) { font-weight: 700; color: #059669; white-space: nowrap; }
  .tbl-ticket td:nth-child(3) { font-size: .76rem !important; color: #334155; }
}
```

### 酒店推荐表 `.hotel-tbl`

桌面端：滚动容器 + 固定宽度表格：

```css
.hotel-tbl-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: var(--r); box-shadow: 0 1px 6px rgba(0,0,0,.08); margin-bottom: 6px; }
.hotel-tbl      { width: 100%; border-collapse: collapse; font-size: .77rem; min-width: 520px; box-shadow: none; border-radius: 0; }
```

移动端（≤640px）转为卡片，**状态徽章绝对定位右上角**：

```css
@media (max-width: 640px) {
  .hotel-tbl-wrap { border-radius: 10px; box-shadow: 0 1px 5px rgba(0,0,0,.07); overflow: hidden; }
  .hotel-tbl { min-width: 0 !important; display: block; border-radius: 0; box-shadow: none; }
  .hotel-tbl tr:first-child { display: none; }        /* 表头行（无 <thead>，用此隐藏） */
  .hotel-tbl tr { display: block; padding: 12px 14px; border-bottom: 1px solid var(--border); position: relative; }
  .hotel-tbl tr:last-child { border-bottom: none; }
  .hotel-tbl tr:hover { background: #F8FAFD; }
  .hotel-tbl td { display: block; border: none; padding: 1px 0; font-size: .82rem; background: transparent !important; }
  .hotel-tbl td:nth-child(1) { position: absolute; top: 12px; right: 12px; }       /* 状态 badge */
  .hotel-tbl td:nth-child(2) { font-size: .9rem; font-weight: 700; padding-right: 64px; line-height: 1.4; margin-bottom: 4px; }
  .hotel-tbl td:nth-child(3)::before { content: '📍 '; }
  .hotel-tbl td:nth-child(3) { font-size: .72rem; color: var(--muted); margin-bottom: 3px; }
  .hotel-tbl td:nth-child(4) { font-size: .76rem; color: #334155; line-height: 1.45; }
  .hotel-tbl td:nth-child(5) { font-weight: 700; color: #059669; font-size: .84rem; margin-top: 7px; padding-top: 7px; border-top: 1px dashed #A7F3D0; }
  .hotel-tbl td:nth-child(5)::before { content: '💰 '; }
}
```

---

## 九、Tab 4：费用 & 分账

### 核心 JS 结构

```javascript
const expenseData = {
  people: 2,
  rate: 7.85,   // EUR → CNY，用户可调

  items: [
    { name: '机票', eur: 800, cat: 'must', perPerson: true },
    { name: '景点门票', eur: 200, cat: 'must', perPerson: true },
    { name: '纪念品', eur: 100, cat: 'opt', perPerson: false },
  ],

  // 筛选模式：'must' | 'suggest' | 'all'
  filter: 'must',

  total() {
    return this.items
      .filter(i => this.shouldInclude(i))
      .reduce((s, i) => s + i.eur * (i.perPerson ? this.people : 1), 0)
  }
}
```

切换按钮：`仅必须项` / `必须+建议` / `全部项目`

---

## 十、Tab 5：实用速查

### 子导航 sections

```
weather   → 天气（各城市月均温表）
emergency → 紧急联系（报警/急救/大使馆）
life      → 生活常识（插头/饮水/小费/礼仪）
shopping  → 特产购物（各城市推荐 + 海关限额）
apps      → 推荐 App（交通/翻译/地图/支付）
bilingual → 中英对照（景点/交通/餐饮常用词）
```

### 中英对照表 `.bi-table`

桌面端 4 列：中文 / English / 类型 / 备注

移动端（≤640px）转为卡片：

```css
@media (max-width: 640px) {
  .bi-section { overflow-x: unset; }
  .bi-table { min-width: 0 !important; display: block; box-shadow: none; border-radius: 0; }
  .bi-table tr:first-child { display: none; }    /* 无 <thead>，用此隐藏表头行 */
  .bi-table tr { display: block; margin-bottom: 10px; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; background: #fff; box-shadow: 0 1px 5px rgba(0,0,0,.07); }
  .bi-table tr:hover { background: unset; }
  .bi-table td { display: flex; align-items: flex-start; gap: 8px; padding: 8px 13px; border-bottom: 1px solid #EEF2F7; font-size: .82rem; line-height: 1.5; background: #fff !important; }
  .bi-table td:last-child { border-bottom: none; }
  .bi-table td::before { font-size: .62rem; font-weight: 700; color: var(--muted); min-width: 34px; flex-shrink: 0; padding-top: 2px; text-transform: uppercase; letter-spacing: .04em; }
  /* 中文词 — 卡片标题 */
  .bi-table td:nth-child(1) { display: block; font-size: .95rem; font-weight: 700; background: #EFF4FA !important; padding: 10px 13px; border-bottom: 2px solid #DDE6F0; }
  .bi-table td:nth-child(1)::before { display: none; }
  /* 译文 */
  .bi-table td:nth-child(2) { color: #2563EB; font-weight: 500; font-style: italic; }
  .bi-table td:nth-child(2)::before { content: '译'; }
  .bi-table td:nth-child(3)::before { content: '类型'; }
  .bi-table td:nth-child(4) { color: var(--muted); font-size: .76rem; }
  .bi-table td:nth-child(4)::before { content: '备注'; }
}
```

### 特产购物表 `.shop-table`

```css
@media (max-width: 640px) {
  .shop-table { display: block; }
  .shop-table tr:first-child { display: none; }
  .shop-table tr { display: block; margin-bottom: 10px; border: 1px solid #DDE3EC; border-radius: 9px; overflow: hidden; background: #fff; }
  .shop-table td { display: flex; align-items: flex-start; gap: 8px; padding: 7px 12px; border-bottom: 1px solid #F1F5F9; font-size: .8rem; line-height: 1.45; }
  .shop-table td:last-child { border-bottom: none; }
  .shop-table td::before { font-size: .62rem; font-weight: 700; color: var(--muted); min-width: 34px; flex-shrink: 0; padding-top: 2px; }
  .shop-table td:nth-child(1) { display: block; font-size: .88rem; font-weight: 600; background: #F8FAFC; padding: 9px 12px; border-bottom: 1px solid #E2E8F0; }
  .shop-table td:nth-child(1)::before { display: none; }
  .shop-table td:nth-child(2)::before { content: '地点'; }
  .shop-table td:nth-child(3) { font-weight: 700; color: #059669; }
  .shop-table td:nth-child(3)::before { content: '价格'; }
  .shop-table td:nth-child(4) { color: var(--muted); font-size: .76rem; }
  .shop-table td:nth-child(4)::before { content: '备注'; }
}
```

**购物模块顶部固定显示海关限额提示：**
烟酒数量上限、药品规范、禁止携带物品（土壤/新鲜果蔬/肉类）。

---

## 十一、移动端通用注意事项

### 表格卡片化三大陷阱

| 陷阱 | 现象 | 解决 |
|------|------|------|
| 表格无 `<thead>` 包裹 | `thead{display:none}` 无效，表头行仍显示 | 改用 `tr:first-child{display:none}` |
| `min-width` 写在媒体查询外 | 卡片被撑开，无法自适应 | 在 `@media` 内加 `min-width:0!important` |
| `<style>` 块写在 `<body>` 内 | 优先级可能高于 `<head>` 的样式 | 在 `<head>` 的媒体查询里用更高特异性覆盖，或加 `!important` |

### 通用卡片变换模板（任意表格）

```css
@media (max-width: 640px) {
  .my-table { display: block; min-width: 0 !important; }
  .my-table tr:first-child { display: none; }
  .my-table tr { display: block; margin-bottom: 10px; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; background: #fff; }
  .my-table td { display: flex; align-items: flex-start; gap: 8px; padding: 8px 13px; border-bottom: 1px solid #EEF2F7; }
  .my-table td:last-child { border-bottom: none; }
  .my-table td::before { font-size: .62rem; font-weight: 700; color: var(--muted); min-width: 34px; flex-shrink: 0; }
  /* 第一列 — 做卡片标题 */
  .my-table td:nth-child(1) { display: block; font-weight: 700; background: #EFF4FA !important; }
  .my-table td:nth-child(1)::before { display: none; }
  /* 后续列 — 各自注入标签 */
  .my-table td:nth-child(2)::before { content: '字段A'; }
  .my-table td:nth-child(3)::before { content: '字段B'; }
}
```

### 触控目标尺寸

| 元素 | min-height |
|------|-----------|
| 主 Tab `.tab-btn` | `44px` |
| 子导航 `.snav-btn` | `38px` |
| 其他可点击区域 | `≥ 36px` |

---

## 十二、GitHub Pages 发布

git hook 可能阻止 commit，**必须用 GitHub Contents API 直接推送**（Python urllib，无需 git）：

```python
import urllib.request, json, base64, pathlib

TOKEN = "ghp_..."
REPO  = "username/travel"
PATH  = "europe-travel-2026.html"
FILE  = pathlib.Path("repos/travel-ba03cac8/europe-travel-2026.html")

# 1. 获取当前文件 SHA（更新时必须）
req = urllib.request.Request(
    f"https://api.github.com/repos/{REPO}/contents/{PATH}",
    headers={"Authorization": f"token {TOKEN}", "User-Agent": "Claude"}
)
try:
    sha = json.loads(urllib.request.urlopen(req).read())["sha"]
except:
    sha = None

# 2. 上传
content = base64.b64encode(FILE.read_bytes()).decode()
body = json.dumps({
    "message": "Update travel guide",
    "content": content,
    **({"sha": sha} if sha else {})
}).encode()

req2 = urllib.request.Request(
    f"https://api.github.com/repos/{REPO}/contents/{PATH}",
    data=body, method="PUT",
    headers={
        "Authorization": f"token {TOKEN}",
        "Content-Type": "application/json",
        "User-Agent": "Claude"
    }
)
resp = json.loads(urllib.request.urlopen(req2).read())
print("Commit SHA:", resp["commit"]["sha"])
```

**多文件管理：** 同一仓库存多份攻略，每次指定不同 PATH。

| PATH | 访问地址 |
|------|---------|
| `index.html` | `username.github.io/travel/` |
| `japan-2025.html` | `username.github.io/travel/japan-2025.html` |

**注意事项：**
- 仓库必须是 **Public** 才能用免费 Pages
- Token 用完建议 Revoke，需要时重新生成

---

## 十三、HTML 结构完整性校验

每次大改后运行此脚本验证 `<div>` 深度，**final depth 必须为 0**：

```python
depth, in_script = 0, False
with open("europe-travel-2026.html") as f:
    for line in f:
        if "<script" in line: in_script = True
        if not in_script:
            depth += line.count("<div") - line.count("</div")
        if "</script>" in line: in_script = False
print("Final depth:", depth)  # 0 = 正常
```

---

## 十四、构建流程（新攻略）

1. **收集基本信息**：目的地、城市路线、日期、人数、预算
2. **定义国家/城市配色变量**（`--xx: #RRGGBB`）
3. **搭建 5 Tab 骨架**（直接套本 skill 的 HTML/CSS/JS 模板）
4. **填充地图数据**：Leaflet 标注点、日程数组
5. **录入预约清单**：`bookingData` 数组，注意 urgency 分级
6. **录入交通/住宿表格**：`.tbl-ticket` + `.hotel-tbl`
7. **录入费用数据**：`expenseData.items` 数组
8. **录入风险清单**：三级颜色分组
9. **录入实用速查**：天气/紧急/App/中英对照/特产
10. **验证 div 深度**（十三章脚本）
11. **Python 推送到 GitHub Pages**（十二章脚本）

---

## 示例触发方式

```
/travel-guide-app 欧洲 10天 2人
/travel-guide-app 日本东京大阪 7天 家庭游
/travel-guide-app 云南 5天
```

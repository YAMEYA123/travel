---
name: travel-guide-app
description: 构建旅游攻略网页 App。适用于行程规划、景点攻略、费用计算、风险提示等旅行工具类页面。触发词：旅游攻略、旅行计划、行程安排、出行攻略、travel guide、itinerary。
version: 1.0.0
user-invocable: true
argument-hint: "[目的地] [天数] [人数]"
---

# 旅游攻略网页 App 构建指南

根据参考攻略（欧洲多城市 10 日游）提炼的设计模式，适用于任何目的地的旅游攻略网页应用。

---

## 一、信息架构（三维结构）

所有旅游攻略页面围绕三个维度组织内容：

```
目的地维度（地点/国家/城市）
  ↕
时间维度（D0-Dn 日程时间线）
  ↕
资源维度（预约/费用/风险/工具）
```

### 顶层导航模块（必须包含）

| 模块 | 图标 | 内容 |
|------|------|------|
| 行程总览 | 🗺 | 日程地图动线、全程一览 |
| 待预约清单 | 📋 | 景点/交通/住宿预约状态追踪 |
| 费用计算器 | 💰 | 可交互的旅行预算汇总 |
| 风险预警 | ⚠️ | 分级风险清单 + 优先处理项 |
| 实用速查 | 🔧 | 天气/紧急号码/推荐 App |

---

## 二、核心功能模块实现

### 1. 日程时间线

- 用 `D0 / D1 / D2...` 标记每天
- 每天包含：城市、主要景点、住宿、交通、备注
- 支持展开/折叠（避免信息过载）
- 时间戳精确到小时（如 `09:00 出发 → 12:30 抵达`）

```html
<!-- 日程卡片结构 -->
<div class="day-card" data-day="1">
  <div class="day-header" onclick="toggleDay(this)">
    <span class="day-label">D1 · 城市名</span>
    <span class="toggle-icon">▼</span>
  </div>
  <div class="day-content">
    <!-- 景点列表、交通、住宿 -->
  </div>
</div>
```

### 2. 预约状态追踪系统

每个需要预约的项目使用统一状态标记：

| 状态 | 符号 | 含义 |
|------|------|------|
| 已完成 | ✅ | 已预约/已购买 |
| 待处理 | ⏳ | 需要去做 |
| 不需要 | ❌ | 不划算/跳过 |
| 强烈推荐 | ⭐ | 优先安排 |

进度条显示整体完成度（已完成数 / 总数）。

### 3. 可交互费用计算器

```javascript
// 费用计算器核心逻辑
const calculator = {
  people: 2,        // 人数（可调）
  currency: 'CNY',  // 货币（可切换）
  rate: 7.8,        // 汇率（可手动更新）
  
  items: [
    { name: '机票', amount: 800, unit: 'EUR', category: 'must', perPerson: true },
    { name: '景点门票', amount: 120, unit: 'EUR', category: 'must', perPerson: true },
    { name: '纪念品', amount: 50, unit: 'EUR', category: 'optional', perPerson: false },
  ],
  
  // 筛选模式：'must' | 'must+suggest' | 'all'
  filterMode: 'must',
  
  calculate() {
    return this.items
      .filter(i => this.shouldInclude(i))
      .reduce((sum, i) => sum + i.amount * (i.perPerson ? this.people : 1), 0)
  }
}
```

切换按钮：`仅必须项` / `必须+建议` / `全部费用`

### 4. 分级风险预警

三级颜色编码：

```css
.risk-high   { color: #e53e3e; } /* 🔴 高风险 — 出发前必须处理 */
.risk-medium { color: #dd6b20; } /* 🟠 中等  — 建议提前安排 */
.risk-low    { color: #d69e2e; } /* 🟡 低风险 — 知道即可 */
```

每条风险项包含：风险描述 + 处理建议 + 最晚处理时间。

### 5. 景点信息表格（中英对照）

| 景点（中文）| Attraction (EN) | 类型 | 地址 | 预约 | 建议时长 | 备注 |
|------------|-----------------|------|------|------|----------|------|
| 安妮之家 | Anne Frank House | 博物馆 | Prinsengracht 263 | 必须提前 | 2h | 官网提前购票 |

---

## 三、视觉设计规范

### 配色系统

```css
:root {
  --primary: #2b6cb0;      /* 主色：深蓝（旅行感） */
  --accent: #38a169;       /* 强调：绿色（确认/完成） */
  --warn: #dd6b20;         /* 警告：橙色 */
  --danger: #e53e3e;       /* 危险：红色 */
  --surface: #f7fafc;      /* 卡片背景 */
  --border: #e2e8f0;       /* 边框 */
  --text-primary: #2d3748; /* 主文字 */
  --text-secondary: #718096; /* 次要文字 */
}
```

### 图标使用原则

- 优先使用 Emoji 作为图标（零依赖、跨平台）
- 导航项用旗帜类：🇳🇱 🇩🇪 🇦🇹
- 功能用功能类：🗺 📋 💰 ⚠️ 🔧 ✈️ 🏨 🚂
- 状态用状态类：✅ ⏳ ❌ ⭐ 🔴 🟠 🟡

### 卡片布局

```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
```

---

## 四、交互模式

### 展开/折叠（核心交互）

```javascript
function toggleSection(el) {
  const content = el.nextElementSibling;
  const icon = el.querySelector('.toggle-icon');
  const isOpen = content.style.display !== 'none';
  content.style.display = isOpen ? 'none' : 'block';
  icon.textContent = isOpen ? '▶' : '▼';
}

// 全部展开 / 全部折叠 按钮
document.getElementById('expand-all').addEventListener('click', () => {
  document.querySelectorAll('.section-content').forEach(el => {
    el.style.display = 'block';
  });
});
```

### 滚动高亮导航

页面滚动时顶部导航自动高亮对应章节（IntersectionObserver）。

### 本地存储进度

```javascript
// 保存勾选状态，刷新后不丢失
function saveProgress(id, checked) {
  const progress = JSON.parse(localStorage.getItem('travel-progress') || '{}');
  progress[id] = checked;
  localStorage.setItem('travel-progress', JSON.stringify(progress));
}
```

---

## 五、实用速查模块

固定在页面底部或侧边栏，包含：

- **天气**：目的地各月均温表格
- **紧急号码**：当地报警/急救/中国大使馆
- **必备 App**：Google Maps / 当地交通 App / 翻译工具
- **实用链接**：官方旅游局、签证网站、铁路购票
- **特产 & 纪念品**：按城市/地区列出推荐购买清单（见下方规范）

### 特产 & 纪念品购买推荐规范

每个目的地单独一个卡片，包含以下字段：

| 字段 | 说明 |
|------|------|
| 品名（中/英） | 方便认货，尤其超市/药妆店场景 |
| 类型 | 食品 / 酒水 / 美妆 / 工艺品 / 服饰 / 文创 |
| 推荐指数 | ⭐⭐⭐ 必买 / ⭐⭐ 值得买 / ⭐ 可考虑 |
| 参考价格 | 当地货币 + 人民币换算 |
| 购买地点 | 超市品牌 / 官方门店 / 机场免税 / 景区商店 |
| 注意事项 | 海关限额、易碎品包装、保质期、仿品提示 |

**示例（荷兰）：**

| 品名 | 类型 | 推荐 | 参考价 | 购买地点 | 注意 |
|------|------|------|--------|---------|------|
| 荷兰奶酪 / Dutch Cheese | 食品 | ⭐⭐⭐ | €5-15/块 | Albert Heijn 超市 | 真空包装可带回，液体奶酪不行 |
| 戴尔夫特蓝陶 / Delftware | 工艺品 | ⭐⭐⭐ | €15-80 | 官方认证店、机场 | 认准"Delft"印章，避免仿品 |
| Rituals 身体护理 | 美妆 | ⭐⭐ | €8-25 | Rituals 门店 | 国内无专柜，价格约为代购6折 |
| 郁金香球茎 | 特产 | ⭐⭐ | €5-12/袋 | 花卉市场 | 需检疫证明，确认可入境 |

**购物清单交互：**

```javascript
// 支持勾选已购/待买，与预约追踪系统共用同一状态存储
// 类别筛选：全部 / 食品 / 美妆 / 工艺品
// 按推荐指数排序
const shoppingList = {
  filter: 'all',   // 'all' | 'food' | 'beauty' | 'craft'
  sortBy: 'rating' // 'rating' | 'price' | 'city'
}
```

**海关限额提示**（固定展示在购物模块顶部）：

- 🧾 烟酒/食品数量限制（按目的地自动显示）
- 💊 药品携带规范
- 🚫 禁止携带入境物品警示（如土壤、新鲜果蔬、肉类）

---

## 六、技术实现建议

### 单文件 HTML（推荐）

旅游攻略适合做成**单个 HTML 文件**，方便离线保存和分享：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🗺 [目的地] 旅游攻略</title>
  <!-- 所有 CSS 内联在 <style> 中 -->
  <!-- 所有 JS 内联在 <script> 中 -->
  <!-- 无外部依赖，可离线使用 -->
</head>
```

### 响应式适配

- 桌面：三栏布局（导航 | 主内容 | 速查）
- 平板：两栏（导航+内容 | 速查抽屉）
- 手机：单栏 + 底部 Tab 导航

### 打印优化

```css
@media print {
  .no-print { display: none; }
  .day-content { display: block !important; } /* 强制展开所有折叠内容 */
  a[href]::after { content: " (" attr(href) ")"; } /* 打印时显示链接 */
}
```

---

## 七、构建流程

1. **收集信息**：目的地、天数、人数、预算、出发/返回日期
2. **设计日程骨架**：D0-Dn 时间线，按城市分块
3. **填充景点数据**：名称（中英）、类型、地址、预约方式、建议时长
4. **制作预约清单**：逐一标记状态
5. **建立费用表**：分类（交通/住宿/餐饮/景点/其他），设置必须/建议/可选
6. **整理风险清单**：按高/中/低分级，注明处理截止日期
7. **补充速查信息**：天气、紧急联系、推荐 App
8. **实现交互**：展开折叠、费用计算器、进度勾选、本地存储

---

## 八、GitHub Pages 部署方案

旅游攻略单文件 HTML 最适合用 GitHub Pages 免费托管，生成可分享的公开链接。**用户无需懂 git，Claude 通过 GitHub API 完成全部上传操作。**

### 用户只需提供两样东西

1. **GitHub 仓库地址**（如 `https://github.com/yourname/travel`）
2. **GitHub Personal Access Token**

> 👇 没做过？按下面教程一步步来，5 分钟搞定。

---

### 教程一：创建 GitHub 仓库

> 已有仓库可跳过此步。

**第一步：注册 / 登录**
打开 [github.com](https://github.com)，没有账号点右上角 **Sign up** 注册，已有账号点 **Sign in**。

**第二步：新建仓库**
登录后点右上角 **`+`** 图标 → 选 **New repository**。

**第三步：填写信息**

| 字段 | 填写内容 |
|------|---------|
| Repository name | 随便取，如 `travel`（只能用英文和短横线） |
| Description | 选填，如"我的旅游攻略" |
| Public / Private | 必须选 **Public**（免费 Pages 只支持公开仓库） |
| Initialize this repository | 勾选 **Add a README file** |

**第四步：点击 Create repository**
页面跳转后，复制浏览器地址栏的链接，就是仓库地址，格式为：
`https://github.com/你的用户名/travel`

---

### 教程二：生成 Personal Access Token

> Token 是 GitHub 给你的"操作密钥"，让 Claude 代替你上传文件。

**第一步：进入设置**
点击页面右上角**头像** → 下拉菜单最底部点 **Settings**。

**第二步：找到开发者设置**
左侧菜单滚到最底部，点 **Developer settings**。

**第三步：选择 Token 类型**
点 **Personal access tokens** → 选 **Tokens (classic)**。

**第四步：生成 Token**
点右上角 **Generate new token** → 选 **Generate new token (classic)**，可能需要输入密码确认身份。

**第五步：填写信息**

| 字段 | 填写内容 |
|------|---------|
| Note | 随便写，如 `travel-guide` |
| Expiration | 建议选 **30 days**（用完即过期，更安全） |
| Select scopes | 勾选 **repo**（点一下 repo 前面的方框，下面子项会自动全选） |

**第六步：复制 Token**
点最底部绿色按钮 **Generate token**，页面出现一串以 `ghp_` 开头的字符串。
⚠️ **立刻复制保存**，离开页面后就再也看不到了。

---

### Claude 的操作流程

收到仓库地址和 Token 后，Claude 自动完成：

```
1. 调用 GitHub API 上传 index.html（攻略文件）
2. 检查仓库是否已开启 Pages，否则自动开启
3. 返回访问链接：https://<用户名>.github.io/<仓库名>/
```

核心 API 调用（Claude 执行，用户无需关心）：

```bash
# 上传/更新文件
curl -X PUT https://api.github.com/repos/<用户名>/<仓库名>/contents/index.html \
  -H "Authorization: token <TOKEN>" \
  -d '{"message":"Update travel guide","content":"<base64内容>"}'

# 开启 GitHub Pages
curl -X POST https://api.github.com/repos/<用户名>/<仓库名>/pages \
  -H "Authorization: token <TOKEN>" \
  -d '{"source":{"branch":"main","path":"/"}}'
```

### 多目的地管理

同一个仓库可以存多份攻略，每次上传时指定不同文件名：

| 文件名 | 访问链接 |
|--------|---------|
| `index.html` | `yourname.github.io/travel/` |
| `japan-2025.html` | `yourname.github.io/travel/japan-2025.html` |
| `yunnan-2024.html` | `yourname.github.io/travel/yunnan-2024.html` |

### 注意事项

| 项目 | 说明 |
|------|------|
| 仓库可见性 | 必须是 **Public** 才能用免费 Pages |
| Token 安全 | 用完后建议在 GitHub 撤销（Revoke），需要时再生成新的 |
| 更新攻略 | 重新提供文件即可，Claude 覆盖上传，30 秒内生效 |
| localStorage | 每位访客进度独立存储，不跨设备同步 |

---

## 示例触发方式

```
/travel-guide-app 欧洲 10天 2人
/travel-guide-app 日本东京大阪 7天 家庭游
/travel-guide-app 云南 5天
```

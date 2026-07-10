---
name: travel-gogogo
description: 一站式旅游攻略生成 + GitHub Pages 发布。用户提供目的地和 GitHub 信息，自动生成旅游攻略网站；若目的地对中国护照非免签，额外生成签证用行程单（PDF 友好 HTML 格式）。触发词：帮我做旅游攻略、生成旅行网站、出行攻略、travel-gogogo。
version: 1.0.0
user-invocable: true
argument-hint: "[目的地] [出发日期] [天数] [人数]"
---

# travel-gogogo — 一站式旅游攻略生成指南

本 skill 从零到一完成：**信息收集 → 免签判断 → 生成攻略网站 → （非免签）生成行程单 → 部署 GitHub Pages**。

---

## 一、启动流程：先问清楚再动手

用户触发本 skill 后，若关键信息缺失，一次性汇总追问（不要多轮来回）：

```
我需要以下信息来帮你生成旅游攻略网站：

【行程信息】
1. 目的地城市/国家（如：法国巴黎 + 尼斯，或 日本东京 + 大阪）
2. 出发日期（如：2025-09-01）
3. 行程天数（如：10天）
4. 出行人数和关系（如：2人情侣游、4人家庭含老人）
5. 大致预算（如：人均¥15,000）

【GitHub 信息】（用于发布到网上，没有账号请告诉我，我来引导你注册）
6. GitHub 仓库地址（如 https://github.com/yourname/travel）
7. GitHub Personal Access Token（ghp_ 开头的字符串）

没有 GitHub 账号或 Token？回复"帮我设置"，我会一步步引导你。
```

**如果用户已在触发时提供了部分信息，只追问缺失的部分。**

---

## 二、免签判断（中国护照）

收到目的地后，立即判断是否需要签证。以下是常见结论，遇到不确定情况，在页面内添加提示让用户自行确认：

### 对中国护照免签/落地签（无需行程单）
泰国、马来西亚、新加坡、印度尼西亚（≤30天）、越南（≤45天）、柬埔寨（落地签）、日本（2024年起暂时恢复免签）、韩国（部分短期）、格鲁吉亚、塞尔维亚、阿联酋、摩洛哥、毛里求斯、斯里兰卡（电子签/落地签）等。

> ⚠️ 免签政策经常变动，生成页面时在「实用速查」模块标注「请出发前在领事馆官网确认最新政策」。

### 需要签证（必须生成行程单）
**申根区（欧洲）**：法国、德国、荷兰、意大利、西班牙、奥地利、瑞士等 27 国
**英国、美国、加拿大、澳大利亚、新西兰**
**其他大多数国家**：日本（若非免签期）、巴西、阿根廷等

---

## 三、旅游攻略网站生成规范

基于 `travel-guide-app` skill 的完整规范构建，以下为增量规范：

### 3.1 文件命名

```
{目的地拼音缩写}-travel-{YYYY}.html

示例：
europe-travel-2026.html   ← 欧洲多城市
japan-travel-2025.html    ← 日本
paris-travel-2025.html    ← 单城市
```

### 3.2 必含模块（Tab 导航）

| Tab | 图标 | 内容要点 |
|-----|------|---------|
| 行程动线 | 🗺 | Leaflet 地图 + 每日路线折叠卡片 |
| 待预约清单 | 📋 | 景点/交通/住宿，带进度条 |
| 风险清单 | ⚠️ | 签证/健康/安全/退税 风险分级 |
| 交通攻略 | 🎫 | 城市间/城市内交通，含推荐 App 卡片 |
| 费用总览 | 💰 | 分类预算 + 人数 × 汇率计算器 |
| 住宿推荐 | 🏨 | 每晚住处 + 地址 + Booking/Hotels 链接 |
| 实用速查 | 🌤 | 见 3.3 |
| **分账记账** | 💸 | **多人游必含，见 3.4** |

若为**申根区或有签证需求**，额外加 Tab：

| Tab | 图标 | 内容 |
|-----|------|------|
| 签证清单 | 🛂 | 申请材料逐项打勾，含行程单下载入口 |
| 中英对照 | 🔤 | 高频短语对照表（景点、问路、点餐、购物、求助） |

### 3.3 分账记账模块（💸）

**所有生成的攻略默认包含此 Tab**，数据存 `localStorage`，刷新不丢失。

#### 三个子区块

| 区块 | 功能 |
|------|------|
| 👥 成员管理 | 添加/删除出行人，输入姓名 Enter 快速添加 |
| ➕ 添加消费 | 选货币（EUR/CNY/USD/GBP）、填金额、选付款人、勾选参与人（默认全选） |
| 📋 消费记录 | 按时间倒序列表，每条显示日期/说明/金额/付款人/每人分摊额，支持单条删除 |
| 🧮 结算方案 | 自动计算各人净余额（CNY）+ 最优还款路径（最少转账次数） |

#### 结算算法

```javascript
// 1. 汇率换算（固定参考汇率，标注「仅供估算」）
const RATES = { EUR:7.8, CNY:1, USD:7.3, GBP:9.2, JPY:0.048 }

// 2. 计算净余额
balance[payer] += totalCNY          // 付款人余额增加
splitters.forEach(s => balance[s] -= each)  // 参与人减少

// 3. 最优转账（贪心，债权人/债务人排序后最小转账次数）
while creditors and debtors remain:
    pay = min(creditor.val, debtor.val)
    record transfer(debtor → creditor, pay)
```

#### 关键实现要点

- 数据 key：`localStorage.setItem('splitbill_v1', JSON.stringify({members, records}))`
- 记录结构：`{id, desc, amount, currency, payer, splitters[], date, location}`（date/location 选填，date 默认预填今天）
- 结算卡片：余额正数绿色（应收）、负数红色（应付）、接近零灰色（持平）
- 移动端：表格横向滚动，`min-width:400px` + `-webkit-overflow-scrolling:touch`

### 3.4 实用速查模块内容

1. **实用生活信息**：插座/电压、货币/付款方式、小费习惯、网络/SIM卡、时区、安全提示
2. **🛍 特产 & 纪念品推荐**：按城市分表，含品名（中/英）、购买地点、参考价、推荐标签（必买/送礼/食品/药妆）、退税提示
3. **📱 出行必备 App**：卡片网格，含彩色图标、App 名、一句话介绍、iOS App Store 下载按钮（黑底）
   - 分类：交通票务 / 地图导航 / 打车出行 / 支付汇率 / 餐饮住宿

### 3.4 地图实现

使用 Leaflet.js（CDN），预计算路线坐标（`PRECOMP_ROUTES`），每段线坐标最多 30 点（`thin()` 函数降采样防卡顿）：

```javascript
const thin = (pts, max) => {
  if (pts.length <= max) return pts
  const step = (pts.length - 1) / (max - 1)
  return Array.from({length: max}, (_, i) => pts[Math.round(i * step)])
}
// 展开动线 setTimeout 延迟用 10ms，不要用 50ms+
setTimeout(() => drawDayRoute(i), 10)
```

---

## 四、行程单生成规范（仅非免签目的地）

行程单是**签证申请的核心材料之一**，格式必须正式、信息完整。

### 4.1 文件命名

```
{目的地拼音缩写}-itinerary-{YYYY}.html

示例：
europe-itinerary-2026.html
usa-itinerary-2025.html
```

### 4.2 行程单 HTML 结构

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>出行行程单 — [目的地] [出发日期]</title>
  <style>
    /* 打印优先样式 */
    body { font-family: "SimSun", "宋体", serif; font-size: 12pt; max-width: 210mm; margin: 0 auto; padding: 20mm; color: #000; }
    @media print { body { padding: 15mm; } .no-print { display: none; } }
    h1 { text-align: center; font-size: 18pt; border-bottom: 2px solid #000; padding-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; }
    th, td { border: 1px solid #333; padding: 6px 10px; text-align: left; vertical-align: top; }
    th { background: #f0f0f0; font-weight: bold; }
    .section-title { font-size: 13pt; font-weight: bold; margin: 16px 0 6px; border-left: 4px solid #333; padding-left: 8px; }
    .print-btn { position: fixed; bottom: 24px; right: 24px; background: #1a56db; color: #fff; border: none; border-radius: 8px; padding: 12px 20px; font-size: 14px; cursor: pointer; }
  </style>
</head>
<body>
  <!-- 打印按钮（不打印时显示） -->
  <button class="print-btn no-print" onclick="window.print()">🖨️ 打印 / 导出PDF</button>

  <h1>出行行程单</h1>

  <!-- 一、出行人信息 -->
  <div class="section-title">一、出行人信息</div>
  <table>
    <tr><th>姓名（拼音）</th><td>[用户填写]</td><th>护照号</th><td>[用户填写]</td></tr>
    <tr><th>出生日期</th><td>[用户填写]</td><th>国籍</th><td>中国</td></tr>
    <tr><th>联系电话</th><td>[用户填写]</td><th>电子邮箱</th><td>[用户填写]</td></tr>
  </table>

  <!-- 二、行程概要 -->
  <div class="section-title">二、行程概要</div>
  <table>
    <tr><th>目的地国家</th><td>[国家名（中/英）]</td><th>签证类型</th><td>旅游签证</td></tr>
    <tr><th>出发日期</th><td>[YYYY-MM-DD]</td><th>返回日期</th><td>[YYYY-MM-DD]</td></tr>
    <tr><th>行程天数</th><td>[N] 天</td><th>出行人数</th><td>[N] 人</td></tr>
    <tr><th>第一入境国</th><td>[国家名]</td><th>申请使馆</th><td>[使馆名称，申根区填主要停留国]</td></tr>
  </table>

  <!-- 三、逐日行程表 -->
  <div class="section-title">三、逐日行程明细</div>
  <table>
    <thead>
      <tr>
        <th style="width:8%">日期</th>
        <th style="width:8%">天次</th>
        <th style="width:15%">所在城市/国家</th>
        <th style="width:30%">主要活动 / 景点</th>
        <th style="width:20%">住宿（名称+地址）</th>
        <th style="width:19%">交通方式</th>
      </tr>
    </thead>
    <tbody>
      <!-- 按天生成行：[日期] | D1 | 城市 | 活动 | 酒店名+地址 | 航班号/火车号 -->
    </tbody>
  </table>

  <!-- 四、交通预订信息 -->
  <div class="section-title">四、交通预订信息</div>
  <table>
    <thead><tr><th>类型</th><th>日期</th><th>航班/车次</th><th>出发地</th><th>目的地</th><th>出发时间</th><th>到达时间</th><th>预订状态</th></tr></thead>
    <tbody>
      <!-- 出发国际航班、回程航班、城市间交通 -->
    </tbody>
  </table>

  <!-- 五、住宿汇总 -->
  <div class="section-title">五、住宿预订汇总</div>
  <table>
    <thead><tr><th>入住日期</th><th>退房日期</th><th>酒店名称</th><th>地址</th><th>预订平台</th><th>预订状态</th></tr></thead>
    <tbody>
      <!-- 逐晚住宿 -->
    </tbody>
  </table>

  <!-- 六、资金证明（提示） -->
  <div class="section-title">六、资金与保险（提示，非行程单正文）</div>
  <p style="color:#555;font-size:10pt">
    ⚠️ 此部分仅为提醒，签证申请时需另附：<br>
    • 银行流水（近6个月，显示账号尾号）<br>
    • 存款证明（余额需覆盖每日€100左右，申根区建议€1500+/人）<br>
    • 旅行保险（申根区要求保额 ≥ €30,000，覆盖全程日期）
  </p>

  <!-- 七、声明 -->
  <div class="section-title">七、本人声明</div>
  <p>本人（[姓名]）声明：以上行程信息真实、准确，如有变更，将及时告知相关机构。</p>
  <br>
  <table style="border:none">
    <tr>
      <td style="border:none;width:50%">签名：___________________</td>
      <td style="border:none;width:50%">日期：___________________</td>
    </tr>
  </table>
</body>
</html>
```

### 4.3 行程单内容填写规则

- **逐日行程**：每天单独一行，日期精确到天（`2026-04-28 周二`），城市含国家（`阿姆斯特丹, 荷兰`）
- **住宿**：若用户有预订信息则填入；若尚未预订，写 `[待预订] 阿姆斯特丹市区酒店` 并在攻略网站「待预约清单」中标记
- **交通**：出发/回程国际航班写 `[待购票]`，城市间交通（Thalys/IC 等）写 `[待购票] 阿姆斯特丹→科隆，约2.5h`
- **申根区特殊处理**：注明主要停留国（天数最多的国家）和第一入境申根国，行程单顶部加粗提示：「申根区签证请向主要停留国使馆申请」

### 4.4 行程单与攻略联动

攻略网站「签证清单」Tab 中添加入口：

```html
<a href="./europe-itinerary-2026.html" class="itinerary-link" target="_blank">
  📄 查看 / 打印行程单（签证用）
</a>
```

---

## 五、GitHub Pages 部署流程

### 5.1 大文件上传方法（必须用 Python，不要用 curl）

HTML 文件通常超过 100KB，curl 在 base64 编码后易超命令行限制，**固定用 Python**：

```python
import urllib.request, json, base64, os

TOKEN = "<用户提供的 Token>"
REPO  = "<用户名>/<仓库名>"   # 如 yameya123/travel
FILES = [
    ("europe-travel-2026.html",    "/path/to/europe-travel-2026.html"),
    ("europe-itinerary-2026.html", "/path/to/europe-itinerary-2026.html"),  # 仅非免签时
]

def upload(api_path, local_path, message):
    url = f"https://api.github.com/repos/{REPO}/contents/{api_path}"
    # 获取现有文件 sha（更新时必须）
    sha = None
    try:
        req = urllib.request.Request(url, headers={"Authorization": f"token {TOKEN}", "User-Agent": "curl/7"})
        sha = json.loads(urllib.request.urlopen(req).read())["sha"]
    except: pass

    with open(local_path, "rb") as f:
        content = base64.b64encode(f.read()).decode()

    body = {"message": message, "content": content}
    if sha: body["sha"] = sha

    req = urllib.request.Request(url,
        data=json.dumps(body).encode(),
        headers={"Authorization": f"token {TOKEN}", "Content-Type": "application/json", "User-Agent": "curl/7"},
        method="PUT")
    res = json.loads(urllib.request.urlopen(req).read())
    print("✅", api_path, "→", res["content"]["html_url"])

for api_path, local_path in FILES:
    upload(api_path, local_path, f"Update {api_path}")
```

### 5.2 Pages 自动开启检查

```python
# 检查 Pages 是否已开启
url = f"https://api.github.com/repos/{REPO}/pages"
try:
    req = urllib.request.Request(url, headers={"Authorization": f"token {TOKEN}", "User-Agent":"curl/7"})
    info = json.loads(urllib.request.urlopen(req).read())
    print("Pages 已开启：", info["html_url"])
except urllib.error.HTTPError as e:
    if e.code == 404:
        # 开启 Pages
        req = urllib.request.Request(url,
            data=json.dumps({"source":{"branch":"main","path":"/"}}).encode(),
            headers={"Authorization": f"token {TOKEN}", "Content-Type":"application/json","User-Agent":"curl/7"},
            method="POST")
        urllib.request.urlopen(req)
        print("✅ Pages 已开启")
```

### 5.3 推送后告知用户

```
✅ 旅游攻略已发布！

📍 攻略网站：https://<用户名>.github.io/<仓库名>/europe-travel-2026.html
📄 行程单：  https://<用户名>.github.io/<仓库名>/europe-itinerary-2026.html（约1分钟后生效）

建议：
• 打开攻略网站，检查各 Tab 内容是否正确
• 行程单可直接在浏览器按 Ctrl+P（Mac: ⌘P）→「另存为 PDF」
• 如需修改，告诉我哪里要改，我直接覆盖更新
```

---

## 六、用户没有 GitHub 时的引导流程

若用户回复「没有账号」或「帮我设置」，逐步引导（可参考同目录 `github-setup.md`）：

1. 注册 github.com（5分钟）
2. 创建 Public 仓库，勾选 "Add a README file"
3. 生成 Token（选 **repo** 权限，30天有效期）
4. 把仓库地址 + Token 发给 Claude

---

## 七、快速触发示例

```
/travel-gogogo 欧洲阿姆斯特丹+科隆+维也纳 10天 2人 2026年4月
/travel-gogogo 日本东京+大阪 7天 家庭4人
/travel-gogogo 泰国曼谷+清迈 8天 3人 预算¥8000/人
/travel-gogogo 法国巴黎+尼斯 12天 2人情侣游
```

---

## 八、关键注意事项

| 事项 | 规范 |
|------|------|
| 行程单敏感信息 | 护照号、出生日期等留空让用户自填，**不要编造** |
| 免签政策时效 | 页面显著位置标注「政策以出发前领事馆官网为准」 |
| 酒店未预订 | 行程单内写「[待预订]」，攻略清单内标记 ⏳ |
| 多人出行 | 行程单可注明「共 N 人，其余人员行程相同」，无需单独制表 |
| 大文件推送 | 固定用 Python urllib，禁止用 curl（会因 base64 超限失败） |
| 地图坐标降采样 | 每段折线最多 30 点（thin 函数），展开延迟 10ms |

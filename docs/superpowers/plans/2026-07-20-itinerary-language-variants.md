# Itinerary Language Variants Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在保留现有双语行程单链接的前提下，补充9月28日行程，并生成内容一致的纯中文、纯英文HTML与Word版本。

**Architecture:** 现有双语HTML继续作为人工核对基准；中文和英文HTML是独立静态文档，便于直接打印。Word版本使用Office Open XML生成，按相同数据表输出，生成后通过ZIP、XML及关键文本检查防止内容漂移。

**Tech Stack:** HTML5、CSS打印样式、Python标准库 `zipfile`、Office Open XML、Git。

---

## 文件结构

- 修改：`visa-itinerary-2026.html` — 根目录双语版。
- 修改：`20260925/visa-itinerary-2026.html` — 子目录双语版。
- 修改：`20260925/visa-itinerary-2026.docx` — 双语Word版。
- 新建：`20260925/visa-itinerary-2026-zh.html` — 纯中文版。
- 新建：`20260925/visa-itinerary-2026-en.html` — 纯英文版。
- 新建：`20260925/visa-itinerary-2026-zh.docx` — 纯中文Word版。
- 新建：`20260925/visa-itinerary-2026-en.docx` — 纯英文Word版。

### Task 1：更新双语基准文件

- [ ] **Step 1：修改9月28日活动**

将双语版D4活动替换为：

```html
<td>晨游后乘ICE赴慕尼黑，入住后游览国王广场及周边<span class="en">Take the ICE to Munich; check in, then visit Königsplatz and the surrounding area</span></td>
```

- [ ] **Step 2：同步两份双语HTML**

```bash
cp visa-itinerary-2026.html 20260925/visa-itinerary-2026.html
cmp -s visa-itinerary-2026.html 20260925/visa-itinerary-2026.html
```

预期：`cmp`退出码为0。

### Task 2：生成独立语言HTML

- [ ] **Step 1：创建纯中文版**

复制双语版布局到 `20260925/visa-itinerary-2026-zh.html`，删除英文副标题、`.en`内容和英文声明；D4保留：

```html
<td>晨游后乘ICE赴慕尼黑，入住后游览国王广场及周边</td>
```

同行人区域保留以下字段：

```html
<label>同行人完整姓名</label>
<label>同行人护照号</label>
<div>旅行组织者：申请人与同行人自行组织</div>
<div>旅行社：不适用</div>
```

- [ ] **Step 2：创建纯英文版**

复制相同布局到 `20260925/visa-itinerary-2026-en.html`，删除中文标题、中文活动和中文声明；D4保留：

```html
<td>Take the ICE to Munich; check in, then visit Königsplatz and the surrounding area</td>
```

同行人区域保留以下字段：

```html
<label>Travel Companion Full Name</label>
<label>Passport No.</label>
<div>Trip organisers: Self-organised by the applicant and travel companion</div>
<div>Travel agency: N/A</div>
```

- [ ] **Step 3：检查日期及关键内容**

```bash
for f in 20260925/visa-itinerary-2026{,-zh,-en}.html; do
  rg -q '9/24' "$f"
  rg -q '10/7' "$f"
  rg -q 'MF811' "$f"
  rg -q 'OS015' "$f"
done
rg -q '国王广场' 20260925/visa-itinerary-2026-zh.html
rg -q 'Königsplatz' 20260925/visa-itinerary-2026-en.html
```

预期：所有命令退出码为0。

### Task 3：生成三份Word文件

- [ ] **Step 1：生成中文版Word**

使用Python标准库将中文申请人字段、同行人字段、行程概览、14行逐日行程、3条航班、6条住宿、国家晚数及中文声明写入 `20260925/visa-itinerary-2026-zh.docx`。

- [ ] **Step 2：生成英文版Word**

使用同一数据顺序，将英文对应内容写入 `20260925/visa-itinerary-2026-en.docx`，确保D4包含 `Königsplatz`。

- [ ] **Step 3：重新生成双语Word**

更新 `20260925/visa-itinerary-2026.docx`，确保D4同时包含 `国王广场` 与 `Königsplatz`。

- [ ] **Step 4：验证DOCX容器和XML**

```bash
for f in 20260925/visa-itinerary-2026{,-zh,-en}.docx; do
  unzip -t "$f"
done
python -c "from zipfile import ZipFile; from xml.etree import ElementTree as ET; import glob; [ET.fromstring(ZipFile(p).read('word/document.xml')) for p in glob.glob('20260925/*.docx')]; print('all docx xml valid')"
```

预期：三个压缩包均无错误，输出 `all docx xml valid`。

### Task 4：整体核验、提交和推送

- [ ] **Step 1：检查规范字段**

```bash
rg -n '同行人|Travel Companion|护照|Passport|旅行组织者|Trip organisers|旅行社|Travel agency' 20260925/visa-itinerary-2026*.html
rg -n '德国 Germany|6晚|6 nights' 20260925/visa-itinerary-2026.html
```

预期：双语、中文、英文文件分别出现对应字段，德国仍为6晚。

- [ ] **Step 2：检查Git差异**

```bash
git diff --check
git status --short
```

预期：无空白错误，变更只包含计划中的7个行程文件。

- [ ] **Step 3：提交**

```bash
git add visa-itinerary-2026.html 20260925/visa-itinerary-2026.html 20260925/visa-itinerary-2026.docx 20260925/visa-itinerary-2026-zh.html 20260925/visa-itinerary-2026-en.html 20260925/visa-itinerary-2026-zh.docx 20260925/visa-itinerary-2026-en.docx
git commit -m "docs: add separate Chinese and English visa itineraries"
```

- [ ] **Step 4：同步并推送**

```bash
git fetch origin
git rebase origin/main
git push origin main
git status --short --branch
```

预期：本地 `main` 与 `origin/main`一致且工作区干净。

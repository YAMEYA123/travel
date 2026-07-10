# GitHub 新手设置教程

本教程帮助没有使用过 GitHub 的用户完成两件事：**创建仓库** 和 **生成 Token**，完成后即可让 Claude 帮你把旅游攻略发布到网上。

---

## 教程一：创建 GitHub 仓库

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

把这个链接告诉 Claude 即可。

---

## 教程二：生成 Personal Access Token

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

## 完成后告诉 Claude

把以下两样东西发给 Claude：

```
仓库地址：https://github.com/你的用户名/travel
Token：ghp_xxxxxxxxxxxxxxxx
```

Claude 会自动完成上传和发布，并返回可分享的链接。

> **Token 使用完毕后**，建议去 GitHub → Settings → Developer settings → Personal access tokens，点 **Delete** 撤销，防止泄露。需要时再生成新的即可。

# 零基础上手指南：把旅游攻略发布到网上

> 不需要懂编程，跟着做完只需要 **10 分钟**，你的攻略就可以通过链接分享给任何人。

---

## 你需要做的事情，只有两件

1. **在 GitHub 创建一个免费仓库**（相当于一个网盘文件夹）
2. **生成一个访问密钥（Token）**（相当于给 Claude 一把临时钥匙，让它帮你上传文件）

完成后，把这两样东西告诉 Claude，剩下的全由 Claude 来做。

---

## 第一步：注册 GitHub 账号

> 已有账号？直接跳到第二步。

1. 打开 [github.com](https://github.com)
2. 点右上角 **Sign up**（注册）
3. 填写邮箱、密码、用户名（用户名会出现在你的网站链接里，建议用英文，如 `zhangsan`）
4. 验证邮箱后登录

---

## 第二步：创建一个仓库（存放攻略的地方）

1. 登录后，点页面右上角的 **`+`** 号 → 选 **New repository**

2. 填写以下内容：

   | 字段 | 填写内容 |
   |------|---------|
   | Repository name | `travel`（只能用英文、数字、短横线） |
   | Description | 选填，写「我的旅游攻略」也行 |
   | Public / Private | 必须选 ✅ **Public**（公开，免费 Pages 才能用） |
   | Initialize this repository | 勾选 ✅ **Add a README file** |

   ![新建仓库页面示意](images/step1-create-repo.png)

3. 点绿色按钮 **Create repository**

4. 页面跳转后，复制浏览器地址栏的网址，格式像这样：
   ```
   https://github.com/zhangsan/travel
   ```
   把这个链接记下来，等会要给 Claude。

---

## 第三步：生成 Token（临时访问密钥）

Token 是 GitHub 给你生成的一串字符，让 Claude 能代替你上传文件。**用完可以删掉，非常安全。**

### 操作步骤

1. 点页面右上角你的**头像**

2. 在下拉菜单里，选最底部的 **Settings**（设置）

3. 进入设置页面后，把**左侧菜单滚到最底部**，找到并点击 **Developer settings**

4. 点 **Personal access tokens** → 再点 **Tokens (classic)**

   ![Token 列表页面](images/step2-token-list.png)

5. 点右上角 **Generate new token** → 选 **Generate new token (classic)**
   （可能需要输入密码或验证身份）

6. 填写信息：

   | 字段 | 填写内容 |
   |------|---------|
   | Note | 随便写，如 `travel-skill` |
   | Expiration（有效期） | 建议选 **30 days**（30天后自动失效，更安全） |
   | Select scopes（权限） | 勾选 **repo** 前面的方框，下面的子项会自动全选 ✅ |

   ![填写 Token 信息](images/step3-token-settings.png)

7. 滚到页面最底部，点绿色按钮 **Generate token**

8. 页面上会出现一串以 **`ghp_`** 开头的字符，如下图绿色框内所示：

   ![Token 生成成功，立刻复制](images/step4-token-generated.png)

   ⚠️ **立刻复制保存好！** 离开这个页面就再也看不到了。
   （如果忘了保存，删掉这个 Token，重新生成一个就好。）

---

## 第四步：把信息给 Claude

把以下两样东西发给 Claude：

```
仓库地址：https://github.com/zhangsan/travel
Token：ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456
```

Claude 会自动上传攻略文件并开启网站，完成后会告诉你访问链接，格式类似：

```
https://zhangsan.github.io/travel/europe-travel-2026.html
```

---

## 常见问题

**Q：Token 泄露了怎么办？**
去 GitHub → Settings → Developer settings → Personal access tokens，找到那条记录，点 **Delete** 删掉即可。需要时重新生成一个。

**Q：我的攻略别人能搜到吗？**
GitHub Pages 是公开的，但链接很难被搜索引擎收录。如果想完全私密，可以把 HTML 文件下载到本地使用，不需要发布到网上。

**Q：同一个仓库能放多份攻略吗？**
可以。每次生成新攻略时，Claude 会用不同的文件名上传，比如 `japan-2025.html`、`europe-2026.html`，互不影响。

**Q：攻略更新了怎么办？**
告诉 Claude 要修改哪里，Claude 会直接覆盖上传，几秒钟就能更新，无需你手动操作。

**Q：仓库名必须叫 `travel` 吗？**
不是，可以取任何英文名。仓库名会出现在链接里，如叫 `my-trips` 则链接为 `zhangsan.github.io/my-trips/`。

---

## 一图总结

```
注册 GitHub → 建仓库（Public）→ 生成 Token（repo 权限）
                                          │
                                    发给 Claude
                                          │
                              Claude 自动上传 + 开启网站
                                          │
                              你收到可分享的链接 🎉
```

<table>
  <tr>
    <td width="240" align="center" valign="middle">
      <img src="https://cdn.sanity.io/images/nl0qw78w/production/981efc0a450ec1a72f3904d5800ac8ee08c5085f-1024x1536.png" width="200" height="300" alt="Jhon Keneth Ryan Namias">
    </td>
    <td valign="middle">
      <h1>Jhon Keneth Ryan Namias</h1>
      <p><b>项目经理 @ MASH</b> · <b>全栈工程师 & AI自动化专家</b><br/>马尼拉，菲律宾</p>
      <p>
        <a href="https://cal.com/pp-namias"><img src="https://img.shields.io/badge/Book%20a%20Call-Cal.com-111827?style=for-the-badge&logo=calendar&logoColor=white" alt="Book a Call"></a>
        <a href="mailto:pp.namias@gmail.com"><img src="https://img.shields.io/badge/Email-pp.namias%40gmail.com-2563eb?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"></a>
        <a href="https://namias.tech"><img src="https://img.shields.io/badge/Live%20Portfolio-namias.tech-16a34a?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Portfolio"></a>
        <br/>
        <a href="https://github.com/PP-Namias"><img src="https://img.shields.io/badge/GitHub-PP--Namias-181717?style=flat-square&logo=github" alt="GitHub"></a>
        <a href="https://www.linkedin.com/in/pp-namias/"><img src="https://img.shields.io/badge/LinkedIn-pp--namias-0A66C2?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
        <img src="https://img.shields.io/badge/License-MIT-f59e0b?style=flat-square" alt="MIT License">
      </p>
    </td>
  </tr>
</table>

<p align="center">
  <a href="../README.md">English</a> ·
  <a href="./README_ja.md">日本語</a> ·
  <a href="./README_zh.md">中文</a> ·
  <a href="./README_ko.md">한국어</a> ·
  <a href="./README_es.md">Español</a> ·
  <a href="./README_fr.md">Français</a> ·
  <a href="./README_de.md">Deutsch</a> ·
  <a href="./README_pt.md">Português</a> ·
  <a href="./README_ru.md">Русский</a>
</p>

---

## 关于

[namias.tech](https://namias.tech) 的生产级作品集 — 模态优先、Sanity驱动的Next.js应用，配备现代动画系统、安全媒体网关、AI聊天和自动化CI/CD质量门禁。

### 亮点

- **模态优先UX** — 简历、经验、预约和项目详情模态框，流畅的过渡动画
- **Sanity驱动内容** — 所有运行时数据通过Sanity CMS提供，支持GROQ查询和多层缓存
- **安全媒体网关** — `/api/media/[...path]` 代理Sanity资源，支持HMAC签名
- **AI聊天** — Gemini驱动的助手 `/api/chat`，常见查询的预设响应
- **性能** — 多层缓存（L1内存、L2 Upstash Redis、L3 CDN）、ISR、SWR、图片优化
- **深色/浅色主题** — `next-themes` 配合强调色系统
- **自动化CI/CD** — 19个GitHub工作流用于验证、安全扫描和部署

---

## 核心技术栈

| 层级 | 技术 |
|---|---|
| **框架** | Next.js 16 (App Router) |
| **语言** | TypeScript (严格模式) |
| **样式** | Tailwind CSS + Framer Motion + Lucide React |
| **主题** | `next-themes` + 强调色选择器 |
| **CMS** | Sanity v3 (Studio + Content Lake + CDN) |
| **内容渲染** | `react-markdown` + `remark-gfm` + `rehype-highlight` |
| **数据获取** | SWR (客户端) + 多层缓存 |
| **媒体交付** | `/api/media/[...path]` 安全网关 |
| **AI** | Gemini 2.0 Flash (`/api/chat`) |
| **测试** | Vitest + Testing Library + jsdom (410个测试) |
| **托管** | Cloudflare Workers via OpenNext |

---

## Sanity CMS

作品集由 [Sanity v3](https://www.sanity.io/) 全面支持 — 编辑界面在 **[namias-cms.sanity.studio](https://namias-cms.sanity.studio)** 发布。

| 功能 | 详情 |
|---|---|
| **Schema类型** | 21种文档类型 (profile, hero, about, experience, project, certification, blog, gallery等) |
| **插件** | `structureTool`, `presentationTool`, `visionTool`, `assist`, 自定义技能工具 |
| **文档操作** | 视角切换、发布刷新、站点查看、演示查看 |
| **Sanity Functions** | `scheduled-publish` (5分钟cron)、`broken-refs` (6小时cron)、`auto-tag-images` |
| **可视化编辑** | `next-sanity` Live Content API + `<SanityField>` 组件 |

---

## 快速开始

```bash
git clone https://github.com/PP-Namias/Portfolio.git
cd Portfolio
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

---

## 质量检查

```bash
npm run lint      # ESLint — 0个错误
npm run test      # Vitest — 410个测试，全部通过
npm run doctor    # react-doctor — 100/100分
```

---

## 设计致谢

本项目的设计灵感来自 [bryllim.com](https://bryllim.com/)。本仓库的所有实现代码均为原创。

## 许可证

MIT 许可证。详见 [LICENSE](../LICENSE)。

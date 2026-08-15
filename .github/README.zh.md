<table>
  <tr>
    <td width="240" align="center" valign="middle">
      <img src="https://cdn.sanity.io/images/nl0qw78w/production/981efc0a450ec1a72f3904d5800ac8ee08c5085f-1024x1536.png" width="200" height="300" alt="Jhon Keneth Ryan B. Namias">
    </td>
    <td valign="middle">
      <h1>Jhon Keneth Ryan B. Namias</h1>
      <p><b>AI 与机器学习工程师</b> · <b>全栈工程师</b> · <b>自动化专家</b><br/>菲律宾马尼拉</p>
      <p>
        <a href="https://namias.tech"><img src="https://img.shields.io/badge/Live%20Portfolio-namias.tech-16a34a?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Portfolio"></a>
        <a href="https://cal.com/pp-namias"><img src="https://img.shields.io/badge/Book%20a%20Call-Cal.com-111827?style=for-the-badge&logo=calendar&logoColor=white" alt="Book a Call"></a>
        <a href="mailto:pp.namias@gmail.com"><img src="https://img.shields.io/badge/Email-pp.namias%40gmail.com-2563eb?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"></a>
        <br/>
        <a href="https://github.com/PP-Namias"><img src="https://img.shields.io/badge/GitHub-PP--Namias-181717?style=flat-square&logo=github" alt="GitHub"></a>
        <a href="https://www.linkedin.com/in/pp-namias/"><img src="https://img.shields.io/badge/LinkedIn-pp--namias-0A66C2?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
        <img src="https://img.shields.io/badge/License-MIT-f59e0b?style=flat-square" alt="MIT License">
        <img src="https://img.shields.io/badge/react--doctor-100%2F100-22c55e?style=flat-square" alt="react-doctor 100/100">
        <img src="https://img.shields.io/badge/Security%20Posture-98%2F100-22c55e?style=flat-square" alt="Security Posture 98/100">
      </p>
    </td>
  </tr>
</table>

<p align="center">
  <a href="../README.md">English</a> ·
  <a href="./README.ko.md">한국어</a> ·
  <a href="./README.es.md">Español</a> ·
  <a href="./README.fr.md">Français</a> ·
  <a href="./README.ja.md">日本語</a>
</p>

---

## 关于

[namias.tech](https://namias.tech) 的生产级作品集 —— 一款以模态框为先、由 Sanity 驱动的 Next.js 应用，配备现代动画系统、安全媒体网关、AI 助手以及自动化 CI/CD 质量门禁。

## 作者

**Jhon Keneth Ryan B. Namias** 是驻菲律宾马尼拉的 AI 与机器学习工程师、全栈工程师和自动化专家。他在机器学习、云架构与自动化工作流的交汇处设计智能的生产级 Web 应用 —— 从对话式 AI 与内容管道，到容器化的多服务部署。

---

## 架构与技术栈

### Monorepo 结构

```
Portfolio/
├── portfolio-v1/    当前生产作品集 (Next.js 16、Sanity CMS、Tailwind)
├── portfolio-v2/    下一代重新设计 (进行中)
├── ai-service/      Hono + LangGraph AI 助手服务
├── studio/          Sanity Studio CMS (21 种 schema 类型)
├── scripts/         Sanity 导入与迁移脚本
├── functions/       Sanity Functions
├── docs/            文档 (安全、性能、PRD、MCP)
├── .agents/         代理技能与子代理
├── .github/         CI/CD 工作流与治理
└── .k8s/            Kubernetes 清单
```

| 项目 | 状态 | 技术栈 |
|---------|--------|-------|
| **portfolio-v1** | 已在 [namias.tech](https://namias.tech) 上线 | Next.js 16、React 18、Tailwind、Sanity、Cloudflare/Vercel |
| **portfolio-v2** | 骨架阶段 | Next.js 16、React 19、Tailwind v4、Sanity CMS |
| **ai-service** | 已上线 | Hono + LangGraph (TypeScript) |

### 核心技术栈

| 层次 | 技术 |
|---|---|
| **框架** | Next.js 16 (App Router) |
| **语言** | TypeScript (严格模式) |
| **样式** | Tailwind CSS + Framer Motion + Lucide React |
| **主题** | `next-themes` + 强调色选择器 |
| **CMS** | Sanity v3 (Studio + Content Lake + CDN) |
| **内容渲染** | `react-markdown` + `remark-gfm` + `rehype-highlight` |
| **数据获取** | SWR (客户端) + 多层缓存 (L1 内存 → L2 Upstash Redis → L3 CDN) |
| **媒体交付** | `/api/media/[...path]` 安全网关，HMAC 验证 |
| **AI** | Hono + LangGraph 助手，支持多提供商故障转移 |
| **测试** | Vitest + Testing Library + jsdom (122 个文件、1,107 个测试) |
| **托管** | Vercel (主) + 通过 OpenNext 部署的 Cloudflare Workers (备用) |

### 项目亮点

- **模态框优先 UX** —— 简历、经历、预约与项目详情模态框，过渡流畅
- **Sanity 驱动内容** —— 所有运行时数据通过 GROQ 查询与多层缓存从 Sanity CMS 提供
- **安全媒体网关** —— `/api/media/[...path]` 以 HMAC 签名代理 Sanity 资源
- **AI 聊天** —— 支持持久线程历史的 LangGraph 助手
- **性能** —— 多层缓存 (L1 内存、L2 Upstash Redis、L3 CDN)、ISR、SWR、图像优化
- **深色/浅色主题** —— `next-themes` + 强调色系统
- **自动化 CI/CD** —— 20 个 GitHub 工作流，覆盖验证、安全扫描与部署

---

## 快速开始

### 本地开发

```bash
git clone https://github.com/PP-Namias/Portfolio.git
cd Portfolio
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

### Docker（推荐）

```bash
# 1. 环境变量（模板 -> 实际值）
cp .env.docker.example .env.docker   # 填写令牌与密钥

# 2a. 开发（热重载，卷挂载）
docker compose up --build

# 2b. 生产（多阶段构建 + :8080 上的 nginx 代理）
docker compose -f docker-compose.prod.yml up --build
```

### 本地路由（Docker）

| URL | 容器服务 | 技术栈 | 内部端口 |
| --- | ----------------- | ----- | -------------- |
| `http://localhost:8080/` | `nginx` (反向代理) | Nginx 1.27 | 80 |
| `http://localhost:8080/api/ai/*` | `ai-service` (经代理) | Hono + LangGraph | 8787 |
| `http://localhost:3000` | `portfolio-v1` (Next.js standalone) | Next.js 16 | 3000 |
| `http://localhost:8787` | `ai-service` | Hono + LangGraph + tsx | 8787 |
| `http://localhost:3333` | `studio` (Sanity CMS) | Sanity + Vite | 3333 |

热重载挂载：`./portfolio-v1:/app`、`./ai-service:/app`、`./studio:/app`（匿名 `node_modules` 卷）。AI 线程历史持久化于 `ai-data` 命名卷。Portfolio v2 被排除在 Docker、Compose、K8s 与 CI/CD 之外 —— 它尚在开发中。

### Windows 前置要求

Docker Desktop 的 Linux 引擎运行于 WSL2，需要 **Virtual Machine Platform** Windows 功能。在 Windows 10/11 上启用一次（管理员 PowerShell）并重启：

```powershell
dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

---

## 部署

### Kubernetes

```bash
# 1. 密钥（切勿提交已填充的值）
cp .k8s/secrets-template.yaml .k8s/secrets.yaml
#    填写 base64 值，然后：
kubectl apply -f .k8s/secrets.yaml

# 2. 应用整个栈
kubectl apply -f .k8s/namespace.yaml
kubectl apply -f .k8s/configmap.yaml
kubectl apply -f .k8s/deployments.yaml
kubectl apply -f .k8s/services.yaml
kubectl apply -f .k8s/ingress.yaml   # 需要 nginx Ingress 控制器 + `namias-tech-tls` TLS 密钥
```

Ingress 路由：`/` → `portfolio-v1:3000`（Prefix），`/api/ai/*` → `ai-service:8787`，带 `rewrite-target: /api/$2`（正则捕获，`ImplementationSpecific`）。Studio 保持内部（ClusterIP），因为其 SPA 资源为根绝对路径。

### 双部署模型

`deploy-frontends.yml` 在每次推送到 `main` 时**并行**运行 Vercel 与 Cloudflare 任务。两个任务均部署 `portfolio-v1`；Vercel 使用预构建输出（`vercel build --prod --prebuilt`），Cloudflare 针对现有 `wrangler.jsonc` 配置执行 `wrangler deploy`。任一提供商都可作为主 DNS（当前 `namias.tech` → Vercel），另一个则作为热备。

### CI/CD（GitHub Actions）

| 工作流 | 触发器 | 作用 |
| -------- | ------- | ------------ |
| `ci.yml` | PR → `main` | 矩阵质量门禁：为 `portfolio-v1`、`ai-service`、`studio` 执行 lint + 类型检查 + 测试 |
| `deploy-frontends.yml` | push → `main` | 并行双部署：**Vercel**（CLI，预构建）+ **Cloudflare Pages/Workers**（wrangler） |
| `docker-publish.yml` | push → `main`（ai/studio 路径） | Buildx 以 gha 层缓存构建 `ghcr.io/pp-namias/{ai-service,studio}`，标记 `sha-*` + `latest` |

### 所需仓库密钥

| 密钥 | 使用者 | 用途 |
| ------ | ------- | ------- |
| `VERCEL_TOKEN` | deploy-frontends | Vercel 认证 |
| `VERCEL_ORG_ID` | deploy-frontends | Vercel 组织范围 |
| `VERCEL_PROJECT_ID` | deploy-frontends | Vercel 项目范围 |
| `CLOUDFLARE_API_TOKEN` | deploy-frontends | Wrangler 认证（Workers/Pages） |
| `CLOUDFLARE_ACCOUNT_ID` | deploy-frontends | Cloudflare 账户范围 |
| `GHCR_PAT`（可选） | docker-publish | 默认为 `GITHUB_TOKEN`；仅跨仓库推送时需要 |

---

## Sanity CMS

该作品集完全由 [Sanity v3](https://www.sanity.io/) 支撑 —— 编辑界面位于 **[namias-cms.sanity.studio](https://namias-cms.sanity.studio)**。

| 功能 | 详情 |
|---|---|
| **Studio** | 基于 React 19 的 Sanity v3，自定义结构、演示工具、视觉工具 |
| **Schema 类型** | 21 种文档类型（个人资料、Hero、关于、经历、项目、认证、博客、画廊、站点设置等） |
| **插件** | `structureTool`、`presentationTool`、`visionTool`、`assist`、自定义技能工具、已保存查询 |
| **文档操作** | 视角切换、发布并刷新（重新验证 Webhook）、在站点查看、在演示中打开 |
| **文档徽章** | 草稿/已发布、已计划、过期（30 天以上）、即将到期、精选 |
| **验证** | 集中式规则：SEO 友好的标题长度、仅 HTTPS URL、跨字段日期顺序、唯一 slug、必需 alt 文本 |
| **Sanity Functions** | `scheduled-publish`（5 分钟定时）、`broken-refs`（6 小时定时）、`auto-tag-images`（资源创建时） |
| **可视化编辑** | `next-sanity` Live Content API + 带 `data-sanity` 属性的 `<SanityField>` 组件，用于覆盖层定位 |
| **实时预览** | 通过 `/api/draft-mode` 的草稿模式演示工具 |

Studio 包位于 [`studio/`](../studio/)，包含自己的 `package.json`、21 个 schema 文件、5 个自定义操作、42 个技能 markdown 文件与种子数据脚本。

---

## 质量门禁

```bash
npm run lint          # ESLint —— 预期 0 错误
npx tsc --noEmit      # TypeScript 严格类型检查
npm run test -- --run # Vitest —— 122 个文件、1,107 个测试，全部通过
npm run doctor:check  # react-doctor —— 100/100 分
```

四项门禁均在 CI（`ci.yml`）中运行，并在本地由 pre-push 钩子强制执行。

## 自动化问题检测

当被监控的工作流失败时，自动化会在相关 PR 上发布包含建议解决方案的问题报告（若无关联 PR，则以仓库 Issue 形式发布）。

- 检测工作流：`problem-detection-advisor.yml`
- 审批门禁：`remediation-approval-gate.yml`

要批准补救措施重新运行，请在 PR 上评论：

```text
/approve-remediation
```

只有仓库所有者、成员或协作者可以批准补救措施的重新运行。

---

## 设计致谢

本项目从 [bryllim.com](https://bryllim.com/) 汲取设计灵感。本仓库中的所有实现代码均为原创。

## 许可证

依据 MIT 许可证授权。参见 [LICENSE](../LICENSE)。

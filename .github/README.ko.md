<table>
  <tr>
    <td width="240" align="center" valign="middle">
      <img src="https://cdn.sanity.io/images/nl0qw78w/production/981efc0a450ec1a72f3904d5800ac8ee08c5085f-1024x1536.png" width="200" height="300" alt="Jhon Keneth Ryan B. Namias">
    </td>
    <td valign="middle">
      <h1>Jhon Keneth Ryan B. Namias</h1>
      <p><b>AI·머신러닝 엔지니어</b> · <b>풀스택 엔지니어</b> · <b>자동화 전문가</b><br/>필리핀 마닐라</p>
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
  <a href="./README.es.md">Español</a> ·
  <a href="./README.fr.md">Français</a> ·
  <a href="./README.ja.md">日本語</a> ·
  <a href="./README.zh.md">中文</a>
</p>

---

## 소개

[nasias.tech](https://namias.tech)의 프로덕션 포트폴리오 — 모달 우선(modal-first) 방식의 Sanity 기반 Next.js 애플리케이션으로, 현대적인 애니메이션 시스템, 보안 미디어 게이트웨이, AI 어시스턴트, 자동화된 CI/CD 품질 게이트를 갖추고 있습니다.

## 저자

**Jhon Keneth Ryan B. Namias**는 필리핀 마닐라에 기반을 둔 AI·머신러닝 엔지니어, 풀스택 엔지니어, 자동화 전문가입니다. 그는 대화형 AI와 콘텐츠 파이프라인에서부터 컨테이너화된 다중 서비스 배포에 이르기까지, 머신러닝과 클라우드 아키텍처, 자동화 워크플로우가 교차하는 지점에서 지능적이고 프로덕션 등급의 웹 애플리케이션을 설계합니다.

---

## 아키텍처 및 기술 스택

### 모노레포 구조

```
Portfolio/
├── portfolio-v1/    현재 운영 중인 포트폴리오 (Next.js 16, Sanity CMS, Tailwind)
├── portfolio-v2/    차세대 리디자인 (진행 중)
├── ai-service/      Hono + LangGraph AI 어시스턴트 서비스
├── studio/          Sanity Studio CMS (21개 스키마 유형)
├── scripts/         Sanity 가져오기 및 마이그레이션 스크립트
├── functions/       Sanity Functions
├── docs/            문서 (보안, 성능, PRD, MCP)
├── .agents/         에이전트 스킬 및 서브에이전트
├── .github/         CI/CD 워크플로우 및 거버넌스
└── .k8s/            Kubernetes 매니페스트
```

| 프로젝트 | 상태 | 스택 |
|---------|--------|-------|
| **portfolio-v1** | [namias.tech](https://namias.tech)에서 운영 중 | Next.js 16, React 18, Tailwind, Sanity, Cloudflare/Vercel |
| **portfolio-v2** | 골격 단계 | Next.js 16, React 19, Tailwind v4, Sanity CMS |
| **ai-service** | 운영 중 | Hono + LangGraph (TypeScript) |

### 핵심 스택

| 계층 | 기술 |
|---|---|
| **프레임워크** | Next.js 16 (App Router) |
| **언어** | TypeScript (strict 모드) |
| **스타일링** | Tailwind CSS + Framer Motion + Lucide React |
| **테마** | `next-themes` + 액센트 컬러 선택기 |
| **CMS** | Sanity v3 (Studio + Content Lake + CDN) |
| **콘텐츠 렌더링** | `react-markdown` + `remark-gfm` + `rehype-highlight` |
| **데이터 페칭** | SWR (클라이언트) + 다층 캐시 (L1 인메모리 → L2 Upstash Redis → L3 CDN) |
| **미디어 전달** | `/api/media/[...path]`의 보안 게이트웨이 + HMAC 검증 |
| **AI** | 다중 제공자 장애 조치가 적용된 Hono + LangGraph 어시스턴트 |
| **테스트** | Vitest + Testing Library + jsdom (122개 파일, 1,107개 테스트) |
| **호스팅** | Vercel (기본) + OpenNext 기반 Cloudflare Workers (대기) |

### 주요 특징

- **모달 우선 UX** — 이력서, 경력, 예약, 프로젝트 상세 모달의 부드러운 전환
- **Sanity 기반 콘텐츠** — 모든 런타임 데이터는 GROQ 쿼리와 다층 캐싱을 통해 Sanity CMS에서 제공
- **보안 미디어 게이트웨이** — `/api/media/[...path]`가 HMAC 서명으로 Sanity 자산을 프록시
- **AI 채팅** — 영구 스레드 기록을 지원하는 LangGraph 어시스턴트
- **성능** — 다층 캐싱 (L1 인메모리, L2 Upstash Redis, L3 CDN), ISR, SWR, 이미지 최적화
- **다크/라이트 테마** — `next-themes` + 액센트 컬러 시스템
- **자동화된 CI/CD** — 검증, 보안 스캐닝, 배포를 위한 20개의 GitHub 워크플로우

---

## 시작하기

### 로컬 개발

```bash
git clone https://github.com/PP-Namias/Portfolio.git
cd Portfolio
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)을 엽니다.

### Docker (권장)

```bash
# 1. 환경 변수 (템플릿 → 실제 값)
cp .env.docker.example .env.docker   # 토큰과 키 입력

# 2a. 개발 (핫 리로드, 볼륨 마운트)
docker compose up --build

# 2b. 프로덕션 (멀티 스테이지 빌드 + :8080의 nginx 프록시)
docker compose -f docker-compose.prod.yml up --build
```

### 로컬 라우팅 (Docker)

| URL | 컨테이너 서비스 | 스택 | 내부 포트 |
| --- | ----------------- | ----- | -------------- |
| `http://localhost:8080/` | `nginx` (리버스 프록시) | Nginx 1.27 | 80 |
| `http://localhost:8080/api/ai/*` | `ai-service` (프록시 경유) | Hono + LangGraph | 8787 |
| `http://localhost:3000` | `portfolio-v1` (Next.js standalone) | Next.js 16 | 3000 |
| `http://localhost:8787` | `ai-service` | Hono + LangGraph + tsx | 8787 |
| `http://localhost:3333` | `studio` (Sanity CMS) | Sanity + Vite | 3333 |

핫 리로드 마운트: `./portfolio-v1:/app`, `./ai-service:/app`, `./studio:/app` (익명 `node_modules` 볼륨). AI 스레드 기록은 `ai-data` 명명 볼륨에 유지됩니다. Portfolio v2는 Docker, Compose, K8s, CI/CD에서 제외됩니다 — 진행 중인 작업이기 때문입니다.

### Windows 사전 요구 사항

Docker Desktop의 Linux 엔진은 WSL2에서 실행되며, 이를 위해서는 **Virtual Machine Platform** Windows 기능이 필요합니다. Windows 10/11에서는 관리자 PowerShell로 한 번 활성화한 후 재부팅합니다:

```powershell
dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

---

## 배포

### Kubernetes

```bash
# 1. 시크릿 (채워진 값은 절대 커밋하지 않음)
cp .k8s/secrets-template.yaml .k8s/secrets.yaml
#    base64 값을 채운 후:
kubectl apply -f .k8s/secrets.yaml

# 2. 스택 적용
kubectl apply -f .k8s/namespace.yaml
kubectl apply -f .k8s/configmap.yaml
kubectl apply -f .k8s/deployments.yaml
kubectl apply -f .k8s/services.yaml
kubectl apply -f .k8s/ingress.yaml   # nginx Ingress 컨트롤러 + `namias-tech-tls` TLS 시크릿 필요
```

Ingress 라우팅: `/` → `portfolio-v1:3000` (Prefix), `/api/ai/*` → `rewrite-target: /api/$2`와 함께 `ai-service:8787` (정규식 캡처, `ImplementationSpecific`). Studio는 SPA 자산이 루트 절대 경로이므로 내부(ClusterIP)로 유지됩니다.

### 이중 배포 모델

`deploy-frontends.yml`은 `main` 브랜치에 대한 모든 푸시에서 Vercel과 Cloudflare 작업을 **병렬로** 실행합니다. 두 작업 모두 `portfolio-v1`을 배포합니다. Vercel은 사전 빌드된 출력물(`vercel build --prod --prebuilt`)을 사용하고, Cloudflare는 기존 `wrangler.jsonc` 구성에 대해 `wrangler deploy`를 사용합니다. 두 제공자 중 하나가 기본 DNS 역할을 할 수 있으며(현재 `namias.tech` → Vercel), 다른 하나는 웜 스탠바이로 유지됩니다.

### CI/CD (GitHub Actions)

| 워크플로우 | 트리거 | 역할 |
| -------- | ------- | ------------ |
| `ci.yml` | `main` → PR | 매트릭스 품질 게이트: `portfolio-v1`, `ai-service`, `studio`에 대한 lint + 타입체크 + 테스트 |
| `deploy-frontends.yml` | `main` → push | 병렬 이중 배포: **Vercel** (CLI, 사전 빌드) + **Cloudflare Pages/Workers** (wrangler) |
| `docker-publish.yml` | `main` → push (ai/studio 경로) | Buildx가 gha 레이어 캐시로 `ghcr.io/pp-namias/{ai-service,studio}` 빌드, `sha-*` + `latest` 태그 |

### 필요한 리포지토리 시크릿

| 시크릿 | 사용처 | 용도 |
| ------ | ------- | ------- |
| `VERCEL_TOKEN` | deploy-frontends | Vercel 인증 |
| `VERCEL_ORG_ID` | deploy-frontends | Vercel 조직 범위 |
| `VERCEL_PROJECT_ID` | deploy-frontends | Vercel 프로젝트 범위 |
| `CLOUDFLARE_API_TOKEN` | deploy-frontends | Wrangler 인증 (Workers/Pages) |
| `CLOUDFLARE_ACCOUNT_ID` | deploy-frontends | Cloudflare 계정 범위 |
| `GHCR_PAT` (선택) | docker-publish | `GITHUB_TOKEN`을 기본값으로 사용, 크로스 리포 푸시에만 필요 |

---

## Sanity CMS

포트폴리오는 [Sanity v3](https://www.sanity.io/)로 완전히 지원되며, 편집 환경은 **[namias-cms.sanity.studio](https://namias-cms.sanity.studio)** 에 있습니다.

| 기능 | 세부 사항 |
|---|---|
| **Studio** | React 19 기반 Sanity v3, 커스텀 구조, 프레젠테이션 도구, 비전 도구 |
| **스키마 유형** | 21개 문서 유형 (프로필, 히어로, 소개, 경력, 프로젝트, 자격증, 블로그, 갤러리, 사이트 설정 등) |
| **플러그인** | `structureTool`, `presentationTool`, `visionTool`, `assist`, 커스텀 스킬 도구, 저장된 쿼리 |
| **문서 작업** | 퍼스펙티브 전환, 게시 후 새로고침 (재검증 웹훅), 사이트에서 보기, 프레젠테이션에서 열기 |
| **문서 배지** | 초안/게시됨, 예약됨, 오래됨 (30일 이상), 곧 만료, 추천 |
| **검증** | 중앙 집중식 규칙: SEO 친화적 헤드라인 길이, HTTPS 전용 URL, 필드 간 날짜 순서, 고유 슬러그, 대체 텍스트 필수 |
| **Sanity Functions** | `scheduled-publish` (5분 크론), `broken-refs` (6시간 크론), `auto-tag-images` (자산 생성 시) |
| **비주얼 편집** | `next-sanity` Live Content API + 오버레이 타게팅을 위한 `data-sanity` 속성의 `<SanityField>` 컴포넌트 |
| **실시간 미리보기** | `/api/draft-mode`를 통한 초안 모드의 프레젠테이션 도구 |

Studio 패키지는 [`studio/`](../studio/)에 있으며, 자체 `package.json`, 21개 스키마 파일, 5개의 커스텀 액션, 42개의 스킬 마크다운 파일, 시드 데이터 스크립트를 포함합니다.

---

## 품질 게이트

```bash
npm run lint          # ESLint — 오류 0개 기대
npx tsc --noEmit      # TypeScript strict 타입체크
npm run test -- --run # Vitest — 122개 파일, 1,107개 테스트, 모두 통과
npm run doctor:check  # react-doctor — 100/100 점수
```

네 가지 게이트는 모두 CI(`ci.yml`)에서 실행되며 로컬에서는 pre-push 훅으로 강제됩니다.

## 자동 문제 감지

모니터링되는 워크플로우가 실패하면 자동화가 관련 PR에 권장 해결책을 포함한 문제 보고서를 게시합니다(연결된 PR이 없는 경우 리포지토리 이슈로 게시).

- 감지 워크플로우: `problem-detection-advisor.yml`
- 승인 게이트: `remediation-approval-gate.yml`

리메디에이션 재실행을 승인하려면 PR에 댓글을 답니다:

```text
/approve-remediation
```

리포지토리 소유자, 구성원, 협력자만 리메디에이션 재실행을 승인할 수 있습니다.

---

## 디자인 인정

이 프로젝트는 [bryllim.com](https://bryllim.com/)에서 디자인 영감을 얻었습니다. 이 리포지토리의 모든 구현 코드는 독창적입니다.

## 라이선스

MIT 라이선스에 따라 라이선스가 부여됩니다. [LICENSE](../LICENSE)를 참조하십시오.

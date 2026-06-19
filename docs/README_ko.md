<table>
  <tr>
    <td width="240" align="center" valign="middle">
      <img src="https://cdn.sanity.io/images/nl0qw78w/production/981efc0a450ec1a72f3904d5800ac8ee08c5085f-1024x1536.png" width="200" height="300" alt="Jhon Keneth Ryan Namias">
    </td>
    <td valign="middle">
      <h1>Jhon Keneth Ryan Namias</h1>
      <p><b>프로젝트 매니저 @ MASH</b> · <b>풀스택 엔지니어 & AI 자동화 전문가</b><br/>마닐라, 필리핀</p>
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

## 소개

[namias.tech](https://namias.tech) 프로덕션 포트폴리오 — 모달 퍼스트, Sanity 기반 Next.js 애플리케이션. 모던 애니메이션 시스템, 보안 미디어 게이트웨이, AI 채팅, 자동화 CI/CD 품질 게이트를 갖추고 있습니다.

### 하이라이트

- **모달 퍼스트 UX** — 이력서, 경험, 예약, 프로젝트 상세 모달과 부드러운 전환 효과
- **Sanity 기반 콘텐츠** — 모든 런타임 데이터를 Sanity CMS의 GROQ 쿼리와 다중 레이어 캐싱으로 제공
- **보안 미디어 게이트웨이** — `/api/media/[...path]`에서 HMAC 서명으로 Sanity 리소스 프록시
- **AI 채팅** — Gemini 기반 어시스턴트 `/api/chat`, 일반적인 질문에 대한 프리셋 응답
- **성능** — L1 인메모리, L2 Upstash Redis, L3 CDN 다중 레이어 캐시, ISR, SWR, 이미지 최적화
- **다크/라이트 테마** — `next-themes`와 액센트 컬러 시스템
- **자동화 CI/CD** — 19개 GitHub 워크플로우로 검증, 보안 스캔, 배포 자동화

---

## 핵심 기술 스택

| 레이어 | 기술 |
|---|---|
| **프레임워크** | Next.js 16 (App Router) |
| **언어** | TypeScript (strict 모드) |
| **스타일링** | Tailwind CSS + Framer Motion + Lucide React |
| **테마** | `next-themes` + 액센트 컬러 피커 |
| **CMS** | Sanity v3 (Studio + Content Lake + CDN) |
| **콘텐츠 렌더링** | `react-markdown` + `remark-gfm` + `rehype-highlight` |
| **데이터 페칭** | SWR (클라이언트) + 다중 레이어 캐시 |
| **미디어 전달** | `/api/media/[...path]` 보안 게이트웨이 |
| **AI** | Gemini 2.0 Flash (`/api/chat`) |
| **테스트** | Vitest + Testing Library + jsdom (410개 테스트) |
| **호스팅** | Cloudflare Workers via OpenNext |

---

## Sanity CMS

포트폴리오는 [Sanity v3](https://www.sanity.io/)로 완전 지원 — 에디토리얼 인터페이스는 **[namias-cms.sanity.studio](https://namias-cms.sanity.studio)** 에서 제공됩니다.

| 기능 | 상세 |
|---|---|
| **스키마 타입** | 21개 문서 타입 (profile, hero, about, experience, project, certification, blog, gallery 등) |
| **플러그인** | `structureTool`, `presentationTool`, `visionTool`, `assist`, 커스텀 스킬 도구 |
| **문서 액션** | 관점 전환, 게시 및 갱신, 사이트 보기, 프레젠테이션 보기 |
| **Sanity Functions** | `scheduled-publish` (5분 cron), `broken-refs` (6시간 cron), `auto-tag-images` |
| **비주얼 편집** | `next-sanity` Live Content API + `<SanityField>` 컴포넌트 |

---

## 시작하기

```bash
git clone https://github.com/PP-Namias/Portfolio.git
cd Portfolio
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 을 열어주세요.

---

## 품질 검사

```bash
npm run lint      # ESLint — 0개 오류
npm run test      # Vitest — 410개 테스트, 모두 통과
npm run doctor    # react-doctor — 100/100 점수
```

---

## 디자인 감사

이 프로젝트는 [bryllim.com](https://bryllim.com/) 에서 디자인 영감을 얻었습니다. 이 리포지토리의 모든 구현 코드는 오리지널입니다.

## 라이선스

MIT 라이선스. 자세한 내용은 [LICENSE](../LICENSE) 를 참조하세요.

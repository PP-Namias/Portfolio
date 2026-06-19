<table>
  <tr>
    <td width="240" align="center" valign="middle">
      <img src="https://cdn.sanity.io/images/nl0qw78w/production/981efc0a450ec1a72f3904d5800ac8ee08c5085f-1024x1536.png" width="200" height="300" alt="Jhon Keneth Ryan Namias">
    </td>
    <td valign="middle">
      <h1>Jhon Keneth Ryan Namias</h1>
      <p><b>Projektmanager @ MASH</b> · <b>Full-Stack-Ingenieur & KI-Automatisierungsspezialist</b><br/>Manila, Philippinen</p>
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

## Über

Produktions-Portfolio für [namias.tech](https://namias.tech) — eine modal-first, Sanity-gestützte Next.js-Anwendung mit modernem Animationssystem, sicherem Media-Gateway, KI-Chat und automatisierten CI/CD-Qualitätstoren.

### Highlights

- **Modal-first UX** — Lebenslauf-, Erfahrungs-, Buchungs- und Projektdetail-Modalen mit fließenden Übergängen
- **Sanity-gesteuerter Inhalt** — Alle Laufzeitdaten über Sanity CMS mit GROQ-Abfragen und mehrschichtigem Caching
- **Sicheres Media-Gateway** — `/api/media/[...path]` proxyt Sanity-Ressourcen mit optionalem HMAC-Signing
- **KI-Chat** — Gemini-gestützter Assistent unter `/api/chat` mit Preset-Antworten
- **Performance** — Mehrschicht-Cache (L1 Speicher, L2 Upstash Redis, L3 CDN), ISR, SWR, Bildoptimierung
- **Dunkles/Helles Theme** — `next-themes` mit Akzentfarbsystem
- **Automatisiertes CI/CD** — 19 GitHub-Workflows für Validierung, Sicherheitsscans und Deployment

---

## Core-Stack

| Schicht | Technologie |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Sprache** | TypeScript (Strict-Modus) |
| **Styling** | Tailwind CSS + Framer Motion + Lucide React |
| **Theme** | `next-themes` mit Akzentfarbwähler |
| **CMS** | Sanity v3 (Studio + Content Lake + CDN) |
| **Content-Rendering** | `react-markdown` + `remark-gfm` + `rehype-highlight` |
| **Datenabruf** | SWR (Client) + mehrschichtiges Caching |
| **Media-Bereitstellung** | Sicheres Gateway unter `/api/media/[...path]` |
| **KI** | Gemini 2.0 Flash (`/api/chat`) |
| **Testing** | Vitest + Testing Library + jsdom (410 Tests) |
| **Hosting** | Cloudflare Workers via OpenNext |

---

## Sanity CMS

Das Portfolio wird vollständig von [Sanity v3](https://www.sanity.io/) unterstützt — die redaktionelle Oberfläche unter **[namias-cms.sanity.studio](https://namias-cms.sanity.studio)**.

| Feature | Details |
|---|---|
| **Schema-Typen** | 21 Dokumenttypen (profile, hero, about, experience, project, certification, blog, gallery, etc.) |
| **Plugins** | `structureTool`, `presentationTool`, `visionTool`, `assist` |
| **Dokument-Aktionen** | Perspektivwechsler, Veröffentlichen und Aktualisieren, Auf Site ansehen, In Präsentation öffnen |
| **Sanity Functions** | `scheduled-publish` (5-Min-Cron), `broken-refs` (6-Stunden-Cron), `auto-tag-images` |
| **Visuelle Bearbeitung** | `next-sanity` Live Content API + `<SanityField>`-Komponente |

---

## Erste Schritte

```bash
git clone https://github.com/PP-Namias/Portfolio.git
cd Portfolio
npm install
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000).

---

## Qualitätsprüfungen

```bash
npm run lint      # ESLint — 0 Fehler erwartet
npm run test      # Vitest — 410 Tests, alle grün
npm run doctor    # react-doctor — 100/100
```

---

## Design-Anerkennung

Dieses Projekt bezieht seine Design-Inspiration von [bryllim.com](https://bryllim.com/). Der gesamte Implementierungscode in diesem Repository ist original.

## Lizenz

MIT-Lizenz. Siehe [LICENSE](../LICENSE).

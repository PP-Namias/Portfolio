<table>
  <tr>
    <td width="240" align="center" valign="middle">
      <img src="https://cdn.sanity.io/images/nl0qw78w/production/981efc0a450ec1a72f3904d5800ac8ee08c5085f-1024x1536.png" width="200" height="300" alt="Jhon Keneth Ryan Namias">
    </td>
    <td valign="middle">
      <h1>Jhon Keneth Ryan Namias</h1>
      <p><b>Chef de Projet @ MASH</b> · <b>Ingénieur Full Stack & Spécialiste en Automatisation IA</b><br/>Manille, Philippines</p>
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

## À propos

Portfolio de production pour [namias.tech](https://namias.tech) — une application Next.js pilotée par Sanity avec approche modal-first, système d'animation moderne, passerelle multimédia sécurisée, chat IA et portes de qualité CI/CD automatisées.

### Points forts

- **UX modal-first** — Modales CV, Expérience, Réservation et Détail du projet avec transitions fluides
- **Contenu Sanity** — Toutes les données servies via Sanity CMS avec requêtes GROQ et cache multicouche
- **Passerelle multimédia sécurisée** — `/api/media/[...path]` proxy des ressources Sanity avec signature HMAC
- **Chat IA** — Assistant Gemini via `/api/chat` avec réponses prédéfinies pour les requêtes courantes
- **Performance** — Cache multiniveau (L1 mémoire, L2 Upstash Redis, L3 CDN), ISR, SWR, optimisation des images
- **Thème sombre/clair** — `next-themes` avec système de couleurs d'accentuation
- **CI/CD automatisé** — 19 workflows GitHub pour validation, scan de sécurité et déploiement

---

## Stack principal

| Couche | Technologie |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Langage** | TypeScript (mode strict) |
| **Styles** | Tailwind CSS + Framer Motion + Lucide React |
| **Thème** | `next-themes` avec sélecteur de couleur d'accentuation |
| **CMS** | Sanity v3 (Studio + Content Lake + CDN) |
| **Rendu** | `react-markdown` + `remark-gfm` + `rehype-highlight` |
| **Récupération de données** | SWR (client) + cache multicouche |
| **Distribution multimédia** | Passerelle sécurisée `/api/media/[...path]` |
| **IA** | Gemini 2.0 Flash (`/api/chat`) |
| **Tests** | Vitest + Testing Library + jsdom (410 tests) |
| **Hébergement** | Cloudflare Workers via OpenNext |

---

## Sanity CMS

Le portfolio est entièrement soutenu par [Sanity v3](https://www.sanity.io/) — l'interface éditoriale est sur **[namias-cms.sanity.studio](https://namias-cms.sanity.studio)**.

| Fonctionnalité | Détails |
|---|---|
| **Types de schéma** | 21 types de documents (profile, hero, about, experience, project, certification, blog, gallery, etc.) |
| **Plugins** | `structureTool`, `presentationTool`, `visionTool`, `assist` |
| **Actions de document** | Sélecteur de perspective, publier et rafraîchir, voir sur le site, ouvrir en présentation |
| **Sanity Functions** | `scheduled-publish` (cron 5 min), `broken-refs` (cron 6 h), `auto-tag-images` |
| **Édition visuelle** | `next-sanity` Live Content API + composant `<SanityField>` |

---

## Pour commencer

```bash
git clone https://github.com/PP-Namias/Portfolio.git
cd Portfolio
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

---

## Contrôle qualité

```bash
npm run lint      # ESLint — 0 erreurs attendues
npm run test      # Vitest — 410 tests, tous verts
npm run doctor    # react-doctor — 100/100
```

---

## Remerciement design

Ce projet s'inspire du design de [bryllim.com](https://bryllim.com/). Tout le code d'implémentation dans ce dépôt est original.

## Licence

Licence MIT. Voir [LICENSE](../LICENSE).

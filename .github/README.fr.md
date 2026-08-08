<table>
  <tr>
    <td width="240" align="center" valign="middle">
      <img src="https://cdn.sanity.io/images/nl0qw78w/production/981efc0a450ec1a72f3904d5800ac8ee08c5085f-1024x1536.png" width="200" height="300" alt="Jhon Keneth Ryan B. Namias">
    </td>
    <td valign="middle">
      <h1>Jhon Keneth Ryan B. Namias</h1>
      <p><b>Ingénieur IA et apprentissage automatique</b> · <b>Ingénieur Full Stack</b> · <b>Spécialiste en automatisation</b><br/>Manille, Philippines</p>
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
  <a href="./README.ja.md">日本語</a> ·
  <a href="./README.zh.md">中文</a>
</p>

---

## À propos

Le portfolio de production de [namias.tech](https://namias.tech) — une application Next.js pilotée par Sanity et centrée sur les modales, dotée d'un système d'animation moderne, d'une passerelle média sécurisée, d'un assistant IA et de contrôles de qualité CI/CD automatisés.

## Auteur

**Jhon Keneth Ryan B. Namias** est ingénieur IA et apprentissage automatique, ingénieur Full Stack et spécialiste en automatisation, basé à Manille, aux Philippines. Il conçoit des applications web intelligentes de niveau production à l'intersection de l'apprentissage automatique, de l'architecture cloud et des flux de travail automatisés — de l'IA conversationnelle et des pipelines de contenu jusqu'aux déploiements de services multiples conteneurisés.

---

## Architecture et pile technologique

### Structure du monorepo

```
Portfolio/
├── portfolio-v1/    Portfolio actuel en production (Next.js 16, Sanity CMS, Tailwind)
├── portfolio-v2/    Refonte de nouvelle génération (en cours)
├── ai-service/      Service d'assistant IA Hono + LangGraph
├── studio/          CMS Sanity Studio (21 types de schéma)
├── scripts/         Scripts d'importation et de migration Sanity
├── functions/       Sanity Functions
├── docs/            Documentation (sécurité, performance, PRD, MCP)
├── .agents/         Compétences d'agent et sous-agents
├── .github/         Workflows CI/CD et gouvernance
└── .k8s/            Manifests Kubernetes
```

| Projet | Statut | Pile |
|---------|--------|-------|
| **portfolio-v1** | En production sur [namias.tech](https://namias.tech) | Next.js 16, React 18, Tailwind, Sanity, Cloudflare/Vercel |
| **portfolio-v2** | Squelette | Next.js 16, React 19, Tailwind v4, Sanity CMS |
| **ai-service** | En production | Hono + LangGraph (TypeScript) |

### Pile principale

| Couche | Technologie |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Langage** | TypeScript (mode strict) |
| **Style** | Tailwind CSS + Framer Motion + Lucide React |
| **Thème** | `next-themes` avec sélecteur de couleur d'accent |
| **CMS** | Sanity v3 (Studio + Content Lake + CDN) |
| **Rendu du contenu** | `react-markdown` + `remark-gfm` + `rehype-highlight` |
| **Récupération des données** | SWR (client) + cache multicouche (L1 en mémoire → L2 Upstash Redis → L3 CDN) |
| **Livraison des médias** | Passerelle sécurisée sur `/api/media/[...path]` avec vérification HMAC |
| **IA** | Assistant Hono + LangGraph avec basculement multi-fournisseur |
| **Tests** | Vitest + Testing Library + jsdom (122 fichiers, 1 107 tests) |
| **Hébergement** | Vercel (principal) + Cloudflare Workers via OpenNext (secours) |

### Points forts

- **UX axée sur les modales** — Modales de CV, d'expérience, de réservation et de détail de projet avec des transitions fluides
- **Contenu piloté par Sanity** — Toutes les données d'exécution sont servies depuis Sanity CMS avec des requêtes GROQ et un cache multicouche
- **Passerelle média sécurisée** — `/api/media/[...path]` agit comme proxy des actifs Sanity avec signature HMAC
- **Chat IA** — Assistant LangGraph avec historique de fils persistant
- **Performance** — Cache multicouche (L1 en mémoire, L2 Upstash Redis, L3 CDN), ISR, SWR, optimisation des images
- **Thème sombre/clair** — `next-themes` avec système de couleurs d'accent
- **CI/CD automatisé** — 20 workflows GitHub pour la validation, l'analyse de sécurité et le déploiement

---

## Pour commencer

### Développement local

```bash
git clone https://github.com/PP-Namias/Portfolio.git
cd Portfolio
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

### Docker (recommandé)

```bash
# 1. Environnement (modèle -> valeurs réelles)
cp .env.docker.example .env.docker   # renseignez les jetons et clés

# 2a. Développement (rechargement à chaud, monté par volume)
docker compose up --build

# 2b. Production (builds multi-étapes + proxy nginx sur :8080)
docker compose -f docker-compose.prod.yml up --build
```

### Routage local (Docker)

| URL | Service du conteneur | Pile | Port interne |
| --- | ----------------- | ----- | -------------- |
| `http://localhost:8080/` | `nginx` (proxy inverse) | Nginx 1.27 | 80 |
| `http://localhost:8080/api/ai/*` | `ai-service` (via le proxy) | Hono + LangGraph | 8787 |
| `http://localhost:3000` | `portfolio-v1` (Next.js standalone) | Next.js 16 | 3000 |
| `http://localhost:8787` | `ai-service` | Hono + LangGraph + tsx | 8787 |
| `http://localhost:3333` | `studio` (Sanity CMS) | Sanity + Vite | 3333 |

Montages à chaud : `./portfolio-v1:/app`, `./ai-service:/app`, `./studio:/app` (volumes anonymes `node_modules`). L'historique des fils IA persiste dans le volume nommé `ai-data`. Portfolio v2 est exclu de Docker, Compose, K8s et CI/CD — il est en cours de développement.

### Prérequis Windows

Le moteur Linux de Docker Desktop s'exécute sur WSL2, qui nécessite la fonctionnalité Windows **Virtual Machine Platform**. Sur Windows 10/11, activez-la une fois (PowerShell en tant qu'administrateur) puis redémarrez :

```powershell
dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

---

## Déploiement

### Kubernetes

```bash
# 1. Secrets (ne jamais valider de valeurs renseignées)
cp .k8s/secrets-template.yaml .k8s/secrets.yaml
#    renseignez les valeurs base64, puis :
kubectl apply -f .k8s/secrets.yaml

# 2. Appliquez la pile
kubectl apply -f .k8s/namespace.yaml
kubectl apply -f .k8s/configmap.yaml
kubectl apply -f .k8s/deployments.yaml
kubectl apply -f .k8s/services.yaml
kubectl apply -f .k8s/ingress.yaml   # nécessite un contrôleur Ingress nginx + secret TLS `namias-tech-tls`
```

Routage Ingress : `/` → `portfolio-v1:3000` (Prefix), `/api/ai/*` → `ai-service:8787` avec `rewrite-target: /api/$2` (capture regex, `ImplementationSpecific`). Studio reste interne (ClusterIP) car ses actifs SPA sont absolus par rapport à la racine.

### Modèle de déploiement double

`deploy-frontends.yml` exécute les jobs Vercel et Cloudflare **en parallèle** à chaque push sur `main`. Les deux jobs déploient `portfolio-v1` ; Vercel utilise la sortie préconstruite (`vercel build --prod --prebuilt`) et Cloudflare utilise `wrangler deploy` contre la configuration `wrangler.jsonc` existante. Chacun des fournisseurs peut servir de DNS principal (actuellement `namias.tech` → Vercel), l'autre restant en secours chaud.

### CI/CD (GitHub Actions)

| Workflow | Déclencheur | Rôle |
| -------- | ------- | ------------ |
| `ci.yml` | PR → `main` | Contrôle de qualité matriciel : lint + typecheck + tests pour `portfolio-v1`, `ai-service`, `studio` |
| `deploy-frontends.yml` | push → `main` | Déploiement double en parallèle : **Vercel** (CLI, préconstruit) + **Cloudflare Pages/Workers** (wrangler) |
| `docker-publish.yml` | push → `main` (chemins ai/studio) | Buildx construit `ghcr.io/pp-namias/{ai-service,studio}` avec cache de couches gha, tagué `sha-*` + `latest` |

### Secrets requis du dépôt

| Secret | Utilisé par | Rôle |
| ------ | ------- | ------- |
| `VERCEL_TOKEN` | deploy-frontends | Authentification Vercel |
| `VERCEL_ORG_ID` | deploy-frontends | Portée de l'organisation Vercel |
| `VERCEL_PROJECT_ID` | deploy-frontends | Portée du projet Vercel |
| `CLOUDFLARE_API_TOKEN` | deploy-frontends | Authentification Wrangler (Workers/Pages) |
| `CLOUDFLARE_ACCOUNT_ID` | deploy-frontends | Portée du compte Cloudflare |
| `GHCR_PAT` (optionnel) | docker-publish | Par défaut `GITHUB_TOKEN` ; requis uniquement pour un push inter-dépôts |

---

## Sanity CMS

Le portfolio est entièrement adossé à [Sanity v3](https://www.sanity.io/) — la surface éditoriale vit sur **[namias-cms.sanity.studio](https://namias-cms.sanity.studio)**.

| Fonctionnalité | Détails |
|---|---|
| **Studio** | Sanity v3 avec React 19, structure personnalisée, outil de présentation, outil vision |
| **Types de schéma** | 21 types de document (profil, héros, à propos, expérience, projet, certification, blog, galerie, paramètres du site, etc.) |
| **Plugins** | `structureTool`, `presentationTool`, `visionTool`, `assist`, outil de compétences personnalisé, requêtes enregistrées |
| **Actions de document** | Sélecteur de perspective, publier et actualiser (webhook de revalidation), voir sur le site, ouvrir en présentation |
| **Badges de document** | Brouillon/En ligne, Programmés, Obsolètes (30+ jours), Expiration proche, À la une |
| **Validations** | Règles centralisées : longueur de titre SEO-friendly, URL HTTPS uniquement, ordre des dates inter-champs, slugs uniques, texte alternatif requis |
| **Sanity Functions** | `scheduled-publish` (cron 5 min), `broken-refs` (cron 6 h), `auto-tag-images` (à la création d'actif) |
| **Édition visuelle** | API de contenu en direct `next-sanity` + composant `<SanityField>` avec attributs `data-sanity` pour le ciblage des superpositions |
| **Aperçu en temps réel** | Outil de présentation avec mode brouillon via `/api/draft-mode` |

Le package studio vit dans [`studio/`](../studio/) avec son propre `package.json`, 21 fichiers de schéma, 5 actions personnalisées, 42 fichiers de compétences en markdown et des scripts de données de départ.

---

## Contrôles de qualité

```bash
npm run lint          # ESLint — 0 erreur attendue
npx tsc --noEmit      # Typecheck strict TypeScript
npm run test -- --run # Vitest — 122 fichiers, 1 107 tests, tous verts
npm run doctor:check  # react-doctor — score 100/100
```

Les quatre contrôles s'exécutent en CI (`ci.yml`) et sont imposés localement par le hook de pre-push.

## Détection automatique des problèmes

Lorsqu'un workflow surveillé échoue, l'automatisation publie un rapport de problèmes avec des solutions suggérées sur la PR concernée (ou en tant qu'issue du dépôt lorsqu'aucune PR n'est liée).

- Workflow de détection : `problem-detection-advisor.yml`
- Contrôle d'approbation : `remediation-approval-gate.yml`

Pour approuver la ré-exécution de la remédiation, commentez sur la PR :

```text
/approve-remediation
```

Seuls les propriétaires, membres ou collaborateurs du dépôt peuvent approuver les ré-exécutions de remédiation.

---

## Mention de design

Ce projet s'inspire du design de [bryllim.com](https://bryllim.com/). Tout le code d'implémentation de ce dépôt est original.

## Licence

Sous licence MIT. Voir [LICENSE](../LICENSE).

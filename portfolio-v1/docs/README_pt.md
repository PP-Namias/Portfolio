<table>
  <tr>
    <td width="240" align="center" valign="middle">
      <img src="https://cdn.sanity.io/images/nl0qw78w/production/981efc0a450ec1a72f3904d5800ac8ee08c5085f-1024x1536.png" width="200" height="300" alt="Jhon Keneth Ryan Namias">
    </td>
    <td valign="middle">
      <h1>Jhon Keneth Ryan Namias</h1>
      <p><b>Gerente de Projeto @ MASH</b> · <b>Engenheiro Full Stack & Especialista em Automação com IA</b><br/>Manila, Filipinas</p>
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

## Sobre

Portfólio de produção para [namias.tech](https://namias.tech) — uma aplicação Next.js com abordagem modal-first, impulsada por Sanity, com sistema de animação moderno, gateway de mídia seguro, chat com IA e portões de qualidade CI/CD automatizados.

### Destaques

- **UX modal-first** — Modais de CV, Experiência, Reserva e Detalhe do Projeto com transições suaves
- **Conteúdo Sanity** — Todos os dados em tempo real servidos pelo Sanity CMS com consultas GROQ e cache multicamada
- **Gateway de mídia seguro** — `/api/media/[...path]` proxy de recursos Sanity com assinatura HMAC
- **Chat com IA** — Assistente Gemini em `/api/chat` com respostas predefinidas
- **Performance** — Cache multinível (L1 memória, L2 Upstash Redis, L3 CDN), ISR, SWR, otimização de imagens
- **Tema escuro/claro** — `next-themes` com sistema de cores de destaque
- **CI/CD automatizado** — 19 workflows GitHub para validação, escaneamento de segurança e implantação

---

## Stack principal

| Camada | Tecnologia |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Linguagem** | TypeScript (modo strict) |
| **Estilos** | Tailwind CSS + Framer Motion + Lucide React |
| **Tema** | `next-themes` com seletor de cor de destaque |
| **CMS** | Sanity v3 (Studio + Content Lake + CDN) |
| **Renderização** | `react-markdown` + `remark-gfm` + `rehype-highlight` |
| **Busca de dados** | SWR (cliente) + cache multicamada |
| **Entrega de mídia** | Gateway seguro em `/api/media/[...path]` |
| **IA** | Gemini 2.0 Flash (`/api/chat`) |
| **Testes** | Vitest + Testing Library + jsdom (410 testes) |
| **Hospedagem** | Cloudflare Workers via OpenNext |

---

## Sanity CMS

O portfólio é totalmente suportado pelo [Sanity v3](https://www.sanity.io/) — a superfície editorial está em **[namias-cms.sanity.studio](https://namias-cms.sanity.studio)**.

| Funcionalidade | Detalhes |
|---|---|
| **Tipos de schema** | 21 tipos de documento (profile, hero, about, experience, project, certification, blog, gallery, etc.) |
| **Plugins** | `structureTool`, `presentationTool`, `visionTool`, `assist` |
| **Ações de documento** | Seletor de perspectiva, publicar e atualizar, ver no site, abrir em apresentação |
| **Sanity Functions** | `scheduled-publish` (cron 5 min), `broken-refs` (cron 6 h), `auto-tag-images` |
| **Edição visual** | `next-sanity` Live Content API + componente `<SanityField>` |

---

## Primeiros passos

```bash
git clone https://github.com/PP-Namias/Portfolio.git
cd Portfolio
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

---

## Verificação de qualidade

```bash
npm run lint      # ESLint — 0 erros esperados
npm run test      # Vitest — 410 testes, todos verdes
npm run doctor    # react-doctor — 100/100
```

---

## Agradecimento de design

Este projeto inspira-se no design de [bryllim.com](https://bryllim.com/). Todo o código de implementação neste repositório é original.

## Licença

Licença MIT. Ver [LICENSE](../LICENSE).

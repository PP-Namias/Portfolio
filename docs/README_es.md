<table>
  <tr>
    <td width="240" align="center" valign="middle">
      <img src="https://cdn.sanity.io/images/nl0qw78w/production/981efc0a450ec1a72f3904d5800ac8ee08c5085f-1024x1536.png" width="200" height="300" alt="Jhon Keneth Ryan Namias">
    </td>
    <td valign="middle">
      <h1>Jhon Keneth Ryan Namias</h1>
      <p><b>Gerente de Proyecto @ MASH</b> · <b>Ingeniero Full Stack y Especialista en Automatización con IA</b><br/>Manila, Filipinas</p>
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

## Acerca de

Portafolio de producción para [namias.tech](https://namias.tech) — una aplicación Next.js impulsada por Sanity con enfoque modal-first, sistema de animación moderno, gateway de medios seguro, chat con IA y puertas de calidad CI/CD automatizadas.

### Destacados

- **UX modal-first** — Modales de CV, Experiencia, Reserva y Detalle de Proyecto con transiciones fluidas
- **Contenido impulsado por Sanity** — Todos los datos en tiempo real servidos desde Sanity CMS con consultas GROQ y caché multicapa
- **Gateway de medios seguro** — `/api/media/[...path]` proxy de recursos Sanity con firma HMAC opcional
- **Chat con IA** — Asistente impulsado por Gemini en `/api/chat` con respuestas predefinidas
- **Rendimiento** — Caché multinivel (L1 memoria, L2 Upstash Redis, L3 CDN), ISR, SWR, optimización de imágenes
- **Tema oscuro/claro** — `next-themes` con sistema de colores de acento
- **CI/CD automatizado** — 19 flujos de trabajo GitHub para validación, escaneo de seguridad y despliegue

---

## Stack principal

| Capa | Tecnología |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Lenguaje** | TypeScript (modo strict) |
| **Estilos** | Tailwind CSS + Framer Motion + Lucide React |
| **Tema** | `next-themes` con selector de color de acento |
| **CMS** | Sanity v3 (Studio + Content Lake + CDN) |
| **Renderizado** | `react-markdown` + `remark-gfm` + `rehype-highlight` |
| **Obtención de datos** | SWR (cliente) + caché multinivel |
| **Entrega de medios** | Gateway seguro en `/api/media/[...path]` |
| **IA** | Gemini 2.0 Flash (`/api/chat`) |
| **Pruebas** | Vitest + Testing Library + jsdom (410 pruebas) |
| **Hosting** | Cloudflare Workers via OpenNext |

---

## Sanity CMS

El portafolio está respaldado por [Sanity v3](https://www.sanity.io/) — la superficie editorial está en **[namias-cms.sanity.studio](https://namias-cms.sanity.studio)**.

| Característica | Detalles |
|---|---|
| **Tipos de esquema** | 21 tipos de documento (profile, hero, about, experience, project, certification, blog, gallery, etc.) |
| **Plugins** | `structureTool`, `presentationTool`, `visionTool`, `assist` |
| **Acciones de documento** | Selector de perspectiva, publicar y actualizar, ver en sitio, abrir en presentación |
| **Sanity Functions** | `scheduled-publish` (cron 5 min), `broken-refs` (cron 6 h), `auto-tag-images` |
| **Edición visual** | `next-sanity` Live Content API + componente `<SanityField>` |

---

## Primeros pasos

```bash
git clone https://github.com/PP-Namias/Portfolio.git
cd Portfolio
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Verificación de calidad

```bash
npm run lint      # ESLint — 0 errores esperados
npm run test      # Vitest — 410 pruebas, todas verdes
npm run doctor    # react-doctor — 100/100
```

---

## Agradecimiento de diseño

Este proyecto toma inspiración de diseño de [bryllim.com](https://bryllim.com/). Todo el código de implementación en este repositorio es original.

## Licencia

Licencia MIT. Ver [LICENSE](../LICENSE).

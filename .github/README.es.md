<table>
  <tr>
    <td width="240" align="center" valign="middle">
      <img src="https://cdn.sanity.io/images/nl0qw78w/production/981efc0a450ec1a72f3904d5800ac8ee08c5085f-1024x1536.png" width="200" height="300" alt="Jhon Keneth Ryan B. Namias">
    </td>
    <td valign="middle">
      <h1>Jhon Keneth Ryan B. Namias</h1>
      <p><b>Ingeniero de IA y Aprendizaje Automático</b> · <b>Ingeniero Full Stack</b> · <b>Especialista en Automatización</b><br/>Manila, Filipinas</p>
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
  <a href="./README.fr.md">Français</a> ·
  <a href="./README.ja.md">日本語</a> ·
  <a href="./README.zh.md">中文</a>
</p>

---

## Acerca de

El portafolio de producción de [namias.tech](https://namias.tech) — una aplicación Next.js impulsada por Sanity y centrada en modales, con un sistema de animación moderno, una pasarela de medios segura, un asistente de IA y compuertas de calidad CI/CD automatizadas.

## Autor

**Jhon Keneth Ryan B. Namias** es Ingeniero de IA y Aprendizaje Automático, Ingeniero Full Stack y Especialista en Automatización con sede en Manila, Filipinas. Diseña aplicaciones web inteligentes de nivel de producción en la intersección del aprendizaje automático, la arquitectura en la nube y los flujos de trabajo automatizados — desde IA conversacional y pipelines de contenido hasta despliegues de múltiples servicios contenerizados.

---

## Arquitectura y pila tecnológica

### Estructura del monorepo

```
Portfolio/
├── portfolio-v1/    Portafolio actual en producción (Next.js 16, Sanity CMS, Tailwind)
├── portfolio-v2/    Rediseño de nueva generación (en curso)
├── ai-service/      Servicio de asistente de IA con Hono + LangGraph
├── studio/          CMS Sanity Studio (21 tipos de esquema)
├── scripts/         Scripts de importación y migración de Sanity
├── functions/       Sanity Functions
├── docs/            Documentación (seguridad, rendimiento, PRD, MCP)
├── .agents/         Habilidades de agente y subagentes
├── .github/         Flujos de trabajo CI/CD y gobernanza
└── .k8s/            Manifiestos de Kubernetes
```

| Proyecto | Estado | Pila |
|---------|--------|-------|
| **portfolio-v1** | En producción en [namias.tech](https://namias.tech) | Next.js 16, React 18, Tailwind, Sanity, Cloudflare/Vercel |
| **portfolio-v2** | Esqueleto | Next.js 16, React 19, Tailwind v4, Sanity CMS |
| **ai-service** | En producción | Hono + LangGraph (TypeScript) |

### Pila principal

| Capa | Tecnología |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Lenguaje** | TypeScript (modo estricto) |
| **Estilos** | Tailwind CSS + Framer Motion + Lucide React |
| **Tema** | `next-themes` con selector de color de acento |
| **CMS** | Sanity v3 (Studio + Content Lake + CDN) |
| **Renderizado de contenido** | `react-markdown` + `remark-gfm` + `rehype-highlight` |
| **Obtención de datos** | SWR (cliente) + caché de varias capas (L1 en memoria → L2 Upstash Redis → L3 CDN) |
| **Entrega de medios** | Pasarela segura en `/api/media/[...path]` con verificación HMAC |
| **IA** | Asistente Hono + LangGraph con conmutación por error multi-proveedor |
| **Pruebas** | Vitest + Testing Library + jsdom (122 archivos, 1.107 pruebas) |
| **Alojamiento** | Vercel (principal) + Cloudflare Workers vía OpenNext (reserva) |

### Aspectos destacados

- **UX centrada en modales** — Modales de currículum, experiencia, reservas y detalle de proyectos con transiciones fluidas
- **Contenido impulsado por Sanity** — Todos los datos en tiempo de ejecución se sirven desde Sanity CMS con consultas GROQ y caché de varias capas
- **Pasarela de medios segura** — `/api/media/[...path]` actúa como proxy de los activos de Sanity con firma HMAC
- **Chat de IA** — Asistente LangGraph con historial de hilos persistente
- **Rendimiento** — Caché de varias capas (L1 en memoria, L2 Upstash Redis, L3 CDN), ISR, SWR, optimización de imágenes
- **Tema oscuro/claro** — `next-themes` con sistema de color de acento
- **CI/CD automatizado** — 20 flujos de trabajo de GitHub para validación, escaneo de seguridad y despliegue

---

## Primeros pasos

### Desarrollo local

```bash
git clone https://github.com/PP-Namias/Portfolio.git
cd Portfolio
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Docker (recomendado)

```bash
# 1. Entorno (plantilla -> valores reales)
cp .env.docker.example .env.docker   # complete los tokens y claves

# 2a. Desarrollo (recarga en caliente, montado por volumen)
docker compose up --build

# 2b. Producción (builds multi-etapa + proxy nginx en :8080)
docker compose -f docker-compose.prod.yml up --build
```

### Enrutamiento local (Docker)

| URL | Servicio del contenedor | Pila | Puerto interno |
| --- | ----------------- | ----- | -------------- |
| `http://localhost:8080/` | `nginx` (proxy inverso) | Nginx 1.27 | 80 |
| `http://localhost:8080/api/ai/*` | `ai-service` (vía proxy) | Hono + LangGraph | 8787 |
| `http://localhost:3000` | `portfolio-v1` (Next.js standalone) | Next.js 16 | 3000 |
| `http://localhost:8787` | `ai-service` | Hono + LangGraph + tsx | 8787 |
| `http://localhost:3333` | `studio` (Sanity CMS) | Sanity + Vite | 3333 |

Montajes de recarga en caliente: `./portfolio-v1:/app`, `./ai-service:/app`, `./studio:/app` (volúmenes anónimos de `node_modules`). El historial de hilos de IA persiste en el volumen con nombre `ai-data`. Portfolio v2 está excluido de Docker, Compose, K8s y CI/CD — es trabajo en curso.

### Requisitos previos de Windows

El motor Linux de Docker Desktop se ejecuta sobre WSL2, que requiere la característica de Windows **Virtual Machine Platform**. En Windows 10/11 actívela una vez (PowerShell como administrador) y reinicie:

```powershell
dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

---

## Despliegue

### Kubernetes

```bash
# 1. Secretos (nunca confirme valores completados)
cp .k8s/secrets-template.yaml .k8s/secrets.yaml
#    complete los valores base64 y luego:
kubectl apply -f .k8s/secrets.yaml

# 2. Aplique la pila
kubectl apply -f .k8s/namespace.yaml
kubectl apply -f .k8s/configmap.yaml
kubectl apply -f .k8s/deployments.yaml
kubectl apply -f .k8s/services.yaml
kubectl apply -f .k8s/ingress.yaml   # requiere un controlador de Ingress nginx + secreto TLS `namias-tech-tls`
```

Enrutamiento de Ingress: `/` → `portfolio-v1:3000` (Prefix), `/api/ai/*` → `ai-service:8787` con `rewrite-target: /api/$2` (captura de regex, `ImplementationSpecific`). Studio permanece interno (ClusterIP) porque sus activos SPA son absolutos respecto a la raíz.

### Modelo de despliegue dual

`deploy-frontends.yml` ejecuta los trabajos de Vercel y Cloudflare **en paralelo** en cada push a `main`. Ambos trabajos despliegan `portfolio-v1`; Vercel usa la salida precompilada (`vercel build --prod --prebuilt`) y Cloudflare usa `wrangler deploy` contra la configuración existente de `wrangler.jsonc`. Cualquiera de los proveedores puede servir como DNS principal (actualmente `namias.tech` → Vercel) con el otro como reserva en caliente.

### CI/CD (GitHub Actions)

| Flujo de trabajo | Disparador | Qué hace |
| -------- | ------- | ------------ |
| `ci.yml` | PR → `main` | Compuerta de calidad matricial: lint + typecheck + pruebas para `portfolio-v1`, `ai-service`, `studio` |
| `deploy-frontends.yml` | push → `main` | Despliegue dual en paralelo: **Vercel** (CLI, precompilado) + **Cloudflare Pages/Workers** (wrangler) |
| `docker-publish.yml` | push → `main` (rutas ai/studio) | Buildx construye `ghcr.io/pp-namias/{ai-service,studio}` con caché de capas gha, etiquetado `sha-*` + `latest` |

### Secretos requeridos del repositorio

| Secreto | Usado por | Propósito |
| ------ | ------- | ------- |
| `VERCEL_TOKEN` | deploy-frontends | Autenticación de Vercel |
| `VERCEL_ORG_ID` | deploy-frontends | Alcance de organización de Vercel |
| `VERCEL_PROJECT_ID` | deploy-frontends | Alcance de proyecto de Vercel |
| `CLOUDFLARE_API_TOKEN` | deploy-frontends | Autenticación de Wrangler (Workers/Pages) |
| `CLOUDFLARE_ACCOUNT_ID` | deploy-frontends | Alcance de cuenta de Cloudflare |
| `GHCR_PAT` (opcional) | docker-publish | Tiene como predeterminado `GITHUB_TOKEN`; solo se necesita para push entre repos |

---

## Sanity CMS

El portafolio está totalmente respaldado por [Sanity v3](https://www.sanity.io/) — la superficie editorial vive en **[namias-cms.sanity.studio](https://namias-cms.sanity.studio)**.

| Característica | Detalles |
|---|---|
| **Studio** | Sanity v3 con React 19, estructura personalizada, herramienta de presentación, herramienta de visión |
| **Tipos de esquema** | 21 tipos de documento (perfil, héroe, acerca de, experiencia, proyecto, certificación, blog, galería, configuración del sitio, etc.) |
| **Plugins** | `structureTool`, `presentationTool`, `visionTool`, `assist`, herramienta de habilidades personalizada, consultas guardadas |
| **Acciones de documento** | Conmutador de perspectiva, publicar y actualizar (webhook de revalidación), ver en el sitio, abrir en presentación |
| **Insignias de documento** | Borrador/Publicado, Programado, Obsoleto (30+ días), Próximo a expirar, Destacado |
| **Validaciones** | Reglas centralizadas: longitud de titular SEO-friendly, URLs solo HTTPS, orden de fechas entre campos, slugs únicos, requisito de texto alternativo |
| **Sanity Functions** | `scheduled-publish` (cron de 5 min), `broken-refs` (cron de 6 h), `auto-tag-images` (al crear activos) |
| **Edición visual** | API de contenido en vivo de `next-sanity` + componente `<SanityField>` con atributos `data-sanity` para el direccionamiento de superposiciones |
| **Vista previa en tiempo real** | Herramienta de presentación con modo borrador vía `/api/draft-mode` |

El paquete de studio vive en [`studio/`](../studio/) con su propio `package.json`, 21 archivos de esquema, 5 acciones personalizadas, 42 archivos de habilidades en markdown y scripts de datos semilla.

---

## Compuertas de calidad

```bash
npm run lint          # ESLint — se esperan 0 errores
npx tsc --noEmit      # Typecheck estricto de TypeScript
npm run test -- --run # Vitest — 122 archivos, 1.107 pruebas, todas en verde
npm run doctor:check  # react-doctor — puntuación 100/100
```

Las cuatro compuertas se ejecutan en CI (`ci.yml`) y se aplican localmente mediante el hook de pre-push.

## Detección automática de problemas

Cuando fallan los flujos de trabajo monitoreados, la automatización publica un informe de problemas con soluciones sugeridas en el PR relacionado (o como un issue del repositorio cuando no hay ningún PR vinculado).

- Flujo de detección: `problem-detection-advisor.yml`
- Compuerta de aprobación: `remediation-approval-gate.yml`

Para aprobar la re-ejecución de la remediación, comente en el PR:

```text
/approve-remediation
```

Solo los propietarios, miembros o colaboradores del repositorio pueden aprobar la re-ejecución de la remediación.

---

## Reconocimiento de diseño

Este proyecto toma inspiración de diseño de [bryllim.com](https://bryllim.com/). Todo el código de implementación en este repositorio es original.

## Licencia

Licenciado bajo la Licencia MIT. Consulte [LICENSE](../LICENSE).

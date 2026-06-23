<table>
  <tr>
    <td width="240" align="center" valign="middle">
      <img src="https://cdn.sanity.io/images/nl0qw78w/production/981efc0a450ec1a72f3904d5800ac8ee08c5085f-1024x1536.png" width="200" height="300" alt="Jhon Keneth Ryan Namias">
    </td>
    <td valign="middle">
      <h1>Jhon Keneth Ryan Namias</h1>
      <p><b>Руководитель проектов @ MASH</b> · <b>Full Stack разработчик и специалист по AI-автоматизации</b><br/>Манила, Филиппины</p>
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

## О проекте

Продакшн-портфолио для [namias.tech](https://namias.tech) — приложение на Next.js с подходом modal-first, на базе Sanity, с современной системой анимаций, безопасным медиа-шлюзом, AI-чатом и автоматизированными воротами качества CI/CD.

### Особенности

- **UX modal-first** — Модальные окна резюме, опыта, бронирования и деталей проекта с плавными переходами
- **Контент на Sanity** — Все данные в реальном времени через Sanity CMS с GROQ-запросами и многоуровневым кэшированием
- **Безопасный медиа-шлюз** — `/api/media/[...path]` проксирует ресурсы Sanity с HMAC-подписью
- **AI-чат** — Ассистент на Gemini `/api/chat` с предустановленными ответами
- **Производительность** — Многоуровневый кэш (L1 память, L2 Upstash Redis, L3 CDN), ISR, SWR, оптимизация изображений
- **Тёмная/светлая тема** — `next-themes` с системой акцентных цветов
- **Автоматизация CI/CD** — 19 GitHub-воркфлоу для валидации, сканирования безопасности и деплоя

---

## Основной стек

| Уровень | Технология |
|---|---|
| **Фреймворк** | Next.js 16 (App Router) |
| **Язык** | TypeScript (строгий режим) |
| **Стили** | Tailwind CSS + Framer Motion + Lucide React |
| **Тема** | `next-themes` с выбором акцентного цвета |
| **CMS** | Sanity v3 (Studio + Content Lake + CDN) |
| **Рендеринг** | `react-markdown` + `remark-gfm` + `rehype-highlight` |
| **Получение данных** | SWR (клиент) + многоуровневый кэш |
| **Доставка медиа** | Безопасный шлюз `/api/media/[...path]` |
| **AI** | Gemini 2.0 Flash (`/api/chat`) |
| **Тестирование** | Vitest + Testing Library + jsdom (410 тестов) |
| **Хостинг** | Cloudflare Workers через OpenNext |

---

## Sanity CMS

Портфолио полностью поддерживается [Sanity v3](https://www.sanity.io/) — редакторская поверхность находится на **[namias-cms.sanity.studio](https://namias-cms.sanity.studio)**.

| Возможность | Подробности |
|---|---|
| **Типы схем** | 21 тип документа (profile, hero, about, experience, project, certification, blog, gallery и др.) |
| **Плагины** | `structureTool`, `presentationTool`, `visionTool`, `assist` |
| **Действия документа** | Переключатель перспективы, публикация и обновление, просмотр на сайте |
| **Sanity Functions** | `scheduled-publish` (крон 5 мин), `broken-refs` (крон 6 ч), `auto-tag-images` |
| **Визуальное редактирование** | `next-sanity` Live Content API + компонент `<SanityField>` |

---

## Быстрый старт

```bash
git clone https://github.com/PP-Namias/Portfolio.git
cd Portfolio
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

---

## Проверка качества

```bash
npm run lint      # ESLint — 0 ошибок
npm run test      # Vitest — 410 тестов, все зелёные
npm run doctor    # react-doctor — 100/100
```

---

## Благодарности за дизайн

Этот проект черпает вдохновение из дизайна [bryllim.com](https://bryllim.com/). Весь код реализации в этом репозитории является оригинальным.

## Лицензия

Лицензия MIT. См. [LICENSE](../LICENSE).

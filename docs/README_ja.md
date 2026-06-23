<table>
  <tr>
    <td width="240" align="center" valign="middle">
      <img src="https://cdn.sanity.io/images/nl0qw78w/production/981efc0a450ec1a72f3904d5800ac8ee08c5085f-1024x1536.png" width="200" height="300" alt="Jhon Keneth Ryan Namias">
    </td>
    <td valign="middle">
      <h1>Jhon Keneth Ryan Namias</h1>
      <p><b>プロジェクトマネージャー @ MASH</b> · <b>フルスタックエンジニア & AIオートメーションスペシャリスト</b><br/>マニラ、フィリピン</p>
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

## 概要

[namias.tech](https://namias.tech) の本番ポートフォリオ — モーダルファースト、Sanity駆動のNext.jsアプリケーション。モダンなアニメーションシステム、セキュアメディアゲートウェイ、AIチャット、自動化CI/CD品質チェックを搭載。

### ハイライト

- **モーダルファーストUX** — Resume、Experience、Booking、Project Detailモーダルをスムーズなトランジションで実現
- **Sanity連携コンテンツ** — 全ランタイムデータをSanity CMSからGROQクエリとマルチレイヤーキャッシュで配信
- **セキュアメディアゲートウェイ** — `/api/media/[...path]` でSanityアセットをHMAC署名付きプロキシ
- **AIチャット** — Gemini搭載アシスタント `/api/chat`、よくある質問へのプリセットレスポンス
- **パフォーマンス** — L1インメモリ、L2 Upstash Redis、L3 CDNのマルチティアキャッシュ、ISR、SWR、画像最適化
- **ダーク/ライトテーマ** — `next-themes` とアクセントカラーシステム
- **自動化CI/CD** — 19のGitHubワークフローでバリデーション、セキュリティスキャン、デプロイを自動化

---

## コアスタック

| レイヤー | 技術 |
|---|---|
| **フレームワーク** | Next.js 16 (App Router) |
| **言語** | TypeScript (strict mode) |
| **スタイリング** | Tailwind CSS + Framer Motion + Lucide React |
| **テーマ** | `next-themes` + アクセントカラーピッカー |
| **CMS** | Sanity v3 (Studio + Content Lake + CDN) |
| **コンテンツレンダリング** | `react-markdown` + `remark-gfm` + `rehype-highlight` |
| **データフェッチ** | SWR (クライアント) + マルチレイヤーキャッシュ |
| **メディア配信** | `/api/media/[...path]` のセキュアゲートウェイ |
| **AI** | Gemini 2.0 Flash (`/api/chat`) |
| **テスト** | Vitest + Testing Library + jsdom (410テスト) |
| **ホスティング** | Cloudflare Workers via OpenNext |

---

## Sanity CMS

ポートフォリオは[Sanity v3](https://www.sanity.io/)で全面サポート — エディトリアルサーフェスは **[namias-cms.sanity.studio](https://namias-cms.sanity.studio)** で公開。

| 機能 | 詳細 |
|---|---|
| **スキーマタイプ** | 21ドキュメントタイプ (profile, hero, about, experience, project, certification, blog, galleryなど) |
| **プラグイン** | `structureTool`, `presentationTool`, `visionTool`, `assist`, カスタムスキルツール |
| **ドキュメントアクション** | パースペクティブ切替、公開と更新、サイト表示、プレゼンテーション表示 |
| **Sanity Functions** | `scheduled-publish` (5分cron)、`broken-refs` (6時間cron)、`auto-tag-images` |
| **ビジュアル編集** | `next-sanity` Live Content API + `<SanityField>` コンポーネント |

---

## はじめに

```bash
git clone https://github.com/PP-Namias/Portfolio.git
cd Portfolio
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開いてください。

---

## 品質チェック

```bash
npm run lint      # ESLint — 0エラー
npm run test      # Vitest — 410テスト、すべて合格
npm run doctor    # react-doctor — 100/100スコア
```

---

## デザイン謝辞

このプロジェクトは [bryllim.com](https://bryllim.com/) からデザインのインスピレーションを得ています。このリポジトリの全実装コードはオリジナルです。

## ライセンス

MITライセンス。詳細は [LICENSE](../LICENSE) を参照。

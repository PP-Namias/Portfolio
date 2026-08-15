<table>
  <tr>
    <td width="240" align="center" valign="middle">
      <img src="https://cdn.sanity.io/images/nl0qw78w/production/981efc0a450ec1a72f3904d5800ac8ee08c5085f-1024x1536.png" width="200" height="300" alt="Jhon Keneth Ryan B. Namias">
    </td>
    <td valign="middle">
      <h1>Jhon Keneth Ryan B. Namias</h1>
      <p><b>AI・機械学習エンジニア</b> · <b>フルスタックエンジニア</b> · <b>自動化スペシャリスト</b><br/>フィリピン・マニラ</p>
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
  <a href="./README.fr.md">Français</a> ·
  <a href="./README.zh.md">中文</a>
</p>

---

## 概要

[namias.tech](https://namias.tech) のプロダクションポートフォリオ — モーダルファースト、Sanity 駆動の Next.js アプリケーションで、近代的なアニメーションシステム、セキュアなメディアゲートウェイ、AI アシスタント、自動化された CI/CD 品質ゲートを備えています。

## 著者

**Jhon Keneth Ryan B. Namias** は、フィリピン・マニラを拠点とする AI・機械学習エンジニア、フルスタックエンジニア、自動化スペシャリストです。彼は、機械学習、クラウドアーキテクチャ、自動化ワークフローの交差点において、会話型 AI やコンテンツパイプラインからコンテナ化されたマルチサービスデプロイメントに至るまで、インテリジェントでプロダクショングレードの Web アプリケーションを設計しています。

---

## アーキテクチャと技術スタック

### モノレポ構成

```
Portfolio/
├── portfolio-v1/    現在の本番ポートフォリオ (Next.js 16、Sanity CMS、Tailwind)
├── portfolio-v2/    次世代リデザイン (進行中)
├── ai-service/      Hono + LangGraph による AI アシスタントサービス
├── studio/          Sanity Studio CMS (21 スキーマタイプ)
├── scripts/         Sanity インポート・マイグレーションスクリプト
├── functions/       Sanity Functions
├── docs/            ドキュメント (セキュリティ、パフォーマンス、PRD、MCP)
├── .agents/         エージェントスキルとサブエージェント
├── .github/         CI/CD ワークフローとガバナンス
└── .k8s/            Kubernetes マニフェスト
```

| プロジェクト | ステータス | スタック |
|---------|--------|-------|
| **portfolio-v1** | [namias.tech](https://namias.tech) で稼働中 | Next.js 16、React 18、Tailwind、Sanity、Cloudflare/Vercel |
| **portfolio-v2** | スケルトン | Next.js 16、React 19、Tailwind v4、Sanity CMS |
| **ai-service** | 稼働中 | Hono + LangGraph (TypeScript) |

### コアスタック

| レイヤー | 技術 |
|---|---|
| **フレームワーク** | Next.js 16 (App Router) |
| **言語** | TypeScript (strict モード) |
| **スタイリング** | Tailwind CSS + Framer Motion + Lucide React |
| **テーマ** | `next-themes` + アクセントカラーピッカー |
| **CMS** | Sanity v3 (Studio + Content Lake + CDN) |
| **コンテンツレンダリング** | `react-markdown` + `remark-gfm` + `rehype-highlight` |
| **データフェッチ** | SWR (クライアント) + 多層キャッシュ (L1 インメモリ → L2 Upstash Redis → L3 CDN) |
| **メディア配信** | HMAC 検証付き `/api/media/[...path]` のセキュアゲートウェイ |
| **AI** | マルチプロバイダー・フェイルオーバー対応の Hono + LangGraph アシスタント |
| **テスト** | Vitest + Testing Library + jsdom (122 ファイル、1,107 テスト) |
| **ホスティング** | Vercel (プライマリ) + OpenNext 経由の Cloudflare Workers (スタンバイ) |

### 主な特長

- **モーダルファースト UX** — 履歴書、職歴、予約、プロジェクト詳細モーダルのスムーズなトランジション
- **Sanity 駆動コンテンツ** — すべての実行時データは GROQ クエリと多層キャッシュにより Sanity CMS から配信
- **セキュアなメディアゲートウェイ** — `/api/media/[...path]` が HMAC 署名付きで Sanity アセットをプロキシ
- **AI チャット** — 永続的なスレッド履歴を持つ LangGraph アシスタント
- **パフォーマンス** — 多層キャッシュ (L1 インメモリ、L2 Upstash Redis、L3 CDN)、ISR、SWR、画像最適化
- **ダーク/ライトテーマ** — `next-themes` + アクセントカラーシステム
- **自動化された CI/CD** — 検証、セキュリティスキャン、デプロイのための 20 の GitHub ワークフロー

---

## はじめに

### ローカル開発

```bash
git clone https://github.com/PP-Namias/Portfolio.git
cd Portfolio
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) を開きます。

### Docker（推奨）

```bash
# 1. 環境 (テンプレート → 実際の値)
cp .env.docker.example .env.docker   # トークンとキーを入力

# 2a. 開発 (ホットリロード、ボリュームマウント)
docker compose up --build

# 2b. 本番 (マルチステージビルド + :8080 の nginx プロキシ)
docker compose -f docker-compose.prod.yml up --build
```

### ローカルルーティング（Docker）

| URL | コンテナサービス | スタック | 内部ポート |
| --- | ----------------- | ----- | -------------- |
| `http://localhost:8080/` | `nginx` (リバースプロキシ) | Nginx 1.27 | 80 |
| `http://localhost:8080/api/ai/*` | `ai-service` (プロキシ経由) | Hono + LangGraph | 8787 |
| `http://localhost:3000` | `portfolio-v1` (Next.js standalone) | Next.js 16 | 3000 |
| `http://localhost:8787` | `ai-service` | Hono + LangGraph + tsx | 8787 |
| `http://localhost:3333` | `studio` (Sanity CMS) | Sanity + Vite | 3333 |

ホットリロードマウント: `./portfolio-v1:/app`、`./ai-service:/app`、`./studio:/app` (匿名 `node_modules` ボリューム)。AI スレッド履歴は `ai-data` 名前付きボリュームに永続化されます。Portfolio v2 は Docker、Compose、K8s、CI/CD から除外されています — 開発中のためです。

### Windows の前提条件

Docker Desktop の Linux エンジンは WSL2 上で動作し、**Virtual Machine Platform** Windows 機能が必要です。Windows 10/11 では一度だけ有効化し (管理者 PowerShell)、再起動してください:

```powershell
dism /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

---

## デプロイ

### Kubernetes

```bash
# 1. シークレット (入力済みの値は決してコミットしない)
cp .k8s/secrets-template.yaml .k8s/secrets.yaml
#    base64 値を入力し、次に:
kubectl apply -f .k8s/secrets.yaml

# 2. スタックを適用
kubectl apply -f .k8s/namespace.yaml
kubectl apply -f .k8s/configmap.yaml
kubectl apply -f .k8s/deployments.yaml
kubectl apply -f .k8s/services.yaml
kubectl apply -f .k8s/ingress.yaml   # nginx Ingress コントローラ + `namias-tech-tls` TLS シークレットが必要
```

Ingress ルーティング: `/` → `portfolio-v1:3000` (Prefix)、`/api/ai/*` → `rewrite-target: /api/$2` 付き `ai-service:8787` (正規表現キャプチャ、`ImplementationSpecific`)。Studio は SPA アセットがルート絶対パスのため、内部 (ClusterIP) のままです。

### デュアルデプロイモデル

`deploy-frontends.yml` は `main` へのプッシュのたびに Vercel と Cloudflare のジョブを**並列で**実行します。両ジョブとも `portfolio-v1` をデプロイします。Vercel はプリビルド出力 (`vercel build --prod --prebuilt`) を使用し、Cloudflare は既存の `wrangler.jsonc` 設定に対して `wrangler deploy` を使用します。どちらのプロバイダーもプライマリ DNS として機能でき (現在 `namias.tech` → Vercel)、もう一方はウォームスタンバイとして稼働します。

### CI/CD (GitHub Actions)

| ワークフロー | トリガー | 内容 |
| -------- | ------- | ------------ |
| `ci.yml` | PR → `main` | マトリックス品質ゲート: `portfolio-v1`、`ai-service`、`studio` の lint + 型チェック + テスト |
| `deploy-frontends.yml` | push → `main` | 並列デュアルデプロイ: **Vercel** (CLI、プリビルド) + **Cloudflare Pages/Workers** (wrangler) |
| `docker-publish.yml` | push → `main` (ai/studio パス) | Buildx が gha レイヤーキャッシュで `ghcr.io/pp-namias/{ai-service,studio}` をビルド、`sha-*` + `latest` タグ |

### 必要なリポジトリシークレット

| シークレット | 使用元 | 目的 |
| ------ | ------- | ------- |
| `VERCEL_TOKEN` | deploy-frontends | Vercel 認証 |
| `VERCEL_ORG_ID` | deploy-frontends | Vercel 組織スコープ |
| `VERCEL_PROJECT_ID` | deploy-frontends | Vercel プロジェクトスコープ |
| `CLOUDFLARE_API_TOKEN` | deploy-frontends | Wrangler 認証 (Workers/Pages) |
| `CLOUDFLARE_ACCOUNT_ID` | deploy-frontends | Cloudflare アカウントスコープ |
| `GHCR_PAT` (任意) | docker-publish | 既定で `GITHUB_TOKEN`。クロスリポジトリプッシュにのみ必要 |

---

## Sanity CMS

ポートフォリオは [Sanity v3](https://www.sanity.io/) に完全に支えられており、編集面は **[namias-cms.sanity.studio](https://namias-cms.sanity.studio)** にあります。

| 機能 | 詳細 |
|---|---|
| **Studio** | React 19 の Sanity v3、カスタム構造、プレゼンテーションツール、ビジョンツール |
| **スキーマタイプ** | 21 ドキュメントタイプ (プロフィール、ヒーロー、アバウト、職歴、プロジェクト、認定資格、ブログ、ギャラリー、サイト設定など) |
| **プラグイン** | `structureTool`、`presentationTool`、`visionTool`、`assist`、カスタムスキルツール、保存済みクエリ |
| **ドキュメントアクション** | パースペクティブ切り替え、公開と更新 (再検証 Webhook)、サイトで表示、プレゼンテーションで開く |
| **ドキュメントバッジ** | 下書き/公開、予約済み、古い (30 日以上)、まもなく期限切れ、注目 |
| **バリデーション** | 集中ルール: SEO フレンドリーな見出し長、HTTPS のみの URL、フィールド間の日付順、一意のスラッグ、代替テキスト必須 |
| **Sanity Functions** | `scheduled-publish` (5 分 cron)、`broken-refs` (6 時間 cron)、`auto-tag-images` (アセット作成時) |
| **ビジュアル編集** | `next-sanity` ライブコンテンツ API + オーバーレイターゲティング用 `data-sanity` 属性付き `<SanityField>` コンポーネント |
| **リアルタイムプレビュー** | `/api/draft-mode` によるドラフトモードのプレゼンテーションツール |

Studio パッケージは [`studio/`](../studio/) にあり、独自の `package.json`、21 スキーマファイル、5 カスタムアクション、42 スキルマークダウンファイル、シードデータスクリプトを含みます。

---

## 品質ゲート

```bash
npm run lint          # ESLint — エラー 0 を期待
npx tsc --noEmit      # TypeScript strict 型チェック
npm run test -- --run # Vitest — 122 ファイル、1,107 テスト、すべて成功
npm run doctor:check  # react-doctor — 100/100 スコア
```

4 つのゲートはすべて CI (`ci.yml`) で実行され、ローカルでは pre-push フックによって強制されます。

## 自動問題検知

監視対象のワークフローが失敗すると、自動化が関連 PR に提案ソリューション付きの問題レポートを投稿します (PR がリンクされていない場合はリポジトリイシューとして投稿)。

- 検知ワークフロー: `problem-detection-advisor.yml`
- 承認ゲート: `remediation-approval-gate.yml`

修復の再実行を承認するには、PR にコメントします:

```text
/approve-remediation
```

修復の再実行を承認できるのは、リポジトリのオーナー、メンバー、コラボレーターのみです。

---

## デザインの謝辞

このプロジェクトは [bryllim.com](https://bryllim.com/) からデザインのインスピレーションを得ています。このリポジトリの実装コードはすべてオリジナルです。

## ライセンス

MIT ライセンスの下で提供されています。[LICENSE](../LICENSE) を参照してください。

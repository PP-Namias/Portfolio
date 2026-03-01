# Next.js Project Initialization — Cloud-Native Portfolio

## Step 1: Create the Next.js Project

Run the following command inside your Codespace terminal:

```bash
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

### What each flag does

| Flag | Purpose |
|------|---------|
| `@14` | Uses Next.js 14 (stable LTS version) |
| `.` | Initializes in the current directory (your repo root) |
| `--typescript` | Enables TypeScript for type safety |
| `--tailwind` | Pre-configures Tailwind CSS for utility-first styling |
| `--eslint` | Adds ESLint for code quality checks |
| `--app` | Uses the App Router (modern Next.js routing) |
| `--src-dir` | Places source files inside a `src/` directory |
| `--import-alias "@/*"` | Enables clean imports like `@/components/...` |
| `--use-npm` | Uses npm as the package manager |

## Step 2: Install Additional Packages

```bash
npm install next-themes framer-motion lucide-react
```

### What each package does

| Package | Purpose |
|---------|---------|
| `next-themes` | Handles light/dark mode switching with class-based strategy |
| `framer-motion` | Provides smooth animations and transitions for UI components |
| `lucide-react` | Supplies a clean, consistent icon library (MIT licensed) |

## Step 3: Verify the Setup

Start the development server to confirm everything is working:

```bash
npm run dev
```

Codespaces will automatically forward port 3000. Click the URL in the terminal or use the **Ports** tab to open the preview in your browser. You should see the default Next.js starter page.

## Resulting `package.json` (dependencies section)

```json
{
  "dependencies": {
    "next": "14.2.21",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "next-themes": "^0.4.4",
    "framer-motion": "^11.15.0",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "@types/node": "^20.17.12",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.1",
    "eslint-config-next": "14.2.21",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.3"
  }
}
```

At this point you have a modern React framework with type safety, utility-first styling, and a cloud-based dev workflow — all production-ready from a structural standpoint.

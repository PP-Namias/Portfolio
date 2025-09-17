# Project Setup & Running Guide

This guide will help you set up and run the Portfolio project locally.

## Prerequisites
- [Node.js](https://nodejs.org/) (Recommended: v18 or newer)
- [pnpm](https://pnpm.io/) package manager

### Installing pnpm
If you don't have pnpm installed, you can install it using one of these methods:

**Option 1: Using npm (recommended)**
```sh
npm install -g pnpm
```

**Option 2: Using PowerShell (Windows)**
```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

**Option 3: Using Chocolatey (Windows)**
```sh
choco install pnpm
```

After installation, restart your terminal and verify pnpm is working:
```sh
pnpm --version
```

## Installation
1. **Clone the repository** (if you haven't already):
   ```sh
   git clone https://github.com/PP-Namias/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies**:
   ```sh
   pnpm i
   ```

   **Alternative using npm** (if you prefer not to use pnpm):
   ```sh
   npm install
   ```
   > Note: This project is optimized for pnpm, so using npm might result in slightly different dependency resolution.

## Running the Project
1. **Start the development server**:
   ```sh
   pnpm dev
   ```
   This will start the local Astro server. You can access the site at [http://localhost:4321](http://localhost:4321).

2. **Build for production**:
   ```sh
   pnpm build
   ```
   This builds the site and generates the search index. The output will be in the `dist/` folder.

3. **Preview the production build**:
   ```sh
   pnpm preview
   ```

## Additional Scripts
- **Type checking**:
  ```sh
  pnpm check
  ```
- **Create a new post**:
  ```sh
  pnpm new-post
  ```
- **Linting & fixing**:
  ```sh
  pnpm lint
  ```
- **Format code**:
  ```sh
  pnpm format
  ```

## Troubleshooting
- **"pnpm is not recognized"**: Install pnpm using `npm install -g pnpm`, then restart your terminal.
- **Permission errors**: On Windows, you might need to run the terminal as Administrator when installing global packages.
- **Node.js version issues**: Ensure you're using Node.js v18 or newer with `node --version`.
- **Port already in use**: If port 4321 is busy, Astro will automatically use the next available port.
- If you encounter other issues, ensure your Node.js and pnpm versions are up to date.
- Check the documentation in `README.md` for more details.

---

For more information, see the main `README.md` or reach out via Issues.

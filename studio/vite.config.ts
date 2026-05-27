import {defineConfig} from 'vite'

// Vite plugin: fix Windows-generated backslashes in Sanity runtime path
// Some Windows environments produce a `/.sanity\\runtime\\app.js` path
// in the generated index HTML which breaks the client loader in some
// browsers. This plugin rewrites that path to use forward slashes.
export default defineConfig({
  plugins: [
    {
      name: 'fix-sanity-runtime-path',
      transformIndexHtml(html) {
        // Remove stray carriage returns and backslashes that can appear
        // in the generated runtime path on Windows environments.
        let fixed = html.replace(/\r/g, '')
        fixed = fixed.replace(/src="\/\.sanity\\+runtime/gi, 'src="/.sanity/runtime')
        return fixed
      },
    },
  ],
})

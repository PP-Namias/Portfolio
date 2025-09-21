import { defineConfig } from 'vitest/config';
import { getViteConfig } from 'astro/config';

export default defineConfig(
  getViteConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./tests/setup.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'tests/',
          '**/*.d.ts',
          '**/*.config.*',
          'dist/',
          '.astro/',
        ],
      },
      include: ['tests/integration/**/*.{test,spec}.{js,ts}'],
      exclude: ['tests/unit/**/*', 'tests/e2e/**/*'],
    },
  })
);
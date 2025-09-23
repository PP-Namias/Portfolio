import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	resolve: {
		alias: {
			"@components": resolve(__dirname, "./src/components"),
			"@assets": resolve(__dirname, "./src/assets"),
			"@constants": resolve(__dirname, "./src/constants"),
			"@utils": resolve(__dirname, "./src/utils"),
			"@i18n": resolve(__dirname, "./src/i18n"),
			"@layouts": resolve(__dirname, "./src/layouts"),
			"@": resolve(__dirname, "./src"),
			"astro:content": resolve(__dirname, "./tests/mocks/astro-content.ts"),
		},
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./tests/setup.ts"],
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: [
				"node_modules/",
				"tests/",
				"**/*.d.ts",
				"**/*.config.*",
				"dist/",
				".astro/",
			],
		},
		include: ["tests/unit/**/*.{test,spec}.{js,ts}"],
		exclude: ["tests/e2e/**/*"],
	},
});

import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools(),
		...(process.env.VITEST
			? []
			: [cloudflare({ viteEnvironment: { name: "ssr" } })]),
		tailwindcss(),
		tanstackStart({
			router: {
				entry: "frontend/config/router.tsx",
				routesDirectory: "frontend/routes",
				generatedRouteTree: "frontend/config/routeTree.gen.ts",
			},
		}),
		viteReact(),
	],
});

export default config;

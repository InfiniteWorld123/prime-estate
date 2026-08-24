import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ThemeProvider } from "@/frontend/components/theme/ThemeProvider";
import { LanguageProvider } from "@/frontend/i18n/LanguageProvider";
import type { RouterContextType } from "../config/RouterContextType";
import appCss from "../config/styles.css?url";

export const Route = createRootRouteWithContext<RouterContextType>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Prime Estate | Immobilien in Thüringen kaufen und mieten",
			},
			{
				name: "description",
				content:
					"Entdecken Sie Immobilien zum Kauf und zur Miete in Erfurt, Thüringen und ganz Deutschland.",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="de">
			<head>
				<HeadContent />
			</head>
			<body>
				<LanguageProvider>
					<ThemeProvider>{children}</ThemeProvider>
				</LanguageProvider>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}

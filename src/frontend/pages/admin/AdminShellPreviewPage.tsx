import { Building2, FileText } from "lucide-react";
import { adminShellCopy } from "@/frontend/components/layout/admin/admin-shell.copy";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

type AdminShellPreviewPageProps = {
	page: "listings" | "properties";
};

export function AdminShellPreviewPage({ page }: AdminShellPreviewPageProps) {
	const { language } = useLanguage();
	const copy = adminShellCopy[language];
	const isPropertiesPage = page === "properties";
	const Icon = isPropertiesPage ? Building2 : FileText;
	const title = isPropertiesPage ? copy.properties : copy.listings;
	const description = isPropertiesPage
		? copy.propertiesDescription
		: copy.listingsDescription;

	return (
		<div className="mx-auto w-full max-w-[96rem] px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
			<header className="max-w-3xl">
				<div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
					<Icon aria-hidden="true" className="size-4" />
					{copy.administration}
				</div>
				<h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
					{title}
				</h1>
				<p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
					{description}
				</p>
			</header>

			<section className="relative mt-8 min-h-[28rem] overflow-hidden rounded-lg border bg-background">
				<div
					aria-hidden="true"
					className="absolute inset-0 opacity-[0.035] dark:opacity-[0.055]"
					style={{
						backgroundImage:
							"linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
						backgroundSize: "32px 32px",
					}}
				/>
				<div className="relative grid min-h-[28rem] place-items-center p-6 text-center">
					<div className="max-w-md">
						<span className="mx-auto grid size-11 place-items-center rounded-md border bg-muted/45 text-primary">
							<Icon aria-hidden="true" className="size-5" />
						</span>
						<h2 className="mt-4 font-heading text-base font-semibold">
							{copy.workspaceReady}
						</h2>
						<p className="mt-2 text-sm leading-6 text-muted-foreground">
							{copy.workspaceDescription}
						</p>
					</div>
				</div>
			</section>
		</div>
	);
}

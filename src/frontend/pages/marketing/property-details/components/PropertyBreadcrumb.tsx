import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

type PropertyBreadcrumbProps = {
	title: string;
};

export function PropertyBreadcrumb({ title }: PropertyBreadcrumbProps) {
	const { copy } = useLanguage();

	return (
		<nav
			aria-label={copy.propertyDetails.breadcrumb.label}
			className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground"
		>
			<Link className="transition-colors hover:text-foreground" to="/">
				{copy.propertyDetails.breadcrumb.home}
			</Link>
			<ChevronRight aria-hidden="true" className="size-4 shrink-0" />
			<Link
				className="transition-colors hover:text-foreground"
				to="/properties"
			>
				{copy.propertyDetails.breadcrumb.properties}
			</Link>
			<ChevronRight aria-hidden="true" className="size-4 shrink-0" />
			<span aria-current="page" className="truncate text-foreground">
				{title}
			</span>
		</nav>
	);
}

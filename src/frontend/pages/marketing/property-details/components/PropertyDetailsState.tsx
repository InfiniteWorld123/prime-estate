import { Link } from "@tanstack/react-router";
import { AlertTriangle, House } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";

type PropertyDetailsStateProps = {
	onRetry?: () => void;
	type: "error" | "not-found";
};

export function PropertyDetailsState({
	onRetry,
	type,
}: PropertyDetailsStateProps) {
	const { copy } = useLanguage();
	const stateCopy = copy.propertyDetails.states;
	const isNotFound = type === "not-found";

	return (
		<section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center py-20 text-center">
			<span className="grid size-14 place-items-center rounded-full bg-muted text-muted-foreground">
				{isNotFound ? (
					<House aria-hidden="true" className="size-7" />
				) : (
					<AlertTriangle aria-hidden="true" className="size-7" />
				)}
			</span>
			<h1 className="mt-6 text-3xl font-semibold tracking-tight">
				{isNotFound ? stateCopy.notFoundTitle : stateCopy.errorTitle}
			</h1>
			<p className="mt-3 max-w-md leading-7 text-muted-foreground">
				{isNotFound
					? stateCopy.notFoundDescription
					: stateCopy.errorDescription}
			</p>
			<div className="mt-7 flex flex-wrap justify-center gap-3">
				{!isNotFound && onRetry ? (
					<Button onClick={onRetry} type="button">
						{stateCopy.retry}
					</Button>
				) : null}
				<Button asChild variant={isNotFound ? "default" : "outline"}>
					<Link to="/properties">{stateCopy.backToProperties}</Link>
				</Button>
			</div>
		</section>
	);
}

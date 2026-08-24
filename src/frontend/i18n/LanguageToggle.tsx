import { Check, Languages } from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu";
import { useLanguage } from "./LanguageProvider";

export function LanguageToggle() {
	const { language, setLanguage, copy } = useLanguage();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					aria-label={copy.language.label}
					className="gap-1.5 px-2"
					type="button"
					variant="ghost"
				>
					<Languages aria-hidden="true" />
					<span className="text-xs font-semibold uppercase">{language}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-40">
				<DropdownMenuItem onSelect={() => setLanguage("de")}>
					<span>Deutsch</span>
					{language === "de" ? (
						<Check aria-hidden="true" className="ml-auto" />
					) : null}
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => setLanguage("en")}>
					<span>English</span>
					{language === "en" ? (
						<Check aria-hidden="true" className="ml-auto" />
					) : null}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

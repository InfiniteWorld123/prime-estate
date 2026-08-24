import { Check, Laptop, Moon, Sun, SunMoon } from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const { copy } = useLanguage();
	const themeOptions = [
		{ value: "light", label: copy.theme.light, icon: Sun },
		{ value: "dark", label: copy.theme.dark, icon: Moon },
		{ value: "system", label: copy.theme.system, icon: Laptop },
	] as const;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					aria-label={copy.theme.label}
					size="icon"
					type="button"
					variant="ghost"
				>
					<SunMoon aria-hidden="true" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-40">
				<DropdownMenuLabel>{copy.theme.heading}</DropdownMenuLabel>
				<DropdownMenuSeparator />

				{themeOptions.map((option) => {
					const Icon = option.icon;
					const isSelected = theme === option.value;

					return (
						<DropdownMenuItem
							key={option.value}
							onSelect={() => setTheme(option.value)}
						>
							<Icon aria-hidden="true" />
							<span>{option.label}</span>

							{isSelected ? (
								<Check aria-hidden="true" className="ml-auto" />
							) : null}
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

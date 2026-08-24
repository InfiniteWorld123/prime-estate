import { Button } from "@/frontend/components/ui/button";

export function AuthSocialButton({
	comingLater,
	label,
	separator,
}: {
	comingLater: string;
	label: string;
	separator: string;
}) {
	return (
		<div>
			<div className="relative my-6">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t" />
				</div>
				<div className="relative flex justify-center">
					<span className="bg-background px-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
						{separator}
					</span>
				</div>
			</div>
			<Button
				className="h-11 w-full justify-between px-4"
				disabled
				type="button"
				variant="outline"
			>
				<span className="flex items-center gap-3">
					<span className="grid size-5 place-items-center rounded-full border text-[0.65rem] font-bold">
						G
					</span>
					{label}
				</span>
				<span className="text-xs font-normal text-muted-foreground">
					{comingLater}
				</span>
			</Button>
		</div>
	);
}

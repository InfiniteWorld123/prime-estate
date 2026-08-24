import { ImageOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/frontend/lib/utils";

type PropertyImageProps = {
	alt: string | null;
	className?: string;
	fallbackClassName?: string;
	fallbackLabel: string;
	loading?: "eager" | "lazy";
	src: string;
};

export function PropertyImage({
	alt,
	className,
	fallbackClassName,
	fallbackLabel,
	loading = "lazy",
	src,
}: PropertyImageProps) {
	const [failedSource, setFailedSource] = useState<string | null>(null);
	const hasError = failedSource === src;

	if (hasError) {
		return (
			<div
				aria-label={fallbackLabel}
				className={cn(
					"grid h-full w-full place-items-center bg-muted text-muted-foreground",
					fallbackClassName,
				)}
				role="img"
			>
				<div className="flex flex-col items-center gap-2 text-center">
					<ImageOff aria-hidden="true" className="size-7" />
					<span className="text-sm font-medium">{fallbackLabel}</span>
				</div>
			</div>
		);
	}

	return (
		<img
			alt={alt ?? ""}
			className={className}
			decoding="async"
			loading={loading}
			onError={() => setFailedSource(src)}
			src={src}
		/>
	);
}

import { ImagePlus, Upload } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/frontend/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/frontend/components/ui/dialog";
import type { AdminListingDetailRecord } from "@/frontend/features/listings/admin-listing.types";
import { cn } from "@/frontend/lib/utils";
import type { AdminListingDetailsCopy } from "../admin-listing-details.copy";

type SelectedCover = { altText: string | null; id: string; url: string };

type QuickCoverDialogProps = {
	copy: AdminListingDetailsCopy;
	listing: AdminListingDetailRecord;
	onSelect: (cover: SelectedCover) => void;
	trigger: React.ReactNode;
};

const acceptedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export function QuickCoverDialog({
	copy,
	listing,
	onSelect,
	trigger,
}: QuickCoverDialogProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [open, setOpen] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [selected, setSelected] = useState<SelectedCover | null>(null);
	const [error, setError] = useState("");

	const chooseFile = (file: File | undefined) => {
		setError("");
		if (!file) return;
		if (!acceptedTypes.has(file.type)) {
			setError(copy.quickCoverInvalidType);
			return;
		}
		if (file.size > 10 * 1024 * 1024) {
			setError(copy.quickCoverTooLarge);
			return;
		}
		setSelected({
			altText: listing.title,
			id: `quick-cover-${crypto.randomUUID()}`,
			url: URL.createObjectURL(file),
		});
	};

	const save = () => {
		if (!selected) return;
		onSelect(selected);
		setOpen(false);
		setSelected(null);
		setError("");
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>{copy.quickCoverTitle}</DialogTitle>
					<DialogDescription>{copy.quickCoverDescription}</DialogDescription>
				</DialogHeader>

				{listing.images.length > 0 ? (
					<div>
						<p className="text-sm font-semibold">{copy.quickCoverExisting}</p>
						<div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
							{listing.images.map((image) => (
								<button
									aria-pressed={selected?.id === image.id}
									className={cn(
										"overflow-hidden rounded-lg border p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring",
										selected?.id === image.id &&
											"border-primary ring-2 ring-primary/20",
									)}
									key={image.id}
									onClick={() => setSelected(image)}
									type="button"
								>
									<img
										alt={image.altText ?? ""}
										className="aspect-[4/3] w-full rounded-md object-cover"
										src={image.url}
									/>
								</button>
							))}
						</div>
					</div>
				) : null}

				<button
					className={cn(
						"grid min-h-44 place-items-center rounded-lg border border-dashed p-6 text-center outline-none transition-colors",
						"hover:border-primary/55 hover:bg-primary/3 focus-visible:ring-2 focus-visible:ring-ring",
						isDragging && "border-primary bg-primary/5",
					)}
					onClick={() => inputRef.current?.click()}
					onDragEnter={(event) => {
						event.preventDefault();
						setIsDragging(true);
					}}
					onDragLeave={() => setIsDragging(false)}
					onDragOver={(event) => event.preventDefault()}
					onDrop={(event) => {
						event.preventDefault();
						setIsDragging(false);
						chooseFile(event.dataTransfer.files[0]);
					}}
					type="button"
				>
					{selected?.id.startsWith("quick-cover-") ? (
						<img
							alt=""
							className="max-h-52 rounded-md object-contain"
							src={selected.url}
						/>
					) : (
						<span>
							<Upload className="mx-auto size-6 text-primary" />
							<strong className="mt-3 block text-sm">
								{copy.quickCoverDrop}
							</strong>
							<span className="mt-1 block text-xs text-muted-foreground">
								{copy.quickCoverFormats}
							</span>
						</span>
					)}
				</button>
				<input
					accept="image/jpeg,image/png,image/webp"
					className="sr-only"
					onChange={(event) => chooseFile(event.target.files?.[0])}
					ref={inputRef}
					type="file"
				/>
				{error ? <p className="text-sm text-destructive">{error}</p> : null}

				<DialogFooter>
					<Button
						onClick={() => setOpen(false)}
						type="button"
						variant="outline"
					>
						{copy.cancel}
					</Button>
					<Button disabled={!selected} onClick={save} type="button">
						<ImagePlus />
						{copy.quickCoverSave}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

import {
	ArrowLeft,
	ArrowRight,
	GripVertical,
	ImagePlus,
	Star,
	Trash2,
	Upload,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

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
import { Input } from "@/frontend/components/ui/input";
import type { AdminPropertyImage } from "@/frontend/features/listings/admin-listing.types";
import { cn } from "@/frontend/lib/utils";
import type { AdminListingDetailsCopy } from "../admin-listing-details.copy";
import {
	MAX_PROPERTY_IMAGE_BYTES,
	MAX_PROPERTY_IMAGES,
	movePropertyImage,
	movePropertyImageTo,
	PROPERTY_IMAGE_TYPES,
	removePropertyImage,
	setPropertyImageCover,
} from "../admin-listing-media.model";

type PropertyImagesDialogProps = {
	copy: AdminListingDetailsCopy;
	images: AdminPropertyImage[];
	onSave: (images: AdminPropertyImage[]) => void;
	trigger: React.ReactNode;
};

export function PropertyImagesDialog({
	copy,
	images,
	onSave,
	trigger,
}: PropertyImagesDialogProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const createdUrlsRef = useRef(new Set<string>());
	const [open, setOpen] = useState(false);
	const [draftImages, setDraftImages] = useState<AdminPropertyImage[]>([]);
	const [errors, setErrors] = useState<string[]>([]);
	const [isDraggingFiles, setIsDraggingFiles] = useState(false);
	const [draggedImageId, setDraggedImageId] = useState<string | null>(null);

	const isDirty = useMemo(
		() => JSON.stringify(draftImages) !== JSON.stringify(images),
		[draftImages, images],
	);

	useEffect(
		() => () => {
			for (const url of createdUrlsRef.current) URL.revokeObjectURL(url);
		},
		[],
	);

	const discardCreatedUrls = () => {
		for (const url of createdUrlsRef.current) URL.revokeObjectURL(url);
		createdUrlsRef.current.clear();
	};

	const handleOpenChange = (nextOpen: boolean) => {
		if (nextOpen) {
			setDraftImages(images.map((image) => ({ ...image })));
			setErrors([]);
		} else {
			discardCreatedUrls();
			setDraggedImageId(null);
			setIsDraggingFiles(false);
		}
		setOpen(nextOpen);
	};

	const addFiles = (files: FileList | File[]) => {
		const incoming = Array.from(files);
		const remaining = MAX_PROPERTY_IMAGES - draftImages.length;
		const accepted: File[] = [];
		const nextErrors: string[] = [];

		for (const file of incoming) {
			if (!PROPERTY_IMAGE_TYPES.has(file.type)) {
				nextErrors.push(`${file.name}: ${copy.imageManager.invalidType}`);
			} else if (file.size > MAX_PROPERTY_IMAGE_BYTES) {
				nextErrors.push(`${file.name}: ${copy.imageManager.tooLarge}`);
			} else if (accepted.length >= remaining) {
				nextErrors.push(`${file.name}: ${copy.imageManager.tooMany}`);
			} else {
				accepted.push(file);
			}
		}

		setErrors([...new Set(nextErrors)]);
		if (accepted.length === 0) return;
		const hasCover = draftImages.some((image) => image.isCover);
		const addedImages = accepted.map((file, index) => {
			const url = URL.createObjectURL(file);
			createdUrlsRef.current.add(url);
			return {
				altText: null,
				id: `property-image-${crypto.randomUUID()}`,
				isCover: !hasCover && index === 0,
				url,
			};
		});
		setDraftImages((current) => [...current, ...addedImages]);
	};

	const removeImage = (id: string) => {
		const removing = draftImages.find((image) => image.id === id);
		if (removing && createdUrlsRef.current.has(removing.url)) {
			URL.revokeObjectURL(removing.url);
			createdUrlsRef.current.delete(removing.url);
		}
		setDraftImages((current) => removePropertyImage(current, id));
	};

	const save = () => {
		onSave(draftImages);
		createdUrlsRef.current.clear();
		setOpen(false);
		setErrors([]);
	};

	return (
		<Dialog onOpenChange={handleOpenChange} open={open}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="flex max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl">
				<DialogHeader className="shrink-0 p-4 pr-12 sm:p-6 sm:pr-14">
					<div className="flex flex-wrap items-start justify-between gap-3">
						<div className="max-w-2xl">
							<DialogTitle>{copy.imageManager.title}</DialogTitle>
							<DialogDescription className="mt-2 leading-6">
								{copy.imageManager.description}
							</DialogDescription>
						</div>
						<span className="rounded-md border bg-muted/35 px-2.5 py-1 font-mono text-xs font-semibold text-muted-foreground">
							{copy.imageManager.capacity(draftImages.length)}
						</span>
					</div>
				</DialogHeader>

				<div className="min-h-0 flex-1 overflow-y-auto border-y px-4 py-5 sm:px-6">
					<button
						aria-label={copy.imageManager.dropIdle}
						className={cn(
							"grid min-h-36 w-full place-items-center rounded-lg border border-dashed bg-muted/15 p-5 text-center outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
							isDraggingFiles && "border-primary bg-primary/5",
						)}
						disabled={draftImages.length >= MAX_PROPERTY_IMAGES}
						onClick={() => fileInputRef.current?.click()}
						onDragEnter={(event) => {
							event.preventDefault();
							setIsDraggingFiles(true);
						}}
						onDragLeave={(event) => {
							event.preventDefault();
							if (event.currentTarget === event.target)
								setIsDraggingFiles(false);
						}}
						onDragOver={(event) => event.preventDefault()}
						onDrop={(event) => {
							event.preventDefault();
							setIsDraggingFiles(false);
							addFiles(event.dataTransfer.files);
						}}
						type="button"
					>
						<span>
							<span className="mx-auto grid size-10 place-items-center rounded-md border bg-background text-primary">
								<Upload aria-hidden="true" className="size-5" />
							</span>
							<strong className="mt-3 block text-sm">
								{isDraggingFiles
									? copy.imageManager.dropActive
									: copy.imageManager.dropIdle}
							</strong>
							<span className="mt-1 block text-xs leading-5 text-muted-foreground">
								{copy.imageManager.supported}
							</span>
							<span className="mx-auto mt-3 inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground">
								<ImagePlus aria-hidden="true" />
								{copy.imageManager.addFiles}
							</span>
						</span>
					</button>
					<input
						accept="image/jpeg,image/png,image/webp"
						className="sr-only"
						disabled={draftImages.length >= MAX_PROPERTY_IMAGES}
						multiple
						onChange={(event) => {
							if (event.target.files) addFiles(event.target.files);
							event.target.value = "";
						}}
						ref={fileInputRef}
						type="file"
					/>

					{errors.length > 0 ? (
						<div
							className="mt-3 space-y-1 text-sm text-destructive"
							role="alert"
						>
							{errors.map((error) => (
								<p key={error}>{error}</p>
							))}
						</div>
					) : null}

					{draftImages.length === 0 ? (
						<div className="mt-5 rounded-lg border bg-background p-6 text-center">
							<p className="font-medium">{copy.imageManager.emptyTitle}</p>
							<p className="mx-auto mt-1 max-w-lg text-sm leading-6 text-muted-foreground">
								{copy.imageManager.emptyDescription}
							</p>
						</div>
					) : (
						<div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{draftImages.map((image, index) => (
								<article
									className="overflow-hidden rounded-lg border bg-background"
									draggable
									key={image.id}
									onDragOver={(event) => event.preventDefault()}
									onDragStart={() => setDraggedImageId(image.id)}
									onDrop={() => {
										if (!draggedImageId) return;
										setDraftImages((current) =>
											movePropertyImageTo(current, draggedImageId, image.id),
										);
										setDraggedImageId(null);
									}}
								>
									<div className="relative aspect-[4/3] overflow-hidden bg-muted">
										<img
											alt={image.altText ?? ""}
											className="size-full object-cover"
											src={image.url}
										/>
										{image.isCover ? (
											<span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
												<Star aria-hidden="true" className="size-3" />
												{copy.imageManager.cover}
											</span>
										) : null}
										<span className="absolute right-2 top-2 rounded-md bg-background/90 px-2 py-1 font-mono text-[11px] font-semibold backdrop-blur">
											{index + 1}
										</span>
									</div>

									<div className="space-y-3 p-3">
										<div className="flex items-center gap-2">
											<GripVertical
												aria-hidden="true"
												className="size-4 text-muted-foreground"
											/>
											<span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">
												{copy.imageManager.dragHint}
											</span>
											<Button
												aria-label={copy.imageManager.movePrevious}
												disabled={index === 0}
												onClick={() =>
													setDraftImages((current) =>
														movePropertyImage(current, image.id, -1),
													)
												}
												size="icon-sm"
												type="button"
												variant="ghost"
											>
												<ArrowLeft />
											</Button>
											<Button
												aria-label={copy.imageManager.moveNext}
												disabled={index === draftImages.length - 1}
												onClick={() =>
													setDraftImages((current) =>
														movePropertyImage(current, image.id, 1),
													)
												}
												size="icon-sm"
												type="button"
												variant="ghost"
											>
												<ArrowRight />
											</Button>
										</div>

										<label
											className="block text-xs font-medium"
											htmlFor={`image-alt-${image.id}`}
										>
											{copy.imageManager.altText}
											<Input
												className="mt-1.5"
												id={`image-alt-${image.id}`}
												onChange={(event) =>
													setDraftImages((current) =>
														current.map((item) =>
															item.id === image.id
																? { ...item, altText: event.target.value }
																: item,
														),
													)
												}
												placeholder={copy.imageManager.altPlaceholder}
												value={image.altText ?? ""}
											/>
										</label>

										<div className="flex items-center justify-between gap-2 border-t pt-3">
											<Button
												disabled={image.isCover}
												onClick={() =>
													setDraftImages((current) =>
														setPropertyImageCover(current, image.id),
													)
												}
												size="sm"
												type="button"
												variant="outline"
											>
												<Star />
												{image.isCover
													? copy.imageManager.cover
													: copy.imageManager.setCover}
											</Button>
											<Button
												aria-label={copy.imageManager.remove}
												onClick={() => removeImage(image.id)}
												size="icon-sm"
												type="button"
												variant="destructive"
											>
												<Trash2 />
											</Button>
										</div>
									</div>
								</article>
							))}
						</div>
					)}
				</div>

				<DialogFooter className="mx-0 mb-0 shrink-0 rounded-none px-4 py-3 sm:px-6">
					<p className="mr-auto self-center text-xs text-muted-foreground">
						{copy.imageManager.unsaved}
					</p>
					<Button
						onClick={() => handleOpenChange(false)}
						type="button"
						variant="outline"
					>
						{copy.cancel}
					</Button>
					<Button disabled={!isDirty} onClick={save} type="button">
						{copy.imageManager.save}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

import {
	ArrowLeft,
	ArrowRight,
	CheckCircle2,
	CircleAlert,
	GripVertical,
	ImagePlus,
	LoaderCircle,
	MoreHorizontal,
	Star,
	Trash2,
	Upload,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/frontend/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/frontend/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu";
import { Textarea } from "@/frontend/components/ui/textarea";
import {
	type PropertyImageDraft,
	usePropertyImagesSetupPage,
} from "@/frontend/hooks/pages/usePropertyImagesSetupPage";
import { cn } from "@/frontend/lib/utils";
import { PropertySetupJourney } from "../setup/PropertySetupJourney";

export function PropertyImagesSetupPage() {
	const page = usePropertyImagesSetupPage();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [altText, setAltText] = useState("");

	useEffect(() => setAltText(page.altImage?.altText ?? ""), [page.altImage]);

	const handleFiles = (files: FileList | null) => {
		if (files) page.addFiles(files);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	if (page.isLoading) {
		return (
			<div className="grid min-h-[60vh] place-items-center px-4 py-10">
				<output className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
					<LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" />
					{page.copy.images.uploading}
				</output>
			</div>
		);
	}

	if (page.loadError) {
		return (
			<div className="grid min-h-[60vh] place-items-center px-4 py-10 text-center">
				<div>
					<CircleAlert className="mx-auto size-6 text-destructive" />
					<p className="mt-3 font-heading text-lg font-semibold">
						{page.copy.common.loadError}
					</p>
					<p className="mt-1 text-sm text-muted-foreground">{page.loadError}</p>
					<Button className="mt-4" onClick={() => void page.refetch()}>
						{page.copy.common.retry}
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
			<header className="max-w-3xl">
				<p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
					{page.copy.common.administration}
				</p>
				<h1 className="mt-3 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
					{page.copy.images.title}
				</h1>
				<p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
					{page.copy.images.description}
				</p>
			</header>

			<div className="mt-7">
				<PropertySetupJourney current="images" labels={page.copy.journey} />
			</div>

			<section className="mt-7 rounded-lg border bg-background p-4 sm:p-6">
				<button
					aria-label={page.copy.images.dropIdle}
					className={cn(
						"grid min-h-52 w-full place-items-center rounded-lg border border-dashed p-6 text-center transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
						page.isDragging
							? "border-primary bg-primary/5"
							: "border-border bg-muted/20",
					)}
					onDragEnter={(event) => {
						event.preventDefault();
						page.setIsDragging(true);
					}}
					onDragLeave={(event) => {
						event.preventDefault();
						if (event.currentTarget === event.target) page.setIsDragging(false);
					}}
					onDragOver={(event) => event.preventDefault()}
					onDrop={(event) => {
						event.preventDefault();
						page.setIsDragging(false);
						handleFiles(event.dataTransfer.files);
					}}
					onClick={() => fileInputRef.current?.click()}
					type="button"
				>
					<span className="max-w-md">
						<span className="mx-auto grid size-11 place-items-center rounded-md border bg-background text-primary">
							<Upload aria-hidden="true" className="size-5" />
						</span>
						<span className="mt-4 block font-semibold">
							{page.isDragging
								? page.copy.images.dropActive
								: page.copy.images.dropIdle}
						</span>
						<span className="mt-1 block text-sm text-muted-foreground">
							{page.copy.images.supported}
						</span>
						<span className="mx-auto mt-5 inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground">
							<ImagePlus aria-hidden="true" />
							{page.copy.images.addFiles}
						</span>
					</span>
				</button>
				<input
					accept="image/jpeg,image/png,image/webp"
					className="sr-only"
					disabled={page.images.length >= 30}
					multiple
					onChange={(event) => handleFiles(event.target.files)}
					ref={fileInputRef}
					type="file"
				/>

				{page.rejections.length > 0 ? (
					<div className="mt-4 space-y-2" role="alert">
						{page.rejections.map((rejection) => (
							<div
								className="flex items-start gap-3 rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-sm"
								key={rejection.id}
							>
								<CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
								<p className="min-w-0 flex-1">
									<strong className="block truncate">{rejection.name}</strong>
									<span className="text-muted-foreground">
										{rejection.message}
									</span>
								</p>
								<Button
									aria-label={page.copy.images.remove}
									onClick={() => page.dismissRejection(rejection.id)}
									size="icon-sm"
									type="button"
									variant="ghost"
								>
									<X aria-hidden="true" />
								</Button>
							</div>
						))}
					</div>
				) : null}
			</section>

			{page.operationError ? (
				<p
					className="mt-5 rounded-lg border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive"
					role="alert"
				>
					{page.operationError}
				</p>
			) : null}

			<section className="mt-7" aria-labelledby="image-collection-title">
				<div className="flex items-end justify-between gap-4">
					<div>
						<h2
							id="image-collection-title"
							className="font-heading text-lg font-semibold"
						>
							{page.copy.images.title}
						</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							{page.copy.images.capacity(page.images.length)}
						</p>
					</div>
				</div>

				{page.images.length === 0 ? (
					<div className="mt-4 grid min-h-44 place-items-center rounded-lg border bg-background p-6 text-center text-sm text-muted-foreground">
						{page.copy.images.empty}
					</div>
				) : (
					<div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{page.images.map((image, index) => (
							<ImageItem
								copy={page.copy.images}
								image={image}
								index={index}
								isLast={index === page.images.length - 1}
								key={image.id}
								onDelete={() => page.setDeleteImageId(image.id)}
								onDragStart={() => page.setDraggedImageId(image.id)}
								onDrop={() => page.moveToImage(image.id)}
								onEditAlt={() => page.setAltImageId(image.id)}
								onMakeCover={() => void page.setCover(image.id)}
								onMove={(direction) => page.moveImage(image.id, direction)}
								onRetry={() => page.retry(image.id)}
							/>
						))}
					</div>
				)}
			</section>

			<footer className="sticky bottom-3 z-10 mt-8 flex flex-col-reverse gap-3 rounded-lg border bg-background/95 p-3 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
				<div>
					<Button onClick={page.finishLater} type="button" variant="outline">
						{page.copy.common.finishLater}
					</Button>
					<p className="mt-1 text-xs text-muted-foreground">
						{page.copy.common.statusNotice}
					</p>
				</div>
				<Button
					disabled={page.isBusy}
					onClick={page.navigateToFeatures}
					type="button"
				>
					{page.copy.images.continue}
					<ArrowRight aria-hidden="true" />
				</Button>
			</footer>

			<Dialog
				open={Boolean(page.altImage)}
				onOpenChange={(open) => !open && page.setAltImageId(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{page.copy.images.altTitle}</DialogTitle>
						<DialogDescription>
							{page.copy.images.altDescription}
						</DialogDescription>
					</DialogHeader>
					<label
						className="space-y-2 font-medium text-sm"
						htmlFor="property-image-alt-text"
					>
						{page.copy.images.altLabel}
						<Textarea
							className="mt-2"
							id="property-image-alt-text"
							onChange={(event) => setAltText(event.target.value)}
							value={altText}
						/>
					</label>
					<DialogFooter>
						<Button onClick={() => page.setAltImageId(null)} variant="outline">
							{page.copy.images.cancel}
						</Button>
						<Button onClick={() => void page.saveAltText(altText)}>
							{page.copy.images.save}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Dialog
				open={Boolean(page.deleteImageDraft)}
				onOpenChange={(open) => !open && page.setDeleteImageId(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{page.copy.images.deleteTitle}</DialogTitle>
						<DialogDescription>
							{page.copy.images.deleteDescription}{" "}
							{page.deleteImageDraft?.isCover
								? page.copy.images.deleteCover
								: null}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							onClick={() => page.setDeleteImageId(null)}
							variant="outline"
						>
							{page.copy.images.cancel}
						</Button>
						<Button
							onClick={() => void page.deleteImage()}
							variant="destructive"
						>
							{page.copy.images.delete}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

type ImageItemProps = {
	copy: ReturnType<typeof usePropertyImagesSetupPage>["copy"]["images"];
	image: PropertyImageDraft;
	index: number;
	isLast: boolean;
	onDelete: () => void;
	onDragStart: () => void;
	onDrop: () => void;
	onEditAlt: () => void;
	onMakeCover: () => void;
	onMove: (direction: -1 | 1) => void;
	onRetry: () => void;
};

function ImageItem({ copy, image, index, isLast, ...actions }: ImageItemProps) {
	return (
		<article
			className="overflow-hidden rounded-lg border bg-background"
			draggable={image.status === "uploaded"}
			onDragOver={(event) => event.preventDefault()}
			onDragStart={actions.onDragStart}
			onDrop={actions.onDrop}
		>
			<div className="relative aspect-[4/3] overflow-hidden bg-muted">
				<img
					alt={image.altText}
					className="size-full object-cover"
					src={image.url}
				/>
				{image.isCover ? (
					<span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
						<Star className="size-3" /> {copy.cover}
					</span>
				) : null}
				{image.status !== "uploaded" ? (
					<div className="absolute inset-0 grid place-items-center bg-background/80 p-4 text-center backdrop-blur-sm">
						<div>
							{image.status === "failed" ? (
								<CircleAlert className="mx-auto size-5 text-destructive" />
							) : (
								<LoaderCircle className="mx-auto size-5 animate-spin text-primary" />
							)}
							<p className="mt-2 text-sm font-medium">
								{image.status === "failed"
									? copy.failed
									: image.status === "waiting"
										? copy.waiting
										: copy.uploading}
							</p>
							{image.status === "failed" ? (
								<Button
									className="mt-3"
									onClick={actions.onRetry}
									size="sm"
									variant="outline"
								>
									{copy.retry}
								</Button>
							) : null}
						</div>
					</div>
				) : null}
			</div>
			<div className="flex items-center gap-2 p-3">
				<GripVertical
					aria-hidden="true"
					className="size-4 text-muted-foreground"
				/>
				<p className="min-w-0 flex-1 truncate text-sm font-medium">
					{image.name}
				</p>
				<div className="flex items-center">
					<Button
						aria-label={copy.movePrevious}
						disabled={index === 0 || image.status !== "uploaded"}
						onClick={() => actions.onMove(-1)}
						size="icon-sm"
						variant="ghost"
					>
						<ArrowLeft />
					</Button>
					<Button
						aria-label={copy.moveNext}
						disabled={isLast || image.status !== "uploaded"}
						onClick={() => actions.onMove(1)}
						size="icon-sm"
						variant="ghost"
					>
						<ArrowRight />
					</Button>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button aria-label="Image actions" size="icon-sm" variant="ghost">
							<MoreHorizontal />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							disabled={image.status !== "uploaded"}
							onSelect={actions.onEditAlt}
						>
							{copy.altTitle}
						</DropdownMenuItem>
						<DropdownMenuItem
							disabled={image.isCover || image.status !== "uploaded"}
							onSelect={actions.onMakeCover}
						>
							{copy.makeCover}
						</DropdownMenuItem>
						<DropdownMenuItem onSelect={actions.onDelete} variant="destructive">
							<Trash2 /> {copy.delete}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			{image.status === "uploaded" ? (
				<div className="flex items-center gap-2 border-t px-3 py-2 text-xs text-muted-foreground">
					<CheckCircle2 className="size-3.5 text-emerald-600" />
					{copy.uploaded}
				</div>
			) : null}
		</article>
	);
}

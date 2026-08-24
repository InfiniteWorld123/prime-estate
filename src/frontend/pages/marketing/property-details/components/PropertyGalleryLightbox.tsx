import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/frontend/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/frontend/components/ui/dialog";
import { PropertyImage } from "@/frontend/features/listings/components/PropertyImage";
import type { PropertyDetailImage } from "@/frontend/features/listings/listing.types";

type PropertyGalleryLightboxProps = {
	activeIndex: number;
	closeLabel: string;
	fallbackLabel: string;
	galleryTitle: string;
	images: PropertyDetailImage[];
	nextLabel: string;
	onActiveIndexChange: (index: number) => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	previousLabel: string;
};

export function PropertyGalleryLightbox({
	activeIndex,
	closeLabel,
	fallbackLabel,
	galleryTitle,
	images,
	nextLabel,
	onActiveIndexChange,
	onOpenChange,
	open,
	previousLabel,
}: PropertyGalleryLightboxProps) {
	const touchStartX = useRef<number | null>(null);

	if (images.length === 0) {
		return null;
	}

	const safeIndex = Math.min(Math.max(activeIndex, 0), images.length - 1);
	const activeImage = images[safeIndex];
	const hasMultipleImages = images.length > 1;

	const showPreviousImage = () => {
		onActiveIndexChange(safeIndex === 0 ? images.length - 1 : safeIndex - 1);
	};

	const showNextImage = () => {
		onActiveIndexChange(safeIndex === images.length - 1 ? 0 : safeIndex + 1);
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent
				className="inset-0 top-0 left-0 h-dvh w-screen max-w-none translate-x-0 translate-y-0 gap-0 rounded-none bg-black p-0 text-white ring-0 sm:max-w-none"
				onKeyDown={(event) => {
					if (!hasMultipleImages) {
						return;
					}

					if (event.key === "ArrowLeft") {
						event.preventDefault();
						showPreviousImage();
					}

					if (event.key === "ArrowRight") {
						event.preventDefault();
						showNextImage();
					}
				}}
				showCloseButton={false}
			>
				<DialogTitle className="sr-only">{galleryTitle}</DialogTitle>

				<DialogDescription className="sr-only">
					{activeImage?.alt ?? galleryTitle}
				</DialogDescription>

				<div
					className="relative flex h-full items-center justify-center px-4 py-16 sm:px-20"
					onTouchEnd={(event) => {
						if (!hasMultipleImages || touchStartX.current === null) {
							return;
						}

						const distance =
							event.changedTouches[0].clientX - touchStartX.current;

						if (distance > 50) {
							showPreviousImage();
						}

						if (distance < -50) {
							showNextImage();
						}

						touchStartX.current = null;
					}}
					onTouchStart={(event) => {
						touchStartX.current = event.touches[0].clientX;
					}}
				>
					<PropertyImage
						alt={activeImage?.alt ?? null}
						className="max-h-full max-w-full object-contain"
						fallbackClassName="max-h-[70vh] max-w-3xl rounded-lg bg-white/10 text-white/70"
						fallbackLabel={fallbackLabel}
						loading="eager"
						src={activeImage?.src ?? ""}
					/>

					<DialogClose asChild>
						<Button
							aria-label={closeLabel}
							className="absolute right-4 top-4 bg-black/45 text-white hover:bg-black/70 hover:text-white"
							size="icon"
							type="button"
							variant="ghost"
						>
							<X aria-hidden="true" />
						</Button>
					</DialogClose>

					{hasMultipleImages ? (
						<>
							<Button
								aria-label={previousLabel}
								className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/45 text-white hover:bg-black/70 hover:text-white sm:left-6"
								onClick={showPreviousImage}
								size="icon"
								type="button"
								variant="ghost"
							>
								<ChevronLeft aria-hidden="true" />
							</Button>

							<Button
								aria-label={nextLabel}
								className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/45 text-white hover:bg-black/70 hover:text-white sm:right-6"
								onClick={showNextImage}
								size="icon"
								type="button"
								variant="ghost"
							>
								<ChevronRight aria-hidden="true" />
							</Button>
						</>
					) : null}

					<div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1.5 text-sm font-medium tabular-nums">
						{safeIndex + 1} / {images.length}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

import { ImageOff } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@/frontend/components/ui/carousel";
import { PropertyImage } from "@/frontend/features/listings/components/PropertyImage";
import type { PropertyDetailImage } from "@/frontend/features/listings/listing.types";
import { PropertyGalleryLightbox } from "../components/PropertyGalleryLightbox";

type PropertyGallerySectionProps = {
	closeLabel: string;
	fallbackLabel: string;
	galleryLabel: string;
	images: PropertyDetailImage[];
	nextLabel: string;
	openImageLabel: string;
	photosLabel: string;
	previousLabel: string;
};

export function PropertyGallerySection({
	closeLabel,
	fallbackLabel,
	galleryLabel,
	images,
	nextLabel,
	openImageLabel,
	photosLabel,
	previousLabel,
}: PropertyGallerySectionProps) {
	const [carouselApi, setCarouselApi] = useState<CarouselApi>();
	const [mobileIndex, setMobileIndex] = useState(0);
	const [lightboxIndex, setLightboxIndex] = useState(0);
	const [isLightboxOpen, setIsLightboxOpen] = useState(false);

	useEffect(() => {
		if (!carouselApi) {
			return;
		}

		const updateMobileIndex = () => {
			setMobileIndex(carouselApi.selectedScrollSnap());
		};

		updateMobileIndex();
		carouselApi.on("select", updateMobileIndex);

		return () => {
			carouselApi.off("select", updateMobileIndex);
		};
	}, [carouselApi]);

	if (images.length === 0) {
		return (
			<section aria-label={galleryLabel}>
				<div className="grid aspect-[16/7] place-items-center rounded-xl bg-muted text-muted-foreground">
					<div className="flex flex-col items-center gap-2 text-center">
						<ImageOff aria-hidden="true" className="size-8" />
						<p className="text-sm font-medium">{fallbackLabel}</p>
					</div>
				</div>
			</section>
		);
	}

	const visibleImages = images.slice(0, 5);
	const hasHiddenImages = images.length > 5;
	const remainingImagesCount = images.length - 4;

	const openLightbox = (index: number) => {
		setLightboxIndex(index);
		setIsLightboxOpen(true);
	};

	return (
		<section aria-label={galleryLabel}>
			<div className="md:hidden">
				<Carousel
					opts={{ align: "start", loop: false }}
					setApi={setCarouselApi}
				>
					<CarouselContent className="-ml-0">
						{images.map((image, index) => (
							<CarouselItem className="pl-0" key={image.id}>
								<button
									aria-label={`${openImageLabel} ${index + 1}`}
									className="relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
									onClick={() => openLightbox(index)}
									type="button"
								>
									<PropertyImage
										alt={image.alt}
										className="h-full w-full object-cover"
										fallbackLabel={fallbackLabel}
										loading={index === 0 ? "eager" : "lazy"}
										src={image.src}
									/>
								</button>
							</CarouselItem>
						))}
					</CarouselContent>

					<div className="absolute bottom-3 right-3 rounded-full bg-black/65 px-3 py-1.5 text-xs font-semibold text-white tabular-nums backdrop-blur-sm">
						{mobileIndex + 1} / {images.length}
					</div>
				</Carousel>
			</div>

			<div className="hidden h-[clamp(28rem,52vw,42rem)] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-xl md:grid">
				{visibleImages.map((image, index) => {
					const isCoverImage = index === 0;
					const isRemainingImagesTrigger =
						hasHiddenImages && index === visibleImages.length - 1;

					return (
						<button
							aria-label={`${openImageLabel} ${
								isRemainingImagesTrigger ? 5 : index + 1
							}`}
							className={
								isCoverImage
									? "group relative col-span-2 row-span-2 overflow-hidden bg-muted focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
									: "group relative overflow-hidden bg-muted focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
							}
							key={image.id}
							onClick={() => openLightbox(isRemainingImagesTrigger ? 4 : index)}
							type="button"
						>
							<PropertyImage
								alt={image.alt}
								className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
								fallbackLabel={fallbackLabel}
								loading={isCoverImage ? "eager" : "lazy"}
								src={image.src}
							/>

							{isRemainingImagesTrigger ? (
								<span className="absolute inset-0 grid place-items-center bg-black/55 text-base font-semibold text-white backdrop-blur-[1px]">
									+{remainingImagesCount} {photosLabel}
								</span>
							) : null}
						</button>
					);
				})}
			</div>

			<PropertyGalleryLightbox
				activeIndex={lightboxIndex}
				closeLabel={closeLabel}
				fallbackLabel={fallbackLabel}
				galleryTitle={galleryLabel}
				images={images}
				nextLabel={nextLabel}
				onActiveIndexChange={setLightboxIndex}
				onOpenChange={setIsLightboxOpen}
				open={isLightboxOpen}
				previousLabel={previousLabel}
			/>
		</section>
	);
}

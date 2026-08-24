import { CalendarDays, MessageSquareText, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/frontend/components/ui/button";
import type { PropertyDetailListing } from "@/frontend/features/listings/listing.types";
import { useLanguage } from "@/frontend/i18n/LanguageProvider";
import { PropertyInquiryDialog } from "../components/PropertyInquiryDialog";

type PropertyContactCardProps = {
	listing: PropertyDetailListing;
};

export function PropertyContactCard({ listing }: PropertyContactCardProps) {
	const { copy } = useLanguage();
	const contactCopy = copy.propertyDetails.contact;
	const [isInquiryOpen, setIsInquiryOpen] = useState(false);
	const isUnavailable = !listing.isAvailable;
	const unavailableMessage =
		listing.archiveOutcome === "RENTED"
			? contactCopy.rentedMessage
			: contactCopy.soldMessage;

	return (
		<>
			<aside className="lg:sticky lg:top-24">
				<div className="rounded-xl border bg-card p-5 shadow-sm sm:p-6">
					<p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
						{contactCopy.eyebrow}
					</p>
					<div className="mt-4 flex items-center gap-3">
						<span className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary">
							<ShieldCheck aria-hidden="true" className="size-5" />
						</span>
						<div>
							<p className="font-semibold">{contactCopy.team}</p>
							<p className="text-sm text-muted-foreground">
								{listing.referenceNumber}
							</p>
						</div>
					</div>

					{isUnavailable ? (
						<div className="mt-6 rounded-lg border border-border bg-muted/60 p-4">
							<p className="font-semibold">{contactCopy.unavailableTitle}</p>
							<p className="mt-2 text-sm leading-6 text-muted-foreground">
								{unavailableMessage}
							</p>
						</div>
					) : (
						<>
							<p className="mt-5 text-sm leading-6 text-muted-foreground">
								{contactCopy.description}
							</p>
							<div className="mt-6 grid gap-3">
								<Button
									className="h-10 w-full"
									onClick={() => setIsInquiryOpen(true)}
									type="button"
								>
									<MessageSquareText aria-hidden="true" />
									{contactCopy.requestInformation}
								</Button>
								<Button
									className="h-10 w-full"
									disabled
									title={contactCopy.bookingLater}
									type="button"
									variant="outline"
								>
									<CalendarDays aria-hidden="true" />
									{contactCopy.bookViewing}
								</Button>
							</div>
						</>
					)}
				</div>
			</aside>

			{!isUnavailable ? (
				<PropertyInquiryDialog
					listing={listing}
					onOpenChange={setIsInquiryOpen}
					open={isInquiryOpen}
				/>
			) : null}
		</>
	);
}

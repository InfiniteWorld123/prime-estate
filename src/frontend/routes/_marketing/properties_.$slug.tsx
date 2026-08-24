import { createFileRoute } from "@tanstack/react-router";
import { PropertyDetailsPage } from "@/frontend/pages/marketing/property-details/PropertyDetailsPage";

export const Route = createFileRoute("/_marketing/properties_/$slug")({
	component: PropertyDetailsRoute,
});

function PropertyDetailsRoute() {
	const { slug } = Route.useParams();
	return <PropertyDetailsPage slug={slug} />;
}

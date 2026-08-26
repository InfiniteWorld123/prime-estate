import { Archive, RotateCcw, Trash2 } from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/frontend/components/ui/dialog";
import type { AdminPropertyAction } from "@/frontend/hooks/pages/useAdminPropertiesPage";
import type { AdminPropertiesCopy } from "../admin-properties.copy";

type AdminPropertyActionDialogProps = {
	action: AdminPropertyAction | null;
	copy: AdminPropertiesCopy;
	count: number;
	onConfirm: () => void;
	onOpenChange: (open: boolean) => void;
};

export function AdminPropertyActionDialog({
	action,
	copy,
	count,
	onConfirm,
	onOpenChange,
}: AdminPropertyActionDialogProps) {
	if (!action) return null;
	const isBulkArchive = action === "archive" && count > 1;
	const content =
		action === "delete"
			? {
					description: copy.actionDialog.deleteDescription,
					label: copy.actions.delete,
					title: copy.actionDialog.deleteTitle,
					icon: Trash2,
				}
			: action === "restore"
				? {
						description: copy.actionDialog.restoreDescription,
						label: copy.actions.restore,
						title: copy.actionDialog.restoreTitle,
						icon: RotateCcw,
					}
				: {
						description: isBulkArchive
							? copy.archiveDialog.description(count)
							: copy.actionDialog.archiveDescription,
						label: isBulkArchive
							? copy.archiveDialog.confirm
							: copy.actions.archive,
						title: isBulkArchive
							? copy.archiveDialog.title
							: copy.actionDialog.archiveTitle,
						icon: Archive,
					};
	const Icon = content.icon;
	return (
		<Dialog onOpenChange={onOpenChange} open>
			<DialogContent closeLabel={copy.actionDialog.cancel}>
				<DialogHeader>
					<span className="grid size-10 place-items-center rounded-md bg-muted text-foreground">
						<Icon aria-hidden="true" className="size-5" />
					</span>
					<DialogTitle className="mt-2">{content.title}</DialogTitle>
					<DialogDescription>{content.description}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						onClick={() => onOpenChange(false)}
						type="button"
						variant="outline"
					>
						{copy.actionDialog.cancel}
					</Button>
					<Button
						onClick={onConfirm}
						type="button"
						variant={action === "delete" ? "destructive" : "default"}
					>
						{content.label}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

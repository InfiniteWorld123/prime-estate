import handler from "@tanstack/react-start/server-entry";
import { createDatabaseScope } from "#/backend/db/pool";
import { env } from "#/shared/env";

type WorkerEnv = {
	HYPERDRIVE?: { connectionString: string };
};

type WorkerContext = {
	waitUntil(promise: Promise<unknown>): void;
};

export default {
	async fetch(request: Request, workerEnv: WorkerEnv, context: WorkerContext) {
		const database = createDatabaseScope(
			workerEnv.HYPERDRIVE?.connectionString ?? env.DATABASE_URL,
		);

		try {
			return await database.run(() => handler.fetch(request));
		} finally {
			context.waitUntil(database.close());
		}
	},
};

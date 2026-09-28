import { AsyncLocalStorage } from "node:async_hooks";
import { Pool } from "pg";
import { env } from "#/shared/env";

// Cloudflare Workers bind every socket to the request that opened it. A pool
// kept at module scope hands later requests connections they are not allowed
// to use, which hangs those requests and breaks Better Auth's adapter setup.
// Every Worker request therefore runs in its own database scope, and its pool
// is created lazily on first use. Scripts and tests outside a request scope
// share one process-wide pool.
type DatabaseScope = {
	connectionString: string;
	pool?: Pool;
};

// Workers allow six simultaneous open connections per request.
const MAX_CONNECTIONS_PER_POOL = 5;

const requestScope = new AsyncLocalStorage<DatabaseScope>();
let processScope: DatabaseScope | undefined;

const currentScope = () => {
	const scope = requestScope.getStore();
	if (scope) return scope;

	processScope ??= { connectionString: env.DATABASE_URL };
	return processScope;
};

export const getPool = () => {
	const scope = currentScope();

	if (!scope.pool || scope.pool.ending) {
		scope.pool = new Pool({
			connectionString: scope.connectionString,
			max: MAX_CONNECTIONS_PER_POOL,
		});
	}

	return scope.pool;
};

export const createDatabaseScope = (connectionString: string) => {
	const scope: DatabaseScope = { connectionString };

	return {
		run: <T>(callback: () => T) => requestScope.run(scope, callback),
		close: async () => {
			await scope.pool?.end();
		},
	};
};

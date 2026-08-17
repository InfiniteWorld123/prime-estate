const getEnvVar = (key: string) => {
	const value = process.env[key];
	if (value === undefined || value.trim() === "") {
		throw new Error(`Environment variable ${key} is missing`);
	}
	return value;
};

const getOptionalEnvVar = (key: string) => {
	const value = process.env[key];
	if (value === undefined || value.trim() === "") {
		return undefined;
	}
	return value;
};

export const env = {
	APP_NAME: getOptionalEnvVar("APP_NAME") ?? "Prime Estate",

	BETTER_AUTH_SECRET: getEnvVar("BETTER_AUTH_SECRET"),
	BETTER_AUTH_URL: getEnvVar("BETTER_AUTH_URL"),

	DATABASE_URL: getEnvVar("DATABASE_URL"),
	RESEND: getEnvVar("RESEND"),

	BASE_URL: getEnvVar("BASE_URL"),

	GITHUB_CLIENT_ID: getOptionalEnvVar("GITHUB_CLIENT_ID"),
	GITHUB_CLIENT_SECRET: getOptionalEnvVar("GITHUB_CLIENT_SECRET"),
	GOOGLE_CLIENT_ID: getOptionalEnvVar("GOOGLE_CLIENT_ID"),
	GOOGLE_CLIENT_SECRET: getOptionalEnvVar("GOOGLE_CLIENT_SECRET"),

	EMAIL_FROM:
		getOptionalEnvVar("EMAIL_FROM") ??
		"Prime Estate <noreply@prime-estate.local>",
} as const;

export type EnvVariables = typeof env;

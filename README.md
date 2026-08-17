# Prime Estate

Prime Estate is a full-stack real-estate platform built with TypeScript, PostgreSQL, authentication, email, and Docker. The product modules and property-domain schema will be designed incrementally on top of this foundation.

## Stack

- Bun and TypeScript
- React 19 and TanStack Start
- TanStack Router, Query, and Form
- Elysia
- Better Auth
- PostgreSQL through `pg` (no ORM)
- Docker and Docker Compose
- Tailwind CSS and Biome
- Resend

## Requirements

- [Bun](https://bun.sh/) 1.3.14 or newer
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git

## Quick Start with Docker

1. Create your local environment file:

   ```bash
   cp .env.example .env
   ```

2. Fill in `.env`. Generate strong local secrets with:

   ```bash
   openssl rand -hex 32
   ```

   Use one generated value for `POSTGRES_PASSWORD` and another for `BETTER_AUTH_SECRET`.

3. Set the local database URL using the same database name, user, and password:

   ```text
   DATABASE_URL=postgresql://prime_estate:YOUR_POSTGRES_PASSWORD@127.0.0.1:5432/prime_estate
   ```

4. Set the local application URLs:

   ```text
   BETTER_AUTH_URL=http://localhost:3000
   BASE_URL=http://localhost:3000
   ```

5. Add a Resend API key and a valid sender address for `RESEND` and `EMAIL_FROM`.

6. Build and start PostgreSQL, migrations, and the application:

   ```bash
   docker compose up -d --build --wait
   ```

Open [http://localhost:3000](http://localhost:3000).

## Local Development

Start only PostgreSQL:

```bash
docker compose up -d --wait database
```

Install dependencies, apply migrations, and start the development server:

```bash
bun install
bun run db:migrate
bun run dev
```

## Database Migrations

SQL migration files live in `src/backend/db/migrations` and run in filename order.

Create each schema change as a new numbered file:

```text
0001_auth.sql
0002_example.sql
0003_another_change.sql
```

Apply pending migrations:

```bash
bun run db:migrate
```

Applied filenames are recorded in the `schema_migrations` table. Do not edit a migration after it has been applied; create a new migration instead.

## Useful Commands

```bash
bun run dev          # Start the development server
bun run build        # Build the production application
bun run db:migrate   # Apply pending PostgreSQL migrations
bun run typecheck    # Check TypeScript
bun run test         # Run tests
bun run check        # Run Biome checks
```

Docker commands:

```bash
docker compose ps
docker compose logs -f app
docker compose down
```

To also delete the local PostgreSQL data volume:

```bash
docker compose down -v
```

> `docker compose down -v` permanently deletes the local database data.

## Production Notes

- Never commit `.env` or real secrets.
- Put a reverse proxy with HTTPS in front of the application.
- Keep PostgreSQL and application ports bound to localhost unless external access is intentional.
- Back up the PostgreSQL volume before upgrades or destructive operations.
- Use unique secrets for every project and environment.

FROM oven/bun:1.3.14-alpine AS dependencies

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile


FROM dependencies AS builder

COPY . .

RUN bun run build


FROM dependencies AS migrator

COPY src ./src
COPY tsconfig.json ./

CMD ["bun", "run", "db:migrate"]


FROM oven/bun:1.3.14-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=builder --chown=bun:bun /app/.output ./.output

USER bun

EXPOSE 3000

CMD ["bun", ".output/server/index.mjs"]
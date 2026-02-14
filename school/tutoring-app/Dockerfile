# ── Stage 1: Install dependencies ──
FROM node:22-slim AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# ── Stage 2: Build the application ──
FROM node:22-slim AS builder
RUN apt-get update && apt-get install -y openssl --no-install-recommends && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Bundle seed.ts into a single JS file (so runner doesn't need tsx/esbuild)
RUN npx esbuild seed.ts --bundle --platform=node --target=node22 \
    --external:@prisma/client --outfile=seed.js

# Build Next.js (standalone output)
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── Stage 3: Production runtime ──
FROM node:22-slim AS runner
RUN apt-get update && apt-get install -y openssl --no-install-recommends && rm -rf /var/lib/apt/lists/*
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 --ingroup nodejs nextjs

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma schema for migrations & seeding
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

# Symlink engine for all possible Prisma platform detections
RUN ln -sf /app/node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node \
           /app/node_modules/.prisma/client/libquery_engine-linux-musl.so.node && \
    ln -sf /app/node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node \
           /app/node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node

# Copy pre-bundled seed script (no tsx needed at runtime)
COPY --from=builder /app/seed.js ./seed.js

# Copy course materials for seeding
COPY --from=builder /app/course-materials ./course-materials

# Copy entrypoint script
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV PRISMA_QUERY_ENGINE_LIBRARY="/app/node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node"

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]

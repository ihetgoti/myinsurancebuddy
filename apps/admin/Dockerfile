# Multi-stage Dockerfile for Admin App

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/admin/package.json ./apps/admin/
COPY apps/web/package.json ./apps/web/
COPY packages/db/package.json ./packages/db/
COPY packages/ui/package.json ./packages/ui/ 2>/dev/null || true

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 2: Builder
FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy all files
COPY . .

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/admin/node_modules ./apps/admin/node_modules 2>/dev/null || true
COPY --from=deps /app/packages/db/node_modules ./packages/db/node_modules 2>/dev/null || true

# Generate Prisma Client
RUN cd packages/db && pnpm prisma generate

# Build the application
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build --filter=admin

# Stage 3: Runner
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/apps/admin/public ./apps/admin/public 2>/dev/null || true
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/standalone ./apps/admin/
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/static ./apps/admin/.next/static

# Copy Prisma files
COPY --from=builder /app/packages/db ./packages/db
COPY --from=builder /app/node_modules/.pnpm/@prisma+client* ./node_modules/@prisma/client 2>/dev/null || true

USER nextjs

EXPOSE 3002

ENV PORT=3002
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/admin/server.js"]

# --- Stage 1: Base (Shared) ---
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY pnpm-lock.yaml package.json ./

# --- Stage 2: Development ---
# This stage keeps devDependencies and source code for hot-reloading
FROM base AS development
# ENV NODE_ENV=development
RUN pnpm install
COPY . .
EXPOSE $PORT
# Start the server with tsx watch mode
CMD ["pnpm", "run", "dev"]

# --- Stage 3: Production (Build Prep) ---
FROM base AS builder
# Install all dependencies
RUN pnpm install --frozen-lockfile
# Copy source and config
COPY . .
# Build the project (runs tsc)
RUN pnpm run build

# --- Stage 4: Production (Final) ---
FROM node:20-alpine AS production

WORKDIR /app

# Install pnpm and set production env
RUN corepack enable && corepack prepare pnpm@latest --activate
# ENV NODE_ENV=production

# Create user and group
RUN addgroup -S app && adduser -S app -G app

RUN apk add --no-cache wget

# Copy only production dependencies
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --prod --frozen-lockfile

# Copy compiled output from builder
# Set ownership
COPY --from=builder --chown=app:app /app/dist ./dist

# If you have static assets
# COPY --from=builder --chown=app:app /app/public ./public

# Switch user
USER app

EXPOSE $PORT

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

CMD ["node", "dist/server.js"]

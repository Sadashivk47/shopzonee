# ==========================================
# STAGE 1: Build the static React assets and compile the Server
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency catalogs
COPY package*.json ./

# Install all packages (including devDependencies for esbuild & vite)
RUN npm ci

# Copy full source
COPY . .

# Run production build
# This runs: 'vite build' (creating /dist for UI) and 
# 'esbuild server.ts --bundle --platform=node ...' (creating dist/server.cjs for Backend)
RUN npm run build

# ==========================================
# STAGE 2: Run-time production environment
# ==========================================
FROM node:20-alpine

WORKDIR /app

# Set production environment flags
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package*.json ./

# Only install runtime production dependencies (saves container image size)
RUN npm ci --only=production

# Copy built bundles from the builder target
COPY --from=builder /app/dist ./dist

# Open port 3000 to incoming web requests
EXPOSE 3000

# Start server
CMD ["node", "dist/server.cjs"]
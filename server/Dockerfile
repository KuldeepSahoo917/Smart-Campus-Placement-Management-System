# ==========================================
# STAGE 1: Dependency Installation
# ==========================================
FROM node:20 AS deps

# Set the working directory
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application source code
COPY . ./


# ==========================================
# STAGE 2: Final Runtime Image
# ==========================================
FROM node:20-alpine AS runner

# Build-time Metadata
LABEL maintainer="Your Name"
LABEL description="Production image for Node.js Application"

# Set environment variables
ENV NODE_ENV=production
WORKDIR /app


# 1. Security: Create a non-root user and group
RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nodeuser

# 2. Filesystem: Copy artifacts from deps stage
COPY --from=deps /app/node_modules ./node_modules

# 3. Filesystem: Copy source and set permissions
COPY --chown=nodeuser:nodejs . .

# 4. Permissions: Switch to non-privileged user
USER nodeuser

# 5. Networking: Expose the application port
EXPOSE 4000

# 6. Reliability: Healthcheck configuration
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget -qO- http://localhost:4000/health || exit 1

# 7. Execution: Start the server
CMD ["node", "server.js"]

# Base image for building the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Definindo variáveis de ambiente para build
ARG BUILD_TIME=unknown
ENV NEXT_PUBLIC_BUILD_TIME=${BUILD_TIME}

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy all files
COPY . .

# Build the Next.js application
RUN npm run build

# Production image
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Passando variáveis de tempo de build para a imagem final
ARG BUILD_TIME=unknown
ENV NEXT_PUBLIC_BUILD_TIME=${BUILD_TIME}

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Define environment variable for the port
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["node", "server.js"] 
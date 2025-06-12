# ==============================================================================
# DOCKERFILE ULTRA-OTIMIZADO PARA ORACLE CLOUD - ANALISTA DEVOPS SÊNIOR
# ==============================================================================
# Multi-stage build otimizado para reduzir uso de CPU/RAM
# Compatível com Oracle Cloud Always Free Tier

# Stage 1: Base dependencies com cache otimizado
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Otimização: Copiar apenas package files para melhor cache
COPY package*.json ./

# Configurar npm para produção e cache otimizado
RUN npm config set fund false && \
    npm config set audit false && \
    npm ci --legacy-peer-deps --prefer-offline && \
    npm cache clean --force

# Stage 2: Build otimizado com limitação de memória
FROM node:18-alpine AS builder
WORKDIR /app

# Copiar dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Configurar variáveis de ambiente para build otimizado
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=512"

# Build com configurações de memória limitada
RUN npm run build

# Stage 3: Runtime ultra-leve
FROM node:18-alpine AS runner
WORKDIR /app

# Configurações de segurança e performance
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=256"
ENV PORT=3000

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar apenas arquivos necessários para produção
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Configurar usuário
USER nextjs

# Expor porta
EXPOSE 3000

# Health check otimizado
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000 || exit 1

# Comando otimizado para produção
CMD ["node", "server.js"]
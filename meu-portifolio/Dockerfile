# ==============================================================================
# DOCKERFILE ULTRA-OTIMIZADO PARA ORACLE CLOUD - ANALISTA DEVOPS SÊNIOR
# ==============================================================================
# Multi-stage build otimizado para reduzir uso de CPU/RAM
# Compatível com Oracle Cloud Always Free Tier

# Stage 1: Dependências com otimizações avançadas
FROM node:18-alpine AS deps

# Instalar apenas o essencial e limpar cache
RUN apk add --no-cache libc6-compat curl && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Configurações globais do npm para acelerar instalação
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar apenas os arquivos de dependências para aproveitar o cache
COPY package*.json .npmrc ./

# Instalar apenas dependências de produção com otimizações
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set network-timeout 300000 && \
    npm ci --omit=dev --no-audit --no-fund --prefer-offline --no-progress && \
    npm cache clean --force && \
    rm -rf /root/.npm

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

# Build com configurações de memória limitada e otimizações de performance
RUN NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 npm run build -- --no-lint && \
    find .next \( -name "*.map" -o -name "*.d.ts" \) -type f -delete

# Stage 3: Runtime ultra-leve com Alpine mínimo
FROM node:18-alpine AS runner
WORKDIR /app

# Remover pacotes desnecessários e limpar cache
RUN apk update && \
    apk add --no-cache curl && \
    rm -rf /var/cache/apk/* /tmp/*

# Configurações de segurança e performance
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=256 --no-warnings"
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
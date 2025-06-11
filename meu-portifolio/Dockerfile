# Etapa de dependências
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Usar mirror oficial do npm para evitar lentidão
RUN npm config set registry https://registry.npmjs.org/ \
  && npm ci --legacy-peer-deps

# Etapa de build
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/package-lock.json ./package-lock.json
COPY . .
RUN npm run build

# Imagem final de produção
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ARG BUILD_TIME=unknown
ENV NEXT_PUBLIC_BUILD_TIME=${BUILD_TIME}

# Cria usuário não-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copia apenas o necessário do build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

RUN chown -R nextjs:nodejs /app
USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
CMD ["node", "server.js"] 
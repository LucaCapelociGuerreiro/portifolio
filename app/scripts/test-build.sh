#!/bin/bash
# Script para testar o build após as correções de importação

set -e

echo "🔍 Verificando configurações..."
echo "📂 Diretório atual: $(pwd)"

echo "🧹 Limpando cache..."
rm -rf .next

echo "🚀 Executando build..."
NEXT_TELEMETRY_DISABLED=1 npm run build

echo "✅ Build concluído com sucesso!"
echo "📦 Verificando arquivos gerados:"
ls -la .next
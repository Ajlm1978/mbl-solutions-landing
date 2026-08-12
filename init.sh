#!/usr/bin/env bash
# Verificación base del proyecto. Si esto falla, arregla la base ANTES de tocar features.
set -euo pipefail
cd "$(dirname "$0")"

echo "== npm install =="
npm install --no-fund --no-audit

echo "== verificación base: tsc + vite build =="
npm run build

echo "OK — base verde. Puedes trabajar."

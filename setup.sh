#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "Installing backend dependencies..."
cd "$ROOT/backend"
npm install

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created backend/.env from .env.example — edit IMAGE_DIRECTORY before starting."
else
  echo "backend/.env already exists, skipping copy."
fi

echo "Installing frontend dependencies..."
cd "$ROOT/frontend"
npm install

echo "Setup complete. Edit backend/.env if needed, then run ./start-server.sh"

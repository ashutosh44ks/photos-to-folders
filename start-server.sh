#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"

if [[ ! -f "$ROOT/backend/.env" ]]; then
  echo "Missing backend/.env — run ./setup.sh first." >&2
  exit 1
fi

free_port() {
  local port=$1
  local pids
  pids=$(lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true)
  if [[ -n "$pids" ]]; then
    echo "Port $port in use — stopping PID(s): $pids"
    # shellcheck disable=SC2086
    kill $pids 2>/dev/null || true
    sleep 0.5
  fi
}

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]]; then
    pkill -P "$BACKEND_PID" 2>/dev/null || true
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  free_port 5000
}
trap cleanup EXIT INT TERM

free_port 5000

echo "Starting backend on http://localhost:5000 ..."
cd "$ROOT/backend"
npm run dev &
BACKEND_PID=$!

echo "Starting frontend on http://localhost:3000 ..."
cd "$ROOT/frontend"
npm run dev

wait "$BACKEND_PID"

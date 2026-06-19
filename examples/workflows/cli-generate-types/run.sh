#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT=$(cd "$SCRIPT_DIR/../../.." && pwd)
CLI="$ROOT/src/playground.js"

echo "== Project contract to TypeScript =="
bun run "$CLI" types "$SCRIPT_DIR/contract.sigil" Account

echo
echo "== Validate unknown billing payload =="
bun run "$CLI" safe-parse "$SCRIPT_DIR/contract.sigil" "$SCRIPT_DIR/valid.json"

#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT=$(cd "$SCRIPT_DIR/../../.." && pwd)
CLI="$ROOT/src/playground.js"

echo "== Human contract diff =="
bun run "$CLI" diff "$SCRIPT_DIR/contract-v1.sigil" "$SCRIPT_DIR/contract.sigil"

echo
echo "== JSON contract diff =="
bun run "$CLI" diff "$SCRIPT_DIR/contract-v1.sigil" "$SCRIPT_DIR/contract.sigil" --json

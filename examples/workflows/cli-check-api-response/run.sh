#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT=$(cd "$SCRIPT_DIR/../../.." && pwd)
CLI="$ROOT/src/playground.js"

echo "== Check valid API response =="
bun run "$CLI" check "$SCRIPT_DIR/contract.sigil" "$SCRIPT_DIR/valid.json"

echo
echo "== Check invalid API response as JSON =="
set +e
bun run "$CLI" check "$SCRIPT_DIR/contract.sigil" "$SCRIPT_DIR/invalid.json" --json
status=$?
set -e
echo "exit status: $status"

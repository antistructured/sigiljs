#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT=$(cd "$SCRIPT_DIR/../../.." && pwd)
CLI="$ROOT/src/playground.js"

echo "== Project event contract to JSON Schema =="
bun run "$CLI" json-schema "$SCRIPT_DIR/contract.sigil"

echo
echo "== Machine-check invalid event input =="
set +e
bun run "$CLI" check "$SCRIPT_DIR/contract.sigil" "$SCRIPT_DIR/invalid.json" --json
status=$?
set -e
echo "exit status: $status"

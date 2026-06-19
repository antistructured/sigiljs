#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT=$(cd "$SCRIPT_DIR/../../.." && pwd)
CLI="$ROOT/src/playground.js"

echo "== Safe-parse trusted AI structured output =="
bun run "$CLI" safe-parse "$SCRIPT_DIR/contract.sigil" "$SCRIPT_DIR/valid.json"

echo
echo "== Reject invalid AI structured output =="
set +e
bun run "$CLI" parse "$SCRIPT_DIR/contract.sigil" "$SCRIPT_DIR/invalid.json" --json
status=$?
set -e
echo "exit status: $status"

echo
echo "== Project AI output contract for tooling =="
bun run "$CLI" describe "$SCRIPT_DIR/contract.sigil"

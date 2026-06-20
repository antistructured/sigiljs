#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT=$(cd "$SCRIPT_DIR/../.." && pwd)
CLI="$ROOT/src/playground.js"

step() {
  echo
  echo "### $1"
}

echo 'SigilJS category demo'
echo 'Define structure once. Project it everywhere.'

step '1. Define contract'
echo "$SCRIPT_DIR/user.sigil"
sed 's/^/  /' "$SCRIPT_DIR/user.sigil"

step '2. Enforce runtime API data'
bun run "$CLI" check "$SCRIPT_DIR/user.sigil" "$SCRIPT_DIR/api-response.json"

step '3. Show path-aware failure'
set +e
bun run "$CLI" check "$SCRIPT_DIR/user.sigil" "$SCRIPT_DIR/bad-api-response.json" > /tmp/sigil-category-failure.out 2>/tmp/sigil-category-failure.err
status=$?
set -e
cat /tmp/sigil-category-failure.out
cat /tmp/sigil-category-failure.err >&2
echo "exit status: $status"

step '4. Project TypeScript'
bun run "$CLI" types "$SCRIPT_DIR/user.sigil" User

step '5. Project JSON Schema'
bun run "$CLI" json-schema "$SCRIPT_DIR/user.sigil"

step '6. Project OpenAPI'
bun run "$CLI" openapi "$SCRIPT_DIR/user.sigil"

step '7. Diff contract versions'
bun run "$CLI" diff "$SCRIPT_DIR/user.sigil" "$SCRIPT_DIR/user-v2.sigil"

step '8. Validate AI structured output'
bun run "$CLI" safe-parse "$SCRIPT_DIR/user.sigil" "$SCRIPT_DIR/llm-output.json"

echo
echo 'Done: one executable contract validated runtime data, produced projections, detected contract changes, and enforced AI structured output.'

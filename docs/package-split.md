# Package Split Policy

SigilJS should remain a single package until the core API is stable enough to justify an ecosystem split.

Current package:

```txt
sigil
```

Do not create packages just for aesthetics. A package should exist only when it has a clear job, a stable boundary, and a user benefit that outweighs ecosystem complexity.

## Split gate

Recommended split point:

```txt
describe() stable
JSON Schema projection stable
TypeScript projection stable
OpenAPI projection stable
```

Those APIs define the projection boundary. Until they are stable, projection packages would either duplicate internals or force churn across multiple packages.

## Why stay single-package for now?

Keeping one package means:

- one install path
- one public API surface to stabilize
- fewer version-skew problems
- simpler docs and examples
- less package-maintenance overhead
- faster iteration while core contracts are still evolving

This matches the current goal: stabilize SigilJS as an executable data contract system first, then split only where a separate package has a real reason to exist.

## Future package shape

Potential final ecosystem:

| Package              | Reason to exist                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `@sigil/core`        | Runtime contract definition, parsing, validation, transforms, `describe()`, and stable core object model.                                  |
| `@sigil/json-schema` | JSON Schema projection and schema-specific compatibility behavior that may grow beyond the minimal core helper.                            |
| `@sigil/ts`          | TypeScript declaration generation, file emission, and future CLI/compiler integrations without adding TypeScript concerns to runtime core. |
| `@sigil/openapi`     | OpenAPI operation/schema helpers, route docs, request/response documentation utilities, and OpenAPI-specific edge cases.                   |
| `@sigil/forms`       | Form metadata, UI adapter constraints, field widgets, labels, and framework-specific form integrations.                                    |
| `@sigil/ai`          | LLM structured-output helpers, tool-call schema helpers, repair flows, and AI-provider-specific adapters.                                  |
| `@sigil/http`        | Framework-neutral HTTP boundary helpers plus shared request/response enforcement utilities.                                                |
| `@sigil/testing`     | Fixture generation, deterministic test cases, fuzzing, shrinking, and test-runner integrations.                                            |
| `@sigil/cli`         | File-based contract workflows, generators, release checks, and package-level command distribution once command behavior stabilizes.        |

## Split rules

A future package should meet all of these:

1. The feature has a stable public contract.
2. The package boundary does not require parser internals.
3. The package can consume `describe()` or another stable public surface.
4. The package has a clear audience or integration target.
5. The package avoids adding dependencies to `@sigil/core`.
6. The package solves a real distribution or dependency problem.

## Non-goal

Do not split packages only to make the repository look like an ecosystem.

The ecosystem should emerge from stable contracts and real adapter needs, not from folder names.

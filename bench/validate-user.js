import { Sigil } from "../src/index.js";
import { z } from "zod";

// ── Data ───────────────────────────────────────────────────────────────────
const validData = {
  name: "Alice Smith",
  age: 30,
  email: "alice@example.com",
  isAdmin: true,
  tags: ["engineering", "typescript", "runtime"],
  profile: {
    avatar: "https://example.com/avatar.png",
    theme: "dark"
  }
};

const invalidData = {
  name: "Alice Smith",
  age: "thirty", // Invalid type
  email: "alice@example.com",
  isAdmin: true,
  tags: ["engineering", "typescript", 42], // Invalid item
  profile: {
    avatar: "https://example.com/avatar.png"
    // Missing theme
  }
};

// ── Implementations ────────────────────────────────────────────────────────

// 1. Manual validation (Handwritten JS - maximum theoretically possible speed)
function validateManual(data) {
  if (typeof data !== 'object' || data === null) return false;
  if (typeof data.name !== 'string') return false;
  if (typeof data.age !== 'number') return false;
  if (typeof data.email !== 'string') return false;
  if (typeof data.isAdmin !== 'boolean') return false;
  if (!Array.isArray(data.tags)) return false;
  for (let i = 0; i < data.tags.length; i++) {
    if (typeof data.tags[i] !== 'string') return false;
  }
  if (typeof data.profile !== 'object' || data.profile === null) return false;
  if (typeof data.profile.avatar !== 'string') return false;
  if (typeof data.profile.theme !== 'string') return false;
  return true;
}

// 2. SigilJS (Normal Mode)
const SigilUser = Sigil`
{
  name: string
  age: number
  email: string
  isAdmin: boolean
  tags: string[]
  profile: {
    avatar: string
    theme: string
  }
}
`;

// Pre-compiled validator function (bypasses Sigil instance overhead)
const sigilCompiledValidator = SigilUser.validator;

// 3. Zod
const ZodUser = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string(),
  isAdmin: z.boolean(),
  tags: z.array(z.string()),
  profile: z.object({
    avatar: z.string(),
    theme: z.string()
  })
});

// ── Benchmark Runner ───────────────────────────────────────────────────────

function runSuite(name, data) {
  console.log(`\n======================================================`);
  console.log(`Benchmark: ${name}`);
  console.log(`======================================================`);

  const suites = [
    {
      name: "Manual JS (Baseline)",
      fn: () => validateManual(data)
    },
    {
      name: "SigilJS (.validator compiled fn)",
      fn: () => sigilCompiledValidator(data)
    },
    {
      name: "SigilJS (User.check)",
      fn: () => SigilUser.check(data)
    },
    {
      name: "Zod (safeParse)",
      fn: () => ZodUser.safeParse(data).success
    }
  ];

  // Warmup all candidates
  for (const suite of suites) {
    for (let i = 0; i < 50000; i++) {
      suite.fn();
    }
  }

  const results = [];

  for (const suite of suites) {
    const durationMs = 1000;
    const start = performance.now();
    let ops = 0;
    let end = start;

    while (end - start < durationMs) {
      // Unroll loop slightly for lower loop overhead
      suite.fn();
      suite.fn();
      suite.fn();
      suite.fn();
      suite.fn();
      suite.fn();
      suite.fn();
      suite.fn();
      suite.fn();
      suite.fn();
      ops += 10;
      end = performance.now();
    }

    const totalTimeMs = end - start;
    const opsPerSec = (ops / totalTimeMs) * 1000;
    results.push({
      name: suite.name,
      opsPerSec,
      avgMs: totalTimeMs / ops
    });
  }

  // Sort by performance (highest ops/sec first)
  results.sort((a, b) => b.opsPerSec - a.opsPerSec);

  const baselineOps = results.find(r => r.name.includes("Manual JS")).opsPerSec;

  console.log(
    String("Candidate").padEnd(32) +
    " | " +
    String("Ops/sec").padStart(15) +
    " | " +
    String("Avg (ns)").padStart(12) +
    " | " +
    String("vs Manual").padStart(12)
  );
  console.log("-".repeat(78));

  for (const res of results) {
    const vsManual = (res.opsPerSec / baselineOps) * 100;
    const avgNs = res.avgMs * 1e6; // to nanoseconds
    console.log(
      res.name.padEnd(32) +
      " | " +
      Math.round(res.opsPerSec).toLocaleString().padStart(15) +
      " | " +
      avgNs.toFixed(1).padStart(12) +
      " | " +
      `${vsManual.toFixed(1)}%`.padStart(12)
    );
  }
}

// Run benchmarks
runSuite("Valid Data Input", validData);
runSuite("Invalid Data Input", invalidData);

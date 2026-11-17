import type {
  CodeLanguage,
  ReviewFinding,
  ReviewRequest,
  ReviewResult,
} from "@/lib/review-types"

const SAMPLE_SNIPPET = `function fetchUser(id) {
  const res = fetch("/api/users/" + id)
  return res.json()
}

export async function getDashboard(userId) {
  const user = await fetchUser(userId)
  eval(user.prefs)
  for (let i = 0; i < user.items.length; i++) {
    console.log(user.items[i])
  }
  return user
}`

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function hashSeed(input: string): number {
  let h = 0
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0
  }
  return h
}

function pickFindings(code: string, language: CodeLanguage): ReviewFinding[] {
  const lines = Math.max(code.split("\n").length, 1)
  const seed = hashSeed(code + language)

  const pool: Omit<ReviewFinding, "id" | "line">[] = [
    {
      severity: "critical",
      category: "security",
      title: "Unsafe dynamic evaluation",
      detail:
        "Use of eval or equivalent dynamic execution can run untrusted input and open an injection path.",
      suggestion:
        "Remove eval. Parse structured data with JSON.parse or a schema validator instead.",
    },
    {
      severity: "critical",
      category: "bug",
      title: "Missing await on async call",
      detail:
        "A promise-returning call is used without await, so errors and results are easy to mishandle.",
      suggestion:
        "Mark the function async and await the call, or explicitly handle the promise chain.",
    },
    {
      severity: "warning",
      category: "security",
      title: "Unvalidated path concatenation",
      detail:
        "URL or path segments are built with string concatenation from external values.",
      suggestion:
        "Encode parameters and validate IDs before building the request URL.",
    },
    {
      severity: "warning",
      category: "performance",
      title: "N+1 style logging in a loop",
      detail:
        "Repeated side effects inside a tight loop can flood logs and hurt hot paths.",
      suggestion:
        "Batch logs or gate verbose output behind a debug flag.",
    },
    {
      severity: "info",
      category: "style",
      title: "Missing explicit types",
      detail:
        "Public functions lack parameter and return types, which weakens editor feedback.",
      suggestion:
        language === "typescript"
          ? "Add parameter and return types to exported functions."
          : "Add JSDoc or migrate this module to TypeScript for clearer contracts.",
    },
    {
      severity: "suggestion",
      category: "style",
      title: "Prefer template literals",
      detail:
        "String building with + is harder to read than a template literal for URLs.",
      suggestion:
        "Use a template literal like `/api/users/${id}` (or language equivalent) for clarity.",
    },
    {
      severity: "info",
      category: "bug",
      title: "Unchecked response status",
      detail:
        "The response body is parsed without checking HTTP status first.",
      suggestion:
        "Guard with if (!res.ok) throw … before reading JSON.",
    },
  ]

  const count = 3 + (seed % 3)
  const findings: ReviewFinding[] = []

  for (let i = 0; i < count; i++) {
    const item = pool[(seed + i * 3) % pool.length]
    findings.push({
      ...item,
      id: `finding-${i + 1}`,
      line: 1 + ((seed + i * 7) % lines),
    })
  }

  return findings
}

function scoreFromFindings(findings: ReviewFinding[]): number {
  let score = 96
  for (const finding of findings) {
    if (finding.severity === "critical") score -= 18
    else if (finding.severity === "warning") score -= 10
    else if (finding.severity === "info") score -= 4
    else score -= 2
  }
  return Math.max(28, Math.min(98, score))
}

function aiLikelihoodFromCode(code: string): number {
  const trimmed = code.trim()
  if (!trimmed) return 12
  const seed = hashSeed(trimmed)
  const lengthBoost = Math.min(28, Math.floor(trimmed.length / 40))
  return Math.min(92, 34 + (seed % 41) + lengthBoost)
}

/**
 * Local mock review used when OPENAI_API_KEY is not configured.
 */
export async function runMockReview(
  request: ReviewRequest
): Promise<ReviewResult> {
  const code = request.code.trim() || SAMPLE_SNIPPET
  await delay(1400 + (hashSeed(code) % 600))

  const findings = pickFindings(code, request.language)
  const score = scoreFromFindings(findings)
  const aiLikelihood = aiLikelihoodFromCode(code)

  return {
    score,
    aiLikelihood,
    summary:
      score >= 80
        ? "Solid baseline with a few polish items. Address the top findings and you are in good shape."
        : score >= 60
          ? "Several issues need attention before this is production-ready. Start with critical and warning items."
          : "High-risk patterns detected. Fix critical findings before shipping this code.",
    findings,
    analyzedAt: new Date().toISOString(),
    language: request.language,
  }
}

export const DEFAULT_SAMPLE_CODE = SAMPLE_SNIPPET

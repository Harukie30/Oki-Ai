export type CodeLanguage =
  | "typescript"
  | "javascript"
  | "python"
  | "go"
  | "rust"
  | "java"
  | "csharp"
  | "php"
  | "ruby"
  | "kotlin"
  | "scala"
  | "c"
  | "cpp"
  | "sql"
  | "bash"

export type FindingSeverity = "critical" | "warning" | "info" | "suggestion"

export type FindingCategory = "bug" | "security" | "style" | "performance"

export type ReviewProvider = "auto" | "gemini" | "groq"

export interface ReviewRequest {
  code: string
  language: CodeLanguage
  /** Preferred model provider for this review. */
  provider?: ReviewProvider
}

export interface ReviewFinding {
  id: string
  severity: FindingSeverity
  category: FindingCategory
  line: number
  title: string
  detail: string
  suggestion: string
  /** Short code snippet showing the local fix, when available. */
  suggestedCode?: string
}

export interface ReviewResult {
  score: number
  aiLikelihood: number
  summary: string
  findings: ReviewFinding[]
  /** Full revised snippet applying the main suggested fixes. */
  revisedCode: string
  analyzedAt: string
  language: CodeLanguage
}

export type ReviewStatus = "idle" | "analyzing" | "ready"

export type LanguageGroup = "web" | "backend" | "systems"

export const LANGUAGE_GROUPS: {
  id: LanguageGroup
  label: string
  detail: string
}[] = [
  {
    id: "web",
    label: "Web & app",
    detail: "Frontend and full-stack JavaScript dialects",
  },
  {
    id: "backend",
    label: "Backend",
    detail: "Server, API, and service languages",
  },
  {
    id: "systems",
    label: "Systems & data",
    detail: "Systems, databases, and shell scripts",
  },
]

export const CODE_LANGUAGES: {
  value: CodeLanguage
  label: string
  group: LanguageGroup
  blurb: string
}[] = [
  {
    value: "typescript",
    label: "TypeScript",
    group: "web",
    blurb: "Typed JS for apps and APIs",
  },
  {
    value: "javascript",
    label: "JavaScript",
    group: "web",
    blurb: "Browser, Node, and scripting",
  },
  {
    value: "python",
    label: "Python",
    group: "backend",
    blurb: "APIs, scripts, and data services",
  },
  {
    value: "go",
    label: "Go",
    group: "backend",
    blurb: "Fast networked services",
  },
  {
    value: "java",
    label: "Java",
    group: "backend",
    blurb: "Enterprise services and APIs",
  },
  {
    value: "csharp",
    label: "C#",
    group: "backend",
    blurb: ".NET backends and tools",
  },
  {
    value: "php",
    label: "PHP",
    group: "backend",
    blurb: "Web backends and CMS stacks",
  },
  {
    value: "ruby",
    label: "Ruby",
    group: "backend",
    blurb: "Rails and service scripts",
  },
  {
    value: "kotlin",
    label: "Kotlin",
    group: "backend",
    blurb: "JVM services and Android-adjacent backends",
  },
  {
    value: "scala",
    label: "Scala",
    group: "backend",
    blurb: "JVM data and service workloads",
  },
  {
    value: "rust",
    label: "Rust",
    group: "systems",
    blurb: "Safe systems and performance code",
  },
  {
    value: "c",
    label: "C",
    group: "systems",
    blurb: "Low-level and embedded code",
  },
  {
    value: "cpp",
    label: "C++",
    group: "systems",
    blurb: "Performance-critical systems",
  },
  {
    value: "sql",
    label: "SQL",
    group: "systems",
    blurb: "Queries and database logic",
  },
  {
    value: "bash",
    label: "Bash",
    group: "systems",
    blurb: "Shell scripts and ops tooling",
  },
]

export const LANGUAGE_EXTENSIONS: Record<CodeLanguage, string> = {
  typescript: "ts",
  javascript: "js",
  python: "py",
  go: "go",
  rust: "rs",
  java: "java",
  csharp: "cs",
  php: "php",
  ruby: "rb",
  kotlin: "kt",
  scala: "scala",
  c: "c",
  cpp: "cpp",
  sql: "sql",
  bash: "sh",
}

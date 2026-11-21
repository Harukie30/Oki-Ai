import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type {
  CodeLanguage,
  ReviewFinding,
  ReviewProvider,
  ReviewResult,
} from "@/lib/review-types"
import type { ReviewSource } from "@/lib/run-review"
import type {
  SavedReviewDetail,
  SavedReviewListItem,
} from "@/lib/saved-review-types"

export type { SavedReviewDetail, SavedReviewListItem }

export async function requireSessionUserId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session?.user?.id) return null
  return session.user.id
}

export function deriveReviewTitle(input: {
  language: string
  code: string
  summary: string
}) {
  const firstLine =
    input.code
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((line) => line.trim())
      .find(
        (line) =>
          line.length > 0 && !line.startsWith("//") && !line.startsWith("#")
      ) ?? ""

  const snippet = (firstLine || input.summary || "Untitled review")
    .replace(/\s+/g, " ")
    .slice(0, 64)

  return `${input.language} · ${snippet}`
}

export function toListItem(row: {
  id: string
  title: string
  language: string
  provider: string
  score: number
  summary: string
  analyzedAt: Date
  createdAt: Date
}): SavedReviewListItem {
  return {
    id: row.id,
    title: row.title,
    language: row.language,
    provider: row.provider,
    score: row.score,
    summary: row.summary,
    analyzedAt: row.analyzedAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
  }
}

export function parseFindings(raw: string): ReviewFinding[] {
  try {
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as ReviewFinding[]) : []
  } catch {
    return []
  }
}

export function toDetail(row: {
  id: string
  title: string
  language: string
  provider: string
  code: string
  revisedCode: string
  score: number
  aiLikelihood: number
  summary: string
  findings: string
  analyzedAt: Date
  createdAt: Date
}): SavedReviewDetail {
  const findings = parseFindings(row.findings)
  const language = row.language as CodeLanguage
  const result = {
    score: row.score,
    aiLikelihood: row.aiLikelihood,
    summary: row.summary,
    findings,
    revisedCode: row.revisedCode,
    analyzedAt: row.analyzedAt.toISOString(),
    language,
    source: row.provider as ReviewSource,
  }

  return {
    ...toListItem(row),
    code: row.code,
    revisedCode: row.revisedCode,
    aiLikelihood: row.aiLikelihood,
    findings,
    result,
  }
}

export async function listSavedReviews(userId: string) {
  const rows = await prisma.savedReview.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      language: true,
      provider: true,
      score: true,
      summary: true,
      analyzedAt: true,
      createdAt: true,
    },
  })
  return rows.map(toListItem)
}

export async function getSavedReview(userId: string, id: string) {
  const row = await prisma.savedReview.findFirst({
    where: { id, userId },
  })
  return row ? toDetail(row) : null
}

export async function createSavedReview(
  userId: string,
  input: {
    code: string
    language: CodeLanguage
    provider?: string
    result: ReviewResult & { source?: ReviewSource }
    title?: string
  }
) {
  const provider =
    input.provider?.trim() ||
    input.result.source ||
    ("auto" as ReviewProvider | ReviewSource)

  const title =
    input.title?.trim() ||
    deriveReviewTitle({
      language: input.language,
      code: input.code,
      summary: input.result.summary,
    })

  const row = await prisma.savedReview.create({
    data: {
      userId,
      title,
      language: input.language,
      provider: String(provider),
      code: input.code,
      revisedCode: input.result.revisedCode,
      score: Math.round(input.result.score),
      aiLikelihood: Math.round(input.result.aiLikelihood),
      summary: input.result.summary,
      findings: JSON.stringify(input.result.findings ?? []),
      analyzedAt: new Date(input.result.analyzedAt || Date.now()),
    },
  })

  return toDetail(row)
}

export async function updateSavedReviewTitle(
  userId: string,
  id: string,
  title: string
) {
  const existing = await prisma.savedReview.findFirst({
    where: { id, userId },
    select: { id: true },
  })
  if (!existing) return null

  const row = await prisma.savedReview.update({
    where: { id },
    data: { title: title.trim().slice(0, 120) },
  })
  return toListItem(row)
}

export async function deleteSavedReview(userId: string, id: string) {
  const existing = await prisma.savedReview.findFirst({
    where: { id, userId },
    select: { id: true },
  })
  if (!existing) return false

  await prisma.savedReview.delete({ where: { id } })
  return true
}

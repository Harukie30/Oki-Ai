export type DiffKind = "equal" | "add" | "remove"

export interface DiffLine {
  kind: DiffKind
  text: string
  leftLine: number | null
  rightLine: number | null
}

/**
 * Simple line diff (LCS-based) for readable SuggestedCode comparisons.
 */
export function diffLines(before: string, after: string): DiffLine[] {
  const a = before.replace(/\r\n/g, "\n").split("\n")
  const b = after.replace(/\r\n/g, "\n").split("\n")
  const n = a.length
  const m = b.length

  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    Array.from({ length: m + 1 }, () => 0)
  )

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
    }
  }

  const rows: DiffLine[] = []
  let i = 0
  let j = 0
  let leftLine = 1
  let rightLine = 1

  while (i < n && j < m) {
    if (a[i] === b[j]) {
      rows.push({
        kind: "equal",
        text: a[i],
        leftLine: leftLine++,
        rightLine: rightLine++,
      })
      i++
      j++
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      rows.push({
        kind: "remove",
        text: a[i],
        leftLine: leftLine++,
        rightLine: null,
      })
      i++
    } else {
      rows.push({
        kind: "add",
        text: b[j],
        leftLine: null,
        rightLine: rightLine++,
      })
      j++
    }
  }

  while (i < n) {
    rows.push({
      kind: "remove",
      text: a[i++],
      leftLine: leftLine++,
      rightLine: null,
    })
  }
  while (j < m) {
    rows.push({
      kind: "add",
      text: b[j++],
      leftLine: null,
      rightLine: rightLine++,
    })
  }

  return rows
}

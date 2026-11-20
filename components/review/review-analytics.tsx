"use client"

import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { getReviewAnalyticsMetrics } from "@/lib/review-analytics"
import type { ReviewResult } from "@/lib/review-types"
import { cn } from "@/lib/utils"

const compareConfig = {
  yours: {
    label: "Your code",
    color: "var(--chart-3)",
  },
  suggested: {
    label: "SuggestedCode",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const severityConfig = {
  critical: { label: "Critical", color: "oklch(0.62 0.2 25)" },
  warning: { label: "Warning", color: "oklch(0.75 0.14 75)" },
  info: { label: "Info", color: "oklch(0.7 0.12 230)" },
  suggestion: { label: "Tips", color: "var(--chart-1)" },
} satisfies ChartConfig

const categoryConfig = {
  count: {
    label: "Findings",
    color: "var(--chart-1)",
  },
  bug: { label: "Bug", color: "oklch(0.62 0.2 25)" },
  security: { label: "Security", color: "oklch(0.65 0.16 300)" },
  style: { label: "Style", color: "var(--chart-2)" },
  performance: { label: "Performance", color: "var(--chart-3)" },
} satisfies ChartConfig

interface ReviewAnalyticsProps {
  result: ReviewResult
  baselineCode: string
  className?: string
}

export function ReviewAnalytics({
  result,
  baselineCode,
  className,
}: ReviewAnalyticsProps) {
  const metrics = useMemo(
    () => getReviewAnalyticsMetrics(result, baselineCode),
    [result, baselineCode]
  )

  const compareData = useMemo(() => {
    const { compare } = metrics
    if (!compare.hasRevisedCode) {
      return [
        {
          metric: "Lines",
          yours: compare.beforeLines,
          suggested: compare.beforeLines,
        },
      ]
    }
    return [
      {
        metric: "Lines",
        yours: compare.beforeLines,
        suggested: compare.afterLines,
      },
      {
        metric: "Diff Δ",
        yours: compare.removed,
        suggested: compare.added,
      },
    ]
  }, [metrics])

  const severityData = useMemo(
    () =>
      metrics.severity
        .filter((item) => item.count > 0)
        .map((item) => ({
          severity: item.key,
          count: item.count,
          fill: `var(--color-${item.key})`,
        })),
    [metrics.severity]
  )

  const categoryData = useMemo(
    () =>
      metrics.category.map((item) => ({
        category: item.key,
        label: item.label,
        count: item.count,
        fill: `var(--color-${item.key})`,
      })),
    [metrics.category]
  )

  const hasCategories = categoryData.some((item) => item.count > 0)

  return (
    <div
      className={cn(
        "grid min-w-0 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 md:grid-cols-2 xl:grid-cols-3",
        className
      )}
    >
      <Card size="sm" className="border-0 bg-white/70 shadow-[0_20px_60px_-40px_rgba(15,70,80,0.45)] backdrop-blur-md ring-teal-900/10">
        <CardHeader className="border-b border-teal-900/8">
          <CardTitle className="text-teal-950">Your code vs SuggestedCode</CardTitle>
          <CardDescription>
            {metrics.compare.hasRevisedCode
              ? "Line counts and diff impact (removed vs added)."
              : "No SuggestedCode rewrite in this review — showing your line count only."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={compareConfig} className="aspect-[4/3] w-full">
            <BarChart
              accessibilityLayer
              data={compareData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="metric"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                width={28}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      value === "Diff Δ"
                        ? "Diff (removed vs added)"
                        : String(value)
                    }
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="yours"
                fill="var(--color-yours)"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
              />
              <Bar
                dataKey="suggested"
                fill="var(--color-suggested)"
                radius={[6, 6, 0, 0]}
                maxBarSize={36}
              />
            </BarChart>
          </ChartContainer>
          {metrics.compare.hasRevisedCode ? (
            <p className="mt-2 text-[11px] text-muted-foreground">
              Diff Δ: left bar = lines removed, right bar = lines added.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card size="sm" className="border-0 bg-white/70 shadow-[0_20px_60px_-40px_rgba(15,70,80,0.45)] backdrop-blur-md ring-teal-900/10">
        <CardHeader className="border-b border-teal-900/8">
          <CardTitle className="text-teal-950">Findings by severity</CardTitle>
          <CardDescription>
            How issues break down across critical, warning, info, and tips.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {severityData.length === 0 ? (
            <p className="flex aspect-[4/3] items-center justify-center text-sm text-muted-foreground">
              No findings to chart.
            </p>
          ) : (
            <ChartContainer
              config={severityConfig}
              className="mx-auto aspect-square max-h-[260px] w-full"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent nameKey="severity" hideLabel />}
                />
                <Pie
                  data={severityData}
                  dataKey="count"
                  nameKey="severity"
                  innerRadius={52}
                  outerRadius={84}
                  strokeWidth={2}
                >
                  {severityData.map((entry) => (
                    <Cell key={entry.severity} fill={entry.fill} />
                  ))}
                  <Label
                    content={({ viewBox }) => {
                      if (
                        !viewBox ||
                        !("cx" in viewBox) ||
                        !("cy" in viewBox)
                      ) {
                        return null
                      }
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl font-semibold tabular-nums"
                          >
                            {metrics.findingTotal}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy ?? 0) + 18}
                            className="fill-muted-foreground text-[10px] uppercase tracking-[0.14em]"
                          >
                            findings
                          </tspan>
                        </text>
                      )
                    }}
                  />
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="severity" />}
                  className="-translate-y-1 flex-wrap gap-2"
                />
              </PieChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card
        size="sm"
        className="border-0 bg-white/70 shadow-[0_20px_60px_-40px_rgba(15,70,80,0.45)] backdrop-blur-md ring-teal-900/10 md:col-span-2 xl:col-span-1"
      >
        <CardHeader className="border-b border-teal-900/8">
          <CardTitle className="text-teal-950">Findings by category</CardTitle>
          <CardDescription>
            Bug, security, style, and performance coverage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!hasCategories ? (
            <p className="flex aspect-[4/3] items-center justify-center text-sm text-muted-foreground">
              No findings to chart.
            </p>
          ) : (
            <ChartContainer
              config={categoryConfig}
              className="aspect-[4/3] w-full"
            >
              <BarChart
                accessibilityLayer
                data={categoryData}
                layout="vertical"
                margin={{ top: 4, right: 12, left: 4, bottom: 0 }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="label"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={88}
                />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={28}>
                  {categoryData.map((entry) => (
                    <Cell key={entry.category} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

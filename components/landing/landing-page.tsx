import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Reveal } from "@/components/landing/reveal"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Bug01Icon,
  CheckmarkCircle02Icon,
  FlashIcon,
  SecurityCheckIcon,
  SourceCodeIcon,
} from "@hugeicons/core-free-icons"
import { SocialLinks } from "@/components/landing/social-links"
import { OkiAiLogo } from "@/components/brand/oki-ai-logo"

const STEPS = [
  {
    step: "01",
    title: "Paste your code",
    detail:
      "Drop in a snippet and pick the language. No setup, no repo sync required.",
    icon: SourceCodeIcon,
    cue: "snippet → language",
  },
  {
    step: "02",
    title: "Run the review",
    detail:
      "ok-ai scans for bugs, security risks, style issues, and AI authorship signals.",
    icon: FlashIcon,
    cue: "scan in seconds",
  },
  {
    step: "03",
    title: "Fix with confidence",
    detail:
      "Get a score, ranked findings, and clear suggestions you can apply right away.",
    icon: CheckmarkCircle02Icon,
    cue: "score · findings · fixes",
  },
] as const

const FOCUS = [
  {
    icon: Bug01Icon,
    title: "Bugs & edge cases",
    detail:
      "Catch missing awaits, unchecked responses, and risky control-flow patterns.",
    cue: "runtime · edge cases",
    accent: "from-teal-500/20 to-teal-500/5 text-teal-800",
  },
  {
    icon: SecurityCheckIcon,
    title: "Security signals",
    detail:
      "Flag unsafe evaluation, weak input handling, and unsafe path construction.",
    cue: "auth · input · paths",
    accent: "from-cyan-500/20 to-cyan-500/5 text-cyan-900",
  },
  {
    icon: SourceCodeIcon,
    title: "Style & clarity",
    detail:
      "Surface typing gaps, readability nits, and small refactors that compound.",
    cue: "types · readability",
    accent: "from-emerald-500/20 to-emerald-500/5 text-emerald-900",
  },
] as const

export function LandingPage() {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_10%_-10%,_rgba(45,212,191,0.35),_transparent_55%),radial-gradient(ellipse_90%_70%_at_90%_10%,_rgba(8,145,178,0.2),_transparent_50%),linear-gradient(165deg,#f7fffe_0%,#e8f7f4_38%,#f3faf8_72%,#eef6f4_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-24 -z-10 hidden size-[420px] rounded-full bg-teal-400/20 blur-3xl animate-[pulse_7s_ease-in-out_infinite] sm:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-[70vh] -z-10 hidden size-[320px] rounded-full bg-cyan-500/15 blur-3xl animate-[pulse_9s_ease-in-out_infinite] sm:block"
      />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-8 sm:py-5">
        <OkiAiLogo size="sm" className="sm:h-8" />
        <nav className="hidden min-w-0 items-center gap-5 md:flex">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-teal-900/65 transition-colors hover:text-teal-900"
          >
            How it works
          </a>
          <a
            href="#focus"
            className="text-sm font-medium text-teal-900/65 transition-colors hover:text-teal-900"
          >
            What we check
          </a>
          <a
            href="#start-review"
            className="text-sm font-medium text-teal-900/65 transition-colors hover:text-teal-900"
          >
            Start reviewing
          </a>
        </nav>
      </header>

      <main className="flex min-w-0 flex-1 flex-col">
        {/* Hero */}
        <section className="mx-auto flex w-full max-w-6xl flex-col justify-center px-4 pb-12 pt-4 sm:min-h-[calc(100vh-4.5rem)] sm:px-8 sm:pb-16 sm:pt-6">
          <div className="grid min-w-0 items-center gap-8 sm:gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            <div className="max-w-xl animate-in fade-in slide-in-from-bottom-3 duration-700">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700/70 sm:mb-4 sm:text-[11px] sm:tracking-[0.22em]">
                Code quality, sharpened
              </p>
              <h1 className="sr-only">Oki-Ai</h1>
              <OkiAiLogo
                size="hero"
                href={false}
                priority
                className="max-w-full"
              />
              <p className="mt-4 max-w-md text-base leading-relaxed text-teal-950/70 sm:mt-5 sm:text-lg">
                Instant AI code review for bugs, security, and style — with a
                clear path to real analysis when you are ready.
              </p>
            </div>

            <div className="relative min-w-0 animate-in fade-in zoom-in-95 duration-1000">
              <div className="absolute -inset-2 rounded-[1.5rem] bg-gradient-to-br from-teal-400/30 via-cyan-300/10 to-transparent blur-2xl sm:-inset-4 sm:rounded-[2rem]" />
              <div className="relative overflow-hidden rounded-2xl border border-teal-950/10 bg-[#0c1214] p-4 shadow-[0_40px_100px_-40px_rgba(8,60,70,0.7)] ring-1 ring-teal-300/20 sm:rounded-[1.75rem] sm:p-6">
                <div className="mb-3 flex items-center gap-2 sm:mb-4">
                  <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="size-2.5 rounded-full bg-[#febc2e]" />
                  <span className="size-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-2 truncate font-mono text-xs text-white/40">
                    review.ts
                  </span>
                </div>
                <pre className="max-w-full overflow-x-auto font-mono text-[11px] leading-5 text-teal-100/85 sm:text-[13px] sm:leading-6">
                  <code>{`async function review(code: string) {
  const findings = await scan(code)
  return {
    score: grade(findings),
    aiLikelihood: estimate(code),
    findings,
  }
}`}</code>
                </pre>
                <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-3 sm:mt-5 sm:flex sm:items-center sm:justify-between sm:gap-3 sm:px-4">
                  <div className="min-w-0 text-center sm:text-left">
                    <p className="truncate text-[9px] font-medium uppercase tracking-[0.12em] text-teal-200/70 sm:text-xs sm:tracking-[0.14em]">
                      Score
                    </p>
                    <p className="mt-1 text-xl font-semibold tabular-nums text-white sm:text-2xl">
                      86
                    </p>
                  </div>
                  <div className="hidden h-10 w-px bg-white/10 sm:block" />
                  <div className="min-w-0 text-center sm:text-left">
                    <p className="truncate text-[9px] font-medium uppercase tracking-[0.12em] text-teal-200/70 sm:text-xs sm:tracking-[0.14em]">
                      Findings
                    </p>
                    <p className="mt-1 text-xl font-semibold tabular-nums text-white sm:text-2xl">
                      4
                    </p>
                  </div>
                  <div className="hidden h-10 w-px bg-white/10 sm:block" />
                  <div className="min-w-0 text-center sm:text-left">
                    <p className="truncate text-[9px] font-medium uppercase tracking-[0.12em] text-teal-200/70 sm:text-xs sm:tracking-[0.14em]">
                      AI signal
                    </p>
                    <p className="mt-1 text-xl font-semibold tabular-nums text-white sm:text-2xl">
                      41%
                    </p>
                  </div>
                </div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-4 top-14 h-px animate-[scan_2.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-teal-300/80 to-transparent sm:inset-x-6 sm:top-16"
                />
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="relative isolate overflow-hidden scroll-mt-16 border-t border-teal-900/8 sm:scroll-mt-20"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(45,212,191,0.18),transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.62)_0%,rgba(240,253,250,0.4)_48%,rgba(236,253,245,0.2)_100%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(13,148,136,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(13,148,136,0.07)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_28%,transparent_78%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 top-10 size-[280px] rounded-full bg-teal-300/25 blur-3xl animate-[pulse_8s_ease-in-out_infinite] sm:-left-16 sm:size-[360px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 bottom-0 size-[260px] rounded-full bg-cyan-300/20 blur-3xl animate-[pulse_10s_ease-in-out_infinite] sm:-right-10 sm:size-[340px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-[42%] rounded-full border border-teal-500/10 sm:size-[640px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 size-[340px] -translate-x-1/2 -translate-y-[38%] rounded-full border border-dashed border-teal-600/15 sm:size-[420px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-[12%] top-[18%] hidden size-24 rounded-full border border-teal-500/15 sm:block"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-[10%] bottom-[22%] hidden size-16 rotate-12 rounded-2xl border border-cyan-500/15 sm:block"
          />
          <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-8 sm:py-28">
            <Reveal variant="up" delayMs={40}>
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-700/70 sm:text-[11px]">
                  From paste to clarity
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-teal-950 sm:text-4xl">
                  How it works
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-teal-950/65 sm:text-base">
                  Three steps from paste to actionable findings — built for
                  speed while you prototype, ready for a real model later.
                </p>
              </div>
            </Reveal>

            <ol className="relative mt-12 grid gap-10 sm:mt-16 sm:grid-cols-3 sm:gap-8 lg:gap-12">
              <div
                aria-hidden
                className="pointer-events-none absolute left-[16%] right-[16%] top-[1.75rem] hidden h-px sm:block"
              >
                <div className="h-full w-full bg-gradient-to-r from-teal-500/0 via-teal-600/35 to-teal-500/0" />
                <div className="absolute inset-y-0 left-0 w-1/3 animate-[pulse_3.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-teal-400/70 to-transparent blur-[1px]" />
              </div>

              {STEPS.map((item, index) => (
                <li key={item.step} className="relative">
                  <Reveal variant="up" delayMs={160 + index * 150}>
                    <div className="flex flex-col items-center text-center">
                      <div className="relative z-10 flex size-14 items-center justify-center rounded-full bg-teal-600 text-white shadow-[0_16px_40px_-16px_rgba(13,148,136,0.75)] ring-4 ring-white/80 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105">
                        <HugeiconsIcon
                          icon={item.icon}
                          strokeWidth={1.75}
                          className="size-5"
                        />
                        <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-teal-950 font-mono text-[10px] font-semibold text-teal-50">
                          {item.step}
                        </span>
                      </div>

                      <h3 className="mt-6 text-lg font-semibold tracking-tight text-teal-950 sm:text-xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-[18rem] text-sm leading-relaxed text-teal-950/65">
                        {item.detail}
                      </p>
                      <p className="mt-4 font-mono text-[11px] tracking-[0.14em] text-teal-700/55">
                        {item.cue}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* What we check */}
        <section
          id="focus"
          className="relative scroll-mt-16 border-t border-teal-900/8 sm:scroll-mt-20"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_80%_20%,rgba(8,145,178,0.12),transparent_55%),radial-gradient(ellipse_60%_50%_at_10%_80%,rgba(16,185,129,0.1),transparent_50%)]"
          />
          <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-8 sm:py-28">
            <Reveal variant="up" delayMs={40}>
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-700/70 sm:text-[11px]">
                  Severity-ranked findings
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-teal-950 sm:text-4xl">
                  What we check
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-teal-950/65 sm:text-base">
                  Every review surfaces a quality score, severity-ranked
                  findings, and an AI authorship likelihood signal.
                </p>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-10 sm:mt-16 sm:grid-cols-3 sm:gap-8 lg:gap-12">
              {FOCUS.map((item, index) => (
                <Reveal
                  key={item.title}
                  variant="scale"
                  delayMs={140 + index * 150}
                >
                  <div className="group flex h-full flex-col items-center text-center">
                    <div
                      className={cn(
                        "relative flex size-16 items-center justify-center rounded-[1.35rem] bg-gradient-to-br transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:-translate-y-0.5",
                        item.accent
                      )}
                    >
                      <HugeiconsIcon
                        icon={item.icon}
                        strokeWidth={1.75}
                        className="size-6"
                      />
                      <span className="absolute -left-2 -top-2 font-mono text-[10px] font-semibold tracking-[0.16em] text-teal-700/45">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="mt-6 text-lg font-semibold tracking-tight text-teal-950 sm:text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-[18rem] text-sm leading-relaxed text-teal-950/65">
                      {item.detail}
                    </p>
                    <div className="mt-5 h-px w-10 bg-gradient-to-r from-transparent via-teal-600/35 to-transparent transition-all duration-500 group-hover:w-16 group-hover:via-teal-500/60" />
                    <p className="mt-4 font-mono text-[11px] tracking-[0.14em] text-teal-700/55">
                      {item.cue}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA — primary entry to review */}
        <section
          id="start-review"
          className="group/cta relative isolate scroll-mt-16 overflow-hidden border-t border-teal-900/8 bg-teal-950 text-teal-50 sm:scroll-mt-20"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_120%_at_0%_50%,rgba(45,212,191,0.22),transparent_55%)] opacity-40 transition-opacity duration-700 ease-out group-has-[[data-cta]:hover]/cta:opacity-100 group-has-[[data-cta]:focus-visible]/cta:opacity-100"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-[70%] -translate-x-[108%] bg-gradient-to-r from-teal-700/80 via-teal-500/35 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-has-[[data-cta]:hover]/cta:translate-x-0 group-has-[[data-cta]:focus-visible]/cta:translate-x-0"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-[-20%] left-0 w-[42%] -translate-x-[130%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-teal-200/30 to-transparent opacity-0 blur-md transition-[transform,opacity] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-has-[[data-cta]:hover]/cta:translate-x-[220%] group-has-[[data-cta]:hover]/cta:opacity-100 group-has-[[data-cta]:focus-visible]/cta:translate-x-[220%] group-has-[[data-cta]:focus-visible]/cta:opacity-100"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-has-[[data-cta]:hover]/cta:opacity-[0.22] group-has-[[data-cta]:focus-visible]/cta:opacity-[0.22] [background-image:linear-gradient(rgba(153,246,228,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(153,246,228,0.14)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(90deg,black_0%,transparent_75%)]"
          />

          <div className="relative mx-auto flex w-full max-w-6xl flex-col items-stretch gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8 sm:py-20">
            <Reveal variant="up" className="max-w-lg" delayMs={60}>
              <h2 className="text-2xl font-semibold tracking-tight transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-has-[[data-cta]:hover]/cta:translate-x-1 sm:text-4xl">
                Ready to review a snippet?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-teal-100/70 transition-colors duration-700 group-has-[[data-cta]:hover]/cta:text-teal-50/85 sm:text-base">
                Open the workspace, paste code, and see findings in seconds.
              </p>
            </Reveal>
            <Reveal variant="scale" delayMs={220} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="relative z-10 w-full bg-teal-400 text-teal-950 shadow-[0_0_0_0_rgba(45,212,191,0)] transition-[background-color,box-shadow,transform] duration-500 hover:bg-teal-300 hover:shadow-[0_0_36px_-4px_rgba(45,212,191,0.65)] sm:w-auto"
                nativeButton={false}
                render={<Link href="/review" data-cta="" />}
              >
                Start reviewing
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  strokeWidth={2}
                  data-icon="inline-end"
                />
              </Button>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-teal-900/10 bg-[#f4fbfa]">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 sm:py-10">
          <Reveal variant="fade" delayMs={80}>
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <OkiAiLogo size="md" href={false} />
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-teal-950/60">
                  AI code review for sharper shipping. UI-first today, real
                  analysis when you plug it in.
                </p>
                <SocialLinks className="mt-4" />
              </div>
              <div className="grid grid-cols-2 gap-8 text-sm sm:flex sm:gap-12">
                <div className="space-y-2">
                  <p className="font-medium text-teal-950">Product</p>
                  <ul className="space-y-1.5 text-teal-950/60">
                    <li>
                      <a
                        href="#start-review"
                        className="transition-colors hover:text-teal-800"
                      >
                        Start reviewing
                      </a>
                    </li>
                    <li>
                      <a
                        href="#how-it-works"
                        className="transition-colors hover:text-teal-800"
                      >
                        How it works
                      </a>
                    </li>
                    <li>
                      <a
                        href="#focus"
                        className="transition-colors hover:text-teal-800"
                      >
                        What we check
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-teal-950">Status</p>
                  <ul className="space-y-1.5 text-teal-950/60">
                    <li>Demo UI live</li>
                    <li>Mock analysis</li>
                    <li>API coming next</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator className="my-6 bg-teal-900/10 sm:my-8" />

            <div className="flex flex-col gap-2 text-xs text-teal-950/50 sm:flex-row sm:items-center sm:justify-between">
              <p>© 2026 Oki-Ai. Built for clearer code reviews.</p>
              <p className="font-mono tracking-wide">UI-first · teal edition</p>
            </div>
          </Reveal>
        </div>
      </footer>
    </div>
  )
}

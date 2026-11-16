import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Reveal } from "@/components/landing/reveal"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Bug01Icon,
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
  },
  {
    step: "02",
    title: "Run the review",
    detail:
      "ok-ai scans for bugs, security risks, style issues, and AI authorship signals.",
  },
  {
    step: "03",
    title: "Fix with confidence",
    detail:
      "Get a score, ranked findings, and clear suggestions you can apply right away.",
  },
] as const

const FOCUS = [
  {
    icon: Bug01Icon,
    title: "Bugs & edge cases",
    detail:
      "Catch missing awaits, unchecked responses, and risky control-flow patterns.",
  },
  {
    icon: SecurityCheckIcon,
    title: "Security signals",
    detail:
      "Flag unsafe evaluation, weak input handling, and unsafe path construction.",
  },
  {
    icon: SourceCodeIcon,
    title: "Style & clarity",
    detail:
      "Surface typing gaps, readability nits, and small refactors that compound.",
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
        <nav className="flex min-w-0 items-center gap-3 sm:gap-5">
          <a
            href="#how-it-works"
            className="hidden text-sm font-medium text-teal-900/65 transition-colors hover:text-teal-900 md:inline"
          >
            How it works
          </a>
          <a
            href="#focus"
            className="hidden text-sm font-medium text-teal-900/65 transition-colors hover:text-teal-900 md:inline"
          >
            What we check
          </a>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/review" />}
          >
            Open review
          </Button>
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
              <div className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                <Button
                  size="lg"
                  className="w-full bg-teal-600 text-white hover:bg-teal-500 sm:w-auto"
                  nativeButton={false}
                  render={<Link href="/review" />}
                >
                  Start reviewing
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    strokeWidth={2}
                    data-icon="inline-end"
                  />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                  nativeButton={false}
                  render={<Link href="/review" />}
                >
                  <HugeiconsIcon
                    icon={FlashIcon}
                    strokeWidth={2}
                    data-icon="inline-start"
                  />
                  Try the demo
                </Button>
              </div>
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
          className="scroll-mt-16 border-t border-teal-900/8 bg-white/40 backdrop-blur-sm sm:scroll-mt-20"
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 sm:py-24">
            <Reveal variant="up" delayMs={40}>
              <div className="max-w-xl">
                <h2 className="text-2xl font-semibold tracking-tight text-teal-950 sm:text-4xl">
                  How it works
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-teal-950/65 sm:text-base">
                  Three steps from paste to actionable findings — built for
                  speed while you prototype, ready for a real model later.
                </p>
              </div>
            </Reveal>

            <ol className="mt-10 grid gap-8 sm:mt-14 sm:grid-cols-3 sm:gap-8">
              {STEPS.map((item, index) => (
                <li key={item.step} className="relative">
                  <Reveal variant="up" delayMs={160 + index * 140}>
                    <span className="font-mono text-sm font-semibold tracking-[0.18em] text-teal-600/80">
                      {item.step}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold tracking-tight text-teal-950 sm:text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-teal-950/65">
                      {item.detail}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* What we check */}
        <section
          id="focus"
          className="scroll-mt-16 sm:scroll-mt-20"
        >
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 sm:py-24">
            <Reveal variant="up" delayMs={40}>
              <div className="max-w-xl">
                <h2 className="text-2xl font-semibold tracking-tight text-teal-950 sm:text-4xl">
                  What we check
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-teal-950/65 sm:text-base">
                  Every review surfaces a quality score, severity-ranked
                  findings, and an AI authorship likelihood signal.
                </p>
              </div>
            </Reveal>

            <div className="mt-10 grid gap-8 sm:mt-14 sm:grid-cols-3">
              {FOCUS.map((item, index) => (
                <Reveal
                  key={item.title}
                  variant="scale"
                  delayMs={140 + index * 150}
                >
                  <div className="space-y-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-teal-600/10 text-teal-800">
                      <HugeiconsIcon
                        icon={item.icon}
                        strokeWidth={1.75}
                        className="size-5"
                      />
                    </div>
                    <h3 className="text-base font-semibold tracking-tight text-teal-950 sm:text-lg">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-teal-950/65">
                      {item.detail}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="border-t border-teal-900/8 bg-teal-950 text-teal-50">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-stretch gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8 sm:py-20">
            <Reveal variant="up" className="max-w-lg" delayMs={60}>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">
                Ready to review a snippet?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-teal-100/70 sm:text-base">
                Open the workspace, paste code, and see findings in seconds.
              </p>
            </Reveal>
            <Reveal variant="scale" delayMs={220} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full bg-teal-400 text-teal-950 hover:bg-teal-300 sm:w-auto"
                nativeButton={false}
                render={<Link href="/review" />}
              >
                Open the demo
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
                      <Link
                        href="/review"
                        className="transition-colors hover:text-teal-800"
                      >
                        Review workspace
                      </Link>
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

import Image from "next/image"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Reveal } from "@/components/landing/reveal"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Bug01Icon,
  CheckmarkCircle02Icon,
  LanguageCircleIcon,
  SecurityCheckIcon,
  SourceCodeIcon,
} from "@hugeicons/core-free-icons"
import { SocialLinks } from "@/components/landing/social-links"
import { CtaBand } from "@/components/landing/cta-band"
import { OkiAiLogo } from "@/components/brand/oki-ai-logo"
import { AutoHideHeader } from "@/components/layout/auto-hide-header"

const STEPS = [
  {
    step: "01",
    title: "Choose your language",
    detail:
      "Pick web, backend, or systems — so the review matches the kind of code you’re shipping.",
    icon: LanguageCircleIcon,
    cue: "web · backend · systems",
  },
  {
    step: "02",
    title: "Paste your code",
    detail:
      "Drop in a snippet in the editor. No setup, no repo sync required.",
    icon: SourceCodeIcon,
    cue: "paste → review",
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

const NAV_LINK =
  "group relative inline-block text-sm font-medium text-teal-900/65 transition-[color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:text-teal-950 after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-1 after:h-[1.5px] after:origin-left after:scale-x-0 after:rounded-full after:bg-gradient-to-r after:from-teal-400 after:to-teal-600 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:after:scale-x-100 focus-visible:outline-none focus-visible:text-teal-950 focus-visible:after:scale-x-100"

const FOOTER_LINK =
  "group relative inline-block text-teal-950/60 transition-[color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:text-teal-950 after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:rounded-full after:bg-gradient-to-r after:from-teal-400 after:to-teal-600 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:after:scale-x-100 focus-visible:outline-none focus-visible:text-teal-950 focus-visible:after:scale-x-100"

export function LandingPage() {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-x-clip">
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
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-[42vh] z-0 h-[min(90vh,720px)] w-[calc(min(90vh,720px)*130/308)] -translate-y-1/2 overflow-hidden select-none sm:h-[min(105vh,920px)] sm:w-[calc(min(105vh,920px)*130/308)]"
      >
        <Image
          src="/brand/oki-ai-logo.png"
          alt=""
          width={520}
          height={616}
          priority
          className="h-full w-auto max-w-none -translate-x-1/2 opacity-[0.18] sm:opacity-[0.22]"
        />
      </div>

      <AutoHideHeader>
        <OkiAiLogo size="sm" className="sm:h-8" />
        <nav className="hidden min-w-0 items-center gap-6 md:flex">
          <Link href="/about" className={NAV_LINK}>
            About
          </Link>
          <a href="#how-it-works" className={NAV_LINK}>
            How it works
          </a>
          <a href="#focus" className={NAV_LINK}>
            What we check
          </a>
          <a href="#start-review" className={NAV_LINK}>
            Start reviewing
          </a>
        </nav>
      </AutoHideHeader>

      <main className="flex min-w-0 flex-1 flex-col">
        {/* Hero */}
        <section className="relative flex w-full flex-col justify-center pb-12 pt-8 sm:min-h-[calc(100vh-1rem)] sm:pb-16 sm:pt-10">
          <div className="relative z-10 mx-auto grid w-full min-w-0 max-w-6xl items-center gap-8 px-4 sm:gap-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            <div className="max-w-xl animate-in fade-in slide-in-from-bottom-3 duration-700">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-700/70 sm:mb-4 sm:text-[11px] sm:tracking-[0.22em]">
                Built to make code reviews feel kinder
              </p>
              <h1 className="sr-only">Oki-Ai</h1>
              <OkiAiLogo
                size="hero"
                href={false}
                priority
                className="max-w-full"
              />
              <p className="mt-4 max-w-md text-base leading-relaxed text-teal-950/70 sm:mt-5 sm:text-lg">
                Paste a snippet, pick your language, and get friendly findings
                on bugs, security, and style, clear enough to act on right away and let AI handle the rest.
              </p>
              <Link
                href="/about"
                className={cn(
                  "group/more relative mt-6 inline-flex items-center gap-2 overflow-hidden rounded-xl",
                  "border border-teal-900/10 bg-gradient-to-r from-white/80 to-teal-50/70 px-4 py-2.5",
                  "text-sm font-medium text-teal-900/80 backdrop-blur-sm",
                  "shadow-[0_8px_24px_-18px_rgba(8,60,70,0.35)]",
                  "transition-[transform,background-color,border-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "hover:-translate-y-0.5 hover:border-teal-500/35 hover:from-teal-50 hover:to-teal-100/80 hover:text-teal-950",
                  "hover:shadow-[0_16px_36px_-18px_rgba(13,148,136,0.5)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#eef8f6]"
                )}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-teal-300/25 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/more:translate-x-full"
                />
                <span className="relative">See more</span>
                <span className="relative inline-flex size-6 items-center justify-center rounded-lg bg-teal-600/10 text-teal-700 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/more:translate-x-0.5 group-hover/more:bg-teal-500/15">
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    strokeWidth={2}
                    className="size-3.5"
                  />
                </span>
              </Link>
            </div>

            <div className="group/ide relative min-w-0 animate-in fade-in zoom-in-95 duration-1000">
              <div
                aria-hidden
                className="absolute -inset-2 rounded-[1.5rem] bg-gradient-to-br from-teal-400/35 via-cyan-300/15 to-transparent blur-2xl transition-opacity duration-700 group-hover/ide:opacity-100 sm:-inset-4 sm:rounded-[2rem] opacity-80"
              />
              <div
                className={cn(
                  "relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c1214] shadow-[0_40px_100px_-40px_rgba(8,60,70,0.7)]",
                  "ring-1 ring-teal-400/20 [color-scheme:dark] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "group-hover/ide:-translate-y-1 group-hover/ide:shadow-[0_48px_110px_-36px_rgba(8,60,70,0.85)] sm:rounded-[1.75rem]"
                )}
              >
                <div className="flex items-center justify-between gap-3 border-b border-white/8 px-3 py-2.5 sm:px-4 sm:py-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="size-2.5 shrink-0 rounded-full bg-[#ff5f57]" />
                    <span className="size-2.5 shrink-0 rounded-full bg-[#febc2e]" />
                    <span className="size-2.5 shrink-0 rounded-full bg-[#28c840]" />
                    <span className="ml-1 truncate font-mono text-[11px] text-white/45 sm:ml-2 sm:text-xs">
                      review.ts
                    </span>
                  </div>
                  <span className="shrink-0 rounded-md border border-teal-400/20 bg-teal-400/10 px-2 py-0.5 font-mono text-[10px] font-medium tracking-wide text-teal-200/80">
                    TypeScript
                  </span>
                </div>

                <div className="relative px-3 py-3 sm:px-4 sm:py-4">
                  <div className="flex gap-3 overflow-x-auto font-mono text-[11px] leading-6 sm:text-[13px] sm:leading-7">
                    <div
                      aria-hidden
                      className="select-none text-right text-white/20"
                    >
                      {["1", "2", "3", "4", "5", "6", "7", "8"].map((n) => (
                        <div key={n}>{n}</div>
                      ))}
                    </div>
                    <pre className="min-w-0 flex-1 text-teal-50/90">
                      <code>
                        <span className="text-fuchsia-300/90">async</span>
                        <span className="text-sky-300"> function</span>
                        <span className="text-amber-200"> review</span>
                        <span className="text-white/50">(</span>
                        <span className="text-orange-200/90">code</span>
                        <span className="text-white/50">: </span>
                        <span className="text-teal-300">string</span>
                        <span className="text-white/50">) {"{"}</span>
                        {"\n"}
                        <span className="text-white/50">{"  "}</span>
                        <span className="text-fuchsia-300/90">const</span>
                        <span className="text-orange-200/90"> findings</span>
                        <span className="text-white/50"> = </span>
                        <span className="text-fuchsia-300/90">await</span>
                        <span className="text-amber-200"> scan</span>
                        <span className="text-white/50">(</span>
                        <span className="text-orange-200/90">code</span>
                        <span className="text-white/50">)</span>
                        {"\n"}
                        <span className="text-white/50">{"  "}</span>
                        <span className="text-fuchsia-300/90">return</span>
                        <span className="text-white/50"> {"{"}</span>
                        {"\n"}
                        <span className="text-white/50">{"    "}</span>
                        <span className="text-sky-200/90">score</span>
                        <span className="text-white/50">: </span>
                        <span className="text-amber-200">grade</span>
                        <span className="text-white/50">(</span>
                        <span className="text-orange-200/90">findings</span>
                        <span className="text-white/50">),</span>
                        {"\n"}
                        <span className="text-white/50">{"    "}</span>
                        <span className="text-sky-200/90">aiLikelihood</span>
                        <span className="text-white/50">: </span>
                        <span className="text-amber-200">estimate</span>
                        <span className="text-white/50">(</span>
                        <span className="text-orange-200/90">code</span>
                        <span className="text-white/50">),</span>
                        {"\n"}
                        <span className="text-white/50">{"    "}</span>
                        <span className="text-sky-200/90">findings</span>
                        <span className="text-white/50">,</span>
                        {"\n"}
                        <span className="text-white/50">{"  }"}</span>
                        {"\n"}
                        <span className="text-white/50">{"}"}</span>
                      </code>
                    </pre>
                  </div>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0c1214] to-transparent"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-2 h-px animate-[scan_2.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-teal-300/70 to-transparent"
                  />
                </div>

                <div className="border-t border-white/8 bg-white/[0.03] px-3 py-3 sm:px-4 sm:py-3.5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-200/55">
                      Review ready
                    </p>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/20 bg-teal-400/10 px-2 py-0.5 text-[10px] font-medium text-teal-200/85">
                      <span className="size-1.5 rounded-full bg-teal-300 motion-safe:animate-pulse" />
                      Live preview
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {[
                      { label: "Score", value: "86" },
                      { label: "Findings", value: "4" },
                      { label: "AI signal", value: "41%" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="min-w-0 rounded-xl border border-white/8 bg-white/[0.04] px-2.5 py-2.5 transition-colors duration-300 group-hover/ide:border-teal-400/20 group-hover/ide:bg-teal-400/[0.06] sm:px-3"
                      >
                        <p className="truncate text-[9px] font-medium uppercase tracking-[0.12em] text-teal-200/60 sm:text-[10px]">
                          {stat.label}
                        </p>
                        <p className="mt-1 text-lg font-semibold tabular-nums text-white sm:text-xl">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
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
                  From language to clarity
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-teal-950 sm:text-4xl">
                  How it works
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-teal-950/65 sm:text-base">
                  Choose the language, paste a snippet, then get actionable
                  findings built for speed while you prototype.
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

        <CtaBand />
      </main>

      <footer className="relative isolate overflow-hidden border-t border-teal-900/10">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_80%_at_8%_0%,rgba(45,212,191,0.2),transparent_55%),radial-gradient(ellipse_70%_70%_at_92%_100%,rgba(8,145,178,0.12),transparent_50%),linear-gradient(180deg,#f7fffe_0%,#eef8f6_48%,#e8f4f2_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.4] [background-image:linear-gradient(rgba(13,148,136,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(13,148,136,0.06)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_78%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 bottom-0 -z-10 h-48 w-48 rounded-full bg-teal-300/25 blur-3xl sm:h-64 sm:w-64"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 top-0 -z-10 h-40 w-40 rounded-full bg-cyan-200/30 blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-8 sm:py-12">
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
                <div className="space-y-2.5">
                  <p className="font-medium text-teal-950">Product</p>
                  <ul className="space-y-2.5">
                    <li>
                      <a href="#start-review" className={FOOTER_LINK}>
                        Start reviewing
                      </a>
                    </li>
                    <li>
                      <a href="#how-it-works" className={FOOTER_LINK}>
                        How it works
                      </a>
                    </li>
                    <li>
                      <a href="#focus" className={FOOTER_LINK}>
                        What we check
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="space-y-2.5">
                  <p className="font-medium text-teal-950">Company</p>
                  <ul className="space-y-2.5">
                    <li>
                      <Link href="/about" className={FOOTER_LINK}>
                        About Oki-Ai
                      </Link>
                    </li>
                    <li className="text-teal-950/45">Friendly reviews</li>
                    <li className="text-teal-950/45">Kinder reviews</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator className="my-6 bg-teal-900/10 sm:my-8" />

            <div className="flex flex-col gap-2 text-xs text-teal-950/50 sm:flex-row sm:items-center sm:justify-between">
              <p>© 2026 Oki-Ai. Built to make code reviews feel kinder.</p>
              <p className="font-mono tracking-wide">Oki-Ai · kinder reviews</p>
            </div>
          </Reveal>
        </div>
      </footer>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AboutHeroLogo } from "@/components/about/about-hero-logo"
import { AboutSupport } from "@/components/about/about-support"
import { Reveal } from "@/components/landing/reveal"
import { OkiAiLogo } from "@/components/brand/oki-ai-logo"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  FavouriteIcon,
  Idea01Icon,
  LaptopProgrammingIcon,
  Mortarboard01Icon,
  SmileIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

const REASONS = [
  {
    icon: Idea01Icon,
    title: "Why Oki-Ai exists",
    detail:
      "Code reviews are valuable, but waiting for one can slow you down. Oki-Ai started as a calm place to check a snippet before you ask a teammate or before you ship.",
  },
  {
    icon: SmileIcon,
    title: "What Oki-Ai is",
    detail:
      "A friendly AI code reviewer. You choose a language, paste a snippet, and get a score plus clear findings on bugs, security, style, and more explained in plain language.",
  },
  {
    icon: FavouriteIcon,
    title: "Is Oki-Ai helpful?",
    detail:
      "Yes — especially when you want a fast second look. It won’t replace human judgment, but it can catch easy misses, explain risks, and help you improve with less guesswork.",
  },
] as const

const HELPS: {
  title: string
  detail: string
  icon: IconSvgElement
  accent: string
  glow: string
}[] = [
  {
    title: "Students & learners",
    detail:
      "Understand what might be wrong and how to improve, without harsh jargon.",
    icon: Mortarboard01Icon,
    accent: "bg-teal-500/12 text-teal-800",
    glow: "group-hover/help:bg-teal-300/35",
  },
  {
    title: "Solo builders",
    detail: "Get a quick review when you don’t have another pair of eyes nearby.",
    icon: LaptopProgrammingIcon,
    accent: "bg-cyan-500/12 text-cyan-900",
    glow: "group-hover/help:bg-cyan-300/30",
  },
  {
    title: "Small teams",
    detail:
      "Tighten snippets before a PR so human review can focus on the bigger ideas.",
    icon: UserGroupIcon,
    accent: "bg-emerald-500/12 text-emerald-900",
    glow: "group-hover/help:bg-emerald-300/30",
  },
]

export function AboutPage() {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_12%_-8%,rgba(45,212,191,0.28),transparent_55%),radial-gradient(ellipse_80%_60%_at_90%_10%,rgba(8,145,178,0.14),transparent_50%),linear-gradient(165deg,#f7fffe_0%,#eef8f6_42%,#f5faf9_100%)]"
      />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-8 sm:py-5">
        <OkiAiLogo size="sm" className="sm:h-8" />
        <nav className="hidden min-w-0 items-center gap-5 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-teal-900/65 transition-colors hover:text-teal-900"
          >
            Home
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm font-medium text-teal-900/65 transition-colors hover:text-teal-900"
          >
            How it works
          </Link>
          <Link
            href="/#start-review"
            className="text-sm font-medium text-teal-900/65 transition-colors hover:text-teal-900"
          >
            Start reviewing
          </Link>
        </nav>
      </header>

      <main className="relative z-10 flex min-w-0 flex-1 flex-col">
        <section className="relative isolate overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_0%_20%,rgba(45,212,191,0.22),transparent_55%),radial-gradient(ellipse_60%_70%_at_100%_40%,rgba(8,145,178,0.16),transparent_50%),radial-gradient(ellipse_50%_40%_at_55%_100%,rgba(20,184,166,0.12),transparent_60%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(13,148,136,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(13,148,136,0.07)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_78%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-16 top-8 size-[280px] rounded-full bg-teal-300/20 blur-3xl sm:size-[360px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 bottom-0 size-[300px] rounded-full bg-cyan-400/15 blur-3xl sm:size-[420px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-[8%] top-[18%] size-[220px] rounded-full border border-dashed border-teal-600/15 sm:size-[300px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-[14%] top-[28%] size-[140px] rounded-full border border-teal-500/10 sm:size-[190px]"
          />

          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 px-4 pb-12 pt-8 sm:gap-10 sm:px-8 sm:pb-16 sm:pt-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <Reveal variant="up" delayMs={40}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-700/70 sm:text-[11px]">
                Built to make code reviews feel kinder
              </p>
              <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-teal-950 sm:text-5xl">
                A calmer way to understand your code
              </h1>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-teal-950/65 sm:text-lg">
                Oki-Ai is built to feel helpful, not intimidating, a soft place to
                paste a snippet and leave with clearer next steps.
              </p>
            </Reveal>

            <Reveal variant="fade" delayMs={160}>
              <AboutHeroLogo />
            </Reveal>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-8 sm:pb-20">
          <div className="grid gap-8 sm:gap-10 lg:grid-cols-3">
            {REASONS.map((item, index) => (
              <Reveal key={item.title} variant="up" delayMs={100 + index * 120}>
                <div className="h-full">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-teal-600/10 text-teal-800">
                    <HugeiconsIcon
                      icon={item.icon}
                      strokeWidth={1.75}
                      className="size-5"
                    />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold tracking-tight text-teal-950">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-teal-950/65 sm:text-[15px]">
                    {item.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="relative isolate overflow-hidden border-y border-teal-900/8 bg-white/35">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(45,212,191,0.12),transparent_58%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 top-1/2 size-[280px] -translate-y-1/2 rounded-full bg-teal-300/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 bottom-0 size-[240px] rounded-full bg-cyan-300/15 blur-3xl"
          />

          <div className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
            <Reveal variant="up" delayMs={40}>
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-700/70 sm:text-[11px]">
                  Who it’s for
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-teal-950 sm:text-4xl">
                  Helpful when you need a gentle second look
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-teal-950/65 sm:text-base">
                  Oki-Ai is most useful when you want clarity quickly before a
                  commit, during practice, or when you’re stuck on a snippet.
                </p>
              </div>
            </Reveal>

            <div className="relative mt-10 grid gap-5 sm:mt-14 sm:grid-cols-3 sm:gap-6 lg:gap-8">
              <div
                aria-hidden
                className="pointer-events-none absolute left-[18%] right-[18%] top-[2.15rem] hidden h-px sm:block"
              >
                <div className="h-full w-full bg-gradient-to-r from-teal-500/0 via-teal-600/30 to-teal-500/0" />
              </div>

              {HELPS.map((item, index) => (
                <Reveal
                  key={item.title}
                  variant="up"
                  delayMs={120 + index * 140}
                >
                  <div
                    className={cn(
                      "group/help relative h-full overflow-hidden rounded-[1.5rem] px-5 py-6 text-center sm:px-6 sm:py-7 sm:text-left",
                      "transition-[transform,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      "hover:-translate-y-1 hover:bg-white/70 hover:shadow-[0_24px_50px_-28px_rgba(8,60,70,0.45)]",
                      "focus-within:-translate-y-1 focus-within:bg-white/70"
                    )}
                  >
                    <div
                      aria-hidden
                      className={cn(
                        "pointer-events-none absolute -right-8 -top-10 size-36 rounded-full blur-3xl transition-opacity duration-500",
                        "opacity-0",
                        item.glow,
                        "group-hover/help:opacity-100 group-focus-within/help:opacity-100"
                      )}
                    />

                    <div className="relative flex flex-col items-center sm:items-start">
                      <div className="relative">
                        <div
                          className={cn(
                            "flex size-12 items-center justify-center rounded-2xl ring-1 ring-teal-900/5",
                            "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                            "group-hover/help:scale-110 group-hover/help:-rotate-3",
                            item.accent
                          )}
                        >
                          <HugeiconsIcon
                            icon={item.icon}
                            strokeWidth={1.75}
                            className="size-5"
                          />
                        </div>
                        <span
                          className={cn(
                            "absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full",
                            "bg-teal-950 font-mono text-[9px] font-semibold text-teal-50",
                            "ring-2 ring-white/80 transition-transform duration-500",
                            "group-hover/help:scale-110"
                          )}
                        >
                          0{index + 1}
                        </span>
                      </div>

                      <h3 className="mt-5 text-lg font-semibold tracking-tight text-teal-950">
                        {item.title}
                      </h3>
                      <span
                        aria-hidden
                        className="oki-help-underline mt-2 block h-px w-10 origin-left bg-gradient-to-r from-teal-500/70 to-teal-400/20 sm:origin-left"
                      />
                      <p className="mt-3 text-sm leading-relaxed text-teal-950/65">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-teal-900/8 bg-white/25">
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
            <Reveal variant="up" delayMs={40}>
              <AboutSupport />
            </Reveal>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
          <Reveal variant="up" delayMs={60}>
            <div className="group/cta relative isolate overflow-hidden rounded-[1.75rem] bg-teal-950 text-teal-50">
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

              <div className="relative flex flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-12">
                <div className="max-w-lg">
                  <h2 className="text-2xl font-semibold tracking-tight transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-has-[[data-cta]:hover]/cta:translate-x-1 sm:text-3xl">
                    Ready to try a friendly review?
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-teal-100/70 transition-colors duration-700 group-has-[[data-cta]:hover]/cta:text-teal-50/85 sm:text-base">
                    Pick a language, paste a snippet, and see what Oki-Ai notices.
                  </p>
                </div>
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
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-teal-900/10 bg-[#f4fbfa]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-teal-950/60 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <OkiAiLogo size="sm" href="/" />
          <p>© 2026 Oki-Ai. Built to make code reviews feel kinder.</p>
        </div>
      </footer>
    </div>
  )
}

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/landing/reveal"
import { OkiAiLogo } from "@/components/brand/oki-ai-logo"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  FavouriteIcon,
  Idea01Icon,
  SmileIcon,
} from "@hugeicons/core-free-icons"

const REASONS = [
  {
    icon: Idea01Icon,
    title: "Why Oki-Ai exists",
    detail:
      "Code reviews are valuable, but waiting for one can slow you down. Oki-Ai started as a calm place to check a snippet before you ask a teammate — or before you ship.",
  },
  {
    icon: SmileIcon,
    title: "What Oki-Ai is",
    detail:
      "A friendly AI code reviewer. You choose a language, paste a snippet, and get a score plus clear findings on bugs, security, style, and more — explained in plain language.",
  },
  {
    icon: FavouriteIcon,
    title: "Is Oki-Ai helpful?",
    detail:
      "Yes — especially when you want a fast second look. It won’t replace human judgment, but it can catch easy misses, explain risks, and help you improve with less guesswork.",
  },
] as const

const HELPS = [
  {
    title: "Students & learners",
    detail: "Understand what might be wrong and how to improve, without harsh jargon.",
  },
  {
    title: "Solo builders",
    detail: "Get a quick review when you don’t have another pair of eyes nearby.",
  },
  {
    title: "Small teams",
    detail: "Tighten snippets before a PR so human review can focus on the bigger ideas.",
  },
] as const

export function AboutPage() {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_12%_-8%,rgba(45,212,191,0.28),transparent_55%),radial-gradient(ellipse_80%_60%_at_90%_10%,rgba(8,145,178,0.14),transparent_50%),linear-gradient(165deg,#f7fffe_0%,#eef8f6_42%,#f5faf9_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-[30vh] z-0 h-[min(70vh,560px)] w-[calc(min(70vh,560px)*130/308)] translate-x-1/2 -translate-y-1/2 overflow-hidden select-none"
      >
        <Image
          src="/Logos.png"
          alt=""
          width={520}
          height={616}
          className="h-full w-auto max-w-none translate-x-1/2 opacity-[0.1]"
        />
      </div>

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
        <section className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-10 pt-8 sm:px-8 sm:pb-14 sm:pt-10">
          <Reveal variant="up" delayMs={40}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-700/70 sm:text-[11px]">
              About Oki-Ai
            </p>
            <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-teal-950 sm:text-5xl">
              A calmer way to understand your code
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-teal-950/65 sm:text-lg">
              Oki-Ai is built to feel helpful, not intimidating — a soft place to
              paste a snippet and leave with clearer next steps.
            </p>
          </Reveal>
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

        <section className="border-y border-teal-900/8 bg-white/35">
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-8 sm:py-20">
            <Reveal variant="up" delayMs={40}>
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-700/70 sm:text-[11px]">
                  Who it’s for
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-teal-950 sm:text-4xl">
                  Helpful when you need a gentle second look
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-teal-950/65 sm:text-base">
                  Oki-Ai is most useful when you want clarity quickly — before a
                  commit, during practice, or when you’re stuck on a snippet.
                </p>
              </div>
            </Reveal>

            <div className="mt-10 grid gap-8 sm:mt-14 sm:grid-cols-3">
              {HELPS.map((item, index) => (
                <Reveal
                  key={item.title}
                  variant="scale"
                  delayMs={120 + index * 120}
                >
                  <div className="text-center sm:text-left">
                    <p className="font-mono text-[11px] tracking-[0.16em] text-teal-700/50">
                      0{index + 1}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold tracking-tight text-teal-950">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-teal-950/65">
                      {item.detail}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
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

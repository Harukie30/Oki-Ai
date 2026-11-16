import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

type LogoSize = "sm" | "md" | "lg" | "hero"

const sizeMap: Record<
  LogoSize,
  { height: number; width: number; className: string }
> = {
  sm: { height: 32, width: 136, className: "h-7 w-auto sm:h-8" },
  md: { height: 40, width: 170, className: "h-9 w-auto" },
  lg: { height: 56, width: 236, className: "h-12 w-auto sm:h-14" },
  hero: {
    height: 120,
    width: 506,
    className: "h-[clamp(2.75rem,11vw,5.25rem)] w-auto max-w-full",
  },
}

interface OkiAiLogoProps {
  size?: LogoSize
  className?: string
  /** Wrap in a home link. Pass false to render the mark only. */
  href?: string | false
  priority?: boolean
}

/**
 * Brand logo from the provided Oki-Ai artwork.
 * Uses mix-blend-multiply so the white canvas drops out on light backgrounds.
 */
export function OkiAiLogo({
  size = "md",
  className,
  href = "/",
  priority = false,
}: OkiAiLogoProps) {
  const dims = sizeMap[size]
  const image = (
    <Image
      src="/brand/oki-ai-logo.png"
      alt="Oki-Ai"
      width={dims.width}
      height={dims.height}
      priority={priority}
      className={cn(
        dims.className,
        "object-contain object-left mix-blend-multiply",
        className
      )}
    />
  )

  if (href === false) {
    return image
  }

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center rounded-xl px-1.5 py-1 transition-[background-color,transform] duration-200 ease-out hover:bg-teal-200/80 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40"
      aria-label="Oki-Ai home"
    >
      {image}
    </Link>
  )
}

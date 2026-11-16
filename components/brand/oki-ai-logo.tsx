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
 * Brand logo from the provided Oki-Ai artwork (transparent PNG).
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
      src="/brand/okii-ai.png"
      alt="Oki-Ai"
      width={dims.width}
      height={dims.height}
      priority={priority}
      className={cn(dims.className, "object-contain object-left", className)}
    />
  )

  if (href === false) {
    return image
  }

  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex shrink-0 items-center rounded-full px-2 py-1.5",
        "transition-[transform,box-shadow,background-color] duration-300 ease-out",
        "hover:scale-[1.03] hover:bg-lime-200/70",
        "hover:shadow-[0_0_0_4px_rgba(190,242,100,0.35),0_0_28px_10px_rgba(163,230,53,0.45),0_0_48px_18px_rgba(132,204,22,0.25)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400/60"
      )}
      aria-label="Oki-Ai home"
    >
      {image}
    </Link>
  )
}

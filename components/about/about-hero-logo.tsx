"use client"

import Image from "next/image"

export function AboutHeroLogo() {
  return (
    <div className="oki-float mx-auto flex w-full max-w-[240px] items-center justify-center sm:max-w-[300px] lg:ml-auto lg:mr-0 lg:max-w-[340px]">
      <Image
        src="/brand/oki-ai-logo.png"
        alt="Oki-Ai"
        width={340}
        height={403}
        priority
        className="relative h-auto w-full"
      />
    </div>
  )
}

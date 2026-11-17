import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Figtree } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Oki Ai reviewer ",
    template: "%s — Oki-Ai",
  },
  description:
    "Built to make code reviews feel kinder. Paste code, get friendly findings on bugs, security, and style.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        figtree.variable
      )}
    >
      <body className="flex min-h-full flex-col overflow-x-clip">
        {children}
      </body>
    </html>
  )
}

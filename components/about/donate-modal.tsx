"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AboutModalShell } from "@/components/about/about-modal-shell"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  Copy01Icon,
  Money01Icon,
  QrCodeIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

type DonateMethodId = "qr" | "gcash" | "maya"

type DonateMethod = {
  id: DonateMethodId
  label: string
  short: string
  accent: string
  icon?: IconSvgElement
  logoSrc?: string
}

/** Replace these with your real donation details when ready. */
const DONATE_DETAILS = {
  gcash: {
    name: "Oki-Ai Donations",
    number: "09XX XXX XXXX",
    note: "Send via GCash · mark as Oki-Ai tip",
    logoSrc: "/gcash.jpg",
  },
  maya: {
    bank: "Maya Bank",
    name: "Oki-Ai Donations",
    account: "XXXX XXXX XXXX",
    note: "Bank transfer · include Oki-Ai in the note",
    logoSrc: "/mayaaa.png",
  },
  qr: {
    /** Drop your QR image at public/donate/qr.png */
    imageSrc: "/donate/qr.png",
    caption: "Scan with GCash, Maya, or your banking app",
  },
} as const

const METHODS: DonateMethod[] = [
  {
    id: "qr",
    label: "QR code",
    short: "Scan",
    icon: QrCodeIcon,
    accent: "bg-teal-500/12 text-teal-800",
  },
  {
    id: "gcash",
    label: "GCash",
    short: "Wallet",
    logoSrc: DONATE_DETAILS.gcash.logoSrc,
    accent: "bg-white",
  },
  {
    id: "maya",
    label: "Maya Bank",
    short: "Bank",
    logoSrc: DONATE_DETAILS.maya.logoSrc,
    accent: "bg-white",
  },
]

interface DonateModalProps {
  open: boolean
  onClose: () => void
}

function CopyField({
  label,
  value,
  mono = true,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(timer)
  }, [copied])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-teal-900/8 bg-white/80 px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-teal-700/50">
          {label}
        </p>
        <p
          className={cn(
            "mt-0.5 truncate text-sm font-semibold text-teal-950",
            mono && "font-mono tracking-wide"
          )}
        >
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={() => void handleCopy()}
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors",
          copied
            ? "border-teal-500/30 bg-teal-50 text-teal-800"
            : "border-teal-900/10 bg-teal-900/[0.03] text-teal-900/70 hover:bg-teal-50 hover:text-teal-950"
        )}
      >
        <HugeiconsIcon
          icon={copied ? Tick02Icon : Copy01Icon}
          strokeWidth={1.75}
          className="size-3.5"
        />
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  )
}

function QrPanel() {
  const [failed, setFailed] = useState(false)

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative overflow-hidden rounded-2xl border border-teal-900/10 bg-white p-3 shadow-[0_16px_40px_-28px_rgba(8,60,70,0.5)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(13,148,136,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(13,148,136,0.06)_1px,transparent_1px)] [background-size:14px_14px]"
        />
        {failed ? (
          <div className="relative grid size-[180px] place-items-center rounded-xl bg-teal-50/80 sm:size-[200px]">
            <div className="px-4">
              <HugeiconsIcon
                icon={QrCodeIcon}
                strokeWidth={1.5}
                className="mx-auto size-10 text-teal-700/40"
              />
              <p className="mt-3 text-xs leading-relaxed text-teal-900/55">
                Add your QR at{" "}
                <span className="font-mono text-teal-800/70">
                  public/donate/qr.png
                </span>
              </p>
            </div>
          </div>
        ) : (
          <Image
            src={DONATE_DETAILS.qr.imageSrc}
            alt="Oki-Ai donation QR code"
            width={200}
            height={200}
            className="relative size-[180px] rounded-xl object-contain sm:size-[200px]"
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <p className="mt-3 max-w-[16rem] text-xs leading-relaxed text-teal-950/60">
        {DONATE_DETAILS.qr.caption}
      </p>
    </div>
  )
}

export function DonateModal({ open, onClose }: DonateModalProps) {
  const [method, setMethod] = useState<DonateMethodId>("qr")

  useEffect(() => {
    if (open) setMethod("qr")
  }, [open])

  return (
    <AboutModalShell
      open={open}
      onClose={onClose}
      labelledBy="donate-modal-title"
      describedBy="donate-modal-detail"
      maxWidthClassName="max-w-lg"
    >
      <div className="px-6 pb-6 pt-8 pr-24 sm:px-8 sm:pb-7 sm:pr-28 sm:pt-9">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-teal-600/10 text-teal-800 ring-1 ring-teal-700/10">
          <HugeiconsIcon
            icon={Money01Icon}
            strokeWidth={1.75}
            className="size-6"
          />
        </div>

        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-teal-700/60">
          Built to make code reviews feel kinder
        </p>
        <h2
          id="donate-modal-title"
          className="mt-2 text-2xl font-semibold tracking-tight text-teal-950 sm:text-[1.7rem]"
        >
          Support Oki-Ai
        </h2>
        <p
          id="donate-modal-detail"
          className="mt-2 text-sm leading-relaxed text-teal-950/65"
        >
          Optional tips help cover hosting and AI costs. Choose QR, GCash, or
          Maya Bank — whatever is easiest for you.
        </p>

        <div
          role="tablist"
          aria-label="Donation method"
          className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-teal-900/8 bg-white/55 p-1.5 backdrop-blur-sm"
        >
          {METHODS.map((item) => {
            const selected = method === item.id
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setMethod(item.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl px-2 py-2.5 text-center transition-[background-color,box-shadow,color,transform] duration-200",
                  selected
                    ? "bg-white text-teal-950 shadow-[0_10px_24px_-16px_rgba(8,60,70,0.55)] ring-1 ring-teal-900/8"
                    : "text-teal-900/55 hover:bg-white/70 hover:text-teal-900"
                )}
              >
                <span
                  className={cn(
                    "inline-flex size-8 items-center justify-center rounded-lg",
                    selected
                      ? item.accent
                      : item.logoSrc
                        ? "bg-white/80"
                        : "bg-teal-900/[0.04] text-teal-800/70"
                  )}
                >
                  {item.logoSrc ? (
                    <Image
                      src={item.logoSrc}
                      alt=""
                      width={32}
                      height={32}
                      className={cn(
                        "object-contain",
                        item.id === "gcash"
                          ? "size-8 rounded-md object-cover"
                          : "size-5"
                      )}
                    />
                  ) : item.icon ? (
                    <HugeiconsIcon
                      icon={item.icon}
                      strokeWidth={1.75}
                      className="size-3.5"
                    />
                  ) : null}
                </span>
                <span className="text-[11px] font-semibold leading-none">
                  {item.label}
                </span>
                <span className="hidden text-[9px] uppercase tracking-[0.14em] text-teal-700/45 sm:block">
                  {item.short}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-4 rounded-2xl border border-teal-900/8 bg-white/75 p-4 shadow-[0_12px_30px_-24px_rgba(8,60,70,0.45)] backdrop-blur-sm sm:p-5">
          {method === "qr" ? <QrPanel /> : null}

          {method === "gcash" ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center overflow-hidden rounded-xl border border-teal-900/8 bg-white shadow-sm">
                  <Image
                    src={DONATE_DETAILS.gcash.logoSrc}
                    alt="GCash"
                    width={40}
                    height={40}
                    className="size-10 object-cover"
                  />
                </span>
                <div>
                  <p className="text-sm font-semibold text-teal-950">
                    Send via GCash
                  </p>
                  <p className="text-[11px] text-teal-900/50">
                    {DONATE_DETAILS.gcash.note}
                  </p>
                </div>
              </div>
              <CopyField label="Account name" value={DONATE_DETAILS.gcash.name} mono={false} />
              <CopyField label="GCash number" value={DONATE_DETAILS.gcash.number} />
            </div>
          ) : null}

          {method === "maya" ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-xl border border-teal-900/8 bg-white shadow-sm">
                  <Image
                    src={DONATE_DETAILS.maya.logoSrc}
                    alt="Maya"
                    width={28}
                    height={28}
                    className="size-7 object-contain"
                  />
                </span>
                <div>
                  <p className="text-sm font-semibold text-teal-950">
                    Transfer via Maya Bank
                  </p>
                  <p className="text-[11px] text-teal-900/50">
                    {DONATE_DETAILS.maya.note}
                  </p>
                </div>
              </div>
              <CopyField label="Bank" value={DONATE_DETAILS.maya.bank} mono={false} />
              <CopyField label="Account name" value={DONATE_DETAILS.maya.name} mono={false} />
              <CopyField label="Account number" value={DONATE_DETAILS.maya.account} />
            </div>
          ) : null}
        </div>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-teal-900/45">
          Tips are optional. Thank you for helping keep Oki-Ai free and calm.
        </p>

        <div className="mt-5 flex justify-end">
          <Button
            variant="outline"
            className="w-full border-teal-900/10 bg-white/60 text-teal-900/75 hover:bg-teal-50 sm:w-auto"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </AboutModalShell>
  )
}

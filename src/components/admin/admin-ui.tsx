import type { ComponentPropsWithoutRef, ReactNode } from "react"

import { cn } from "@/lib/utils"

const adminPanelClassName =
  "rounded-[28px] border border-border/70 bg-card/85 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-sm"

const adminBadgeVariantClassNames = {
  neutral: "border-border bg-muted/60 text-muted-foreground",
  success: "border-success/20 bg-success/10 text-success",
  warning: "border-warning/20 bg-warning/12 text-warning",
  info: "border-info/20 bg-info/10 text-info",
  invert: "border-transparent bg-invert text-invert-foreground",
} as const

export const adminInputClassName =
  "h-12 w-full rounded-2xl border border-border bg-background/80 px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/80 focus:border-info/45 focus:ring-4 focus:ring-info/10"

export function AdminPanel({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn(adminPanelClassName, "p-6 md:p-7", className)} {...props} />
}

export function AdminBadge({
  children,
  className,
  variant = "neutral",
}: {
  children: ReactNode
  className?: string
  variant?: keyof typeof adminBadgeVariantClassNames
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.18em] uppercase",
        adminBadgeVariantClassNames[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function AdminSectionHeading({
  actions,
  description,
  eyebrow,
  title,
}: {
  actions?: ReactNode
  description?: ReactNode
  eyebrow?: string
  title: string
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        {eyebrow ? <p className="text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">{eyebrow}</p> : null}
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{title}</h2>
        {description ? <div className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{description}</div> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export function AdminMetricCard({ description, title, value }: { description: string; title: string; value: string | number }) {
  return (
    <AdminPanel className="h-full p-5">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
    </AdminPanel>
  )
}

export function AdminEmptyState({ description, title }: { description: string; title: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-border bg-background/65 px-5 py-6 text-sm">
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-2 leading-6 text-muted-foreground">{description}</p>
    </div>
  )
}
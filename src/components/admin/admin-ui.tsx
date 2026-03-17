import { Info, Ticket, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { useEffect } from "react"

import { cn } from "@/lib/utils"

const adminPanelClassName =
  "rounded-xl border border-border/50 bg-background shadow-sm"

const adminBadgeVariantClassNames = {
  neutral: "border-border/50 bg-muted/50 text-muted-foreground",
  success: "border-success/20 bg-success/10 text-success",
  warning: "border-warning/20 bg-warning/10 text-warning",
  info: "border-info/20 bg-info/10 text-info",
  danger: "border-destructive/20 bg-destructive/10 text-destructive",
  invert: "border-transparent bg-foreground text-background",
} as const

const adminNoticeVariantClassNames = {
  neutral: "border-border/50 bg-muted/30 text-foreground",
  success: "border-success/20 bg-success/10 text-success",
  warning: "border-warning/20 bg-warning/10 text-warning",
  info: "border-info/20 bg-info/10 text-info",
  danger: "border-destructive/20 bg-destructive/10 text-destructive",
} as const

const adminStatToneClassNames = {
  default: "text-foreground",
  success: "text-success",
  warning: "text-warning",
  info: "text-info",
} as const

const metricGridClassNames = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 xl:grid-cols-3",
  4: "md:grid-cols-2 xl:grid-cols-4",
  5: "md:grid-cols-2 xl:grid-cols-5",
} as const

export const adminInputClassName =
  "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

export const adminSelectClassName = `${adminInputClassName} pr-10`
export const adminTextareaClassName = `${adminInputClassName} min-h-28 py-3`

export function AdminPage({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("space-y-8", className)} {...props} />
}

export function AdminPanel({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn(adminPanelClassName, "p-5 md:p-6", className)} {...props} />
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
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        adminBadgeVariantClassNames[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function AdminPageHeader({
  actions,
  badge,
  description,
  title,
}: {
  actions?: ReactNode
  badge?: ReactNode
  description?: ReactNode
  title: string
}) {
  return (
    <div className="relative mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-6">
        {badge ? (
          <div className="inline-flex">
            <AdminBadge className="px-4 py-1.5 font-black uppercase tracking-widest shadow-sm" variant="info">
              {badge}
            </AdminBadge>
          </div>
        ) : null}
        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl lg:text-6xl uppercase">
            {title}
          </h1>
          {description ? (
            <div className="max-w-3xl text-sm font-medium leading-relaxed text-muted-foreground/80 lg:text-base">
              {description}
            </div>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-3">
          {actions}
        </div>
      ) : null}
      <div className="absolute -bottom-6 left-0 h-px w-24 bg-primary/20" />
    </div>
  )
}

export function AdminSectionTitle({
  action,
  description,
  title,
}: {
  action?: ReactNode
  description?: ReactNode
  title: string
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1.5">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description ? <div className="text-sm leading-6 text-muted-foreground">{description}</div> : null}
      </div>
      {action ? <div className="flex items-center gap-2">{action}</div> : null}
    </div>
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
    <AdminPageHeader
      actions={actions}
      badge={eyebrow ? <AdminBadge variant="neutral">{eyebrow}</AdminBadge> : undefined}
      description={description}
      title={title}
    />
  )
}

export function AdminMetricGrid({
  children,
  className,
  columns = 4,
}: {
  children: ReactNode
  className?: string
  columns?: keyof typeof metricGridClassNames
}) {
  return <div className={cn("grid gap-4", metricGridClassNames[columns], className)}>{children}</div>
}

export function AdminStatCard({
  helper,
  label,
  tone = "default",
  value,
}: {
  helper: string
  label: string
  tone?: keyof typeof adminStatToneClassNames
  value: number | string
}) {
  return (
    <AdminPanel className="group h-full space-y-4 rounded-[2.5rem] p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 transition-colors group-hover:text-primary">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className={cn("text-4xl font-black tracking-tighter transition-transform duration-300 group-hover:scale-110", adminStatToneClassNames[tone])}>{value}</p>
        <div className="size-1.5 rounded-full bg-primary/20" />
      </div>
      <p className="text-xs font-medium leading-relaxed text-muted-foreground/70">{helper}</p>
    </AdminPanel>
  )
}

export function AdminMetricCard({ description, title, value }: { description: string; title: string; value: string | number }) {
  return <AdminStatCard helper={description} label={title} value={value} />
}

export function AdminEmptyState({
  action,
  description,
  title,
}: {
  action?: ReactNode
  description: string
  title: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-border/40 bg-muted/5 py-24 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/10 blur-2xl" />
        <div className="relative flex size-20 items-center justify-center rounded-3xl bg-background border border-border/50 shadow-xl text-muted-foreground/20">
          <Ticket className="size-10" />
        </div>
      </div>
      <div className="max-w-xs space-y-3">
        <p className="text-xl font-black tracking-tight text-foreground uppercase">{title}</p>
        <p className="text-sm font-medium leading-relaxed text-muted-foreground/60">{description}</p>
      </div>
      {action ? <div className="mt-10">{action}</div> : null}
    </div>
  )
}

export function AdminToolbar({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between", className)} {...props} />
}

export function AdminNotice({
  className,
  description,
  icon,
  title,
  variant = "neutral",
}: {
  className?: string
  description?: ReactNode
  icon?: ReactNode
  title?: ReactNode
  variant?: keyof typeof adminNoticeVariantClassNames
}) {
  return (
    <div className={cn("rounded-3xl border px-6 py-5 text-sm shadow-sm", adminNoticeVariantClassNames[variant], className)}>
      <div className="flex items-start gap-4">
        {icon ? <div className="mt-0.5 shrink-0">{icon}</div> : (
          <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-current/10">
            <Info className="size-3" />
          </div>
        )}
        <div className="min-w-0 space-y-1">
          {title ? <div className="font-black uppercase tracking-tight text-foreground">{title}</div> : null}
          {description ? <div className={cn("font-medium leading-relaxed", title ? "text-muted-foreground/80" : undefined)}>{description}</div> : null}
        </div>
      </div>
    </div>
  )
}

export function AdminFilterPill({
  active,
  className,
  ...props
}: ComponentPropsWithoutRef<"button"> & {
  active?: boolean
}) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center rounded-2xl border px-6 text-xs font-black uppercase tracking-widest transition-all",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
          : "border-border/50 bg-background text-muted-foreground/60 hover:border-primary/30 hover:text-primary hover:bg-primary/5",
        className,
      )}
      type="button"
      {...props}
    />
  )
}

export function AdminDataTable({ className, ...props }: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-background shadow-2xl shadow-primary/5">
      <div className="overflow-x-auto">
        <table className={cn("min-w-full border-separate border-spacing-0 text-sm", className)} {...props} />
      </div>
    </div>
  )
}

export function AdminTableHead({ className, ...props }: ComponentPropsWithoutRef<"thead">) {
  return <thead className={cn("bg-muted/5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50", className)} {...props} />
}

export function AdminTableBody({ className, ...props }: ComponentPropsWithoutRef<"tbody">) {
  return <tbody className={cn("align-top divide-y divide-border/30", className)} {...props} />
}

export function AdminTableRow({
  className,
  interactive,
  ...props
}: ComponentPropsWithoutRef<"tr"> & {
  interactive?: boolean
}) {
  return <tr className={cn(interactive ? "transition-all duration-300 hover:bg-muted/5 hover:scale-[0.998]" : undefined, className)} {...props} />
}

export function AdminTableHeaderCell({ className, ...props }: ComponentPropsWithoutRef<"th">) {
  return <th className={cn("border-b border-border/40 px-8 py-5 font-black whitespace-nowrap", className)} {...props} />
}

export function AdminTableCell({ className, ...props }: ComponentPropsWithoutRef<"td">) {
  return <td className={cn("px-8 py-6 align-top transition-colors", className)} {...props} />
}

export function AdminDialog({
  children,
  isOpen,
  onClose,
  title,
  maxWidth = "max-w-2xl",
}: {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  title: string
  maxWidth?: string
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-background/60 backdrop-blur-xl"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none lg:p-8">
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={cn(
                "pointer-events-auto relative w-full overflow-hidden rounded-[3rem] border border-border/40 bg-background shadow-2xl shadow-primary/10 flex flex-col",
                maxWidth,
                "max-h-[94vh]"
              )}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            >
              <div className="flex h-20 shrink-0 items-center justify-between border-b border-border/40 bg-muted/5 px-10">
                <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-primary" />
                  <h2 className="text-xl font-black uppercase tracking-tight text-foreground">{title}</h2>
                </div>
                <button
                  className="group flex size-10 items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive active:scale-90"
                  onClick={onClose}
                >
                  <X className="size-5 transition-transform group-hover:rotate-90" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-10 lg:p-12 custom-scrollbar">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

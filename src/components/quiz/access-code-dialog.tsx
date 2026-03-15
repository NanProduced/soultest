import { ArrowRight, LoaderCircle, ShieldCheck, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, type FormEvent } from "react"

import { Button } from "@/components/ui/button"

interface AccessCodeDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>
  value: string
  onValueChange: (value: string) => void
  submitting: boolean
  title: string
  description: string
  errorMessage?: string
  helperText?: string
  draftNotice?: string
  badgeLabel?: string
  inputLabel?: string
  inputPlaceholder?: string
  submitLabel?: string
  submittingLabel?: string
  cancelLabel?: string
}

export function AccessCodeDialog({
  open,
  onClose,
  onSubmit,
  value,
  onValueChange,
  submitting,
  title,
  description,
  errorMessage,
  helperText,
  draftNotice,
  badgeLabel = "输入测试验证码",
  inputLabel = "输入测试验证码",
  inputPlaceholder = "请输入测试验证码",
  submitLabel = "验证并开始测试",
  submittingLabel = "正在验证",
  cancelLabel = "稍后再说",
}: AccessCodeDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open || typeof document === "undefined") {
      return
    }

    const originalOverflow = document.body.style.overflow
    const focusHandle = window.requestAnimationFrame(() => inputRef.current?.focus())
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = originalOverflow
      window.cancelAnimationFrame(focusHandle)
    }
  }, [open])

  useEffect(() => {
    if (!open || typeof window === "undefined") {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !submitting) {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onClose, open, submitting])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/68 px-4 pb-4 pt-16 backdrop-blur-sm md:items-center md:px-6"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          <button
            aria-label="关闭测试验证码弹窗"
            className="absolute inset-0"
            disabled={submitting}
            onClick={onClose}
            type="button"
          />

          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-[30px] border border-white/10 bg-slate-950/96 p-6 text-white shadow-[0_32px_120px_rgba(15,23,42,0.42)] md:rounded-[32px] md:p-7"
            exit={{ opacity: 0, scale: 0.98, y: 24 }}
            initial={{ opacity: 0, scale: 0.98, y: 24 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.22),_transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(2,6,23,0.08))]" />

            <button
              aria-label="关闭"
              className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-white/70 transition hover:bg-white/10 hover:text-white"
              disabled={submitting}
              onClick={onClose}
              type="button"
            >
              <X className="size-4" />
            </button>

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/70">
                <ShieldCheck className="size-4 text-fuchsia-300" />
                {badgeLabel}
              </div>

              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-white">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-white/68">{description}</p>

              <form className="mt-6 space-y-4" onSubmit={(event) => void onSubmit(event)}>
                <div>
                  <label className="sr-only" htmlFor="access-code-dialog-input">
                    {inputLabel}
                  </label>
                  <input
                    autoCapitalize="characters"
                    autoComplete="off"
                    className="h-14 w-full rounded-[18px] border border-white/12 bg-white/10 px-5 text-base text-white outline-none backdrop-blur-md transition placeholder:text-white/35 focus:border-fuchsia-400/70 focus:ring-4 focus:ring-fuchsia-500/15"
                    id="access-code-dialog-input"
                    inputMode="text"
                    onChange={(event) => onValueChange(event.target.value.toUpperCase())}
                    placeholder={inputPlaceholder}
                    ref={inputRef}
                    spellCheck={false}
                    value={value}
                  />
                  {helperText ? <p className="mt-3 text-sm text-white/52">{helperText}</p> : null}
                </div>

                {errorMessage ? (
                  <div className="rounded-[18px] border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                    {errorMessage}
                  </div>
                ) : null}

                {draftNotice ? (
                  <div className="rounded-[18px] border border-emerald-400/18 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                    {draftNotice}
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    className="h-14 flex-1 rounded-[18px] bg-violet-500 px-6 text-base font-medium text-white shadow-[0_18px_50px_rgba(139,92,246,0.35)] transition hover:bg-violet-400"
                    disabled={submitting}
                    type="submit"
                  >
                    {submitting ? <LoaderCircle className="size-4 animate-spin" /> : null}
                    {submitting ? submittingLabel : submitLabel}
                    {!submitting ? <ArrowRight className="size-4" /> : null}
                  </Button>
                  <Button
                    className="h-14 rounded-[18px] border-white/12 bg-white/6 px-5 text-base text-white hover:bg-white/10"
                    disabled={submitting}
                    onClick={onClose}
                    type="button"
                    variant="outline"
                  >
                    {cancelLabel}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

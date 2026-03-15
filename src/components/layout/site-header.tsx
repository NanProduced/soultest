import { ArrowLeft, Sparkles } from "lucide-react"
import { Link, useLocation } from "react-router"
import { motion, useMotionValueEvent, useScroll } from "framer-motion"
import { useState } from "react"

import { cn } from "@/lib/utils"

export function SiteHeader() {
  const location = useLocation()
  const isHome = location.pathname === "/"
  const isAdmin = location.pathname.startsWith("/admin")
  const prefersFloating = !isHome

  const { scrollY } = useScroll()
  const [isFloating, setIsFloating] = useState(false)

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setIsFloating(true)
    } else {
      setIsFloating(false)
    }
  })

  if (isAdmin) {
    return null
  }

  const shouldFloat = prefersFloating || isFloating

  return (
    <motion.header
      animate={{ y: 0 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex justify-center transition-all duration-300 ease-in-out",
        shouldFloat ? "px-4 py-4" : "px-0 py-0",
      )}
      initial={{ y: -100 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={cn(
          "flex w-full items-center justify-between gap-4 overflow-hidden transition-all duration-300 ease-in-out",
          shouldFloat
            ? "mx-auto max-w-3xl rounded-full border border-white/10 bg-black/70 px-6 py-3 shadow-2xl backdrop-blur-md"
            : "mx-auto max-w-7xl bg-transparent px-6 py-4",
        )}
      >
        <Link className={cn("flex items-center gap-3 transition-colors", shouldFloat ? "text-white" : "text-slate-950")} to="/">
          <div
            className={cn(
              "flex size-11 items-center justify-center rounded-3xl border shadow-sm transition-colors",
              shouldFloat
                ? "border-white/20 bg-white/10 text-white"
                : "border-slate-200 bg-slate-950 text-white shadow-[0_14px_40px_rgba(15,23,42,0.10)]",
            )}
          >
            <Sparkles className="size-5" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold tracking-tight">SoulTest</p>
            <p className={cn("text-xs transition-colors", shouldFloat ? "text-white/60" : "text-slate-500")}>
              认真做完，再看结果。
            </p>
          </div>
        </Link>

        {isHome ? (
          <a
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
              shouldFloat
                ? "border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-950",
            )}
            href="#catalog"
          >
            浏览题集
          </a>
        ) : (
          <Link
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
            to="/"
          >
            <ArrowLeft className="size-4" />
            返回主页
          </Link>
        )}
      </div>
    </motion.header>
  )
}

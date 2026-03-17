import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router"

import { fetchFreeQuizRuntime } from "@/features/quizzes/api"
import type { QuizRuntimeConfig } from "@/features/quizzes/types"

interface FreeQuizRuntimeState<TFreeRuntime> {
  runtime: QuizRuntimeConfig | null
  freeRuntime: TFreeRuntime | null
  isLoading: boolean
  error: Error | null
}

export function useFreeQuizRuntime<TFreeRuntime = Record<string, unknown>>(slug: string): FreeQuizRuntimeState<TFreeRuntime> {
  const [runtime, setRuntime] = useState<QuizRuntimeConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let disposed = false

    setIsLoading(true)
    setError(null)

    fetchFreeQuizRuntime(slug)
      .then((response) => {
        if (disposed) {
          return
        }

        setRuntime(response.runtime)
      })
      .catch((reason) => {
        if (disposed) {
          return
        }

        const nextError = reason instanceof Error ? reason : new Error("免费题运行时加载失败")
        setError(nextError)
        setRuntime(null)
      })
      .finally(() => {
        if (!disposed) {
          setIsLoading(false)
        }
      })

    return () => {
      disposed = true
    }
  }, [slug])

  const freeRuntime = useMemo(() => {
    return (runtime?.extensions?.freeRuntime ?? null) as TFreeRuntime | null
  }, [runtime])

  return {
    runtime,
    freeRuntime,
    isLoading,
    error,
  }
}

export function FreeQuizRuntimeLoadingScreen({ className = "bg-[#060010] text-white" }: { className?: string }) {
  return (
    <div className={`min-h-screen flex items-center justify-center ${className}`}>
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-white/70" />
    </div>
  )
}

interface FreeQuizRuntimeUnavailableScreenProps {
  backTo: string
  className?: string
  title?: string
  description?: string
}

export function FreeQuizRuntimeUnavailableScreen({
  backTo,
  className = "bg-[#060010] text-white",
  title = "题目配置加载失败",
  description = "当前测试题运行配置未能从 D1 正常加载，请稍后重试。",
}: FreeQuizRuntimeUnavailableScreenProps) {
  return (
    <div className={`min-h-screen flex items-center justify-center px-6 ${className}`}>
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-lg font-semibold">
          !
        </div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-white/65">{description}</p>
        <div className="mt-6 flex justify-center">
          <Link
            to={backTo}
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white px-5 py-2.5 text-sm font-medium text-slate-950 transition hover:scale-[1.02]"
          >
            返回题目页
          </Link>
        </div>
      </div>
    </div>
  )
}

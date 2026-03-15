import { Download, Sparkles } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Link, Navigate, useParams } from "react-router"

import { ResultLoadingRitual } from "@/components/quiz/result-loading-ritual"
import { Button } from "@/components/ui/button"
import { fetchSubmissionDetail } from "@/features/quizzes/api"
import { getCustomQuizResultPage } from "@/features/quizzes/custom-pages"
import { getQuizPosterExportId, getQuizShareCardKey, getQuizTheme, resolveQuizStrategies } from "@/features/quizzes/engine"
import { getResultTemplateComponent } from "@/features/quizzes/result-template-registry"
import { readStoredQuizResult, writeStoredQuizResult } from "@/features/quizzes/session"
import type { QuizResultDefinition, QuizRuntimeConfig, StoredQuizResult } from "@/features/quizzes/types"

const shareCardExportPresets: Record<
  string,
  {
    title: string
    description: string
    buttonLabel: string
    exportingLabel: string
    exportedLabel: string
    missingMessage: string
    failedMessage: string
    backgroundColor: string
  }
> = {
  "oejts-type-poster": {
    title: "保存您的人格报告",
    description: "保存精心设计的人格海报用于社交分享，或下载完整长页 PDF 用于深度阅读与个人留存。",
    buttonLabel: "保存专属海报",
    exportingLabel: "正在生成海报...",
    exportedLabel: "保存成功",
    missingMessage: "未找到可导出的人格海报，请刷新后重试",
    failedMessage: "人格海报导出失败，请稍后再试",
    backgroundColor: "#020617",
  },
  "relationship-preference-poster": {
    title: "保存您的关系偏好报告",
    description: "一键导出适合分享的关系海报，或下载完整长页 PDF，留给自己或伴侣一起查看。",
    buttonLabel: "保存关系海报",
    exportingLabel: "正在生成关系海报...",
    exportedLabel: "保存成功",
    missingMessage: "未找到可导出的关系海报，请刷新后重试",
    failedMessage: "关系海报导出失败，请稍后再试",
    backgroundColor: "#2b1020",
  },
}

export function QuizResultPage() {
  const { slug, submissionId } = useParams()
  const cachedResult = submissionId ? readStoredQuizResult(submissionId) : undefined
  const [submission, setSubmission] = useState<StoredQuizResult | undefined>(cachedResult)
  const [runtime, setRuntime] = useState<QuizRuntimeConfig>()
  const [result, setResult] = useState<QuizResultDefinition>()
  const [loading, setLoading] = useState(true)
  const [ritualComplete, setRitualComplete] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [posterExporting, setPosterExporting] = useState(false)
  const [posterExported, setPosterExported] = useState(false)
  const [posterExportError, setPosterExportError] = useState<string>()

  useEffect(() => {
    if (!submissionId) {
      return
    }

    const currentSubmissionId = submissionId
    let active = true

    async function load() {
      try {
        const detail = await fetchSubmissionDetail(currentSubmissionId)

        if (!active) {
          return
        }

        setSubmission(detail.submission)
        setRuntime(detail.runtime)
        setResult(detail.result)
        writeStoredQuizResult(detail.submission)
      } catch (error) {
        if (!active) {
          return
        }

        setErrorMessage(error instanceof Error ? error.message : "结果页加载失败")
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [submissionId])

  const posterFileName = useMemo(() => {
    const normalized = [slug, result?.typeCode ?? submission?.resultKey ?? "poster"]
      .filter(Boolean)
      .join("-")
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")

    return `${normalized || "result-poster"}.png`
  }, [result?.typeCode, slug, submission?.resultKey])

  async function handleExportPoster() {
    if (typeof document === "undefined") {
      return
    }

    if (!posterExportId || !posterExportPreset) {
      return
    }

    const posterNode = document.getElementById(posterExportId)

    if (!posterNode) {
      setPosterExportError(posterExportPreset.missingMessage)
      return
    }

    const posterRect = posterNode.getBoundingClientRect()
    const exportWidth = 1080
    const exportHeight = Math.max(Math.round((posterRect.height / Math.max(posterRect.width, 1)) * exportWidth), 1200)

    try {
      setPosterExportError(undefined)
      setPosterExporting(true)
      setPosterExported(false)

      const { exportNodeAsPng } = await import("@/lib/export-node-as-image")

      await exportNodeAsPng(posterNode, {
        filename: posterFileName,
        backgroundColor: posterExportPreset.backgroundColor,
        width: exportWidth,
        height: exportHeight,
        canvasWidth: exportWidth,
        canvasHeight: exportHeight,
        style: {
          width: `${exportWidth}px`,
          maxWidth: "none",
        },
      })

      setPosterExported(true)
      window.setTimeout(() => setPosterExported(false), 1800)
    } catch (error) {
      setPosterExportError(error instanceof Error ? error.message : posterExportPreset.failedMessage)
    } finally {
      setPosterExporting(false)
    }
  }

  function handleSaveResult() {
    if (typeof window === "undefined") {
      return
    }

    window.print()
  }

  if (!slug || !submissionId) {
    return <Navigate replace to="/" />
  }

  if (loading || !ritualComplete) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="flex min-h-[520px] items-center justify-center rounded-[36px] border border-black/5 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
          {!errorMessage ? (
            <ResultLoadingRitual onComplete={() => setRitualComplete(true)} />
          ) : (
            <div className="mx-10 rounded-[32px] border border-rose-100 bg-rose-50 px-6 py-5 text-sm text-rose-700">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (!submission || !runtime || !result) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <div className="rounded-[32px] border border-rose-100 bg-rose-50 px-6 py-5 text-sm text-rose-700">
          {errorMessage ?? "未找到对应结果记录。"}
        </div>
      </div>
    )
  }

  const strategies = resolveQuizStrategies(runtime)
  const theme = getQuizTheme(runtime)
  const shareCardKey = getQuizShareCardKey(runtime)
  const posterExportId = getQuizPosterExportId(runtime)
  const posterExportPreset = shareCardKey ? shareCardExportPresets[shareCardKey] : undefined
  const supportsPosterExport = Boolean(posterExportId && posterExportPreset)
  const CustomResultPage = strategies.renderer === "custom" ? getCustomQuizResultPage(slug) : undefined

  if (CustomResultPage) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <CustomResultPage result={result} runtime={runtime} submission={submission} />
      </div>
    )
  }

  const ResultTemplate = getResultTemplateComponent(strategies.resultTemplate)

  return (
    <div className={`min-h-[calc(100vh-160px)] ${theme.pageBackground}`}>
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <ResultTemplate result={result} runtime={runtime} submission={submission} theme={theme} />

        <section className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 rounded-[32px] border border-black/5 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.04)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col gap-1 relative z-10">
            <h3 className="text-lg font-bold text-slate-900">{posterExportPreset?.title ?? "保存您的分析报告"}</h3>
            <p className="text-sm text-slate-500 max-w-md">
              {posterExportPreset?.description ?? "点击下方按钮保存当前分析结果，便于后续回看和留存。"}
            </p>
            {posterExportError ? <p className="text-sm text-rose-500 mt-1">{posterExportError}</p> : null}
          </div>
          
          <div className="flex flex-wrap items-center gap-3 relative z-10 w-full md:w-auto">
            <Button
              className="h-12 rounded-full px-6 bg-slate-900 text-white hover:bg-slate-800 hover:scale-105 transition-all shadow-md w-full md:w-auto"
              disabled={supportsPosterExport ? posterExporting : false}
              onClick={supportsPosterExport ? () => void handleExportPoster() : handleSaveResult}
              type="button"
            >
              <Download className="size-4 mr-2" />
              {supportsPosterExport
                ? posterExporting
                  ? posterExportPreset?.exportingLabel
                  : posterExported
                    ? posterExportPreset?.exportedLabel
                    : posterExportPreset?.buttonLabel
                : "保存分析结果"}
            </Button>
            
            {supportsPosterExport ? (
              <Button 
                className="h-12 rounded-full px-6 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:scale-105 transition-all shadow-sm w-full md:w-auto" 
                onClick={handleSaveResult} 
                type="button" 
                variant="outline"
              >
                <Download className="size-4 mr-2" />
                导出完整 PDF
              </Button>
            ) : null}
          </div>
        </section>

        {/* 推荐测试 - 二次引导消费 */}
        <section className="mt-16 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-fuchsia-100 text-fuchsia-600">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">继续探索更深层的自己</h2>
              <p className="text-sm text-slate-500 mt-1">其他人都在测的热门分析，多维度解析你的潜在能量。</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Link 
              to="/free/aura"
              className="group flex items-start gap-5 rounded-3xl border border-slate-200 bg-white p-5 transition-all hover:border-fuchsia-300 hover:shadow-[0_12px_40px_rgba(168,85,247,0.12)] hover:-translate-y-1"
            >
              <div className="size-20 rounded-2xl bg-gradient-to-br from-[#060010] to-[#2a1b4d] shrink-0 flex items-center justify-center border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.4),transparent_60%)]" />
                <Sparkles className="size-8 text-fuchsia-400 relative z-10" />
              </div>
              <div className="flex flex-col h-full justify-between flex-1 py-1">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-fuchsia-600 transition-colors">你的 Aura 是什么颜色？</h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-fuchsia-100 text-fuchsia-600 border border-fuchsia-200">免费体验</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">基于双维度四象限模型，18道情境题揭晓你散发着怎样的气场光谱。</p>
                </div>
              </div>
            </Link>

            <Link 
              to="/free/banwei"
              className="group flex items-start gap-5 rounded-3xl border border-slate-200 bg-white p-5 transition-all hover:border-sky-300 hover:shadow-[0_12px_40px_rgba(14,165,233,0.12)] hover:-translate-y-1"
            >
              <div className="size-20 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 shrink-0 flex items-center justify-center border border-slate-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.3),transparent_70%)]" />
                <span className="text-3xl relative z-10 drop-shadow-md">☕</span>
              </div>
              <div className="flex flex-col h-full justify-between flex-1 py-1">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">班味浓度检测报告</h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-700 border border-sky-200">火爆全网</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">权威实验室检测，五维成分分析，精准测定你被工作「腌入味」的程度。</p>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

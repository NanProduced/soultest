import { Copy, Download, RotateCcw, Share2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Link, Navigate, useParams } from "react-router"

import { ResultLoadingRitual } from "@/components/quiz/result-loading-ritual"
import { Button } from "@/components/ui/button"
import { fetchSubmissionDetail } from "@/features/quizzes/api"
import { getCustomQuizResultPage } from "@/features/quizzes/custom-pages"
import { getQuizTheme, resolveQuizStrategies } from "@/features/quizzes/engine"
import { getResultTemplateComponent } from "@/features/quizzes/result-template-registry"
import { readStoredQuizResult, writeStoredQuizResult } from "@/features/quizzes/session"
import type { QuizResultDefinition, QuizRuntimeConfig, StoredQuizResult } from "@/features/quizzes/types"

export function QuizResultPage() {
  const posterExportId = "oejts-result-poster"
  const { slug, submissionId } = useParams()
  const cachedResult = submissionId ? readStoredQuizResult(submissionId) : undefined
  const [submission, setSubmission] = useState<StoredQuizResult | undefined>(cachedResult)
  const [runtime, setRuntime] = useState<QuizRuntimeConfig>()
  const [result, setResult] = useState<QuizResultDefinition>()
  const [loading, setLoading] = useState(true)
  const [ritualComplete, setRitualComplete] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [copied, setCopied] = useState(false)
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

  const shareText = useMemo(() => {
    if (!submission || !result || typeof window === "undefined") {
      return ""
    }

    const base = result.shareCopy ?? `我测出的结果是 ${submission.resultTitle}`
    const currentResultUrl = window.location.href

    return currentResultUrl ? `${base}。完整结果在这里：${currentResultUrl}` : base
  }, [result, submission])

  const posterFileName = useMemo(() => {
    const normalized = [slug, result?.typeCode ?? submission?.resultKey ?? "poster"]
      .filter(Boolean)
      .join("-")
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")

    return `${normalized || "oejts-poster"}.png`
  }, [result?.typeCode, slug, submission?.resultKey])

  async function handleCopyShare() {
    if (!shareText || typeof navigator === "undefined" || !navigator.clipboard) {
      return
    }

    await navigator.clipboard.writeText(shareText)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  async function handleExportPoster() {
    if (typeof document === "undefined") {
      return
    }

    const posterNode = document.getElementById(posterExportId)

    if (!posterNode) {
      setPosterExportError("未找到可导出的人格海报，请刷新后重试")
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
        backgroundColor: "#020617",
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
      setPosterExportError(error instanceof Error ? error.message : "人格海报导出失败，请稍后再试")
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
  const CustomResultPage = strategies.renderer === "custom" ? getCustomQuizResultPage(slug) : undefined
  const isOejtsResult = strategies.resultTemplate === "oejts-profile"

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

        <section className="mt-6 flex flex-wrap items-center gap-3 rounded-[32px] border border-black/5 bg-white/90 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
          <Button
            className="h-11 rounded-full px-5"
            disabled={isOejtsResult ? posterExporting : false}
            onClick={isOejtsResult ? () => void handleExportPoster() : handleSaveResult}
            type="button"
          >
            <Download className="size-4" />
            {isOejtsResult
              ? posterExporting
                ? "正在导出人格海报..."
                : posterExported
                  ? "人格海报已开始下载"
                  : "导出人格海报 PNG"
              : "保存结果"}
          </Button>
          {isOejtsResult ? (
            <Button className="h-11 rounded-full px-5" onClick={handleSaveResult} type="button" variant="outline">
              <Download className="size-4" />
              保存整页 / PDF
            </Button>
          ) : null}
          <Button className="h-11 rounded-full px-5" onClick={() => void handleCopyShare()} type="button" variant="outline">
            <Copy className="size-4" />
            {copied ? "已复制分享文案和结果链接" : "复制分享文案 + 结果链接"}
          </Button>
          <Button asChild className="h-11 rounded-full px-5" variant="outline">
            <Link to={`/${slug}/test`}>
              <RotateCcw className="size-4" />
              重新测试
            </Link>
          </Button>
          <Button asChild className="h-11 rounded-full px-5" variant="outline">
            <Link to="/">
              <Share2 className="size-4" />
              回到题集
            </Link>
          </Button>
          <div className="ml-auto max-w-md text-xs leading-6 text-slate-400">
            {isOejtsResult
              ? "现在支持一键导出上方人格海报为 PNG 图片；如果你需要完整长页，也可以继续保存为 PDF。"
              : "如果你在电脑上打开，点击“保存结果”会调起系统打印面板，可另存为 PDF。"}
            {posterExportError ? <p className="mt-1 text-rose-500">{posterExportError}</p> : null}
          </div>
        </section>
      </div>
    </div>
  )
}

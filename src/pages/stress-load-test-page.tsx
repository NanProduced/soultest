import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Brain, Sparkles, LoaderCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { submitQuizAnswers } from "@/features/quizzes/api"
import { writeQuizDraft, readQuizDraft, clearQuizDraft } from "@/features/quizzes/session"
import type { CustomQuizPageProps } from "@/features/quizzes/custom-pages"

export function StressLoadTestPage({ accessSession, runtime }: CustomQuizPageProps) {
  const navigate = useNavigate()
  const { slug } = runtime.meta
  const questions = runtime.questions
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load draft
  useEffect(() => {
    const draft = readQuizDraft(slug)
    if (draft && draft.answers && Object.keys(draft.answers).length > 0) {
      setAnswers(draft.answers)
      // Find first unanswered question
      const index = questions.findIndex((q: { id: string }) => !draft.answers[q.id])
      if (index !== -1) {
        setCurrentIndex(index)
      } else {
        setCurrentIndex(questions.length - 1)
      }
    }
  }, [slug, questions])

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  const handleSelect = (optionId: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: optionId }
    setAnswers(newAnswers)
    writeQuizDraft({ slug, answers: newAnswers, activeIndex: currentIndex })

    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300)
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const result = await submitQuizAnswers(slug, answers, accessSession.accessToken)
      clearQuizDraft(slug)
      navigate(`/${slug}/result/${result.submissionId}`)
    } catch (error) {
      console.error("Failed to submit answers:", error)
      setIsSubmitting(false)
    }
  }

  const isLastQuestion = currentIndex === questions.length - 1
  const allAnswered = questions.every((q: { id: string }) => !!answers[q.id])

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-fuchsia-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-12 md:py-20">
        {/* Header */}
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-blue-600 shadow-lg shadow-fuchsia-500/20">
              <Brain className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">压力负荷测试</h1>
              <p className="text-xs text-slate-400">正在评估您的心理系统状态</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black italic text-fuchsia-500">{currentIndex + 1}</span>
            <span className="text-sm font-medium text-slate-500"> / {questions.length}</span>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="mb-16 h-1.5 w-full overflow-hidden rounded-full bg-slate-800/50">
          <motion.div
            className="h-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "circOut" }}
          />
        </div>

        {/* Question Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col gap-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/5 px-3 py-1">
                <Sparkles className="size-3.5 text-fuchsia-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-400">
                  Dimension {Math.floor(currentIndex / 5) + 1}
                </span>
              </div>
              <h2 className="text-2xl font-bold leading-tight text-white md:text-3xl">
                {currentQuestion.title}
              </h2>
            </div>

            {/* Scale Labels */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>几乎没有</span>
              <span>几乎总是</span>
            </div>

            {/* Scale Options - OEJTS Style */}
            <div className="flex items-center justify-center gap-3 md:gap-6">
              {currentQuestion.options.map((option: { id: string; label: string }, index: number) => {
                const isSelected = answers[currentQuestion.id] === option.id
                const scaleSizes = [
                  "size-12 md:size-14",
                  "size-10 md:size-12",
                  "size-8 md:size-10",
                  "size-10 md:size-12",
                  "size-12 md:size-14",
                ]
                const scaleColors = [
                  "bg-sky-500",
                  "bg-sky-400",
                  "bg-slate-400",
                  "bg-fuchsia-400",
                  "bg-fuchsia-500",
                ]
                const colorClass = scaleColors[index]

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    className={cn(
                      "relative group transition-all duration-300 flex flex-col items-center gap-2",
                      scaleSizes[index] ?? "size-10"
                    )}
                  >
                    <motion.div
                      animate={
                        isSelected
                          ? {
                              scale: [1, 1.1, 1],
                              boxShadow: [
                                "0 0 0px rgba(255,255,255,0)",
                                "0 0 30px rgba(255,255,255,0.3)",
                                "0 0 0px rgba(255,255,255,0)",
                              ],
                            }
                          : {}
                      }
                      className={cn(
                        "absolute inset-0 rounded-full border-2 transition-all duration-300",
                        isSelected
                          ? `border-white scale-110 ${colorClass}`
                          : "border-slate-700 group-hover:border-slate-500 bg-slate-900/50"
                      )}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                    <span
                      className={cn(
                        "relative z-10 text-sm font-black transition-colors duration-300",
                        isSelected ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className={cn(
                      "text-[10px] transition-colors duration-300",
                      isSelected ? "text-white/80" : "text-slate-600 group-hover:text-slate-400"
                    )}>
                      {option.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Scale Description */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 mt-4">
              <span>1-2分（轻度）</span>
              <div className="h-px w-8 bg-slate-700" />
              <span>3分（中度）</span>
              <div className="h-px w-8 bg-slate-700" />
              <span>4-5分（重度）</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-16 flex items-center justify-between">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="size-4" />
            上一题
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || isSubmitting}
              className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-fuchsia-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/25 transition-all hover:shadow-fuchsia-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  提交中...
                </>
              ) : (
                <>
                  查看结果
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex(currentIndex + 1)}
              className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              下一题
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

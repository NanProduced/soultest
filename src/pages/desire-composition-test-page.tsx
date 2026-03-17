import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Sparkles, Heart, Crown, Gem, Brain, Leaf, UtensilsCrossed, Sparkle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { submitQuizAnswers } from "@/features/quizzes/api"
import { writeQuizDraft, readQuizDraft, clearQuizDraft } from "@/features/quizzes/session"
import type { CustomQuizPageProps } from "@/features/quizzes/custom-pages"

// Dimension icons mapping
const dimensionIcons: Record<string, React.ReactNode> = {
  M: <Gem className="size-4" />,
  P: <Crown className="size-4" />,
  L: <Heart className="size-4" />,
  B: <Sparkle className="size-4" />,
  F: <UtensilsCrossed className="size-4" />,
  K: <Brain className="size-4" />,
  S: <Leaf className="size-4" />,
}

// Dimension colors
const dimensionColors: Record<string, string> = {
  M: "#FFD700",
  P: "#FF4444",
  L: "#FF69B4",
  B: "#BF55EC",
  F: "#FF9A56",
  K: "#4A90D9",
  S: "#2ECC71",
}

export function DesireCompositionTestPage({ accessSession, runtime }: CustomQuizPageProps) {
  const navigate = useNavigate()
  const { slug } = runtime.meta
  const questions = runtime.questions
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [direction, setDirection] = useState(1)

  // Load draft
  useEffect(() => {
    const draft = readQuizDraft(slug)
    if (draft && draft.answers && Object.keys(draft.answers).length > 0) {
      setAnswers(draft.answers)
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

  // Calculate accumulated scores for mini pie chart preview
  const accumulatedScores = useMemo(() => {
    const scores: Record<string, number> = { M: 0, P: 0, L: 0, B: 0, F: 0, K: 0, S: 0 }
    Object.entries(answers).forEach(([qid, optid]) => {
      const q = questions.find((qq: { id: string }) => qq.id === qid)
      const opt = q?.options.find((o: { id: string }) => o.id === optid)
      if (opt?.value) {
        Object.entries(opt.value as Record<string, number>).forEach(([key, val]) => {
          scores[key] = (scores[key] || 0) + val
        })
      }
    })
    return scores
  }, [answers, questions])

  const handleSelect = (optionId: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: optionId }
    setAnswers(newAnswers)
    writeQuizDraft({ slug, answers: newAnswers, activeIndex: currentIndex })

    if (currentIndex < questions.length - 1) {
      setDirection(1)
      setTimeout(() => setCurrentIndex(currentIndex + 1), 400)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const result = await submitQuizAnswers(slug, answers, accessSession.code)
      clearQuizDraft(slug)
      navigate(`/${slug}/result/${result.submissionId}`)
    } catch (error) {
      console.error("Failed to submit answers:", error)
      setIsSubmitting(false)
    }
  }

  const isLastQuestion = currentIndex === questions.length - 1
  const allAnswered = questions.every((q: { id: string }) => !!answers[q.id])

  // Get current question's options with dimension info
  const currentOptions = currentQuestion?.options || []

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-slate-100 selection:bg-fuchsia-500/30 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-pink-600/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-blue-600/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-2xl px-6 py-8 md:py-12">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-pink-500 shadow-lg shadow-fuchsia-500/20">
              <Sparkles className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white">你的欲望组成图</h1>
              <p className="text-[10px] text-slate-400">Desire Composition</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Mini Pie Chart Preview */}
            <div className="relative w-12 h-12">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {Object.entries(accumulatedScores).reduce(
                  (acc, [key, score]) => {
                    const total = Object.values(accumulatedScores).reduce((a, b) => a + b, 0)
                    if (total === 0) return acc
                    const percentage = score / total
                    const startAngle = acc.currentAngle
                    const endAngle = startAngle + percentage * 360
                    const largeArc = percentage > 0.5 ? 1 : 0
                    const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180)
                    const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180)
                    const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180)
                    const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180)
                    acc.paths.push(
                      <path
                        key={key}
                        d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={dimensionColors[key]}
                        opacity={score > 0 ? 0.9 : 0.2}
                        className="transition-all duration-500"
                      />
                    )
                    acc.currentAngle = endAngle
                    return acc
                  },
                  { paths: [] as React.ReactNode[], currentAngle: 0 }
                ).paths}
                <circle cx="50" cy="50" r="20" fill="#0a0a1a" />
              </svg>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black italic text-fuchsia-400">{currentIndex + 1}</span>
              <span className="text-sm font-medium text-slate-500"> / {questions.length}</span>
            </div>
          </div>
        </header>

        {/* Rainbow Progress Bar */}
        <div className="mb-10 h-2 w-full overflow-hidden rounded-full bg-slate-800/50">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-400 via-red-500 via-pink-500 via-purple-500 via-blue-500 to-green-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "circOut" }}
          />
        </div>

        {/* Question Area */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            {/* Question */}
            <div className="text-center mb-4">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                <Sparkles className="size-3 text-fuchsia-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-400">
                  第 {currentIndex + 1} 题
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold leading-relaxed text-white mb-2">
                {currentQuestion.title}
              </h2>
              <p className="text-xs text-slate-500">{currentQuestion.description || "凭直觉选，别想太多"}</p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentOptions.map((option: { id: string; label: string; value?: Record<string, unknown> }, idx: number) => {
                const isSelected = answers[currentQuestion.id] === option.id
                // Extract primary dimension from value
                const primaryDim = Object.keys((option.value as Record<string, number>) || {})[0]
                const dimColor = dimensionColors[primaryDim] || "#888"

                return (
                  <motion.button
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "w-full relative overflow-hidden rounded-2xl border-2 p-5 text-left transition-all duration-300",
                      isSelected
                        ? "border-fuchsia-500 bg-fuchsia-500/20 shadow-lg shadow-fuchsia-500/20"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                    )}
                  >
                    {/* Selected indicator */}
                    {isSelected && (
                      <motion.div
                        layoutId="selected"
                        className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/10 to-purple-500/10"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    <div className="relative flex items-center gap-4">
                      {/* Dimension icon */}
                      <div
                        className="flex size-10 items-center justify-center rounded-xl shrink-0"
                        style={{ backgroundColor: `${dimColor}20`, color: dimColor }}
                      >
                        {dimensionIcons[primaryDim] || <Sparkle className="size-5" />}
                      </div>

                      {/* Option text */}
                      <span className={cn(
                        "flex-1 text-base font-medium",
                        isSelected ? "text-white" : "text-slate-300"
                      )}>
                        {option.label}
                      </span>

                      {/* Radio indicator */}
                      <div className={cn(
                        "flex size-6 items-center justify-center rounded-full border-2 transition-all duration-300 shrink-0",
                        isSelected
                          ? "border-fuchsia-500 bg-fuchsia-500"
                          : "border-slate-600"
                      )}>
                        {isSelected && <div className="size-2 rounded-full bg-white" />}
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="size-4" />
            上一题
          </button>

          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || isSubmitting}
              className="relative overflow-hidden rounded-xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/25 transition-all hover:shadow-fuchsia-500/40 disabled:opacity-50"
            >
              {isSubmitting ? (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  生成中...
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Sparkles className="size-4" />
                  查看我的欲望图谱
                </motion.div>
              )}
            </Button>
          ) : (
            <div className="text-sm text-slate-500">
              选择后继续
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

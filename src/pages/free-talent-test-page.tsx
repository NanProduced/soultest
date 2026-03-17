import { useState } from "react"
import { useNavigate } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Sparkles } from "lucide-react"

import { FreeQuizRuntimeLoadingScreen, FreeQuizRuntimeUnavailableScreen, useFreeQuizRuntime } from "@/features/free-quizzes/runtime"
import { calculateTalentResult } from "@/features/free-quizzes/runtime-calculators"

type DimensionScores = {
  insight: number
  empathy: number
  creativity: number
  expression: number
  action: number
  perception: number
}

export function FreeTalentTestPage() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [scores, setScores] = useState<DimensionScores>({
    insight: 0,
    empathy: 0,
    creativity: 0,
    expression: 0,
    action: 0,
    perception: 0
  })
  const [isTransitioning, setIsTransitioning] = useState(false)
  const { freeRuntime, isLoading, error } = useFreeQuizRuntime("free/talent")

  const talentQuestions = (freeRuntime?.questionSet ?? []) as Array<{
    id: string
    title: string
    options: Array<{ label: string; primaryDimension: string; secondaryDimension: string }>
  }>
  const talentResults = (freeRuntime?.resultMap ?? {}) as Record<string, {
    primaryTalent: string
    secondaryTalentCondition: string[]
  }>
  const currentQuestion = talentQuestions[currentIndex]
  const progress = talentQuestions.length > 0 ? (currentIndex / talentQuestions.length) * 100 : 0

  if (isLoading) {
    return <FreeQuizRuntimeLoadingScreen className="bg-slate-950 text-white" />
  }

  if (error || !currentQuestion) {
    return <FreeQuizRuntimeUnavailableScreen className="bg-slate-950 text-white" backTo="/free/talent" />
  }

  const handleOptionClick = (primaryDimension: string, secondaryDimension: string) => {
    if (isTransitioning) return

    setIsTransitioning(true)
    
    const newScores = {
      ...scores,
      [primaryDimension]: scores[primaryDimension as keyof DimensionScores] + 2,
      [secondaryDimension]: scores[secondaryDimension as keyof DimensionScores] + 1
    }
    
    setScores(newScores)

    setTimeout(() => {
      if (currentIndex < talentQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setIsTransitioning(false)
      } else {
        const resultKey = calculateTalentResult(newScores, talentResults)
        navigate(`/free/talent/result?key=${resultKey}`, { replace: true })
      }
    }, 400)
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      navigate(-1)
    } else {
      navigate("/free/talent")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white selection:bg-amber-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,_rgba(251,191,36,0.08),_transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_100%,_rgba(139,92,246,0.08),_transparent_50%)] pointer-events-none" />

      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <button
          onClick={handleBack}
          className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="flex items-center gap-2 text-sm font-medium tracking-[0.2em] text-white/50">
          <Sparkles className="size-4 text-amber-400" />
          {currentIndex + 1} <span className="text-white/20">/</span> {talentQuestions.length}
        </div>
        <div className="size-10" />
      </header>

      <div className="relative z-10 h-1.5 w-full bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12 lg:py-24">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col items-center"
            >
              <div className="mb-8 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20">
                  <Sparkles className="size-6 text-white" />
                </div>
                <div className="h-px w-16 bg-gradient-to-r from-amber-400/50 to-transparent" />
              </div>

              <h2 className="mb-16 text-center font-serif text-2xl font-bold leading-relaxed tracking-tight text-white md:text-3xl lg:text-4xl lg:leading-[1.4]">
                {currentQuestion.title}
              </h2>

              <div className="w-full space-y-4">
                {currentQuestion.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleOptionClick(option.primaryDimension, option.secondaryDimension)}
                    className="group relative flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition-all hover:border-amber-400/50 hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-orange-500/10 active:scale-[0.98] hover:shadow-[0_8px_30px_rgba(251,191,36,0.15)]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                  >
                    <span className="text-base text-white/90 group-hover:text-white md:text-lg leading-relaxed">
                      {option.label}
                    </span>
                    <div className="ml-6 flex size-8 shrink-0 items-center justify-center rounded-full border border-white/20 transition-all group-hover:border-amber-400 group-hover:bg-amber-400/10">
                      <motion.div
                        className="size-3 rounded-full bg-amber-400 opacity-0 transition-opacity"
                        whileHover={{ opacity: 1, scale: 1.2 }}
                      />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="relative z-10 px-6 py-8 text-center">
        <p className="text-xs text-white/30 tracking-wider uppercase">
          凭直觉选择，没有标准答案
        </p>
      </footer>
    </div>
  )
}


import { useState } from "react"
import { useNavigate } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, MapPin } from "lucide-react"

import { FreeQuizRuntimeLoadingScreen, FreeQuizRuntimeUnavailableScreen, useFreeQuizRuntime } from "@/features/free-quizzes/runtime"
import { calculateSoulCityResult } from "@/features/free-quizzes/runtime-calculators"

const chapterNames = [
  { start: 1, end: 6, title: "觉醒", subtitle: "清晨的第一缕光" },
  { start: 7, end: 12, title: "漫步", subtitle: "走进这座城" },
  { start: 13, end: 18, title: "相遇", subtitle: "与城市里的人" },
  { start: 19, end: 24, title: "沉浸", subtitle: "生活的质感" },
  { start: 25, end: 30, title: "归属", subtitle: "灵魂的锚点" },
]

export function FreeSoulCityTestPage() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [scores, setScores] = useState({ R: 0, A: 0, S: 0, O: 0, E: 0 })
  const [isTransitioning, setIsTransitioning] = useState(false)
  const { freeRuntime, isLoading, error } = useFreeQuizRuntime("free/soul-city")

  const soulCityQuestions = (freeRuntime?.questionSet ?? []) as Array<{
    id: number
    title: string
    options: Array<{ label: string; scores: { R: number; A: number; S: number; O: number; E: number } }>
  }>
  const soulCityResults = (freeRuntime?.resultMap ?? {}) as Record<string, { fiveDimension: Record<string, number> }>
  const currentQuestion = soulCityQuestions[currentIndex]
  const progress = soulCityQuestions.length > 0 ? ((currentIndex + 1) / soulCityQuestions.length) * 100 : 0

  if (isLoading) {
    return <FreeQuizRuntimeLoadingScreen className="bg-[#050510] text-white" />
  }

  if (error || !currentQuestion) {
    return <FreeQuizRuntimeUnavailableScreen className="bg-[#050510] text-white" backTo="/free/soul-city" />
  }
  
  const currentChapter = chapterNames.find(
    ch => currentQuestion.id >= ch.start && currentQuestion.id <= ch.end
  )

  const handleOptionClick = (optionScores: { R: number; A: number; S: number; O: number; E: number }) => {
    if (isTransitioning) return

    setIsTransitioning(true)
    
    const newScores = {
      R: scores.R + optionScores.R,
      A: scores.A + optionScores.A,
      S: scores.S + optionScores.S,
      O: scores.O + optionScores.O,
      E: scores.E + optionScores.E,
    }
    
    setScores(newScores)

    setTimeout(() => {
      if (currentIndex < soulCityQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setIsTransitioning(false)
      } else {
        const resultKey = calculateSoulCityResult(newScores, soulCityResults)
        navigate(`/free/soul-city/result?key=${resultKey}`, { replace: true })
      }
    }, 400)
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      navigate(-1)
    } else {
      navigate("/free/soul-city")
    }
  }

  return (
    <div className="min-h-screen bg-[#050510] text-white flex flex-col selection:bg-sky-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,_rgba(14,165,233,0.08),_transparent_50%)] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <button
          onClick={handleBack}
          className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="size-5" />
        </button>
        
        <div className="flex flex-col items-center">
          <div className="text-xs text-white/40 uppercase tracking-widest mb-1">
            {currentChapter?.title} · {currentChapter?.subtitle}
          </div>
          <div className="text-sm font-medium tracking-[0.2em] text-white/50">
            {currentIndex + 1} <span className="text-white/20">/</span> {soulCityQuestions.length}
          </div>
        </div>

        <div className="size-10 flex items-center justify-center">
          <MapPin className="size-5 text-sky-400/50" />
        </div>
      </header>

      {/* Progress Bar */}
      <div className="relative z-10 h-1.5 w-full bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-sky-500 via-blue-500 to-orange-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question Area */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12 lg:py-24">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              {/* Chapter Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/50"
              >
                {currentChapter?.title} · {currentChapter?.subtitle}
              </motion.div>

              <h2 className="mb-12 text-center font-serif text-2xl font-bold leading-relaxed tracking-tight text-white md:text-3xl lg:text-4xl lg:leading-[1.4]">
                {currentQuestion.title}
              </h2>

              <div className="w-full space-y-4">
                {currentQuestion.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    onClick={() => handleOptionClick(option.scores)}
                    className="group relative flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6 text-left transition-all hover:border-sky-500/50 hover:bg-white/10 active:scale-[0.98] hover:shadow-[0_8px_30px_rgba(14,165,233,0.12)]"
                  >
                    <span className="text-base text-white/90 group-hover:text-white md:text-lg leading-relaxed pr-4">
                      {option.label}
                    </span>
                    <div className="ml-4 flex size-6 shrink-0 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-sky-400">
                      <div className="size-2.5 rounded-full bg-sky-400 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Progress Dots */}
      <div className="relative z-10 pb-6 flex justify-center gap-1.5 md:hidden">
        {chapterNames.map((ch, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              currentQuestion.id >= ch.start && currentQuestion.id <= ch.end
                ? "w-8 bg-gradient-to-r from-sky-500 to-blue-500"
                : currentQuestion.id > ch.end
                ? "w-1.5 bg-white/30"
                : "w-1.5 bg-white/10"
            }`}
          />
        ))}
      </div>
    </div>
  )
}


import { useState } from "react"
import { useNavigate } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft } from "lucide-react"

import { auraQuestions, calculateAuraResult } from "@/features/free-quizzes/aura-data"

export function FreeAuraTestPage() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [scoreA, setScoreA] = useState(0)
  const [scoreB, setScoreB] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const currentQuestion = auraQuestions[currentIndex]
  const progress = ((currentIndex) / auraQuestions.length) * 100

  const handleOptionClick = (a: number, b: number) => {
    if (isTransitioning) return

    setIsTransitioning(true)
    
    // Accumulate scores
    const newScoreA = scoreA + a
    const newScoreB = scoreB + b
    
    setScoreA(newScoreA)
    setScoreB(newScoreB)

    setTimeout(() => {
      if (currentIndex < auraQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setIsTransitioning(false)
      } else {
        // Test finished
        const resultKey = calculateAuraResult(newScoreA, newScoreB)
        navigate(`/free/aura/result?key=${resultKey}`, { replace: true })
      }
    }, 400) // slight delay for animation
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      // NOTE: For simplicity we don't store score history here so back button is disabled.
      // But we can just let them go back to intro if at Q1.
      navigate(-1)
    } else {
      navigate("/free/aura")
    }
  }

  return (
    <div className="min-h-screen bg-[#060010] text-white flex flex-col selection:bg-fuchsia-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(168,85,247,0.1),_transparent_50%)] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <button
          onClick={handleBack}
          className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="text-sm font-medium tracking-[0.2em] text-white/50">
          {currentIndex + 1} <span className="text-white/20">/</span> {auraQuestions.length}
        </div>
        <div className="size-10" /> {/* Spacer */}
      </header>

      {/* Progress Bar */}
      <div className="relative z-10 h-1.5 w-full bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-fuchsia-500 to-amber-400"
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
              <h2 className="mb-12 text-center font-serif text-2xl font-bold leading-relaxed tracking-tight text-white md:text-3xl lg:text-4xl lg:leading-[1.4]">
                {currentQuestion.title}
              </h2>

              <div className="w-full space-y-4">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(option.a, option.b)}
                    className="group relative flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6 text-left transition-all hover:border-fuchsia-500/50 hover:bg-white/10 active:scale-[0.98] hover:shadow-[0_8px_30px_rgba(168,85,247,0.12)]"
                  >
                    <span className="text-base text-white/90 group-hover:text-white md:text-lg leading-relaxed">
                      {option.label}
                    </span>
                    <div className="ml-6 flex size-6 shrink-0 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-fuchsia-400">
                      <div className="size-2.5 rounded-full bg-fuchsia-400 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

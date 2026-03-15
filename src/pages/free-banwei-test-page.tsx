import { useState } from "react"
import { useNavigate } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft } from "lucide-react"

import { banweiQuestions, calculateBanweiResult } from "@/features/free-quizzes/banwei-data"

export function FreeBanweiTestPage() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  
  // Track total score and individual dimensions
  const [totalScore, setTotalScore] = useState(0)
  const [dimensions, setDimensions] = useState({
    caffeine: 0,
    kpiInvasion: 0,
    mentalDrain: 0,
    deskBond: 0,
    lifeFade: 0
  })
  
  const [isTransitioning, setIsTransitioning] = useState(false)

  const currentQuestion = banweiQuestions[currentIndex]
  const progress = ((currentIndex) / banweiQuestions.length) * 100

  const handleOptionClick = (score: number, dimension: string) => {
    if (isTransitioning) return

    setIsTransitioning(true)
    
    // Accumulate scores
    const newTotal = totalScore + score
    const newDimensions = { ...dimensions, [dimension]: dimensions[dimension as keyof typeof dimensions] + score }
    
    setTotalScore(newTotal)
    setDimensions(newDimensions)

    setTimeout(() => {
      if (currentIndex < banweiQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setIsTransitioning(false)
      } else {
        // Test finished - construct results URL safely
        // In a real app we might pass this via context or state, but URL search params work for shareable stateless results.
        const { levelKey } = calculateBanweiResult(newTotal)
        const dims = `${newDimensions.caffeine}-${newDimensions.kpiInvasion}-${newDimensions.mentalDrain}-${newDimensions.deskBond}-${newDimensions.lifeFade}`
        navigate(`/free/banwei/result?key=${levelKey}&score=${newTotal}&dims=${dims}`, { replace: true })
      }
    }, 400)
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      navigate(-1)
    } else {
      navigate("/free/banwei")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-sky-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <button
          onClick={handleBack}
          className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 shadow-sm"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="text-sm font-medium tracking-[0.2em] text-slate-400">
          {currentIndex + 1} <span className="text-slate-300">/</span> {banweiQuestions.length}
        </div>
        <div className="size-10" /> {/* Spacer */}
      </header>

      {/* Progress Bar */}
      <div className="relative z-10 h-1.5 w-full bg-slate-200">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500"
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-8 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-500 font-medium">
                检测指标：{currentQuestion.dimension === 'caffeine' ? '咖啡因依赖' : 
                         currentQuestion.dimension === 'kpiInvasion' ? 'KPI渗透率' : 
                         currentQuestion.dimension === 'mentalDrain' ? '精神内耗' : 
                         currentQuestion.dimension === 'deskBond' ? '工位依赖' : '生活褪色'}
              </div>

              <h2 className="mb-12 text-center font-sans text-2xl font-bold leading-relaxed tracking-tight text-slate-900 md:text-3xl lg:text-4xl lg:leading-[1.4]">
                {currentQuestion.title}
              </h2>

              <div className="w-full space-y-4">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(option.score, currentQuestion.dimension)}
                    className="group relative flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 md:p-6 text-left transition-all hover:border-sky-400 hover:shadow-[0_8px_30px_rgba(14,165,233,0.12)] active:scale-[0.98]"
                  >
                    <span className="text-base text-slate-700 group-hover:text-slate-900 md:text-lg leading-relaxed font-medium">
                      {option.label}
                    </span>
                    <div className="ml-6 flex size-6 shrink-0 items-center justify-center rounded-full border border-slate-300 transition-colors group-hover:border-sky-500">
                      <div className="size-2.5 rounded-full bg-sky-500 opacity-0 transition-opacity group-hover:opacity-100" />
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

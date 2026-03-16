import { useState } from "react"
import { useNavigate } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Sparkles } from "lucide-react"

import { paintingQuestions, calculatePaintingResult } from "@/features/free-quizzes/painting-data"

export function FreePaintingTestPage() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)

  const currentQuestion = paintingQuestions[currentIndex]
  const progress = ((currentIndex) / paintingQuestions.length) * 100

  const handleOptionClick = (choiceIndex: number) => {
    if (isTransitioning) return

    setIsTransitioning(true)
    
    const newAnswers = [...answers, choiceIndex]
    setAnswers(newAnswers)

    setTimeout(() => {
      if (currentIndex < paintingQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setIsTransitioning(false)
      } else {
        // Test finished
        const result = calculatePaintingResult(newAnswers)
        // We'll pass the result data via state or just the ID in the URL
        // To make it easy, we store in session/localStorage or just pass primary ID
        navigate(`/free/painting/result?id=${result.primary.id}&answers=${newAnswers.join(',')}`, { replace: true })
      }
    }, 400)
  }

  return (
    <div className="min-h-screen bg-[#060010] text-white flex flex-col selection:bg-indigo-500/30 overflow-hidden relative">
      {/* Dynamic background effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,_rgba(79,70,229,0.1),_transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 pointer-events-none mix-blend-overlay" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="flex items-center gap-3">
          <Sparkles className="size-4 text-indigo-400" />
          <div className="text-sm font-medium tracking-[0.2em] text-white/50">
            {currentIndex + 1} <span className="text-white/20">/</span> {paintingQuestions.length}
          </div>
        </div>
        <div className="size-10" />
      </header>

      {/* Progress Bar */}
      <div className="relative z-10 h-1 w-full bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question Area */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col"
            >
              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 opacity-80">
                  Question {currentIndex + 1}
                </span>
              </div>
              
              <h2 className="mb-12 text-2xl md:text-3xl font-serif font-bold leading-relaxed tracking-tight text-white lg:text-4xl lg:leading-[1.4]">
                {currentQuestion.title}
              </h2>

              <div className="w-full space-y-4">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(idx)}
                    className="group relative flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6 text-left transition-all hover:border-indigo-500/50 hover:bg-white/10 active:scale-[0.98] shadow-lg overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-white/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-100%] group-hover:translate-x-[100%] duration-1000" />
                    
                    <span className="text-base text-white/90 group-hover:text-white md:text-lg leading-relaxed relative z-10">
                      {option.label}
                    </span>
                    
                    <div className="ml-6 flex size-6 shrink-0 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-indigo-400 relative z-10">
                      <div className="size-2.5 rounded-full bg-indigo-400 scale-0 transition-transform group-hover:scale-100" />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Decorative element */}
      <div className="absolute bottom-12 right-12 size-64 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-12 left-12 size-64 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  )
}

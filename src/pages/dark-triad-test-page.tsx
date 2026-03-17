import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navigate, useNavigate } from "react-router"
import { ArrowLeft } from "lucide-react"

import type { CustomQuizPageProps } from "@/features/quizzes/custom-pages"
import { submitQuizAnswers } from "@/features/quizzes/api"
import { sd3Archetypes } from "@/features/quizzes/sd3-content"

export function DarkTriadTestPage({ accessSession, runtime }: CustomQuizPageProps) {
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [showChapterIntro, setShowChapterIntro] = useState(true)

  const questions = runtime.questions as Array<{ id: string; chapter: number; text: string; trait: string; reverse: boolean }>
  const totalQuestions = questions.length
  const currentQuestion = questions[activeIndex]

  const chapters = [
    { title: "第一部分", desc: "不需要你给出正确答案，只需要诚实面对自己。" },
    { title: "第二部分", desc: "第一组完成。接下来，我们聊聊你对自我价值和被关注的态度。" },
    { title: "第三部分", desc: "还剩最后一组。这一组会更直接——准备好了吗？" }
  ]

  const currentChapterIndex = currentQuestion?.chapter - 1 || 0
  const chapterInfo = chapters[currentChapterIndex]

  const progress = ((activeIndex) / totalQuestions) * 100

  async function handleAnswer(value: number) {
    if (submitting) return

    const newAnswers = { ...answers, [currentQuestion.id]: value }
    setAnswers(newAnswers)

    if (activeIndex < totalQuestions - 1) {
      const nextQuestion = questions[activeIndex + 1]
      if (nextQuestion.chapter !== currentQuestion.chapter) {
        setShowChapterIntro(true)
      }
      setActiveIndex(activeIndex + 1)
    } else {
      setSubmitting(true)
      try {
        // Evaluate SD3 logic locally for the result key
        const scores = { mach: 0, narc: 0, psych: 0 }
        const counts = { mach: 0, narc: 0, psych: 0 }
        
        for (const q of questions) {
          const raw = newAnswers[q.id] || 3
          const finalScore = q.reverse ? 6 - raw : raw
          scores[q.trait as keyof typeof scores] += finalScore
          counts[q.trait as keyof typeof counts] += 1
        }
        
        const avgs = {
          mach: scores.mach / counts.mach,
          narc: scores.narc / counts.narc,
          psych: scores.psych / counts.psych
        }
        
        let archetypeCode = "A9"
        if (avgs.mach >= 3.4 && avgs.narc >= 3.4 && avgs.psych >= 3.4) archetypeCode = "A7"
        else if (avgs.mach >= 3.4 && avgs.narc >= 3.4) archetypeCode = "A4"
        else if (avgs.mach >= 3.4 && avgs.psych >= 3.4) archetypeCode = "A5"
        else if (avgs.narc >= 3.4 && avgs.psych >= 3.4) archetypeCode = "A6"
        else if (avgs.mach >= 3.4) archetypeCode = "A1"
        else if (avgs.narc >= 3.4) archetypeCode = "A2"
        else if (avgs.psych >= 3.4) archetypeCode = "A3"
        else if (avgs.mach >= 2.2 || avgs.narc >= 2.2 || avgs.psych >= 2.2) archetypeCode = "A8"

        const clientInfo = {
          archetypeCode,
          avgs
        }

        const submission = await submitQuizAnswers("dark-triad", newAnswers, 120, clientInfo)
        navigate(`/dark-triad/result/${submission.submissionId}`, { replace: true })
      } catch (error) {
        alert("提交失败，请重试")
        setSubmitting(false)
      }
    }
  }

  if (showChapterIntro) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#09090B] px-6 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md text-center"
        >
          <div className="mb-4 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-slate-300">
            {chapterInfo.title}
          </div>
          <p className="text-xl font-medium leading-relaxed text-slate-200">
            {chapterInfo.desc}
          </p>
          <button
            onClick={() => setShowChapterIntro(false)}
            className="mt-8 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-black transition-transform hover:scale-105"
          >
            继续
          </button>
        </motion.div>
      </div>
    )
  }

  if (submitting) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#09090B] px-6 text-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center text-center"
        >
          <div className="flex gap-4 mb-8">
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="size-12 rounded-full bg-[#4A3B6B] flex items-center justify-center text-xl">♟️</motion.div>
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="size-12 rounded-full bg-[#C5A029] flex items-center justify-center text-xl">👑</motion.div>
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="size-12 rounded-full bg-[#8B1A1A] flex items-center justify-center text-xl">🗡️</motion.div>
          </div>
          <p className="text-lg font-medium text-slate-300">正在分析你的三维暗面结构…</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#09090B] text-white">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
        <button
          className="inline-flex size-10 items-center justify-center rounded-full bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          onClick={() => {
             if (activeIndex > 0) setActiveIndex(activeIndex - 1)
             else navigate(-1)
          }}
          type="button"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="text-sm font-medium tracking-widest text-slate-500">
          {activeIndex + 1} / {totalQuestions}
        </div>
        <div className="size-10" />
      </header>

      {/* Progress */}
      <div className="h-1 w-full bg-white/5">
        <div 
           className="h-full bg-gradient-to-r from-[#4A3B6B] via-[#C5A029] to-[#8B1A1A] transition-all duration-300"
           style={{ width: `${progress}%` }} 
        />
      </div>

      {/* Question Area */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <h2 className="mb-12 text-center text-2xl font-medium leading-relaxed text-white sm:text-3xl">
                {currentQuestion.text}
              </h2>

              <div className="w-full space-y-3">
                {[
                  { value: 5, label: "完全同意" },
                  { value: 4, label: "比较同意" },
                  { value: 3, label: "不确定 / 一般" },
                  { value: 2, label: "比较不同意" },
                  { value: 1, label: "完全不同意" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    className="group relative flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 text-base font-medium text-slate-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-[0.98]"
                  >
                    {opt.label}
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

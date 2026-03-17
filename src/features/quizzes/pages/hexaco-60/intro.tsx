import { useEffect, useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { motion } from "framer-motion"
import { Network, Sparkles, ChevronDown } from "lucide-react"

import { AccessCodeDialog } from "@/components/quiz/access-code-dialog"
import { QuizUnifiedPortal } from "@/components/quiz/quiz-unified-portal"
import { Spotlight } from "@/components/ui/spotlight"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { fetchQuizIntro, verifyAccessCode } from "@/features/quizzes/api"
import { readAccessSession, writeAccessSession } from "@/features/quizzes/session"
import type { QuizIntro } from "@/features/quizzes/types"
import type { CustomIntroPageProps } from "@/features/quizzes/pages/registry"

export default function HexacoIntroPage({ slug }: CustomIntroPageProps) {
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState<QuizIntro>()
  const [loading, setLoading] = useState(true)
  const [accessErrorMessage, setAccessErrorMessage] = useState<string>()
  const [code, setCode] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    const session = readAccessSession()
    if (session?.allowedQuizzes.some((item) => item.slug === slug)) {
      setCode(session.code)
    }

    let active = true
    async function load() {
      try {
        const item = await fetchQuizIntro(slug)
        if (active) setQuiz(item)
      } catch { /* Silent */ } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [slug])

  async function handleStart(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedCode = code.trim().toUpperCase()
    if (!normalizedCode || !slug) {
      setAccessErrorMessage("请输入验证码后再开始测试")
      return
    }
    setVerifying(true)
    try {
      const session = await verifyAccessCode(normalizedCode)
      if (!session.allowedQuizzes.some((item) => item.slug === slug)) {
        throw new Error("当前验证码未授权这套测试")
      }
      writeAccessSession(session)
      navigate(`/${slug}/test`)
    } catch (error) {
      setAccessErrorMessage(error instanceof Error ? error.message : "验证码验证失败")
    } finally {
      setVerifying(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-[#020617]" />

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-emerald-500/30 overflow-x-hidden flex flex-col items-center">
      
      {/* 1. Dynamic Aurora Background */}
      <AuroraBackground className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/20 via-transparent to-[#020617]" />
      </AuroraBackground>

      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(16, 185, 129, 0.15)" />

      {/* 2. Hero Content - Flexible Layout */}
      <main className="relative z-10 w-full max-w-6xl px-6 pt-32 pb-40 flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 mb-8 px-5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-xl">
            <Network className="size-3.5 text-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-300">
              Dimensional Audit Standard
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9] select-none">
            HEXACO<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              人格解析
            </span>
          </h1>

          <div className="max-w-2xl mx-auto h-24 mb-16">
            <TextGenerateEffect 
              words="超越大五人格 · 引入诚实与谦逊的第六维度" 
              className="text-lg md:text-xl text-slate-400 font-light tracking-[0.1em] uppercase leading-relaxed"
            />
          </div>
        </motion.div>

        {/* 3. The Activation Portal - Now Side-by-Side on Desktop */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full flex justify-center"
        >
          <QuizUnifiedPortal 
            onStart={() => setDialogOpen(true)}
            accentColor="emerald"
            purchaseUrl="https://xhslink.com/m/8Hcapw8hyDn"
          />
        </motion.div>

        {/* 4. Scroll Indicator or Trust Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 2 }}
          className="mt-20 flex flex-col items-center gap-4 text-slate-500"
        >
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">60-Item Advanced Scale</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <Network className="size-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Deep Radar Analysis</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer Decoration */}
      <footer className="w-full py-12 border-t border-white/5 bg-black/20 text-center relative z-10">
        <p className="text-[9px] text-white/10 uppercase tracking-[0.6em]">SoulTest Audit · Scientific Excellence</p>
      </footer>

      <AccessCodeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleStart}
        value={code}
        onValueChange={setCode}
        submitting={verifying}
        errorMessage={accessErrorMessage}
        title="验证开启测试"
        description="身份验证成功后即可开始 60 题进阶人格测试。"
      />
    </div>
  )
}

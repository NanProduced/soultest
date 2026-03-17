import { useEffect, useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { motion } from "framer-motion"
import { Eye, Lock, ShieldCheck, Sparkles } from "lucide-react"

import { AccessCodeDialog } from "@/components/quiz/access-code-dialog"
import { QuizUnifiedPortal } from "@/components/quiz/quiz-unified-portal"
import { Spotlight } from "@/components/ui/spotlight"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { fetchQuizIntro, verifyAccessCode } from "@/features/quizzes/api"
import { readAccessSession, writeAccessSession } from "@/features/quizzes/session"
import type { QuizIntro } from "@/features/quizzes/types"
import type { CustomIntroPageProps } from "@/features/quizzes/pages/registry"

export default function DarkTriadIntroPage({ slug }: CustomIntroPageProps) {
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

  if (loading) return <div className="min-h-screen bg-black" />

  return (
    <div className="min-h-screen bg-black text-white selection:bg-rose-500/30 overflow-x-hidden flex flex-col items-center font-sans">
      
      {/* 1. Immersive Noir Background */}
      <AuroraBackground className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        {/* Scanning Line Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-10 bg-[length:100%_4px,3px_100%] pointer-events-none" />
      </AuroraBackground>

      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(225, 29, 72, 0.12)" />

      {/* 2. Hero Content - "Confidential Archive" Layout */}
      <main className="relative z-10 w-full max-w-6xl px-6 pt-32 pb-40 flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 mb-10 px-5 py-1.5 rounded-md border border-rose-500/20 bg-rose-500/5 backdrop-blur-md">
            <Lock className="size-3.5 text-rose-600 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500">
              Confidential Psychological Audit
            </span>
          </div>

          <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.85] select-none text-stone-200">
            凝视<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-700 via-stone-500 to-stone-700">
              幽暗之镜
            </span>
          </h1>

          <div className="max-w-2xl mx-auto h-24 mb-16">
            <TextGenerateEffect 
              words="每个人都有不愿承认的那一面 · 解密你的生存策略与博弈本能" 
              className="text-lg md:text-xl text-stone-500 font-light tracking-[0.15em] uppercase leading-relaxed italic"
            />
          </div>
        </motion.div>

        {/* 3. The Activation Portal - Noir Theme */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full flex justify-center"
        >
          <QuizUnifiedPortal 
            onStart={() => setDialogOpen(true)}
            accentColor="fuchsia" // Closest to crimson/dark rose
            purchaseUrl="https://xhslink.com/m/8Hcapw8hyDn"
          />
        </motion.div>

        {/* 4. Strategic Footer Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 2 }}
          className="mt-24 flex flex-col items-center gap-6"
        >
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-2">
              <Eye className="size-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Dark Triad Model</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Private Archive</span>
            </div>
          </div>
          <p className="max-w-md text-center text-[11px] text-stone-600 leading-relaxed font-medium">
            本报告包含对人格阴影面的尖锐拆解。建议在心理韧性稳定的状态下开启，<br />
            结果仅供个人探索与人际博弈复盘参考。
          </p>
        </motion.div>
      </main>

      {/* Secret Archive Seal */}
      <footer className="w-full py-16 border-t border-white/5 bg-black/40 text-center relative z-10">
        <div className="flex justify-center mb-6 opacity-20">
          <Sparkles className="size-5 text-rose-900" />
        </div>
        <p className="text-[9px] text-stone-700 uppercase tracking-[0.8em] font-black">
          Top Secret · SoulTest Intelligence Division
        </p>
      </footer>

      <AccessCodeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleStart}
        value={code}
        onValueChange={setCode}
        submitting={verifying}
        errorMessage={accessErrorMessage}
        title="身份审计"
        description="身份验证成功后，将为您解锁私密的暗面人格报告。"
      />
    </div>
  )
}

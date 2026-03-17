import { useEffect, useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { motion } from "framer-motion"
import { Heart, Sparkles, MessageCircle, ShieldCheck } from "lucide-react"

import { AccessCodeDialog } from "@/components/quiz/access-code-dialog"
import { QuizUnifiedPortal } from "@/components/quiz/quiz-unified-portal"
import { Spotlight } from "@/components/ui/spotlight"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { fetchQuizIntro, verifyAccessCode } from "@/features/quizzes/api"
import { readAccessSession, writeAccessSession } from "@/features/quizzes/session"
import type { QuizIntro } from "@/features/quizzes/types"
import type { CustomIntroPageProps } from "@/features/quizzes/pages/registry"

export default function RelationshipIntroPage({ slug }: CustomIntroPageProps) {
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

  if (loading) return <div className="min-h-screen bg-[#0a0505]" />

  return (
    <div className="min-h-screen bg-[#0a0505] text-white selection:bg-rose-500/30 overflow-x-hidden flex flex-col items-center font-sans">
      
      {/* 1. Healing Background Atmosphere with Darker Base */}
      <AuroraBackground className="fixed inset-0 z-0 opacity-60">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-950/40 via-transparent to-[#0a0505]" />
      </AuroraBackground>

      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(251, 113, 133, 0.15)" />

      {/* 2. Hero Content - Enhanced Contrast */}
      <main className="relative z-10 w-full max-w-6xl px-6 pt-24 pb-32 md:pt-36 md:pb-40 flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 mb-10 px-5 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 backdrop-blur-md">
            <Heart className="size-3.5 text-rose-400 fill-current opacity-80" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-rose-200">
              Emotional Resonance Guide
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1] select-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
            读懂内心的<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-fuchsia-200 to-orange-100">
              安全感底色
            </span>
          </h1>

          <div className="max-w-2xl mx-auto h-24 mb-12 md:mb-16">
            <TextGenerateEffect 
              words="亲密关系偏好测试 · 在安静中体察那些微妙的情感时刻" 
              className="text-lg md:text-2xl text-rose-50/90 font-light tracking-[0.05em] leading-relaxed italic drop-shadow-md"
            />
          </div>
        </motion.div>

        {/* 3. The Activation Portal - High Contrast Version */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full flex justify-center"
        >
          <QuizUnifiedPortal 
            onStart={() => setDialogOpen(true)}
            accentColor="fuchsia"
            purchaseUrl="https://xhslink.com/m/8Hcapw8hyDn"
          />
        </motion.div>

        {/* 4. Muted Footer with Better Legibility */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 2 }}
          className="mt-20 md:mt-28 flex flex-col items-center gap-6"
        >
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            <div className="flex items-center gap-2">
              <MessageCircle className="size-4 text-rose-300" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-100">Attachment Theory</span>
            </div>
            <div className="hidden md:block h-4 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-rose-300" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-100">Safe Space</span>
            </div>
          </div>
          <p className="max-w-md text-center text-[12px] md:text-sm text-rose-100/40 leading-relaxed font-medium px-4">
            建议在不被打扰的环境下完成。您的结果将被严格加密，<br className="hidden md:block" />
            这不仅是测评，更是一次与自我的深层对话。
          </p>
        </motion.div>
      </main>

      <footer className="w-full py-12 border-t border-white/5 bg-black/40 text-center relative z-10">
        <p className="text-[9px] text-rose-200/20 uppercase tracking-[0.6em] font-bold">
          SoulTest · Healing & Discovery
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
        title="开启对话"
        description="身份验证成功后，即可进入您的情感偏好探索空间。"
      />
    </div>
  )
}

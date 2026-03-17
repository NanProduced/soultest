import { useEffect, useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { motion } from "framer-motion"
import { GraduationCap, Sparkles, Compass, ShieldCheck } from "lucide-react"

import { AccessCodeDialog } from "@/components/quiz/access-code-dialog"
import { QuizUnifiedPortal } from "@/components/quiz/quiz-unified-portal"
import { Spotlight } from "@/components/ui/spotlight"
import { FloatingLines } from "@/components/ui/floating-lines"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { fetchQuizIntro, verifyAccessCode } from "@/features/quizzes/api"
import { readAccessSession, writeAccessSession } from "@/features/quizzes/session"
import type { QuizIntro } from "@/features/quizzes/types"
import type { CustomIntroPageProps } from "@/features/quizzes/pages/registry"

export default function RiasecIntroPage({ slug }: CustomIntroPageProps) {
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

  if (loading) return <div className="min-h-screen bg-[#F0FDFA]" />

  return (
    <div className="min-h-screen bg-[#F0FDFA] text-[#134E4A] selection:bg-teal-500/10 overflow-x-hidden flex flex-col items-center font-sans scroll-smooth">
      
      {/* 1. Structural Blueprint Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.06]" 
           style={{ backgroundImage: 'linear-gradient(#0F766E 1px, transparent 1px), linear-gradient(90deg, #0F766E 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <FloatingLines className="absolute inset-0 z-0 opacity-10" />

      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(15, 118, 110, 0.1)" />

      {/* 2. Hero Content - One Screen Layout */}
      <main className="relative z-10 w-full max-w-6xl px-6 pt-24 pb-32 md:pt-32 md:pb-40 flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center text-center"
        >
          <div className="inline-flex items-center gap-2 mb-10 px-5 py-1.5 rounded-md border border-teal-200 bg-white shadow-sm">
            <GraduationCap className="size-3.5 text-teal-600" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-teal-600/70">
              Career Navigation Blueprint
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.9] select-none text-slate-900">
            绘制你的<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-blue-600 to-emerald-600">
              职业兴趣蓝图
            </span>
          </h1>

          <div className="max-w-2xl mx-auto h-24 mb-12 md:mb-16">
            <TextGenerateEffect 
              words="霍兰德 RIASEC 经典模型 · 发现你最具“心流感”的工作领域" 
              className="text-base md:text-xl text-teal-800/60 font-medium tracking-[0.05em] leading-relaxed"
            />
          </div>
        </motion.div>

        {/* 3. The Activation Portal - Blueprint Themed */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full flex justify-center"
        >
          <div className="p-1 rounded-[44px] bg-white shadow-2xl border border-teal-100 relative group">
            <div className="absolute -top-3 -left-3 size-10 border-t-2 border-l-2 border-teal-500/30" />
            <div className="absolute -bottom-3 -right-3 size-10 border-b-2 border-r-2 border-teal-500/30" />
            
            <QuizUnifiedPortal 
              onStart={() => setDialogOpen(true)}
              accentColor="sky"
              purchaseUrl="https://xhslink.com/m/8Hcapw8hyDn"
            />
          </div>
        </motion.div>

        {/* 4. Structural Trust Signals */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 2 }}
          className="mt-20 md:mt-28 flex flex-col items-center gap-6"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="flex items-center gap-2">
              <Compass className="size-4 text-teal-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-800">Holland Code Standard</span>
            </div>
            <div className="hidden md:block h-4 w-px bg-teal-200" />
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-teal-600" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-800">Professional Report</span>
            </div>
          </div>
          <p className="max-w-md text-center text-[11px] md:text-sm text-teal-800/40 leading-relaxed font-medium px-4">
            基于 RIASEC 职业兴趣量表改编。完成后将为您生成专属的兴趣轮廓档案，<br className="hidden md:block" />
            帮助您筛选更符合本能的机会方向。
          </p>
        </motion.div>
      </main>

      <footer className="w-full py-12 border-t border-teal-100 bg-white/40 text-center relative z-10">
        <p className="text-[9px] text-teal-800/30 uppercase tracking-[0.6em] font-bold">
          SoulTest Career Lab · Data-Driven Exploration
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
        title="开启导航"
        description="身份验证成功后，即可开启您的职业兴趣蓝图探索。"
      />
    </div>
  )
}

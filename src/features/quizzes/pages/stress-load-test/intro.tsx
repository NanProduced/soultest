import { useEffect, useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { motion } from "framer-motion"
import { Activity, Battery, Brain, ShieldCheck, Sparkles, ChevronDown, Zap, Waves } from "lucide-react"

import { cn } from "@/lib/utils"
import { AccessCodeDialog } from "@/components/quiz/access-code-dialog"
import { QuizUnifiedPortal } from "@/components/quiz/quiz-unified-portal"
import { Spotlight } from "@/components/ui/spotlight"
import { CanvasShaders } from "@/components/ui/canvas-shaders"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { fetchQuizIntro, verifyAccessCode } from "@/features/quizzes/api"
import { readAccessSession, writeAccessSession } from "@/features/quizzes/session"
import type { QuizIntro } from "@/features/quizzes/types"
import type { CustomIntroPageProps } from "@/features/quizzes/pages/registry"

const STRESS_DIMENSIONS = [
  { label: "任务超载", desc: "处理能力与待办总量的博弈", color: "text-emerald-400" },
  { label: "掌控流失", desc: "环境不可控性带来的焦虑源", color: "text-cyan-400" },
  { label: "预警常开", desc: "神经系统是否长期处于高度戒备", color: "text-blue-400" },
  { label: "恢复断电", desc: "睡眠与碎片时间的补能效率", color: "text-teal-400" },
]

export default function StressLoadIntroPage({ slug }: CustomIntroPageProps) {
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
    <div className="min-h-screen bg-[#020617] text-white selection:bg-emerald-500/30 overflow-x-hidden scroll-smooth font-sans">
      
      {/* 1. Immersive Pulse Background */}
      <div className="fixed inset-0 z-0">
        <CanvasShaders preset="space" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/60 via-transparent to-[#020617]" />
        {/* Radar scanning animation overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'repeating-linear-gradient(0deg, #10b981 0px, transparent 1px, transparent 40px)', backgroundSize: '100% 40px' }} />
      </div>

      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(16, 185, 129, 0.2)" />

      {/* 2. Hero Section - The Alarm */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 mb-10 px-5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md">
            <Activity className="size-3.5 text-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-300">
              Biometric Equilibrium Monitor
            </span>
          </div>

          <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.85] select-none">
            看见你隐藏的<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              高压负荷信号
            </span>
          </h1>

          <div className="max-w-2xl mx-auto h-24 mb-12">
            <TextGenerateEffect 
              words="基于认知负荷模型 · 听听身体里那些被忙碌掩盖的微弱预警" 
              className="text-lg md:text-xl text-slate-400 font-light tracking-[0.1em] leading-relaxed italic"
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1.5 }}
            onClick={() => document.getElementById('diagnosis')?.scrollIntoView({ behavior: 'smooth' })}
            className="cursor-pointer flex flex-col items-center gap-4 text-emerald-500/30 hover:text-emerald-500/60 transition-all"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Start Diagnosis</span>
            <ChevronDown className="size-5 animate-bounce" />
          </motion.div>
        </motion.div>
      </section>

      {/* 3. Diagnosis Narrative - The "Why" */}
      <section id="diagnosis" className="relative z-10 px-6 py-32 md:py-48 bg-[#020617]">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">压力不是敌人，<br /><span className="text-emerald-400">失控才是。</span></h2>
              <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-light">
                压力测试不仅是记录情绪，更是对你“心理韧性”的一次深度体检。我们将从四个关键维度切入，还原你当前的身心平衡状态。
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                {STRESS_DIMENSIONS.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors group">
                    <div className={cn("size-2 rounded-full bg-current opacity-40 group-hover:scale-150 transition-transform", item.color)} />
                    <div>
                      <div className="font-bold text-slate-200">{item.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="relative">
              <div className="absolute -inset-10 bg-emerald-500/10 blur-[100px] rounded-full" />
              <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-20">
                  <Waves className="size-20 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <Sparkles className="size-5 text-amber-400" />
                  专业测定报告包含
                </h3>
                <ul className="space-y-6">
                  {[
                    "SLI (Stress Load Index) 综合指数",
                    "五维压力负荷深度雷达图",
                    "核心超载信号与本能防御分析",
                    "针对性减压策略与恢复建议",
                    "医疗级风格的个人体征海报",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <div className="size-1.5 rounded-full bg-emerald-500 mt-2 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                      <span className="text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Activation Portal */}
      <section className="relative z-10 px-6 pb-48 md:pb-64 bg-[#020617] flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl"
        >
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">开启测定链路</h3>
            <p className="text-slate-500 font-medium tracking-wide">请输入激活码，进入私密的压力负荷测定空间</p>
          </div>
          
          <QuizUnifiedPortal 
            onStart={() => setDialogOpen(true)}
            centered={true}
            accentColor="emerald"
            purchaseUrl="https://xhslink.com/m/8Hcapw8hyDn"
          />
        </motion.div>
      </section>

      {/* Footer Branding */}
      <footer className="relative z-10 py-24 bg-black/20 border-t border-white/5 text-center">
        <div className="flex justify-center items-center gap-10 mb-8 opacity-20">
          <Activity className="size-5" />
          <div className="h-4 w-px bg-white/40" />
          <Battery className="size-5" />
          <div className="h-4 w-px bg-white/40" />
          <Brain className="size-5" />
        </div>
        <p className="text-[10px] text-slate-600 uppercase tracking-[0.6em] font-bold">SoulTest Bio-Logic Lab · Clinical Precision</p>
      </footer>

      <AccessCodeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleStart}
        value={code}
        onValueChange={setCode}
        submitting={verifying}
        errorMessage={accessErrorMessage}
        title="开启测定"
        description="身份验证成功后，我们将为您开启私密的心理负荷监测。"
      />
    </div>
  )
}

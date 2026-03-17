import { useEffect, useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { motion } from "framer-motion"
import { ShieldCheck, Database, Zap, ChevronDown, CheckCircle2 } from "lucide-react"

import { AccessCodeDialog } from "@/components/quiz/access-code-dialog"
import { QuizUnifiedPortal } from "@/components/quiz/quiz-unified-portal"
import { Spotlight } from "@/components/ui/spotlight"
import { FloatingLines } from "@/components/ui/floating-lines"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { fetchQuizIntro, verifyAccessCode } from "@/features/quizzes/api"
import { readAccessSession, writeAccessSession } from "@/features/quizzes/session"
import type { QuizIntro } from "@/features/quizzes/types"
import type { CustomIntroPageProps } from "@/features/quizzes/pages/registry"

const BIGFIVE_FEATURES = [
  { icon: Database, label: "OCEAN 模型", sub: "国际标准", iconClass: "text-blue-600" },
  { icon: ShieldCheck, label: "50 题精测", sub: "高信效度", iconClass: "text-emerald-600" },
  { icon: Zap, label: "审计级报告", sub: "深度还原", iconClass: "text-amber-500" },
]

export default function BigFiveIntroPage({ slug }: CustomIntroPageProps) {
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

  if (loading) return <div className="min-h-screen bg-[#F8FAFC]" />

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-blue-500/10 overflow-x-hidden scroll-smooth font-sans">
      
      {/* 1. Scientific Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden border-b border-slate-200">
        <FloatingLines className="absolute inset-0 z-0 opacity-20" />
        
        {/* Fine Grid Background */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(59, 130, 246, 0.08)" />

        <div className="relative z-10 max-w-5xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="inline-flex items-center gap-2 mb-10 px-4 py-1.5 rounded-md border border-slate-200 bg-white shadow-sm">
              <div className="size-2 bg-blue-600 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">
                Scientific Assessment Standard
              </span>
            </div>

            <h1 className="text-[14vw] md:text-[10vw] font-black tracking-[-0.06em] leading-[0.8] mb-12 text-slate-950">
              精准还原<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600">
                行为底层
              </span>
            </h1>

            <div className="max-w-xl mx-auto h-24">
              <TextGenerateEffect 
                words="大五人格测试 · 国际标准 OCEAN 心理测量模型" 
                className="text-sm md:text-base text-slate-500 font-bold tracking-[0.3em] uppercase"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            onClick={() => document.getElementById('narrative')?.scrollIntoView({ behavior: 'smooth' })}
            className="cursor-pointer mt-12 flex flex-col items-center gap-4 text-slate-300 hover:text-slate-500 transition-all group"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] group-hover:tracking-[0.6em] transition-all">Scroll to Audit</span>
            <ChevronDown className="size-5 animate-bounce" />
          </motion.div>
        </div>
      </section>

      {/* 2. Narrative Section (Scientific Logic) */}
      <section id="narrative" className="relative z-10 px-6 py-32 md:py-48 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-24"
          >
            <div className="space-y-8 text-center md:text-left">
              <h2 className="text-4xl md:text-7xl font-bold tracking-tighter text-slate-950 leading-none">
                这是关于你的<br />
                一份<span className="text-blue-600 italic">“审计报告”</span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-500 leading-relaxed font-light max-w-3xl">
                心理学界公认最稳定的特质模型。不同于临时性的情绪，大五人格刻画的是你成年后相对恒定的心理底色。它定义了你在面对机会、压力与人际时的“本能反应算法”。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16 border-y border-slate-100">
              {BIGFIVE_FEATURES.map((f, i) => (
                <div key={i} className="flex flex-col items-center md:items-start gap-4">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <f.icon className={`size-6 ${f.iconClass}`} />
                  </div>
                  <div className="text-xl font-bold text-slate-900">{f.label}</div>
                  <div className="text-sm text-slate-400 font-medium tracking-wide uppercase">{f.sub}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="p-10 rounded-[40px] bg-[#F8FAFC] border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
                <h3 className="text-xl font-bold mb-8 text-slate-950">五个核心观察维度</h3>
                <ul className="space-y-6">
                  {[
                    { l: "外向性", d: "能量来源与社交指向" },
                    { l: "宜人性", d: "利他倾向与合作信任" },
                    { l: "尽责性", d: "自律程度与成就动机" },
                    { l: "神经质", d: "情绪反应与抗压弹性" },
                    { l: "开放性", d: "认知宽度与创新探索" },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center justify-between group/item">
                      <span className="font-bold text-slate-700">{item.l}</span>
                      <span className="text-sm text-slate-400 group-hover/item:text-blue-600 transition-colors">{item.d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="size-6 text-emerald-500 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-950">高精准度常模</h4>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">基于最新中文互联网样本常模修正，确保结果更符合当代社会行为逻辑。</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="size-6 text-emerald-500 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-950">行为预测建议</h4>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">提供针对工作、情感、决策三大场景的实操建议，不仅仅是描述，更是指导。</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Unified Activation Portal */}
      <section className="relative z-10 px-6 pb-48 md:pb-64 bg-white flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl"
        >
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950">开启人格审计</h3>
            <p className="text-slate-400 font-medium">输入激活码开启 50 题标准测量链路</p>
          </div>
          
          {/* Overlay card for portal to match white theme */}
          <div className="p-1 rounded-[44px] bg-slate-100 shadow-2xl">
            <QuizUnifiedPortal 
              onStart={() => setDialogOpen(true)}
              centered={true}
              accentColor="sky"
              purchaseUrl="https://xhslink.com/m/8Hcapw8hyDn"
            />
          </div>
        </motion.div>
      </section>

      {/* Laboratory Footer */}
      <footer className="relative z-10 py-24 bg-[#F8FAFC] border-t border-slate-200 text-center">
        <div className="inline-flex items-center gap-4 mb-6 opacity-30 grayscale">
          <Database className="size-5" />
          <div className="h-4 w-px bg-slate-400" />
          <ShieldCheck className="size-5" />
        </div>
        <p className="text-[10px] text-slate-400 uppercase tracking-[0.6em] font-bold">SoulTest Audit Lab · Empiricism & Data</p>
      </footer>

      <AccessCodeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleStart}
        value={code}
        onValueChange={setCode}
        submitting={verifying}
        errorMessage={accessErrorMessage}
        title="激活审计链路"
        description="身份验证成功后，我们将为您开启 50 题正式版测量。请确保作答环境不受干扰。"
      />
    </div>
  )
}

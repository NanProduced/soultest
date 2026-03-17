import { useEffect, useState, type FormEvent } from "react"
import { useNavigate } from "react-router"
import { motion } from "framer-motion"
import { Heart, Sparkles, PieChart, Shapes, ChevronDown, Palette } from "lucide-react"

import { AccessCodeDialog } from "@/components/quiz/access-code-dialog"
import { QuizUnifiedPortal } from "@/components/quiz/quiz-unified-portal"
import { Spotlight } from "@/components/ui/spotlight"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { fetchQuizIntro, verifyAccessCode } from "@/features/quizzes/api"
import { readAccessSession, writeAccessSession } from "@/features/quizzes/session"
import type { QuizIntro } from "@/features/quizzes/types"
import type { CustomIntroPageProps } from "@/features/quizzes/pages/registry"

const DESIRE_DIMENSIONS = [
  "爱情欲", "财富欲", "美貌欲", "求知欲", "权力欲", "美食欲", "安逸欲"
]

export default function DesireCompositionIntroPage({ slug }: CustomIntroPageProps) {
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

  if (loading) return <div className="min-h-screen bg-[#050505]" />

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-pink-500/30 overflow-x-hidden scroll-smooth font-sans">
      
      {/* 1. Artistic Background Atmosphere */}
      <AuroraBackground className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]" />
      </AuroraBackground>

      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgba(236, 72, 153, 0.15)" />

      {/* 2. Hero Section - The Mosaic Call */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 mb-10 px-5 py-1.5 rounded-full border border-pink-500/20 bg-pink-500/5 backdrop-blur-md">
            <Palette className="size-3.5 text-pink-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-pink-300">
              Desire Fragment Decoder
            </span>
          </div>

          <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 leading-[0.85] select-none">
            解构你灵魂里的<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-violet-500 to-amber-400">
              欲望碎片图谱
            </span>
          </h1>

          <div className="max-w-2xl mx-auto h-24 mb-12">
            <TextGenerateEffect 
              words="如果生命是一场关于能量的博弈 · 哪一部分欲望占据了你的核心主场？" 
              className="text-lg md:text-2xl text-slate-300 font-light tracking-[0.05em] leading-relaxed italic"
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1.5 }}
            onClick={() => document.getElementById('narrative')?.scrollIntoView({ behavior: 'smooth' })}
            className="cursor-pointer flex flex-col items-center gap-4 text-pink-500/30 hover:text-pink-500/60 transition-all"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Scroll to Deconstruct</span>
            <ChevronDown className="size-5 animate-bounce" />
          </motion.div>
        </motion.div>
      </section>

      {/* 3. Narrative Section - The Soul Mosaic */}
      <section id="narrative" className="relative z-10 px-6 py-32 md:py-48 bg-[#050505]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-24"
          >
            <div className="space-y-8 text-center md:text-left">
              <h2 className="text-4xl md:text-7xl font-bold tracking-tight text-white leading-none">
                坦诚面对<br />
                那些<span className="text-pink-500 italic">“想要的东西”</span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-400 leading-relaxed font-light max-w-3xl">
                这不仅仅是一场测试，更是一次关于自我真相的对话。通过潜意识的投射，我们将为你还原一张包含 7 大核心维度的动态比例图，看见你行为背后的终极驱动。
              </p>
            </div>

            {/* Dimension Display - Aesthetic grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {DESIRE_DIMENSIONS.map((d, i) => (
                <div key={i} className="aspect-square flex flex-col items-center justify-center rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-pink-500/30 transition-all group">
                  <div className="text-sm font-bold text-slate-400 group-hover:text-pink-400 transition-colors">{d}</div>
                </div>
              ))}
            </div>

            <div className="p-10 rounded-[48px] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 backdrop-blur-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Shapes className="size-32 text-pink-500 rotate-12" />
              </div>
              <h3 className="text-2xl font-bold mb-10 flex items-center gap-2">
                <Sparkles className="size-5 text-amber-400" />
                这份解构报告将揭示
              </h3>
              <ul className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                {[
                  "精确的欲望组成饼图分布",
                  "前三大主导欲望深度解读",
                  "潜在的能量损耗与卡点拆解",
                  "针对性的生活平衡建议",
                  "艺术风格的灵魂马赛克分享海报",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-slate-300">
                    <div className="size-2 rounded-full bg-pink-500 mt-2 shrink-0 shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
                    <span className="text-lg font-light leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. The Activation Portal */}
      <section className="relative z-10 px-6 pb-48 md:pb-64 bg-[#050505] flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl"
        >
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">开启灵魂解构</h3>
            <p className="text-slate-500 font-medium">输入激活码开启这场关于自我的坦诚对话</p>
          </div>
          
          <QuizUnifiedPortal 
            onStart={() => setDialogOpen(true)}
            centered={true}
            accentColor="fuchsia"
            purchaseUrl="https://xhslink.com/m/8Hcapw8hyDn"
          />
        </motion.div>
      </section>

      {/* Aesthetic Footer */}
      <footer className="relative z-10 py-24 bg-black border-t border-white/5 text-center">
        <div className="flex justify-center items-center gap-10 mb-8 opacity-20">
          <PieChart className="size-5" />
          <div className="h-4 w-px bg-white/40" />
          <Heart className="size-5" />
          <div className="h-4 w-px bg-white/40" />
          <Shapes className="size-5" />
        </div>
        <p className="text-[10px] text-slate-600 uppercase tracking-[0.6em] font-bold">SoulTest Mosaic Lab · The Art of Desire</p>
      </footer>

      <AccessCodeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleStart}
        value={code}
        onValueChange={setCode}
        submitting={verifying}
        errorMessage={accessErrorMessage}
        title="身份验证"
        description="身份验证成功后，我们将为您开启私密的欲望组成探索档案。"
      />
    </div>
  )
}

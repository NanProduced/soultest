import {
  ArrowRight,
  Clock,
  ChevronDown,
  Zap,
  PieChart,
  Download,
  ScanLine,
  Smartphone,
  ShieldCheck
} from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router"
import { motion, AnimatePresence } from "framer-motion"

import { fetchPublicQuizzes } from "@/features/quizzes/api"
import type { QuizCatalogItem } from "@/features/quizzes/types"
import { cn } from "@/lib/utils"

import { TarotShowcase } from "@/components/ui/tarot-showcase"
import MagicBento from "@/components/MagicBento"

// UI Components
import { FloatingLines } from "@/components/ui/floating-lines"
import { FlipWords } from "@/components/ui/flip-words"

import { Sparkles } from "lucide-react"
const FadeInSection = ({ children, className, delay = 0, once = true, id }: { children: React.ReactNode, className?: string, delay?: number, once?: boolean, id?: string }) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: once, amount: 0.15 }}
    transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.section>
)

export function HomePage() {
  const [quizzes, setQuizzes] = useState<QuizCatalogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>()
  const [userCount, setUserCount] = useState(0)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const items = await fetchPublicQuizzes()
        if (!active) return
        setQuizzes(items)
      } catch (error) {
        if (!active) return
        setErrorMessage(error instanceof Error ? error.message : "题集加载失败")
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()

    // Random user count generation for social proof
    setUserCount(Math.floor(Math.random() * 5000) + 12000)

    return () => { active = false }
  }, [])

  const faqs = [
    {
      question: '这些测试有科学依据吗？',
      answer: 'SoulTest 的所有测试均基于经典的心理学模型（如 Big Five, MBTI, Enneagram 等）进行改编。我们致力于将严谨的量表与现代的可视化美学结合，为您提供既专业又具观赏性的测试报告。',
    },
    {
      question: '购买口令后可以多次测试吗？',
      answer: '每个激活码支持对应题集的完整体验。在有效期内，您可以重复进入查看您的报告，或在未完成时继续作答。',
    },
    {
      question: '结果报告可以分享到社交平台吗？',
      answer: '当然。我们专门设计了适配小红书、朋友圈分享的精美海报图。完成测试后，您可以一键生成长图，保存至相册即可分享。',
    },
    {
      question: '数据隐私安全吗？',
      answer: '我们极其重视隐私。您的所有答题数据均经过匿名化处理，仅用于生成您的个人报告。我们不会向任何第三方泄露您的私人测试结果。',
    },
  ]
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const features = [
    {
      title: "8种互动题型",
      description: "打破传统枯燥的单选题。滑动、排序、图片选择，让答题过程本身就是一种享受。",
      label: "体验",
      color: "#060010",
      icon: <Zap className="size-6 text-yellow-400" />
    },
    {
      title: "精美结果分析",
      description: "多维雷达图、匹配度计算、标签云，基于经典模型的深度算法，比截图更值得分享。",
      label: "深度",
      color: "#060010",
      icon: <PieChart className="size-6 text-purple-400" />
    },
    {
      title: "一键导出长图",
      description: "自带精美排版设计，测试完成后点击即存，完美适配朋友圈与小红书发布。",
      label: "分享",
      color: "#060010",
      icon: <Download className="size-6 text-emerald-400" />
    },
    {
      title: "3分钟轻松测完",
      description: "无需长时间专注，利用地铁、睡前的碎片时间，就能完成一次心灵探索。",
      label: "轻量",
      color: "#060010",
      icon: <Clock className="size-6 text-blue-400" />
    },
    {
      title: "全平台适配",
      description: "完美适配手机、平板、电脑等设备，给您流畅无界的答题体验。",
      label: "无界",
      color: "#060010",
      icon: <Smartphone className="size-6 text-cyan-400" />
    },
    {
      title: "隐私安全保护",
      description: "所有数据匿名化处理，测试结果仅对您可见，守护心灵的私密空间。",
      label: "安全",
      color: "#060010",
      icon: <ShieldCheck className="size-6 text-rose-400" />
    }
  ]

  // Image fallbacks for testing cards
  const cardImages = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1510936111840-65e151ad71bb?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1615184697985-c9bde1b07da7?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop",
  ]

  return (
    <div className="relative selection:bg-purple-500/30 selection:text-white min-h-screen font-sans bg-[#09090B]">

      {/* 1. Hero */}
      <FloatingLines className="bg-slate-950 border-b border-white/5">
        <div className="relative z-10 mx-auto max-w-7xl px-6 w-full h-full flex items-center pt-24 pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-start text-left"
            >
              <div className="space-y-4">
                <h1 className="text-[clamp(2.5rem,5.5vw,5rem)] font-serif text-white leading-[1.1] font-bold">
                  发现每一个<br />
                  <FlipWords 
                    words={["真实的", "隐藏的", "未知的", "多面的"]} 
                    className="text-purple-400 font-serif p-0"
                  />
                  自己
                </h1>
              </div>

              <p className="mt-8 max-w-lg text-lg md:text-xl leading-relaxed text-slate-400 font-medium font-serif italic">
                “遇见自己，从这一场深度对话开始。”
              </p>
              
              <p className="mt-4 max-w-md text-base leading-relaxed text-slate-500">
                SoulTest 实验室：基于国际公认心理学模型，为您呈现一份值得珍藏的灵魂画像。
              </p>

              <div className="mt-12 flex flex-col items-start gap-6">
                <button
                  onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}
                  className="group relative inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-base font-bold text-slate-950 transition-all hover:scale-105 active:scale-95 overflow-hidden cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                >
                  <span className="relative z-10 flex items-center">开启灵魂之旅 <ArrowRight className="ml-2 size-5" /></span>
                </button>

                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 1.2, duration: 1 }}
                  className="flex items-center gap-3 text-sm text-slate-400 mt-2"
                >
                  <div className="flex -space-x-3">
                    <img className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60" alt="avatar" />
                    <img className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=60" alt="avatar" />
                    <img className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 object-cover" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=60" alt="avatar" />
                    <div className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] text-white font-medium">+</div>
                  </div>
                  <p>已有 <strong className="text-white font-mono text-[15px]">{userCount.toLocaleString()}</strong> 人完成测试</p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative hidden lg:block w-full max-w-lg mx-auto"
            >
              <TarotShowcase />
            </motion.div>
          </div>
        </div>
      </FloatingLines>

      {/* 2. Free Tests Showcase */}
      <FadeInSection className="py-16 md:py-24 bg-[#060010] relative overflow-hidden" id="free-tests">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 mb-12 max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1 text-xs font-medium text-fuchsia-300 mb-4">
              <Sparkles className="size-3.5" />
              特别体验版
            </div>
            <h2 className="font-bold text-3xl md:text-4xl tracking-tight text-white mb-3 font-serif">
              免费测试专区
            </h2>
            <p className="text-slate-400 text-base">
              无需购买，立即体验轻量级测试，开启灵魂探索的第一步。
            </p>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Free Test Card 1 */}
            <Link
              to="/free/aura"
              className="group flex flex-col relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 transition-all hover:border-fuchsia-500/50 hover:bg-white/10 hover:-translate-y-1 shadow-lg hover:shadow-[0_12px_40px_rgba(168,85,247,0.15)]"
            >
              <div className="relative aspect-[16/9] w-full bg-black/40 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg,theme(colors.fuchsia.500),theme(colors.amber.400),theme(colors.sky.400),theme(colors.fuchsia.500))] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0515] to-transparent opacity-80" />
                <Sparkles className="size-12 text-fuchsia-400 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[11px] text-fuchsia-300 font-medium">
                  限时免费
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1 bg-[#0A0515]/50">
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight font-serif group-hover:text-fuchsia-100 transition-colors">你的 Aura 是什么颜色？</h3>
                <p className="text-[13px] text-slate-400 line-clamp-2 mb-6 leading-relaxed">
                  每个人都有专属的灵魂光谱，结合双维度四象限模型，18道情境题揭晓你散发着怎样的气场。
                </p>
                <div className="mt-auto flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <span className="text-xs text-white/50 flex items-center gap-1"><Clock className="size-3.5" /> 3分钟</span>
                     <span className="text-xs text-white/50 flex items-center gap-1">18题</span>
                   </div>
                   <span className="text-fuchsia-400 text-sm font-medium flex items-center group-hover:text-fuchsia-300">
                     去测测 <ArrowRight className="ml-1 size-4 group-hover:translate-x-1 transition-transform" />
                   </span>
                </div>
              </div>
            </Link>

            {/* Free Test Card 2: Banwei */}
            <Link
              to="/free/banwei"
              className="group flex flex-col relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5 transition-all hover:border-emerald-500/50 hover:bg-white/10 hover:-translate-y-1 shadow-lg hover:shadow-[0_12px_40px_rgba(16,185,129,0.15)]"
            >
              <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.2),transparent_70%)] group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(14,165,233,0.1)_0%,transparent_100%)]" />
                
                {/* Laboratory pattern overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                
                <div className="relative z-10 flex flex-col items-center">
                   <div className="size-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 mb-2 group-hover:-translate-y-1 transition-transform duration-300">
                     <span className="text-3xl">☕</span>
                   </div>
                </div>

                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[11px] text-emerald-300 font-medium">
                  火爆全网
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1 bg-[#0A0515]/50">
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-emerald-100 transition-colors">班味浓度检测</h3>
                <p className="text-[13px] text-slate-400 line-clamp-2 mb-6 leading-relaxed">
                  实验室权威认证，精准测定你被工作「腌入味」的程度。基于五维成分分析，揭晓你的社畜形态。
                </p>
                <div className="mt-auto flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <span className="text-xs text-white/50 flex items-center gap-1"><Clock className="size-3.5" /> 2分钟</span>
                     <span className="text-xs text-white/50 flex items-center gap-1">15题</span>
                   </div>
                   <span className="text-emerald-400 text-sm font-medium flex items-center group-hover:text-emerald-300">
                     去测测 <ArrowRight className="ml-1 size-4 group-hover:translate-x-1 transition-transform" />
                   </span>
                </div>
              </div>
            </Link>

            {/* Placeholder for future free tests */}
            <div className="hidden md:flex flex-col items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] p-6 text-center h-full min-h-[320px]">
               <div className="size-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                 <Sparkles className="size-5 text-white/20" />
               </div>
               <p className="text-white/40 font-medium mb-1">更多免费测试</p>
               <p className="text-xs text-white/30">正在实验室孵化中，敬请期待</p>
            </div>
          </div>
        </div>
      </FadeInSection>

      {/* 3. Catalog */}
      <FadeInSection className="py-24 md:py-32 bg-[#09090B]" id="catalog">
        <div className="mb-12 max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-bold text-3xl md:text-4xl tracking-tight text-white mb-3">
              精选测试展厅
            </h2>
            <p className="text-slate-400 text-base">
              基于经典量表，找到属于你的深度解析
            </p>
          </div>
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-rose-900/50 bg-rose-950/20 px-6 py-5 text-sm text-rose-400 max-w-7xl mx-auto mb-8 mx-6">
            {errorMessage}
          </div>
        ) : null}

        {loading ? (
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-[360px] rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quizzes.map((quiz, idx) => (
              <Link 
                key={quiz.slug} 
                to={`/${quiz.slug}`} 
                className="group flex flex-col rounded-2xl bg-[#121216] overflow-hidden border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 shadow-lg"
              >
                <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                  <img 
                    src={cardImages[idx % cardImages.length]} 
                    alt={quiz.title} 
                    className="w-full h-full object-cover opacity-70 group-hover:scale-105 group-hover:opacity-90 transition-all duration-700 ease-out" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-transparent to-transparent opacity-90" />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-2.5 py-1 text-[11px] bg-black/50 backdrop-blur-md rounded border border-white/10 text-white/90">
                      深度剖析
                    </span>
                    <span className="px-2.5 py-1 text-[11px] bg-black/50 backdrop-blur-md rounded border border-white/10 text-white/90">
                      {quiz.category}
                    </span>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 text-[11px] text-white/90 flex items-center gap-1.5">
                    <Clock className="size-3.5"/> 约{quiz.durationMinutes}分钟
                  </div>
                  <div className="absolute bottom-4 right-4 text-xs font-bold text-white bg-white/20 backdrop-blur-md px-2.5 py-1 rounded">
                    {quiz.priceLabel}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 tracking-wide">{quiz.title}</h3>
                  <p className="text-[13px] text-slate-400 line-clamp-2 mb-6 leading-relaxed">
                    {quiz.summary}
                  </p>
                  <div className="mt-auto flex items-center justify-between text-purple-400 text-sm font-medium group-hover:text-purple-300 transition-colors">
                    获取兑换码 <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </FadeInSection>

      {/* 3. Features Block */}
      <FadeInSection className="py-24 bg-[#09090B]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">为什么选择灵测?</h2>
            <p className="text-slate-400 text-lg">不仅有深度，更有绝佳体验</p>
          </div>
          <div className="w-full flex justify-center">
            <MagicBento items={features} enableStars={true} enableSpotlight={true} />
          </div>
        </div>
      </FadeInSection>

      {/* 4. Testimonials */}
      <FadeInSection className="py-24 md:py-32 bg-slate-50 overflow-hidden hidden">
        <div className="hidden" />
      </FadeInSection>

      {/* 5. FAQ (Dark Theme adaptation) */}
      <FadeInSection className="py-24 md:py-32 px-6 mx-auto max-w-3xl border-t border-white/5">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            关于探索的一些解答
          </h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openFaqIndex === i
            return (
              <div
                key={i}
                className="group rounded-2xl border border-white/5 bg-[#121216] overflow-hidden transition-all hover:border-white/10"
              >
                <button
                  className="w-full text-left p-6 md:p-8 flex items-center justify-between transition-colors cursor-pointer"
                  onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                >
                  <span className="text-lg md:text-xl font-bold text-white">{faq.question}</span>
                  <ChevronDown className={cn("size-6 text-slate-500 transition-transform duration-500", isOpen ? "rotate-180 text-purple-400" : "")} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <div className="px-6 md:px-8 pb-8">
                        <p className="text-slate-400 leading-relaxed text-base pt-4 border-t border-white/5">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </FadeInSection>

      {/* 6. CTA / QR Block */}
      <section className="bg-[#09090B] py-32 relative overflow-hidden border-t border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col items-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 tracking-tight">
              准备好遇见未知的自己了吗？
            </h2>

            <div className="bg-white p-5 rounded-[2rem] w-56 h-56 mb-10 flex flex-col items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.15)] relative">
              <div className="w-full h-full border-[5px] border-slate-900 rounded-2xl relative flex items-center justify-center bg-slate-50/50">
                 {/* Decorative QR-like elements */}
                 <div className="absolute top-4 left-4 w-6 h-6 border-[4px] border-slate-900 rounded-[4px]"></div>
                 <div className="absolute top-4 right-4 w-6 h-6 border-[4px] border-slate-900 rounded-[4px]"></div>
                 <div className="absolute bottom-4 left-4 w-6 h-6 border-[4px] border-slate-900 rounded-[4px]"></div>
                 <div className="absolute bottom-4 right-4 w-4 h-4 bg-slate-900 rounded-[3px]"></div>
                 <div className="flex flex-col items-center justify-center gap-1.5">
                   <ScanLine className="size-8 text-slate-900" />
                   <span className="font-bold text-slate-900 tracking-widest text-lg font-sans">灵测</span>
                 </div>
              </div>
            </div>

            <h3 className="text-white text-xl md:text-2xl font-bold mb-4">
              打开小红书 APP，扫码或搜索「灵测」
            </h3>
            <p className="text-slate-400 text-sm md:text-base">
              获取更多有趣测试与独家粉丝福利，解锁您的专属探索之旅
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 mt-32 pt-8 border-t border-white/5 text-center px-6">
          <p className="text-slate-600 text-sm">
            © 2026 SoulTest 灵测实验室 · 题库均源自心理学经典量表 · 仅供娱乐探索使用
          </p>
        </div>
      </section>
    </div>
  )
}







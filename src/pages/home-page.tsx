import {
  ArrowRight,
  Clock,
  ChevronDown,
  Zap,
  PieChart,
  Download,
  ScanLine
} from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router"
import { motion, AnimatePresence } from "framer-motion"

import { fetchPublicQuizzes } from "@/features/quizzes/api"
import type { QuizCatalogItem } from "@/features/quizzes/types"
import { cn } from "@/lib/utils"

import { TarotShowcase } from "@/components/ui/tarot-showcase"
import { HoverEffect } from "@/components/ui/card-hover-effect"

// UI Components
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"
import { FloatingLines } from "@/components/ui/floating-lines"
import { FlipWords } from "@/components/ui/flip-words"

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

  const testimonials = [
    { quote: '每一页结果都像是在和我对话，看到那句“你并不孤单”的时候真的泪目了。', name: '@林小鱼', title: '人格原型实验室' },
    { quote: '和男朋友一起测了爱情语言，发现了好多以前没注意到的细节，感觉更懂彼此了。', name: '@甜甜圈', title: '亲密关系模式图谱' },
    { quote: '职场能量那套题真的很准，结果页不是大道理，而是非常具体的建议。', name: '@K先生', title: '职场能量画像' },
    { quote: '以前总觉得被误解，看完这份报告后，我终于学会了如何向朋友解释我的“冷却期”。', name: '@阿柴', title: '人格原型实验室' },
    { quote: '这个 UI 真的太高级了，结果页精美到我想直接打印出来挂在墙上。', name: '@月亮代表', title: '亲密关系模式图谱' },
    { quote: '不是那种廉价的标签化测试，它让我感觉自己是一个复杂的、鲜活的人。', name: '@理性浪漫', title: '人格原型实验室' },
    { quote: '测试流程非常丝滑，动画效果有一种冥想般的仪式感。', name: '@Dora', title: '职场能量画像' },
    { quote: '已经推荐给全寝室了，大家都在晒自己的灵魂画像。', name: '@晚风', title: '亲密关系模式图谱' },
  ]

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
      link: "#",
      icon: <div className="p-2.5 bg-[#1F1F25] rounded-xl"><Zap className="size-6 text-yellow-400" /></div>,
      themeClass: "!bg-[#121216] !border-white/5 !shadow-none [&_h4]:!text-slate-100 [&_p]:!text-slate-400"
    },
    {
      title: "精美结果分析",
      description: "多维雷达图、匹配度计算、标签云，基于经典模型的深度算法，比截图更值得分享。",
      link: "#",
      icon: <div className="p-2.5 bg-[#1F1F25] rounded-xl"><PieChart className="size-6 text-purple-400" /></div>,
      themeClass: "!bg-[#121216] !border-white/5 !shadow-none [&_h4]:!text-slate-100 [&_p]:!text-slate-400"
    },
    {
      title: "一键导出长图",
      description: "自带精美排版设计，测试完成后点击即存，完美适配朋友圈与小红书发布。",
      link: "#",
      icon: <div className="p-2.5 bg-[#1F1F25] rounded-xl"><Download className="size-6 text-emerald-400" /></div>,
      themeClass: "!bg-[#121216] !border-white/5 !shadow-none [&_h4]:!text-slate-100 [&_p]:!text-slate-400"
    },
    {
      title: "3分钟轻松测完",
      description: "无需长时间专注，利用地铁、睡前的碎片时间，就能完成一次心灵探索。",
      link: "#",
      icon: <div className="p-2.5 bg-[#1F1F25] rounded-xl"><Clock className="size-6 text-blue-400" /></div>,
      themeClass: "!bg-[#121216] !border-white/5 !shadow-none [&_h4]:!text-slate-100 [&_p]:!text-slate-400"
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

      {/* 2. Catalog */}
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
                    ¥{quiz.price || "2.9"}
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
          {/* Custom style wrapper to override HoverEffect background styling */}
          <div className="max-w-5xl mx-auto [&_.group>span]:!bg-white/[0.03]">
            <HoverEffect items={features} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4" />
          </div>
        </div>
      </FadeInSection>

      {/* 4. Testimonials */}
      <FadeInSection className="py-24 md:py-32 bg-slate-50 overflow-hidden hidden">
        {/* Hiding the old light theme testimonials to maintain dark theme consistency. 
            Can be re-enabled and restyled later if needed. */}
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

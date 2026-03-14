import { 
  ArrowRight, 
  Sparkles, 
  Clock, 
  LayoutPanelTop, 
  Target, 
  Palette, 
  Share2, 
  HelpCircle,
  BarChart3,
  Users
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router"

import { fetchPublicQuizzes } from "@/features/quizzes/api"
import type { QuizCatalogItem } from "@/features/quizzes/types"
import { TypewriterEffect } from "@/components/ui/typewriter-effect"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"
import { HoverEffect } from "@/components/ui/card-hover-effect"
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"
import { motion } from "framer-motion"

export function HomePage() {
  const [quizzes, setQuizzes] = useState<QuizCatalogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>()

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const items = await fetchPublicQuizzes()

        if (!active) {
          return
        }

        setQuizzes(items)
      } catch (error) {
        if (!active) {
          return
        }

        setErrorMessage(error instanceof Error ? error.message : "题集加载失败")
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [])

  const featuredQuiz = useMemo(
    () => quizzes.find((item) => item.slug === "oejts-personality-map") ?? quizzes[0],
    [quizzes],
  )

  const words = [
    {
      text: "你以为",
    },
    {
      text: "你了解自己？",
    },
    {
      text: "认真做完，",
      className: "text-fuchsia-500",
    },
    {
      text: "再看结果。",
      className: "text-sky-500",
    },
  ];

  const features = [
    {
      title: "科学严谨的量表",
      description: "基于 OEJTS、MBTI、BigFive 等开源成熟量表开发。每一道题的权重都经过算法校验，确保测试结果具有参考价值而非随机生成。",
      content: (
        <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white p-6">
          <Target className="size-24" />
        </div>
      ),
    },
    {
      title: "极致的可视化美学",
      description: "告别单调的文字报告。我们为每种结果精心设计了多维度雷达图、色块分布以及适合在小红书分享的长图海报。",
      content: (
        <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--pink-500),var(--indigo-500))] flex items-center justify-center text-white p-6">
          <Palette className="size-24" />
        </div>
      ),
    },
    {
      title: "专为分享而生",
      description: "生成的每一个结果都是一张精心排版的灵魂名片。支持一键保存高画质图片，让你的特质在内容渠道更具吸引力。",
      content: (
        <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white p-6">
          <Share2 className="size-24" />
        </div>
      ),
    },
  ];

  const testimonials = [
    {
      quote: "INTP · 概念解码者。逻辑敏锐，喜欢拆解概念，不轻易跟风表态。这描述简直就是我本人的写照，维度分析也很准。",
      name: "小红书用户 @清风徐来",
      title: "16 型人格测试参与者",
    },
    {
      quote: "结果页的海报设计得非常漂亮，不是那种廉价的 H5 风格。分享到朋友圈后很多人来问是在哪里测的。",
      name: "微博博主 @测测君",
      title: "深度心理测试爱好者",
    },
    {
      quote: "喜欢那种揭晓仪式感，正在解析灵魂指纹的动画让等待也变得有意义。这是我见过体验最好的测试工具。",
      name: "匿名用户",
      title: "测试完成者",
    },
    {
      quote: "INFJ · 深层洞察者。你会先感受底层动机，再决定怎么靠近。洞察细腻，重视意义感。每一句分析都戳中内心。",
      name: "豆瓣网友 @极光",
      title: "16 型人格测试参与者",
    },
  ];

  const faqs = [
    {
      question: "测试结果是否具有科学性？",
      answer: "SoulTest 优先使用国际公认的开源量表（如 OEJTS 1.2）。虽然测试结果具有较高的倾向性参考，但仍建议仅作为自我探索与娱乐参考，不作为心理诊断依据。",
    },
    {
      question: "测试口令如何获取？",
      answer: "您可以关注我们的官方小红书店铺或指定合作渠道进行购买。支付成功后，您将获得一个唯一的访问口令。",
    },
    {
      question: "口令是否会一次性失效？",
      answer: "不会。我们的口令在有效期内支持在同一设备上重复进入。如果您中途退出，系统会自动保存您的答题进度。",
    },
    {
      question: "如何保存和分享测试结果？",
      answer: "测试完成后，点击底部的“保存结果”按钮即可调起海报预览或系统打印界面。移动端建议长按海报图片进行保存。",
    },
  ];

  return (
    <div className="relative bg-white selection:bg-fuchsia-100">
      {/* Hero Section */}
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-4 items-center justify-center px-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/50 px-4 py-2 text-sm text-slate-600 backdrop-blur-sm">
            <Sparkles className="size-4 text-fuchsia-500" />
            灵测 SoulTest
          </div>
          
          <div className="mt-4">
            <TypewriterEffect words={words} className="text-4xl md:text-7xl lg:text-8xl text-slate-900" />
          </div>
          
          <p className="mt-6 max-w-2xl text-center text-base leading-8 text-slate-600 md:text-xl font-medium">
            每一道题，都在靠近真实的你。我们提供科学严谨的量表与精美绝伦的视觉反馈。
          </p>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <HoverBorderGradient
              containerClassName="rounded-full"
              as="button"
              className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
              onClick={() => {
                const catalog = document.getElementById("catalog");
                catalog?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>开始探索</span>
              <ArrowRight className="size-4" />
            </HoverBorderGradient>
            
            {featuredQuiz ? (
              <Link
                className="inline-flex h-12 items-center rounded-full border border-black/5 bg-white/80 px-8 text-sm font-semibold text-slate-900 transition hover:bg-white backdrop-blur-md"
                to={`/${featuredQuiz.slug}`}
              >
                去小红书购买
              </Link>
            ) : null}
          </div>
        </motion.div>
      </AuroraBackground>

      {/* Stats Section */}
      <div className="bg-slate-50 border-y border-black/5 py-8 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 flex flex-wrap justify-center md:justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-black/5">
              <Users className="size-5 text-fuchsia-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-950">10,000+</p>
              <p className="text-xs text-slate-500 font-medium">累计测试次数</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-black/5">
              <BarChart3 className="size-5 text-sky-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-950">16+</p>
              <p className="text-xs text-slate-500 font-medium">精细人格类型</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-black/5">
              <Target className="size-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-950">100%</p>
              <p className="text-xs text-slate-500 font-medium">科学量表基础</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-black/5">
              <Palette className="size-5 text-violet-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-950">4K</p>
              <p className="text-xs text-slate-500 font-medium">结果分享画质</p>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Section */}
      <section className="py-24 px-6 mx-auto max-w-7xl" id="catalog">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-500 font-bold">Quiz Catalog</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">当前开放题集</h2>
          <p className="mt-4 text-slate-500 max-w-lg mx-auto">挑选你感兴趣的主题，开启一场与自我的深度对话。</p>
        </div>

        {errorMessage ? (
          <div className="rounded-3xl border border-rose-100 bg-rose-50 px-6 py-5 text-sm text-rose-700 max-w-xl mx-auto mb-8">
            {errorMessage}
          </div>
        ) : null}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-3xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <HoverEffect 
            items={quizzes.map(quiz => ({
              title: quiz.title,
              description: quiz.summary,
              link: `/${quiz.slug}`,
              icon: <Sparkles className="size-6 text-fuchsia-500" />,
              extra: (
                <div className="flex gap-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                    <Clock className="size-3" />
                    {quiz.durationMinutes} min
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase">
                    <LayoutPanelTop className="size-3" />
                    {quiz.questionCount} Qs
                  </div>
                </div>
              )
            }))} 
          />
        )}

        {!loading && quizzes.length === 0 ? (
          <div className="rounded-[40px] border border-slate-200 bg-slate-50/50 px-5 py-20 text-center text-sm text-slate-500">
            目前还没有开放的测试，请稍后再来。
          </div>
        ) : null}
      </section>

      {/* Features Section */}
      <section className="bg-slate-900 py-24 rounded-t-[60px] md:rounded-t-[100px]">
        <div className="mx-auto max-w-7xl px-6 mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-400 font-bold">Why SoulTest?</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-white md:text-5xl">不只是测试，更是灵魂的镜子</h2>
        </div>
        <StickyScroll content={features} />
      </section>

      {/* Result Wall Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="text-center mb-16 px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-sky-500 font-bold">Wall of Results</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">在这里，遇见真实的共鸣</h2>
        </div>
        <InfiniteMovingCards items={testimonials} direction="right" speed="slow" />
        <InfiniteMovingCards items={testimonials} direction="left" speed="slow" className="mt-4" />
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 mx-auto max-w-3xl border-t border-black/5">
        <div className="flex items-center gap-3 mb-12">
          <HelpCircle className="size-6 text-fuchsia-500" />
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900">常见问题 FAQ</h2>
        </div>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="group rounded-3xl border border-black/5 bg-slate-50/50 p-6 transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
              <h3 className="text-lg font-bold text-slate-900 flex items-center justify-between">
                {faq.question}
              </h3>
              <p className="mt-4 text-slate-600 leading-7 text-sm font-medium">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 mx-auto max-w-7xl text-center">
        <div className="rounded-[60px] bg-gradient-to-br from-fuchsia-600 to-indigo-700 p-12 md:p-24 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,_rgba(255,255,255,0.15),_transparent_30%)]" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">准备好发现未知的自己了吗？</h2>
            <p className="mt-8 text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-8">
              32 道题，一份属于你的人格图谱。每一道题，都在靠近真实的你。
            </p>
            <div className="mt-12">
              <Link
                to={featuredQuiz ? `/${featuredQuiz.slug}` : "/"}
                className="inline-flex h-14 items-center rounded-full bg-white px-10 text-base font-bold text-fuchsia-600 shadow-xl shadow-fuchsia-900/20 transition hover:scale-105"
              >
                立即开始测试
                <ArrowRight className="ml-2 size-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

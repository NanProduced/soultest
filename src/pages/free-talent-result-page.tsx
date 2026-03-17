import { useRef, useState } from "react"
import { Navigate, useSearchParams, Link } from "react-router"
import { ArrowLeft, ArrowRight, Download, Sparkles, Users, Briefcase, Compass, Star, TrendingUp, Target, Lightbulb } from "lucide-react"

import { FreeQuizRuntimeLoadingScreen, FreeQuizRuntimeUnavailableScreen, useFreeQuizRuntime } from "@/features/free-quizzes/runtime"
import { exportNodeAsPng } from "@/lib/export-node-as-image"

export function FreeTalentResultPage() {
  const [searchParams] = useSearchParams()
  const resultKey = searchParams.get("key")
  const { freeRuntime, isLoading, error } = useFreeQuizRuntime("free/talent")
  const talentResults = (freeRuntime?.resultMap ?? {}) as Record<string, any>
  const result = resultKey ? talentResults[resultKey] : null
  const posterRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState(false)

  if (isLoading) {
    return <FreeQuizRuntimeLoadingScreen className="bg-slate-950 text-white" />
  }

  if (error || Object.keys(talentResults).length === 0) {
    return <FreeQuizRuntimeUnavailableScreen className="bg-slate-950 text-white" backTo="/free/talent" />
  }

  if (!result) {
    return <Navigate replace to="/free/talent" />
  }

  const handleExport = async () => {
    if (!posterRef.current || isExporting) return
    setIsExporting(true)
    try {
      await exportNodeAsPng(posterRef.current, {
        filename: `SoulTest-Talent-${result.name}.png`,
        backgroundColor: '#020617',
        pixelRatio: 2,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        }
      })
    } catch (err) {
      console.error("Export failed", err)
      alert("保存海报失败，请重试")
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div 
      className="text-white selection:bg-white/30 font-sans min-h-screen"
      style={{ background: result.bgGradient }}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-24 md:px-8">
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-center">
          
          <div className="w-full lg:w-[500px] shrink-0">
            
            <div className="hidden lg:flex items-center justify-between mb-6">
               <Link
                to="/free/talent"
                className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white"
              >
                <ArrowLeft className="size-4" /> 重新测试
              </Link>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(251,191,36,0.3)]"
              >
                <Download className="size-4" />
                {isExporting ? "生成中..." : "保存高清海报"}
              </button>
            </div>

            <div 
              ref={posterRef} 
              className="w-full overflow-hidden rounded-[32px] bg-[#020617] border border-white/10 shadow-2xl relative"
            >
              <div 
                className="absolute -top-32 -left-32 w-64 h-64 rounded-full blur-[80px] opacity-40 pointer-events-none"
                style={{ background: result.shadowColor }}
              />
              <div 
                className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full blur-[80px] opacity-40 pointer-events-none"
                style={{ background: result.shadowColor }}
              />

              <div className="relative p-6 sm:p-8">
                <div className="text-center mb-10 mt-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 mb-6">
                    稀有度 {result.rarity}
                  </div>
                  <div className="text-6xl mb-4">{result.icon}</div>
                  <h1 className={`text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br ${result.gradient} pb-2`}>
                    {result.name}
                  </h1>
                  <p className="mt-3 text-sm font-medium text-white/50 uppercase tracking-widest">
                    {result.englishName}
                  </p>
                  <p className="mt-4 text-lg font-serif italic text-white/90">
                    "{result.tagline}"
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-10">
                  {result.keywords.map((kw: string, i: number) => (
                    <span 
                      key={i} 
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 bg-white/5 ${result.textColor}`}
                    >
                      #{kw}
                    </span>
                  ))}
                </div>

                <div className="rounded-2xl bg-white/5 p-5 border border-white/5 mb-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full" style={{ background: result.shadowColor }} />
                  <p className="text-sm leading-relaxed text-white/80 italic font-serif relative z-10">
                    {result.portrait}
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="flex items-center gap-2 text-base font-bold mb-4">
                    <Sparkles className={`size-4 ${result.textColor}`} />
                    深度天赋解读
                  </h3>
                  <div className="space-y-3 text-sm leading-relaxed text-white/70">
                    {result.interpretation.split('\\n').map((para: string, i: number) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="flex items-center gap-2 text-base font-bold mb-4">
                    <Star className={`size-4 ${result.textColor}`} />
                    你的高光时刻
                  </h3>
                  <ul className="space-y-3">
                    {result.highlights.map((moment: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                        <span className={`mt-0.5 ${result.textColor}`}>✦</span>
                        <span className="leading-relaxed">{moment}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-white/5 p-5 border border-white/5 mb-8">
                  <h3 className="text-sm font-bold text-white/50 mb-3 uppercase tracking-widest">隐藏的柔软</h3>
                  <p className="text-sm leading-relaxed text-white/70">
                    {result.softSpot}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 mb-8">
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex gap-4">
                    <div className={`mt-1 p-2 rounded-full bg-white/5 ${result.textColor} shrink-0`}><Briefcase className="size-4"/></div>
                    <div>
                      <h4 className="text-sm font-bold mb-1">职场中</h4>
                      <p className="text-xs text-white/60 leading-relaxed">{result.scenarios.work}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex gap-4">
                    <div className={`mt-1 p-2 rounded-full bg-white/5 ${result.textColor} shrink-0`}><Users className="size-4"/></div>
                    <div>
                      <h4 className="text-sm font-bold mb-1">关系中</h4>
                      <p className="text-xs text-white/60 leading-relaxed">{result.scenarios.relationship}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex gap-4">
                    <div className={`mt-1 p-2 rounded-full bg-white/5 ${result.textColor} shrink-0`}><Lightbulb className="size-4"/></div>
                    <div>
                      <h4 className="text-sm font-bold mb-1">创造中</h4>
                      <p className="text-xs text-white/60 leading-relaxed">{result.scenarios.creation}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6 mb-6">
                  <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="size-4 text-white/50" />
                    天赋成长路径
                  </h3>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {result.growthPath}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6 mb-8">
                  <div>
                    <p className="text-[10px] uppercase text-white/40 mb-1">灵魂名人</p>
                    <p className="text-sm font-medium text-white/90">{result.celebrities}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-white/40 mb-1">最佳拍档</p>
                    <p className="text-sm font-medium text-white/90">{result.bestMatch}</p>
                  </div>
                </div>

                <div className="text-center pt-4 border-t border-white/10">
                  <p className="text-xs text-white/30">
                    SoulTest · 你的隐藏天赋是什么？
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:hidden mt-6 flex items-center justify-between">
              <Link
                to="/free/talent"
                className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white"
              >
                <ArrowLeft className="size-4" /> 重新测试
              </Link>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:scale-105 active:scale-95"
              >
                <Download className="size-4" />
                {isExporting ? "生成中..." : "保存海报"}
              </button>
            </div>
          </div>

          <div className="flex-1 max-w-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                发现你的天赋密码
              </h2>
              <p className="text-white/60 leading-relaxed">
                每个人都有未被发现的超能力。这个测试基于多元智能理论和优势心理学，帮你找到那些你天生就擅长、却可能被忽略的天赋维度。
              </p>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Target className="size-5 text-amber-400" />
                  关于这个测试
                </h3>
                <div className="space-y-2 text-sm text-white/70">
                  <p>• 20 道情景题，每题 4 个选项</p>
                  <p>• 基于六维天赋模型：洞察力、共情力、创造力、表达力、行动力、感知力</p>
                  <p>• 12 种天赋原型，每种都是正向的、值得肯定的</p>
                  <p>• 主天赋 + 副天赋组合，展现你的独特性</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Compass className="size-5 text-amber-400" />
                  如何使用你的结果
                </h3>
                <div className="space-y-2 text-sm text-white/70">
                  <p>• <strong className="text-white">接纳你的天赋</strong>：没有"好"与"坏"的天赋，只有不同的光芒</p>
                  <p>• <strong className="text-white">发挥你的优势</strong>：在工作和生活中多使用你的主天赋</p>
                  <p>• <strong className="text-white">补全你的短板</strong>：了解你的副天赋，让它成为你的助力</p>
                  <p>• <strong className="text-white">分享你的发现</strong>：让更多人了解自己的隐藏天赋</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-6">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Sparkles className="size-5 text-amber-400" />
                  想要更深入的探索？
                </h3>
                <p className="text-sm text-white/70 mb-4">
                  免费测试给你的是天赋的概览。如果你想要更精准、更全面的人格分析，可以试试我们的付费测试：
                </p>
                <div className="space-y-3">
                  <Link 
                    to="/oejts-personality-map"
                    className="block rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-amber-400/50 hover:bg-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white">OEJTS 16 型人格图谱</h4>
                        <p className="text-xs text-white/50 mt-1">32 题完整版 · 深度人格分析</p>
                      </div>
                      <ArrowRight className="size-5 text-white/30" />
                    </div>
                  </Link>
                  <Link 
                    to="/relationship-preference"
                    className="block rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-amber-400/50 hover:bg-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white">亲密关系偏好测试</h4>
                        <p className="text-xs text-white/50 mt-1">30 题完整版 · 爱的语言解码</p>
                      </div>
                      <ArrowRight className="size-5 text-white/30" />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


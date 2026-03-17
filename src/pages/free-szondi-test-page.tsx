import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"

import { FreeQuizRuntimeLoadingScreen, FreeQuizRuntimeUnavailableScreen, useFreeQuizRuntime } from "@/features/free-quizzes/runtime"
import { calculateSzondiResult } from "@/features/free-quizzes/runtime-calculators"

type TestStage = "faces" | "situations" | "loading"

export function FreeSzondiTestPage() {
  const navigate = useNavigate()
  const [stage, setStage] = useState<TestStage>("faces")
  const [currentSeriesIndex, setCurrentSeriesIndex] = useState(0)
  const [currentSituationIndex, setCurrentSituationIndex] = useState(0)
  
  // Track scores for 8 factors
  const [scores, setScores] = useState<Record<string, number>>({
    h: 0, s: 0, e: 0, hy: 0, k: 0, p: 0, d: 0, m: 0
  })

  // Selected facial types for tie-breaking
  const [selectedFacialTypes, setSelectedFacialTypes] = useState<string[]>([])

  // Shuffle faces for each series to prevent positional bias
  const [shuffledFaces, setShuffledFaces] = useState<Array<{ id: string; type: string; src: string }>>([])
  const { freeRuntime, isLoading, error } = useFreeQuizRuntime("free/szondi")

  const fullFacesSets = (freeRuntime?.faceSets ?? []) as Array<Array<{ id: string; type: string; src: string }>>
  const situationalQuestions = (freeRuntime?.situationalQuestions ?? []) as Array<{
    title: string
    subtitle?: string
    options: Array<{ label: string; type: string }>
  }>

  useEffect(() => {
    if (stage === "faces") {
      const faces = [...fullFacesSets[currentSeriesIndex]]
      setShuffledFaces(faces.sort(() => Math.random() - 0.5))
    }
  }, [currentSeriesIndex, stage])

  if (isLoading) {
    return <FreeQuizRuntimeLoadingScreen className="bg-[#0A0A0A] text-white" />
  }

  if (error || fullFacesSets.length === 0) {
    return <FreeQuizRuntimeUnavailableScreen className="bg-[#0A0A0A] text-white" backTo="/free/szondi" />
  }

  const handleFaceSelect = (type: string) => {
    setScores(prev => ({ ...prev, [type]: prev[type] + 3 }))
    setSelectedFacialTypes(prev => [...prev, type])
    
    if (currentSeriesIndex < fullFacesSets.length - 1) {
      setTimeout(() => setCurrentSeriesIndex(prev => prev + 1), 600)
    } else {
      setTimeout(() => setStage("situations"), 600)
    }
  }

  const handleSituationSelect = (type: string) => {
    setScores(prev => ({ ...prev, [type]: prev[type] + 2 }))
    
    if (currentSituationIndex < situationalQuestions.length - 1) {
      setCurrentSituationIndex(prev => prev + 1)
    } else {
      setStage("loading")
    }
  }

  useEffect(() => {
    if (stage === "loading") {
      const timer = setTimeout(() => {
        const { resultType, score } = calculateSzondiResult(scores, selectedFacialTypes)
        navigate(`/free/szondi/result?type=${resultType}&score=${score}`, { replace: true })
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [stage, scores, selectedFacialTypes, navigate])

  const renderFaces = () => {
    return (
      <motion.div
        key={`series-${currentSeriesIndex}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="w-full max-w-5xl"
      >
        <div className="text-center mb-8">
           <span className="text-[10px] uppercase tracking-[0.5em] text-red-500 mb-2 block">
             影相投射阶段 {currentSeriesIndex + 1}/6
           </span>
           <h2 className="text-xl md:text-2xl font-serif text-white/80 tracking-widest">
             凝视这 8 张面孔——哪一张最让你恐惧？
           </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {shuffledFaces.map((face) => (
            <motion.button
              key={face.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleFaceSelect(face.type)}
              className="group relative aspect-[3/4] overflow-hidden bg-neutral-900 border border-white/5 grayscale hover:grayscale-0 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40 z-10" />
              <img 
                src={face.src} 
                alt="face" 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/400x600/000000/333333?text=${face.id}`
                }}
              />
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-900/50 group-hover:shadow-[inset_0_0_40px_rgba(153,27,27,0.4)] transition-all pointer-events-none z-20" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    )
  }

  const renderSituation = () => {
    const question = situationalQuestions[currentSituationIndex]
    return (
      <motion.div
        key={currentSituationIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-3xl"
      >
        <div className="mb-12 text-center">
          <span className="text-[10px] uppercase tracking-[0.5em] text-red-500 mb-4 block">场景置入 {currentSituationIndex + 1}/3</span>
          <h2 className="text-xl md:text-2xl font-light leading-relaxed text-white/90 mb-4">
            {question.title}
          </h2>
          {question.subtitle && (
            <p className="text-sm text-white/40 font-light leading-relaxed">
              {question.subtitle}
            </p>
          )}
        </div>
        <div className="grid gap-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSituationSelect(option.type)}
              className="group relative w-full text-left p-6 bg-white/[0.02] border border-white/10 hover:border-red-900/40 hover:bg-red-900/5 transition-all duration-300 rounded-lg overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-red-800 transition-colors" />
              <span className="text-white/60 group-hover:text-white transition-colors">{option.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    )
  }

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center text-center space-y-12">
      <div className="relative size-32">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border border-red-900/30 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 border border-red-500/20 rounded-full border-dashed"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="size-8 text-red-600 animate-spin" />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-serif tracking-[0.3em] uppercase text-red-500">正在解码潜意识暗影...</h3>
        <p className="text-white/30 text-xs tracking-widest animate-pulse">
          正在分析面孔瞳孔反应 • 正在重构防御机制 • 正在追溯童年印记
        </p>
      </div>

      <div className="flex gap-2">
        {Object.keys(scores).map((key) => (
          <motion.div
            key={key}
            animate={{ 
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              delay: Math.random() * 2 
            }}
            className="size-1 rounded-full bg-red-800"
          />
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,0,0,0.1),transparent_70%)]" />

      {/* Header */}
      {stage !== "loading" && (
        <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-6">
          <button
            onClick={() => navigate(-1)}
            className="size-10 flex items-center justify-center border border-white/10 rounded-full hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="size-5 text-white/40" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="h-0.5 w-32 bg-white/5 relative overflow-hidden">
               <motion.div 
                className="absolute inset-y-0 left-0 bg-red-900"
                initial={{ width: 0 }}
                animate={{ 
                  width: stage === "faces" 
                    ? `${((currentSeriesIndex + 1) / 9) * 100}%` 
                    : `${((currentSituationIndex + 7) / 9) * 100}%` 
                }}
               />
            </div>
            <span className="text-[10px] tracking-tighter text-white/20 uppercase font-mono">
               System.Szondi.Active
            </span>
          </div>
        </header>
      )}

      <main className="relative z-10 w-full flex flex-col items-center">
        <AnimatePresence mode="wait">
          {stage === "faces" && renderFaces()}
          {stage === "situations" && renderSituation()}
          {stage === "loading" && renderLoading()}
        </AnimatePresence>
      </main>

      {/* Background Decorative */}
      <div className="absolute bottom-12 left-12 opacity-5 pointer-events-none select-none text-[8rem] font-serif italic text-white leading-none">
        {stage === "faces" ? (currentSeriesIndex + 1).toString().padStart(2, '0') : (currentSituationIndex + 7).toString().padStart(2, '0')}
      </div>
    </div>
  )
}



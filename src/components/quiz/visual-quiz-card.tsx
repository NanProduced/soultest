import { ArrowRight, Clock, Sparkles } from "lucide-react"
import { Link } from "react-router"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import type { MouseEvent } from "react"

import type { QuizCatalogItem } from "@/features/quizzes/types"
import { cn } from "@/lib/utils"

interface VisualQuizCardProps {
  quiz: QuizCatalogItem
  index: number
}

function getQuizCoverImage(slug: string, fallbackIndex: number) {
  switch (slug) {
    case "free/aura": return "/images/quizzes/aura.jpg"
    case "free/banwei": return "/images/quizzes/banwei.jpg"
    case "free/painting": return "/images/quizzes/painting.jpg"
    case "free/talent": return "/images/quizzes/talent.jpg"
    case "free/szondi": return "/images/quizzes/szondi.jpg"
    case "free/soul-city": return "/images/quizzes/soul-city-cover.jpg"
    case "oejts-personality-map": return "/images/quizzes/oejts.jpg"
    case "relationship-preference-test": return "/images/quizzes/relationship-preference.jpg"
    case "dark-triad": return "/images/quizzes/dark-triad.jpg"
    case "enneagram": return "/images/quizzes/enneagram.jpg"
    case "bigfive": return "/images/quizzes/bigfive.jpg"
    case "hexaco-60": return "/images/quizzes/hexaco.jpg"
    case "soul-tarot": return "/images/quizzes/soul-tarot.jpg"
    case "riasec-48": return "/images/quizzes/riasec.jpg"
    case "stress-load-test": return "/images/quizzes/stress-load.jpg"
    case "desire-composition": return "/images/quizzes/desire-composition.jpg"
    default: {
      const fallbackImages = [
        "/images/quizzes/oejts.jpg",
        "/images/quizzes/relationship-preference.jpg",
        "/images/quizzes/talent.jpg",
      ]
      return fallbackImages[fallbackIndex % fallbackImages.length]
    }
  }
}

export function VisualQuizCard({ quiz, index }: VisualQuizCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="h-full"
    >
      <Link
        to={`/${quiz.slug}`}
        onMouseMove={handleMouseMove}
        className="group relative block h-full aspect-[4/5] overflow-hidden rounded-[40px] bg-[#0c0c0e] border border-white/5 transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]"
      >
        {/* Spotlight Effect */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-[40px] opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                450px circle at ${mouseX}px ${mouseY}px,
                rgba(139, 92, 246, 0.15),
                transparent 80%
              )
            `,
          }}
        />

        {/* Background Image */}
        <div className="absolute inset-0 transition-transform duration-1000 ease-out group-hover:scale-110">
          <img
            src={getQuizCoverImage(quiz.slug, index)}
            alt={quiz.title}
            className="h-full w-full object-cover opacity-60 grayscale-[0.2] transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/40 to-transparent" />
        </div>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
          <div className="space-y-6">
            {/* Top Row: Tags */}
            <div className="flex flex-wrap items-center gap-2 transform transition-transform duration-500 group-hover:-translate-y-2">
              <span className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide backdrop-blur-xl border",
                quiz.accessType === "free" 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                  : "bg-violet-500/10 border-violet-500/20 text-violet-400"
              )}>
                {quiz.accessType === "free" ? <Sparkles className="size-3" /> : null}
                {quiz.accessType === "free" ? "免费体验" : "付费正式版"}
              </span>
              <span className="rounded-full bg-white/5 px-4 py-1.5 text-xs font-medium backdrop-blur-xl border border-white/10 text-slate-300">
                {quiz.category}
              </span>
            </div>

            {/* Main Info */}
            <div className="space-y-3">
              <h3 className="text-2xl md:text-3xl font-bold leading-[1.15] text-white transition-colors duration-300 group-hover:text-violet-200">
                {quiz.title}
              </h3>
              <p className="line-clamp-2 text-sm md:text-base text-slate-400/90 leading-relaxed transition-all duration-500 group-hover:text-slate-200">
                {quiz.summary}
              </p>
            </div>

            {/* Bottom Meta */}
            <div className="flex items-center justify-between pt-6 border-t border-white/5 transform transition-all duration-500 group-hover:border-white/15">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Clock className="size-3.5" />
                  <span>{quiz.durationMinutes} min</span>
                </div>
                <div className="h-1 w-1 rounded-full bg-slate-700" />
                <span className="text-xs font-medium text-slate-500">{quiz.questionCount} 题</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:text-violet-400 transition-colors">
                <span className="hidden sm:inline">立即开启</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:scale-110">
                  <ArrowRight className="size-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function VisualQuizCardSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="aspect-[4/5] animate-pulse rounded-[40px] bg-white/5" />
      ))}
    </div>
  )
}




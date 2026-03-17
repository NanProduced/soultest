import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Clock } from "lucide-react"
import { Link } from "react-router"

import type { QuizCatalogItem } from "@/features/quizzes/types"
import { Badge } from "@/components/reui/badge"

interface FlipQuizCardProps {
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

export function FlipQuizCard({ quiz, index }: FlipQuizCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div 
      className="group perspective-1000 h-[420px] w-full"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative h-full w-full preserve-3d transition-all duration-700"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden overflow-hidden rounded-[32px] border border-white/10 bg-slate-900">
          <img
            src={getQuizCoverImage(quiz.slug, index)}
            alt={quiz.title}
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
             <div className="mb-2 flex items-center gap-2">
                <Badge variant={quiz.accessType === "free" ? "success-light" : "primary-light"} size="sm" className="backdrop-blur-md">
                   {quiz.accessType === "free" ? "FREE" : "PRO"}
                </Badge>
             </div>
             <h3 className="text-2xl font-bold text-white leading-tight">{quiz.title}</h3>
          </div>
        </div>

        {/* Back Face */}
        <div 
          className="absolute inset-0 backface-hidden overflow-hidden rounded-[32px] border border-white/10 bg-[#121216] p-8 [transform:rotateY(180deg)] flex flex-col justify-between"
        >
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <Badge variant="invert-light" size="xs">{quiz.category}</Badge>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                   <Clock className="size-3.5" />
                   <span>{quiz.durationMinutes} min</span>
                </div>
             </div>
             <h3 className="text-xl font-bold text-white">{quiz.title}</h3>
             <p className="text-sm text-slate-400 leading-relaxed line-clamp-4">
                {quiz.summary}
             </p>
             <div className="flex flex-wrap gap-1.5">
                {quiz.tags.slice(0, 3).map(tag => (
                   <span key={tag} className="text-[10px] bg-white/5 text-slate-500 px-2 py-0.5 rounded-full border border-white/5">#{tag}</span>
                ))}
             </div>
          </div>

          <Link
            to={`/${quiz.slug}`}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-sm font-bold text-black transition-transform hover:scale-[1.02] active:scale-98"
          >
            开始测试 <ArrowRight className="size-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export function FlipQuizCardSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="h-[420px] animate-pulse rounded-[32px] bg-white/5" />
      ))}
    </div>
  )
}



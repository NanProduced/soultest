import { ArrowRight, Clock } from "lucide-react"
import { Link } from "react-router"

import type { QuizCatalogItem } from "@/features/quizzes/types"
import { cn } from "@/lib/utils"

interface PublicQuizCardProps {
  quiz: QuizCatalogItem
  index: number
  compact?: boolean
}

function getAccessBadgeClasses(accessType: QuizCatalogItem["accessType"]) {
  return accessType === "free"
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
    : "border-violet-500/30 bg-violet-500/10 text-violet-300"
}

function getActionCopy(accessType: QuizCatalogItem["accessType"]) {
  return accessType === "free" ? "立即体验" : "查看详情"
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

export function PublicQuizCard({ quiz, index, compact = false }: PublicQuizCardProps) {
  return (
    <Link
      to={`/${quiz.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
    >
      <div className={cn("relative overflow-hidden", compact ? "aspect-[4/3]" : "aspect-[16/10]") }>
        <img
          src={getQuizCoverImage(quiz.slug, index)}
          alt={quiz.title}
          className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-[#09090B]/30 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium", getAccessBadgeClasses(quiz.accessType))}>
            {quiz.accessType === "free" ? "免费" : "正式"}
          </span>
          {!compact && (
            <span className="rounded-full border border-white/10 bg-black/35 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur">
              {quiz.category}
            </span>
          )}
        </div>
        {!compact && (
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/35 px-2.5 py-0.5 text-[10px] text-white/80 backdrop-blur">
            <Clock className="size-3" />
            约 {quiz.durationMinutes} 分钟 · {quiz.questionCount} 题
          </div>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col gap-3", compact ? "p-4" : "p-6")}>
        <div className="space-y-1.5">
          <h3 className={cn("font-semibold tracking-tight text-white group-hover:text-white/90", compact ? "text-base line-clamp-1" : "text-xl")}>{quiz.title}</h3>
          <p className={cn("line-clamp-2 text-slate-400", compact ? "text-xs leading-5" : "text-sm leading-6")}>{quiz.summary}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {quiz.tags.slice(0, compact ? 2 : 3).map((tag) => (
            <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-300">
              {tag}
            </span>
          ))}
        </div>

        <div className={cn("mt-auto flex items-center justify-between gap-2 border-t border-white/5 pt-3 text-xs", compact ? "text-[11px]" : "text-sm")}>
          <span className="text-slate-400">{quiz.priceLabel}</span>
          <span className={cn("inline-flex items-center gap-1 font-medium", quiz.accessType === "free" ? "text-emerald-300" : "text-violet-300") }>
            {getActionCopy(quiz.accessType)}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function PublicQuizCardSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="aspect-[3/4] animate-pulse rounded-[24px] bg-white/5" />
      ))}
    </div>
  )
}




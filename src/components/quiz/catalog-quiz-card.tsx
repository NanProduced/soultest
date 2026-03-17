import { ArrowRight, Clock } from "lucide-react"
import { Link } from "react-router"
import { Badge } from "@/components/reui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import type { QuizCatalogItem } from "@/features/quizzes/types"

interface CatalogQuizCardProps {
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

export function CatalogQuizCard({ quiz, index }: CatalogQuizCardProps) {
  return (
    <Card className="w-full h-full border-white/5 bg-[#121216] overflow-hidden group hover:border-white/10 transition-colors rounded-[24px] flex flex-col">
      <CardContent className="flex flex-col flex-1 p-5">
        <div className="rounded-xl relative h-48 w-full overflow-hidden shrink-0">
          <img
            src={getQuizCoverImage(quiz.slug, index)}
            alt={quiz.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-3 left-3">
             <Badge variant={quiz.accessType === "free" ? "success-light" : "primary-light"} size="xs" className="backdrop-blur-md">
                {quiz.accessType === "free" ? "FREE" : "PRO"}
             </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mt-5">
          <Badge variant="outline" size="xs" className="border-white/10 text-slate-400">
            {quiz.category}
          </Badge>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <Clock className="size-3" />
            <span>{quiz.durationMinutes} min</span>
          </div>
        </div>

        <div className="flex flex-col flex-1 mt-4">
            <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-purple-400 transition-colors">
                {quiz.title}
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mt-2">
                {quiz.summary}
            </p>
        </div>

        <Button asChild className="w-full h-10 rounded-xl bg-white text-black hover:bg-slate-200 text-xs font-bold transition-all active:scale-95 mt-5 shrink-0">
          <Link to={`/${quiz.slug}`}>
            开始探索
            <ArrowRight className="size-3.5 ml-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export function CatalogQuizCardSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="h-full min-h-[340px] animate-pulse rounded-[24px] bg-white/5" />
      ))}
    </div>
  )
}



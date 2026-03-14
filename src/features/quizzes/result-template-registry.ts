import type { ComponentType } from "react"

import {
  CareerEnergyTemplate,
  DefaultStoryTemplate,
  OejtsProfileTemplate,
  RelationshipStoryTemplate,
} from "@/features/quizzes/result-templates"
import type { QuizResultTemplateProps } from "@/features/quizzes/result-templates"
import type { ResultTemplateKey } from "@/features/quizzes/types"

const resultTemplateMap: Record<string, ComponentType<QuizResultTemplateProps>> = {
  "career-energy": CareerEnergyTemplate,
  "oejts-profile": OejtsProfileTemplate,
  "relationship-story": RelationshipStoryTemplate,
  "story-card": DefaultStoryTemplate,
}

export function getResultTemplateComponent(templateKey: ResultTemplateKey) {
  return resultTemplateMap[templateKey] ?? DefaultStoryTemplate
}

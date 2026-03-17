import type { ComponentType } from "react"

import {
  BigFiveProfileTemplate,
  CareerEnergyTemplate,
  DefaultStoryTemplate,
  EnneagramProfileTemplate,
  HexacoProfileTemplate,
  OejtsProfileTemplate,
  RelationshipStoryTemplate,
  RiasecProfileTemplate,
  TarotProfileTemplate,
} from "@/features/quizzes/result-templates"
import type { QuizResultTemplateProps } from "@/features/quizzes/result-templates"
import type { ResultTemplateKey } from "@/features/quizzes/types"

const resultTemplateMap: Record<string, ComponentType<QuizResultTemplateProps>> = {
  "bigfive-profile": BigFiveProfileTemplate,
  "career-energy": CareerEnergyTemplate,
  "enneagram-profile": EnneagramProfileTemplate,
  "oejts-profile": OejtsProfileTemplate,
  "relationship-story": RelationshipStoryTemplate,
  "riasec-profile": RiasecProfileTemplate,
  "story-card": DefaultStoryTemplate,
  "hexaco-profile": HexacoProfileTemplate,
  "tarot-profile": TarotProfileTemplate,
}

export function getResultTemplateComponent(templateKey: ResultTemplateKey) {
  return resultTemplateMap[templateKey] ?? DefaultStoryTemplate
}



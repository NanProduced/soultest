import type { ComponentType } from "react"

import type {
  QuizResultDefinition,
  QuizRuntimeConfig,
  StoredQuizResult,
  VerifyAccessResponse,
} from "@/features/quizzes/types"

export interface CustomQuizPageProps {
  accessSession: VerifyAccessResponse
  runtime: QuizRuntimeConfig
}

export interface CustomQuizResultPageProps {
  runtime: QuizRuntimeConfig
  result: QuizResultDefinition
  submission: StoredQuizResult
}

const customQuizPages: Record<string, ComponentType<CustomQuizPageProps>> = {}
const customQuizResultPages: Record<string, ComponentType<CustomQuizResultPageProps>> = {}

export function getCustomQuizPage(slug: string) {
  return customQuizPages[slug]
}

export function getCustomQuizResultPage(slug: string) {
  return customQuizResultPages[slug]
}

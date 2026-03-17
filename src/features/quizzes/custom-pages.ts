import type { ComponentType } from "react"

import type {
  QuizResultDefinition,
  QuizRuntimeConfig,
  StoredQuizResult,
  VerifyAccessResponse,
} from "@/features/quizzes/types"

import { DarkTriadTestPage } from "@/pages/dark-triad-test-page"
import { DarkTriadResultPage } from "@/pages/dark-triad-result-page"
import { StressLoadTestPage } from "@/pages/stress-load-test-page"
import { StressLoadResultPage } from "@/pages/stress-load-result-page"
import { DesireCompositionTestPage } from "@/pages/desire-composition-test-page"
import { DesireCompositionResultPage } from "@/pages/desire-composition-result-page"

export interface CustomQuizPageProps {
  accessSession: VerifyAccessResponse
  runtime: QuizRuntimeConfig
}

export interface CustomQuizResultPageProps {
  runtime: QuizRuntimeConfig
  result: QuizResultDefinition
  submission: StoredQuizResult
}

const customQuizPages: Record<string, ComponentType<CustomQuizPageProps>> = {
  "dark-triad": DarkTriadTestPage,
  "stress-load-test": StressLoadTestPage,
  "desire-composition": DesireCompositionTestPage,
}

const customQuizResultPages: Record<string, ComponentType<CustomQuizResultPageProps>> = {
  "dark-triad": DarkTriadResultPage,
  "stress-load-test": StressLoadResultPage,
  "desire-composition": DesireCompositionResultPage,
}

export function getCustomQuizPage(slug: string) {
  return customQuizPages[slug]
}

export function getCustomQuizResultPage(slug: string) {
  return customQuizResultPages[slug]
}


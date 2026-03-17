import { lazy, type ComponentType } from "react"
import type {
  QuizResultDefinition,
  QuizRuntimeConfig,
  StoredQuizResult,
  VerifyAccessResponse,
} from "@/features/quizzes/types"

/**
 * 自定义页面组件的 Props 定义
 */
export interface CustomIntroPageProps {
  slug: string
}

export interface CustomTestPageProps {
  accessSession: VerifyAccessResponse
  runtime: QuizRuntimeConfig
}

export interface CustomResultPageProps {
  slug: string
  submissionId: string
  /** 兼容性 Props：由通用容器预加载的数据 */
  runtime?: QuizRuntimeConfig
  result?: QuizResultDefinition
  submission?: StoredQuizResult
}

/**
 * 题目 UI 注册配置
 */
export interface QuizPageConfig {
  /** 详情页/入口页 */
  intro?: ComponentType<CustomIntroPageProps>
  /** 测试页/答题页 */
  test?: ComponentType<CustomTestPageProps>
  /** 结果页/报告页 */
  result?: ComponentType<CustomResultPageProps>
}

/**
 * 题目 UI 注册表
 * 使用 Record<string, QuizPageConfig> 存储，key 为题目 slug
 * 全部采用 lazy 加载，切断循环依赖并优化性能
 */
const quizPageRegistry: Record<string, QuizPageConfig> = {
  "oejts-personality-map": {
    intro: lazy(() => import("./oejts-personality-map/intro")),
  },
  "enneagram": {
    intro: lazy(() => import("./enneagram/intro")),
  },
  "bigfive": {
    intro: lazy(() => import("./bigfive/intro")),
  },
  "hexaco-60": {
    intro: lazy(() => import("./hexaco-60/intro")),
  },
  "dark-triad": {
    intro: lazy(() => import("./dark-triad/intro")),
    test: lazy(() => import("@/pages/dark-triad-test-page").then(m => ({ default: m.DarkTriadTestPage }))),
    result: lazy(() => import("@/pages/dark-triad-result-page").then(m => ({ default: m.DarkTriadResultPage }))),
  },
  "relationship-preference-test": {
    intro: lazy(() => import("./relationship-preference-test/intro")),
  },
  "riasec-48": {
    intro: lazy(() => import("./riasec-48/intro")),
  },
  "stress-load-test": {
    intro: lazy(() => import("./stress-load-test/intro")),
    test: lazy(() => import("@/pages/stress-load-test-page").then(m => ({ default: m.StressLoadTestPage }))),
    result: lazy(() => import("@/pages/stress-load-result-page").then(m => ({ default: m.StressLoadResultPage }))),
  },
  "desire-composition": {
    intro: lazy(() => import("./desire-composition/intro")),
    test: lazy(() => import("@/pages/desire-composition-test-page").then(m => ({ default: m.DesireCompositionTestPage }))),
    result: lazy(() => import("@/pages/desire-composition-result-page").then(m => ({ default: m.DesireCompositionResultPage }))),
  },
  "soul-tarot": {
    intro: lazy(() => import("./soul-tarot/intro")),
  },
}

/**
 * 获取指定题目的自定义页面配置
 */
export function getQuizCustomPages(slug: string): QuizPageConfig | undefined {
  return quizPageRegistry[slug]
}

/**
 * 导出注册表供其他模块使用（如自动化路由生成）
 */
export { quizPageRegistry }

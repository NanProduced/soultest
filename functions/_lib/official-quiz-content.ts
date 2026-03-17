import { getMockQuizIntro, getMockRuntimeConfig } from "./mock-data"

export function getStaticQuizIntro(slug: string) {
  return getMockQuizIntro(slug)
}

export function getStaticRuntimeConfig(slug: string) {
  return getMockRuntimeConfig(slug)
}

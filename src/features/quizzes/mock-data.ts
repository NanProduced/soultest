import type { QuizCatalogItem } from "@/features/quizzes/types"

export const quizCatalog: QuizCatalogItem[] = [
  {
    id: "quiz_mbti_reimagined",
    slug: "personality-archetype",
    title: "人格原型实验室",
    category: "人格 / 性格",
    summary: "测出你在人群中的天然气质、隐藏锋芒与最真实的相处方式。",
    tagline: "如果你总觉得别人认识的你，和真正的你并不一样，这套会很适合你。",
    priceLabel: "深度测试",
    durationMinutes: 6,
    questionCount: 28,
    accessSummary: "购买后输入口令即可开始",
    tags: ["人格画像", "角色气质", "适合分享"],
    valuePoints: [
      "看到你最突出的性格原型",
      "读懂你在关系里的第一反应",
      "拿到一份更容易被共鸣的结果页",
    ],
    flowSteps: ["输入口令", "完成 28 道题", "生成专属人格画像", "保存结果页"],
  },
  {
    id: "quiz_love_pattern",
    slug: "love-pattern-map",
    title: "亲密关系模式图谱",
    category: "情感 / 关系",
    summary: "用 8 道题看清你在亲密关系里的表达习惯、需要的安全感和理想相处方式。",
    tagline: "适合总在关系里反复猜自己，也猜不透对方的人。",
    priceLabel: "热门测试",
    durationMinutes: 4,
    questionCount: 8,
    accessSummary: "购买后输入口令即可开始",
    tags: ["亲密关系", "安全感", "相处建议"],
    valuePoints: [
      "更快看懂自己在关系里的真实需求",
      "获得一份可随时回看的关系画像",
      "看到更适合你的相处建议",
    ],
    flowSteps: ["输入口令", "完成 8 道题", "生成关系画像", "查看相处建议"],
  },
  {
    id: "quiz_workplace_energy",
    slug: "workplace-energy-profile",
    title: "职场能量画像",
    category: "职场 / 天赋",
    summary: "看见你的工作节奏、协作风格，以及你最容易发光的状态。",
    tagline: "适合正在找方向、做选择，或总觉得自己在工作里使不上劲的人。",
    priceLabel: "轻量体验",
    durationMinutes: 5,
    questionCount: 20,
    accessSummary: "领取体验口令后即可开始",
    tags: ["职场风格", "协作偏好", "能量状态"],
    valuePoints: [
      "知道自己最舒服的工作节奏",
      "看清适合你的协作方式",
      "找到更容易发光的高能区",
    ],
    flowSteps: ["输入口令", "完成 20 道题", "生成能量画像", "查看行动建议"],
  },
]

export function getQuizBySlug(slug: string) {
  return quizCatalog.find((quiz) => quiz.slug === slug)
}

import type { QuizRuntimeConfig, QuizResultDefinition } from "./types"

export const sd3Archetypes = [
  { code: "A1", name: "幕后棋手", nameEn: "The Strategist", tagline: "你不动声色，但没有一步是多余的", color: "#4A3B6B", icon: "♟️" },
  { code: "A2", name: "聚光猎手", nameEn: "The Spotlight", tagline: "你不是想被看见，是不能接受被忽略", color: "#C5A029", icon: "👑" },
  { code: "A3", name: "冷刃行者", nameEn: "The Cold Edge", tagline: "你不怕翻桌，但别人怕你翻桌", color: "#8B1A1A", icon: "🗡️" },
  { code: "A4", name: "权力建筑师", nameEn: "The Power Architect", tagline: "你既要赢局面，也要赢位置", color: "#3D2B5A", icon: "🏛️" },
  { code: "A5", name: "暗夜操盘手", nameEn: "The Dark Dealer", tagline: "你先看清楚，再下狠手", color: "#2C1810", icon: "🎰" },
  { code: "A6", name: "烈焰王座", nameEn: "The Burning Throne", tagline: "你不退场，也不接受被轻慢", color: "#B22222", icon: "🔥" },
  { code: "A7", name: "暗面全能", nameEn: "The Dark Triad", tagline: "你会算、会演、也敢拼——三件套齐了", color: "#1C1C1C", icon: "🌑" },
  { code: "A8", name: "灰域行者", nameEn: "The Gray Walker", tagline: "你不极端，但每条线都比别人多走半步", color: "#6B6B6B", icon: "🌫️" },
  { code: "A9", name: "光面主导", nameEn: "The Light Side", tagline: "你的暗面能量很低，这不一定是优势", color: "#E8E0D0", icon: "☀️" }
]

export const sd3Results: QuizResultDefinition[] = [
  {
    key: "sd3-result",
    title: "暗面力量测试结果",
    summary: "基于三维人格特质的深度解析",
  }
]

export const sd3Runtime: QuizRuntimeConfig = {
  meta: {
    slug: "dark-triad",
    title: "暗面力量测试",
    summary: "每个人都有不愿意承认的那一面。心理学家发现，人格中存在三种隐性力量——它们帮你在竞争中占据优势，也可能悄悄推高你付出的代价。",
    estimatedMinutes: 5,
    tags: ["人格特质", "深度测试", "自我探索", "心理学"],
    category: "专业量表"
  },
  runtime: {
    renderer: "custom",
    resultTemplate: "custom"
  },
  questions: [
    // Machiavellianism
    { id: "Q01", chapter: 1, title: "把自己的秘密轻易告诉别人并不明智。", trait: "mach", reverse: false },
    { id: "Q02", chapter: 1, title: "为了达到目的，我会用巧妙的手段影响别人。", trait: "mach", reverse: false },
    { id: "Q03", chapter: 1, title: "不管用什么办法，都要把关键人物拉到自己这边。", trait: "mach", reverse: false },
    { id: "Q04", chapter: 1, title: "我会避免与人正面冲突，因为他们以后也许还有用。", trait: "mach", reverse: false },
    { id: "Q05", chapter: 1, title: "记住那些以后可能派上用场、甚至能拿来制衡别人的信息，是明智的。", trait: "mach", reverse: false },
    { id: "Q06", chapter: 1, title: "如果需要给出回应，我倾向于等到最合适的时机。", trait: "mach", reverse: false },
    { id: "Q07", chapter: 1, title: "为了维护自己的形象，有些事最好不要让别人知道。", trait: "mach", reverse: false },
    { id: "Q08", chapter: 1, title: "制定计划时，首先要确保自己受益，而不是别人。", trait: "mach", reverse: false },
    { id: "Q09", chapter: 1, title: "大多数人其实都可以被影响，甚至被操控。", trait: "mach", reverse: false },
    // Narcissism
    { id: "Q10", chapter: 2, title: "别人往往觉得我天生就适合带头。", trait: "narc", reverse: false },
    { id: "Q11", chapter: 2, title: "我不喜欢成为众人关注的中心。", trait: "narc", reverse: true },
    { id: "Q12", chapter: 2, title: "如果没有我，很多群体活动都会变得无聊。", trait: "narc", reverse: false },
    { id: "Q13", chapter: 2, title: "我知道自己很特别，因为身边的人一直都这么说。", trait: "narc", reverse: false },
    { id: "Q14", chapter: 2, title: "我喜欢结识有影响力、地位高的人。", trait: "narc", reverse: false },
    { id: "Q15", chapter: 2, title: "当别人夸奖我时，我会觉得不好意思。", trait: "narc", reverse: true },
    { id: "Q16", chapter: 2, title: "我曾被人拿来和名人作比较。", trait: "narc", reverse: false },
    { id: "Q17", chapter: 2, title: "我觉得自己只是个很普通的人。", trait: "narc", reverse: true },
    { id: "Q18", chapter: 2, title: "我会坚持得到与自己相称的尊重。", trait: "narc", reverse: false },
    // Psychopathy
    { id: "Q19", chapter: 3, title: "面对不合理的权威压制，我内心更想反击而不是忍耐。", trait: "psych", reverse: false },
    { id: "Q20", chapter: 3, title: "我会尽量避开危险的情境。", trait: "psych", reverse: true },
    { id: "Q21", chapter: 3, title: "如果决定回应冒犯，我倾向于快速而强硬。", trait: "psych", reverse: false },
    { id: "Q22", chapter: 3, title: "别人常说我有点失控。", trait: "psych", reverse: false },
    { id: "Q23", chapter: 3, title: "我承认，自己有时对别人会相当刻薄。", trait: "psych", reverse: false },
    { id: "Q24", chapter: 3, title: "冒犯过我的人，通常会意识到他们不该那么做。", trait: "psych", reverse: false },
    { id: "Q25", chapter: 3, title: "我从没惹上过法律麻烦。", trait: "psych", reverse: true },
    { id: "Q26", chapter: 3, title: "我对亲密关系的态度比大多数人更开放和随性。", trait: "psych", reverse: false },
    { id: "Q27", chapter: 3, title: "为了达成目标，我愿意说一些别人不太敢说的话。", trait: "psych", reverse: false },
  ],
  results: sd3Results,
}

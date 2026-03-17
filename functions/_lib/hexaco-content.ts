import type { QuizRuntimeConfig, QuizResultDefinition } from "./types"

export const hexacoDimensions = [
  { key: "H", label: "诚实—谦逊" },
  { key: "E", label: "情绪性" },
  { key: "X", label: "外向性" },
  { key: "A", label: "宜人性" },
  { key: "C", label: "尽责性" },
  { key: "O", label: "开放性" },
]

export const hexacoResults: QuizResultDefinition[] = [
  {
    key: "H",
    dimensionKey: "H",
    title: "诚实—谦逊 (Honesty-Humility)",
    summary: "诚实—谦逊维度反映了你对公平、真诚和地位的态度。高分者通常表现出真诚、公平、不贪婪和谦逊；低分者可能更看重实际利益、地位和自我优先级。",
    overview: "这一维度是 HEXACO 模型中最具特色的部分，它区分了那些追求公平正义的人和那些为了个人利益愿意钻空子的人。",
  },
  {
    key: "E",
    dimensionKey: "E",
    title: "情绪性 (Emotionality)",
    summary: "情绪性维度衡量你对风险、依赖和情感触动的敏感度。高分者通常更感性、更需要情感支持；低分者则表现出更强的抗压能力和情感独立性。",
    overview: "情绪性不仅关乎情绪波动，更关乎你在面对危险或离别时的自然反应和心理防御机制。",
  },
  {
    key: "X",
    dimensionKey: "X",
    title: "外向性 (Extraversion)",
    summary: "外向性反映了你在社交场合中的活跃程度和获得能量的方式。高分者通常自信、充满活力且喜欢社交；低分者则更偏好低刺激的互动和独立空间。",
    overview: "外向性决定了你如何与外界连接，以及你在人群中展现出的能量场和影响力。",
  },
  {
    key: "A",
    dimensionKey: "A",
    title: "宜人性 (Agreeableness)",
    summary: "宜人性体现了你在冲突中的温和度、耐心和宽容心。高分者倾向于原谅和合作；低分者则在面对分歧时表现得更加直接、坚定甚至强硬。",
    overview: "这一维度衡量的是你处理人际摩擦的“柔软度”，即你在被冒犯时是选择修复关系还是升级对抗。",
  },
  {
    key: "C",
    dimensionKey: "C",
    title: "尽责性 (Conscientiousness)",
    summary: "尽责性衡量你的秩序感、勤勉程度和对结果的责任感。高分者通常靠谱、有条理且追求完美；低分者则更依赖情境驱动，表现出更强的灵活性。",
    overview: "尽责性是你达成目标、履行承诺的“稳定器”，它决定了你做事的方式是结构化的还是随性的。",
  },
  {
    key: "O",
    dimensionKey: "O",
    title: "开放性 (Openness to Experience)",
    summary: "开放性反映了你对新观点、新体验和复杂事物的接受度。高分者通常好奇、富有想象力且思维开阔；低分者则更看重实用性和已知框架。",
    overview: "开放性是你探索世界的“触角”，它决定了你对未知事物的好奇程度以及你思维的广度和深度。",
  },
]

export const hexacoQuestions = [
  { id: "Q01", title: "即使占便宜不会被发现，我也不太愿意这么做。", trait: "H", reverse: false },
  { id: "Q02", title: "我会担心重要的人突然遇到意外。", trait: "E", reverse: false },
  { id: "Q03", title: "在陌生人面前，我通常也能自然开口。", trait: "X", reverse: false },
  { id: "Q04", title: "与人有摩擦后，我通常愿意留点余地。", trait: "A", reverse: false },
  { id: "Q05", title: "我做事会先排出步骤，而不是想到哪做到哪。", trait: "C", reverse: false },
  { id: "Q06", title: "新鲜的观点或不同寻常的想法通常会吸引我。", trait: "O", reverse: false },
  { id: "Q07", title: "如果规则有空子可钻，我有时也会想办法为自己多拿一点。", trait: "H", reverse: true },
  { id: "Q08", title: "我很少因为潜在风险而提前紧张。", trait: "E", reverse: true },
  { id: "Q09", title: "社交场合里，我通常更想躲在角落而不是参与进去。", trait: "X", reverse: true },
  { id: "Q10", title: "别人一旦惹到我，我会记很久。", trait: "A", reverse: true },
  { id: "Q11", title: "我经常拖到最后才开始处理重要的事。", trait: "C", reverse: true },
  { id: "Q12", title: "我对抽象、理论或观念类的话题通常没什么兴趣。", trait: "O", reverse: true },
  { id: "Q13", title: "在资源或利益分配上，我会尽量让事情保持公正。", trait: "H", reverse: false },
  { id: "Q14", title: "当我情绪低落时，我会明显想要亲近的人安慰我。", trait: "E", reverse: false },
  { id: "Q15", title: "和别人互动通常会让我更有精神。", trait: "X", reverse: false },
  { id: "Q16", title: "就算观点不同，我也会尽量把话说得不那么冲。", trait: "A", reverse: false },
  { id: "Q17", title: "我会注意把物品、文件或任务安排得比较有条理。", trait: "C", reverse: false },
  { id: "Q18", title: "我喜欢接触过去没见过的内容、体验或表达方式。", trait: "O", reverse: false },
  { id: "Q19", title: "我有时会很在意别人会不会觉得我比他们更厉害。", trait: "H", reverse: true },
  { id: "Q20", title: "很多事在真正发生前，我并不会太放在心上。", trait: "E", reverse: true },
  { id: "Q21", title: "不是必要，我通常不太愿意主动出头。", trait: "X", reverse: true },
  { id: "Q22", title: "我容易在争执里变得不耐烦甚至顶回去。", trait: "A", reverse: true },
  { id: "Q23", title: "我常会因为粗心漏掉细节。", trait: "C", reverse: true },
  { id: "Q24", title: "比起探索新可能，我更愿意沿用熟悉做法。", trait: "O", reverse: true },
  { id: "Q25", title: "就算没有人盯着，我也倾向于把话说直、把事做正。", trait: "H", reverse: false },
  { id: "Q26", title: "我很容易被感人的故事、离别或脆弱时刻触动。", trait: "E", reverse: false },
  { id: "Q27", title: "在群体里，我往往能把气氛带动起来。", trait: "X", reverse: false },
  { id: "Q28", title: "别人出错时，我通常会先理解原因，而不是马上责备。", trait: "A", reverse: false },
  { id: "Q29", title: "面对重复但必要的任务，我也能坚持做完。", trait: "C", reverse: false },
  { id: "Q30", title: "我会好奇“为什么会这样”“还可以怎样”。", trait: "O", reverse: false },
  { id: "Q31", title: "只要能得到更多好处，我并不介意把好处尽量往自己这边拉。", trait: "H", reverse: true },
  { id: "Q32", title: "遇到压力时，我通常不太需要任何人的情感支持。", trait: "E", reverse: true },
  { id: "Q33", title: "很多热闹场面都会让我想尽快退开。", trait: "X", reverse: true },
  { id: "Q34", title: "一旦我觉得自己吃亏，就很难轻易翻篇。", trait: "A", reverse: true },
  { id: "Q35", title: "我的时间安排经常比较乱。", trait: "C", reverse: true },
  { id: "Q36", title: "我不太喜欢太有创意、太跳脱常规的东西。", trait: "O", reverse: true },
  { id: "Q37", title: "我不太喜欢通过炫耀资源、身份或待遇来证明自己。", trait: "H", reverse: false },
  { id: "Q38", title: "想到身体风险、意外或受伤时，我会更谨慎。", trait: "E", reverse: false },
  { id: "Q39", title: "在不熟的人面前，我通常也有基本的表达自信。", trait: "X", reverse: false },
  { id: "Q40", title: "就算当下不顺，我也会尽量控制语气，不把火气全撒出去。", trait: "A", reverse: false },
  { id: "Q41", title: "做重要决定前，我会先想后果而不是立刻行动。", trait: "C", reverse: false },
  { id: "Q42", title: "我很容易对艺术、画面、音乐或氛围产生兴趣。", trait: "O", reverse: false },
  { id: "Q43", title: "只要没人发现，小小的“占便宜”在我看来也没什么。", trait: "H", reverse: true },
  { id: "Q44", title: "面对离别、关系疏远或他人的脆弱，我往往不太受影响。", trait: "E", reverse: true },
  { id: "Q45", title: "我通常不是那种会主动认识新朋友的人。", trait: "X", reverse: true },
  { id: "Q46", title: "如果别人一直不按我想的来，我容易发脾气。", trait: "A", reverse: true },
  { id: "Q47", title: "我有时会做到一半就分心，最后不了了之。", trait: "C", reverse: true },
  { id: "Q48", title: "我很少主动去理解和接触与自己不同的世界观。", trait: "O", reverse: true },
  { id: "Q49", title: "在功劳归属上，我愿意让结果更贴近事实，而不是全往自己身上揽。", trait: "H", reverse: false },
  { id: "Q50", title: "我对亲密关系里的情感连结通常看得比较重。", trait: "E", reverse: false },
  { id: "Q51", title: "需要表达立场时，我通常敢把观点说清楚。", trait: "X", reverse: false },
  { id: "Q52", title: "冲突之后，只要对方有诚意，我相对愿意和解。", trait: "A", reverse: false },
  { id: "Q53", title: "我会给自己设定完成标准，并尽量把事情做完整。", trait: "C", reverse: false },
  { id: "Q54", title: "我喜欢从不同角度看问题，而不是只接受一种标准答案。", trait: "O", reverse: false },
  { id: "Q55", title: "如果有机会获得更高地位或更多资源，我会很想抢在别人前面。", trait: "H", reverse: true },
  { id: "Q56", title: "我通常不会为了可能发生的坏结果先焦虑起来。", trait: "E", reverse: true },
  { id: "Q57", title: "在聚会、社群或陌生环境里，我往往需要很久才能进入状态。", trait: "X", reverse: true },
  { id: "Q58", title: "当别人冒犯我时，我很难真正放下。", trait: "A", reverse: true },
  { id: "Q59", title: "只要没人催，我就很容易把该做的事往后拖。", trait: "C", reverse: true },
  { id: "Q60", title: "过于新奇、不合常规的想法通常会让我先想拒绝。", trait: "O", reverse: true },
]

export const hexacoRuntime: QuizRuntimeConfig = {
  meta: {
    slug: "hexaco-60",
    title: "HEXACO 六维人格测试",
    summary: "基于 HEXACO 六维人格模型，带你看见关于规则、情绪、关系、执行与探索方式的六维地图。",
    estimatedMinutes: 10,
    tags: ["人格特质", "六维模型", "60 题完整版", "深度解析"],
    category: "人格 / 性格"
  },
  runtime: {
    rendererKey: "generic",
    resultTemplateKey: "hexaco-profile",
    scoringKey: "hexaco"
  },
  presentation: {
    themeKey: "violet-lab",
    storyMode: true,
    screenCount: 6,
    shareCardKey: "hexaco-poster",
  },
  questions: hexacoQuestions.map(q => ({
    ...q,
    type: "single_choice" as const,
    options: [
      { id: `${q.id}_1`, label: "非常不像我", value: { score: 1 } },
      { id: `${q.id}_2`, label: "不太像我", value: { score: 2 } },
      { id: `${q.id}_3`, label: "一般", value: { score: 3 } },
      { id: `${q.id}_4`, label: "比较像我", value: { score: 4 } },
      { id: `${q.id}_5`, label: "非常像我", value: { score: 5 } },
    ]
  })),
  results: hexacoResults,
  extensions: {
    scoring: {
      dimensions: hexacoDimensions,
    },
    share: {
      captionTone: "professional",
    }
  }
}

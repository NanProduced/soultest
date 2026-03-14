import type {
  AccessGrant,
  AdminCodeBatch,
  AdminOverview,
  AdminProduct,
  QuizCatalogItem,
  QuizIntro,
  QuizRuntimeConfig,
} from "./types"

const scaleOptions = (questionId: string) => [
  { id: `${questionId}_1`, label: "非常像左边", value: { score: 1 } },
  { id: `${questionId}_2`, label: "比较像左边", value: { score: 2 } },
  { id: `${questionId}_3`, label: "两边都差不多", value: { score: 3 } },
  { id: `${questionId}_4`, label: "比较像右边", value: { score: 4 } },
  { id: `${questionId}_5`, label: "非常像右边", value: { score: 5 } },
]

const axisPrompts: Record<string, string> = {
  ie: "什么状态更接近你平时的自己？",
  sn: "你通常会把注意力放在哪里？",
  ft: "你更常按什么标准做判断？",
  jp: "你更习惯哪种安排方式？",
}

const oejtsQuestionBank = [
  ["q1", "喜欢列清单", "更多靠记忆", "jp", false],
  ["q2", "偏怀疑，会先打问号", "愿意相信，先看可能性", "ft", true],
  ["q3", "独处久了会无聊", "需要独处才能恢复", "ie", true],
  ["q4", "更容易接受现状", "更常觉得还可以更好", "sn", false],
  ["q5", "会把空间保持整洁", "东西随手一放也没关系", "jp", false],
  ["q6", "被说像机器人会不舒服", "会主动追求理性和机械般清晰", "ft", false],
  ["q7", "精力外放，状态很满", "温和沉稳，更偏安静", "ie", true],
  ["q8", "更喜欢选择题", "更喜欢主观论述题", "sn", false],
  ["q9", "随性混搭也可以", "有条理会更舒服", "jp", true],
  ["q10", "容易被刺到或受伤", "脸皮厚一点，比较扛得住", "ft", false],
  ["q11", "跟团队一起更有状态", "自己一个人做效率更高", "ie", true],
  ["q12", "更多关注眼前当下", "更多想着未来会怎样", "sn", false],
  ["q13", "喜欢提前规划很久", "常常最后一刻才安排", "jp", false],
  ["q14", "更想被尊重", "更想被喜欢、被爱", "ft", true],
  ["q15", "聚会后会有点累", "聚会后反而被点燃", "ie", false],
  ["q16", "更容易融入人群", "更容易显得与众不同", "sn", false],
  ["q17", "喜欢先保留选项", "更愿意尽快做出承诺", "jp", true],
  ["q18", "想成为擅长修理问题的人", "想成为擅长疗愈他人的人", "ft", true],
  ["q19", "通常是说得更多的那个", "通常是听得更多的那个", "ie", true],
  ["q20", "更会描述发生了什么", "更会描述这件事意味着什么", "sn", false],
  ["q21", "事情会尽快做完", "容易拖到最后才动", "jp", false],
  ["q22", "更常跟着内心走", "更常跟着理性走", "ft", false],
  ["q23", "宅在家也很舒服", "更喜欢出门感受城市和人群", "ie", false],
  ["q24", "先想全局画面", "先抓具体细节", "sn", true],
  ["q25", "更习惯即兴发挥", "更习惯提前准备", "jp", true],
  ["q26", "判断对错更看公平原则", "判断对错更看是否体谅人", "ft", true],
  ["q27", "很难自然地大声喊出来", "大声表达对你来说不算难", "ie", false],
  ["q28", "更偏理论和概念", "更偏实证和经验", "sn", true],
  ["q29", "会把力气更多放在工作和推进", "会把力气更多放在玩乐和体验", "jp", false],
  ["q30", "面对情绪会有点别扭", "会把情绪看得很重要", "ft", true],
  ["q31", "喜欢在人前表现自己", "会尽量避开公开表达", "ie", true],
  ["q32", "更想知道谁、什么、何时", "更想知道为什么", "sn", false],
] as const

const oejtsQuestions = oejtsQuestionBank.map(([id, leftLabel, rightLabel, axisKey, reverseScore]) => ({
  id,
  type: "single_choice" as const,
  title: axisPrompts[axisKey],
  leftLabel,
  rightLabel,
  axisKey,
  reverseScore,
  options: scaleOptions(id),
}))

type OejtsTypeKey =
  | "INTJ"
  | "INTP"
  | "ENTJ"
  | "ENTP"
  | "INFJ"
  | "INFP"
  | "ENFJ"
  | "ENFP"
  | "ISTJ"
  | "ISFJ"
  | "ESTJ"
  | "ESFJ"
  | "ISTP"
  | "ISFP"
  | "ESTP"
  | "ESFP"

const profileTitles: Record<OejtsTypeKey, { alias: string; subtitle: string; summary: string; highlights: string[] }> = {
  INTJ: {
    alias: "战略构筑者",
    subtitle: "你习惯先看结构，再决定如何行动。",
    summary:
      "你会先把事情看成一个系统，再决定自己要不要投入、怎样投入。比起即时热闹，你更在意长期是否成立、逻辑是否闭环、方向是否值得走。",
    highlights: ["喜欢先搭框架", "对长期走向很敏感", "不容易被表面带跑"],
  },
  INTP: {
    alias: "概念解码者",
    subtitle: "你更想先想明白，再决定是否出手。",
    summary:
      "你容易被复杂概念、逻辑矛盾和隐藏机制吸引。你更享受思考本身，也倾向保留判断，直到自己确认它真的说得通。",
    highlights: ["逻辑敏感", "喜欢拆解概念", "不轻易跟风表态"],
  },
  ENTJ: {
    alias: "统筹推进者",
    subtitle: "你习惯把目标拉到前面，然后推动全局。",
    summary:
      "你对效率、结果和节奏都很敏感，看到混乱时常会自然开始收束资源、分配动作、推动落地。你不太喜欢空转，更在意事情最终有没有成。",
    highlights: ["目标感强", "敢定方向", "推进节奏明确"],
  },
  ENTP: {
    alias: "可能性发动机",
    subtitle: "你会本能地看到另一种解法。",
    summary:
      "你擅长从不同角度重组问题，喜欢试探边界、提出新想法、挑战既有路径。你很少被单一路径困住，很多时候灵感会先于结论出现。",
    highlights: ["点子密度高", "善于换角度", "擅长打开局面"],
  },
  INFJ: {
    alias: "深层洞察者",
    subtitle: "你会先感受底层动机，再决定怎么靠近。",
    summary:
      "你通常不只看表面互动，而会去感知一个人、一段关系或一个环境背后的意味。你既在意真实，也希望自己做的事能对别人产生更深的价值。",
    highlights: ["洞察细腻", "重视意义感", "对关系温度敏锐"],
  },
  INFP: {
    alias: "理想叙事者",
    subtitle: "你很重视内心认同，而不是外部标准。",
    summary:
      "你会把真实感放在很前面，不愿被粗暴归类，也不喜欢为了适应而放弃内在价值。你做判断时常会先问自己：这是不是我真正认可的。",
    highlights: ["内在标准稳定", "价值感明确", "情绪与意义连接强"],
  },
  ENFJ: {
    alias: "共鸣组织者",
    subtitle: "你擅长把人和方向同时带起来。",
    summary:
      "你既能感知关系氛围，也能推动群体往同一个方向走。你常常知道别人需要怎样被理解，也知道怎样把分散的人重新组织成一个整体。",
    highlights: ["有带动感", "善于组织关系", "表达有感染力"],
  },
  ENFP: {
    alias: "热忱点燃者",
    subtitle: "你会被人、创意和新的可能性点亮。",
    summary:
      "你对新鲜感、关系流动和未来可能性都非常敏感。你容易被真正打动，也擅长把热情带给别人，让一个场域快速变得有生命力。",
    highlights: ["感染力强", "创意跳跃快", "对人与可能性敏感"],
  },
  ISTJ: {
    alias: "秩序执行者",
    subtitle: "你更相信稳定、清晰和可验证。",
    summary:
      "你做事偏向稳、准、可交付。你重视规则和责任，也愿意把事情按标准做扎实。很多时候，你不是最吵的人，但会是那个让事情真正站住的人。",
    highlights: ["可靠稳定", "执行质量高", "标准感明确"],
  },
  ISFJ: {
    alias: "温和守护者",
    subtitle: "你会在细节里照顾人，也照顾秩序。",
    summary:
      "你既在意现实细节，也在意关系是否妥帖。你往往不是靠高调表达存在，而是靠持续、细腻、负责任的投入让别人感到安心。",
    highlights: ["照顾细节", "稳定体贴", "让人有安全感"],
  },
  ESTJ: {
    alias: "秩序掌舵者",
    subtitle: "你习惯把规则和进度拉回正轨。",
    summary:
      "你对目标、责任和执行要求都比较清楚，看到失序时会本能地去纠偏。你擅长明确边界、安排动作、推动结果，对低效率和含糊其词耐心不高。",
    highlights: ["执行果断", "结构清晰", "对结果负责"],
  },
  ESFJ: {
    alias: "关系维系者",
    subtitle: "你会主动让一个场域变得更妥帖。",
    summary:
      "你会自然关注关系中的回应、礼貌和参与感，也常常愿意主动做那个组织、照顾、串联的人。你看重氛围，也希望自己的付出能被看见。",
    highlights: ["擅长联结", "会照顾氛围", "重视参与感"],
  },
  ISTP: {
    alias: "冷静解法者",
    subtitle: "你更相信先看清，再出手。",
    summary:
      "你面对问题时通常比多数人更冷静，容易进入观察、拆解、试错模式。你不喜欢无效噪音，更愿意让结果说话。",
    highlights: ["临场冷静", "拆解能力强", "不容易慌乱"],
  },
  ISFP: {
    alias: "感受创作者",
    subtitle: "你对氛围、美感和真实感特别敏锐。",
    summary:
      "你重视感受质量，也在意表达是否真实、是否有美感。你未必高调，但通常有稳定的内在偏好和审美判断，不喜欢被粗暴推进。",
    highlights: ["审美敏锐", "感受细腻", "重视真实表达"],
  },
  ESTP: {
    alias: "现场推进者",
    subtitle: "你在真实场景里反而最有判断力。",
    summary:
      "你反应快、行动力足，对现场信息抓得很准。与其纸上谈兵，你更愿意边做边看、边试边修，很多时候你是把局面重新带动起来的人。",
    highlights: ["行动快", "现场感强", "适应变化能力强"],
  },
  ESFP: {
    alias: "热场体验家",
    subtitle: "你天生知道怎样让当下变得有温度。",
    summary:
      "你对人和现场都很敏感，容易把热情、轻松和存在感带进场域。你很看重体验本身，也愿意让身边的人一起感到开心、被接住、被感染。",
    highlights: ["感染力强", "很有现场感", "容易拉近人与人的距离"],
  },
}

const letterStrengths: Record<string, string> = {
  I: "更容易在独处或低噪音环境里形成自己的判断，不急着向外部寻求确认。",
  E: "会从互动和反馈中快速获得能量，行动前后都更容易借助外部场域推进自己。",
  S: "对事实、细节和可验证信息更敏感，做判断时更重视现实依据。",
  N: "更容易从信息里看到趋势、隐含关系和未来可能性，不只停留在表面。",
  F: "做决定时会把人的感受、关系后果和价值认同放进权衡。",
  T: "面对问题时更倾向先追求逻辑一致、原则清楚和判断稳定。",
  J: "更习惯先定边界和节奏，明确之后会更有安全感和掌控感。",
  P: "更愿意保留空间，根据现场变化调整路线，不喜欢太早被定死。",
}

const letterRisks: Record<string, string> = {
  I: "如果长期把想法留在心里，别人可能看不到你的关心，只会感到距离。",
  E: "当外部刺激太多时，可能因为回应过快而压缩了留给自己思考的空间。",
  S: "过于依赖已知经验时，可能会低估新路径或抽象想法的价值。",
  N: "如果一直停留在想法层面，容易高估可能性、低估落实成本。",
  F: "太顾及关系时，可能会延后那些其实应该更清晰表达的边界。",
  T: "过度强调正确和效率时，容易忽略对方真正需要被听见的部分。",
  J: "当计划被反复打断时，容易迅速失去耐心，甚至对人产生控制感。",
  P: "如果一直保留选项，可能会把应该收口的决定拖到更晚。",
}

const letterRelationship: Record<string, string> = {
  I: "关系里你通常需要足够空间，靠稳定与深度建立信任，而不是高频黏连。",
  E: "关系里你更容易通过互动确认连接感，回应、参与和共同体验会很重要。",
  F: "你对情绪氛围很敏感，通常会在意彼此是否被理解、被照顾、被认真对待。",
  T: "你更看重沟通是否有效、关系是否讲得清楚，不喜欢长期陷在模糊拉扯里。",
}

const letterWork: Record<string, string> = {
  S: "在工作里你会更信任事实、流程和现成依据，适合把抽象目标落到执行细节。",
  N: "在工作里你更容易看到趋势、模式与新方案，适合处理策略、创意和方向判断。",
  J: "你适合承担推进、排期、收口和交付相关职责，明确目标后执行力通常很稳。",
  P: "你更适合允许试错和机动调整的环境，在变化中反而容易找到空间与手感。",
}

const letterStress: Record<string, string> = {
  F: "压力升高时，你可能会先感受到关系张力或内在失衡，再慢慢恢复行动。",
  T: "压力升高时，你会更想用分析和切分问题来维持秩序，但也可能显得更硬。",
  J: "当局面失控、进度拖延或标准混乱时，这条维度最容易先被触发。",
  P: "当自由度被压缩、每一步都被严密限制时，这条维度最容易先感到窒息。",
}

const letterGrowth: Record<string, string> = {
  I: "尝试把结论前的一部分思路说出来，别人会更容易跟上你，而不是只看到沉默。",
  E: "在关键判断前多留一点独立整理时间，会让你的外放优势更稳定。",
  S: "保留对新方法的试用窗口，能让你的现实感与适应力一起升级。",
  N: "给灵感配上更具体的行动落点，会让你的想法更容易真正产生影响。",
  F: "在照顾别人之前先照顾自己的边界，反而更能让你的善意被长期看见。",
  T: "把“你是怎么想的”放进对话里，通常能让你的判断被更顺畅地接住。",
  J: "给计划预留弹性，而不是把弹性视为失控，会让你更轻松也更可持续。",
  P: "为重要决定设置一个真正的收口时点，可以保留自由，也避免长期漂浮。",
}

function buildOejtsResult(key: OejtsTypeKey) {
  const profile = profileTitles[key]
  const [first, second, third, fourth] = key.split("")

  return {
    key,
    title: `${key} · ${profile.alias}`,
    subtitle: profile.subtitle,
    summary: profile.summary,
    highlights: profile.highlights,
    strengths: [
      letterStrengths[first],
      letterStrengths[second],
      letterStrengths[third],
    ],
    blindSpots: [
      letterRisks[first],
      letterRisks[third],
      letterRisks[fourth],
    ],
    relationshipNotes: [letterRelationship[first], letterRelationship[third]],
    workNotes: [letterWork[second], letterWork[fourth]],
    stressNotes: [letterStress[third], letterStress[fourth]],
    growthNotes: [letterGrowth[first], letterGrowth[second], letterGrowth[fourth]],
    shareCopy: `测完是 ${key}，有点准：${profile.highlights[0]}、${profile.highlights[1]}。`,
  }
}

const oejtsResults = Object.keys(profileTitles).map((key) => buildOejtsResult(key as OejtsTypeKey)) satisfies QuizRuntimeConfig["results"]

const catalogItems: QuizCatalogItem[] = [
  {
    id: "quiz_oejts_personality_map",
    slug: "oejts-personality-map",
    title: "16 型人格图谱",
    category: "人格 / 性格",
    summary: "你是冷静的分析者，还是热情的行动派？32 道题，解锁你的人格密码。",
    tagline: "MVP 首发版本，结果页支持回看与分享。",
    priceLabel: "32 题完整版",
    durationMinutes: 8,
    questionCount: 32,
    accessSummary: "输入口令后开始测试，有效期内可重复进入",
    tags: ["16 型人格", "32 题", "四维度画像"],
    valuePoints: ["16 型结果", "四条维度倾向", "关系 / 工作 / 压力提示"],
    flowSteps: ["输入口令", "完成 32 题", "查看完整结果"],
  },
]

const introSections: Record<string, QuizIntro["detailSections"]> = {
  "oejts-personality-map": [
    {
      title: "这套题适合谁",
      description: "适合想快速了解自己在四条人格维度上更偏向哪一侧，以及这些偏好如何影响关系、沟通与做事方式的人。",
    },
    {
      title: "你会得到什么",
      description: "结果页会展示你的 16 型结果、四条维度位置，以及围绕关系、工作和压力情境的补充解读。",
    },
    {
      title: "答题方式",
      description: "每题都在两种倾向之间做 5 级选择，按第一反应作答即可，不需要刻意追求“最好”的答案。",
    },
  ],
}

const runtimeConfigs: Record<string, QuizRuntimeConfig> = {
  "oejts-personality-map": {
    meta: {
      slug: "oejts-personality-map",
      title: "16 型人格图谱",
      summary: "你是冷静的分析者，还是热情的行动派？32 道题，解锁你的人格密码。",
      estimatedMinutes: 8,
      tags: ["32 题完整版", "16 型人格", "适合保存结果卡片"],
      category: "人格 / 性格",
    },
    runtime: {
      rendererKey: "generic",
      resultTemplateKey: "oejts-profile",
      scoringKey: "oejts",
    },
    presentation: {
      themeKey: "ink-glow",
      storyMode: true,
      screenCount: 5,
      shareCardKey: "oejts-type-poster",
    },
    questions: oejtsQuestions,
    results: oejtsResults,
    extensions: {
      scoring: {
        dimensions: [
          { key: "ie", label: "I 内向 ←→ E 外向" },
          { key: "sn", label: "S 实感 ←→ N 直觉" },
          { key: "ft", label: "F 情感 ←→ T 思考" },
          { key: "jp", label: "J 判断 ←→ P 感知" },
        ],
      },
      share: {
        captionTone: "insightful",
      },
    },
  },
}

const mockProducts: AdminProduct[] = [
  {
    id: "product_oejts_shared",
    name: "OEJTS 16 型人格图谱",
    productType: "single_product",
    status: "active",
    quizCount: 1,
    description: "MVP 阶段先使用单题集通用口令，后续可平滑切换为一单一码。",
  },
]

const mockCodeBatches: AdminCodeBatch[] = [
  {
    id: "batch_oejts_shared",
    name: "OEJTS 主售卖批次",
    productId: "product_oejts_shared",
    productName: "OEJTS 16 型人格图谱",
    strategyType: "single_product",
    status: "active",
    codeCount: 2,
    expiresAt: "2026-12-31T23:59:59.000Z",
  },
]

const mockAccessGrants: Record<string, AccessGrant> = {
  "SOUL-OEJTS-0313": {
    code: "SOUL-OEJTS-0313",
    product: {
      id: "product_oejts_shared",
      name: "OEJTS 16 型人格图谱",
      productType: "single_product",
    },
    allowedQuizzes: [{ slug: "oejts-personality-map", title: "OEJTS 16 型人格图谱" }],
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "MVP 通用口令模式，有效期内可重复进入。",
    },
  },
  "ST-DEMO-ALPHA": {
    code: "ST-DEMO-ALPHA",
    product: {
      id: "product_oejts_shared",
      name: "OEJTS 16 型人格图谱",
      productType: "single_product",
    },
    allowedQuizzes: [{ slug: "oejts-personality-map", title: "OEJTS 16 型人格图谱" }],
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "本地联调演示口令。",
    },
  },
}

const mockAdminOverview: AdminOverview = {
  quizzes: catalogItems.length,
  products: mockProducts.length,
  codeBatches: mockCodeBatches.length,
  activeCodes: Object.keys(mockAccessGrants).length,
  submissions: 0,
  lastSeedAt: "2026-03-14T00:00:00.000Z",
}

export function getMockCatalogItems() {
  return catalogItems
}

export function getMockQuizIntro(slug: string): QuizIntro | undefined {
  const item = catalogItems.find((entry) => entry.slug === slug)

  if (!item) {
    return undefined
  }

  return {
    ...item,
    detailSections: introSections[slug] ?? [],
  }
}

export function getMockRuntimeConfig(slug: string) {
  return runtimeConfigs[slug]
}

export function getMockAccessGrant(code: string) {
  return mockAccessGrants[code.trim().toUpperCase()]
}

export function getMockAdminOverview() {
  return mockAdminOverview
}

export function getMockProducts() {
  return mockProducts
}

export function getMockCodeBatches() {
  return mockCodeBatches
}

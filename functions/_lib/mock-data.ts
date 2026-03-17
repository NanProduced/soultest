import type {
  AccessGrant,
  AdminCodeBatch,
  AdminOverview,
  AdminProduct,
  QuizCatalogItem,
  QuizIntro,
  QuizRuntimeConfig,
} from "./types"
import { oejtsQuestionContent } from "./oejts-question-content"
import { OEJTS_RESULT_ORDER, oejtsResultContent } from "./oejts-result-content"
import {
  RELATIONSHIP_PREFERENCE_DIMENSIONS,
  RELATIONSHIP_PREFERENCE_PAIR_NARRATIVES,
  RELATIONSHIP_PREFERENCE_RESULT_ORDER,
  relationshipPreferenceQuestionContent,
  relationshipPreferenceResultContent,
} from "./relationship-preference-content"
import { sd3Runtime } from "./sd3-content"
import { bigFiveRuntime } from "./bigfive-content"
import { hexacoRuntime } from "./hexaco-content"
import { riasecRuntime } from "./riasec-content"
import { enneagramRuntime } from "./enneagram-content"
import { tarotRuntime } from "./tarot-content"
import { stressLoadRuntime } from "./stress-load-content"
import { desireCompositionRuntime } from "./desire-composition-content"

const scaleOptions = (questionId: string) => [
  { id: `${questionId}_1`, label: "明显更接近左边", value: { score: 1 } },
  { id: `${questionId}_2`, label: "略偏左边", value: { score: 2 } },
  { id: `${questionId}_3`, label: "两边差不多", value: { score: 3 } },
  { id: `${questionId}_4`, label: "略偏右边", value: { score: 4 } },
  { id: `${questionId}_5`, label: "明显更接近右边", value: { score: 5 } },
]

const oejtsQuestions = oejtsQuestionContent.map((question) => ({
  ...question,
  type: "single_choice" as const,
  options: scaleOptions(question.id),
}))

const oejtsResults = OEJTS_RESULT_ORDER.map((key) => ({
  key,
  ...oejtsResultContent[key],
})) satisfies QuizRuntimeConfig["results"]

const relationshipPreferenceQuestions = relationshipPreferenceQuestionContent.map((question) => ({
  id: question.id,
  type: "single_choice" as const,
  title: question.title,
  description: "不是选“喜不喜欢”，而是选“哪一种更能打动你”。",
  options: [
    {
      id: `${question.id}_a`,
      label: question.optionA,
      value: { [question.dimensionA]: 1 },
    },
    {
      id: `${question.id}_b`,
      label: question.optionB,
      value: { [question.dimensionB]: 1 },
    },
  ],
}))

const relationshipPreferenceResults = RELATIONSHIP_PREFERENCE_RESULT_ORDER.map((key) => ({
  key,
  ...relationshipPreferenceResultContent[key],
})) satisfies QuizRuntimeConfig["results"]

const catalogItems: QuizCatalogItem[] = [
  {
    id: "quiz_oejts_personality_map",
    slug: "oejts-personality-map",
    title: "OEJTS 16 型人格图谱",
    category: "人格 / 性格",
    summary:
      "OEJTS 16 型人格图谱是一套基于四条人格偏好维度的自我探索测试，帮你看见自己的注意力方向、判断方式与行动节奏。",
    tagline: "OEJTS 首发版本，结果页支持回看、保存与分享。",
    priceLabel: "32 题完整版",
    durationMinutes: 8,
    questionCount: 32,
    accessSummary: "输入口令后开始测试，有效期内可重复进入",
    tags: ["OEJTS", "16 型人格", "32 题", "四维度画像"],
    valuePoints: ["16 型结果", "四条维度倾向", "关系 / 工作 / 压力提示"],
    flowSteps: ["输入口令", "完成 32 题", "查看完整结果"],
    accessType: "paid",
  },
  {
    id: "quiz_relationship_preference_test",
    slug: "relationship-preference-test",
    title: "亲密关系偏好测试",
    category: "关系 / 亲密关系",
    summary:
      "这是一套基于五种爱情语言模型改编的关系偏好测试，帮助你看见在亲密关系里最有感觉的被爱方式、次要通道与容易错位的表达差异。",
    tagline: "30 题正式版，支持结果回看、分享与一键导出关系海报。",
    priceLabel: "30 题正式版",
    durationMinutes: 6,
    questionCount: 30,
    accessSummary: "输入购买后获得的验证码开始测试，有效期内可重复进入",
    tags: ["关系偏好", "五维分布", "30 题", "可导出海报"],
    valuePoints: ["主语言 / 次语言判断", "五维分布与失落触发点", "伴侣行动建议 + 可导出海报"],
    flowSteps: ["输入验证码", "完成 30 题二选一", "查看完整结果"],
    accessType: "paid",
  },
  {
    id: "quiz_enneagram_54",
    slug: "enneagram",
    title: "九型人格测试",
    category: "人格 / 驱动力",
    summary:
      "一套更偏向“核心驱动力”视角的九型人格测试。54 道原创中文题，帮你看见自己更接近哪一种内在动机模式，以及关系、工作和压力下的自然反应。",
    tagline: "54 题正式版，结果支持保存驱动力长图与社媒分享。",
    priceLabel: "54 题正式版",
    durationMinutes: 9,
    questionCount: 54,
    accessSummary: "输入购买后获得的验证码开始测试，有效期内可重复进入",
    tags: ["九型人格", "54 题", "核心驱动力", "可导出长图"],
    valuePoints: ["主型 + 近邻类型判断", "关系 / 工作 / 压力方向解析", "支持保存与分享"],
    flowSteps: ["输入验证码", "完成 54 题符合度作答", "查看完整结果"],
    accessType: "paid",
  },
  {
    id: "quiz_bigfive_personality",
    slug: "bigfive",
    title: "大五人格测试",
    category: "人格 / 性格",
    summary:
      "基于国际通用 Big Five 模型的大五人格测试，帮助你看到自己在外向性、宜人性、尽责性、神经质与开放性五个维度上的稳定偏好。",
    tagline: "50 题正式版，支持保存人格画像与分享结果长图。",
    priceLabel: "50 题正式版",
    durationMinutes: 8,
    questionCount: 50,
    accessSummary: "输入购买后获得的验证码开始测试，有效期内可重复进入",
    tags: ["大五人格", "50 题", "五维人格", "正式版"],
    valuePoints: ["五维人格画像", "关系 / 工作 / 压力解读", "支持保存与分享"],
    flowSteps: ["输入验证码", "完成 50 题", "查看完整结果"],
    accessType: "paid",
  },
  {
    id: "quiz_dark_triad",
    slug: "dark-triad",
    title: "暗面力量测试",
    category: "专业量表",
    summary:
      "每个人都有不愿意承认的那一面。基于经典的暗黑三角模型，这套测试将帮你看见隐藏在人格深处的策略操盘、聚光主场与冷感冒险倾向。",
    tagline: "27 题专业版，探索你的暗面人格与生存策略。",
    priceLabel: "27 题正式版",
    durationMinutes: 5,
    questionCount: 27,
    accessSummary: "输入购买后获得的验证码开始测试，有效期内可重复进入",
    tags: ["暗面人格", "生存策略", "27 题", "深度解析"],
    valuePoints: ["三维人格分布图", "9 大暗面原型定位", "人际与竞争策略拆解"],
    flowSteps: ["输入验证码", "完成 27 题自评", "解锁深度报告"],
    accessType: "paid",
  },
  {
    id: "quiz_hexaco_personality",
    slug: "hexaco-60",
    title: "HEXACO 六维人格测试",
    category: "人格 / 性格",
    summary:
      "基于 HEXACO 六维人格模型，通过 60 道题目深度还原你在规则、情绪、社交、冲突、执行与开放性六个维度上的稳定偏好。比大五人格多一维，看见更真实的自己。",
    tagline: "60 题专业版，支持结果回看、分享与一键导出六维雷达图海报。",
    priceLabel: "60 题正式版",
    durationMinutes: 10,
    questionCount: 60,
    accessSummary: "输入购买后获得的验证码开始测试，有效期内可重复进入",
    tags: ["HEXACO", "六维人格", "60 题", "深度解析"],
    valuePoints: ["六维人格图谱", "H 维度特色解读", "关系 / 协作 / 压力全景报告"],
    flowSteps: ["输入验证码", "完成 60 题", "查看完整结果"],
    accessType: "paid",
  },
  {
    id: "quiz_riasec_48",
    slug: "riasec-48",
    title: "霍兰德 RIASEC 职业兴趣测试",
    category: "职业 / 发展",
    summary: "基于经典 Holland RIASEC 模型，通过 48 道精选题目，精准还原你在六个核心维度上的兴趣偏好，帮你找到更契合的工作环境与职业方向。",
    tagline: "48 题正式版，包含 12 组深度三码报告与六维图谱。",
    priceLabel: "48 题正式版",
    durationMinutes: 8,
    questionCount: 48,
    accessSummary: "输入购买后获得的验证码开始测试，有效期内可重复进入",
    tags: ["职业兴趣", "RIASEC", "48 题", "深度解析"],
    valuePoints: ["六维兴趣图谱", "前三码深度报告", "适合的任务与环境建议"],
    flowSteps: ["输入验证码", "完成 48 题", "查看完整结果"],
    accessType: "paid",
  },
  {
    id: "quiz_soul_tarot",
    slug: "soul-tarot",
    title: "你是哪张塔罗牌？",
    category: "神秘学 / 心理",
    summary: "22 张大阿尔卡纳，22 种灵魂原型——你的灵魂，对应哪一张牌？基于 5 维向量匹配算法，寻找你的灵魂归宿。",
    tagline: "30 题正式版，支持一键导出精美塔罗灵魂海报。",
    priceLabel: "30 题正式版",
    durationMinutes: 10,
    questionCount: 30,
    accessSummary: "输入购买后获得的验证码开始测试，有效期内可重复进入",
    tags: ["塔罗占卜", "灵魂原型", "30 题", "小红书爆款"],
    valuePoints: ["灵魂塔罗匹配", "五维灵魂向量", "灵魂判词与生活建议"],
    flowSteps: ["输入验证码", "完成 30 题", "揭开灵魂牌面"],
    accessType: "paid",
  },
  {
    id: "quiz_stress_load_test",
    slug: "stress-load-test",
    title: "压力负荷测试",
    category: "心理状态 / 压力",
    summary: "测测最近 30 天，你的心理系统到底承受了多少重量",
    tagline: "25 题专业版，深度解读你的心理负荷与恢复系统。",
    priceLabel: "25 题正式版",
    durationMinutes: 5,
    questionCount: 25,
    accessSummary: "输入购买后获得的验证码开始测试，有效期内可重复进入",
    tags: ["压力负荷", "25 题", "心理状态", "深度报告"],
    valuePoints: ["五维压力负荷图谱", "主导压力来源画像", "72 小时减压行动卡"],
    flowSteps: ["输入验证码", "完成 25 题自评", "解锁深度报告"],
    accessType: "paid",
  },
  {
    id: "quiz_desire_composition",
    slug: "desire-composition",
    title: "你的欲望组成图",
    category: "性格探索 / 欲望",
    summary: "每个人心中都藏着一份欲望配方，测测你的灵魂最渴望什么",
    tagline: "12 题正式版，生成你的专属欲望饼图与欲望人格标签。",
    priceLabel: "12 题正式版",
    durationMinutes: 2,
    questionCount: 12,
    accessSummary: "输入购买后获得的验证码开始测试，有效期内可重复进入",
    tags: ["欲望组成", "12 题", "饼图", "人格标签"],
    valuePoints: ["七维欲望饼图", "欲望人格标签", "全国对比数据", "精美长图导出"],
    flowSteps: ["输入验证码", "完成 12 题情景选择", "生成欲望组成图"],
    accessType: "paid",
  },
]

const introSections: Record<string, QuizIntro["detailSections"]> = {
  "oejts-personality-map": [
    {
      title: "OEJTS 是什么",
      description:
        "OEJTS 16 型人格图谱是一套基于 I/E、S/N、F/T、J/P 四条人格偏好维度的自我探索测试。它关注你更自然的注意力方向、判断方式与行动节奏，而不是给你贴上固定不变的标签。",
    },
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
  "relationship-preference-test": [
    {
      title: "亲密关系偏好测试是什么",
      description:
        "亲密关系偏好测试以“五种爱情语言”模型为参考，围绕肯定的言辞、精心的时刻、接受礼物、服务的行动、身体的接触五种关系表达维度，观察一个人在亲密关系中最容易感到被爱、被理解与被放在心上的通道。它更适合帮助你解释“为什么明明对方有表达，但自己仍觉得不够”的关系错位，也适合给伴侣提供更具体、可执行的表达建议。",
    },
  ],
  "enneagram": [
    {
      title: "九型人格更适合解释什么",
      description:
        "和只看外显行为的人格模型不同，九型人格更适合解释你在关系、工作与压力里，为什么会反复被某些需求、恐惧和模式牵引。它关注的不是“你像谁”，而是“你在靠什么驱动自己”。",
    },
    {
      title: "这套测试和 OEJTS 的差异",
      description:
        "OEJTS 更像是认知与行动偏好的结构图谱，九型人格更像是核心驱动力地图。前者回答“你怎么感知、判断和行动”，后者回答“你为什么会那样在意、那样防御、那样追求”。",
    },
    {
      title: "你会拿到什么结果",
      description:
        "结果页会展示主型、近邻类型、翼倾向、九型分布、关系与工作场景解读，以及压力方向与成长方向。长图会单独优化成更适合小红书分享的版本。",
    },
  ],
  "bigfive": [
    {
      title: "大五人格测试是什么",
      description:
        "大五人格（Big Five）是国际心理学界最常用的人格评估模型之一，通过外向性、宜人性、尽责性、神经质与开放性五个维度来呈现一个人的稳定偏好。它不是单一标签，而是一张五维画像。",
    },
    {
      title: "你会得到什么",
      description:
        "结果页会展示五个维度的相对分布，并结合关系、工作和压力场景，帮助你更具体地理解自己的行为节奏与互动方式。",
    },
  ],
  "dark-triad": [
    {
      title: "暗面力量测试是什么",
      description:
        "暗面力量测试基于经典暗黑三角模型，从策略操盘、聚光主场与冷感冒险三个方向，帮助你观察自己在高压竞争和复杂人际中的隐性力量。",
    },
  ],
  "hexaco-60": [
    {
      title: "HEXACO 是什么",
      description:
        "HEXACO 是在五大性格模型基础上，通过大规模跨文化研究发现的第六个维度——诚实-谦逊（Honesty-Humility）。它是目前心理学界公认的最全面、最严谨的人格模型之一。",
    },
    {
      title: "为什么要测 HEXACO",
      description:
        "相比传统测试，HEXACO 增加的 H 维度能更精准地捕捉一个人对公平、真诚和利益的态度。同时，它对情绪性（E）和宜人性（A）的定义也更加细致，能为你提供更具辨识度的自我画像。",
    },
    {
      title: "你会得到什么",
      description:
        "一份包含六维雷达图、六个维度的详细分档解读，以及针对关系、合作、压力场景的个性化建议长报告。支持一键导出精美分享海报。",
    },
  ],
  "riasec-48": [
    {
      title: "RIASEC 测试是什么",
      description: "RIASEC 职业兴趣测试（Holland RIASEC）是职业规划领域最经典的评估模型，通过现实型(R)、研究型(I)、艺术型(A)、社会型(S)、企业型(E)和常规型(C)六个维度，帮你理解自己更愿意靠近什么样的任务与环境。",
    },
    {
      title: "为什么要测职业兴趣",
      description: "兴趣不是能力，但它决定了你愿意在什么方向上持续投入。找到高兴趣匹配的任务，能显著降低职业倦怠感，提高工作满意度。",
    },
    {
      title: "你会得到什么",
      description: "结果页包含你的六维兴趣图谱、前三码深度报告、适合的任务片段、团队位置建议以及误配环境提醒。支持导出长图分享。",
    },
  ],
  "soul-tarot": [
    {
      title: "你是哪张塔罗牌",
      description: "塔罗牌的 22 张大阿尔卡纳代表了 22 种灵魂原型。这套测试从塔罗的四元素体系（火/水/风/土）出发，加上塔罗特有的「光影」维度，构建出一个 5 维人格模型。",
    },
    {
      title: "核心算法：余弦相似度",
      description: "不使用传统「总分 → 区间」的方式，而是将你和塔罗牌都视为 5 维向量，计算它们之间的余弦相似度。这种方法能精准匹配你灵魂与 22 张牌的「气质距离」。",
    },
    {
      title: "你会得到什么",
      description: "一张属于你的灵魂塔罗牌，以及 Top 2-4 的灵魂回响牌。包含灵魂判词、性格关键词、五维雷达图、生活场景表现以及充电仪式建议。",
    },
  ],
  "stress-load-test": [
    {
      title: "压力负荷测试是什么",
      description: "这是一套基于经典压力量表思路改编的非诊断式心理状态测试，通过任务超载、掌控流失、预警常开、恢复断电和情绪磨损五个维度，深度还原你最近 30 天的心理状态。",
    },
    {
      title: "你会得到什么",
      description: "一份包含总负荷等级、主导压力来源画像、五维压力图谱、风险信号预警以及 72 小时减压行动建议的深度报告。支持导出精美分享长图。",
    },
  ],
  "desire-composition": [
    {
      title: "你的欲望组成图是什么",
      description: "这是一套基于七维欲望模型的性格探索测试，通过 12 道情景选择题，精准还原你在财富、权力、爱情、美貌、美食、求知、安逸七个维度上的欲望配比。",
    },
    {
      title: "为什么要测欲望组成",
      description: "欲望不是负面词，它是驱动我们行动的底层燃料。了解自己的欲望组成，能帮助你更好地理解自己的选择偏好、行为模式，以及在人生重大决策中的倾向。",
    },
    {
      title: "你会得到什么",
      description: "一份包含七维欲望饼图、欲望人格标签（6 种主人格）、与全国平均数据的对比分析，以及灵魂名人匹配的深度报告。支持一键导出精美长图分享到小红书。",
    },
  ],
}

const runtimeConfigs: Record<string, QuizRuntimeConfig> = {
  "oejts-personality-map": {
    meta: {
      slug: "oejts-personality-map",
      title: "OEJTS 16 型人格图谱",
      summary:
        "OEJTS 16 型人格图谱是一套基于四条人格偏好维度的自我探索测试，帮你看见自己的注意力方向、判断方式与行动节奏。",
      estimatedMinutes: 8,
      tags: ["OEJTS", "32 题完整版", "16 型人格", "适合保存结果卡片"],
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
  "relationship-preference-test": {
    meta: {
      slug: "relationship-preference-test",
      title: "亲密关系偏好测试",
      summary:
        "这是一套基于五种爱情语言模型改编的关系偏好测试，帮助你看见在亲密关系里最有感觉的被爱方式、次要通道与容易错位的表达差异。",
      estimatedMinutes: 6,
      tags: ["关系偏好", "30 题正式版", "五维分布", "适合保存结果海报"],
      category: "关系 / 亲密关系",
    },
    runtime: {
      rendererKey: "generic",
      resultTemplateKey: "relationship-story",
      scoringKey: "radar",
    },
    presentation: {
      themeKey: "rose-map",
      storyMode: true,
      screenCount: 4,
      shareCardKey: "relationship-preference-poster",
    },
    questions: relationshipPreferenceQuestions,
    results: relationshipPreferenceResults,
    extensions: {
      scoring: {
        dimensions: RELATIONSHIP_PREFERENCE_DIMENSIONS.map((item) => ({
          key: item.key,
          label: item.label,
        })),
      },
      share: {
        captionTone: "warm",
      },
      intro: {
        tagline: "30 题正式版，结果页支持回看、分享与一键导出关系海报。",
        priceLabel: "30 题正式版",
        accessSummary: "输入购买后获得的验证码开始测试，有效期内可重复进入",
        valuePoints: ["主语言 / 次语言判断", "五维分布与失落触发点", "伴侣行动建议 + 可导出海报"],
        flowSteps: ["输入验证码", "完成 30 题二选一", "查看完整结果"],
        detailSections: introSections["relationship-preference-test"],
      },
      relationshipPreference: {
        dimensionOrder: RELATIONSHIP_PREFERENCE_DIMENSIONS.map((item) => item.key),
        maxScorePerDimension: 12,
        dualPrimaryDelta: 1,
        balancedSpreadDelta: 2,
        pairNarratives: RELATIONSHIP_PREFERENCE_PAIR_NARRATIVES,
      },
    },
  },
  "enneagram": enneagramRuntime,
  "bigfive": bigFiveRuntime,
  "dark-triad": sd3Runtime,
  "hexaco-60": hexacoRuntime,
  "riasec-48": riasecRuntime,
  "soul-tarot": tarotRuntime,
  "stress-load-test": stressLoadRuntime,
  "desire-composition": desireCompositionRuntime,
}

const mockProducts: AdminProduct[] = [
  {
    id: "product_oejts_shared",
    name: "OEJTS 16 型人格图谱",
    productType: "single_product",
    status: "active",
    quizCount: 1,
    description: "MVP 阶段先使用单题集通用口令，后续可平滑切换为一单一码。",
    linkedQuizzes: [{ slug: "oejts-personality-map", title: "OEJTS 16 型人格图谱" }],
  },
  {
    id: "product_relationship_preference_shared",
    name: "亲密关系偏好测试",
    productType: "single_product",
    status: "active",
    quizCount: 1,
    description: "正式版第二套题，先使用一套题一个随机验证码的稳定交付方案。",
    linkedQuizzes: [{ slug: "relationship-preference-test", title: "亲密关系偏好测试" }],
  },
  {
    id: "product_enneagram_shared",
    name: "九型人格测试",
    productType: "single_product",
    status: "active",
    quizCount: 1,
    description: "九型人格正式版，结果长图针对小红书分享场景单独优化。",
    linkedQuizzes: [{ slug: "enneagram", title: "九型人格测试" }],
  },
  {
    id: "product_personality_bundle_shared",
    name: "人格深测双题通用版",
    productType: "bundle",
    status: "active",
    quizCount: 2,
    description: "同一组验证码可访问大五人格测试与暗面力量测试。",
    linkedQuizzes: [
      { slug: "bigfive", title: "大五人格测试" },
      { slug: "dark-triad", title: "暗面力量测试" },
    ],
  },
  {
    id: "product_soul_tarot_shared",
    name: "你是哪张塔罗牌？",
    productType: "single_product",
    status: "active",
    quizCount: 1,
    description: "灵魂塔罗测试正式版，小红书主打款式。",
    linkedQuizzes: [{ slug: "soul-tarot", title: "你是哪张塔罗牌？" }],
  },
  {
    id: "product_stress_load_shared",
    name: "压力负荷测试",
    productType: "single_product",
    status: "active",
    quizCount: 1,
    description: "压力负荷测试正式版，针对现代高压人群深度定制。",
    linkedQuizzes: [{ slug: "stress-load-test", title: "压力负荷测试" }],
  },
  {
    id: "product_desire_composition_shared",
    name: "你的欲望组成图",
    productType: "single_product",
    status: "active",
    quizCount: 1,
    description: "欲望组成图正式版，小红书爆款潜力款，支持精美长图导出。",
    linkedQuizzes: [{ slug: "desire-composition", title: "你的欲望组成图" }],
  },
]

const mockCodeBatches: AdminCodeBatch[] = [
  {
    id: "batch_personality_bundle_launch",
    name: "人格深测双题通用批次",
    productId: "product_personality_bundle_shared",
    productName: "人格深测双题通用版",
    strategyType: "bundle",
    status: "active",
    codeCount: 4,
    expiresAt: "2026-12-31T23:59:59.000Z",
    codePrefix: "PRO",
    codeLength: 14,
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "当前采用共享验证码，同一组验证码可同时访问大五人格与暗面力量测试。",
    },
    linkedQuizzes: [
      { slug: "bigfive", title: "大五人格测试" },
      { slug: "dark-triad", title: "暗面力量测试" },
    ],
    sampleCodes: [
      { code: "SOUL-PRO-2026", status: "active", expiresAt: "2026-12-31T23:59:59.000Z" },
      { code: "ST-PRO-BETA", status: "active", expiresAt: "2026-12-31T23:59:59.000Z" },
      { code: "SD3-DARK-TRIAD", status: "active", expiresAt: "2026-12-31T23:59:59.000Z" },
    ],
  },
  {
    id: "batch_oejts_shared",
    name: "OEJTS 主售卖批次",
    productId: "product_oejts_shared",
    productName: "OEJTS 16 型人格图谱",
    strategyType: "single_product",
    status: "active",
    codeCount: 2,
    expiresAt: "2026-12-31T23:59:59.000Z",
    codePrefix: "OEJTS",
    codeLength: 14,
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "MVP 阶段采用一套题一个随机口令，后续可切到一单一码。",
    },
    linkedQuizzes: [{ slug: "oejts-personality-map", title: "OEJTS 16 型人格图谱" }],
    sampleCodes: [
      { code: "SOUL-OEJTS-0313", status: "active", expiresAt: "2026-12-31T23:59:59.000Z" },
      { code: "ST-DEMO-ALPHA", status: "active", expiresAt: "2026-12-31T23:59:59.000Z" },
    ],
  },
  {
    id: "batch_relationship_preference_shared",
    name: "亲密关系偏好测试首发批次",
    productId: "product_relationship_preference_shared",
    productName: "亲密关系偏好测试",
    strategyType: "single_product",
    status: "active",
    codeCount: 2,
    expiresAt: "2026-12-31T23:59:59.000Z",
    codePrefix: "RPREF",
    codeLength: 14,
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "正式版首发期仍然采用共享验证码，便于投放和客服联调。",
    },
    linkedQuizzes: [{ slug: "relationship-preference-test", title: "亲密关系偏好测试" }],
    sampleCodes: [
      { code: "RPREF-8Q4M-2T7K", status: "active", expiresAt: "2026-12-31T23:59:59.000Z" },
      { code: "ST-LOVE-BETA", status: "active", expiresAt: "2026-12-31T23:59:59.000Z" },
    ],
  },
  {
    id: "batch_enneagram_shared",
    name: "九型人格首发批次",
    productId: "product_enneagram_shared",
    productName: "九型人格测试",
    strategyType: "single_product",
    status: "active",
    codeCount: 2,
    expiresAt: "2026-12-31T23:59:59.000Z",
    codePrefix: "ENNEA",
    codeLength: 14,
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "九型人格首发阶段采用共享验证码，便于小红书投放和客服联调。",
    },
    linkedQuizzes: [{ slug: "enneagram", title: "九型人格测试" }],
    sampleCodes: [
      { code: "ENNEA-5W4-2026", status: "active", expiresAt: "2026-12-31T23:59:59.000Z" },
      { code: "ST-ENNEA-BETA", status: "active", expiresAt: "2026-12-31T23:59:59.000Z" },
    ],
  },
  {
    id: "batch_soul_tarot_shared",
    name: "灵魂塔罗首发批次",
    productId: "product_soul_tarot_shared",
    productName: "你是哪张塔罗牌？",
    strategyType: "single_product",
    status: "active",
    codeCount: 2,
    expiresAt: "2026-12-31T23:59:59.000Z",
    codePrefix: "TAROT",
    codeLength: 14,
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "小红书主打灵魂塔罗测试共享验证码。",
    },
    linkedQuizzes: [{ slug: "soul-tarot", title: "你是哪张塔罗牌？" }],
    sampleCodes: [
      { code: "SOUL-TAROT-2026", status: "active", expiresAt: "2026-12-31T23:59:59.000Z" },
      { code: "ST-TAROT-BETA", status: "active", expiresAt: "2026-12-31T23:59:59.000Z" },
    ],
  },
  {
    id: "batch_stress_load_shared",
    name: "压力负荷首发批次",
    productId: "product_stress_load_shared",
    productName: "压力负荷测试",
    strategyType: "single_product",
    status: "active",
    codeCount: 2,
    expiresAt: "2026-12-31T23:59:59.000Z",
    codePrefix: "STRESS",
    codeLength: 14,
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "正式版首发期仍然采用共享验证码。",
    },
    linkedQuizzes: [{ slug: "stress-load-test", title: "压力负荷测试" }],
    sampleCodes: [
      { code: "STRESS-LOAD-2026", status: "active", expiresAt: "2026-12-31T23:59:59.000Z" },
      { code: "ST-STRESS-BETA", status: "active", expiresAt: "2026-12-31T23:59:59.000Z" },
    ],
  },
  {
    id: "batch_desire_composition_shared",
    name: "欲望组成图首发批次",
    productId: "product_desire_composition_shared",
    productName: "你的欲望组成图",
    strategyType: "single_product",
    status: "active",
    codeCount: 2,
    expiresAt: "2026-12-31T23:59:59.000Z",
    codePrefix: "DESIRE",
    codeLength: 14,
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "欲望组成图首发阶段采用共享验证码，便于小红书投放。",
    },
    linkedQuizzes: [{ slug: "desire-composition", title: "你的欲望组成图" }],
    sampleCodes: [
      { code: "DESIRE-COMP-2026", status: "active", expiresAt: "2026-12-31T23:59:59.000Z" },
      { code: "ST-DESIRE-BETA", status: "active", expiresAt: "2026-12-31T23:59:59.000Z" },
    ],
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
  "RPREF-8Q4M-2T7K": {
    code: "RPREF-8Q4M-2T7K",
    product: {
      id: "product_relationship_preference_shared",
      name: "亲密关系偏好测试",
      productType: "single_product",
    },
    allowedQuizzes: [{ slug: "relationship-preference-test", title: "亲密关系偏好测试" }],
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "亲密关系偏好测试正式版随机验证码。",
    },
  },
  "ST-LOVE-BETA": {
    code: "ST-LOVE-BETA",
    product: {
      id: "product_relationship_preference_shared",
      name: "亲密关系偏好测试",
      productType: "single_product",
    },
    allowedQuizzes: [{ slug: "relationship-preference-test", title: "亲密关系偏好测试" }],
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "亲密关系偏好测试本地联调演示验证码。",
    },
  },
  "ENNEA-5W4-2026": {
    code: "ENNEA-5W4-2026",
    product: {
      id: "product_enneagram_shared",
      name: "九型人格测试",
      productType: "single_product",
    },
    allowedQuizzes: [{ slug: "enneagram", title: "九型人格测试" }],
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "九型人格测试正式版随机验证码。",
    },
  },
  "ST-ENNEA-BETA": {
    code: "ST-ENNEA-BETA",
    product: {
      id: "product_enneagram_shared",
      name: "九型人格测试",
      productType: "single_product",
    },
    allowedQuizzes: [{ slug: "enneagram", title: "九型人格测试" }],
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "九型人格测试本地联调演示验证码。",
    },
  },
  "SOUL-PRO-2026": {
    code: "SOUL-PRO-2026",
    product: {
      id: "product_personality_bundle_shared",
      name: "人格深测双题通用版",
      productType: "bundle",
    },
    allowedQuizzes: [
      { slug: "bigfive", title: "大五人格测试" },
      { slug: "dark-triad", title: "暗面力量测试" },
    ],
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "人格深测双题通用验证码，可同时进入大五人格与暗面力量测试。",
    },
  },
  "ST-PRO-BETA": {
    code: "ST-PRO-BETA",
    product: {
      id: "product_personality_bundle_shared",
      name: "人格深测双题通用版",
      productType: "bundle",
    },
    allowedQuizzes: [
      { slug: "bigfive", title: "大五人格测试" },
      { slug: "dark-triad", title: "暗面力量测试" },
    ],
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "人格深测双题客服联调验证码。",
    },
  },
  "SD3-DARK-TRIAD": {
    code: "SD3-DARK-TRIAD",
    product: {
      id: "product_personality_bundle_shared",
      name: "人格深测双题通用版",
      productType: "bundle",
    },
    allowedQuizzes: [
      { slug: "bigfive", title: "大五人格测试" },
      { slug: "dark-triad", title: "暗面力量测试" },
    ],
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "兼容保留的正式版共享验证码，同样可访问两套人格深测。",
    },
  },
  "ST-SD3-BETA": {
    code: "ST-SD3-BETA",
    product: {
      id: "product_personality_bundle_shared",
      name: "人格深测双题通用版",
      productType: "bundle",
    },
    allowedQuizzes: [
      { slug: "bigfive", title: "大五人格测试" },
      { slug: "dark-triad", title: "暗面力量测试" },
    ],
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "兼容保留的联调验证码，同样可访问两套人格深测。",
    },
  },
  "SOUL-TAROT-2026": {
    code: "SOUL-TAROT-2026",
    product: {
      id: "product_soul_tarot_shared",
      name: "你是哪张塔罗牌？",
      productType: "single_product",
    },
    allowedQuizzes: [{ slug: "soul-tarot", title: "你是哪张塔罗牌？" }],
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "灵魂塔罗测试通用验证码。",
    },
  },
  "ST-TAROT-BETA": {
    code: "ST-TAROT-BETA",
    product: {
      id: "product_soul_tarot_shared",
      name: "你是哪张塔罗牌？",
      productType: "single_product",
    },
    allowedQuizzes: [{ slug: "soul-tarot", title: "你是哪张塔罗牌？" }],
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "灵魂塔罗测试本地联调演示验证码。",
    },
  },
  "STRESS-LOAD-2026": {
    code: "STRESS-LOAD-2026",
    product: {
      id: "product_stress_load_shared",
      name: "压力负荷测试",
      productType: "single_product",
    },
    allowedQuizzes: [{ slug: "stress-load-test", title: "压力负荷测试" }],
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "压力负荷测试通用验证码。",
    },
  },
  "ST-STRESS-BETA": {
    code: "ST-STRESS-BETA",
    product: {
      id: "product_stress_load_shared",
      name: "压力负荷测试",
      productType: "single_product",
    },
    allowedQuizzes: [{ slug: "stress-load-test", title: "压力负荷测试" }],
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "压力负荷测试本地联调演示验证码。",
    },
  },
  "DESIRE-COMP-2026": {
    code: "DESIRE-COMP-2026",
    product: {
      id: "product_desire_composition_shared",
      name: "你的欲望组成图",
      productType: "single_product",
    },
    allowedQuizzes: [{ slug: "desire-composition", title: "你的欲望组成图" }],
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "欲望组成图通用验证码。",
    },
  },
  "ST-DESIRE-BETA": {
    code: "ST-DESIRE-BETA",
    product: {
      id: "product_desire_composition_shared",
      name: "你的欲望组成图",
      productType: "single_product",
    },
    allowedQuizzes: [{ slug: "desire-composition", title: "你的欲望组成图" }],
    policy: {
      scopeMode: "product",
      verificationMode: "shared_code",
      tokenTtlDays: 30,
      introVisible: true,
      notes: "欲望组成图本地联调演示验证码。",
    },
  },
}

const mockPurchaseMeta: Record<string, { salesChannel: string; purchaseUrl: string }> = {
  "oejts-personality-map": {
    salesChannel: "xiaohongshu",
    purchaseUrl: "https://example.com/oejts",
  },
  "relationship-preference-test": {
    salesChannel: "xiaohongshu",
    purchaseUrl: "https://example.com/relationship-preference",
  },
  "enneagram": {
    salesChannel: "xiaohongshu",
    purchaseUrl: "https://example.com/enneagram",
  },
  "bigfive": {
    salesChannel: "xiaohongshu",
    purchaseUrl: "https://example.com/personality-pro",
  },
  "dark-triad": {
    salesChannel: "xiaohongshu",
    purchaseUrl: "https://example.com/personality-pro",
  },
  "soul-tarot": {
    salesChannel: "xiaohongshu",
    purchaseUrl: "https://example.com/tarot",
  },
  "stress-load-test": {
    salesChannel: "xiaohongshu",
    purchaseUrl: "https://example.com/stress-load",
  },
  "desire-composition": {
    salesChannel: "xiaohongshu",
    purchaseUrl: "https://example.com/desire-composition",
  },
}

const mockAdminOverview: AdminOverview = {
  quizzes: catalogItems.length,
  products: mockProducts.length,
  codeBatches: mockCodeBatches.length,
  activeCodes: Object.keys(mockAccessGrants).length,
  submissions: 0,
  lastSeedAt: "2026-03-14T00:00:00.000Z",
  analytics: {
    submissions24h: 0,
    submissions7d: 0,
    submissions30d: 0,
    avgDurationSec: null,
    shareCount: 0,
    shareRate: 0,
    recentDailySubmissions: Array.from({ length: 7 }, (_, index) => ({
      date: `2026-03-${String(index + 8).padStart(2, "0")}`,
      submissions: 0,
    })),
    topQuizzes: [],
  },
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
    salesChannel: mockPurchaseMeta[slug]?.salesChannel,
    purchaseUrl: mockPurchaseMeta[slug]?.purchaseUrl,
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


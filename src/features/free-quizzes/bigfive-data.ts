export interface BigFiveQuestion {
  id: number
  title: string
  options: {
    label: string
    value: number
  }[]
}

export interface BigFiveDimension {
  key: string
  name: string
  fullName: string
  description: string
  highDescription: string[]
  midDescription: string[]
  lowDescription: string[]
  shortLabel: string
  advantage: string
  reminder: string
  relationStyle: string
  workStyle: string
  stressPattern: string
}

export interface BigFiveResult {
  scores: {
    E: { raw: number; avg: number; display: number; band: "high" | "mid" | "low" }
    A: { raw: number; avg: number; display: number; band: "high" | "mid" | "low" }
    C: { raw: number; avg: number; display: number; band: "high" | "mid" | "low" }
    N: { raw: number; avg: number; display: number; band: "high" | "mid" | "low" }
    O: { raw: number; avg: number; display: number; band: "high" | "mid" | "low" }
  }
  summary: {
    primary: string
    secondary: string
    lowest: string
    primaryName: string
    secondaryName: string
    lowestName: string
    outline: string
  }
  dimensions: {
    E: string
    A: string
    C: string
    N: string
    O: string
  }
  relationshipProfile: {
    firstImpression: string
    comfortZone: string
    misunderstanding: string
  }
  workProfile: {
    taskStart: string
    executionRhythm: string
    collaborationPreference: string
    painPoint: string
  }
  stressProfile: {
    underPressure: string
    negativeCycle: string
    recoveryWay: string
  }
  strengths: string[]
  blindSpots: string[]
  growthSuggestion: string
  shareQuotes: string[]
}

export const bigFiveDimensions: Record<string, BigFiveDimension> = {
  E: {
    key: "E",
    name: "外向性",
    fullName: "Extraversion",
    description: "你更倾向从外部互动中获得能量。",
    highDescription: [
      "你通常更愿意与外部世界发生连接。",
      "你在社交场合比较容易进入状态，也更愿意表达、带动和推进互动。",
      "在团队或关系中，你往往是那个让气氛流动起来的人。",
      "你可能会从交流、行动和外部反馈中获得能量。",
      "提醒：高外向不等于一定擅长深关系经营，热闹不代表真正被理解。"
    ],
    midDescription: [
      "你在独处和社交之间通常能找到平衡。",
      "需要表达时你能站出来，不需要时也能安静退后。",
      "你不会为了热闹而热闹，也不会因为人多就完全退场。",
      "这种状态往往让你在不同场景中都比较好适应。"
    ],
    lowDescription: [
      "你更习惯把注意力放回自己内部，而不是持续向外释放。",
      "你可能更偏好少量、稳定、有边界感的连接方式。",
      "在新的群体环境中，你通常先观察，再决定是否投入。",
      "这并不等于你不擅长关系，而是你更重视交流质量而不是数量。",
      "提醒：当需求和想法长期不表达时，别人可能误以为你不在意。"
    ],
    shortLabel: "主动连接",
    advantage: "社交能力",
    reminder: "深度连接",
    relationStyle: "你更容易给人热情、活跃、愿意主动互动的印象。",
    workStyle: "更适合在互动反馈中推进任务，需要有表达和被回应的环境。",
    stressPattern: "恢复更依赖与人连接和外部能量，独处时可能感到缺少动力。"
  },
  A: {
    key: "A",
    name: "宜人性",
    fullName: "Agreeableness",
    description: "你在关系中更重视理解、体谅与合作。",
    highDescription: [
      "你通常会优先考虑关系感受，比较容易共情、体谅和照顾他人。",
      "你在互动中倾向于缓和冲突，而不是扩大对立。",
      "在亲密关系和合作关系里，你更容易被认为\"好相处\"。",
      "你会在意别人是否舒服、是否被看见、是否被尊重。",
      "提醒：过度迁就可能让你忽略自己的边界与真实需要。"
    ],
    midDescription: [
      "你既能理解别人，也不会完全失去自己的立场。",
      "面对分歧时，你更可能先沟通再判断，而不是一味妥协。",
      "这种平衡让你在人际中既不显得过硬，也不容易被裹挟。"
    ],
    lowDescription: [
      "你更看重事实、原则、效率或个人判断，而不是先照顾所有人的感受。",
      "你在冲突中可能更直接，也更愿意指出问题所在。",
      "在某些需要决断或谈判的场景里，这会成为你的优势。",
      "但在人际关系中，过于锋利的表达可能会被理解为冷淡、挑剔或难接近。",
      "提醒：表达观点很重要，表达方式同样重要。"
    ],
    shortLabel: "理解体贴",
    advantage: "共情能力",
    reminder: "边界表达",
    relationStyle: "你更容易被认为体贴、温暖、愿意照顾他人感受。",
    workStyle: "在需要协调多方、照顾团队情绪的场景中你更有优势。",
    stressPattern: "可能会过度在意他人评价而忽略自己的需求。"
  },
  C: {
    key: "C",
    name: "尽责性",
    fullName: "Conscientiousness",
    description: "你对秩序、责任与完成度比较敏感。",
    highDescription: [
      "你通常更有计划感、完成感和责任感。",
      "面对任务时，你倾向于提前安排、按步骤推进，并在细节上保持稳定。",
      "别人更容易把\"靠谱\"\"可交付\"\"能落地\"这些评价放在你身上。",
      "你通常不喜欢失控、混乱或长期悬而未决的状态。",
      "提醒：高尽责的人容易对自己要求过高，也容易因为偏差而自我施压。"
    ],
    midDescription: [
      "你会在秩序与弹性之间做调节。",
      "该认真时能进入状态，遇到变化时也不至于完全僵住。",
      "你未必是最严格执行计划的人，但通常具备基本的自我管理能力。"
    ],
    lowDescription: [
      "你可能更偏向随势而动，而不是事事提前规划。",
      "这会让你在灵活应变、临场反应和开放尝试上更轻盈。",
      "但在长期任务、细节管理和稳定交付上，可能更容易出现拖延、遗漏或节奏失控。",
      "提醒：当你不是没有能力，而是缺少结构时，结果很容易看起来\"不够认真\"。"
    ],
    shortLabel: "计划秩序",
    advantage: "执行力",
    reminder: "接纳弹性",
    relationStyle: "你更容易给人稳定、可信赖、答应的事会做到的感觉。",
    workStyle: "更适合有明确目标、流程清晰、需要稳定交付的工作。",
    stressPattern: "压力下容易加码控制，可能会过度追求完成质量。"
  },
  N: {
    key: "N",
    name: "神经质",
    fullName: "Neuroticism",
    description: "你对压力与情绪波动的感受阈值更高或更低。",
    highDescription: [
      "你的情绪系统对压力、风险和不确定性更敏感。",
      "你可能更容易担心、紧张、波动，也更容易被细微变化触发感受。",
      "这种敏感并不全是缺点，它也意味着你更容易察觉问题和潜在风险。",
      "但如果缺乏调节机制，你可能会更容易陷入反复内耗。",
      "提醒：高神经质并不等于脆弱，而是说明你的感受阈值更低、反应更快。"
    ],
    midDescription: [
      "你的情绪反应通常处在可调节范围内。",
      "你会受影响，但不至于轻易失控；会担心，但通常还能拉回理性。",
      "这种状态有利于兼顾敏感度与稳定性。"
    ],
    lowDescription: [
      "你整体更不容易被焦虑、低落或短期波动持续拖住。",
      "面对变化时，你通常更能保持镇定和恢复力。",
      "别人可能会觉得你情绪稳定、抗压、没那么容易被带着走。",
      "提醒：稳定是一种优势，但过度压低感受也可能让你忽略自己真实的疲惫或需求。"
    ],
    shortLabel: "情绪敏感",
    advantage: "风险感知",
    reminder: "自我关怀",
    relationStyle: "你更容易在关系中表现出敏感、注重细节、需要情感确认。",
    workStyle: "你可能更容易察觉风险和潜在问题，需要学会在适当时候放手。",
    stressPattern: "更容易提前担心、反复思考、情绪卷入更快，需要区分真实风险与想象风险。"
  },
  O: {
    key: "O",
    name: "开放性",
    fullName: "Openness to Experience",
    description: "你对新观点、新体验与复杂问题更有兴趣。",
    highDescription: [
      "你通常对新鲜经验、抽象问题、不同观点和想象空间更有兴趣。",
      "你更愿意探索\"还可以怎样\"，而不只是接受既有答案。",
      "你可能在内容审美、概念理解、创意连接或自我反思上更有能量。",
      "在学习、创作或世界观形成上，你往往更需要精神层面的刺激。",
      "提醒：高开放带来丰富视角，也可能带来犹豫、分散或难以落地。"
    ],
    midDescription: [
      "你既能接受新东西，也不会过度排斥稳定路径。",
      "面对未知时，你会结合兴趣与现实判断是否投入。",
      "这使你在创新与执行之间有一定平衡。"
    ],
    lowDescription: [
      "你更偏好清晰、熟悉、可验证的方式，而不是无限发散。",
      "你通常更看重实用性、确定性和现实可操作性。",
      "在需要长期执行、流程稳定或标准明确的事情上，这会很有优势。",
      "提醒：当环境变化很快时，过度依赖既有经验可能让你错过新的可能性。"
    ],
    shortLabel: "探索创新",
    advantage: "创造力",
    reminder: "落地执行",
    relationStyle: "你更容易在关系中分享想法、讨论抽象话题、探索新体验。",
    workStyle: "更适合需要创意、概念理解、分析复杂问题的工作。",
    stressPattern: "恢复更依赖独处、降噪和内部整理。"
  }
}

export const bigFiveQuestions: BigFiveQuestion[] = [
  { id: 1, title: "我很容易主动打开话题，和别人聊起来。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 2, title: "我会真心在意别人的感受。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 3, title: "我做事通常会提前安排，不太临时抱佛脚。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 4, title: "我很容易因为压力而紧绷起来。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 5, title: "我常会被新奇的观点、作品或体验吸引。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 6, title: "我更习惯安静待着，不太主动出头。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 7, title: "我对陌生人的处境通常没什么兴趣。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 8, title: "我经常把东西随手一放，之后再到处找。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 9, title: "大多数时候，我的情绪都比较稳定放松。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 10, title: "抽象、概念化的话题常让我提不起兴趣。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 11, title: "和人相处时，我能给人比较有活力的感觉。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 12, title: "我能比较快察觉到别人情绪上的变化。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 13, title: "我做事会注意细节，不太容易漏项。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 14, title: "我常常会为还没发生的事提前担心。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 15, title: "我脑子里经常会冒出一些新点子。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 16, title: "在群体里，我通常不太爱成为焦点。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 17, title: "我说话有时会太冲，容易让人不舒服。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 18, title: "我的桌面、文件或生活物品经常比较乱。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 19, title: "我很少长时间陷在低落情绪里。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 20, title: "我不太喜欢讨论\"为什么\"或\"可能性\"这类问题。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 21, title: "我能把自己的热情传递给周围的人。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 22, title: "别人遇到难处时，我通常愿意站在对方角度想想。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 23, title: "我会把该做的事尽快做掉，而不是一直拖着。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 24, title: "一点小波动也可能让我心情受影响。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 25, title: "我有比较丰富的想象力。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 26, title: "面对陌生环境，我通常会先观察，不会马上融进去。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 27, title: "我有时会用刻薄的话去顶别人。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 28, title: "我常忘记把用完的东西放回原位。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 29, title: "遇到烦心事时，我通常恢复得还算快。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 30, title: "纯理论或太抽象的内容，我往往觉得无聊。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 31, title: "我在社交场合通常比较自在，也愿意接触人。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 32, title: "我愿意花时间理解别人为什么会那样想。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 33, title: "我喜欢有条理、按步骤地推进事情。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 34, title: "我很容易因为一时不顺而烦躁起来。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 35, title: "我常会停下来思考自己、关系或世界本身。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 36, title: "如果不是必要，我不会主动表现自己。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 37, title: "我有时显得有点冷淡，不太顾及别人感受。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 38, title: "我会逃避或拖延那些本该由我负责的事。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 39, title: "我的情绪起伏有时会比较明显。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 40, title: "我不太觉得自己是一个有创意的人。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 41, title: "我整体上是一个行动感比较强的人。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 42, title: "我通常能让周围的人感觉相处起来比较轻松。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 43, title: "我会按照计划或时间节点推进任务。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 44, title: "我很容易被冒犯，也容易因此不开心。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 45, title: "我理解新概念、新模型通常比较快。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 46, title: "比起热闹场面，我更偏向克制、内收的表达方式。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 47, title: "我愿意为别人腾出时间，而不是只顾自己安排。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 48, title: "我对自己的工作成果要求通常比较高。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 49, title: "我常常会莫名感到情绪低沉。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] },
  { id: 50, title: "我喜欢探索不同角度，而不是只接受一种标准答案。", options: [{ label: "非常不像我", value: 1 }, { label: "不太像我", value: 2 }, { label: "一般", value: 3 }, { label: "比较像我", value: 4 }, { label: "非常像我", value: 5 }] }
]

const dimensionQuestions: Record<string, number[]> = {
  E: [1, 11, 21, 31, 41, 6, 16, 26, 36, 46],
  A: [2, 12, 22, 32, 42, 47, 7, 17, 27, 37],
  C: [3, 13, 23, 33, 43, 48, 8, 18, 28, 38],
  N: [4, 14, 24, 34, 39, 44, 49, 9, 19, 29],
  O: [5, 15, 25, 35, 45, 50, 10, 20, 30, 40]
}

const reverseQuestions: Record<string, number[]> = {
  E: [6, 16, 26, 36, 46],
  A: [7, 17, 27, 37],
  C: [8, 18, 28, 38],
  N: [9, 19, 29],
  O: [10, 20, 30, 40]
}

function calculateScore(answers: Record<number, number>): { raw: number; avg: number; display: number; band: "high" | "mid" | "low" } {
  return { raw: 0, avg: 0, display: 0, band: "mid" }
}

function getDimensionScore(answers: Record<number, number>, dimension: string): { raw: number; avg: number; display: number; band: "high" | "mid" | "low" } {
  const qns = dimensionQuestions[dimension]
  const isReverse = dimension in reverseQuestions
  
  let raw = 0
  for (const qid of qns) {
    let score = answers[qid] || 3
    if (reverseQuestions[dimension]?.includes(qid)) {
      score = 6 - score
    }
    raw += score
  }
  
  const avg = raw / 10
  const display = Math.round(((avg - 1) / 4) * 100)
  let band: "high" | "mid" | "low" = "mid"
  if (avg <= 2.4) band = "low"
  else if (avg >= 3.6) band = "high"
  
  return { raw, avg, display, band }
}

function generateOutline(primary: string, secondary: string, lowest: string): string {
  const dimNames: Record<string, string> = {
    E: "外向性",
    A: "宜人性",
    C: "尽责性",
    N: "神经质",
    O: "开放性"
  }
  
  return `你的轮廓更偏向「高${dimNames[primary]} + 高${dimNames[secondary]}」，同时在「${dimNames[lowest]}」维度相对更克制。`
}

function generateRelationshipProfile(scores: Record<string, { band: string }>): { firstImpression: string; comfortZone: string; misunderstanding: string } {
  const { E: e, A: a, N: n, O: o, C: c } = scores
  
  let firstImpression = ""
  if (e.band === "high" && a.band === "high") {
    firstImpression = "你更容易给人热情、亲切、愿意主动互动的印象。"
  } else if (e.band === "low" && o.band === "high") {
    firstImpression = "你更容易给人思考深入、有内涵的第一印象，但可能显得疏离。"
  } else if (a.band === "low" && c.band === "high") {
    firstImpression = "你更容易给人严谨、理性、可靠的感觉，但可能显得严格。"
  } else if (n.band === "high") {
    firstImpression = "你更容易给人敏感、细腻、对情感需求较高的印象。"
  } else {
    firstImpression = "你更容易给人平和、易相处的印象。"
  }
  
  let comfortZone = ""
  if (e.band === "high") {
    comfortZone = "在社交互动中表达自己，在交流中获得能量。"
  } else {
    comfortZone = "在少量深度关系中展现真实自我，更重视交流质量。"
  }
  
  let misunderstanding = ""
  if (e.band === "low") {
    misunderstanding = "可能被误认为冷漠或不在乎，但实际上你更重视有质量的连接。"
  } else if (a.band === "low") {
    misunderstanding = "可能被认为过于直接或挑剔，但实际上你只是更看重效率和原则。"
  } else if (n.band === "high") {
    misunderstanding = "可能被认为想太多或敏感，但实际上你只是对情绪更敏锐。"
  } else {
    misunderstanding = "你相对不容易被误解，但过度压抑情绪也可能让人忽略你的真实感受。"
  }
  
  return { firstImpression, comfortZone, misunderstanding }
}

function generateWorkProfile(scores: Record<string, { band: string }>): { taskStart: string; executionRhythm: string; collaborationPreference: string; painPoint: string } {
  const { E: e, A: a, N: n, O: o, C: c } = scores
  
  let taskStart = c.band === "high" ? "有明确目标后能快速启动，并按计划稳步推进。" : "更偏向灵活响应，需要找到内在动力才能启动。"
  
  let executionRhythm = c.band === "high" ? "喜欢有序、按步骤推进，注重细节和完成质量。" : "更灵活弹性，可能同时处理多项任务，但细节管理上需要加强。"
  
  let collaborationPreference = e.band === "high" ? "更适合需要频繁沟通协作的环境。" : "更适合独立深度工作，需要安静不被打断的环境。"
  
  let painPoint = ""
  if (c.band === "high") painPoint = "可能会因为追求完美而过度拖延，或对偏差过度苛责。"
  else if (o.band === "high") painPoint = "可能会停留在构想阶段，难以落地执行。"
  else if (n.band === "high") painPoint = "可能会反复担心细节，难以区分真实风险与想象风险。"
  else painPoint = "需要建立外部结构和Deadline来推动任务完成。"
  
  return { taskStart, executionRhythm, collaborationPreference, painPoint }
}

function generateStressProfile(scores: Record<string, { band: string }>): { underPressure: string; negativeCycle: string; recoveryWay: string } {
  const { N: n, E: e, C: c } = scores
  
  let underPressure = n.band === "high" ? "更容易感到紧张、担忧，对压力更敏感。" : "相对更能保持镇定，但可能忽略自己的真实压力信号。"
  
  let negativeCycle = n.band === "high" ? "容易陷入反复担心、情绪内耗的循环。" : "情绪恢复较快，但可能通过压抑来应对，积累潜在问题。"
  
  let recoveryWay = e.band === "high" ? "恢复更依赖与人倾诉和外部能量输入。" : "恢复更依赖独处、降噪和内部整理。"
  
  return { underPressure, negativeCycle, recoveryWay }
}

export function calculateBigFiveResult(answers: Record<number, number>): BigFiveResult {
  const E = getDimensionScore(answers, "E")
  const A = getDimensionScore(answers, "A")
  const C = getDimensionScore(answers, "C")
  const N = getDimensionScore(answers, "N")
  const O = getDimensionScore(answers, "O")
  
  const scores = { E, A, C, N, O }
  
  const sorted = Object.entries(scores).sort((a, b) => b[1].avg - a[1].avg)
  const primary = sorted[0][0]
  const secondary = sorted[1][0]
  const lowest = sorted[4][0]
  
  const dimNames: Record<string, string> = {
    E: "外向性",
    A: "宜人性",
    C: "尽责性",
    N: "神经质",
    O: "开放性"
  }
  
  const dimensions = {
    E: bigFiveDimensions[E.band === "high" ? "E" : E.band === "low" ? "E" : "E"].highDescription[0],
    A: bigFiveDimensions[A.band === "high" ? "A" : A.band === "low" ? "A" : "A"].highDescription[0],
    C: bigFiveDimensions[C.band === "high" ? "C" : C.band === "low" ? "C" : "C"].highDescription[0],
    N: bigFiveDimensions[N.band === "high" ? "N" : N.band === "low" ? "N" : "N"].highDescription[0],
    O: bigFiveDimensions[O.band === "high" ? "O" : O.band === "low" ? "O" : "O"].highDescription[0]
  }
  
  const relationshipProfile = generateRelationshipProfile(scores)
  const workProfile = generateWorkProfile(scores)
  const stressProfile = generateStressProfile(scores)
  
  const strengths = [
    primary === "E" ? "社交能力强，善于带动气氛" : primary === "A" ? "共情能力强，善于理解他人" : primary === "C" ? "执行力强，做事靠谱" : primary === "N" ? "风险感知敏锐，善于察觉细节" : "创造力强，思维开放",
    secondary === "O" ? "思维开放，愿意探索新事物" : secondary === "C" ? "注重细节，追求完成质量" : secondary === "E" ? "善于表达和沟通" : "善于协调和平衡"
  ].filter((s, i, arr) => arr.indexOf(s) === i)
  
  const blindSpots = [
    lowest === "E" ? "可能不擅长主动表达，容易被误解为冷漠" : lowest === "A" ? "可能过于直接，忽略他人感受" : lowest === "C" ? "可能过于追求完美，给自己过大压力" : lowest === "N" ? "可能过度敏感，容易陷入情绪内耗" : "可能过于保守，难以接受新事物"
  ]
  
  let growthSuggestion = ""
  if (primary === "C") growthSuggestion = "留出弹性窗口，避免对偏差过度苛责自己。"
  else if (primary === "A") growthSuggestion = "照顾关系的同时，保留边界表达。"
  else if (primary === "O") growthSuggestion = "把想法拆成可执行步骤，减少只停留在灵感层。"
  else if (primary === "E") growthSuggestion = "在表达很多时，也给自己留出真正消化感受的空间。"
  else if (primary === "N") growthSuggestion = "先区分真实风险与想象风险，再决定要不要投入情绪。"
  
  if (lowest === "C") growthSuggestion += " 建立外部结构比单靠意志力更有效。"
  else if (lowest === "A") growthSuggestion += " 练习在表达事实时照顾关系感受。"
  else if (lowest === "O") growthSuggestion += " 在稳定路径之外，给自己一点试错额度。"
  else if (lowest === "E") growthSuggestion += " 在重要关系里适度表达，比沉默更容易被理解。"
  else if (lowest === "N") growthSuggestion += " 稳定不是压抑，记得识别并回应自己的情绪信号。"
  
  const shareQuotes = [
    "测完以后才发现，我不是\"某一型人\"，而是一张五维地图。",
    "原来我不是社恐，只是低外向 + 高开放。",
    "这份结果最有用的地方，不是夸我，而是指出了我的低位维度。",
    "终于有一个不是硬给我分类型的大五测试。"
  ]
  
  return {
    scores,
    summary: {
      primary,
      secondary,
      lowest,
      primaryName: dimNames[primary],
      secondaryName: dimNames[secondary],
      lowestName: dimNames[lowest],
      outline: generateOutline(primary, secondary, lowest)
    },
    dimensions,
    relationshipProfile,
    workProfile,
    stressProfile,
    strengths,
    blindSpots,
    growthSuggestion,
    shareQuotes
  }
}

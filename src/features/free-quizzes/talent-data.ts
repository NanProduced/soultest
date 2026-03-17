export interface TalentOption {
  label: string;
  primaryDimension: string;
  secondaryDimension: string;
}

export interface TalentQuestion {
  id: string;
  title: string;
  options: TalentOption[];
}

export const talentQuestions: TalentQuestion[] = [
  {
    id: "q1",
    title: "周末早上醒来，没有任何安排。你第一反应想做什么？",
    options: [
      { label: "约朋友出门，去哪不重要，有人一起就行", primaryDimension: "expression", secondaryDimension: "action" },
      { label: "泡杯咖啡，坐在窗边想想最近的生活", primaryDimension: "insight", secondaryDimension: "perception" },
      { label: "开始做一件想了很久的事，比如整理房间或学个新技能", primaryDimension: "action", secondaryDimension: "insight" },
      { label: "给很久没联系的朋友发条消息，问问最近怎么样", primaryDimension: "empathy", secondaryDimension: "expression" }
    ]
  },
  {
    id: "q2",
    title: "朋友遇到一个纠结的选择来问你，你通常会？",
    options: [
      { label: "帮 TA 列出所有选项的利弊，用逻辑分析", primaryDimension: "insight", secondaryDimension: "action" },
      { label: "先问 TA 的感受，陪 TA 把情绪理清楚", primaryDimension: "empathy", secondaryDimension: "perception" },
      { label: "给 TA 一个全新的角度，让 TA 换个思路想", primaryDimension: "creativity", secondaryDimension: "insight" },
      { label: "直接说\"要是我就选这个\"，然后帮 TA 列行动计划", primaryDimension: "action", secondaryDimension: "expression" }
    ]
  },
  {
    id: "q3",
    title: "你在逛一个从没去过的城市，最吸引你的是？",
    options: [
      { label: "当地最有名的地标建筑，拍照打卡", primaryDimension: "perception", secondaryDimension: "creativity" },
      { label: "当地人推荐的一家\"外地人绝对找不到\"的小店", primaryDimension: "action", secondaryDimension: "empathy" },
      { label: "这座城市的整体布局和交通系统，思考它为什么这样设计", primaryDimension: "insight", secondaryDimension: "action" },
      { label: "街角正在下棋的老人，你看出了三步后的走法", primaryDimension: "insight", secondaryDimension: "perception" }
    ]
  },
  {
    id: "q4",
    title: "你在工作/学习中最有成就感的时刻是？",
    options: [
      { label: "解决了一个困扰很久的问题，找到了根本原因", primaryDimension: "insight", secondaryDimension: "action" },
      { label: "你的方案/作品让所有人眼前一亮", primaryDimension: "creativity", secondaryDimension: "expression" },
      { label: "高效完成了一堆任务，清单上全部打勾", primaryDimension: "action", secondaryDimension: "insight" },
      { label: "一个同事/同学说\"多亏了你我才撑过来的\"", primaryDimension: "empathy", secondaryDimension: "expression" }
    ]
  },
  {
    id: "q5",
    title: "以下哪个场景最让你心动？",
    options: [
      { label: "一个人在深夜写出了自己最满意的一段文字", primaryDimension: "creativity", secondaryDimension: "perception" },
      { label: "站在台上演讲，所有人都被你的话打动", primaryDimension: "expression", secondaryDimension: "action" },
      { label: "完成了一个挑战，从0到1做成了某件事", primaryDimension: "action", secondaryDimension: "creativity" },
      { label: "朋友们围在一起，因为你的一个笑话笑到停不下来", primaryDimension: "expression", secondaryDimension: "empathy" }
    ]
  },
  {
    id: "q6",
    title: "如果可以拥有一种超能力，你选？",
    options: [
      { label: "读心术 — 看透每个人的真实想法", primaryDimension: "insight", secondaryDimension: "empathy" },
      { label: "时间暂停 — 把脑海中所有灵感都变成现实", primaryDimension: "creativity", secondaryDimension: "action" },
      { label: "瞬间移动 — 想去哪就去哪，高效行动", primaryDimension: "action", secondaryDimension: "insight" },
      { label: "超级说服力 — 让任何人都被你的话打动", primaryDimension: "expression", secondaryDimension: "empathy" }
    ]
  },
  {
    id: "q7",
    title: "在一个团队项目中，你最自然会做的事是？",
    options: [
      { label: "分析项目目标，制定清晰的执行计划", primaryDimension: "insight", secondaryDimension: "action" },
      { label: "关注每个成员的状态，确保没人被忽略", primaryDimension: "empathy", secondaryDimension: "perception" },
      { label: "提出一些创新的想法，让项目更有亮点", primaryDimension: "creativity", secondaryDimension: "expression" },
      { label: "把目标拆解成步骤，催促大家按时交付", primaryDimension: "action", secondaryDimension: "insight" }
    ]
  },
  {
    id: "q8",
    title: "你收到了一份意想不到的匿名礼物，第一反应是？",
    options: [
      { label: "仔细观察礼物的细节，猜测是谁送的", primaryDimension: "perception", secondaryDimension: "insight" },
      { label: "被这份心意深深感动，想象对方准备时的心情", primaryDimension: "empathy", secondaryDimension: "creativity" },
      { label: "拍照发朋友圈，分享这份惊喜", primaryDimension: "expression", secondaryDimension: "perception" },
      { label: "打开看看，然后立刻开始想怎么回礼", primaryDimension: "action", secondaryDimension: "empathy" }
    ]
  },
  {
    id: "q9",
    title: "以下哪种学习方式最让你来劲？",
    options: [
      { label: "研究底层原理，搞清楚\"为什么\"", primaryDimension: "insight", secondaryDimension: "perception" },
      { label: "看大师的作品，然后尝试用自己的方式重新诠释", primaryDimension: "creativity", secondaryDimension: "perception" },
      { label: "把学到的东西讲给别人听，在表达中加深理解", primaryDimension: "expression", secondaryDimension: "insight" },
      { label: "和别人讨论辩论，在思想碰撞中产生新理解", primaryDimension: "expression", secondaryDimension: "insight" }
    ]
  },
  {
    id: "q10",
    title: "一个安静的雨天下午，你最享受的状态是？",
    options: [
      { label: "翻看摄影集或艺术作品，沉浸在美感中", primaryDimension: "perception", secondaryDimension: "creativity" },
      { label: "翻开一本推理小说，沉浸在逻辑推演的快感中", primaryDimension: "insight", secondaryDimension: "perception" },
      { label: "打开电脑，把脑海里的想法写成文章或画成草图", primaryDimension: "creativity", secondaryDimension: "expression" },
      { label: "整理最近的生活，列个计划表，让一切有序", primaryDimension: "action", secondaryDimension: "insight" }
    ]
  },
  {
    id: "q11",
    title: "别人对你最常见的评价是？",
    options: [
      { label: "\"你好聪明，总能看透事情的本质\"", primaryDimension: "insight", secondaryDimension: "expression" },
      { label: "\"你好细心，连这么小的事都注意到了\"", primaryDimension: "perception", secondaryDimension: "empathy" },
      { label: "\"你好有创意，总能想到别人想不到的\"", primaryDimension: "creativity", secondaryDimension: "expression" },
      { label: "\"你说话好有感染力，听你讲就觉得有道理\"", primaryDimension: "expression", secondaryDimension: "action" }
    ]
  },
  {
    id: "q12",
    title: "你最容易在什么情况下进入\"心流\"状态？",
    options: [
      { label: "深度思考一个复杂问题，找到答案的那一刻", primaryDimension: "insight", secondaryDimension: "perception" },
      { label: "创作一个东西，灵感源源不断的时候", primaryDimension: "creativity", secondaryDimension: "perception" },
      { label: "在台上或镜头前，完全沉浸在自己的表达中", primaryDimension: "expression", secondaryDimension: "creativity" },
      { label: "和一个人深度聊天，彼此越聊越懂", primaryDimension: "empathy", secondaryDimension: "expression" }
    ]
  },
  {
    id: "q13",
    title: "如果你是一部电影里的角色，你最可能是？",
    options: [
      { label: "侦探/智者 — 破解谜题，找到真相", primaryDimension: "insight", secondaryDimension: "perception" },
      { label: "疗愈者/导师 — 在关键时刻给主角力量", primaryDimension: "empathy", secondaryDimension: "perception" },
      { label: "艺术家/创作者 — 用作品改变世界", primaryDimension: "creativity", secondaryDimension: "expression" },
      { label: "先锋/开拓者 — 第一个冲锋，带领大家突围", primaryDimension: "action", secondaryDimension: "expression" }
    ]
  },
  {
    id: "q14",
    title: "生活中最让你感到\"活着\"的时刻是？",
    options: [
      { label: "突然看懂了一个复杂的事情，那种豁然开朗", primaryDimension: "insight", secondaryDimension: "perception" },
      { label: "被某个细节深深打动，眼泪不自觉地流下来", primaryDimension: "perception", secondaryDimension: "empathy" },
      { label: "做了一个果断的决定，并看到了好的结果", primaryDimension: "action", secondaryDimension: "insight" },
      { label: "和重要的人有了一次真诚的、灵魂级别的对话", primaryDimension: "empathy", secondaryDimension: "expression" }
    ]
  },
  {
    id: "q15",
    title: "你更容易被什么样的人吸引？（不限于恋爱）",
    options: [
      { label: "有深度思考的人，和 TA 聊天总能学到东西", primaryDimension: "insight", secondaryDimension: "expression" },
      { label: "有独特审美的人，TA 的品味让你惊喜", primaryDimension: "perception", secondaryDimension: "creativity" },
      { label: "有奇思妙想的人，TA 的脑洞让你大开眼界", primaryDimension: "creativity", secondaryDimension: "insight" },
      { label: "会讲故事的人，听 TA 说话就像看一场表演", primaryDimension: "expression", secondaryDimension: "creativity" }
    ]
  },
  {
    id: "q16",
    title: "如果要你做一个自媒体账号，你最可能做什么内容？",
    options: [
      { label: "深度分析/科普 — 把复杂的事情讲清楚", primaryDimension: "insight", secondaryDimension: "expression" },
      { label: "生活美学/摄影 — 分享你眼中世界的美", primaryDimension: "perception", secondaryDimension: "creativity" },
      { label: "手工/DIY/创意改造 — 动手做点酷的东西", primaryDimension: "creativity", secondaryDimension: "action" },
      { label: "脱口秀/演讲 — 用观点和幽默打动人", primaryDimension: "expression", secondaryDimension: "empathy" }
    ]
  },
  {
    id: "q17",
    title: "面对一个你从没遇过的难题，第一反应是？",
    options: [
      { label: "拆解问题，分析结构，找到关键点", primaryDimension: "insight", secondaryDimension: "action" },
      { label: "想一个完全不同的角度，越不寻常越好", primaryDimension: "creativity", secondaryDimension: "insight" },
      { label: "找有经验的人聊聊，集合众人智慧", primaryDimension: "empathy", secondaryDimension: "expression" },
      { label: "先做起来，在行动中找到解决方案", primaryDimension: "action", secondaryDimension: "creativity" }
    ]
  },
  {
    id: "q18",
    title: "你在意的\"好\"更接近哪个意思？",
    options: [
      { label: "**深刻** — 有深度、有洞察、不肤浅", primaryDimension: "insight", secondaryDimension: "perception" },
      { label: "**真诚** — 发自内心的、不伪装的", primaryDimension: "empathy", secondaryDimension: "perception" },
      { label: "**独特** — 与众不同、有个性", primaryDimension: "creativity", secondaryDimension: "expression" },
      { label: "**新颖** — 前所未有的、让人耳目一新的", primaryDimension: "creativity", secondaryDimension: "expression" }
    ]
  },
  {
    id: "q19",
    title: "你最希望别人记住你什么？",
    options: [
      { label: "TA 总是能看透事情的本质", primaryDimension: "insight", secondaryDimension: "expression" },
      { label: "TA 让人感到温暖，和 TA 在一起就觉得安心", primaryDimension: "empathy", secondaryDimension: "perception" },
      { label: "TA 创造了很多美好的东西", primaryDimension: "creativity", secondaryDimension: "perception" },
      { label: "TA 是超级行动派，真的把想法变成了现实", primaryDimension: "action", secondaryDimension: "creativity" }
    ]
  },
  {
    id: "q20",
    title: "如果你的人生有一个隐藏成就等待解锁，你希望它是？",
    options: [
      { label: "发现了一个改变世界的规律", primaryDimension: "insight", secondaryDimension: "creativity" },
      { label: "治愈了一个人的心灵，让 TA 重新爱上生活", primaryDimension: "empathy", secondaryDimension: "expression" },
      { label: "创造了一件被无数人喜爱的作品", primaryDimension: "creativity", secondaryDimension: "expression" },
      { label: "从零到一建成了一个有影响力的项目/组织", primaryDimension: "action", secondaryDimension: "expression" }
    ]
  }
];

export interface TalentResultData {
  id: string;
  name: string;
  englishName: string;
  icon: string;
  tagline: string;
  primaryTalent: string;
  secondaryTalentCondition: string[];
  brandColor: string;
  rarity: string;
  gradient: string;
  bgGradient: string;
  shadowColor: string;
  textColor: string;
  portrait: string;
  interpretation: string;
  keywords: string[];
  highlights: string[];
  softSpot: string;
  scenarios: {
    work: string;
    relationship: string;
    creation: string;
  };
  growthPath: string;
  celebrities: string;
  bestMatch: string;
}

export const talentResults: Record<string, TalentResultData> = {
  truth_decoder: {
    id: 'truth_decoder',
    name: '真相解码者',
    englishName: 'Truth Decoder',
    icon: '🔍',
    tagline: '你天生看得见别人看不见的真相',
    primaryTalent: 'insight',
    secondaryTalentCondition: ['action', 'expression'],
    brandColor: '#1A1A2E',
    rarity: '★★★★☆',
    gradient: 'from-indigo-900 via-purple-900 to-indigo-800',
    bgGradient: 'radial-gradient(circle at 50% 30%, rgba(26,26,46,0.6), rgba(6,0,16,1))',
    shadowColor: 'rgba(26,26,46,0.5)',
    textColor: 'text-indigo-300',
    portrait: '想象一间会议室，所有人都在讨论表面问题。角落里有一个人一直在安静地听，偶尔在笔记本上写几个字。当所有人说完了，TA 缓缓开口："问题不在这里，真正的原因是……" 全场安静。三分钟后，所有人恍然大悟。这就是你，真相解码者。',
    interpretation: '你拥有一种罕见的天赋——透视力。在其他人还在纠结表象的时候，你的大脑已经自动完成了「信息采集 → 模式识别 → 本质推演」的全过程。你看问题的角度总是和别人不一样，而且往往更接近真相。\\n你不是那种需要大量时间思考的人——你的洞察常常是「瞬间击中」式的。一句话、一个数据、一个微小的异常，都可能成为你解码真相的线索。这种天赋让你在分析、策略和决策领域有着超乎常人的竞争力。\\n更难得的是，你不只是「看到」真相，你还有把真相转化为行动的驱动力。你是那种发现了问题就一定要解决的人，绝不会停留在「我早就知道了」的层面。',
    keywords: ['一针见血', '逻辑之王', '全局思维', '问题终结者', '战略大脑', '决策天赋'],
    highlights: [
      '一句话点破了所有人都没看到的问题本质，全场「啊，原来如此」',
      '在关键决策中做出了正确判断，事后被证明你是对的',
      '朋友说「你怎么什么都能看穿」的那个瞬间'
    ],
    softSpot: '你太容易看到「真相」，有时反而让你对世界失去耐心——你会觉得「这么明显的事为什么没人看到？」。学会接受：不是每个人都需要看到全局，有些人活在局部也很快乐。你的天赋是看见，但不需要每次都说出来。',
    scenarios: {
      work: '战略分析、风险管控、商业洞察是你的主场。你适合做顾问、分析师、投资人、产品策略',
      relationship: '你是朋友们的「人生GPS」，总能帮人看清方向。但注意别让自己变成「万能分析师」，你也需要被关心',
      creation: '你的分析能力可以和创造力结合，成为优秀的非虚构写作者、纪录片导演或研究者'
    },
    growthPath: '从「看见」到「影响」：你的洞察力是基础，但真正让天赋发光的是把洞察传递出去——写下来、讲出来、做出来。当你的真相不只存在于脑海里，而是改变了某个人的决定，那才是你天赋的完整绽放。',
    celebrities: '查理·芒格 · 诸葛亮 · 诺兰 · 马化腾',
    bestMatch: '🦋 灵感捕手 — TA 的天马行空 + 你的精准分析 = 既有创意又落地的梦之队'
  },
  pattern_alchemist: {
    id: 'pattern_alchemist',
    name: '规律炼金师',
    englishName: 'Pattern Alchemist',
    icon: '⚗️',
    tagline: '你在混沌中看到秩序，在碎片中发现连接',
    primaryTalent: 'insight',
    secondaryTalentCondition: ['creativity', 'perception', 'empathy'],
    brandColor: '#2D1B69',
    rarity: '★★★★☆',
    gradient: 'from-purple-900 via-violet-800 to-purple-700',
    bgGradient: 'radial-gradient(circle at 50% 30%, rgba(45,27,105,0.6), rgba(6,0,16,1))',
    shadowColor: 'rgba(45,27,105,0.5)',
    textColor: 'text-purple-300',
    portrait: '想象一面巨大的白板，上面贴满了看似毫无关联的便利贴——一首诗、一组数据、一张街拍照片、一段对话。所有人都觉得这是一堆垃圾信息。但有一个人站在白板前，眼睛越来越亮，开始用线条把便利贴连起来。"看，这里有一个结构。" 这就是你，规律炼金师。',
    interpretation: '你拥有的天赋，是一种极其稀有的组合——分析力 + 创造力的交叉融合。你不仅能看到事物的底层结构（洞察力），还能在不同领域的规律之间发现意想不到的联系，然后「炼」出全新的理解。\\n别人的大脑是「单线程」的，你的是「网状」的。你读一本物理书的时候可能会联想到音乐的和弦结构，看一部电影的时候可能会想到商业模型——这种跨领域的思维迁移能力，是创新最强大的引擎。\\n你的「炼金术」让你特别擅长发现那些「所有人都觉得不相关但其实暗藏关联」的事物。你是连接点的发现者、跨界思维的大师、规律背后的诗人。',
    keywords: ['跨界思维', '规律猎人', '隐藏连接', '创新引擎', '碎片炼金', '灵感与逻辑的交汇'],
    highlights: [
      '在两个看似无关的领域之间发现了一个惊人的共同规律',
      '你的跨领域类比让所有人茅塞顿开：「原来可以这样理解！」',
      '一个你在脑海中酝酿了很久的理论/框架，终于被你系统化地表达了出来'
    ],
    softSpot: '你的大脑太活跃了，有时候会陷入「过度关联」——什么东西都能联系起来，反而让你难以聚焦。你可能同时在研究五个不同的主题，每一个都很有趣，但没有一个做深。学会对自己说「先完成一个再说」，你的天赋需要深度才能真正发光。',
    scenarios: {
      work: '研究、创新、跨界产品设计是你的舞台。你适合做学者、发明家、产品经理、创意总监',
      relationship: '你是那个「什么话题都能聊」的人，但你需要找到一个能跟上你思维速度的伙伴',
      creation: '你可以成为优秀的科普作者、TED 演讲者、或者创造一个全新的理论框架'
    },
    growthPath: '从「发现规律」到「创造框架」：你看到的连接是原材料，真正的天赋释放是把这些连接整理成一套可复用的框架——让其他人也能看到你眼中的世界。',
    celebrities: '达芬奇 · 乔布斯 · 村上春树 · 张小龙',
    bestMatch: '🚀 破局开拓者 — 你负责发现规律，TA 负责把规律变成行动。理论 + 实践的完美互补'
  },
  soul_translator: {
    id: 'soul_translator',
    name: '灵魂翻译官',
    englishName: 'Soul Translator',
    icon: '🌊',
    tagline: '你能把别人说不出口的感受，翻译成最精准的语言',
    primaryTalent: 'empathy',
    secondaryTalentCondition: ['expression', 'action'],
    brandColor: '#1E90FF',
    rarity: '★★★☆☆',
    gradient: 'from-blue-600 via-sky-500 to-blue-400',
    bgGradient: 'radial-gradient(circle at 50% 30%, rgba(30,144,255,0.4), rgba(6,0,16,1))',
    shadowColor: 'rgba(30,144,255,0.5)',
    textColor: 'text-blue-300',
    portrait: '想象两个人在吵架，越吵越激烈，但其实他们说的是同一件事——只是用了不同的语言。这时，有一个人站出来，对其中一方说：「你其实想说的是……对吗？」那个人愣了一下，眼眶微红，点了点头。然后 TA 转向另一方说：「而你真正在意的是……」另一个人也沉默了。吵架结束了。这就是你，灵魂翻译官。',
    interpretation: '你拥有一种神奇的天赋——情感翻译能力。你能读懂别人没说出口的话，感知那些藏在语言背后的情绪和需求。你的共情力不是「我理解你」，而是「我比你自己更懂你」。\\n更难得的是，你不仅能感知，还能表达。你能把那些模糊的、混乱的感受，翻译成清晰、精准的语言。当你帮别人说出他们想说却说不出口的话时，对方会感到一种被理解的震撼——"你怎么知道我想说的是这个？"\\n这种天赋让你在人际关系中有着天然的优势。你是天生的调解者、咨询师、心灵导师。你的存在，让很多人感到被看见、被理解、被接纳。',
    keywords: ['情感翻译', '深度共情', '心灵导师', '调解专家', '语言治愈', '灵魂共鸣'],
    highlights: [
      '帮朋友说出了 TA 一直想说却说不出口的话，TA 眼泪都下来了',
      '在一群人争吵时，你的一句话让所有人冷静下来，开始真正沟通',
      '别人说"和你聊天就像做了一次心理咨询"的时候'
    ],
    softSpot: '你太容易感知别人的情绪，有时会让自己陷入「情绪过载」。你可能因为别人的痛苦而失眠，因为别人的焦虑而焦虑。学会建立边界——你的天赋是翻译，不是承担。你可以理解，但不需要为所有情绪负责。',
    scenarios: {
      work: '心理咨询、人力资源、客户服务、教育是你的主场。你适合做那些需要深度理解他人的工作',
      relationship: '朋友们的"情感垃圾桶"和"心灵导师"。但记得给自己留点空间，你也需要被照顾',
      creation: '你可以成为优秀的小说家、编剧、诗人——你的共情力让你笔下的人物活灵活现'
    },
    growthPath: '从「翻译」到「治愈」：你的天赋是帮别人看见自己，但更进一步，你可以帮别人疗愈。当你的翻译不只是语言，而是带来真正的理解和接纳，那就是你天赋的最高形态。',
    celebrities: '奥普拉 · 亦舒 · 村上春树 · 毕淑敏',
    bestMatch: '🚀 破局开拓者 — TA 的行动力 + 你的共情力 = 既能做事又能懂人的完美组合'
  }
};

export interface DimensionScores {
  insight: number;
  empathy: number;
  creativity: number;
  expression: number;
  action: number;
  perception: number;
}

const dimensionPriority = ['perception', 'creativity', 'empathy', 'insight', 'expression', 'action'];

function getHighestDimension(scores: DimensionScores): string {
  const sortedDimensions = dimensionPriority.filter(dim => scores[dim as keyof DimensionScores] === Math.max(...Object.values(scores)));
  return sortedDimensions[0] || 'insight';
}

function getSecondHighestDimension(scores: DimensionScores, excludeDimension: string): string {
  const filteredScores = { ...scores };
  delete filteredScores[excludeDimension as keyof DimensionScores];
  const sortedDimensions = dimensionPriority.filter(dim => filteredScores[dim as keyof DimensionScores] === Math.max(...Object.values(filteredScores)));
  return sortedDimensions[0] || 'creativity';
}

export function calculateTalentResult(scores: DimensionScores): string {
  const primaryDimension = getHighestDimension(scores);
  const secondaryDimension = getSecondHighestDimension(scores, primaryDimension);

  for (const [resultId, resultData] of Object.entries(talentResults)) {
    if (resultData.primaryTalent === primaryDimension && resultData.secondaryTalentCondition.includes(secondaryDimension)) {
      return resultId;
    }
  }

  return 'truth_decoder';
}

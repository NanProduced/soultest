import type { QuizRuntimeConfig } from "./types"

// 七大欲望维度
export const desireDimensions = [
  { key: "M", name: "财富欲", emoji: "💰", color: "#FFD700", label: "黄金猎手", description: "对金钱、物质安全感和财务自由的渴望" },
  { key: "P", name: "权力欲", emoji: "👑", color: "#FF4444", label: "王座收藏家", description: "对掌控力、影响力和社会地位的渴望" },
  { key: "L", name: "爱情欲", emoji: "💕", color: "#FF69B4", label: "浪漫至死", description: "对浪漫关系、亲密连接和被爱的渴望" },
  { key: "B", name: "美貌欲", emoji: "✨", color: "#BF55EC", label: "颜值至上主义者", description: "对外在美、个人形象和魅力值的渴望" },
  { key: "F", name: "美食欲", emoji: "🍽️", color: "#FF9A56", label: "灵魂干饭人", description: "对美食、味觉享受和感官愉悦的渴望" },
  { key: "K", name: "求知欲", emoji: "🧠", color: "#4A90D9", label: "灵魂学霸", description: "对知识、探索未知和精神成长的渴望" },
  { key: "S", name: "安逸欲", emoji: "🌿", color: "#2ECC71", label: "人间躺赢家", description: "对舒适、自由和内心平静的渴望" },
]

// 全国平均数据
export const nationalAverage: Record<string, number> = {
  M: 22, P: 10, L: 20, B: 15, F: 13, K: 8, S: 12
}

// 人格详情
export const desirePersonalities: Record<string, {
  key: string
  title: string
  tagline: string
  description: string[]
  quote: string
  celebrities: string[]
  tags: string[]
}> = {
  M: {
    key: "M",
    title: "黄金猎手",
    tagline: "你的灵魂里住着一个华尔街之狼",
    description: [
      "你对金钱有一种天然的敏锐嗅觉——不是贪婪，而是一种对安全感和自由的深层渴望。",
      "你相信\"钱不是万能的，但没有钱是万万不能的\"。你不会为了面子花钱，但你会为了\"让自己的人生有更多选择权\"而努力赚钱。",
      "别人可能觉得你\"太现实\"，但你知道：真正的浪漫，是有底气的浪漫。"
    ],
    quote: "先实现财务自由，再谈诗和远方。",
    celebrities: ["巴菲特", "董明珠", "马斯克"],
    tags: ["现实主义者", "财务敏锐", "追求自由"]
  },
  P: {
    key: "P",
    title: "王座收藏家",
    tagline: "你不想被世界选择，你要选择世界",
    description: [
      "你渴望的不是\"权力\"本身，而是\"掌控感\"——对自己人生的掌控，对局面的掌控，对未来的掌控。",
      "你讨厌\"被安排\"的感觉，天生就想做那个\"做决定的人\"。你有天然的领导气质，在人群中不自觉地就会站到C位。",
      "有人说你\"好强\"，但你知道：弱者才需要妥协，强者创造规则。"
    ],
    quote: "这个世界是我的，也是你们的，但归根结底是我的。",
    celebrities: ["武则天", "奥普拉", "拿破仑"],
    tags: ["掌控欲强", "领导气质", "创造规则"]
  },
  L: {
    key: "L",
    title: "浪漫至死",
    tagline: "你的灵魂是用爱做的",
    description: [
      "你这辈子最大的欲望，就是好好爱一个人，也被一个人好好爱着。你相信爱情，相信灵魂伴侣的存在。",
      "你可能在物质上不那么在意，但在感情上，你极度\"贪心\"——你想要100分的心动、100分的陪伴、100分的理解。",
      "有人说你\"恋爱脑\"，但你知道：在爱里全力以赴的人，才是最勇敢的人。"
    ],
    quote: "给我一个人，我可以放弃全世界。（但最好那个人也很有钱。开玩笑的。）",
    celebrities: ["泰勒·斯威夫特", "莎士比亚", "张爱玲"],
    tags: ["情感丰富", "相信爱情", "勇敢追爱"]
  },
  B: {
    key: "B",
    title: "颜值至上主义者",
    tagline: "这个世界对好看的人永远有优待",
    description: [
      "你对\"美\"有一种近乎执着的追求——不只是外表，还有品味、气质和整体呈现。",
      "你相信\"好看\"是一种核心竞争力，也是一种自我尊重。你的衣柜可能比书柜大，你的护肤步骤可能比工作流程还复杂。",
      "有人说你\"肤浅\"，但你知道：对美的追求，本身就是人类最高级的本能之一。"
    ],
    quote: "好看就是正义。（不接受反驳。）",
    celebrities: ["Jennie", "范冰冰", "贝克汉姆"],
    tags: ["追求美感", "注重形象", "品味独特"]
  },
  F: {
    key: "F",
    title: "灵魂干饭人",
    tagline: "没有什么是一顿好吃的解决不了的",
    description: [
      "你是一个用味蕾感知世界的人。对你来说，美食不只是填饱肚子，而是一种生活哲学。",
      "你可能为了一碗面跨城，为了一家餐厅订好机票，为了一道菜学了三天。你的快乐很简单——吃到好吃的，就是人生巅峰。",
      "有人说你\"贪吃\"，但你知道：认真对待每一餐的人，也在认真对待人生。"
    ],
    quote: "人生苦短，先吃为敬。",
    celebrities: ["蔡澜", "谢霆锋", "Anthony Bourdain"],
    tags: ["美食至上", "生活哲学家", "味觉敏锐"]
  },
  K: {
    key: "K",
    title: "灵魂学霸",
    tagline: "你的大脑永远在hunger mode",
    description: [
      "你最上瘾的事，是\"搞懂一个新东西\"的那一刻。你的好奇心像一个永远填不满的黑洞。",
      "今天研究量子力学，明天研究中世纪历史，后天研究咖啡豆的烘焙工艺。你相信\"无知\"才是最可怕的事。",
      "有人说你\"书呆子\"，但你知道：真正有趣的灵魂，来自永不停止的探索。"
    ],
    quote: "这个世界上最性感的器官是大脑。",
    celebrities: ["爱因斯坦", "埃隆·马斯克", "何同学"],
    tags: ["求知欲强", "好奇心旺", "探索精神"]
  },
  S: {
    key: "S",
    title: "人间躺赢家",
    tagline: "你的终极欲望，是不被任何欲望绑架",
    description: [
      "你活得通透，看得明白。你不想卷，不想争，不想被社会时钟推着走。",
      "你最大的欲望，就是没有欲望——或者说，你的欲望就是\"自由地做自己\"。你相信人生的意义不在于\"获得更多\"，而在于\"需要更少\"。",
      "有人说你\"佛系\"，但你知道：真正的自由，是不需要向任何人证明自己。"
    ],
    quote: "世界那么大，我只想躺平。（但要躺在马尔代夫。）",
    celebrities: ["李子柒", "梭罗", "五条悟"],
    tags: ["追求自由", "通透豁达", "反内卷"]
  },
}

// 12道题目
export const desireQuestions = [
  {
    id: "q1",
    emoji: "🎁",
    text: "你意外获得了一笔100万现金，第一反应是？",
    hint: "凭直觉选，别想太多",
    options: [
      { id: "q1_a", text: "先存起来/投资理财，让钱生钱", emoji: "📈", primary: "M", secondary: null },
      { id: "q1_b", text: "买一张头等舱机票，带最爱的人去蜜月旅行", emoji: "✈️", primary: "L", secondary: "S" },
      { id: "q1_c", text: "全身改造！医美/置装/健身私教安排上", emoji: "💄", primary: "B", secondary: null },
      { id: "q1_d", text: "辞职！用这笔钱给自己一年自由时间", emoji: "🏖️", primary: "S", secondary: "K" },
      { id: "q1_e", text: "拿来创业/做一个自己的品牌", emoji: "🚀", primary: "P", secondary: "M" },
    ]
  },
  {
    id: "q2",
    emoji: "🍽️",
    text: "周末一个人的完美晚餐是？",
    hint: "你最享受哪种独处时光",
    options: [
      { id: "q2_a", text: "订一家米其林/网红餐厅，认真吃一顿好的", emoji: "🌟", primary: "F", secondary: "B" },
      { id: "q2_b", text: "叫外卖+追剧/刷手机，窝在沙发上发呆", emoji: "🛋️", primary: "S", secondary: null },
      { id: "q2_c", text: "约上暧昧对象/伴侣，烛光晚餐走起", emoji: "🕯️", primary: "L", secondary: "F" },
      { id: "q2_d", text: "自己下厨做一道没试过的菜，享受研究的过程", emoji: "👨‍🍳", primary: "K", secondary: "F" },
      { id: "q2_e", text: "去参加一个高端社交晚宴，拓展人脉", emoji: "🥂", primary: "P", secondary: "M" },
    ]
  },
  {
    id: "q3",
    emoji: "📱",
    text: "你最常在深夜打开的App是？",
    hint: "睡前最后一件事",
    options: [
      { id: "q3_a", text: "淘宝/小红书——看看有什么好看的衣服和美妆", emoji: "🛍️", primary: "B", secondary: "M" },
      { id: "q3_b", text: "探探/微信——和喜欢的人聊天或翻聊天记录", emoji: "💬", primary: "L", secondary: null },
      { id: "q3_c", text: "基金/股票App——看看今天赚了还是亏了", emoji: "📊", primary: "M", secondary: null },
      { id: "q3_d", text: "B站/播客/知乎——学点新东西或看纪录片", emoji: "📚", primary: "K", secondary: null },
      { id: "q3_e", text: "大众点评/美食博主视频——研究明天吃什么", emoji: "🍜", primary: "F", secondary: null },
    ]
  },
  {
    id: "q4",
    emoji: "✈️",
    text: "如果可以拥有一种超能力，你选？",
    hint: "你最渴望什么",
    options: [
      { id: "q4_a", text: "时间暂停——想休息多久就多久，永远不赶deadline", emoji: "⏸️", primary: "S", secondary: null },
      { id: "q4_b", text: "读心术——知道别人在想什么，永远占据主动", emoji: "🔮", primary: "P", secondary: "K" },
      { id: "q4_c", text: "永葆青春——永远保持最好看的状态", emoji: "🌸", primary: "B", secondary: null },
      { id: "q4_d", text: "点石成金——碰什么都能变成钱", emoji: "💎", primary: "M", secondary: "P" },
      { id: "q4_e", text: "让喜欢的人也喜欢自己——100%的爱情回应率", emoji: "💘", primary: "L", secondary: null },
    ]
  },
  {
    id: "q5",
    emoji: "🏠",
    text: "你理想中的家是什么样的？",
    hint: "家的核心是什么",
    options: [
      { id: "q5_a", text: "市中心豪华公寓，落地窗俯瞰城市，彰显身份", emoji: "🏙️", primary: "P", secondary: "M" },
      { id: "q5_b", text: "有超大衣帽间和浴室，每天精致出门", emoji: "👗", primary: "B", secondary: "S" },
      { id: "q5_c", text: "开放式大厨房是核心，冰箱永远是满的", emoji: "🍳", primary: "F", secondary: "S" },
      { id: "q5_d", text: "有一面墙的书+安静的书房，像自己的小世界", emoji: "📖", primary: "K", secondary: "S" },
      { id: "q5_e", text: "温馨的两人/家庭空间，最重要的是和爱的人在一起", emoji: "❤️", primary: "L", secondary: "S" },
    ]
  },
  {
    id: "q6",
    emoji: "🎭",
    text: "在一个陌生的聚会上，你最希望别人怎么形容你？",
    hint: "你渴望被认可的样子",
    options: [
      { id: "q6_a", text: '"TA看起来好有钱"/"气场好强，一看就很成功"', emoji: "💼", primary: "M", secondary: "P" },
      { id: "q6_b", text: '"TA也太好看了吧"/"好有品味"', emoji: "✨", primary: "B", secondary: null },
      { id: "q6_c", text: '"TA说话好有深度"/"懂好多东西"', emoji: "🎓", primary: "K", secondary: "P" },
      { id: "q6_d", text: '"TA身边那个人好幸福"/"好甜的一对"', emoji: "💑", primary: "L", secondary: null },
      { id: "q6_e", text: '"TA看起来好chill"/"好松弛好舒服"', emoji: "🧘", primary: "S", secondary: null },
    ]
  },
  {
    id: "q7",
    emoji: "💼",
    text: "如果重新选择职业，你最心动的是？",
    hint: "不考虑现实限制",
    options: [
      { id: "q7_a", text: "投资人/企业家——赚大钱，实现财务自由", emoji: "💹", primary: "M", secondary: "P" },
      { id: "q7_b", text: "美妆博主/时尚编辑——每天研究美丽这件事", emoji: "💅", primary: "B", secondary: "K" },
      { id: "q7_c", text: "米其林厨师/美食旅行家——尝遍世界美味", emoji: "🍷", primary: "F", secondary: "K" },
      { id: "q7_d", text: "学者/作家/纪录片导演——探索真相和知识", emoji: "📝", primary: "K", secondary: null },
      { id: "q7_e", text: "自由职业/数字游民——在哪都能工作，自由最重要", emoji: "🌴", primary: "S", secondary: "M" },
    ]
  },
  {
    id: "q8",
    emoji: "😡",
    text: "什么最容易让你嫉妒？",
    hint: "嫉妒=最真实的欲望",
    options: [
      { id: "q8_a", text: "看到同龄人买了豪车/豪宅", emoji: "🚗", primary: "M", secondary: null },
      { id: "q8_b", text: "看到别人秀恩爱/被偏爱", emoji: "💔", primary: "L", secondary: null },
      { id: "q8_c", text: "看到别人天生丽质/身材超好", emoji: "🪞", primary: "B", secondary: null },
      { id: "q8_d", text: "看到别人升职加薪/成了领导", emoji: "📈", primary: "P", secondary: "M" },
      { id: "q8_e", text: "看到别人躺平不上班还过得很好", emoji: "🏝️", primary: "S", secondary: null },
    ]
  },
  {
    id: "q9",
    emoji: "🌙",
    text: "你做过最多的白日梦是？",
    hint: "潜意识里的渴望",
    options: [
      { id: "q9_a", text: "中了彩票，从此只做想做的事", emoji: "🎰", primary: "M", secondary: "S" },
      { id: "q9_b", text: "遇到了灵魂伴侣，从此被一个人深深爱着", emoji: "💍", primary: "L", secondary: null },
      { id: "q9_c", text: "一觉醒来变成了超级大帅哥/大美女", emoji: "🦋", primary: "B", secondary: null },
      { id: "q9_d", text: "环游世界，吃遍每个国家的招牌美食", emoji: "🌍", primary: "F", secondary: "K" },
      { id: "q9_e", text: "成为某个领域的大佬，所有人都尊敬你", emoji: "🏆", primary: "P", secondary: "K" },
    ]
  },
  {
    id: "q10",
    emoji: "🎬",
    text: "选一部你最想\"活进去\"的电影/剧集：",
    hint: "你想过怎样的人生",
    options: [
      { id: "q10_a", text: "《华尔街之狼》/《继承之战》——纸醉金迷的上流世界", emoji: "🥂", primary: "M", secondary: "P" },
      { id: "q10_b", text: "《怦然心动》/《花束般的恋爱》——心动到窒息的爱情", emoji: "🌸", primary: "L", secondary: null },
      { id: "q10_c", text: "《小森林》/《向往的生活》——日出而作日落而息的田园", emoji: "🌾", primary: "S", secondary: "F" },
      { id: "q10_d", text: "《穿普拉达的女王》/《艾米丽在巴黎》——时尚光鲜的生活", emoji: "👠", primary: "B", secondary: "P" },
      { id: "q10_e", text: "《星际穿越》/《三体》——探索宇宙终极奥秘", emoji: "🚀", primary: "K", secondary: null },
    ]
  },
  {
    id: "q11",
    emoji: "🤳",
    text: "朋友圈发什么内容，你会获得最大满足感？",
    hint: "你最想展示什么",
    options: [
      { id: "q11_a", text: "九宫格自拍/穿搭照，评论区全是\"好好看！\"", emoji: "📸", primary: "B", secondary: "L" },
      { id: "q11_b", text: "和另一半的甜蜜合照/恋爱日常", emoji: "💕", primary: "L", secondary: null },
      { id: "q11_c", text: "打卡高端餐厅/精致美食摆盘", emoji: "🍽️", primary: "F", secondary: "B" },
      { id: "q11_d", text: "新车/新房/旅行头等舱——\"不经意\"的凡尔赛", emoji: "✈️", primary: "M", secondary: "P" },
      { id: "q11_e", text: "读完一本书/学完一门课/参加了一个有趣的讲座", emoji: "📚", primary: "K", secondary: null },
    ]
  },
  {
    id: "q12",
    emoji: "🔮",
    text: "最后一题——如果有一个神灯，你许的第一个愿望是？",
    hint: "终极欲望",
    options: [
      { id: "q12_a", text: "一辈子花不完的钱", emoji: "💰", primary: "M", secondary: null },
      { id: "q12_b", text: "遇到一个一辈子深爱彼此的人", emoji: "💘", primary: "L", secondary: null },
      { id: "q12_c", text: "永远年轻漂亮", emoji: "🌹", primary: "B", secondary: null },
      { id: "q12_d", text: "能自由地做任何想做的事，没有任何束缚", emoji: "🕊️", primary: "S", secondary: "P" },
      { id: "q12_e", text: "知道宇宙所有的答案", emoji: "🔭", primary: "K", secondary: null },
    ]
  },
]

// Runtime配置
export const desireCompositionRuntime: QuizRuntimeConfig = {
  meta: {
    slug: "desire-composition",
    title: "你的欲望组成图",
    summary: "每个人心中都藏着一份欲望配方，测测你的灵魂最渴望什么",
    estimatedMinutes: 2,
    tags: ["欲望组成", "12题", "饼图", "人格标签"],
    category: "性格探索 / 欲望",
  },
  runtime: {
    rendererKey: "custom",
    resultTemplateKey: "custom",
    scoringKey: "dimension",
  },
  presentation: {
    themeKey: "midnight-desire",
    storyMode: true,
    screenCount: 3,
    shareCardKey: "desire-composition-poster",
  },
  questions: desireQuestions.map((q) => ({
    id: q.id,
    type: "single_choice" as const,
    title: q.text,
    options: q.options.map((opt) => ({
      id: opt.id,
      label: opt.text,
      value: {
        [opt.primary]: 3,
        ...(opt.secondary ? { [opt.secondary]: 1 } : {}),
      },
    })),
  })),
  results: Object.values(desirePersonalities).map((p) => ({
    key: p.key,
    title: p.title,
    summary: p.tagline,
  })),
  extensions: {
    scoring: {
      dimensions: desireDimensions.map((d) => ({
        key: d.key,
        label: d.name,
      })),
    },
    desireComposition: {
      dimensions: desireDimensions,
      personalities: desirePersonalities,
      nationalAverage,
    },
  },
}

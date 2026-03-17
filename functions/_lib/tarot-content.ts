import type { QuizRuntimeConfig, QuizResultDefinition } from "./types"

export const tarotDimensions = [
  { key: "D1", label: "意志之火 🔥" },
  { key: "D2", label: "直觉之水 💧" },
  { key: "D3", label: "表达之风 💨" },
  { key: "D4", label: "变革之轮 ♾️" },
  { key: "D5", label: "光影之镜 🌓" },
]

export interface TarotResultDefinition extends QuizResultDefinition {
  image?: string
  vector: number[]
  zodiac?: string
  element: string
  number: string
  themeColor: string
  dna: {
    color: string
    expression: string
    temperature: string
  }
  lightMoment: string
  shadowSide: string
  scenarios: {
    solitude: string
    social: string
    work: string
    love: string
  }
  trivia: string
  soulQuestion: string
  ritual: string
  playlist: string
  movie: string
}

export const tarotResults: TarotResultDefinition[] = [
  {
    key: "0",
    dimensionKey: "0",
    title: "愚人",
    nickname: "The Fool",
    image: "/images/tarot/The Fool.jpg",
    summary: "你是那个站在悬崖边还在微笑的人。不是因为你不知道前方是万丈深渊，而是因为你从骨子里相信——跳下去的那一刻，翅膀会自己长出来。",
    vector: [2.0, 3.5, 4.5, 4.5, 1.5],
    element: "风",
    number: "0",
    themeColor: "#FACC15",
    dna: { color: "明黄 × 天蓝", expression: "即兴的、跳跃的、不可预测的", temperature: "68℃" },
    lightMoment: "当你不顾一切地做了一个所有人都反对的决定，结果发现那是你人生中最正确的选择。",
    shadowSide: "你害怕承诺和被固定，\"不确定性\"是你的燃料，但有时也是你逃避责任的借口。",
    scenarios: {
      solitude: "很少真正独处——总在计划下一次冒险。",
      social: "是最没有距离感的人，刚认识五分钟就像老朋友。",
      work: "适合从 0 到 1 的创新项目，重复性工作是你的噩梦。",
      love: "像一阵风——来得快去得也快，除非你遇到让你愿意停下的人。"
    },
    trivia: "愚人是唯一编号为 0 的牌——0 不是\"什么都没有\"，而是\"包含一切可能\"。",
    soulQuestion: "你热爱出发，但你有没有想过，停下来也是一种勇气？",
    ritual: "去一个完全陌生的地方 / 尝试一项从未做过的事 / 和陌生人聊天 / 买一张没有计划的机票",
    playlist: "独立民谣 / 公路摇滚 / 世界音乐",
    movie: "《白日梦想家》《荒野生存》《阿甘正传》",
    posterTags: ["#永远的新手", "#无限可能", "#天真的勇者", "#自由灵魂", "#零号起点"]
  },
  {
    key: "I",
    dimensionKey: "I",
    title: "魔术师",
    nickname: "The Magician",
    image: "/images/tarot/The Magician.jpg",
    summary: "你拥有将虚幻变为现实的神奇力量。只要你愿意，整个世界都是你的实验室。",
    vector: [5.0, 3.0, 4.5, 3.5, 2.0],
    element: "四元素统合",
    number: "I",
    themeColor: "#EF4444",
    dna: { color: "金色 × 正红", expression: "精确的、高效的、一针见血", temperature: "82℃" },
    lightMoment: "当你从零开始创造了一个让所有人惊叹的成果——项目、产品、作品，什么都好。",
    shadowSide: "你太相信自己的能力，有时会过度自信甚至操控他人。\"我能搞定一切\"的信念偶尔会让你忽略团队和他人的感受。",
    scenarios: {
      solitude: "永远在研究新工具、新技能、新方法——你的学习清单永远比时间长。",
      social: "是最有魅力的讲述者，你的热情和自信能瞬间点燃整个房间。",
      work: "天生的项目推进器，从策划到执行一条龙。",
      love: "浪漫且有行动力——想到什么惊喜就立刻去做。"
    },
    trivia: "魔术师案头摆放着四元素：权杖、圣杯、宝剑、钱币，代表他掌控现实的一切工具。",
    soulQuestion: "你什么都能做到，但你有没有问过自己：「什么才是我真正想做的？」",
    ritual: "学一项新技能 / 从头到尾完成一个小项目 / 整理工具箱 / 给自己设定一个有挑战性的目标",
    playlist: "电子舞曲 / Future Bass / 节奏感强的独立摇滚",
    movie: "《社交网络》《钢铁侠》《模仿游戏》",
    posterTags: ["#意念实现者", "#全能创造者", "#行动的艺术家", "#专注力怪物", "#万能炼金术士"]
  },
  {
    key: "II",
    dimensionKey: "II",
    title: "女祭司",
    nickname: "The High Priestess",
    image: "/images/tarot/The High Priestess.jpg",
    summary: "你坐在黑白石柱之间，守护着潜意识的秘密。你的沉默比言语更有力量。",
    vector: [2.0, 5.0, 1.0, 2.0, 3.5],
    zodiac: "月亮",
    element: "水",
    number: "II",
    themeColor: "#3B82F6",
    dna: { color: "靛蓝 × 银白", expression: "含蓄的、象征性的、层层叠叠的", temperature: "25℃" },
    lightMoment: "当你轻描淡写地说出一句话，事后所有人都觉得\"她/他怎么知道的\"的时候。",
    shadowSide: "你太习惯活在内心世界了，有时会和现实世界脱节。你知道很多别人不知道的事，但你选择不说。",
    scenarios: {
      solitude: "冥想、写日记、研究神秘学或心理学——在内心世界遨游。",
      social: "不主动但有磁力，你的神秘感让人忍不住想接近你。",
      work: "洞察力极强，适合需要深度思考和分析的工作。",
      love: "慢热但深情，你需要一个能尊重你沉默的人。"
    },
    trivia: "她胸前的十字架和脚下的月亮代表她连接了神性与物质、理性与本能。",
    soulQuestion: "你看穿了所有人，但你有没有允许别人也看穿你？",
    ritual: "月光冥想 / 写梦境日记 / 独自散步 / 研读一本深度心理学或神话学的书",
    playlist: "氛围音乐 / 冥想音乐 / 暗潮 / Enya",
    movie: "《降临》《黑天鹅》《潘神的迷宫》",
    posterTags: ["#灵魂透视者", "#沉默的先知", "#月光下的智者", "#潜意识守门人", "#第六感满级"]
  },
  {
    key: "III",
    dimensionKey: "III",
    title: "女皇",
    nickname: "The Empress",
    image: "/images/tarot/The Empress.jpg",
    summary: "你走到哪里，哪里就开始生长。你是丰盛的化身，滋养着周围的一切。",
    vector: [3.0, 3.5, 4.0, 2.0, 1.0],
    zodiac: "金星",
    element: "土",
    number: "III",
    themeColor: "#10B981",
    dna: { color: "翠绿 × 玫瑰金", expression: "温暖的、感官的、充满生命力的", temperature: "42℃" },
    lightMoment: "当你用心准备的一切让所有人感到被爱和被照顾的时候。",
    shadowSide: "你给得太多了。你的滋养有时会变成溺爱或控制，你需要学会区分\"照顾\"和\"过度保护\"。",
    scenarios: {
      solitude: "做饭、养花、做手工、布置家居——让空间充满生活的美感。",
      social: "是所有人都想靠近的\"温暖中心\"，朋友们最信任的倾听者。",
      work: "天生的创意人和美学家，适合设计、美食、教育等领域。",
      love: "全情投入、无条件给予——但要小心别忘了爱自己。"
    },
    trivia: "女皇牌上的麦田代表丰收，石榴代表多产，心形盾牌上的金星符号代表爱与美。",
    soulQuestion: "你滋养了所有人，但谁来滋养你？",
    ritual: "逛花市 / 做一顿精致的饭 / 全身SPA / 在大自然中散步 / 做园艺",
    playlist: "Bossa Nova / 法式香颂 / 轻爵士 / 自然声景",
    movie: "《天使爱美丽》《朱莉与朱莉娅》《小森林》",
    posterTags: ["#大地母亲", "#感官美学家", "#天生的滋养者", "#丰盛的化身", "#爱与美的使者"]
  },
  {
    key: "IV",
    dimensionKey: "IV",
    title: "皇帝",
    nickname: "The Emperor",
    image: "/images/tarot/The Emperor.jpg",
    summary: "你是人群中的定海神针。混乱中你就是秩序，动荡中你就是磐石。",
    vector: [5.0, 1.0, 3.5, 1.0, 2.5],
    zodiac: "白羊座",
    element: "火",
    number: "IV",
    themeColor: "#B91C1C",
    dna: { color: "深红 × 金 × 石灰", expression: "直接的、有力的、不绕弯子", temperature: "58℃" },
    lightMoment: "当你在混乱中建立起秩序，带领团队从困境中走出来的时候。",
    shadowSide: "你太在意控制了。有时你的\"保护\"其实是\"压制\"，你的\"规矩\"其实是\"僵化\"。",
    scenarios: {
      solitude: "规划、复盘、制定下一步战略——闲不下来。",
      social: "天然的领导者气质，走到哪里都会被推到C位。",
      work: "天生的管理者，擅长建立体系和带领团队。",
      love: "有安全感但可能有点\"大男子/大女子主义\"，需要学会平等相待。"
    },
    trivia: "皇帝坐在石头宝座上，扶手上雕刻着白羊头，象征开拓和领导。",
    soulQuestion: "你建造了坚不可摧的城墙，但城墙里面，你允许自己柔软过吗？",
    ritual: "做规划清单 / 剧烈运动 / 读领导力和历史类书籍 / 独自做重大决策",
    playlist: "史诗交响 / 进行曲 / 力量金属",
    movie: "《教父》《角斗士》《国王的演讲》",
    posterTags: ["#天生的统帅", "#规则制定者", "#铁血柔情", "#不动如山", "#秩序的建造者"]
  },
  {
    key: "V",
    dimensionKey: "V",
    title: "教皇",
    nickname: "The Hierophant",
    image: "/images/tarot/The Hierophant.jpg",
    summary: "你守护的不是规矩，是经过千年验证的智慧。你是传统的桥梁。",
    vector: [3.5, 2.5, 3.0, 1.0, 2.0],
    zodiac: "金牛座",
    element: "土",
    number: "V",
    themeColor: "#991B1B",
    dna: { color: "深红 × 金 × 灰白", expression: "有条理的、循循善诱的", temperature: "45℃" },
    lightMoment: "当你的一句话帮助别人想通了一个困扰已久的问题时。",
    shadowSide: "你有时会过于坚持\"正确的做法\"，忽略了\"创新的可能\"。不是所有传统都值得守护。",
    scenarios: {
      solitude: "阅读经典、整理知识体系、思考人生的大问题。",
      social: "是最让人信服的\"导师型\"存在，大家有困惑都想问你。",
      work: "适合教育、咨询、法律等需要专业知识和价值引导的领域。",
      love: "重视承诺和仪式感，希望关系有明确的方向和基础。"
    },
    trivia: "教皇举起的两个手指代表\"祝福\"，也象征着连接天堂与人间。",
    soulQuestion: "你教会了很多人如何生活，但你有没有允许自己也当一次学生？",
    ritual: "参加学术讲座或读书会 / 拜访一位尊敬的师长 / 参观历史古迹 / 写教学笔记",
    playlist: "圣乐 / 巴赫管风琴 / 冥想吟诵",
    movie: "《死亡诗社》《放牛班的春天》《心灵捕手》",
    posterTags: ["#灵魂导师", "#传统守护者", "#知识的桥梁", "#信仰的实践者", "#沉稳的智者"]
  },
  {
    key: "VI",
    dimensionKey: "VI",
    title: "恋人",
    nickname: "The Lovers",
    image: "/images/tarot/The Lovers.jpg",
    summary: "选择去爱是我最大的勇气，也是我最大的魔法。你是二元世界的融合者。",
    vector: [2.5, 3.5, 4.5, 3.0, 1.0],
    zodiac: "双子座",
    element: "风",
    number: "VI",
    themeColor: "#EC4899",
    dna: { color: "玫瑰粉 × 金 × 天蓝", expression: "温暖的、感性的、富有感染力的", temperature: "62℃" },
    lightMoment: "当你用真诚和爱化解了两个人之间的矛盾，或者在关系中做出了勇敢的选择。",
    shadowSide: "你太害怕失去连接了。\"选择恐惧症\"是你的老朋友——因为每一次选择都意味着放弃另一种可能。",
    scenarios: {
      solitude: "回忆和想念——你的内心世界住满了你爱过的人。",
      social: "是天生的调和者，能让最不同的人找到共同话题。",
      work: "擅长协作和沟通，适合需要桥梁角色的岗位。",
      love: "全心全意、用生命去爱——但也容易在关系中迷失自我。"
    },
    trivia: "恋人牌上方的天使是大天使拉斐尔，守护爱情和治愈的天使。",
    soulQuestion: "你把爱给了所有人，但你有没有学会先选择爱自己？",
    ritual: "和爱人共度时光 / 给朋友写一封手写信 / 看一部爱情电影 / 做一件取悦自己的小事",
    playlist: "R&B 情歌 / 独立情歌 / 法式浪漫",
    movie: "《请以你的名字呼唤我》《爱在三部曲》《怦然心动》",
    posterTags: ["#爱的连接者", "#选择的勇者", "#和谐的使者", "#灵魂伴侣型", "#二元融合者"]
  },
  {
    key: "VII",
    dimensionKey: "VII",
    title: "战车",
    nickname: "The Chariot",
    image: "/images/tarot/The Chariot.jpg",
    summary: "挡在我面前的，都是我的燃料。你有一种几乎偏执的胜利信念。",
    vector: [5.0, 2.0, 5.0, 3.5, 2.0],
    zodiac: "巨蟹座",
    element: "水",
    number: "VII",
    themeColor: "#1E3A8A",
    dna: { color: "钢蓝 × 银 × 星光白", expression: "有力的、快速的、目标导向", temperature: "88℃" },
    lightMoment: "当你克服了所有人都认为不可能的困难，站在胜利的终点线上。",
    shadowSide: "你把\"赢\"看得太重了。有时候你赢了战斗却输了关系，赢了目标却丢了初心。",
    scenarios: {
      solitude: "制定计划、复盘战略、研究对手——你的\"休息\"就是换个方式工作。",
      social: "气场强大，是天然的焦点和领袖。",
      work: "执行力爆表，最适合竞争性强、需要突破的岗位。",
      love: "追你的人追不到你，你追的人跑不掉——但要小心别把恋爱也变成一场\"征服\"。"
    },
    trivia: "战车由一黑一白两匹斯芬克斯拉着，象征内心的对立力量。",
    soulQuestion: "你一直在冲锋，但你有没有想过：到达目的地之后呢？",
    ritual: "高强度运动 / 参加竞技比赛 / 设定并完成一个 30 天挑战 / 听热血播客",
    playlist: "电子摇滚 / 史诗配乐 / 燃系 EDM",
    movie: "《洛奇》《速度与激情》《摔跤吧！爸爸》",
    posterTags: ["#胜利执念者", "#意志的铁骑", "#目标粉碎机", "#永不后退", "#内在矛盾的驾驭者"]
  },
  {
    key: "VIII",
    dimensionKey: "VIII",
    title: "力量",
    nickname: "Strength",
    image: "/images/tarot/Strength.jpg",
    summary: "真正的强大，是不需要证明自己强大。你用温柔驯服内心的狮子。",
    vector: [3.5, 3.5, 3.0, 2.5, 2.0],
    zodiac: "狮子座",
    element: "火",
    number: "VIII",
    themeColor: "#F59E0B",
    dna: { color: "暖金 × 橙红 × 象牙白", expression: "沉稳的、坚定而温和的", temperature: "48℃" },
    lightMoment: "当你用耐心和爱帮助一个人从最黑暗的时刻走出来。",
    shadowSide: "你总是在给予，却不好意思索取。你的\"坚强\"有时候是一种伪装——你也需要被照顾。",
    scenarios: {
      solitude: "照顾植物或宠物、做瑜伽、进行内在对话。",
      social: "是最让人安心的存在，大家遇到困难时第一个想到你。",
      work: "抗压能力极强，适合需要耐心 and 同理心的岗位。",
      love: "温柔且坚定，用行动而非言语表达爱。"
    },
    trivia: "力量牌上的女子用温柔的双手掰开狮子的嘴，这是以柔克刚的完美体现。",
    soulQuestion: "你温柔地对待了所有人，但你有没有对自己说过\"你已经够好了\"？",
    ritual: "和动物待在一起 / 练瑜伽或太极 / 在大自然中独处 / 做一件需要耐心的手工",
    playlist: "治愈系民谣 / 柔和的独立摇滚 / 大提琴曲",
    movie: "《少年派的奇幻咆哮》《触不可及》《驯龙高手》",
    posterTags: ["#温柔即力量", "#内在的王者", "#以柔克刚", "#无限耐心", "#驯兽师的温柔"]
  },
  {
    key: "IX",
    dimensionKey: "IX",
    title: "隐者",
    nickname: "The Hermit",
    image: "/images/tarot/The Hermit.jpg",
    summary: "独自爬上山顶点一盏灯——不为被看见，而为照亮来路。你是向内探索的智者。",
    vector: [2.5, 4.5, 1.0, 2.0, 3.0],
    zodiac: "处女座",
    element: "土",
    number: "IX",
    themeColor: "#4B5563",
    dna: { color: "灰褐 × 金黄 × 深蓝", expression: "简洁的、深刻的、惜字如金", temperature: "30℃" },
    lightMoment: "当你在长久的独处和思考后，获得了一个足以改变人生方向的领悟。",
    shadowSide: "你太习惯独处了，有时会忘记人也需要连接. 你的\"避世\"有时不是智慧，而是恐惧社交。",
    scenarios: {
      solitude: "你的天堂——阅读、冥想、思考、写作。",
      social: "只在小范围内展现真实的自己，大部分时间是安静的观察者。",
      work: "适合需要深度思考的独立工作，不喜欢开放式办公和频繁会议。",
      love: "需要大量独处空间的人，伴侣必须理解\"他/她只是需要安静\"。"
    },
    trivia: "隐者手中的灯笼里装着一颗六芒星，象征宏观与微观的统一。",
    soulQuestion: "你在山顶点了一盏灯，但你有没有走下山，把这个光分享给需要它的人？",
    ritual: "独自远足或露营 / 进行一次长时间的冥想 / 写一篇深度文章 / 数字断联一天",
    playlist: "纯钢琴 / 禅修音乐 / 北欧氛围",
    movie: "《荒野生存》《月升王国》《帕特森》",
    posterTags: ["#独行的智者", "#沉默的灯塔", "#真理的苦行僧", "#内在的宇宙", "#山顶的灯"]
  },
  {
    key: "X",
    dimensionKey: "X",
    title: "命运之轮",
    nickname: "Wheel of Fortune",
    image: "/images/tarot/Wheel of Fortune.jpg",
    summary: "我不预测命运，我和它跳舞。高峰时不骄，低谷时不惧，因为轮子永远在转。",
    vector: [2.0, 4.0, 3.5, 5.0, 2.5],
    zodiac: "木星",
    element: "火",
    number: "X",
    themeColor: "#6D28D9",
    dna: { color: "皇家紫 × 金 × 天蓝", expression: "流动的、不可预测的", temperature: "55℃" },
    lightMoment: "当你在低谷期依然保持信念，然后命运之轮真的转了。",
    shadowSide: "你有时候把\"顺其自然\"当成了\"逃避行动\"。命运之轮会转，但你也需要自己推一把。",
    scenarios: {
      solitude: "反思人生的周期和节奏，研究占星或哲学。",
      social: "是那个总能把坏消息讲成好故事的人。",
      work: "适应力极强，在变化中如鱼得水。",
      love: "相信缘分——该来的人会来，该走的人留不住。"
    },
    trivia: "轮子中心的TARO字样可以循环阅读，暗示一切都是循环。",
    soulQuestion: "你相信命运之轮会转，但你有没有想过，这次该由你来决定方向？",
    ritual: "研读占星或塔罗 / 做一次大胆的随机决定 / 回顾人生的高光和低谷 / 旅行",
    playlist: "世界音乐 / 迷幻摇滚 / 爵士即兴",
    movie: "《阿甘正传》《本杰明·巴顿奇事》《大鱼》",
    posterTags: ["#命运冲浪手", "#永恒的乐观主义", "#随机应变大师", "#生命的赌徒", "#宇宙信任者"]
  },
  {
    key: "XI",
    dimensionKey: "XI",
    title: "正义",
    nickname: "Justice",
    image: "/images/tarot/Justice.jpg",
    summary: "每个选择都有代价，我只是让天平恢复平衡。你是不偏不倚的理性使者。",
    vector: [4.0, 1.5, 2.5, 2.0, 2.5],
    zodiac: "天秤座",
    element: "风",
    number: "XI",
    themeColor: "#DC2626",
    dna: { color: "正红 × 金 × 冷灰", expression: "精准的、条理分明的", temperature: "35℃" },
    lightMoment: "当你的判断被时间证明是正确的，所有人都恍然大悟时。",
    shadowSide: "你有时太过理性，忽略了情感的温度。不是所有事情都能用\"对错\"来衡量的。",
    scenarios: {
      solitude: "反思自己的决定是否公正，权衡利弊。",
      social: "是最值得信赖的仲裁者，大家有纷争时来找你。",
      work: "适合法律、分析、审计等需要精准判断的领域。",
      love: "公平对待每段关系，但有时会让对方觉得你太\"讲道理\"。"
    },
    trivia: "正义手中的剑代表理性的穿透力，天平代表公正的衡量。",
    soulQuestion: "你衡量了一切，但你有没有衡量过\"不完美\"也是一种美？",
    ritual: "做一次深度的利弊分析 / 整理财务 / 看法庭辩论纪录片 / 写一篇公正客观的评论",
    playlist: "古典弦乐 / 极简主义音乐 / 清醒电子",
    movie: "《十二怒汉》《辩护人》《聚焦》",
    posterTags: ["#绝对公平", "#逻辑之剑", "#因果的执行者", "#不偏不倚", "#理性的慈悲"]
  },
  {
    key: "XII",
    dimensionKey: "XII",
    title: "倒吊人",
    nickname: "The Hanged Man",
    image: "/images/tarot/The Hanged Man.jpg",
    summary: "当你倒过来看世界，一切都不一样了。你是在等待中获得领悟的智者。",
    vector: [1.0, 4.5, 1.5, 4.0, 3.5],
    zodiac: "海王星",
    element: "水",
    number: "XII",
    themeColor: "#1D4ED8",
    dna: { color: "深蓝 × 翠绿 × 银", expression: "反常的、颠覆性的", temperature: "28℃" },
    lightMoment: "当你在所有人都放弃的时候选择了等待，最后真相/机会如期而至。",
    shadowSide: "\"等待\"有时是智慧，有时是逃避。你需要分辨：自己是在\"看透\"还是在\"拖延\"。",
    scenarios: {
      solitude: "发呆、冥想、从不同角度反复审视同一个问题。",
      social: "沉默寡言但偶尔一鸣惊人，总能给出颠覆性的观点。",
      work: "不适合快节奏的执行，更适合需要深度思考和创新的角色。",
      love: "需要极大的耐心来理解你——你是在用自己的方式感受。"
    },
    trivia: "倒吊人的表情是平静的，甚至带着微笑，因为他已经超越了对痛苦的恐惧。",
    soulQuestion: "你选择了停下来，但你有没有问自己：什么时候该重新出发？",
    ritual: "倒立或做反重力瑜伽 / 尝试从完全相反的角度看一个问题 / 做一次禁语日 / 慢慢走一段路",
    playlist: "后摇 / 氛围电子 / 实验民谣",
    movie: "《盗梦空间》《2001太空漫游》《永恒与一日》",
    posterTags: ["#逆向思维者", "#自愿的牺牲", "#新视角猎手", "#安静的革命家", "#悬而未决的智者"]
  },
  {
    key: "XIII",
    dimensionKey: "XIII",
    title: "死神",
    nickname: "Death",
    image: "/images/tarot/Death.jpg",
    summary: "结束不是终点，是另一个开始的邀请函。你是灰烬中种出花园的人。",
    vector: [3.0, 3.5, 2.0, 5.0, 4.5],
    zodiac: "天蝎座",
    element: "水",
    number: "XIII",
    themeColor: "#111827",
    dna: { color: "深黑 × 白骨 × 血红", expression: "决绝的、干净的", temperature: "15℃" },
    lightMoment: "当你在人生最低谷中彻底放手，然后发现全新的自己。",
    shadowSide: "你有时太急于\"杀死\"旧事物了. 不是所有东西都需要被终结——有些东西值得被修复。",
    scenarios: {
      solitude: "定期清理——扔东西、删好友、断舍离一切不再需要的。",
      social: "不太留恋过去的关系，容易让人觉得你\"冷酷无情\"。",
      work: "擅长转型和危机处理，是最好的\"救火队长\"。",
      love: "能干脆地结束不合适的关系，但也要学会给关系修复的机会。"
    },
    trivia: "死神牌上的白玫瑰象征纯洁和新开始，背景的太阳正在升起。",
    soulQuestion: "你擅长结束，但你有没有学会和某些东西\"共存\"而非\"杀死\"它？",
    ritual: "大扫除 / 断舍离一批旧物 / 尝试一个全新的身份或风格 / 写一封不会寄出的告别信",
    playlist: "暗潮 / 哥特金属 / 后朋克 / 氛围黑金",
    movie: "《蝴蝶效应》《入殓师》《请以你的名字呼唤我》",
    posterTags: ["#蜕变大师", "#断舍离王者", "#涅槃重生", "#终结与开始", "#灰烬中的花园"]
  },
  {
    key: "XIV",
    dimensionKey: "XIV",
    title: "节制",
    nickname: "Temperance",
    image: "/images/tarot/Temperance.jpg",
    summary: "过犹不及，我只取恰到好处。你是平衡矛盾元素的灵魂炼金术士。",
    vector: [3.0, 3.0, 2.5, 2.0, 1.5],
    zodiac: "射手座",
    element: "火",
    number: "XIV",
    themeColor: "#60A5FA",
    dna: { color: "淡金 × 天蓝 × 柔白", expression: "温和的、节制的", temperature: "37℃" },
    lightMoment: "当你在两个极端之间找到了完美的平衡点。",
    shadowSide: "你太追求平衡了，以至于有时候会回避冲突和极端. 有些时刻需要你打破平衡，选一个方向。",
    scenarios: {
      solitude: "做让身心平衡的事——瑜伽、烹饪、泡茶。",
      social: "是最好的调解者，能让火药味十足的场面恢复和平。",
      work: "擅长项目协调和团队平衡，是最好的中间人。",
      love: "追求和谐的关系，不喜欢激烈的冲突。"
    },
    trivia: "天使一只脚在水中，一只脚在陆地上，象征在意识与潜意识之间取得平衡。",
    soulQuestion: "你追求平衡，但有没有一些时刻，你需要允许自己\"失衡\"一下？",
    ritual: "泡茶并细细品味 / 做一次均衡的全身运动 / 整理生活节奏 / 调一杯鸡尾酒",
    playlist: "轻爵士 / 新世纪音乐 / 温和的电子 / 自然白噪音",
    movie: "《海街日记》《小偷家族》《托斯卡纳艳阳下》",
    posterTags: ["#平衡大师", "#中庸之道", "#心灵的调酒师", "#温和的力量", "#恰到好处"]
  },
  {
    key: "XV",
    dimensionKey: "XV",
    title: "恶魔",
    nickname: "The Devil",
    image: "/images/tarot/The Devil.jpg",
    summary: "了解自己的黑暗面，才能真正自由。你是敢于直视深渊的真实行者。",
    vector: [4.0, 2.5, 4.0, 3.5, 5.0],
    zodiac: "摩羯座",
    element: "土",
    number: "XV",
    themeColor: "#450A0A",
    dna: { color: "深黑 × 血红 × 暗金", expression: "直接的、不加修饰的、有穿透力的", temperature: "75℃" },
    lightMoment: "当你坦然面对了自己最深的恐惧或欲望，反而因此获得了前所未有的自由。",
    shadowSide: "你可能会沉迷于某些让你\"感觉强大\"的东西——权力、控制、物质。",
    scenarios: {
      solitude: "探索自己的欲望和恐惧，可能在做一些\"不太主流\"的事。",
      social: "有一种让人又怕又想靠近的暗黑魅力。",
      work: "适合需要洞察人性的工作——营销、心理、谈判。",
      love: "激情四射但可能有控制欲，需要学会\"真正的亲密不是占有\"。"
    },
    trivia: "恶魔牌上的链条是松的，意味着束缚是自愿的，你可以随时摘下它。",
    soulQuestion: "你面对了自己的黑暗，但你有没有想过，光明也是你的一部分？",
    ritual: "做影子工作日记 / 挑战一个你一直回避的恐惧 / 看暗黑题材的电影 / 独处时和自己的\"阴暗面\"对话",
    playlist: "暗潮 / 工业电子 / 哥特摇滚 / Darkwave",
    movie: "《搏击俱乐部》《小丑》《华尔街之狼》",
    posterTags: ["#欲望的主人", "#暗黑魅力", "#束缚与解放", "#真实到可怕", "#影子的舞者"]
  },
  {
    key: "XVI",
    dimensionKey: "XVI",
    title: "塔",
    nickname: "The Tower",
    image: "/images/tarot/The Tower.jpg",
    summary: "闪电劈开的不是我，是困住我的牢笼。你是破而后立的变革化身。",
    vector: [2.0, 2.5, 4.0, 5.0, 4.5],
    zodiac: "火星",
    element: "火",
    number: "XVI",
    themeColor: "#78350F",
    dna: { color: "闪电黄 × 深灰 × 火红", expression: "冲击性的、不可预测的", temperature: "95℃" },
    lightMoment: "当你从人生最大的挫败中站起来，比之前更强大更清醒。",
    shadowSide: "你可能会\"上瘾\"于颠覆和破坏——有时候只是因为你无法忍受安稳。",
    scenarios: {
      solitude: "经历过大变之后的安静重建期。",
      social: "你的故事总能震撼所有人——因为你经历的太多了。",
      work: "是最好的危机管理者和变革推动者。",
      love: "经历过感情的\"塔倒\"之后，要么彻底放手，要么涅槃重生。"
    },
    trivia: "闪电击中的塔象征虚假的安全感，从塔上坠落其实是\"被释放\"了。",
    soulQuestion: "你经历了足够多的\"塔倒\"，但下次建塔的时候，你会建一座什么样的？",
    ritual: "做一次极限运动 / 写下你最大的失败然后烧掉那张纸 / 去一个你从未想过会去的地方 / 和过去的自己告别",
    playlist: "硬核朋克 / 工业金属 / 噪音摇滚 / 后硬核",
    movie: "《V字仇杀队》《黑客帝国》《疯狂的麦克斯》",
    posterTags: ["#废墟上的王", "#闪电般的顿悟", "#破而后立", "#不破不立", "#凤凰涅槃"]
  },
  {
    key: "XVII",
    dimensionKey: "XVII",
    title: "星星",
    nickname: "The Star",
    image: "/images/tarot/The Star.jpg",
    summary: "即使在最黑暗的夜里，我也知道星星还在. 你是暴风雨后的治愈之光。",
    vector: [2.0, 4.5, 2.5, 3.0, 1.0],
    zodiac: "水瓶座",
    element: "风",
    number: "XVII",
    themeColor: "#7DD3FC",
    dna: { color: "星光蓝 × 银白 × 淡紫", expression: "温柔的、无条件的、像水一样滋养", temperature: "32℃" },
    lightMoment: "当你的存在本身就给了某人继续走下去的勇气。",
    shadowSide: "你有时太理想化了. 过度的希望可能会让你忽视现实的残酷。",
    scenarios: {
      solitude: "在星空下冥想、画画、做一切与\"美\"和\"治愈\"有关的事。",
      social: "是那个让所有人都感到被治愈的存在。",
      work: "适合心理咨询、艺术治疗、公益等与治愈有关的领域。",
      love: "给人希望和安全感，但需要一个也愿意照亮你的人。"
    },
    trivia: "星星牌上的女子赤裸代表无所隐藏，她把生命能量无私地回馈给大地。",
    soulQuestion: "你照亮了所有人的黑夜，但谁来做你的星星？",
    ritual: "看星星 / 在自然中待一整天 / 画水彩 / 给自己写一封温柔的信",
    playlist: "治愈系 / 竖琴曲 / Enya / 星空白噪音",
    movie: "《星际穿越》《寻梦环游记》《你的名字》",
    posterTags: ["#永恒的希望", "#心灵治愈师", "#星光引路人", "#纯净的灵魂", "#暴风雨后的第一颗星"]
  },
  {
    key: "XVIII",
    dimensionKey: "XVIII",
    title: "月亮",
    nickname: "The Moon",
    image: "/images/tarot/The Moon.jpg",
    summary: "你说是幻觉，我说那是另一种真实。你是梦境与潜意识的流浪者。",
    vector: [1.5, 5.0, 2.0, 3.5, 4.0],
    zodiac: "双鱼座",
    element: "水",
    number: "XVIII",
    themeColor: "#4338CA",
    dna: { color: "银灰 × 深蓝 × 淡紫", expression: "朦胧的、意象化的、像梦一样流动", temperature: "20℃" },
    lightMoment: "当你的\"幻想\"被证实是预言，当你的直觉比任何分析都准确。",
    shadowSide: "你太容易迷失在自己的内心世界了. \"幻想\"和\"妄想\"之间只有一线之隔。",
    scenarios: {
      solitude: "做白日梦、记录梦境、创作——你的内心世界比外面丰富一百倍。",
      social: "给人一种\"不在这个次元\"的感觉，但你的直觉力让人惊叹。",
      work: "适合需要想象力和直觉的创意工作——写作、电影、设计。",
      love: "浪漫到极致但也容易陷入自己的幻想. 需要一个帮你\"落地\"的伴侣。"
    },
    trivia: "月亮牌上的狗和狼分别代表被驯化的自我和野性的本能。",
    soulQuestion: "你在梦与现实之间自由穿行，但你有没有问自己：哪边才是你的\"家\"？",
    ritual: "记录梦境 / 在月光下散步 / 看一部超 surreal 电影 / 做一次深层冥想",
    playlist: "迷幻电子 / 梦境Pop / Björk / Cocteau Twins",
    movie: "《穆赫兰道》《潘神的迷宫》《水形物语》",
    posterTags: ["#梦境旅人", "#潜意识的诗人", "#幻觉与真实", "#月光下的灵魂", "#灰色地带的行者"]
  },
  {
    key: "XIX",
    dimensionKey: "XIX",
    title: "太阳",
    nickname: "The Sun",
    image: "/images/tarot/The Sun.jpg",
    summary: "我不追光，我就是光。走到哪里，哪里就亮了。你是纯粹生命力的化身。",
    vector: [3.5, 2.5, 5.0, 2.5, 1.0],
    zodiac: "太阳",
    element: "火",
    number: "XIX",
    themeColor: "#F59E0B",
    dna: { color: "明黄 × 橙金 × 天蓝", expression: "明亮的、直接的、充满生命力的", temperature: "78℃" },
    lightMoment: "当你走进一个房间，所有人的心情都变好了——你什么都没做，只是在那里。",
    shadowSide: "你有时候太阳光了，以至于忽略了阴影的存在. 不是所有问题都能用\"积极\"解决。",
    scenarios: {
      solitude: "即使一个人也充满活力——唱歌、跳舞、做让自己开心的事。",
      social: "是天然的中心人物，你的快乐有传染力。",
      work: "最适合需要感染力和创造力的工作。",
      love: "给人无条件的温暖和安全感，是最好的\"人间小太阳\"。"
    },
    trivia: "太阳牌上的孩子骑在白马上，代表纯真、自由和与内在本质的完全合一。",
    soulQuestion: "你照亮了整个世界，但你有没有偶尔允许自己也在阴影里待一会儿？",
    ritual: "晒太阳 / 和孩子或动物玩耍 / 做任何让你发自内心笑的事 / 户外运动",
    playlist: "独立流行 / 夏日冲浪摇滚 / 快乐放克",
    movie: "《阳光灿烂的日子》《天生一对》《阳光小美女》",
    posterTags: ["#行走的太阳", "#快乐制造机", "#赤子之心", "#万物生长的源泉", "#光本身"]
  },
  {
    key: "XX",
    dimensionKey: "XX",
    title: "审判",
    nickname: "Judgement",
    image: "/images/tarot/Judgement.jpg",
    summary: "号角响起的那一刻，我知道我再也不能装睡了。你是浴火重生的觉醒者。",
    vector: [3.5, 4.0, 3.5, 4.5, 3.0],
    zodiac: "冥王星",
    element: "火",
    number: "XX",
    themeColor: "#312E81",
    dna: { color: "天光蓝 × 金 × 火红", expression: "深沉的、有召唤力的", temperature: "70℃" },
    lightMoment: "当你做出了一个改变人生轨迹的决定——因为你终于\"听到\"了灵魂的号角。",
    shadowSide: "你对自己的\"审判\"有时太严厉了. 不是所有的人生选择都需要被重新审视。",
    scenarios: {
      solitude: "深度反思自己的人生轨迹，寻找更高的使命。",
      social: "能激发他人的觉醒，是那个说出\"你不应该过这样的生活\"的人。",
      work: "适合需要使命感驱动的工作——教育、公益、创业。",
      love: "需要一个同样在\"觉醒路上\"的伴侣。"
    },
    trivia: "号角响起代表自我觉醒，从棺材中站起的人代表从旧自我中复活。",
    soulQuestion: "号角已经响了，你准备好回应了吗？",
    ritual: "写一封给未来自己的信 / 重新审视人生的关键决定 / 做一次深度冥想 / 和自己进行一次诚实的对话",
    playlist: "史诗交响 / 圣乐合唱 / 灵魂摇滚",
    movie: "《肖申克的救赎》《心灵奇旅》《觉醒年代》",
    posterTags: ["#灵魂的觉醒者", "#使命感召唤", "#浴火重生", "#终极审视", "#号角响起"]
  },
  {
    key: "XXI",
    dimensionKey: "XXI",
    title: "世界",
    nickname: "The World",
    image: "/images/tarot/The World.jpg",
    summary: "我不完美，但我完整. 旅程本身就是目的。你是圆满与自由的舞者。",
    vector: [3.5, 3.5, 4.0, 3.0, 1.5],
    zodiac: "土星",
    element: "土",
    number: "XXI",
    themeColor: "#065F46",
    dna: { color: "皇家蓝 × 翠绿 × 金", expression: "完整的、圆融的、有力量的", temperature: "40℃" },
    lightMoment: "当你真正接受了自己的全部——好的坏的、光明的阴暗的——发现这就是完整。",
    shadowSide: "\"圆满\"有时候是一种错觉. 你可能会因为觉得\"已经够了\"而停止成长。",
    scenarios: {
      solitude: "享受生活中的每一个瞬间——因为你已经不需要\"追求\"什么了。",
      social: "和任何人都能自在相处，因为你已经和自己和解了。",
      work: "多才多艺，能整合不同领域的知识和技能。",
      love: "不再因为\"缺少\"而爱，而是因为\"丰盛\"而分享。"
    },
    trivia: "世界牌上的月桂花环象征胜利和完成，四角的生物代表获得了智慧。",
    soulQuestion: "你已经完整了，但你有没有准备好——再一次出发？",
    ritual: "跳一支自由的舞 / 回顾自己的人生时间线 / 做一件整合身心灵的事 / 旅行一次\"回归之旅\"",
    playlist: "世界音乐 / 融合爵士 / 冥想交响 / 庆典鼓乐",
    movie: "《心灵奇旅》《一一》《生命之树》",
    posterTags: ["#圆满之舞", "#完整的自我", "#旅程的终点与起点", "#宇宙公民", "#自由与圆满"]
  }
]

export const tarotQuestions = [
  {
    id: "Q1",
    title: "面对一个全新的挑战，你的第一反应是？",
    type: "single_choice",
    options: [
      { id: "Q1_A", label: "先观察一下形势，等时机成熟再行动", value: { D1: -1, D2: 1 } },
      { id: "Q1_B", label: "立刻制定计划，把一切都安排好", value: { D1: 1, D4: -1 } },
      { id: "Q1_C", label: "直觉告诉我可以，那就冲！", value: { D1: 1, D2: 1 } },
      { id: "Q1_D", label: "看看有没有人一起，团队作战更好", value: { D1: -1, D3: 1 } },
    ]
  },
  {
    id: "Q2",
    title: "如果你是古代世界的一个角色，你更想成为？",
    type: "single_choice",
    options: [
      { id: "Q2_A", label: "运筹帷幄的君王——掌控全局、令行禁止", value: { D1: 1, D3: 1 } },
      { id: "Q2_B", label: "云游四方的僧侣——随缘自在、无牵无挂", value: { D1: -1, D2: 1 } },
      { id: "Q2_C", label: "保卫城池的将军——使命必达、身先士卒", value: { D1: 1, D5: -1 } },
      { id: "Q2_D", label: "隐居山林的术士——修炼内功、洞察天机", value: { D1: -1, D5: 1 } },
    ]
  },
  {
    id: "Q3",
    title: "当事情完全失控时，你通常会？",
    type: "single_choice",
    options: [
      { id: "Q3_A", label: "冷静分析，迅速找到最优解", value: { D1: 1, D2: -1 } },
      { id: "Q3_B", label: "放手，相信\"该来的会来\"", value: { D1: -1, D4: 1 } },
      { id: "Q3_C", label: "让情绪先释放一会儿，然后重整旗鼓", value: { D1: 1, D3: 1 } },
      { id: "Q3_D", label: "默默退后观察，等局势明朗再出手", value: { D1: -1, D3: -1 } },
    ]
  },
  {
    id: "Q4",
    title: "你对\"权力\"这个词的第一联想是？",
    type: "single_choice",
    options: [
      { id: "Q4_A", label: "责任——能力越大，责任越大", value: { D1: 1, D5: -1 } },
      { id: "Q4_B", label: "枷锁——权力会让人失去自由", value: { D1: -1, D4: 1 } },
      { id: "Q4_C", label: "工具——用好了可以改变世界", value: { D1: 1, D2: -1 } },
      { id: "Q4_D", label: "幻觉——没有人真正拥有永恒的权力", value: { D1: -1, D2: 1 } },
    ]
  },
  {
    id: "Q5",
    title: "在团队中，你自然而然扮演的角色是？",
    type: "single_choice",
    options: [
      { id: "Q5_A", label: "决策者——关键时刻大家看向我", value: { D1: 1, D3: 1 } },
      { id: "Q5_B", label: "顾问——提供建议但不做最终决定", value: { D1: -1, D2: 1 } },
      { id: "Q5_C", label: "执行者——方向定了我来冲锋", value: { D1: 1, D4: -1 } },
      { id: "Q5_D", label: "观察者——在一旁默默记录和思考", value: { D1: -1, D3: -1 } },
    ]
  },
  {
    id: "Q6",
    title: "如果人生是一盘棋，你更像哪个棋子？",
    type: "single_choice",
    options: [
      { id: "Q6_A", label: "国王——所有棋子围绕我运转", value: { D1: 1, D3: 1 } },
      { id: "Q6_B", label: "马——走法独特，出其不意", value: { D1: -1, D4: 1 } },
      { id: "Q6_C", label: "皇后——最强大、最灵活的存在", value: { D1: 1, D5: -1 } },
      { id: "Q6_D", label: "兵——看似渺小，但走到底线就能翻盘", value: { D1: -1, D5: 1 } },
    ]
  },
  {
    id: "Q7",
    title: "做一个重要决定时，你更依赖？",
    type: "single_choice",
    options: [
      { id: "Q7_A", label: "数据和事实——让证据说话", value: { D2: -1, D1: 1 } },
      { id: "Q7_B", label: "内心的感觉——\"说不清为什么，但我就是知道\"", value: { D2: 1, D1: -1 } },
      { id: "Q7_C", label: "他人的经验和建议——集思广益", value: { D2: -1, D3: 1 } },
      { id: "Q7_D", label: "冥想或独处后的领悟——让答案自己浮现", value: { D2: 1, D3: -1 } },
    ]
  },
  {
    id: "Q8",
    title: "以下哪种体验最让你着迷？",
    type: "single_choice",
    options: [
      { id: "Q8_A", label: "解开一个复杂的逻辑谜题或数学证明", value: { D2: -1, D1: 1 } },
      { id: "Q8_B", label: "一个异常真实的梦境，醒来后久久回味", value: { D2: 1, D5: 1 } },
      { id: "Q8_C", label: "和朋友深夜畅聊人生到天亮", value: { D2: -1, D3: 1 } },
      { id: "Q8_D", label: "独自在星空下感受到和宇宙的某种\"连接\"", value: { D2: 1, D3: -1 } },
    ]
  },
  {
    id: "Q9",
    title: "你对\"直觉\"的看法是？",
    type: "single_choice",
    options: [
      { id: "Q9_A", label: "直觉只是大脑快速处理信息的结果，本质还是逻辑", value: { D2: -1, D1: 1 } },
      { id: "Q9_B", label: "直觉是灵魂的声音，比理性更值得信赖", value: { D2: 1, D5: 1 } },
      { id: "Q9_C", label: "直觉可以参考，但最终还是要看实际情况", value: { D2: -1, D4: -1 } },
      { id: "Q9_D", label: "我的直觉很准，我经常靠它做决定", value: { D2: 1, D1: 1 } },
    ]
  },
  {
    id: "Q10",
    title: "★ 如果有人送你一本书，你最想收到哪类？",
    type: "single_choice",
    options: [
      { id: "Q10_A", label: "一本逻辑严密的科学著作或商业案例分析", value: { D2: -1, D1: 1 } },
      { id: "Q10_B", label: "一本关于神话、象征或梦境解析的书", value: { D2: 1, D5: 1 } },
      { id: "Q10_C", label: "一本温暖治愈的小说或生活散文", value: { D2: -1, D5: -1 } },
      { id: "Q10_D", label: "一本冥想/灵修/深度心理学的指南", value: { D2: 1, D4: 1 } },
    ]
  },
  {
    id: "Q11",
    title: "走在一条从未走过的路上，你更倾向于？",
    type: "single_choice",
    options: [
      { id: "Q11_A", label: "打开地图 APP，确保方向正确不迷路", value: { D2: -1, D4: -1 } },
      { id: "Q11_B", label: "跟着感觉走，迷路也是一种探索", value: { D2: 1, D4: 1 } },
      { id: "Q11_C", label: "问问路人，顺便和当地人聊聊天", value: { D2: -1, D3: 1 } },
      { id: "Q11_D", label: "留意路上的\"征兆\"——一朵花、一只鸟、一个奇怪的路标", value: { D2: 1, D3: -1 } },
    ]
  },
  {
    id: "Q12",
    title: "你对\"命运\"的看法更接近？",
    type: "single_choice",
    options: [
      { id: "Q12_A", label: "命运掌握在自己手中，我的人生我做主", value: { D2: -1, D1: 1 } },
      { id: "Q12_B", label: "有有些事冥冥之中自有安排，不全是巧合", value: { D2: 1, D4: 1 } },
      { id: "Q12_C", label: "命运是概率，做好准备就能提高胜算", value: { D2: -1, D1: 1 } },
      { id: "Q12_D", label: "我不确定，但我尊重生命中不可解释的那部分", value: { D2: 1, D5: 1 } },
    ]
  },
  {
    id: "Q13",
    title: "周末最理想的状态是？",
    type: "single_choice",
    options: [
      { id: "Q13_A", label: "和朋友们聚在一起，热热闹闹地过", value: { D3: 1, D1: 1 } },
      { id: "Q13_B", label: "一个人在家，安静地做自己的事", value: { D3: -1, D2: 1 } },
      { id: "Q13_C", label: "和一两个知心好友来一场深度对话", value: { D3: 1, D2: 1 } },
      { id: "Q13_D", label: "去一个没人认识我的地方独自旅行", value: { D3: -1, D4: 1 } },
    ]
  },
  {
    id: "Q14",
    title: "★ 你的能量来源更像？",
    type: "single_choice",
    options: [
      { id: "Q14_A", label: "太阳——和人在一起就充电，越热闹越精神", value: { D3: 1, D5: -1 } },
      { id: "Q14_B", label: "月亮——独处时才能真正恢复能量", value: { D3: -1, D5: 1 } },
      { id: "Q14_C", label: "星星——在少数灵魂知己面前才真正发光", value: { D3: -1, D2: 1 } },
      { id: "Q14_D", label: "火焰——有共同热情的人聚在一起就燃起来", value: { D3: 1, D1: 1 } },
    ]
  },
  {
    id: "Q15",
    title: "遇到内心的困惑时，你更倾向于？",
    type: "single_choice",
    options: [
      { id: "Q15_A", label: "找朋友倾诉，说出来就好了大半", value: { D3: 1, D5: -1 } },
      { id: "Q15_B", label: "写日记或画画，用创作来消化", value: { D3: -1, D2: 1 } },
      { id: "Q15_C", label: "一个人散步或冥想，让思绪自由流动", value: { D3: -1, D4: 1 } },
      { id: "Q15_D", label: "在社交媒体上发一条含蓄的动态", value: { D3: 1, D5: 1 } },
    ]
  },
  {
    id: "Q16",
    title: "在一个陌生人的聚会上，你通常是？",
    type: "single_choice",
    options: [
      { id: "Q16_A", label: "主动出击，很快就能和大家聊起来", value: { D3: 1, D1: 1 } },
      { id: "Q16_B", label: "找个安静的角落，等有缘人来找我", value: { D3: -1, D1: -1 } },
      { id: "Q16_C", label: "观察全场，然后精准找到最有趣的那个人", value: { D3: -1, D2: 1 } },
      { id: "Q16_D", label: "成为气氛担当，让整场聚会活起来", value: { D3: 1, D4: 1 } },
    ]
  },
  {
    id: "Q17",
    title: "你觉得最深刻的\"连接\"发生在？",
    type: "single_choice",
    options: [
      { id: "Q17_A", label: "和一大群人一起经历某件事——演唱会、比赛、跨年倒计时", value: { D3: 1, D4: 1 } },
      { id: "Q17_B", label: "和一个人四目相对、无需言语就彼此理解的瞬间", value: { D3: -1, D2: 1 } },
      { id: "Q17_C", label: "深夜和挚友推心置腹聊天的时候", value: { D3: 1, D5: -1 } },
      { id: "Q17_D", label: "完全独处时，突然感到和自然/宇宙的共鸣", value: { D3: -1, D5: 1 } },
    ]
  },
  {
    id: "Q18",
    title: "你更认同哪种说法？",
    type: "single_choice",
    options: [
      { id: "Q18_A", label: "\"独木难支\"——人需要群体才能发挥最大价值", value: { D3: 1, D1: 1 } },
      { id: "Q18_B", label: "\"离群索居\"——真正的创造力来自独处", value: { D3: -1, D2: 1 } },
      { id: "Q18_C", label: "\"君子之交淡如水\"——少而精的关系最好", value: { D3: -1, D4: -1 } },
      { id: "Q18_D", label: "\"四海之内皆兄弟\"——我和任何人都能建立连接", value: { D3: 1, D5: -1 } },
    ]
  },
  {
    id: "Q19",
    title: "对于人生中的重大变化，你的态度是？",
    type: "single_choice",
    options: [
      { id: "Q19_A", label: "变化意味着机会，我欢迎一切变化", value: { D4: 1, D1: 1 } },
      { id: "Q19_B", label: "我更喜欢稳定，变化让我不安", value: { D4: -1, D1: -1 } },
      { id: "Q19_C", label: "如果变化是必要的，我可以接受", value: { D4: -1, D2: -1 } },
      { id: "Q19_D", label: "我自己就是变化的制造者", value: { D4: 1, D5: 1 } },
    ]
  },
  {
    id: "Q20",
    title: "如果明天醒来，你的整个生活都变了（工作、城市、圈子），你的第一反应是？",
    type: "single_choice",
    options: [
      { id: "Q20_A", label: "兴奋——终于有新的开始了！", value: { D4: 1, D3: 1 } },
      { id: "Q20_B", label: "恐慌——我需要先确保安全和秩序", value: { D4: -1, D1: 1 } },
      { id: "Q20_C", label: "好奇——先看看这个新世界有什么", value: { D4: 1, D2: 1 } },
      { id: "Q20_D", label: "平静——不管在哪里，我都是我", value: { D4: -1, D2: 1 } },
    ]
  },
  {
    id: "Q21",
    title: "你对\"重新开始\"这个概念的感觉是？",
    type: "single_choice",
    options: [
      { id: "Q21_A", label: "充满期待——每次重新开始都是升级的机会", value: { D4: 1, D5: -1 } },
      { id: "Q21_B", label: "有些害怕——重新开始意味着失去已有的一切", value: { D4: -1, D5: 1 } },
      { id: "Q21_C", label: "无所谓——重要的不是起点，是方向", value: { D4: 1, D1: 1 } },
      { id: "Q21_D", label: "视情况而定——有些东西值得坚守", value: { D4: -1, D1: 1 } },
    ]
  },
  {
    id: "Q22",
    title: "看到一座古老建筑正在被拆除，你的感受是？",
    type: "single_choice",
    options: [
      { id: "Q22_A", label: "惋惜——那些历史和记忆就这样消失了", value: { D4: -1, D5: 1 } },
      { id: "Q22_B", label: "期待——废墟上会建起更好的东西", value: { D4: 1, D5: -1 } },
      { id: "Q22_C", label: "平静接受——万物都有生灭，这是自然规律", value: { D4: 1, D2: 1 } },
      { id: "Q22_D", label: "想要记录下来——至少让它以某种形式留存", value: { D4: -1, D3: -1 } },
    ]
  },
  {
    id: "Q23",
    title: "生活中的哪种\"痛\"你最能接受？",
    type: "single_choice",
    options: [
      { id: "Q23_A", label: "成长的痛——为了变得更好，阵痛是值得的", value: { D4: 1, D1: 1 } },
      { id: "Q23_B", label: "离别的痛——有些人注定只陪你走一段路", value: { D4: 1, D5: 1 } },
      { id: "Q23_C", label: "我不太能接受痛——我更想保护现有的一切", value: { D4: -1, D5: -1 } },
      { id: "Q23_D", label: "等待的痛——该来的还没来，最让人折磨", value: { D4: -1, D3: 1 } },
    ]
  },
  {
    id: "Q24",
    title: "如果人生有\"存档和读档\"功能，你会？",
    type: "single_choice",
    options: [
      { id: "Q24_A", label: "永远不读档——每个选择都让我成为现在的我", value: { D4: 1, D2: 1 } },
      { id: "Q24_B", label: "偶尔回去改改几个关键决定", value: { D4: -1, D1: 1 } },
      { id: "Q24_C", label: "频繁存档——我想体验所有可能性", value: { D4: 1, D3: 1 } },
      { id: "Q24_D", label: "只看不改——回忆过去但不会改变它", value: { D4: -1, D2: 1 } },
    ]
  },
  {
    id: "Q25",
    title: "你更被哪种故事吸引？",
    type: "single_choice",
    options: [
      { id: "Q25_A", label: "温暖治愈的——主角在困境中找到希望和爱", value: { D5: -1, D3: 1 } },
      { id: "Q25_B", label: "暗黑深邃的——探索人性深处的恐惧和欲望", value: { D5: 1, D2: 1 } },
      { id: "Q25_C", label: "英雄史诗的——从平凡到伟大的蜕变之旅", value: { D5: -1, D1: 1 } },
      { id: "Q25_D", label: "悬疑烧脑的——真相藏在层层迷雾之后", value: { D5: 1, D4: 1 } },
    ]
  },
  {
    id: "Q26",
    title: "深夜一个人的时候，你脑海中最常浮现的是？",
    type: "single_choice",
    options: [
      { id: "Q26_A", label: "对明天的期待和计划", value: { D5: -1, D1: 1 } },
      { id: "Q26_B", label: "一些说不清的情绪，像雾一样弥漫", value: { D5: 1, D2: 1 } },
      { id: "Q26_C", label: "今天发生的事情的复盘和反思", value: { D5: -1, D4: -1 } },
      { id: "Q26_D", label: "存在的意义、生死、宇宙这类终极问题", value: { D5: 1, D4: 1 } },
    ]
  },
  {
    id: "Q27",
    title: "你觉得自己的\"阴暗面\"是？",
    type: "single_choice",
    options: [
      { id: "Q27_A", label: "我不太有阴暗面，我是个比较阳光的人", value: { D5: -1, D3: 1 } },
      { id: "Q27_B", label: "我知道它在那里，我学着和它共处", value: { D5: 1, D2: 1 } },
      { id: "Q27_C", label: "我偶尔会感受到它，但我选择不去深究", value: { D5: -1, D1: -1 } },
      { id: "Q27_D", label: "我的阴暗面是我力量的一部分", value: { D5: 1, D1: 1 } },
    ]
  },
  {
    id: "Q28",
    title: "★ 选一个最能代表你灵魂的意象：",
    type: "single_choice",
    options: [
      { id: "Q28_A", label: "清晨第一缕阳光穿过树叶的缝隙", value: { D5: -1, D3: -1, D2: -1 } },
      { id: "Q28_B", label: "满月之夜，月光在湖面碎成银色的光", value: { D5: 1, D2: 1, D3: -1 } },
      { id: "Q28_C", label: "暴风雨中的闪电，劈开黑暗的天空", value: { D5: 1, D4: 1, D1: 1 } },
      { id: "Q28_D", label: "春天花园里，蝴蝶停在刚开的花上", value: { D5: -1, D4: -1, D3: 1 } },
    ]
  },
  {
    id: "Q29",
    title: "★ 如果你是一场神秘仪式的主持者，你的风格是？",
    type: "single_choice",
    options: [
      { id: "Q29_A", label: "庄严的——金色烛光、古老经文、肃穆的氛围", value: { D1: 1, D2: 1, D5: 1 } },
      { id: "Q29_B", label: "温暖的——围坐在篝火旁，分享故事和食物", value: { D3: 1, D5: -1, D4: -1 } },
      { id: "Q29_C", label: "狂野的——鼓声、舞蹈、释放所有的能量", value: { D3: 1, D4: 1, D1: 1 } },
      { id: "Q29_D", label: "安静的——在星空下冥想，等待领悟降临", value: { D2: 1, D3: -1, D5: 1 } },
    ]
  },
  {
    id: "Q30",
    title: "最后一题。如果塔罗牌中有一张牌专为你而画，画面上最可能出现的是？",
    type: "single_choice",
    options: [
      { id: "Q30_A", label: "你站在山顶，手中握着一把发光的权杖，身后是你建造的王国", value: { D1: 1, D4: -1 } },
      { id: "Q30_B", label: "你坐在千年古树下，闭着眼睛，树根连接着整个大地", value: { D2: 1, D3: -1 } },
      { id: "Q30_C", label: "你在一场盛大的庆典中央翩翩起舞，周围的人都被你的光芒吸引", value: { D3: 1, D5: -1 } },
      { id: "Q30_D", label: "你站在两个世界的交界处——一半是光明花园，一半是星空深渊", value: { D5: 1, D4: 1 } },
    ]
  }
]

export const tarotRuntime: QuizRuntimeConfig = {
  meta: {
    slug: "soul-tarot",
    title: "你是哪张塔罗牌？",
    summary: "22 张大阿尔卡纳，22 种灵魂原型——你的灵魂，对应哪一张牌？",
    estimatedMinutes: 10,
    tags: ["塔罗占卜", "灵魂原型", "性格测试", "付费精选"],
    category: "神秘学 / 心理"
  },
  runtime: {
    rendererKey: "generic",
    resultTemplateKey: "tarot-profile",
    scoringKey: "tarot"
  },
  presentation: {
    themeKey: "tarot-mystic",
    storyMode: true,
    screenCount: 8,
    shareCardKey: "tarot-poster",
  },
  questions: tarotQuestions,
  results: tarotResults as any,
  extensions: {
    scoring: {
      dimensions: tarotDimensions,
    },
    intro: {
      tagline: "30 题正式版，支持一键导出精美塔罗灵魂海报。",
      priceLabel: "30 题正式版",
      accessSummary: "输入购买后获得的验证码开始测试，有效期内可重复进入",
      valuePoints: ["灵魂塔罗匹配", "五维灵魂向量", "灵魂判词与生活建议"],
      flowSteps: ["输入验证码", "基本信息感应", "完成 30 题", "揭开灵魂牌面"],
      preQuizCollection: [
        {
          id: "nickname",
          title: "你的称呼",
          type: "text",
          placeholder: "告诉我你的名字，牌会记住你",
          required: false,
        },
        {
          id: "zodiac",
          title: "你的星座",
          type: "zodiac",
          required: true,
        },
        {
          id: "gender",
          title: "你的性别",
          type: "select",
          options: [
            { label: "女生", value: "female" },
            { label: "男生", value: "male" },
            { label: "不愿透露", value: "secret" },
          ],
          required: true,
        },
        {
          id: "ageRange",
          title: "你的年龄段",
          type: "select",
          options: [
            { label: "18 岁以下", value: "u18" },
            { label: "18-24", value: "18-24" },
            { label: "25-30", value: "25-30" },
            { label: "31-40", value: "31-40" },
            { label: "40 岁以上", value: "o40" },
          ],
          required: true,
        },
      ],
    },
  }
}

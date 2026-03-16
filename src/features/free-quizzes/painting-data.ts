export interface PaintingOption {
  label: string;
  scores: Record<string, number>;
}

export interface PaintingQuestion {
  id: string;
  title: string;
  isVisual?: boolean;
  options: PaintingOption[];
}

export const paintingQuestions: PaintingQuestion[] = [
  // 第一组：情绪光谱 [D1]
  {
    id: "q1",
    title: "一个人走在空旷的街道上，天色渐暗，你脑海中浮现的画面是？",
    options: [
      { label: "路灯渐次亮起，温暖的光晕洒在地面上", scores: { E: -1, S: -1 } },
      { label: "天边燃烧着橘红色的晚霞，像一幅巨大的油画", scores: { E: 1, A: 1 } },
      { label: "街道尽头有一家亮着灯的咖啡馆，里面隐约传出笑声", scores: { E: -1, S: 1 } },
      { label: "暴风雨正在逼近，乌云翻滚，闪电劈开天际", scores: { E: 1, T: 1 } }
    ]
  },
  {
    id: "q2",
    title: "如果你的情绪是一种天气，此刻最接近哪一种？",
    options: [
      { label: "万里无云的晴天，清澈透明", scores: { E: -1, L: -1 } },
      { label: "雷雨前的闷热，空气中弥漫着躁动", scores: { E: 1, L: 1 } },
      { label: "细雨绵绵的午后，安静但有些忧郁", scores: { E: -1, S: -1 } },
      { label: "狂风大作的海边，浪花拍打着礁石", scores: { E: 1, A: 1 } }
    ]
  },
  {
    id: "q3",
    title: "听到一首从未听过的音乐，你最先被什么打动？",
    options: [
      { label: "精巧的旋律结构和和声编排", scores: { E: -1, A: -1 } },
      { label: "歌词中某一句话击中了你的心", scores: { E: 1, L: 1 } },
      { label: "整体的氛围让你沉浸其中", scores: { E: -1, T: -1 } },
      { label: "强烈的节奏和能量让你想要跟着动起来", scores: { E: 1, S: 1 } }
    ]
  },
  {
    id: "q4",
    title: "在博物馆里，你更容易在哪种作品前停下脚步？",
    options: [
      { label: "光线柔和、色调宁静的风景画", scores: { E: -1, A: -1 } },
      { label: "色彩浓烈、笔触狂放的表现主义作品", scores: { E: 1, A: 1 } },
      { label: "细节精密、技法高超的古典肖像", scores: { E: -1, L: -1 } },
      { label: "充满张力和冲突感的大型历史画", scores: { E: 1, S: 1 } }
    ]
  },
  {
    id: "q5",
    title: "朋友形容你「情绪上来的时候」，最可能用哪个词？",
    options: [
      { label: "\"你就像一座沉默的火山\" — 内心翻涌但表面平静", scores: { E: -1, S: -1 } },
      { label: "\"你就是一场烟花\" — 瞬间绽放，绚烂夺目", scores: { E: 1, S: 1 } },
      { label: "\"你像一条暗流\" — 情绪很深但不容易被察觉", scores: { E: -1, A: 1 } },
      { label: "\"你就是龙卷风本风\" — 来得快走得也快，但很猛烈", scores: { E: 1, L: 1 } }
    ]
  },
  // 第二组：审美取向 [D2]
  {
    id: "q6",
    title: "选择一种你最想住的房间风格：",
    isVisual: true,
    options: [
      { label: "原木色 + 白墙 + 大窗户，简约干净的日式/北欧风", scores: { A: -1, L: -1 } },
      { label: "深色丝绒 + 金属装饰 + 暖光，浓郁的复古沙龙感", scores: { A: 1, T: -1 } },
      { label: "几何线条 + 纯色块 + 极简家具，现代包豪斯风格", scores: { A: -1, T: 1 } },
      { label: "波西米亚混搭 + 手绘墙 + 各种颜色的靠垫", scores: { A: 1, L: 1 } }
    ]
  },
  {
    id: "q7",
    title: "如果请你为一本小说设计封面，你会选择什么风格？",
    options: [
      { label: "一张精致的摄影照片 + 优雅的衬线字体", scores: { A: -1, E: -1 } },
      { label: "纯手绘的水彩插画，边缘晕染自然", scores: { A: 1, E: -1 } },
      { label: "大面积纯色 + 一个极简图标，留白很多", scores: { A: -1, L: -1 } },
      { label: "抽象的色块碰撞 + 手写体大字，视觉冲击力强", scores: { A: 1, E: 1 } }
    ]
  },
  {
    id: "q8",
    title: "以下哪种视觉体验最让你着迷？",
    options: [
      { label: "高清微距摄影——露珠上倒映的世界，每个细节都清晰可见", scores: { A: -1, L: -1 } },
      { label: "万花筒般的光影——色彩流动、边界模糊、如梦似幻", scores: { A: 1, L: 1 } },
      { label: "黑白胶片——高对比度的光影，颗粒感带来的时间感", scores: { A: -1, T: -1 } },
      { label: "故障艺术（Glitch Art）——像素错位、色彩溢出、打破规则", scores: { A: 1, T: 1 } }
    ]
  },
  {
    id: "q9",
    title: "去看一场展览，你更期待哪种？",
    options: [
      { label: "文艺复兴大师原作展——亲眼看到达芬奇、拉斐尔", scores: { A: -1, T: -1 } },
      { label: "TeamLab 沉浸式数字艺术——身处在光影和色彩的海洋中", scores: { A: 1, T: 1 } },
      { label: "安藤忠雄建筑展——混凝土、光线与空间的极致对话", scores: { A: -1, L: -1 } },
      { label: "草间弥生无限镜屋——密集的波点和无尽的重复", scores: { A: 1, S: 1 } }
    ]
  },
  {
    id: "q10",
    title: "如果你是一种颜色，你觉得自己更接近？",
    options: [
      { label: "象牙白或米色——温润、低调、经典", scores: { A: -1, E: -1 } },
      { label: "深海蓝或墨绿——深邃、沉稳、有层次", scores: { A: -1, E: -1 } },
      { label: "珊瑚橘或明黄——温暖、活力、有感染力", scores: { A: 1, E: 1 } },
      { label: "荧光紫或电光蓝——大胆、前卫、不走寻常路", scores: { A: 1, T: 1 } }
    ]
  },
  // 第三组：生命哲学 [D3]
  {
    id: "q11",
    title: "面对一个重要的人生选择，你更倾向于？",
    options: [
      { label: "列出利弊清单，理性分析后做决定", scores: { L: -1, A: -1 } },
      { label: "跟随直觉，\"感觉对了就去做\"", scores: { L: 1, E: 1 } },
      { label: "征求信任的人的意见，综合考虑", scores: { L: -1, S: 1 } },
      { label: "不做选择，让命运带自己去该去的地方", scores: { L: 1, T: 1 } }
    ]
  },
  {
    id: "q12",
    title: "你认为「美」最核心的特质是？",
    options: [
      { label: "和谐与比例——黄金分割、对称、平衡", scores: { L: -1, A: -1 } },
      { label: "真实与缺陷——不完美才是真正的美", scores: { L: 1, E: 1 } },
      { label: "克制与留白——少即是多，意在言外", scores: { L: -1, S: -1 } },
      { label: "冲突与张力——对立面的碰撞产生美", scores: { L: 1, A: 1 } }
    ]
  },
  {
    id: "q13",
    title: "旅行时，你更享受哪种体验？",
    options: [
      { label: "按照攻略打卡经典景点，每一天都安排得充实有序", scores: { L: -1, T: -1 } },
      { label: "没有计划，随走随停，在巷子里迷路也很开心", scores: { L: 1, T: 1 } },
      { label: "找一个安静的地方住下来，感受当地人的日常生活", scores: { L: -1, S: -1 } },
      { label: "专挑冷门目的地，体验越独特越好", scores: { L: 1, A: 1 } }
    ]
  },
  {
    id: "q14",
    title: "如果人生是一部电影，你希望它的风格是？",
    options: [
      { label: "精心编排的史诗巨制——宏大叙事、结构完整", scores: { L: -1, E: 1 } },
      { label: "即兴拍摄的文艺片——碎片化、诗意、开放式结局", scores: { L: 1, E: -1 } },
      { label: "悬疑烧脑片——环环相扣、逻辑缜密", scores: { L: -1, A: -1 } },
      { label: "公路片——没有终点，享受过程本身", scores: { L: 1, S: -1 } }
    ]
  },
  // 第四组：能量场域 [D4]
  {
    id: "q15",
    title: "周末早上醒来，没有任何安排，你最想做的第一件事是？",
    options: [
      { label: "一个人泡一杯咖啡，安静地看书或发呆", scores: { S: -1, E: -1 } },
      { label: "打电话约朋友出去吃个 brunch", scores: { S: 1, E: 1 } },
      { label: "一个人去附近的公园或美术馆闲逛", scores: { S: -1, L: 1 } },
      { label: "组织一场即兴聚会或出行", scores: { S: 1, L: 1 } }
    ]
  },
  {
    id: "q16",
    title: "在一个派对上，你通常是？",
    options: [
      { label: "找一个安静角落，和一两个人深聊", scores: { S: -1, E: -1 } },
      { label: "全场社交，和每个人都能聊起来", scores: { S: 1, E: 1 } },
      { label: "观察人群，默默在心里给每个人写小传", scores: { S: -1, A: 1 } },
      { label: "成为气氛担当，带动大家的情绪", scores: { S: 1, T: 1 } }
    ]
  },
  {
    id: "q17",
    title: "你的创造力在什么环境下最旺盛？",
    options: [
      { label: "完全独处的深夜，万籁俱寂", scores: { S: -1, T: 1 } },
      { label: "和志同道合的人一起头脑风暴", scores: { S: 1, L: -1 } },
      { label: "在大自然中，被风声、水声包围", scores: { S: -1, L: 1 } },
      { label: "在热闹的咖啡馆或街头，周围的嘈杂反而让你专注", scores: { S: 1, A: 1 } }
    ]
  },
  {
    id: "q18",
    title: "你更认同哪种说法？",
    options: [
      { label: "\"孤独是灵魂的奢侈品\"", scores: { S: -1, L: 1 } },
      { label: "\"一个人可以走得很快，但一群人可以走得更远\"", scores: { S: 1, L: -1 } },
      { label: "\"我需要独处来充电，但也需要连接来获得意义\"", scores: { S: -1, E: -1 } },
      { label: "\"最好的作品都诞生于碰撞和对话\"", scores: { S: 1, A: 1 } }
    ]
  },
  // 第五组：时间意识 [D5]
  {
    id: "q19",
    title: "如果可以穿越到任何时代生活一年，你选择？",
    options: [
      { label: "文艺复兴时期的佛罗伦萨——见证人类美的觉醒", scores: { T: -1, A: -1 } },
      { label: "1920 年代的巴黎——爵士乐、现代主义、黄金时代", scores: { T: -1, E: 1 } },
      { label: "当下这个时代就很好——科技和创意的无限可能", scores: { T: 1, L: -1 } },
      { label: "近未来——想看看人类会变成什么样", scores: { T: 1, L: 1 } }
    ]
  },
  {
    id: "q20",
    title: "你对\"传统\"和\"创新\"的态度更接近？",
    options: [
      { label: "传统是根基，在经典中找到力量", scores: { T: -1, L: -1 } },
      { label: "尊重传统，但要赋予它新的表达", scores: { T: -1, A: 1 } },
      { label: "打破规则才能创造真正的新事物", scores: { T: 1, E: 1 } },
      { label: "传统和创新不是对立的，混搭才是最酷的", scores: { T: 1, S: 1 } }
    ]
  },
  {
    id: "q21",
    title: "选择一位最想和 TA 共进晚餐的人：",
    options: [
      { label: "达芬奇——那个横跨科学与艺术的全才", scores: { T: -1, L: -1 } },
      { label: "弗里达·卡罗——用痛苦浇灌出花朵的传奇女性", scores: { T: 1, E: 1 } },
      { label: "莫奈——在光影中捕捉转瞬即逝之美的人", scores: { T: -1, E: -1 } },
      { label: "安迪·沃霍尔——把商业变成艺术的先锋", scores: { T: 1, S: 1 } }
    ]
  },
  {
    id: "q22",
    title: "闭上眼睛，你的灵魂深处此刻浮现的是？",
    options: [
      { label: "一片宁静的湖面，倒映着天空和树木", scores: { T: -1, S: -1, E: -1 } },
      { label: "一座正在燃烧的城市废墟上，长出了一朵花", scores: { T: 1, E: 1, L: 1 } },
      { label: "星空下的旷野，你一个人站在那里，感受着宇宙的浩瀚", scores: { T: 1, S: -1, A: 1 } },
      { label: "一场盛大的庆典，所有你爱的人都在", scores: { T: -1, S: 1, E: 1 } }
    ]
  },
  // 第六组：综合交叉题 [跨维度]
  {
    id: "q23",
    title: "如果你可以拥有一种超能力，你最想要哪一种？",
    options: [
      { label: "时间暂停——把最美好的瞬间永远定格", scores: { T: -1, E: -1 } },
      { label: "情绪传递——让任何人瞬间感受到你的内心世界", scores: { E: 1, S: 1 } },
      { label: "隐身术——在不被打扰的情况下自由观察世界", scores: { S: -1, A: 1 } },
      { label: "万物对话——能听懂风、雨和树木的语言", scores: { L: 1, T: -1 } }
    ]
  },
  {
    id: "q24",
    title: "如果给你一面巨大的空白墙，你会怎么处理它？",
    options: [
      { label: "刷成纯白或浅灰色，保持干净和呼吸感", scores: { A: -1, L: -1 } },
      { label: "画一幅巨大的壁画，把整面墙变成沉浸式艺术品", scores: { A: 1, E: 1 } },
      { label: "贴满旅行照片、明信片和手写便签，做一面记忆墙", scores: { S: 1, T: -1 } },
      { label: "装一台投影仪，让它变成不断变化的动态画布", scores: { A: 1, T: 1 } }
    ]
  },
  {
    id: "q25",
    title: "你觉得什么时候的自己最真实？",
    options: [
      { label: "深夜一个人写日记或对着窗户发呆的时候", scores: { S: -1, L: 1 } },
      { label: "和最信任的人在一起、所有面具都卸下的时候", scores: { S: 1, E: 1 } },
      { label: "在工作中全神贯注、进入\"心流\"状态的时候", scores: { L: -1, A: -1 } },
      { label: "在一个完全陌生的城市街头，没有人认识你的时候", scores: { S: -1, T: 1 } }
    ]
  },
  {
    id: "q26",
    title: "选择一种你最向往的长期生活方式：",
    options: [
      { label: "在乡下有一座带花园的老房子，过四季分明的慢生活", scores: { T: -1, S: -1 } },
      { label: "住在不同国家的创意城市，每几个月换一个地方", scores: { T: 1, S: 1 } },
      { label: "在一个创意社区里，和一群志同道合的人一起共创", scores: { S: 1, L: 1 } },
      { label: "在山里或海边有一间独立工作室，偶尔进城会友", scores: { S: -1, L: 1 } }
    ]
  },
  {
    id: "q27",
    title: "当你看到一件让你震撼的艺术品，你的第一反应是？",
    options: [
      { label: "仔细研究它的技法和细节——\"这到底是怎么做到的？\"", scores: { A: -1, L: -1 } },
      { label: "感到一阵说不清的情绪涌上来——可能是感动、也可能是不安", scores: { E: 1, A: 1 } },
      { label: "想了解背后的故事和创作者的人生经历", scores: { E: -1, T: -1 } },
      { label: "立刻拍照发给朋友——\"你一定要亲眼来看这个！\"", scores: { S: 1, E: 1 } }
    ]
  },
  {
    id: "q28",
    title: "如果人生有一首专属 BGM（背景音乐），你的会是？",
    options: [
      { label: "一首悠长的大提琴独奏——深沉、绵延、穿越时光", scores: { T: -1, E: -1 } },
      { label: "一首不断变调的实验电子乐——充满惊喜和意外转折", scores: { T: 1, A: 1 } },
      { label: "一首温暖的民谣弹唱——简单、真诚、像老朋友的拥抱", scores: { L: 1, S: 1 } },
      { label: "一首史诗级交响乐——层层递进、气势磅礴", scores: { L: -1, E: 1 } }
    ]
  }
];

export interface PaintingResultData {
  id: string;
  name: string;
  nameEn: string;
  artist: string;
  artistEn: string;
  year: number | string;
  movement: string;
  vector: number[];
  bgImage: string;
  themeColor: string;
  accentColor: string;
  emoji: string;
  quote: string;
  portrait: string;
  keywords: string[];
  aestheticDna: {
    color: string;
    style: string;
    temp: string;
  };
  moments: string;
  softSpot: string;
  scenes: {
    solo: string;
    social: string;
    work: string;
    love: string;
  };
  coldKnowledge: string;
  socialQuote: string;
  ritual: string;
  playlist: string;
  movies: string;
}

export const paintingResults: Record<string, PaintingResultData> = {
  P01: {
    id: 'P01',
    name: '星月夜',
    nameEn: 'The Starry Night',
    artist: '文森特·梵高',
    artistEn: 'Vincent van Gogh',
    year: 1889,
    movement: '后印象派',
    vector: [4.5, 4.0, 4.5, 1.5, 4.5],
    bgImage: '/images/paintings/The_Starry_Night.jpg',
    themeColor: '#1a237e',
    accentColor: '#ffd54f',
    emoji: '🌌',
    quote: '我不想复制这个世界，我想让你看到我眼中的世界。',
    portrait: '你是一颗在黑夜中疯狂燃烧的星，越是孤独，越是闪耀。你的内心有一整个宇宙在旋转——情绪像漩涡般强烈、想象力如星辰般无边。',
    keywords: ['孤独的浪漫主义者', '内心戏王者', '极致感受力', '不被理解的天才感'],
    aestheticDna: {
      color: '深蓝 × 明黄的极致对比',
      style: '浓烈的、旋转的、充满动能',
      temp: '92℃ — 接近沸腾'
    },
    moments: '当你独自在深夜创作、写字或发呆时，灵感如瀑布般涌来的那一刻',
    softSpot: '虽然内心热烈，但你其实很怕别人看到你的脆弱。你用作品说话，因为语言永远不够用',
    scenes: {
      solo: '沉浸在自己的精神世界里，可以一个人待很久',
      social: '话不多但一开口就很有深度，容易被误解为高冷',
      work: '需要自由和空间，不喜欢被条条框框限制',
      love: '爱得很深很热烈，但不善于日常表达'
    },
    coldKnowledge: '梵高一生只卖出过一幅画，但《星月夜》其实是他在精神病院里透过铁栏窗看到的景象。',
    socialQuote: '我的灵魂是一幅星月夜，在最深的黑暗里，画出最亮的星',
    ritual: '深夜散步、在大自然中独处、听纯音乐或后摇',
    playlist: '后摇 / 氛围电子 / 古典钢琴即兴',
    movies: '《至爱梵高》《永恒与一日》《银翼杀手 2049》'
  },
  P02: {
    id: 'P02',
    name: '呐喊',
    nameEn: 'The Scream',
    artist: '爱德华·蒙克',
    artistEn: 'Edvard Munch',
    year: 1893,
    movement: '表现主义',
    vector: [5.0, 4.5, 4.0, 1.0, 5.0],
    bgImage: '/images/paintings/The_Scream.jpg',
    themeColor: '#b71c1c',
    accentColor: '#ff6f00',
    emoji: '😱',
    quote: '我不是在恐惧，我只是比所有人都更早听到了那个声音。',
    portrait: '你是那个能听到世界在尖叫的人。当所有人都在微笑寒暄时，你感受到的是空气中弥漫的焦虑、不安和荒诞。',
    keywords: ['高敏感灵魂', '存在主义思考者', '情绪的地震仪', '叛逆的真实'],
    aestheticDna: {
      color: '血红色天空 × 铅灰色大地',
      style: '扭曲的、夸张的、直觉性',
      temp: '99℃ — 随时可能沸腾'
    },
    moments: '当你说出了所有人想说但不敢说的那句话时；当你的焦虑变成了燃料时',
    softSpot: '你最害怕的不是世界的残酷，而是「没有人理解我看到的东西」',
    scenes: {
      solo: '在脑海里和宇宙进行哲学辩论',
      social: '要么沉默寡言，要么一语惊人',
      work: '对敷衍和虚伪零容忍，容易和「走流程」的人起冲突',
      love: '需要一个能承接你情绪深度的人，浅层关系会让你窒息'
    },
    coldKnowledge: '《呐喊》的天空可能并非想象，1883年火山大爆发产生的火山灰让欧洲天空连续数月呈现血红色。',
    socialQuote: '我的灵魂是一声呐喊，不是恐惧，是比所有人都先听到真相',
    ritual: '写日记进行情绪宣泄、看存在主义哲学、在雨天长途跋涉',
    playlist: '后朋克 / 暗潮 / 噪音摇滚',
    movies: '《搏击俱乐部》《黑天鹅》《小丑》'
  },
  P03: {
    id: 'P03',
    name: '神奈川冲浪里',
    nameEn: 'The Great Wave off Kanagawa',
    artist: '葛饰北斋',
    artistEn: 'Katsushika Hokusai',
    year: 1831,
    movement: '浮世绘',
    vector: [3.5, 3.0, 4.5, 2.0, 3.0],
    bgImage: '/images/paintings/The_Great_Wave_off_Kanagawa.jpg',
    themeColor: '#1565c0',
    accentColor: '#e8eaf6',
    emoji: '🌊',
    quote: '浪越大，我越平静。因为我知道，浪终会过去，而富士山永远在那里。',
    portrait: '你是那种站在巨浪面前不会逃跑，反而会觉得"好美啊"的人。你对生命的不确定性有一种东方式的接纳。',
    keywords: ['顺势而为的勇者', '东方美学灵魂', '动静皆宜', '敬畏自然'],
    aestheticDna: {
      color: '靛蓝 × 白沫 × 远山灰',
      style: '线条干净、构图大胆、留白禅意',
      temp: '55℃ — 温热而有力'
    },
    moments: '当你在混乱局面中保持冷静并找到解法时；当你用最简单方式表达深刻意思时',
    softSpot: '你看起来很佛系，其实你对美和秩序有很高的要求，只是不说出来',
    scenes: {
      solo: '泡茶、冥想、整理房间——在仪式感中找到秩序',
      social: '那个"存在感不强但离开了大家都会想念"的人',
      work: '不争不抢，但关键时刻总能稳住大局',
      love: '不会说甜言蜜语，但会在细节处让人安心'
    },
    coldKnowledge: '葛饰北斋70岁才创作此画，他一生改了30多次名字。',
    socialQuote: '我的灵魂是神奈川冲浪里，浪再大，心不动',
    ritual: '泡温泉或泡澡、看日式庭院、练书法或做手工',
    playlist: '日系 City Pop / 三味线 / Lo-Fi',
    movies: '《千与千寻》《入殓师》《小森林》'
  },
  P04: {
    id: 'P04',
    name: '睡莲',
    nameEn: 'Water Lilies',
    artist: '莫奈',
    artistEn: 'Claude Monet',
    year: 1906,
    movement: '印象派',
    vector: [1.5, 3.5, 4.0, 1.5, 3.0],
    bgImage: '/images/paintings/The_Water_Lilies.jpg',
    themeColor: '#4a148c',
    accentColor: '#81c784',
    emoji: '🪷',
    quote: '你不需要走遍世界，只需要足够安静，世界会来到你面前。',
    portrait: '你的灵魂是一汪春天的池塘——表面平静无波，水下却有丰富的生态在轻柔地呼吸。',
    keywords: ['微光捕手', '治愈系存在', '慢生活哲学', '安静的感受力'],
    aestheticDna: {
      color: '薰衣草紫 × 雾霾蓝 × 莲叶绿',
      style: '模糊的、氤氲的、边界消融',
      temp: '36℃ — 恒温的温暖'
    },
    moments: '当你注意到一个所有人都忽略的美好细节并分享出来时',
    softSpot: '你太容易被美打动，有时候看到一朵花或一束光就会想哭',
    scenes: {
      solo: '在花园、阳台或任何有植物的地方待很久',
      social: '最好的倾听者，你的温柔让人愿意敞开心扉',
      work: '适合需要审美和细腻观察力的工作',
      love: '需要稳定和安全感，用无数日常细节构建浪漫'
    },
    coldKnowledge: '莫奈晚年几乎失明仍坚持画睡莲，他先造了一座花园，然后画了30年。',
    socialQuote: '我的灵魂是一池睡莲，表面无波，水下自有整个宇宙',
    ritual: '逛花市、画水彩、听雨声和白噪音、做园艺',
    playlist: '法式香颂 / 钢琴小品 / 自然声景',
    movies: '《小森林》《海街日记》《你好，之华》'
  },
  P05: {
    id: 'P05',
    name: '戴珍珠耳环的少女',
    nameEn: 'Girl with a Pearl Earring',
    artist: '维米尔',
    artistEn: 'Johannes Vermeer',
    year: 1665,
    movement: '荷兰黄金时代',
    vector: [2.0, 1.0, 2.0, 1.5, 1.0],
    bgImage: '/images/paintings/Girl_with_a_Pearl_Earring.jpg',
    themeColor: '#1a237e',
    accentColor: '#fff9c4',
    emoji: '💎',
    quote: '我不需要被所有人看到，只要被对的人看到就够了。',
    portrait: '你是那种不需要说太多话，一个眼神就能让全场安静下来的人。你的美不在于张扬，而在于克制。',
    keywords: ['低调的极致主义', '沉默的磁场', '经典审美', '一眼万年'],
    aestheticDna: {
      color: '靛蓝 × 明黄 × 珍珠光泽',
      style: '精致的、克制的、恰到好处',
      temp: '28℃ — 清凉舒适'
    },
    moments: '当你不动声色地展现出你的品味或实力时',
    softSpot: '你看起来很独立强大，但其实渴望有人能穿透沉默看到你的内心',
    scenes: {
      solo: '阅读经典、品鉴咖啡、整理衣橱',
      social: '不是聚会焦点，但永远是最有质感的存在',
      work: '追求完美，宁可慢一点也不愿意凑合',
      love: '慢热但忠诚，一旦爱了就是一辈子的事'
    },
    coldKnowledge: '维米尔死后被遗忘两百年，那颗珍珠其实可能是锡制的仿品。',
    socialQuote: '我的灵魂是戴珍珠耳环的少女，不用说话，一个眼神就够了',
    ritual: '逛古着店、练字或阅读、独自品酒、整理收藏',
    playlist: '巴洛克 / 室内乐 / 爵士女声',
    movies: '《戴珍珠耳环的少女》《布达佩斯大饭店》《花样年华》'
  },
  P06: {
    id: 'P06',
    name: '吻',
    nameEn: 'The Kiss',
    artist: '克里姆特',
    artistEn: 'Gustav Klimt',
    year: 1908,
    movement: '维也纳分离派',
    vector: [4.0, 3.5, 4.5, 3.5, 3.5],
    bgImage: '/images/paintings/The_Kiss.jpg',
    themeColor: '#4e342e',
    accentColor: '#ffd700',
    emoji: '💋',
    quote: '被爱是运气，而去爱是我的才华。',
    portrait: '你是一个相信"爱是宇宙终极答案"的人。感情是你的主菜，你用金色装饰一切，相信日常值得奢华对待。',
    keywords: ['爱的信仰者', '感官主义者', '浪漫的极大化', '金色灵魂'],
    aestheticDna: {
      color: '金色 × 深红 × 翡翠绿',
      style: '装饰性的、华丽的、仪式感',
      temp: '72℃ — 壁炉般的温暖'
    },
    moments: '当你用心为爱的人准备了一场惊喜，看到对方眼中的光时',
    softSpot: '你把最好的爱都给了别人，有时候会忘记留一些给自己',
    scenes: {
      solo: '布置家居、点香薰、做精致的饭',
      social: '最会制造温暖氛围的人，让每个人都感到被重视',
      work: '需要有情感连接的工作，纯理性任务会消耗你',
      love: '全情投入型，相信爱情可以战胜一切'
    },
    coldKnowledge: '克里姆特真的在画中使用了金箔，恋人脚下其实是悬崖边缘。',
    socialQuote: '我的灵魂是一个金色的吻，相信爱本身就是最伟大的艺术',
    ritual: '逛花店、练瑜伽、看爱情电影、写手写信',
    playlist: '法式情歌 / 室内乐 / Bossa Nova',
    movies: '《请以你的名字呼狂我》《爱在三部曲》《一一》'
  },
  P07: {
    id: 'P07',
    name: '记忆的永恒',
    nameEn: 'The Persistence of Memory',
    artist: '萨尔瓦多·达利',
    artistEn: 'Salvador Dalí',
    year: 1931,
    movement: '超现实主义',
    vector: [4.0, 5.0, 2.0, 1.0, 5.0],
    bgImage: '/images/paintings/The_Persistence_of_Memory.jpg',
    themeColor: '#795548',
    accentColor: '#ff9800',
    emoji: '⏰',
    quote: '时间是软的，记忆是硬的。',
    portrait: '你的思维像达利的时钟一样柔软而扭曲——你能在常人看不到的地方发现荒诞的美，你的梦境比现实更真实。',
    keywords: ['超现实主义者', '梦境建筑师', '时间叛逆者', '荒诞美学'],
    aestheticDna: {
      color: '沙漠黄 × 柔和蓝 × 金属灰',
      style: '超现实的、流动的、悖论感',
      temp: '45℃ — 温暖而奇异'
    },
    moments: '当你用一个奇怪但精准的比喻让所有人恍然大悟时',
    softSpot: '你害怕平庸，宁愿痛苦也不愿意麻木地活着',
    scenes: {
      solo: '记录梦境、做白日梦、在荒诞中寻找意义',
      social: '总是那个说出"为什么不能这样"的人',
      work: '需要极致创意和自由度的工作',
      love: '寻找能和你一起做梦的人，现实主义者会让你窒息'
    },
    coldKnowledge: '达利说这幅画的灵感来自卡门贝尔奶酪在阳光下融化的样子。',
    socialQuote: '我的灵魂是记忆的永恒，时间可以融化，但记忆永存',
    ritual: '记录梦境、看超现实主义电影、在黄昏时分发呆',
    playlist: '实验电子 / 迷幻摇滚 / 氛围音乐',
    movies: '《记忆碎片》《盗梦空间》《红辣椒》'
  },
  P08: {
    id: 'P08',
    name: '向日葵',
    nameEn: 'Sunflowers',
    artist: '文森特·梵高',
    artistEn: 'Vincent van Gogh',
    year: 1888,
    movement: '后印象派',
    vector: [4.5, 3.5, 4.0, 2.5, 4.0],
    bgImage: '/images/paintings/Sunflowers.jpg',
    themeColor: '#f57f17',
    accentColor: '#ffeb3b',
    emoji: '🌻',
    quote: '即使知道会枯萎，我也要开得最热烈。',
    portrait: '你是那种"就算世界末日也要穿得漂亮"的人。你的生命力像向日葵一样——向着光，燃烧自己，温暖他人。',
    keywords: ['生命力的化身', '温暖传递者', '热烈而真诚', '向阳而生'],
    aestheticDna: {
      color: '金黄 × 橙红 × 深绿',
      style: '厚重的、充满生命力的、温暖的',
      temp: '85℃ — 热情如火'
    },
    moments: '当你用自己的热情点燃了周围人的时候',
    softSpot: '你总是把最好的一面给别人，有时候会忘记自己也需要被照顾',
    scenes: {
      solo: '在阳光下发呆、照顾植物、做手工',
      social: '团队的能量源泉，你在哪里哪里就亮起来',
      work: '需要创造力和人际连接的工作',
      love: '爱得很直接，不玩套路，就是纯粹的喜欢'
    },
    coldKnowledge: '梵高画向日葵是为了迎接高更的到来，他想用黄色表达友谊。',
    socialQuote: '我的灵魂是一束向日葵，向着光，燃烧自己，温暖世界',
    ritual: '晒太阳、和朋友聚餐、做手工艺品、听欢快的音乐',
    playlist: '民谣 / 独立流行 / 阳光摇滚',
    movies: '《阳光普照》《小森林》《海蒂和爷爷》'
  },
  P09: {
    id: 'P09',
    name: '蒙娜丽莎',
    nameEn: 'Mona Lisa',
    artist: '列奥纳多·达芬奇',
    artistEn: 'Leonardo da Vinci',
    year: 1503,
    movement: '文艺复兴',
    vector: [2.5, 1.5, 2.5, 2.0, 1.5],
    bgImage: '/images/paintings/Mona_Lisa.webp',
    themeColor: '#5d4037',
    accentColor: '#d7ccc8',
    emoji: '🎭',
    quote: '神秘不是刻意制造的，而是真实的人本来就有很多面。',
    portrait: '你是那种让人永远猜不透的人。你的微笑里有故事，你的沉默里有答案，你不需要解释，懂的人自然懂。',
    keywords: ['神秘主义者', '复杂多面', '永恒的魅力', '看透不说透'],
    aestheticDna: {
      color: '大地色 × 柔和绿 × 神秘褐',
      style: '柔和的、渐变的、层次丰富',
      temp: '32℃ — 恒温的神秘'
    },
    moments: '当你用一个微笑化解了所有尴尬时',
    softSpot: '你习惯了被所有人解读，但其实很少有人真正懂你',
    scenes: {
      solo: '观察人群、思考人生、保持神秘感',
      social: '永远是话题中心，但没有人真正了解你',
      work: '适合需要洞察力和策略的工作',
      love: '慢热且挑剔，一旦认定就是一生一世'
    },
    coldKnowledge: '蒙娜丽莎没有眉毛，因为当时流行拔掉眉毛以显额头宽阔。',
    socialQuote: '我的灵魂是蒙娜丽莎，神秘是我的保护色，也是我的魅力',
    ritual: '逛博物馆、读哲学、观察人性、保持优雅',
    playlist: '古典 / 爵士 / 氛围音乐',
    movies: '《达芬奇密码》《最后的晚餐》《美丽心灵》'
  },
  P10: {
    id: 'P10',
    name: '维纳斯的诞生',
    nameEn: 'The Birth of Venus',
    artist: '桑德罗·波提切利',
    artistEn: 'Sandro Botticelli',
    year: 1485,
    movement: '文艺复兴',
    vector: [2.0, 2.5, 3.0, 2.0, 1.0],
    bgImage: '/images/paintings/The_Birth_of_Venus.jpg',
    themeColor: '#e1bee7',
    accentColor: '#ffcc80',
    emoji: '🐚',
    quote: '美不是被创造出来的，而是从海里诞生的。',
    portrait: '你的灵魂像维纳斯一样——优雅、纯粹、不染尘埃。你对美有近乎信仰的执着，相信美本身就是一种力量。',
    keywords: ['美的信徒', '优雅主义者', '浪漫理想主义', '纯粹灵魂'],
    aestheticDna: {
      color: '粉紫 × 金色 × 海蓝',
      style: '流动的、优雅的、神话感',
      temp: '38℃ — 温柔而神圣'
    },
    moments: '当你用一种近乎仪式感的方式对待日常时',
    softSpot: '你对美和完美的追求有时候会让你显得不切实际',
    scenes: {
      solo: '欣赏艺术、阅读诗歌、保持优雅',
      social: '永远是最有气质的那一个',
      work: '需要审美和品味的工作',
      love: '相信灵魂伴侣，宁缺毋滥'
    },
    coldKnowledge: '维纳斯的姿势模仿了古希腊雕塑，但波提切利让她更柔美。',
    socialQuote: '我的灵魂是维纳斯的诞生，美是我的信仰，也是我的武器',
    ritual: '泡澡、敷面膜、读诗歌、欣赏艺术',
    playlist: '古典 / 氛围 / 梦幻流行',
    movies: '《绝美之城》《爱在黎明破晓前》《请以你的名字呼唤我》'
  },
  P11: {
    id: 'P11',
    name: '创造亚当',
    nameEn: 'The Creation of Adam',
    artist: '米开朗基罗',
    artistEn: 'Michelangelo',
    year: 1512,
    movement: '文艺复兴',
    vector: [3.0, 2.0, 2.5, 1.5, 1.0],
    bgImage: '/images/paintings/The_Creation_of_Adam.jpg',
    themeColor: '#5d4037',
    accentColor: '#ffab91',
    emoji: '👆',
    quote: '创造是两个灵魂之间的火花。',
    portrait: '你是那种相信"创造改变世界"的人。你的手伸向未知的领域，每一次触碰都可能诞生新的可能。',
    keywords: ['创造者', '理想主义者', '力量与美的结合', '追求永恒'],
    aestheticDna: {
      color: '大地色 × 肌肤色 × 天空蓝',
      style: '宏大的、有力的、神性的',
      temp: '42℃ — 温暖而有力'
    },
    moments: '当你完成一个从无到有的创造时',
    softSpot: '你对完美的追求有时候会让自己和身边的人都很累',
    scenes: {
      solo: '创作、思考、追求卓越',
      social: '团队的灵魂人物，能激发他人的创造力',
      work: '需要创造力和领导力的工作',
      love: '寻找能和你一起创造的人'
    },
    coldKnowledge: '上帝周围的红色披风其实是人类大脑的形状。',
    socialQuote: '我的灵魂是创造亚当，伸出手，触碰无限可能',
    ritual: '创作、参观艺术展、阅读哲学、追求卓越',
    playlist: '古典 / 史诗音乐 / 氛围音乐',
    movies: '《创世纪》《达芬奇密码》《最后的晚餐》'
  },
  P12: {
    id: 'P12',
    name: '格尔尼卡',
    nameEn: 'Guernica',
    artist: '巴勃罗·毕加索',
    artistEn: 'Pablo Picasso',
    year: 1937,
    movement: '立体主义',
    vector: [5.0, 5.0, 3.0, 2.0, 5.0],
    bgImage: '/images/paintings/Guernica.jpg',
    themeColor: '#424242',
    accentColor: '#757575',
    emoji: '💔',
    quote: '艺术不是装饰，而是武器。',
    portrait: '你是那种用艺术和表达对抗不公的人。你的灵魂里有格尔尼卡的痛苦，但更有直面真相的勇气。',
    keywords: ['社会观察者', '真相追求者', '痛苦转化者', '艺术战士'],
    aestheticDna: {
      color: '黑白灰 × 暗红 × 深蓝',
      style: '破碎的、直接的、有力量的',
      temp: '65℃ — 冷峻而炽热'
    },
    moments: '当你用作品或言论揭露真相时',
    softSpot: '你太在乎这个世界，有时候会因为无力感而痛苦',
    scenes: {
      solo: '思考社会问题、创作、阅读',
      social: '总是那个说出真相的人',
      work: '需要批判性思维和表达能力的工作',
      love: '寻找有同样社会责任感的伴侣'
    },
    coldKnowledge: '毕加索拒绝让这幅画回到西班牙，直到独裁者佛朗哥去世。',
    socialQuote: '我的灵魂是格尔尼卡，痛苦是我的颜料，真相是我的画布',
    ritual: '关注社会议题、创作、阅读、思考',
    playlist: '后朋克 / 工业 / 实验音乐',
    movies: '《格尔尼卡》《潘神的迷宫》《末代独裁者》'
  },
  P13: {
    id: 'P13',
    name: '自由引导人民',
    nameEn: 'Liberty Leading the People',
    artist: '欧仁·德拉克洛瓦',
    artistEn: 'Eugène Delacroix',
    year: 1830,
    movement: '浪漫主义',
    vector: [4.5, 3.0, 3.5, 3.0, 4.5],
    bgImage: '/images/paintings/Liberty_Leading_the_People.jpg',
    themeColor: '#c62828',
    accentColor: '#ffeb3b',
    emoji: '🚩',
    quote: '自由不是被给予的，而是被争取的。',
    portrait: '你是那种愿意为理想而战的人。你的灵魂里有德拉克洛瓦的浪漫，但更有行动的勇气。',
    keywords: ['理想主义者', '行动派', '浪漫革命者', '自由灵魂'],
    aestheticDna: {
      color: '红白蓝 × 烟雾灰 × 大地色',
      style: '动态的、史诗的、充满激情',
      temp: '78℃ — 热血沸腾'
    },
    moments: '当你为理想而行动时',
    softSpot: '你的理想主义有时候会让你和现实格格不入',
    scenes: {
      solo: '思考理想、规划行动、保持激情',
      social: '团队的领袖，能激励他人',
      work: '需要领导力和理想主义的工作',
      love: '寻找有同样理想的伴侣'
    },
    coldKnowledge: '画中的自由女神其实是德拉克洛瓦的邻居。',
    socialQuote: '我的灵魂是自由引导人民，为理想而战，永不妥协',
    ritual: '参与社会活动、阅读历史、保持激情',
    playlist: '摇滚 / 独立音乐 / 史诗音乐',
    movies: '《悲惨世界》《自由万岁》《勇敢的心》'
  },
  P14: {
    id: 'P14',
    name: '夜游者',
    nameEn: 'Nighthawks',
    artist: '爱德华·霍普',
    artistEn: 'Edward Hopper',
    year: 1942,
    movement: '美国现实主义',
    vector: [2.5, 2.0, 3.0, 1.0, 3.5],
    bgImage: '/images/paintings/Nighthawks.jpg',
    themeColor: '#37474f',
    accentColor: '#ffcc80',
    emoji: '🌃',
    quote: '城市最孤独的时候，是凌晨三点的咖啡馆。',
    portrait: '你是那种能在城市孤独中找到诗意的人。你的灵魂像夜游者的咖啡馆——安静、温暖、但永远有点距离。',
    keywords: ['城市诗人', '孤独观察者', '都市浪漫主义', '温暖的疏离'],
    aestheticDna: {
      color: '深蓝 × 暖黄 × 玻璃反光',
      style: '干净的、几何的、电影感',
      temp: '40℃ — 温暖而疏离'
    },
    moments: '当你在深夜的城市里找到属于自己的角落时',
    softSpot: '你享受孤独，但有时候也会害怕永远找不到懂你的人',
    scenes: {
      solo: '深夜散步、观察城市、在咖啡馆发呆',
      social: '不是社交达人，但和少数人关系很深',
      work: '需要独立思考和观察力的工作',
      love: '慢热，寻找灵魂伴侣'
    },
    coldKnowledge: '霍普说这幅画是关于"城市里的孤独"。',
    socialQuote: '我的灵魂是夜游者，在城市的角落，寻找属于自己的光',
    ritual: '深夜散步、逛便利店、观察城市、听爵士乐',
    playlist: '爵士 / 氛围 / 城市流行',
    movies: '《迷失东京》《午夜巴黎》《她》'
  },
  P15: {
    id: 'P15',
    name: '撑阳伞的女人',
    nameEn: 'Woman with a Parasol',
    artist: '克劳德·莫奈',
    artistEn: 'Claude Monet',
    year: 1875,
    movement: '印象派',
    vector: [2.0, 3.0, 3.5, 2.0, 2.5],
    bgImage: '/images/paintings/Woman_with_a_Parasol.jpg',
    themeColor: '#81d4fa',
    accentColor: '#ffeb3b',
    emoji: '☂️',
    quote: '风在吹，草在动，我在这里，就很美。',
    portrait: '你是那种能在平凡中找到诗意的人。你的灵魂像撑阳伞的女人——轻盈、自由、随风而动。',
    keywords: ['轻盈灵魂', '自然之子', '随性浪漫', '简单美好'],
    aestheticDna: {
      color: '天蓝 × 草绿 × 阳光黄',
      style: '轻盈的、流动的、光影感',
      temp: '35℃ — 温暖而轻盈'
    },
    moments: '当你在自然中感到完全放松时',
    softSpot: '你太随性，有时候会让人觉得不够靠谱',
    scenes: {
      solo: '在自然中散步、拍照、发呆',
      social: '轻松愉快，让人感到舒服',
      work: '需要自由和创造力的工作',
      love: '轻松自然，不需要太多压力'
    },
    coldKnowledge: '画中的女人是莫奈的妻子和儿子。',
    socialQuote: '我的灵魂是撑阳伞的女人，随风而动，自在如风',
    ritual: '户外活动、拍照、亲近自然、听轻音乐',
    playlist: '民谣 / 轻音乐 / 自然声景',
    movies: '《小森林》《海街日记》《怦然心动》'
  },
  P16: {
    id: 'P16',
    name: '亚维农的少女',
    nameEn: 'Les Demoiselles',
    artist: '巴勃罗·毕加索',
    artistEn: 'Pablo Picasso',
    year: 1907,
    movement: '立体主义',
    vector: [4.5, 5.0, 2.5, 2.5, 5.0],
    bgImage: '/images/paintings/Les_Demoiselles.jpg',
    themeColor: '#795548',
    accentColor: '#ff7043',
    emoji: '🎭',
    quote: '打破规则，才能看到新的世界。',
    portrait: '你是那种敢于打破常规的人。你的灵魂像亚维农的少女——大胆、前卫、不按常理出牌。',
    keywords: ['规则破坏者', '前卫先锋', '视觉革命者', '不妥协'],
    aestheticDna: {
      color: '大地色 × 蓝色 × 粉色',
      style: '破碎的、多视角的、革命性',
      temp: '70℃ — 热烈而前卫'
    },
    moments: '当你用全新的方式解决一个老问题时',
    softSpot: '你的前卫有时候会让你和主流格格不入',
    scenes: {
      solo: '思考创新、实验、挑战自己',
      social: '总是那个提出不同观点的人',
      work: '需要创新和突破的工作',
      love: '寻找能理解你前卫思维的人'
    },
    coldKnowledge: '这幅画被认为是第一幅立体主义作品，当时震惊了整个艺术界。',
    socialQuote: '我的灵魂是亚维农的少女，打破规则，创造新世界',
    ritual: '实验、创新、挑战自己、看当代艺术',
    playlist: '实验音乐 / 前卫电子 / 噪音',
    movies: '《毕加索的秘密》《午夜巴黎》《天才》'
  },
  P17: {
    id: 'P17',
    name: '雅典学院',
    nameEn: 'The School of Athens',
    artist: '拉斐尔',
    artistEn: 'Raphael',
    year: 1511,
    movement: '文艺复兴',
    vector: [2.5, 1.5, 2.0, 2.5, 1.0],
    bgImage: '/images/paintings/The_School_of_Athens.jpg',
    themeColor: '#5d4037',
    accentColor: '#ffcc80',
    emoji: '🏛️',
    quote: '智慧不是一个人的事，而是一群人的对话。',
    portrait: '你是那种相信"集体智慧"的人。你的灵魂像雅典学院——理性、和谐、追求真理。',
    keywords: ['理性主义者', '和谐追求者', '知识爱好者', '平衡大师'],
    aestheticDna: {
      color: '大地色 × 金色 × 天空蓝',
      style: '和谐的、理性的、古典美',
      temp: '45℃ — 温暖而理性'
    },
    moments: '当你组织一场有意义的对话时',
    softSpot: '你太追求和谐，有时候会回避冲突',
    scenes: {
      solo: '阅读、思考、追求知识',
      social: '团队的协调者，能平衡不同观点',
      work: '需要理性和协调能力的工作',
      love: '寻找能和你一起成长的伴侣'
    },
    coldKnowledge: '画中的柏拉图其实是达芬奇的自画像。',
    socialQuote: '我的灵魂是雅典学院，在对话中寻找真理',
    ritual: '阅读、参加讲座、讨论、追求知识',
    playlist: '古典 / 室内乐 / 智慧音乐',
    movies: '《美丽心灵》《社交网络》《模仿游戏》'
  },
  P18: {
    id: 'P18',
    name: '红、黄、蓝的构成',
    nameEn: 'Composition with Red, Blue and Yellow',
    artist: '皮特·蒙德里安',
    artistEn: 'Piet Mondrian',
    year: 1930,
    movement: '风格派',
    vector: [2.0, 5.0, 1.5, 1.5, 4.5],
    bgImage: '/images/paintings/Composition_with_Red,_Blue_and_Yellow.jpg',
    themeColor: '#ffffff',
    accentColor: '#ff0000',
    emoji: '🔲',
    quote: '少即是多，简单就是终极的复杂。',
    portrait: '你是那种相信"极简即美"的人。你的灵魂像蒙德里安的画——干净、理性、追求本质。',
    keywords: ['极简主义者', '理性美学', '本质追求者', '秩序大师'],
    aestheticDna: {
      color: '白 × 黑 × 红黄蓝',
      style: '几何的、极简的、纯粹',
      temp: '25℃ — 清凉而理性'
    },
    moments: '当你用最简单的方式解决复杂问题时',
    softSpot: '你的极简有时候会被误解为冷漠',
    scenes: {
      solo: '整理、规划、追求秩序',
      social: '话不多，但每次都说到点子上',
      work: '需要逻辑和秩序的工作',
      love: '简单直接，不喜欢复杂'
    },
    coldKnowledge: '蒙德里安一生都在画格子，但每幅画都有细微差别。',
    socialQuote: '我的灵魂是红黄蓝的构成，在简单中寻找无限',
    ritual: '整理、规划、极简生活、追求秩序',
    playlist: '极简电子 / 氛围 / 白噪音',
    movies: '《极简主义》《设计面面观》《建筑大师》'
  },
  P19: {
    id: 'P19',
    name: '两个弗里达',
    nameEn: 'The Two Fridas',
    artist: '弗里达·卡罗',
    artistEn: 'Frida Kahlo',
    year: 1939,
    movement: '超现实主义',
    vector: [4.5, 3.5, 3.0, 2.0, 4.5],
    bgImage: '/images/paintings/The_Two_Fridas.jpg',
    themeColor: '#4a148c',
    accentColor: '#ffeb3b',
    emoji: '👯',
    quote: '我画自画像，因为我经常独自一人，因为我是我最了解的主题。',
    portrait: '你是那种能拥抱自己矛盾的人。你的灵魂像两个弗里达——脆弱与坚强、传统与现代、痛苦与美丽共存。',
    keywords: ['矛盾统一者', '痛苦转化者', '自我探索者', '真实勇士'],
    aestheticDna: {
      color: '深紫 × 白 × 红',
      style: '直接的、象征的、充满力量',
      temp: '60℃ — 温暖而复杂'
    },
    moments: '当你接纳自己的不完美时',
    softSpot: '你太真实，有时候会让自己受伤',
    scenes: {
      solo: '自我探索、创作、面对自己',
      social: '真实不做作，吸引同样真实的人',
      work: '需要表达和创造的工作',
      love: '寻找能接纳你全部的人'
    },
    coldKnowledge: '这幅画是弗里达和迭戈·里维拉离婚后画的，表达了她的痛苦。',
    socialQuote: '我的灵魂是两个弗里达，拥抱矛盾，成为完整的自己',
    ritual: '自我探索、创作、面对自己、接纳不完美',
    playlist: '拉丁音乐 / 民谣 / 女声独立',
    movies: '《弗里达》《痛苦与荣耀》《月光男孩》'
  },
  P20: {
    id: 'P20',
    name: '倒牛奶的女仆',
    nameEn: 'The Milkmaid',
    artist: '约翰内斯·维米尔',
    artistEn: 'Johannes Vermeer',
    year: 1658,
    movement: '荷兰黄金时代',
    vector: [1.5, 1.5, 2.0, 1.0, 1.0],
    bgImage: '/images/paintings/The_Milkmaid.png',
    themeColor: '#795548',
    accentColor: '#fff9c4',
    emoji: '🥛',
    quote: '平凡中自有神圣。',
    portrait: '你是那种能在日常中找到神圣感的人。你的灵魂像倒牛奶的女仆——专注、安静、在平凡中创造美。',
    keywords: ['日常诗人', '专注者', '平凡之美', '静默力量'],
    aestheticDna: {
      color: '大地色 × 暖黄 × 柔和蓝',
      style: '安静的、精致的、日常美',
      temp: '30℃ — 温暖而安静'
    },
    moments: '当你专注做好一件小事时',
    softSpot: '你太安静，有时候会被忽略',
    scenes: {
      solo: '做手工、烹饪、享受日常',
      social: '不是焦点，但让人安心',
      work: '需要专注和细节的工作',
      love: '简单温暖，日常即浪漫'
    },
    coldKnowledge: '维米尔用了当时最昂贵的颜料——群青。',
    socialQuote: '我的灵魂是倒牛奶的女仆，在平凡中创造神圣',
    ritual: '烹饪、做手工、享受日常、专注当下',
    playlist: '古典 / 民谣 / 轻音乐',
    movies: '《小森林》《海街日记》《饮食男女》'
  },
  P21: {
    id: 'P21',
    name: '宫娥',
    nameEn: 'Las Meninas',
    artist: '迭戈·委拉斯开兹',
    artistEn: 'Diego Velázquez',
    year: 1656,
    movement: '巴洛克',
    vector: [2.5, 2.0, 2.5, 2.5, 1.5],
    bgImage: '/images/paintings/Las_Meninas.jpg',
    themeColor: '#5d4037',
    accentColor: '#ffcc80',
    emoji: '👑',
    quote: '每个人都是自己故事的主角，也是别人故事里的配角。',
    portrait: '你是那种能看到多重视角的人。你的灵魂像宫娥——复杂、多面、在真实与虚构之间游走。',
    keywords: ['多重视角', '观察者', '复杂思考者', '真相追求者'],
    aestheticDna: {
      color: '大地色 × 金色 × 深红',
      style: '复杂的、多层次的、哲学性',
      temp: '48℃ — 温暖而复杂'
    },
    moments: '当你从不同角度理解一个问题后',
    softSpot: '你想得太多，有时候会陷入分析瘫痪',
    scenes: {
      solo: '观察、思考、分析',
      social: '能看到别人看不到的角度',
      work: '需要洞察力和分析能力的工作',
      love: '寻找能和你深度对话的人'
    },
    coldKnowledge: '这幅画被认为是"绘画的绘画"，探讨了观看的本质。',
    socialQuote: '我的灵魂是宫娥，在多重视角中寻找真相',
    ritual: '观察、思考、分析、阅读哲学',
    playlist: '古典 / 爵士 / 氛围音乐',
    movies: '《盗梦空间》《记忆碎片》《禁闭岛》'
  },
  P22: {
    id: 'P22',
    name: '大碗岛的星期天下午',
    nameEn: 'A Sunday Afternoon on the Island of La Grande Jatte',
    artist: '乔治·修拉',
    artistEn: 'Georges Seurat',
    year: 1886,
    movement: '点彩派',
    vector: [2.0, 3.5, 3.0, 2.0, 2.5],
    bgImage: '/images/paintings/A_Sunday_Afternoon_on_the_Island_of_La_Grande_Jatte.jpg',
    themeColor: '#81c784',
    accentColor: '#ffeb3b',
    emoji: '🎨',
    quote: '美是由无数个点组成的。',
    portrait: '你是那种相信"细节决定成败"的人。你的灵魂像大碗岛的星期天下午——由无数个点组成一个完整的世界。',
    keywords: ['细节大师', '耐心者', '系统思考者', '完美主义者'],
    aestheticDna: {
      color: '绿 × 黄 × 蓝',
      style: '点彩的、系统的、和谐',
      temp: '38℃ — 温暖而有序'
    },
    moments: '当你完成一个需要长期坚持的项目时',
    softSpot: '你的完美主义有时候会让你很累',
    scenes: {
      solo: '规划、执行、追求完美',
      social: '团队的细节控，能发现别人忽略的问题',
      work: '需要耐心和细节的工作',
      love: '稳定可靠，但需要对方理解你的完美主义'
    },
    coldKnowledge: '修拉花了两年时间画这幅画，用了数百万个点。',
    socialQuote: '我的灵魂是大碗岛的星期天下午，由无数个点组成完美的世界',
    ritual: '规划、执行、追求完美、享受过程',
    playlist: '古典 / 氛围 / 轻音乐',
    movies: '《点彩派》《周日午后》《美丽人生》'
  }
};

// 维度得分范围映射逻辑
export const DIMENSION_RANGES: Record<string, { min: number, max: number }> = {
  E: { min: -13, max: 13 },
  A: { min: -13, max: 13 },
  L: { min: -11, max: 11 },
  S: { min: -12, max: 12 },
  T: { min: -12, max: 12 }
};

export const DIMENSION_LABELS: Record<string, { low: string, high: string }> = {
  E: { low: "🌊 内敛沉静", high: "🔥 热烈奔放" },
  A: { low: "📐 写实精致", high: "🌀 抽象表现" },
  L: { low: "⚖️ 理性秩序", high: "🦋 感性自由" },
  S: { low: "🌙 独处内省", high: "☀️ 群体共鸣" },
  T: { low: "🏛️ 怀旧经典", high: "🚀 当下先锋" }
};

/**
 * 计算余弦相似度
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let mA = 0;
  let mB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    mA += vecA[i] * vecA[i];
    mB += vecB[i] * vecB[i];
  }
  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  return dotProduct / (mA * mB);
}

/**
 * 根据用户回答计算 5 维向量并匹配名画
 */
export function calculatePaintingResult(answers: number[]) {
  const rawScores: Record<string, number> = { E: 0, A: 0, L: 0, S: 0, T: 0 };
  
  answers.forEach((choiceIndex, qIndex) => {
    const scores = paintingQuestions[qIndex].options[choiceIndex].scores;
    Object.entries(scores).forEach(([dim, val]) => {
      rawScores[dim] += val;
    });
  });

  // 归一化到 [1, 5]
  const userVector = ['E', 'A', 'L', 'S', 'T'].map(dim => {
    const { min, max } = DIMENSION_RANGES[dim];
    const raw = rawScores[dim];
    const clamped = Math.max(min, Math.min(max, raw));
    return ((clamped - min) / (max - min)) * 4 + 1;
  });

  // 匹配名画
  const sortedResults = Object.values(paintingResults).map(p => {
    const sim = cosineSimilarity(userVector, p.vector);
    return {
      ...p,
      similarity: sim,
      matchPercent: Math.round(sim * 100)
    };
  }).sort((a, b) => b.similarity - a.similarity);

  return {
    userVector,
    primary: sortedResults[0],
    similar: sortedResults.slice(1, 4),
    all: sortedResults
  };
}

// 补充名画相似关系描述逻辑
export const PAINTING_RELATIONS: Record<string, string> = {
  'P01-P02': '同样极致的情绪敏感度，但你选择用美来化解',
  'P01-P08': '都是梵高的灵魂碎片——星空是夜晚的你，向日葵是白天的你',
  'P01-P07': '同样在孤独中创造宇宙，你更热烈，达利更冷峻',
  'P02-P12': '都用艺术对抗痛苦，蒙克向内呐喊，毕加索向外控诉',
  'P03-P04': '同样的东方禅意底色，神奈川是动态的平衡，睡莲是静态的和谐',
  'P03-P15': '同样与自然共生，但北斋面对巨浪，莫奈追逐微风',
  'P04-P15': '莫奈的两面——睡莲是你冥想的一面，阳伞是你轻盈的一面',
  'P05-P13': '同样的古典克制与神秘感，珍珠少女更纯粹，蒙娜丽莎更复杂',
  'P05-P10': '同样对经典美的信仰，维米尔更内敛，波提切利更浪漫',
  'P06-P08': '同样热烈地爱着生活，吻是爱人，向日葵是爱万物',
  'P06-P10': '同样相信美和爱的力量，克里姆特更世俗热烈，波提切利更神圣空灵',
};

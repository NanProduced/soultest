export interface SoulCityQuestion {
  id: number
  title: string
  options: {
    label: string
    scores: {
      R: number // 节奏
      A: number // 审美
      S: number // 社交
      O: number // 秩序
      E: number // 情感
    }
  }[]
}

export interface SoulCityResult {
  key: string
  name: string
  alias: string
  emoji: string
  description: string
  tagline: string
  keywords: string[]
  portrait: string
  interpretation: string
  fiveDimension: {
    R: number
    A: number
    S: number
    O: number
    E: number
  }
  personality: string
  travelTip: string
  bestMatch: string
  oppositeMatch: string
  imageGradient: string
  bgGradient: string
  shadowColor: string
  textColor: string
}

export const soulCityQuestions: SoulCityQuestion[] = [
  // Chapter 1: 觉醒 · 清晨的第一缕光 (Q1-Q6)
  {
    id: 1,
    title: "理想的早晨，你最希望被什么唤醒？",
    options: [
      { label: "窗外淅淅沥沥的雨声，空气里有湿润的青草味", scores: { R: 0, A: 2, S: 0, O: 1, E: 3 } },
      { label: "街角咖啡机的嗡嗡声，混着现磨咖啡豆的香气", scores: { R: 2, A: 3, S: 1, O: 2, E: 1 } },
      { label: "远处传来的电车叮当声，阳光穿过百叶窗", scores: { R: 2, A: 2, S: 1, O: 3, E: 2 } },
      { label: "闹钟响了三次才起，反正今天也没什么非做不可的事", scores: { R: 0, A: 0, S: 1, O: 0, E: 1 } }
    ]
  },
  {
    id: 2,
    title: "推开窗户，你最想看到的风景是？",
    options: [
      { label: "层层叠叠的屋顶和远处的山脉轮廓", scores: { R: 0, A: 2, S: 0, O: 1, E: 3 } },
      { label: "整齐排列的行道树和骑车上班的人群", scores: { R: 2, A: 1, S: 1, O: 3, E: 0 } },
      { label: "高楼之间透出的天际线，霓虹灯还没完全熄灭", scores: { R: 3, A: 1, S: 2, O: 1, E: 2 } },
      { label: "一条安静的巷子，墙上爬满了藤蔓和涂鸦", scores: { R: 0, A: 3, S: 0, O: 0, E: 2 } }
    ]
  },
  {
    id: 3,
    title: "出门前你会花多长时间准备？",
    options: [
      { label: "精心搭配每一个细节，出门是一种仪式感", scores: { R: 1, A: 3, S: 1, O: 2, E: 2 } },
      { label: "简单高效，10 分钟内搞定一切", scores: { R: 3, A: 1, S: 1, O: 3, E: 0 } },
      { label: "看心情，有时候精致有时候随意", scores: { R: 1, A: 1, S: 1, O: 0, E: 1 } },
      { label: "几乎不花时间，舒服最重要", scores: { R: 0, A: 0, S: 1, O: 0, E: 1 } }
    ]
  },
  {
    id: 4,
    title: "早餐你会选择？",
    options: [
      { label: "一份精致的可颂配拿铁，在露天咖啡座坐一会儿", scores: { R: 1, A: 3, S: 1, O: 1, E: 2 } },
      { label: "一碗热气腾腾的当地特色小吃，在街边站着吃完", scores: { R: 2, A: 1, S: 2, O: 1, E: 2 } },
      { label: "自己做一份简单的早餐，享受安静的厨房时光", scores: { R: 0, A: 1, S: 0, O: 2, E: 1 } },
      { label: "随便抓一个便利店饭团，边走边吃", scores: { R: 2, A: 0, S: 1, O: 1, E: 0 } }
    ]
  },
  {
    id: 5,
    title: "如果这一天完全属于你，你最想做的第一件事是？",
    options: [
      { label: "去一家从没去过的美术馆或展览", scores: { R: 1, A: 3, S: 0, O: 1, E: 2 } },
      { label: "找一条从没走过的小巷子，漫无目的地散步", scores: { R: 1, A: 2, S: 0, O: 0, E: 2 } },
      { label: "约朋友去一个新开的餐厅或酒吧", scores: { R: 2, A: 1, S: 3, O: 0, E: 2 } },
      { label: "什么都不做，在阳台上发呆到中午", scores: { R: 0, A: 1, S: 0, O: 0, E: 1 } }
    ]
  },
  {
    id: 6,
    title: "你觉得一座城市最迷人的时刻是？",
    options: [
      { label: "华灯初上的傍晚，整座城市开始切换成另一种模式", scores: { R: 2, A: 2, S: 2, O: 1, E: 3 } },
      { label: "清晨无人的街道，只有你和这座城市独处", scores: { R: 0, A: 2, S: 0, O: 2, E: 2 } },
      { label: "深夜两三点，还有一盏灯为你亮着的时候", scores: { R: 2, A: 1, S: 1, O: 0, E: 3 } },
      { label: "午后阳光最好的时候，时间仿佛停了下来", scores: { R: 0, A: 2, S: 0, O: 1, E: 1 } }
    ]
  },
  // Chapter 2: 漫步 · 走进这座城 (Q7-Q12)
  {
    id: 7,
    title: "在一座陌生城市，你会怎么探索它？",
    options: [
      { label: "先找一家当地人常去的咖啡馆坐下来观察", scores: { R: 0, A: 2, S: 2, O: 2, E: 1 } },
      { label: "打开地图，把所有地标景点规划好路线", scores: { R: 2, A: 1, S: 0, O: 3, E: 0 } },
      { label: "随便挑一个方向走，迷路也是旅行的一部分", scores: { R: 1, A: 2, S: 0, O: 0, E: 3 } },
      { label: "找当地人搭话，让他们带你去真正好玩的地方", scores: { R: 1, A: 1, S: 3, O: 0, E: 2 } }
    ]
  },
  {
    id: 8,
    title: "走在街上，最先吸引你注意力的是？",
    options: [
      { label: "建筑物的线条和色彩搭配", scores: { R: 1, A: 3, S: 0, O: 2, E: 1 } },
      { label: "空气中飘来的食物香气", scores: { R: 1, A: 1, S: 1, O: 1, E: 2 } },
      { label: "路人的穿着打扮和表情", scores: { R: 1, A: 1, S: 2, O: 1, E: 2 } },
      { label: "街头音乐家的表演或墙上的艺术涂鸦", scores: { R: 1, A: 3, S: 1, O: 0, E: 2 } }
    ]
  },
  {
    id: 9,
    title: "你更喜欢什么样的街道？",
    options: [
      { label: "宽阔整洁的林荫大道，两旁是精心修剪的绿植", scores: { R: 1, A: 2, S: 1, O: 3, E: 1 } },
      { label: "狭窄蜿蜒的小巷，转角可能遇到惊喜", scores: { R: 1, A: 2, S: 0, O: 1, E: 3 } },
      { label: "热闹拥挤的夜市街，到处都是叫卖声和笑声", scores: { R: 3, A: 1, S: 3, O: 0, E: 2 } },
      { label: "安静的住宅区街道，偶尔有猫咪在墙角晒太阳", scores: { R: 0, A: 1, S: 0, O: 1, E: 1 } }
    ]
  },
  {
    id: 10,
    title: "如果要买一件旅行纪念品，你会选择？",
    options: [
      { label: "一件当地手工艺人制作的精美物件", scores: { R: 0, A: 3, S: 0, O: 2, E: 2 } },
      { label: "一张有故事感的明信片或老照片", scores: { R: 1, A: 2, S: 0, O: 1, E: 2 } },
      { label: "一包当地特色食材或调味料，回家自己做", scores: { R: 0, A: 1, S: 1, O: 2, E: 1 } },
      { label: "不买纪念品，拍照和记忆就是最好的纪念", scores: { R: 1, A: 1, S: 0, O: 0, E: 1 } }
    ]
  },
  {
    id: 11,
    title: "你在旅途中最享受的交通方式是？",
    options: [
      { label: "骑自行车穿过城市的大街小巷", scores: { R: 2, A: 2, S: 1, O: 1, E: 1 } },
      { label: "坐在老式有轨电车上看窗外的风景", scores: { R: 1, A: 2, S: 1, O: 2, E: 2 } },
      { label: "步行，用脚步丈量每一寸土地", scores: { R: 0, A: 1, S: 0, O: 1, E: 2 } },
      { label: "坐地铁或出租车，快速穿梭到下一个目的地", scores: { R: 3, A: 0, S: 1, O: 2, E: 0 } }
    ]
  },
  {
    id: 12,
    title: "旅行中遇到语言不通的情况，你会？",
    options: [
      { label: "用肢体语言和微笑沟通，觉得这很有趣", scores: { R: 1, A: 1, S: 2, O: 0, E: 3 } },
      { label: "提前学好基础用语，做好充分准备", scores: { R: 1, A: 1, S: 0, O: 3, E: 0 } },
      { label: "打开翻译 APP，高效解决问题", scores: { R: 2, A: 0, S: 0, O: 2, E: 0 } },
      { label: "专挑英语通用的地方，减少沟通障碍", scores: { R: 1, A: 0, S: 1, O: 2, E: 0 } }
    ]
  },
  // Chapter 3: 相遇 · 与城市里的人 (Q13-Q18)
  {
    id: 13,
    title: "在一场当地人的聚会上，你通常会？",
    options: [
      { label: "成为全场焦点，和每个人都聊上几句", scores: { R: 3, A: 1, S: 3, O: 0, E: 2 } },
      { label: "找到一两个聊得来的人，深入交谈", scores: { R: 1, A: 1, S: 2, O: 2, E: 2 } },
      { label: "安静地待在角落观察，享受氛围就好", scores: { R: 0, A: 1, S: 0, O: 1, E: 1 } },
      { label: "主动帮忙张罗食物和饮料，用行动融入", scores: { R: 1, A: 1, S: 2, O: 2, E: 1 } }
    ]
  },
  {
    id: 14,
    title: "你理想中的邻居关系是？",
    options: [
      { label: "互相认识，经常串门吃饭的亲密关系", scores: { R: 1, A: 1, S: 3, O: 1, E: 2 } },
      { label: "点头微笑的礼貌距离，偶尔帮收快递", scores: { R: 1, A: 1, S: 1, O: 3, E: 1 } },
      { label: "完全不认识也没关系，各过各的", scores: { R: 0, A: 0, S: 0, O: 1, E: 0 } },
      { label: "偶尔在楼下咖啡馆碰到，聊几句日常", scores: { R: 1, A: 1, S: 2, O: 1, E: 2 } }
    ]
  },
  {
    id: 15,
    title: "一个周末晚上，你最想怎么度过？",
    options: [
      { label: "和一群朋友在居酒屋或小酒馆里畅聊到深夜", scores: { R: 3, A: 1, S: 3, O: 0, E: 3 } },
      { label: "和伴侣或闺蜜看一场文艺电影，然后讨论到凌晨", scores: { R: 1, A: 2, S: 1, O: 1, E: 2 } },
      { label: "一个人窝在沙发上，看书或追剧，谁也不想见", scores: { R: 0, A: 1, S: 0, O: 1, E: 1 } },
      { label: "参加一个陌生人的活动或派对，认识新朋友", scores: { R: 2, A: 1, S: 3, O: 0, E: 2 } }
    ]
  },
  {
    id: 16,
    title: "你觉得最有魅力的人是什么样的？",
    options: [
      { label: "有强烈个人风格、不随波逐流的人", scores: { R: 1, A: 3, S: 1, O: 1, E: 2 } },
      { label: "温暖体贴、让人感到安心的人", scores: { R: 0, A: 1, S: 2, O: 2, E: 2 } },
      { label: "聪明高效、目标明确的人", scores: { R: 2, A: 1, S: 1, O: 3, E: 0 } },
      { label: "自由洒脱、活在当下的人", scores: { R: 1, A: 2, S: 1, O: 0, E: 3 } }
    ]
  },
  {
    id: 17,
    title: "如果一位陌生人在街上向你问路，你会？",
    options: [
      { label: "热情地带他走一段，顺便聊聊天", scores: { R: 1, A: 1, S: 3, O: 1, E: 3 } },
      { label: "详细指完路后礼貌地告别", scores: { R: 1, A: 1, S: 1, O: 2, E: 1 } },
      { label: "用手机帮他导航，确保他不会再迷路", scores: { R: 1, A: 0, S: 1, O: 3, E: 0 } },
      { label: "大致指个方向，鼓励他自己探索", scores: { R: 1, A: 1, S: 0, O: 0, E: 2 } }
    ]
  },
  {
    id: 18,
    title: "你在一段关系中最看重什么？",
    options: [
      { label: "深度的精神共鸣，能聊哲学也能聊八卦", scores: { R: 0, A: 2, S: 1, O: 1, E: 3 } },
      { label: "稳定的陪伴感，不需要太多戏剧性", scores: { R: 0, A: 1, S: 2, O: 3, E: 1 } },
      { label: "彼此独立又互相欣赏的自由空间", scores: { R: 1, A: 1, S: 1, O: 1, E: 1 } },
      { label: "充满激情和惊喜，永远不会无聊", scores: { R: 3, A: 1, S: 2, O: 0, E: 3 } }
    ]
  },
  // Chapter 4: 沉浸 · 生活的质感 (Q19-Q24)
  {
    id: 19,
    title: "你理想中的家是什么样的？",
    options: [
      { label: "市中心的小公寓，推开门就是整座城市", scores: { R: 3, A: 2, S: 1, O: 1, E: 2 } },
      { label: "有庭院的老房子，种满花草，养一只猫", scores: { R: 0, A: 2, S: 1, O: 2, E: 2 } },
      { label: "极简风格的现代公寓，一切井然有序", scores: { R: 1, A: 2, S: 0, O: 3, E: 0 } },
      { label: "充满收藏品和旅行纪念的波西米亚风空间", scores: { R: 1, A: 3, S: 1, O: 0, E: 2 } }
    ]
  },
  {
    id: 20,
    title: "你最喜欢的季节和天气是？",
    options: [
      { label: "四季分明，每个季节都有独特的仪式感", scores: { R: 1, A: 2, S: 1, O: 2, E: 2 } },
      { label: "永远的夏天，阳光和热度让人充满活力", scores: { R: 3, A: 1, S: 2, O: 1, E: 2 } },
      { label: "微凉的秋天，穿风衣走在落叶里", scores: { R: 1, A: 2, S: 0, O: 1, E: 2 } },
      { label: "阴天或小雨，适合窝在室内做自己的事", scores: { R: 0, A: 1, S: 0, O: 1, E: 1 } }
    ]
  },
  {
    id: 21,
    title: "对于美食，你的态度是？",
    options: [
      { label: "热爱探索各种料理，越陌生越想尝试", scores: { R: 2, A: 2, S: 1, O: 1, E: 3 } },
      { label: "偏好精致摆盘和独特口味，吃饭也是一种审美体验", scores: { R: 1, A: 3, S: 0, O: 2, E: 1 } },
      { label: "好吃就行，街边摊和米其林都能让我满足", scores: { R: 1, A: 1, S: 1, O: 1, E: 1 } },
      { label: "更在乎和谁一起吃，食物本身没那么重要", scores: { R: 1, A: 0, S: 2, O: 1, E: 2 } }
    ]
  },
  {
    id: 22,
    title: "你会为了什么而熬夜？",
    options: [
      { label: "一本停不下来的书或一部让人沉浸的电影", scores: { R: 0, A: 2, S: 0, O: 1, E: 2 } },
      { label: "和朋友们在酒吧聊天跳舞，不想让夜晚结束", scores: { R: 3, A: 1, S: 3, O: 0, E: 3 } },
      { label: "赶一个工作 deadline，追求完美的最后一刻", scores: { R: 2, A: 1, S: 0, O: 3, E: 1 } },
      { label: "独自在深夜散步，享受城市最安静的时刻", scores: { R: 0, A: 2, S: 0, O: 1, E: 2 } }
    ]
  },
  {
    id: 23,
    title: "如果有一笔意外之财，你会？",
    options: [
      { label: "立刻订一张机票，去一个从没去过的地方", scores: { R: 3, A: 2, S: 1, O: 0, E: 3 } },
      { label: "投资自己的兴趣爱好或技能学习", scores: { R: 1, A: 2, S: 0, O: 3, E: 1 } },
      { label: "存起来，为未来的长期计划做准备", scores: { R: 0, A: 0, S: 0, O: 3, E: 0 } },
      { label: "请朋友们吃一顿好的，快乐要分享", scores: { R: 2, A: 1, S: 3, O: 0, E: 3 } }
    ]
  },
  {
    id: 24,
    title: "你认为「生活品质」最核心的要素是？",
    options: [
      { label: "时间自由——可以按照自己的节奏生活", scores: { R: 1, A: 1, S: 1, O: 1, E: 2 } },
      { label: "空间品质——住所的舒适度和周边环境", scores: { R: 0, A: 2, S: 1, O: 3, E: 1 } },
      { label: "文化丰富度——随时能接触到艺术、音乐和新思想", scores: { R: 1, A: 3, S: 1, O: 2, E: 2 } },
      { label: "人际连接——身边有懂你的人，不孤单", scores: { R: 1, A: 1, S: 3, O: 1, E: 2 } }
    ]
  },
  // Chapter 5: 归属 · 灵魂的锚点 (Q25-Q30)
  {
    id: 25,
    title: "你觉得「家」的感觉更像是？",
    options: [
      { label: "一个让你可以完全做自己的安全空间", scores: { R: 0, A: 1, S: 0, O: 2, E: 2 } },
      { label: "一个永远有人在等你回来的温暖角落", scores: { R: 0, A: 1, S: 2, O: 2, E: 2 } },
      { label: "一种随身携带的状态，走到哪里都能有", scores: { R: 2, A: 1, S: 0, O: 0, E: 2 } },
      { label: "一个充满记忆和故事的容器", scores: { R: 0, A: 2, S: 1, O: 1, E: 3 } }
    ]
  },
  {
    id: 26,
    title: "如果可以在一座城市度过余生，你最看重它的什么？",
    options: [
      { label: "足够多的新鲜感和可能性，永远不会厌倦", scores: { R: 3, A: 2, S: 1, O: 0, E: 2 } },
      { label: "安全感和稳定性，能让你安心地规划未来", scores: { R: 0, A: 1, S: 1, O: 3, E: 1 } },
      { label: "美——无论是自然美景还是人造景观，每天都被美包围", scores: { R: 1, A: 3, S: 0, O: 2, E: 2 } },
      { label: "人情味——邻里的温度和街角的烟火气", scores: { R: 1, A: 1, S: 3, O: 1, E: 3 } }
    ]
  },
  {
    id: 27,
    title: "你和一座城市的缘分，通常始于？",
    options: [
      { label: "一首歌、一部电影或一本书里提到了它", scores: { R: 1, A: 2, S: 0, O: 0, E: 3 } },
      { label: "朋友的推荐或社交媒体上看到的美图", scores: { R: 1, A: 2, S: 2, O: 1, E: 1 } },
      { label: "做了大量功课后理性选择的旅行目的地", scores: { R: 1, A: 1, S: 0, O: 3, E: 0 } },
      { label: "一次意外的经历让你和它产生了连接", scores: { R: 1, A: 1, S: 1, O: 0, E: 3 } }
    ]
  },
  {
    id: 28,
    title: "离开一座喜欢的城市时，你通常会？",
    options: [
      { label: "在机场写一段小作文发朋友圈，依依不舍", scores: { R: 1, A: 1, S: 2, O: 0, E: 3 } },
      { label: "默默把它加入「下次还要来」的清单", scores: { R: 1, A: 1, S: 0, O: 1, E: 1 } },
      { label: "已经在计划下一个目的地了，前方永远更精彩", scores: { R: 3, A: 1, S: 1, O: 1, E: 1 } },
      { label: "带走一些小物件，在家里布置一个纪念角", scores: { R: 0, A: 2, S: 0, O: 1, E: 2 } }
    ]
  },
  {
    id: 29,
    title: "你觉得旅行最大的意义是？",
    options: [
      { label: "发现世界的多样性，拓展自己的边界", scores: { R: 2, A: 3, S: 1, O: 1, E: 2 } },
      { label: "暂时逃离日常，给自己充电", scores: { R: 1, A: 1, S: 0, O: 1, E: 2 } },
      { label: "遇见有趣的人，听到不同的故事", scores: { R: 1, A: 1, S: 3, O: 0, E: 3 } },
      { label: "确认自己真正想要的生活方式", scores: { R: 1, A: 2, S: 1, O: 2, E: 2 } }
    ]
  },
  {
    id: 30,
    title: "此刻闭上眼睛，你脑海中浮现的画面是？",
    options: [
      { label: "一条被暖黄路灯照亮的石板路，远处有人在弹吉他", scores: { R: 1, A: 2, S: 1, O: 1, E: 3 } },
      { label: "高楼之间的一小片天空，霓虹倒映在雨后的地面上", scores: { R: 2, A: 2, S: 1, O: 1, E: 2 } },
      { label: "一片开阔的海岸线，风吹过来带着咸咸的味道", scores: { R: 1, A: 2, S: 1, O: 1, E: 2 } },
      { label: "一张小桌上放着一杯茶，窗外是看不尽的远山", scores: { R: 0, A: 2, S: 0, O: 1, E: 2 } }
    ]
  }
]

// 城市数据 - 18座全球城市
export const soulCityResults: Record<string, SoulCityResult> = {
  paris: {
    key: "paris",
    name: "巴黎",
    alias: "浪漫美学之都",
    emoji: "🗼",
    description: "你相信生活本身就是一门艺术，而美是抵达真实的唯一路径。",
    tagline: "「生活即艺术，艺术即生活。」",
    keywords: ["浪漫主义", "美学至上", "精致生活", "艺术殿堂", "咖啡文化"],
    portrait: "你的灵魂里住着一个永远年轻的艺术家。你对美有着近乎执念的追求，哪怕是一杯咖啡的时间，也要讲究仪式感。在你看来，美不是奢侈，而是生活的基本配置。",
    interpretation: "你对艺术的敏感度是与生俱来的。你喜欢有质感的事物，愿意为美好买单，但这并不意味着铺张浪费——你追求的是那种「刚刚好」的精致。你对浪漫有自己的定义，不是俗套的玫瑰和巧克力，而是两个人一起在塞纳河边散步的宁静时刻。\\n\\n在社交中，你倾向于寻找能欣赏美、懂得生活情趣的人。你不太在意对方的财富或地位，但一定会观察对方的审美品味。和你契合的人，一定是那个愿意陪你一起在雨天逛美术馆、或者在咖啡馆消磨整个下午的人。",
    fiveDimension: { R: 55, A: 92, S: 60, O: 50, E: 88 },
    personality: "浪漫主义者 · 细节控 · 审美家",
    travelTip: "去蒙马特高地看日落，去玛黑区的小众画廊，去街角的法棍店排队——巴黎的正确打开方式是放慢脚步，用心感受。",
    bestMatch: "佛罗伦萨",
    oppositeMatch: "东京",
    imageGradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    bgGradient: "linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%)",
    shadowColor: "#e94560",
    textColor: "text-rose-300"
  },
  tokyo: {
    key: "tokyo",
    name: "东京",
    alias: "精致秩序之城",
    emoji: "🏯",
    description: "你相信秩序中藏着自由，在规则中才能真正释放创造力。",
    tagline: "「在秩序中找到极致，在极致中发现自由。」",
    keywords: ["匠人精神", "极致追求", "秩序美学", "都市节奏", "便利店文化"],
    portrait: "你的灵魂里住着一个严谨的完美主义者。你对细节有着近乎苛刻的要求，不是为了强迫症，而是相信细节决定品质。在你看来，提前做好准备是对自己和他人最大的尊重。",
    interpretation: "你是一个把「靠谱」写在基因里的人。你守时、守约、注重承诺，一旦答应的事情就会做到极致。但这并不意味着你是一个无趣的人——相反，你有自己的小确幸，可能是便利店的特定零食，也可能是周末去逛的文具店。\\n\\n你不喜欢意外，更喜欢一切都在掌控之中的感觉。这让你在工作和生活中都能保持高效，但偶尔也需要学会放手，给自己一些「不计划」的轻松时光。",
    fiveDimension: { R: 75, A: 85, S: 40, O: 95, E: 45 },
    personality: "匠人之心 · 计划控 · 品质党",
    travelTip: "早起去筑地市场吃最新鲜的寿司，周末逛吉祥寺的复古小店，在代官山找一个咖啡馆消磨下午——东京的魅力在于它永远有惊喜。",
    bestMatch: "首尔",
    oppositeMatch: "大理",
    imageGradient: "linear-gradient(135deg, #1a1a2e 0%, #0f3460 50%, #16213e 100%)",
    bgGradient: "linear-gradient(180deg, #0a0a15 0%, #1a1a2e 100%)",
    shadowColor: "#e94560",
    textColor: "text-rose-300"
  },
  newyork: {
    key: "newyork",
    name: "纽约",
    alias: "野心不夜城",
    emoji: "🗽",
    description: "你相信梦想是用来实现的，而纽约就是那个让梦想成为现实的地方。",
    tagline: "「这座城市不相信眼泪，但相信努力。」",
    keywords: ["梦想之都", "多元文化", "24小时", "华尔街", "自由女神"],
    portrait: "你的灵魂里住着一个永不停歇的追梦人。你相信努力就会有收获，哪怕暂时看不到结果。你喜欢这座城市的节奏，因为它让你感觉一切皆有可能。",
    interpretation: "你是一个目标导向的人，清楚自己想要什么，并且愿意为之付出代价。你不喜欢抱怨，解决问题是你的本能。在你看来，时间是最宝贵的资源，浪费在无效社交上简直是犯罪。\\n\\n但你的内心深处也有一片柔软的角落，可能在深夜的地铁里，可能在布鲁克林的某家小酒吧。你需要的不是一个安慰你的人，而是一个能跟上你节奏、和你一起往前冲的伙伴。",
    fiveDimension: { R: 95, A: 70, S: 85, O: 55, E: 75 },
    personality: "野心家 · 行动派 · 效率控",
    travelTip: "中央公园晨跑感受城市脉动，去布鲁克林大桥看日落，在苏荷区偶遇明星——纽约的精彩属于每一个努力的人。",
    bestMatch: "伦敦",
    oppositeMatch: "京都",
    imageGradient: "linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #0f3460 100%)",
    bgGradient: "linear-gradient(180deg, #050505 0%, #0a0a15 100%)",
    shadowColor: "#f97316",
    textColor: "text-amber-300"
  },
  chengdu: {
    key: "chengdu",
    name: "成都",
    alias: "松弛烟火之城",
    emoji: "🐼",
    description: "你相信生活最重要的是舒服，而快乐是最重要的事。",
    tagline: "「人生苦短，及时行乐。」",
    keywords: ["慢生活", "美食之都", "茶馆文化", "熊猫", "安逸"],
    portrait: "你的灵魂里住着一个懂得享受生活的哲学家。你不是不努力，而是明白努力的目的就是为了更好的生活。对你来说，一顿火锅、一杯茶、一次麻将，都是人生不可辜负的美好。",
    interpretation: "你是一个把「活得开心」放在第一位的人。你不太会被焦虑困扰，因为你知道船到桥头自然直。你对朋友真诚热情，来者都是客，一起吃顿火锅就是缘分。\\n\\n你不喜欢太复杂的人际关系，圈子不大但都是过命的朋友。在你看来，人生最重要的不是功成名就，而是每一天都能吃得开心、睡得安稳。这种「小富即安」的生活态度，恰恰是很多人求而不得的智慧。",
    fiveDimension: { R: 25, A: 45, S: 80, O: 30, E: 70 },
    personality: "乐天派 · 美食家 · 人间烟火",
    travelTip: "早上的人民公园喝盖碗茶，下午去宽窄巷子逛吃，晚上在玉林路的小酒馆听歌——成都的正确打开方式是「慢」。",
    bestMatch: "重庆",
    oppositeMatch: "哥本哈根",
    imageGradient: "linear-gradient(135deg, #1a2a1a 0%, #0f2f1f 50%, #1a3a2a 100%)",
    bgGradient: "linear-gradient(180deg, #0a1a0a 0%, #1a2a1a 100%)",
    shadowColor: "#22c55e",
    textColor: "text-emerald-300"
  },
  melbourne: {
    key: "melbourne",
    name: "墨尔本",
    alias: "文艺咖啡之都",
    emoji: "☕",
    description: "你相信咖啡不是提神醒脑的饮料，而是生活美学的载体。",
    tagline: "「在一杯咖啡里，找到整个世界的美好。」",
    keywords: ["咖啡文化", "艺术气息", "多元包容", "涂鸦街", "海滨生活"],
    portrait: "你的灵魂里住着一个追求生活品质的文艺青年。你喜欢有设计感的东西，哪怕只是一个咖啡杯的摆放都能让你开心半天。你对生活的理解是：不需要大富大贵，但一定要有仪式感。",
    interpretation: "你是一个既有文艺气质又懂得享受生活的人。你喜欢探索新事物，但对潮流有自己独特的见解——你追的是「小众」，而不是「爆款」。你愿意花时间在别人看来「没用」的事情上，比如研究一款咖啡豆的产地，或者在二手市场淘一件 vintage 家具。\\n\\n你的社交圈子可能不大，但都是志同道合的朋友。你们可以在咖啡馆聊一整个下午，从音乐聊到哲学，从旅行聊到人生。这种深度交流对你来说比任何派对都更有吸引力。",
    fiveDimension: { R: 40, A: 78, S: 55, O: 60, E: 62 },
    personality: "文艺青年 · 生活家 · 咖啡控",
    travelTip: "清晨在联邦广场看鸽子，下午在霍西尔巷看涂鸦，傍晚在圣科达海滩等日落——墨尔本的诗意藏在每个街角。",
    bestMatch: "阿姆斯特丹",
    oppositeMatch: "首尔",
    imageGradient: "linear-gradient(135deg, #2d1b4e 0%, #1a1a2e 50%, #0f3460 100%)",
    bgGradient: "linear-gradient(180deg, #1a0a2e 0%, #1a1a2e 100%)",
    shadowColor: "#a855f7",
    textColor: "text-purple-300"
  },
  london: {
    key: "london",
    name: "伦敦",
    alias: "绅士先锋之城",
    emoji: "🎩",
    description: "你相信传统与前卫可以在同一个人身上和谐共存。",
    tagline: "「保守是一种态度，颠覆是另一种。」",
    keywords: ["英伦风情", "古典与现代", "雨天", "博物馆", "下午茶"],
    portrait: "你的灵魂里住着一个矛盾的统一体。你既尊重传统，又渴望突破；外表沉稳，内心狂野。你喜欢有深度的事物，不仅仅是好看，更要「有意思」。",
    interpretation: "你是一个「看起来很成熟，但实际上很有趣」的人。你有自己的原则和底线，不会轻易被人影响，但在熟悉的人面前会展现出意想不到的一面。你对知识的渴求是无止境的，永远在学习，永远在成长。\\n\\n你欣赏有内涵的人，讨厌肤浅的社交。对你来说，一段好的关系应该是「棋逢对手」的交流，而不是一方永远在听另一方讲故事。你需要一个能和你一起探索世界、一起成长的伴侣。",
    fiveDimension: { R: 80, A: 82, S: 65, O: 75, E: 55 },
    personality: "思想者 · 优雅绅士 · 矛盾统一",
    travelTip: "周末去诺丁山的复古市集，工作日下班后去泰特现代美术馆，凌晨在碎片大厦看日出——伦敦的多面等待你去发现。",
    bestMatch: "纽约",
    oppositeMatch: "大理",
    imageGradient: "linear-gradient(135deg, #1a1a2e 0%, #2d2d3a 50%, #1a1a2e 100%)",
    bgGradient: "linear-gradient(180deg, #0f0f15 0%, #1a1a2e 100%)",
    shadowColor: "#6366f1",
    textColor: "text-indigo-300"
  },
  seoul: {
    key: "seoul",
    name: "首尔",
    alias: "潮流造梦之城",
    emoji: "🎀",
    description: "你相信审美也是一种能力，而时尚是表达自我的方式。",
    tagline: "「在潮流中保持自我，在自我中引领潮流。」",
    keywords: ["K-Culture", "时尚前沿", "夜景", "咖啡店", "偶像经济"],
    portrait: "你的灵魂里住着一个永远走在潮流前端的人。你对时尚敏感，对美有追求，但不是盲目的跟风——你知道自己适合什么，需要什么。你相信「形象管理」是一种自我尊重。",
    interpretation: "你是一个既有外在又有内涵的人。你懂得包装自己，但这不是虚伪，而是对自己形象的负责。你对新事物保持开放态度，愿意尝试，但有自己的判断标准。\\n\\n你的社交能力很强，懂得察言观色，知道在不同场合说什么话。这让你在人群中很受欢迎，但你偶尔也会感到疲惫，想要逃离喧嚣，找一个安静的地方独自充电。",
    fiveDimension: { R: 85, A: 88, S: 75, O: 70, E: 65 },
    personality: "潮流达人 · 社交高手 · 精致主义",
    travelTip: "凌晨的弘大街头感受青春气息，江南的咖啡店打卡网红店，明洞购物体验韩式服务——首尔的精彩24小时不间断。",
    bestMatch: "东京",
    oppositeMatch: "里斯本",
    imageGradient: "linear-gradient(135deg, #1a1a2e 0%, #4a1a4a 50%, #2d1b4e 100%)",
    bgGradient: "linear-gradient(180deg, #0a0a15 0%, #1a1a2e 100%)",
    shadowColor: "#ec4899",
    textColor: "text-pink-300"
  },
  istanbul: {
    key: "istanbul",
    name: "伊斯坦布尔",
    alias: "东西交汇之城",
    emoji: "🕌",
    description: "你相信世界的精彩在于多元，而冲突也是美的一种形式。",
    tagline: "「一半在欧洲，一半在亚洲；一半是过去，一半是未来。」",
    keywords: ["东西融合", "古老与现代", "博斯普鲁斯", "香料市场", "奥斯曼"],
    portrait: "你的灵魂里住着一个看尽繁华的旅行者。你对不同文化充满好奇，愿意理解和欣赏差异。你不是非黑即白的人，而是能在复杂中找到美感、在矛盾中发现统一的智者。",
    interpretation: "你是一个「见过世面」的人。你对各种文化都有所了解，不会大惊小怪，也不会轻易judge别人。你喜欢有故事的东西，一张老照片、一件古董家具、一首古老的歌曲，都能让你驻足良久。\\n\\n你的人生阅历可能比同龄人更丰富，这让你在社交中显得成熟可靠。但你内心也有热情如火的一面，可能在某个夜晚的酒吧里，可能在一次说走就走的旅行中，你会展现出让人惊讶的激情。",
    fiveDimension: { R: 60, A: 75, S: 70, O: 35, E: 90 },
    personality: "世界主义者 · 故事收集者 · 矛盾美学家",
    travelTip: "清晨在蓝色清真寺祈祷，午后穿越大巴扎的香料迷宫，傍晚在博斯普鲁斯海峡看落日——伊斯坦布尔是一场穿越时空的梦。",
    bestMatch: "布宜诺斯艾利斯",
    oppositeMatch: "哥本哈根",
    imageGradient: "linear-gradient(135deg, #1a2a1a 0%, #3d2a1a 50%, #2a1a3d 100%)",
    bgGradient: "linear-gradient(180deg, #0a150a 0%, #1a2a1a 100%)",
    shadowColor: "#f59e0b",
    textColor: "text-amber-300"
  },
  kyoto: {
    key: "kyoto",
    name: "京都",
    alias: "侘寂禅意之城",
    emoji: "⛩️",
    description: "你相信美在于不完美，而真正的奢华是内心的平静。",
    tagline: "「在残缺中发现完整，在寂静中听见声音。」",
    keywords: ["侘寂", "枯山水", "和风", "寺庙", "四季"],
    portrait: "你的灵魂里住着一个追求内心平静的修行者。你不追求物质的丰富，而是精神的充盈。你喜欢简单、朴素、有质感的事物，讨厌喧嚣和浮躁。",
    interpretation: "你是一个「内心强大」的人。你不需要外界的认可来证明自己的价值，有自己的节奏和步伐。你喜欢独处，但这不是因为孤僻，而是因为你知道只有在安静中才能听见内心的声音。\\n\\n你对人际关系很挑剔，宁缺毋滥。你欣赏有深度、有内涵的人，讨厌浮夸和做作。在你看来，最好的关系是「彼此独立，又相互支持」，就像两棵相邻的树，根在地下相连，枝叶在空中各自生长。",
    fiveDimension: { R: 15, A: 80, S: 25, O: 85, E: 40 },
    personality: "禅意者 · 极简主义 · 内心平静",
    travelTip: "清晨在竹林小径漫步，午后拜访冷门寺庙，傍晚在鸭川边看夕阳——京都的美好需要慢慢品味。",
    bestMatch: "佛罗伦萨",
    oppositeMatch: "纽约",
    imageGradient: "linear-gradient(135deg, #1a2a1a 0%, #2a2a1a 50%, #1a2a2a 100%)",
    bgGradient: "linear-gradient(180deg, #0a150a 0%, #1a1a15 100%)",
    shadowColor: "#84cc16",
    textColor: "text-lime-300"
  },
  amsterdam: {
    key: "amsterdam",
    name: "阿姆斯特丹",
    alias: "自由骑行之城",
    emoji: "🚲",
    description: "你相信自由不是放纵，而是在规则范围内做真实的自己。",
    tagline: "「在这里，你可以成为任何你想成为的人。」",
    keywords: ["自由开放", "骑行生活", "运河文化", "艺术殿堂", "包容多元"],
    portrait: "你的灵魂里住着一个追求自由的灵魂。你不喜欢被束缚，但又懂得在自由和责任之间找平衡。你对不同的事物保持开放态度，相信存在即合理。",
    interpretation: "你是一个「思想开放」的人。你不会用单一的价值观去评判别人，尊重每个人的生活方式。你有自己的原则，但这些原则是经过深思熟虑的，而不是人云亦云的。\\n\\n你喜欢有创意的事物，对艺术有独特的欣赏能力。你可能有一些小众爱好，或者是那种「只要自己喜欢就好」的生活态度。在你看来，人生最重要的是「不后悔」，而不是「不出错」。",
    fiveDimension: { R: 50, A: 72, S: 65, O: 45, E: 55 },
    personality: "自由灵魂 · 创意工作者 · 包容者",
    travelTip: "租一辆自行车沿着运河骑行，参观梵高博物馆，在红灯区感受城市的另一面——阿姆斯特丹是一个需要用脚丈量的城市。",
    bestMatch: "墨尔本",
    oppositeMatch: "重庆",
    imageGradient: "linear-gradient(135deg, #1a2a3a 0%, #2a1a2a 50%, #3a2a1a 100%)",
    bgGradient: "linear-gradient(180deg, #0a1520 0%, #1a1a2a 100%)",
    shadowColor: "#f97316",
    textColor: "text-orange-300"
  },
  buenosaires: {
    key: "buenosaires",
    name: "布宜诺斯艾利斯",
    alias: "热情探戈之城",
    emoji: "💃",
    description: "你相信人生只有一次，所以要热烈地活着，勇敢地爱。",
    tagline: "「用探戈的节奏，度过每一天。」",
    keywords: ["探戈", "足球", "激情", "南美风情", "午夜巴黎"],
    portrait: "你的灵魂里住着一个热情的舞者。你对生活充满激情，哪怕是最普通的日子也要过得有滋有味。你相信「今朝有酒今朝醉」，但也会在关键时刻展现出可靠的一面。",
    interpretation: "你是一个「敢爱敢恨」的人。你的情感浓烈，不是那种「淡淡」的相处模式——要么不爱，要么深爱。你对朋友仗义，只要你认定的朋友，两肋插刀也在所不惜。\\n\\n你可能会给人一种「太冲动」的印象，但实际上你只是不想委屈自己。你的人生哲学是「做了再说」，而不是「想好了再做」。这种勇气让的人生充满了精彩的冒险，但偶尔也会让你吃到冲动的苦头。",
    fiveDimension: { R: 55, A: 60, S: 90, O: 25, E: 95 },
    personality: "热情舞者 · 冒险家 · 情感浓烈",
    travelTip: "在博卡区看街头探戈表演，周末去马德罗港的集市，下午在雷科莱塔区感受优雅——布宜诺斯艾利斯是一个需要用热情去体验的城市。",
    bestMatch: "伊斯坦布尔",
    oppositeMatch: "东京",
    imageGradient: "linear-gradient(135deg, #2a1a1a 0%, #3a2a1a 50%, #2a1a2a 100%)",
    bgGradient: "linear-gradient(180deg, #150a0a 0%, #1a1a15 100%)",
    shadowColor: "#ef4444",
    textColor: "text-red-300"
  },
  lisbon: {
    key: "lisbon",
    name: "里斯本",
    alias: "怀旧诗意之城",
    emoji: "🚋",
    description: "你相信旧时光里藏着最美的风景，而回忆是人生最珍贵的财富。",
    tagline: "「在怀旧中寻找诗意，在诗意中度过余生。」",
    keywords: ["电车", "海岸", "蛋挞", " fado", "老城"],
    portrait: "你的灵魂里住着一个念旧的诗人。你喜欢有故事的东西，对新潮的事物保持一定距离。你觉得「慢」才是生活的正确打开方式，急什么？",
    interpretation: "你是一个「有情怀」的人。你对过去有深厚的感情，可能经常会回忆往事，感伤时光的流逝。但你不是因为现在过得不好才怀旧，而是因为过去的那些美好值得被记住。\\n\\n你是一个很好的倾听者，朋友遇到烦心事喜欢找你倾诉。你不会急着给建议，而是先陪对方一起感受。这种「陪伴式」的友情对你来说比任何礼物都珍贵。",
    fiveDimension: { R: 30, A: 70, S: 50, O: 40, E: 78 },
    personality: "诗意灵魂 · 怀旧者 · 慢生活倡导者",
    travelTip: "乘坐28路电车穿梭老城，傍晚在圣乔治城堡看日落，凌晨在阿法玛区听 fado——里斯本的诗意需要用心感受。",
    bestMatch: "大理",
    oppositeMatch: "首尔",
    imageGradient: "linear-gradient(135deg, #2a2a1a 0%, #3a2a1a 50%, #2a3a1a 100%)",
    bgGradient: "linear-gradient(180deg, #15150a 0%, #1a1a15 100%)",
    shadowColor: "#eab308",
    textColor: "text-yellow-300"
  },
  bangkok: {
    key: "bangkok",
    name: "曼谷",
    alias: "感官盛宴之城",
    emoji: "🛕",
    description: "你相信生活的精彩在于体验，而冒险是对生命的尊重。",
    tagline: "「在混乱中发现秩序，在喧嚣中找到宁静。」",
    keywords: ["夜市", "寺庙", "泰式按摩", "多元", "烟火气"],
    portrait: "你的灵魂里住着一个永远充满好奇心的探险家。你喜欢刺激和新奇，对各种文化都抱有浓厚的兴趣。你觉得人生就是要多体验，不然白来这一趟。",
    interpretation: "你是一个「爱玩」的人。你不会亏待自己，知道怎么让自己开心。你对生活质量有一定要求，但不是追求奢华，而是追求「舒服」——吃要吃得开心，住要住得舒心。\\n\\n你是一个很好的旅伴，懂得在旅途中找乐子，也懂得照顾同行人的感受。你喜欢结交五湖四海的朋友，觉得「多个朋友多条路」。但有时候你也会需要独处的时间，给自己充充电。",
    fiveDimension: { R: 70, A: 55, S: 80, O: 20, E: 82 },
    personality: "探险家 · 体验派 · ",
    travelTip: "凌晨的火车市集感受人间烟火，大皇宫感受金碧辉煌，考山路体验背包客文化——曼谷是一个永远不会让你无聊的城市。",
    bestMatch: "重庆",
    oppositeMatch: "京都",
    imageGradient: "linear-gradient(135deg, #2a1a2a 0%, #3a2a1a 50%, #1a2a3a 100%)",
    bgGradient: "linear-gradient(180deg, #150a15 0%, #1a1a20 100%)",
    shadowColor: "#f59e0b",
    textColor: "text-amber-300"
  },
  dali: {
    key: "dali",
    name: "大理",
    alias: "流浪诗人之城",
    emoji: "🌿",
    description: "你相信自由不需要理由，而流浪是最美的生活方式。",
    tagline: "「身体和灵魂，总有一个在路上。」",
    keywords: ["苍山洱海", "慢生活", "文青", "客栈", "大理蓝"],
    portrait: "你的灵魂里住着一个渴望流浪的诗人。你不喜欢被固定的生活模式束缚，向往诗和远方。你觉得人生不应该只有工作和生存，还应该有诗意和梦想。",
    interpretation: "你是一个「不羁」的人。你不太在乎别人的眼光，活在自己的节奏里。你可能已经有过一次说走就走的旅行，或者正在计划下一次出发。在你看来，人生就是一场冒险，重要的不是目的地，而是路上的风景。\\n\\n你对物质要求不高，但对精神世界有很高的追求。你喜欢艺术、音乐、文字，可能自己也偶尔创作。你的爱情观是「不强求」，遇到对的人就好好珍惜，遇不到就好好爱自己。",
    fiveDimension: { R: 10, A: 65, S: 35, O: 15, E: 72 },
    personality: "流浪诗人 · 理想主义者 · 自由灵魂",
    travelTip: "环洱海骑行感受大理蓝，苍山徒步看云卷云舒，夜晚在人民路逛酒吧——大理是一个让人忘记时间的地方。",
    bestMatch: "里斯本",
    oppositeMatch: "东京",
    imageGradient: "linear-gradient(135deg, #1a2a3a 0%, #2a3a2a 50%, #1a2a1a 100%)",
    bgGradient: "linear-gradient(180deg, #0a1520 0%, #151a15 100%)",
    shadowColor: "#14b8a6",
    textColor: "text-teal-300"
  },
  copenhagen: {
    key: "copenhagen",
    name: "哥本哈根",
    alias: "北欧极简之城",
    emoji: "🧊",
    description: "你相信真正的幸福来自于简单，而少即是多。",
    tagline: "「在极简中寻找丰盛，在设计中发现生活。」",
    keywords: ["设计", "极简", " Hygge", "童话", "环保"],
    portrait: "你的灵魂里住着一个追求生活品质的设计师。你喜欢简洁、有质感的东西，讨厌多余的装饰。你相信好的设计不是炫技，而是让生活变得更简单、更美好。",
    interpretation: "你是一个「高品质」的人。你对生活质量有要求，但这种要求不是来自虚荣，而是来自对自我的尊重。你愿意为好产品付费，因为这代表着对生活的重视。你可能有一些「小怪癖」，比如一定要用某个牌子的东西，或者有特定的生活仪式感。\\n\\n你懂得享受生活，不是那种只会工作不懂生活的人。你会在周末给自己做一顿好吃的，或者安排一个放松的下午。对你来说，「 Hygge 」不是矫情，而是对生活的热爱。",
    fiveDimension: { R: 45, A: 90, S: 40, O: 88, E: 30 },
    personality: "设计爱好者 · 品质生活家 · 极简主义者",
    travelTip: "在新港喝一杯咖啡感受 Hygge，去 Design Museum 丹麦设计博物馆，在克里斯蒂安尼亚自由城体验另一种生活——哥本哈根是一个让人想要留下的城市。",
    bestMatch: "温哥华",
    oppositeMatch: "成都",
    imageGradient: "linear-gradient(135deg, #1a2a3a 0%, #1a3a3a 50%, #2a2a3a 100%)",
    bgGradient: "linear-gradient(180deg, #0a1520 0%, #151a20 100%)",
    shadowColor: "#06b6d4",
    textColor: "text-cyan-300"
  },
  chongqing: {
    key: "chongqing",
    name: "重庆",
    alias: "赛博朋克之城",
    emoji: "🌃",
    description: "你相信生活的刺激来自于挑战，而火锅要够辣才够味。",
    tagline: "「在魔幻中寻找真实，在热辣中感受生命。」",
    keywords: ["火锅", "魔幻地形", "夜景", "江湖气", "8D城市"],
    portrait: "你的灵魂里住着一个热爱刺激的冒险家。你喜欢挑战，不喜欢一成不变的生活。你觉得人生就是要「够劲」，无论是工作还是感情，都要全情投入。",
    interpretation: "你是一个「麻辣」的人。你的性格像重庆火锅——热情、直接、有力量。你说话直来直去，不喜欢绕弯子，但这份坦诚恰恰是你最可爱的地方。你对朋友仗义，谁对你好你会加倍奉还。\\n\\n你可能给人一种「太冲」的印象，但实际上你只是不想浪费时间在虚与委蛇上。你喜欢快节奏的生活，闲不下来，一旦闲下来就会觉得浑身不自在。你的理想伴侣也是一个「有意思」的人，能跟上你的节奏，一起去冒险。",
    fiveDimension: { R: 80, A: 58, S: 85, O: 30, E: 80 },
    personality: "麻辣性格 · 冒险家 · 江湖气息",
    travelTip: "南山一棵树看夜景，解放碑感受都市繁华，磁器口古镇尝遍小吃，火锅一条街吃到凌晨——重庆是一个24小时都有故事的城市。",
    bestMatch: "成都",
    oppositeMatch: "阿姆斯特丹",
    imageGradient: "linear-gradient(135deg, #2a1a1a 0%, #3a2a1a 50%, #1a2a3a 100%)",
    bgGradient: "linear-gradient(180deg, #150a0a 0%, #151a20 100%)",
    shadowColor: "#ef4444",
    textColor: "text-red-300"
  },
  florence: {
    key: "florence",
    name: "佛罗伦萨",
    alias: "文艺复兴之城",
    emoji: "🏛️",
    description: "你相信美是永恒的，而艺术是穿越时空的对话。",
    tagline: "「在文艺复兴的余晖中，遇见更好的自己。」",
    keywords: ["艺术", "文艺复兴", "托斯卡纳", " Uffizi", "慢节奏"],
    portrait: "你的灵魂里住着一个追求完美的艺术家。你对美有执念，这种执念不是肤浅的外貌协会，而是对「极致」的追求。你相信世界上最好的东西值得等待。",
    interpretation: "你是一个「有品位」的人。你可能不是艺术家，但一定有艺术家的眼光和追求。你喜欢经典，不追潮流，因为你知道真正好的东西是经得起时间考验的。你愿意为品质买单，哪怕价格贵一点。\\n\\n你是一个很好的聊天对象，因为你有丰富的知识储备和独特的见解。你对历史、文化、艺术都有涉猎，和你聊天永远不会觉得无聊。在感情中，你需要的是一个能和你「灵魂共振」的人。",
    fiveDimension: { R: 20, A: 95, S: 45, O: 65, E: 75 },
    personality: "艺术追求者 · 完美主义者 · 经典主义者",
    travelTip: "乌菲兹美术馆看波提切利，维琪奥桥感受浪漫，老城漫步偶遇惊喜，托斯卡纳庄园品酒——佛罗伦萨是一个让人想要变更好的城市。",
    bestMatch: "巴黎",
    oppositeMatch: "重庆",
    imageGradient: "linear-gradient(135deg, #2a2a1a 0%, #3a2a1a 50%, #2a2a2a 100%)",
    bgGradient: "linear-gradient(180deg, #15150a 0%, #1a1a15 100%)",
    shadowColor: "#d97706",
    textColor: "text-amber-300"
  },
  vancouver: {
    key: "vancouver",
    name: "温哥华",
    alias: "山海自然之城",
    emoji: "🏔️",
    description: "你相信最好的生活是身心的平衡，而自然是最治愈的力量。",
    tagline: "「在山海之间，找到内心的平静。」",
    keywords: ["自然", "山海", "宜居", "多元", "户外运动"],
    portrait: "你的灵魂里住着一个追求平衡的生活哲学家。你知道工作不是人生的全部，懂得给自己留时间亲近自然。你相信「身体和灵魂，总有一个要在路上」。",
    interpretation: "你是一个「懂得生活」的人。你不会为了工作牺牲健康，也不会为了赚钱亏待自己。你知道什么是最重要的，懂得在适当的时候放下脚步，享受生活。你对生活质量有要求，但这种要求是健康的、可持续的。\\n\\n你喜欢户外运动，可能每周都会去爬山、跑步或者骑行。你觉得大自然是最好的充电器，在城市里待久了就要去山里走走。你的理想生活是在自然和都市之间找到平衡，既有便利的生活，又有诗和远方。",
    fiveDimension: { R: 35, A: 68, S: 50, O: 72, E: 42 },
    personality: "自然爱好者 · 平衡追求者 · 生活方式家",
    travelTip: "斯坦利公园骑行，卡普兰诺吊桥徒步，格劳斯山滑雪，煤气镇喝咖啡——温哥华是一个让人想要定居的城市。",
    bestMatch: "哥本哈根",
    oppositeMatch: "伊斯坦布尔",
    imageGradient: "linear-gradient(135deg, #1a2a2a 0%, #2a3a2a 50%, #1a2a1a 100%)",
    bgGradient: "linear-gradient(180deg, #0a1515 0%, #151a15 100%)",
    shadowColor: "#22c55e",
    textColor: "text-green-300"
  }
}

// 计算测试结果
export function calculateSoulCityResult(scores: { R: number; A: number; S: number; O: number; E: number }): string {
  // 归一化分数
  const maxScore = 30 * 3 // 每维度最大可能分数 = 30题 * 3分
  const normalizedScores = {
    R: (scores.R / maxScore) * 100,
    A: (scores.A / maxScore) * 100,
    S: (scores.S / maxScore) * 100,
    O: (scores.O / maxScore) * 100,
    E: (scores.E / maxScore) * 100
  }

  // 计算与每座城市的余弦相似度
  let bestMatch = ""
  let bestSimilarity = -1

  const cityEntries = Object.entries(soulCityResults)
  
  for (const [key, city] of cityEntries) {
    // 城市向量 (归一化到0-1)
    const cityVector = {
      R: city.fiveDimension.R / 100,
      A: city.fiveDimension.A / 100,
      S: city.fiveDimension.S / 100,
      O: city.fiveDimension.O / 100,
      E: city.fiveDimension.E / 100
    }

    // 用户向量
    const userVector = {
      R: normalizedScores.R / 100,
      A: normalizedScores.A / 100,
      S: normalizedScores.S / 100,
      O: normalizedScores.O / 100,
      E: normalizedScores.E / 100
    }

    // 计算余弦相似度
    const dotProduct = 
      cityVector.R * userVector.R +
      cityVector.A * userVector.A +
      cityVector.S * userVector.S +
      cityVector.O * userVector.O +
      cityVector.E * userVector.E

    const cityMagnitude = Math.sqrt(
      cityVector.R ** 2 + cityVector.A ** 2 + cityVector.S ** 2 + 
      cityVector.O ** 2 + cityVector.E ** 2
    )
    const userMagnitude = Math.sqrt(
      userVector.R ** 2 + userVector.A ** 2 + userVector.S ** 2 + 
      userVector.O ** 2 + userVector.E ** 2
    )

    const similarity = dotProduct / (cityMagnitude * userMagnitude)

    if (similarity > bestSimilarity) {
      bestSimilarity = similarity
      bestMatch = key
    }
  }

  return bestMatch || "paris"
}

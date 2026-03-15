export interface BanweiOption {
  label: string;
  score: number; // 1 = 班味最淡，4 = 班味最浓
}

export interface BanweiQuestion {
  id: string;
  dimension: 'caffeine' | 'kpiInvasion' | 'mentalDrain' | 'deskBond' | 'lifeFade';
  title: string;
  options: BanweiOption[];
}

export const banweiQuestions: BanweiQuestion[] = [
  // ☕ 成分一：咖啡因依赖度（Q1, Q6, Q11）
  {
    id: "q1",
    dimension: 'caffeine',
    title: "周一早上闹钟响了，你的第一反应是？",
    options: [
      { label: "神清气爽地起床，新的一周冲冲冲！", score: 1 },
      { label: "赖床 10 分钟，但还是能挣扎起来", score: 2 },
      { label: "闭眼算一下最晚几点起还能不迟到", score: 3 },
      { label: "灵魂出窍，身体动了但人没醒，到公司才开机", score: 4 }
    ]
  },
  {
    id: "q6",
    dimension: 'caffeine',
    title: "你最近的睡眠状态是？",
    options: [
      { label: "倒头就睡，一觉到天亮", score: 1 },
      { label: "偶尔失眠，脑子会回放白天的工作", score: 2 },
      { label: "经常做和工作相关的梦，梦里还在开会", score: 3 },
      { label: "凌晨三点惊醒，突然想起一封邮件没回", score: 4 }
    ]
  },
  {
    id: "q11",
    dimension: 'caffeine',
    title: "上班路上，你的状态是？",
    options: [
      { label: "听音乐/播客，享受通勤的个人时间", score: 1 },
      { label: "刷手机消磨时间，到站了才发现该下车", score: 2 },
      { label: "在地铁上就开始回消息、看邮件", score: 3 },
      { label: "面无表情走完全程，和周围的牛马们眼神互相确认", score: 4 }
    ]
  },

  // 📊 成分二：KPI 渗透率（Q2, Q7, Q12）
  {
    id: "q2",
    dimension: 'kpiInvasion',
    title: "逛超市/商场时，你的脑回路是？",
    options: [
      { label: "开心购物，享受逛街的快乐", score: 1 },
      { label: "偶尔看到什么会想\"这个可以用在工作里\"", score: 2 },
      { label: "看到好的陈列/文案会下意识分析\"这个转化率怎么样\"", score: 3 },
      { label: "逛到一半突然打开钉钉/飞书看一眼，\"就看一眼\"", score: 4 }
    ]
  },
  {
    id: "q7",
    dimension: 'kpiInvasion',
    title: "你和朋友/家人吃饭时？",
    options: [
      { label: "全身心投入聊天和美食，手机放一边", score: 1 },
      { label: "偶尔瞄一眼手机，看看有没有消息", score: 2 },
      { label: "聊着聊着话题就拐到工作上了", score: 3 },
      { label: "突然说\"不好意思我回个消息\"，然后打了 20 分钟字", score: 4 }
    ]
  },
  {
    id: "q12",
    dimension: 'kpiInvasion',
    title: "你最近和朋友聊天，口头禅变成了？",
    options: [
      { label: "正常说人话，没什么变化", score: 1 },
      { label: "偶尔蹦出\"赋能\"\"闭环\"\"抓手\"之类的词", score: 2 },
      { label: "把\"收到\"\"已读\"\"对齐一下\"带入了日常对话", score: 3 },
      { label: "和朋友说\"我们拉个会对齐一下周末安排\"，说完自己都愣了", score: 4 }
    ]
  },

  // 🫠 成分三：精神内耗浓度（Q3, Q8, Q13）
  {
    id: "q3",
    dimension: 'mentalDrain',
    title: "打开手机看到工作群 99+ 未读，你的心理活动是？",
    options: [
      { label: "淡定点开，该回的回，不紧急的标记稍后处理", score: 1 },
      { label: "叹口气，但还是乖乖点开了", score: 2 },
      { label: "心跳加速，先深呼吸三秒再打开", score: 3 },
      { label: "假装没看到，但一整天都在想里面说了啥", score: 4 }
    ]
  },
  {
    id: "q8",
    dimension: 'mentalDrain',
    title: "周日下午 4 点，你的情绪突然变了，因为？",
    options: [
      { label: "没变啊？周日过得很开心", score: 1 },
      { label: "微微叹气，\"明天又要上班了\"", score: 2 },
      { label: "开始焦虑，不自觉地在脑子里过明天的待办清单", score: 3 },
      { label: "整个周日都笼罩在\"明天要上班\"的阴影里，根本快乐不起来", score: 4 }
    ]
  },
  {
    id: "q13",
    dimension: 'mentalDrain',
    title: "最近照镜子，你觉得自己？",
    options: [
      { label: "状态不错，气色挺好的", score: 1 },
      { label: "有点疲态，但还在正常范围内", score: 2 },
      { label: "眼神里的光好像比以前少了一点", score: 3 },
      { label: "认不出这个面无表情的人是自己了，\"我以前不是这样的\"", score: 4 }
    ]
  },

  // 📱 成分四：工位依赖症（Q4, Q9, Q14）
  {
    id: "q4",
    dimension: 'deskBond',
    title: "放假第一天，你会？",
    options: [
      { label: "立刻投入假期模式，出去玩/追剧/见朋友", score: 1 },
      { label: "在家躺尸一天缓冲一下，再开始享受假期", score: 2 },
      { label: "虽然放假了但还是打开了电脑\"看一眼\"", score: 3 },
      { label: "身体在度假，灵魂还在工位上。总觉得手机会响", score: 4 }
    ]
  },
  {
    id: "q9",
    dimension: 'deskBond',
    title: "你对工位的感情是？",
    options: [
      { label: "就是个工作的地方，下班了就忘了它的存在", score: 1 },
      { label: "还行吧，至少我的工位被我布置得挺舒服的", score: 2 },
      { label: "说实话，工位椅子坐的时间比家里床躺的时间还长", score: 3 },
      { label: "工位就是我的第二个家，抽屉里有拖鞋、毯子、零食和全套洗漱用品", score: 4 }
    ]
  },
  {
    id: "q14",
    dimension: 'deskBond',
    title: "听到微信/钉钉/飞书的消息提示音，你的生理反应是？",
    options: [
      { label: "正常反应，看看是谁发的", score: 1 },
      { label: "心里\"咯噔\"一下，但很快恢复", score: 2 },
      { label: "下意识肌肉紧张，\"又怎么了\"", score: 3 },
      { label: "已经把所有工作软件的提示音设成静音了，因为听到就血压飙升", score: 4 }
    ]
  },

  // 🌙 成分五：生活褪色指数（Q5, Q10, Q15）
  {
    id: "q5",
    dimension: 'lifeFade',
    title: "你最近一次纯粹因为\"我想做\"而做的事是？",
    options: [
      { label: "就是最近啊，昨天/这周就有", score: 1 },
      { label: "上周？还是上上周？记不太清了", score: 2 },
      { label: "好像得追溯到上次放长假了", score: 3 },
      { label: "……\"我想做\"？这三个字我已经很久没想过了", score: 4 }
    ]
  },
  {
    id: "q10",
    dimension: 'lifeFade',
    title: "你和非工作朋友的关系最近？",
    options: [
      { label: "经常见面/联系，感情依旧铁", score: 1 },
      { label: "联系少了一些，但还保持着", score: 2 },
      { label: "基本靠朋友圈点赞维系感情", score: 3 },
      { label: "朋友约我三次我推了三次，现在他们已经不约了", score: 4 }
    ]
  },
  {
    id: "q15",
    dimension: 'lifeFade',
    title: "如果让你用一句话形容现在的生活状态？",
    options: [
      { label: "\"工作是生活的一部分，但只是一部分\"", score: 1 },
      { label: "\"白天打工，晚上做自己，勉强平衡\"", score: 2 },
      { label: "\"上班为了下班，下班为了上班\"", score: 3 },
      { label: "\"我不是一个人，我是一个工号\"", score: 4 }
    ]
  }
];

export interface BanweiResultData {
  id: string;
  name: string;
  emoji: string;
  level: string;
  tagline: string;
  color: string;
  colorClass: string;
  textColor: string;
  bgColor: string;
  concentrationRange: string;
  overview: string;
  symptoms: string[];
  keywords: string[];
  manifestations: {
    work: string;
    afterWork: string;
    weekend: string;
    holiday: string;
  };
  complications: { name: string; desc: string }[];
  medicalAdvice: string;
  fellowSpecimens: string[];
  antidote: string[];
  quote: string;
  bestMatch: string;
}

export const banweiResults: Record<string, BanweiResultData> = {
  lv1: {
    id: 'lv1',
    name: '班味微量',
    emoji: '🫧',
    level: 'Lv.1',
    tagline: '恭喜您，检测结果显示：您几乎不含班味成分。',
    color: '#B8F0C8',
    colorClass: 'bg-[#B8F0C8]',
    textColor: 'text-emerald-800',
    bgColor: 'bg-emerald-50',
    concentrationRange: '0%-15%',
    overview: '您的样本在实验室标准检测流程中几乎未检出班味成分。仪器多次确认后，实验员开始怀疑是不是搞错了样本。您的存在让整个实验室陷入了沉思——在这个人均班味浓郁的时代，您是怎么保持如此纯净的？',
    symptoms: [
      '周一和周五的精神状态没有明显差异',
      '能准时下班且毫无心理负担',
      '工作群消息只在工作时间查看，下班后完全无视',
      '拥有持续运转的爱好、社交和个人生活',
      '对"内卷"一词感到困惑：不是所有人都到点下班吗？'
    ],
    keywords: ['人间清醒', '职场边界大师', '准时下班冠军', '生活优先', '班味绝缘体'],
    manifestations: {
      work: '准时到岗，高效完成工作，到点走人，绝不磨洋工也绝不加班',
      afterWork: '手机调静音，进入"与工作无关的美好人生"模式',
      weekend: '什么工作？什么工位？我只知道今天要去哪里玩',
      holiday: '从不带电脑出门，也从不在度假时"看一眼消息"'
    },
    complications: [
      { name: '同事不理解综合征', desc: '别人加班时你准点走，收获异样目光若干' },
      { name: '莫名的罪恶感', desc: '偶尔怀疑自己是不是太佛系了，但转念一想——"管他呢"' },
      { name: '精神状态过好引发嫉妒症', desc: '朋友和同事看你的眼神逐渐变成"你到底在哪上班？能把我也弄进去吗"' }
    ],
    medicalAdvice: '请继续保持。您是职场中的稀有物种，请保护好自己的精神生态。您可能不需要这份检测报告的任何建议——事实上，您应该反过来给我们提建议。唯一注意事项：偶尔关心一下同事的情绪，因为您的从容可能正在无形中对他们造成精神伤害。',
    fellowSpecimens: [
      '欧洲打工人（准时下班是写进法律的那种）',
      '国企养老岗位传说中的存在',
      '财务自由后还在上班纯为了交社保的人'
    ],
    antidote: [
      '您不需要解药。事实上，您本身就是解药。',
      '请把您的 work-life balance 秘方分享给身边浓度超标的朋友。'
    ],
    quote: '工作是为了更好地生活，不是反过来。',
    bestMatch: '🧊 Lv.2 班味初现 — 你们能一起享受生活，TA 偶尔羡慕你的清醒，你偶尔好奇 TA 的班味是什么味道。'
  },
  lv2: {
    id: 'lv2',
    name: '班味初现',
    emoji: '🧊',
    level: 'Lv.2',
    tagline: '检测到微量班味成分。别紧张，你还有救。',
    color: '#7DD3FC',
    colorClass: 'bg-[#7DD3FC]',
    textColor: 'text-sky-800',
    bgColor: 'bg-sky-50',
    concentrationRange: '16%-33%',
    overview: '您的样本中检出了微量班味成分，目前处于「入味初期」。就像泡菜刚放进坛子的第一天——表面上看起来还是新鲜蔬菜的样子，但如果你仔细闻，已经能闻到一丝丝发酵的气息了。好消息是：现在抢救还来得及。',
    symptoms: [
      '周一有点不想起床，但周五精神百倍',
      '下班后偶尔会刷一下工作消息，但能控制住不回',
      '开始积累了一些职场口头禅，但还分得清什么时候该说人话',
      '偶尔在周日晚上感到一丝莫名的焦虑',
      '工作和生活还有明确的边界，只是这条线开始微微变模糊了'
    ],
    keywords: ['班味入门', '清醒中带点迷糊', '周一恐惧轻症', '还能抢救', '泡菜初期'],
    manifestations: {
      work: '能正常工作，偶尔摸鱼无罪恶感，整体节奏还不错',
      afterWork: '大部分时间属于自己，但偶尔会心虚地瞄一眼工作群',
      weekend: '大多数时候能开心玩耍，但周日傍晚那个"哎"的叹气越来越响了',
      holiday: '前两天完全释放，第三天开始偶尔想起工作'
    },
    complications: [
      { name: '"我是不是太卷了"自我怀疑症', desc: '偶尔加了一次班就开始反思人生' },
      { name: '职场语言初期感染', desc: '不小心对朋友说了句"我们对齐一下"，然后两个人一起沉默了三秒' },
      { name: '周五狂欢综合征', desc: '一到周五下午就开始精神抖擞，被同事评价为"判若两人"' }
    ],
    medicalAdvice: '您目前处于班味可控阶段，建议加强个人边界建设。下班后手动关闭工作 App 通知（物理隔离法）。每周至少安排 1 次"纯粹因为快乐而做的事"。如果周日开始焦虑，请立刻做一件让自己开心的事打断它。如不加干预，6 个月后预计升级至 Lv.3。',
    fellowSpecimens: [
      '入职 1-2 年的年轻打工人',
      '刚从"工作好有趣"过渡到"工作还行吧"的人',
      '能把"下班后的生活"说得头头是道的人'
    ],
    antidote: [
      '每周一次「数字断联日」：周末一天不看任何工作消息',
      '培养一个和工作完全无关的爱好（越远离办公室越好）',
      '找一个 Lv.1 的朋友，定期被 TA 的清醒能量洗涤一下'
    ],
    quote: '我不是不努力，我是在战略性保存体力。',
    bestMatch: '🧂 Lv.3 班味适中 — TA 比你浓一点，你们可以一起吐槽工作但不至于太丧。'
  },
  lv3: {
    id: 'lv3',
    name: '班味适中',
    emoji: '🧂',
    level: 'Lv.3',
    tagline: '标准打工人配方，浓度恰到好处——恰到好处地惨。',
    color: '#FDE68A',
    colorClass: 'bg-[#FDE68A]',
    textColor: 'text-amber-800',
    bgColor: 'bg-amber-50',
    concentrationRange: '34%-51%',
    overview: '恭喜您（也许该说节哀），您的班味浓度处于统计学意义上的「标准值」。这意味着：全中国大部分打工人和您拥有相同的味道。您就是那个「六边形打工人」——不是最卷的，也不是最摆的，但绝对是被腌得最均匀的。',
    symptoms: [
      '已经建立了一套完整的"工作模式"和"生活模式"，但切换越来越慢',
      '朋友圈里工作相关的内容开始和生活内容五五开',
      '能说出自己公司附近所有外卖的配送时间，精确到分钟',
      '习惯了"周一到周五是工作的，周末是用来恢复的"这种设定',
      '偶尔会想"我为什么要做这份工作"，但想了三秒后就打开了电脑'
    ],
    keywords: ['标准社畜', '打工人公约数', '腌入味ing', '周五战神', '外卖活地图'],
    manifestations: {
      work: '形成自动化工作流程，能在"认真工作"和"高效摸鱼"间无缝切换',
      afterWork: '需要 30 分钟到 1 小时的"缓冲时间"才能进入生活状态。眼神空洞地躺着',
      weekend: '周六修复，周日预焦虑，真正属于自己的快乐大约有 1.5 天',
      holiday: '前半段疯狂快乐，后半段开始计算"还剩几天假"'
    },
    complications: [
      { name: '下班后沙发瘫痪症', desc: '到家后在沙发上"先坐一会儿"，一坐就是两小时' },
      { name: '外卖选择困难症', desc: '不是选不出来，是吃遍了周围所有店，没有新鲜感了' },
      { name: '"我好累但也没干啥"综合征', desc: '每天感觉很累但又说不出来到底累在哪' }
    ],
    medicalAdvice: '您目前处于班味「温水煮青蛙」阶段，最危险的地方在于：您已经开始习惯了。每天给自己设定一个"硬性下班时间"；午休时离开工位走 15 分钟不看手机。这是一个关键分岔口，向上走回Lv.2，向下滑就是Lv.4。',
    fellowSpecimens: [
      '工作 3-5 年的职场人（最大公约数群体）',
      '每天准时在外卖群里接龙的人',
      '微信头像换成了风景照/宠物照的人'
    ],
    antidote: [
      '每周找回一个"以前喜欢但现在不做了"的事情',
      '下班后第一件事不要是躺下，做 10 分钟让自己开心的事',
      '周末安排一个"出门计划"，打破"在家瘫两天"的默认循环'
    ],
    quote: '我没有在摸鱼，我只是在进行战略性精力分配。',
    bestMatch: '🫗 Lv.4 班味浓郁 — 和 TA 一起吐槽工作是最解压的事，痛苦共鸣但还能笑出来。'
  },
  lv4: {
    id: 'lv4',
    name: '班味浓郁',
    emoji: '🫗',
    level: 'Lv.4',
    tagline: '您已经被腌入味了。实验室弥漫着一股浓烈的加班味。',
    color: '#FDBA74',
    colorClass: 'bg-[#FDBA74]',
    textColor: 'text-orange-800',
    bgColor: 'bg-orange-50',
    concentrationRange: '52%-69%',
    overview: '您的班味浓度已达到「浓郁级别」。实验员打开您的样本容器时，空气中立刻弥漫出一股混合着咖啡、外卖和文档格式的复杂气息。您不是在上班——您是被班上了。',
    symptoms: [
      '工作和生活的边界非常模糊，说不清什么时候在"生活"',
      '听到提示音就紧张，看到"在吗"就心跳加速',
      '微信聊天记录里，90% 的对话和工作有关',
      '假期的前两天都在"恢复"，真正享受的时间只有一点点',
      '开始用"幸好我还有工资"来安慰自己'
    ],
    keywords: ['资深牛马', '深度腌制', '工作人格', '在吗恐惧症', '精神离职预备役'],
    manifestations: {
      work: '进入「自动驾驶」模式——手在打字，但灵魂已经飘到了窗外',
      afterWork: '需要至少 2 小时才能切出"工作模式"，很多时候还没切过来就该睡了',
      weekend: '周六恢复体力，周日恢复精力，然后周一又来了。永动机循环',
      holiday: '出门旅游到了景点，第一反应是"这个如果做成 PPT 应该怎么排版"'
    },
    complications: [
      { name: '"在吗"PTSD', desc: '看到这两个字就血压升高，不管是谁发的' },
      { name: '假笑肌肉记忆', desc: '笑得太多，回到家脸部肌肉保持微笑姿势放不下来' },
      { name: '万物皆可汇报综合征', desc: '和朋友讲事情会不自觉按照"背景-问题-方案-结果"结构' }
    ],
    medicalAdvice: '⚠️ 您已进入班味高浓度区间，需要积极干预。立即建立"物理隔离带"；强制安排至少一个"不允许聊工作"的社交活动。如果连续两周感到持续疲惫，请考虑找专业人士聊聊。您正处于"精神离职"的前奏阶段，请善待自己。',
    fellowSpecimens: [
      '"明明讨厌这份工作但还在干"的大多数人',
      '工作日深夜还在群里发消息的人',
      '把"等我忙完这阵子"说了三年的人'
    ],
    antidote: [
      '找一个完全不认识你的环境，你只是你自己，不是"XX公司的XX"',
      '每天写下一件"和工作无关的开心小事"，写不出就是警报',
      '本周内约老朋友吃饭，只聊工作以外的事'
    ],
    quote: '不是我选择了工作，是工作选择了寄生在我身上。',
    bestMatch: '🧂 Lv.3 班味适中 — TA 比你轻一点，能拉你一把。让你想起原来不用这么累的。'
  },
  lv5: {
    id: 'lv5',
    name: '班味爆表',
    emoji: '🔥',
    level: 'Lv.5',
    tagline: '警告：浓度严重超标。您本人已经成为了一种班味来源。',
    color: '#F87171',
    colorClass: 'bg-[#F87171]',
    textColor: 'text-red-800',
    bgColor: 'bg-red-50',
    concentrationRange: '70%-87%',
    overview: '您的样本在放入仪器的瞬间，触发了高浓度警报。实验员在处理您的样本时不得不戴上了防护面罩——不是因为有毒，而是怕班味传染。您不是在上班，您就是"班"本身。',
    symptoms: [
      '已经无法区分工作和生活，因为生活就是工作',
      '最后一次"什么都不做"是什么时候？已经记不清了',
      '朋友圈除了工作相关，剩下的就是加班时拍的深夜写字楼',
      '手机通讯录里最近联系的 20 个人全部是同事/客户',
      '别人问你兴趣爱好，沉默 5 秒钟后说"我喜欢睡觉"'
    ],
    keywords: ['究极工具人', '人形工牌', '精神离职进行中', '生活404', '睡觉是最大爱好'],
    manifestations: {
      work: '存在但不完全存在。身体在工位上，灵魂在别的宇宙',
      afterWork: '"下班"只是一个时间概念，大脑并不会停止处理工作',
      weekend: '周六补觉补到下午，周日焦虑到失眠。净休息时长约等于零',
      holiday: '前三天在恢复，中间一天放松，然后进入返工倒计时的焦虑'
    },
    complications: [
      { name: '周末失语症', desc: '上班时话很多，周末在家一天说不到 10 句话' },
      { name: '快乐能力退化', desc: '以前开心的事现在只能"还行"，情绪调色盘只剩灰阶' },
      { name: '"算了"晚期', desc: '对很多事的反应从"好气"变成了"算了"' }
    ],
    medicalAdvice: '🚨 紧急警告：认真评估当前工作是否值得。强制执行"7天不加班挑战"，看看天会不会塌（不会的）。如果可以，用掉所有的年假。您正处于职业倦怠高峰期，如不干预可能会突然崩溃裸辞。',
    fellowSpecimens: [
      '996 常态化的互联网打工人',
      '年度 OKR 里写着"work-life balance"但从未实现过的人',
      '在深夜出租车上打开电脑改方案的人'
    ],
    antidote: [
      '本周内请一天假。不是因为有事，就是因为"我想休息"',
      '删掉手机上一个工作 App 的通知权限',
      '写一封信给一年前的自己，告诉 TA 你现在的状态'
    ],
    quote: '有人问我梦想是什么，我说——双休。',
    bestMatch: '🔥 Lv.5 班味爆表 — 两个 Lv.5 在一起，不需要说话，一个眼神就能互相理解。'
  },
  lv6: {
    id: 'lv6',
    name: '班味成精',
    emoji: '☢️',
    level: 'Lv.6',
    tagline: '超出仪器量程。您的班味已经进化出了自我意识。',
    color: '#7C3AED',
    colorClass: 'bg-[#7C3AED]',
    textColor: 'text-purple-800',
    bgColor: 'bg-purple-50',
    concentrationRange: '88%-100%',
    overview: '遗憾地通知您：浓度已突破检测上限。仪器发出了从未听过的警报声并自动关机了。技术人员结论：这不是机器故障，是您的班味太浓，超出了科学能解释的范围。班味成精，说的就是您。',
    symptoms: [
      '失去了"下班"的概念。大脑已经没有"非工作模式"了',
      '做梦的内容是写文档、开会——潜意识也在加班',
      '别人约周末，真心实意反问"周末？那不是用来补工作的吗？"',
      '身份证上写着名字，灵魂上写着工号',
      '有人夸你"好敬业"，你苦笑——是忘了怎么不敬业了'
    ],
    keywords: ['班味本味', '工号即身份', '人机合一', '超越打工概念', '已忘记另一种活法'],
    manifestations: {
      work: '你就是「上班」的拟人化。存在本身就是工作在进行',
      afterWork: '理论概念。听说过"下班"，但不确定具体是什么体验',
      weekend: '周末叫"安静的工作日"——没人打扰，效率更高',
      holiday: 'OOO 自动回复写"如有紧急请联系"——真的有人联系——真的回了'
    },
    complications: [
      { name: '身份危机终极版', desc: '如果明天不用上班了，你不知道自己是谁、要做什么' },
      { name: '"忙"成为存在证明', desc: '不忙的时候反而焦虑，因为"不忙 = 没有价值"' },
      { name: '传染性班味', desc: '产生了「辐射效应」，坐在你旁边的同事浓度也上升了' }
    ],
    medicalAdvice: '🔴 红色警报：请立刻、马上给自己放假，别等"忙完"（永远忙不完）。找心理咨询师或信任的人聊聊。尝试回忆：成为"班味成精"前，你是什么样的人？你比你的工作重要！这是一个「觉醒前的至暗时刻」。',
    fellowSpecimens: [
      '"我就是公司，公司就是我"的创业者',
      '工作 10 年从未把年假休完的人',
      '简历上写着"抗压能力强"并且真的很强的人'
    ],
    antidote: [
      '把手机关机 24 小时（对，关机，不是静音）',
      '去完全陌生的地方走走，不带目的，不查攻略',
      '写下 10 个"除了工作以外我是谁"的答案'
    ],
    quote: '我没有在生活中插入工作，我是在工作中插入了一点点呼吸的时间。',
    bestMatch: '🫧 Lv.1 班味微量 — 你需要来自"另一个世界"的人提醒你：人类是可以那样活着的。'
  }
};

export const DIMENSION_NAMES = {
  caffeine: { name: '咖啡因依赖度', emoji: '☕' },
  kpiInvasion: { name: 'KPI 渗透率', emoji: '📊' },
  mentalDrain: { name: '精神内耗浓度', emoji: '🫠' },
  deskBond: { name: '工位依赖症', emoji: '📱' },
  lifeFade: { name: '生活褪色指数', emoji: '🌙' },
};

export function calculateBanweiResult(totalScore: number) {
  const concentration = Math.round(((totalScore - 15) / 45) * 100);
  let levelKey = 'lv1';
  
  if (totalScore <= 22) levelKey = 'lv1';
  else if (totalScore <= 30) levelKey = 'lv2';
  else if (totalScore <= 38) levelKey = 'lv3';
  else if (totalScore <= 46) levelKey = 'lv4';
  else if (totalScore <= 54) levelKey = 'lv5';
  else levelKey = 'lv6';

  return {
    levelKey,
    concentration,
    resultData: banweiResults[levelKey]
  };
}

export function calculateDimensionPercent(dimScore: number) {
  // dimScore is from 3 to 12
  return Math.round(((dimScore - 3) / 9) * 100);
}

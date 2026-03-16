import type { QuizResultDefinition } from "./types"

export type RelationshipPreferenceDimensionKey =
  | "words_of_affirmation"
  | "quality_time"
  | "receiving_gifts"
  | "acts_of_service"
  | "physical_touch"

export const RELATIONSHIP_PREFERENCE_DIMENSIONS = [
  { key: "words_of_affirmation", label: "肯定的言辞", shortLabel: "言辞" },
  { key: "quality_time", label: "精心的时刻", shortLabel: "时刻" },
  { key: "receiving_gifts", label: "接受礼物", shortLabel: "礼物" },
  { key: "acts_of_service", label: "服务的行动", shortLabel: "行动" },
  { key: "physical_touch", label: "身体的接触", shortLabel: "接触" },
] as const satisfies ReadonlyArray<{
  key: RelationshipPreferenceDimensionKey
  label: string
  shortLabel: string
}>

export const RELATIONSHIP_PREFERENCE_PAIR_NARRATIVES: Record<string, string> = {
  "words_of_affirmation|quality_time":
    "你既需要被认真说出来，也需要被认真放在当下。只有表达、没有投入不够；只有陪伴、没有回应也不够。",
  "words_of_affirmation|receiving_gifts":
    "你在意的是“被记住”与“被清楚表达”。一句有分量的话，加上一份带记忆点的小心意，会非常打动你。",
  "words_of_affirmation|acts_of_service":
    "你很难被空话打动，但也不喜欢沉默式付出。对你最有效的是：说到，也做到。",
  "words_of_affirmation|physical_touch":
    "你需要的是语言上的确认，加上身体上的靠近。被温柔说出口、再被靠近，最容易让你放下防备。",
  "quality_time|receiving_gifts":
    "你既在意“陪你的人是不是真的在场”，也在意“这段关系有没有被具体记住”。时间和心意都要落地。",
  "quality_time|acts_of_service":
    "你重视高质量相处，也重视实际照顾。你要的不是形式浪漫，而是有人认真陪你，也认真帮你。",
  "quality_time|physical_touch":
    "你需要的是有存在感的陪伴。一起待着、认真聊天、自然靠近，这些都会让你迅速感到安心。",
  "receiving_gifts|acts_of_service":
    "你最容易被“心意”与“落实”一起打动。光有惊喜不够，真正照顾到你会更有分量。",
  "receiving_gifts|physical_touch":
    "你既会被有纪念感的小心意打动，也会被真实靠近安抚到。你在意关系里有没有“可感知的温度”。",
  "acts_of_service|physical_touch":
    "你偏爱的爱不是高调表达，而是可靠地出现、照顾、靠近。有人把你接住，这件事本身就很浪漫。",
}

export const relationshipPreferenceQuestionContent = [
  {
    id: "q01",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "我喜欢收到你写给我的肯定话语。",
    dimensionA: "words_of_affirmation",
    optionB: "我喜欢你拥抱我。",
    dimensionB: "physical_touch",
  },
  {
    id: "q02",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "我喜欢和你单独相处。",
    dimensionA: "quality_time",
    optionB: "当你给予我实际的帮助时，我会感到被爱。",
    dimensionB: "acts_of_service",
  },
  {
    id: "q03",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "我喜欢你送我礼物。",
    dimensionA: "receiving_gifts",
    optionB: "我喜欢和你一起散步。",
    dimensionB: "quality_time",
  },
  {
    id: "q04",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "当你帮我做事时，我会感到被爱。",
    dimensionA: "acts_of_service",
    optionB: "当你拥抱我或触碰我时，我会感到被爱。",
    dimensionB: "physical_touch",
  },
  {
    id: "q05",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "当你把我拥入怀中时，我会感到被爱。",
    dimensionA: "physical_touch",
    optionB: "当我收到你的礼物时，我会感到被爱。",
    dimensionB: "receiving_gifts",
  },
  {
    id: "q06",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "我喜欢和你一起出去。",
    dimensionA: "quality_time",
    optionB: "我喜欢和你牵手。",
    dimensionB: "physical_touch",
  },
  {
    id: "q07",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "当你认可我时，我会感到被爱。",
    dimensionA: "words_of_affirmation",
    optionB: "看得见的爱的象征（礼物）对我非常重要。",
    dimensionB: "receiving_gifts",
  },
  {
    id: "q08",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "我喜欢靠近你坐着。",
    dimensionA: "physical_touch",
    optionB: "我喜欢你告诉我我很有魅力。",
    dimensionB: "words_of_affirmation",
  },
  {
    id: "q09",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "我喜欢和你共度时光。",
    dimensionA: "quality_time",
    optionB: "我喜欢收到你的小礼物。",
    dimensionB: "receiving_gifts",
  },
  {
    id: "q10",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "当你帮助我时，我知道你爱我。",
    dimensionA: "acts_of_service",
    optionB: "你对我的接纳和认同的话语对我很重要。",
    dimensionB: "words_of_affirmation",
  },
  {
    id: "q11",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "我喜欢我们一起做事情。",
    dimensionA: "quality_time",
    optionB: "我喜欢你对我说的那些温暖的话。",
    dimensionB: "words_of_affirmation",
  },
  {
    id: "q12",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "当我们拥抱时，我感到完整。",
    dimensionA: "physical_touch",
    optionB: "你所做的事比你所说的话更能打动我。",
    dimensionB: "acts_of_service",
  },
  {
    id: "q13",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "我看重你的赞美，也很在意你的批评。",
    dimensionA: "words_of_affirmation",
    optionB: "几份不贵的小礼物比一份昂贵的大礼物更让我感动。",
    dimensionB: "receiving_gifts",
  },
  {
    id: "q14",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "当你触碰我时，我感觉和你更亲近。",
    dimensionA: "physical_touch",
    optionB: "当我们一起聊天或做事时，我感觉和你很亲近。",
    dimensionB: "quality_time",
  },
  {
    id: "q15",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "我喜欢你称赞我的成就。",
    dimensionA: "words_of_affirmation",
    optionB: "当你为我做你自己并不喜欢做的事时，我知道你爱我。",
    dimensionB: "acts_of_service",
  },
  {
    id: "q16",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "我喜欢你路过时碰碰我。",
    dimensionA: "physical_touch",
    optionB: "我喜欢你带着共情倾听我说话。",
    dimensionB: "quality_time",
  },
  {
    id: "q17",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "我真的很享受收到你的礼物。",
    dimensionA: "receiving_gifts",
    optionB: "当你帮我处理家务时，我会感到被爱。",
    dimensionB: "acts_of_service",
  },
  {
    id: "q18",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "我喜欢你夸赞我的外表。",
    dimensionA: "words_of_affirmation",
    optionB: "当你花时间理解我的感受时，我会感到被爱。",
    dimensionB: "quality_time",
  },
  {
    id: "q19",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "当你触碰我时，我感到安心。",
    dimensionA: "physical_touch",
    optionB: "你为我做的服务性行动让我感到被爱。",
    dimensionB: "acts_of_service",
  },
  {
    id: "q20",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "我感激你为我做的许多事情。",
    dimensionA: "acts_of_service",
    optionB: "我喜欢收到你亲手做的礼物。",
    dimensionB: "receiving_gifts",
  },
  {
    id: "q21",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "当你给予我全部的关注时，那种感觉让我非常享受。",
    dimensionA: "quality_time",
    optionB: "当你为我做一些服务性的事情时，那种感觉让我非常享受。",
    dimensionB: "acts_of_service",
  },
  {
    id: "q22",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "当你用礼物为我庆生时，我会感到被爱。",
    dimensionA: "receiving_gifts",
    optionB: "当你用有意义的话语（书面或口头）为我庆生时，我会感到被爱。",
    dimensionB: "words_of_affirmation",
  },
  {
    id: "q23",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "当你帮我做家务时，我会感到被爱。",
    dimensionA: "acts_of_service",
    optionB: "当你送我礼物时，我知道你在想着我。",
    dimensionB: "receiving_gifts",
  },
  {
    id: "q24",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "当你用礼物记住特别的日子时，我很感激。",
    dimensionA: "receiving_gifts",
    optionB: "当你耐心倾听我、不打断我时，我很感激。",
    dimensionB: "quality_time",
  },
  {
    id: "q25",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "我享受和你一起长途旅行。",
    dimensionA: "quality_time",
    optionB: "我希望知道你关心我到愿意帮我处理日常事务。",
    dimensionB: "acts_of_service",
  },
  {
    id: "q26",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "出其不意地亲吻我会让我感到被爱。",
    dimensionA: "physical_touch",
    optionB: "没有特别理由却送我礼物会让我感到被爱。",
    dimensionB: "receiving_gifts",
  },
  {
    id: "q27",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "我喜欢听到你说你欣赏我。",
    dimensionA: "words_of_affirmation",
    optionB: "我喜欢我们说话时你看着我。",
    dimensionB: "quality_time",
  },
  {
    id: "q28",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "你送的礼物对我来说总是很特别。",
    dimensionA: "receiving_gifts",
    optionB: "当你亲吻我时，我会感到被爱。",
    dimensionB: "physical_touch",
  },
  {
    id: "q29",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "当你告诉我你有多感激我时，我会感到被爱。",
    dimensionA: "words_of_affirmation",
    optionB: "当你积极地完成我请你做的事时，我会感到被爱。",
    dimensionB: "acts_of_service",
  },
  {
    id: "q30",
    title: "阅读以下两个描述，选出更符合你的那一个。",
    optionA: "我需要你每天拥抱我。",
    dimensionA: "physical_touch",
    optionB: "我每天都需要你的肯定话语。",
    dimensionB: "words_of_affirmation",
  },
] as const satisfies ReadonlyArray<{
  id: string
  title: string
  optionA: string
  dimensionA: RelationshipPreferenceDimensionKey
  optionB: string
  dimensionB: RelationshipPreferenceDimensionKey
}>

export type RelationshipPreferenceResultProfile = Omit<QuizResultDefinition, "key"> & {
  dimensionKey: RelationshipPreferenceDimensionKey
}

export const RELATIONSHIP_PREFERENCE_RESULT_ORDER = RELATIONSHIP_PREFERENCE_DIMENSIONS.map((item) => item.key)

export const relationshipPreferenceResultContent: Record<
  RelationshipPreferenceDimensionKey,
  RelationshipPreferenceResultProfile
> = {
  words_of_affirmation: {
    dimensionKey: "words_of_affirmation",
    title: "肯定的言辞",
    alias: "被认真说出来",
    nickname: "言辞主通道",
    summary: "你最容易因为被认真表达、被明确肯定、被具体看见而感到被爱。",
    subtitle: "你很看重“爱有没有被说出来”，尤其在乎表达是否具体、认真、有观察。",
    firstImpression: "一句有分量的话，往往比泛泛的甜言蜜语更能真正打动你。",
    overview:
      "你很看重“爱有没有被说出来”。对你来说，真正打动人的，往往不是一句泛泛的“爱你”，而是那些具体、认真、带着观察的表达。你会记得别人是怎么称赞你、理解你、回应你的，也会对敷衍、沉默、理所当然特别敏感。当关系里长期缺少明确表达，你不一定会立刻发作，但心里会慢慢出现“我到底有没有被珍惜”的空缺感。",
    strengthSummary: "你最容易被认真看见、被具体肯定、被清楚地说出来。",
    blindSpotSummary: "长期没有回应、只有模糊表达，会让你慢慢失去被珍惜的确认感。",
    relationshipStyle:
      "你并不是只听甜言蜜语的人，但一段关系若完全没有语言上的回应，你会明显感觉少了点什么。当对方愿意把欣赏、感谢、偏爱说出口，你会更容易确认这段关系的温度。",
    stressMode:
      "你并非不喜欢被夸，而是相比“说得好听”，你更在意别的爱的证据。如果只有漂亮话，却没有陪伴、行动或其他你真正在意的表达，你不太会因此被真正打动。",
    growthAdvice: "多说具体内容，少说模板句；在重要时刻给出明确回应，不要总让你去猜。",
    posterTags: ["被认真看见", "具体表达", "明确回应"],
    shareCopy: "我测出来在关系里最容易被“认真说出来”的方式打动。",
    highlights: ["需要被看见", "对敷衍敏感", "表达要有分量"],
    strengths: [
      "听到对方明确表达“你真的很重要”",
      "收到带着观察和理解的夸奖、感谢与回应",
      "在关键时刻被当面认真说出在乎与珍惜",
    ],
    blindSpots: [
      "长期没有明确回应，总是让我自己去猜",
      "只有泛泛好听的话，却没有更具体的在意",
      "关系里总是敷衍带过，很少认真表达认可与理解",
    ],
    relationshipNotes: [
      "别人可能会误会你“需要很多情绪价值”，其实你更在意的是对方是否愿意认真表达，而不是敷衍带过。",
      "你需要的不是话很多，而是话要真、要准、要有回应感。",
    ],
    growthNotes: [
      "多说具体内容，少说模板句",
      "比起“你很好”，更有效的是“我喜欢你今天处理这件事的方式”",
      "在重要时刻给出明确回应，不要总让对方去猜",
    ],
  },
  quality_time: {
    dimensionKey: "quality_time",
    title: "精心的时刻",
    alias: "被专注陪伴",
    nickname: "时刻主通道",
    summary: "你最容易因为被认真陪伴、被完整倾听、被优先留出时间而感到被爱。",
    subtitle: "你最需要的不是形式上的陪伴，而是“这个时刻里你真的在我这里”。",
    firstImpression: "当一个人愿意把时间和注意力真正留给你，你会强烈感受到被放在心上。",
    overview:
      "你最需要的，不是形式上的陪伴，而是“这个时刻里你真的在我这里”。对你来说，两个人是否同处一个空间并不够，关键在于对方有没有把注意力、耐心和真实参与感给到你。被打断、被边聊边看手机、被随口敷衍，都会比别人更容易让你觉得失落。你真正会记住的，往往是那些被认真倾听、被完整陪伴、被优先安排进日程的时刻。",
    strengthSummary: "被认真倾听、被完整陪伴、被优先安排进日程，是你最有感觉的被爱方式。",
    blindSpotSummary: "人在你面前，注意力却不在你这里，会比“没见面”更让你失落。",
    relationshipStyle:
      "你对时间投入很敏感，哪怕主语言不是它，你依然会因为“对方有没有认真在场”来判断关系温度。当陪伴质量很高时，你对这段关系的安全感会明显上升。",
    stressMode:
      "你不排斥陪伴，只是相比“花多久在一起”，你更看重别的表达方式。如果相处时间普通，但其他你更在意的通道被满足，你依然可能感觉关系是稳定的。",
    growthAdvice: "见面时减少分心，给出完整、稳定、可感知的相处时段；先听完，再建议。",
    posterTags: ["专注在场", "认真倾听", "完整陪伴"],
    shareCopy: "我最容易因“被认真陪伴”而感到被爱。",
    highlights: ["需要在场感", "注重相处质量", "对分心很敏感"],
    strengths: [
      "对方愿意完整听你说完，不急着打断或敷衍",
      "约会时把注意力留给你，而不是把陪伴做成背景音",
      "主动安排只属于你们的时间，并认真投入当下",
    ],
    blindSpots: [
      "边陪伴边分心，看手机或心不在焉",
      "总把你排在其他事项之后，很少被优先安排",
      "相处时间很多，但交流质量很低、回应感很弱",
    ],
    relationshipNotes: [
      "别人容易以为你“黏人”，实际上你更在意的是相处质量，而不是机械拉长时长。",
      "你不是要一直见面，而是要在一起时，彼此真的在一起。",
    ],
    growthNotes: [
      "见面时减少分心，别把陪伴做成背景音",
      "给出完整、稳定、可感知的相处时段",
      "当你倾诉时，先听完再建议",
    ],
  },
  receiving_gifts: {
    dimensionKey: "receiving_gifts",
    title: "接受礼物",
    alias: "被记住、被惦记",
    nickname: "礼物主通道",
    summary: "你最容易因为被记住、被惦记、收到有记忆点和心思的心意而感到被爱。",
    subtitle: "你在意的不是价格，而是那种“对方有把我记在心里”的具体证据。",
    firstImpression: "真正打动你的，通常不是贵，而是准——礼物有没有真的和你有关。",
    overview:
      "你在意的不是价格，而是那种“对方有把我记在心里”的具体证据。对你来说，一份礼物的价值常常不在贵，而在准：它是否真的贴近你的喜好、回忆、需要与被惦记感。你容易被那些带着观察、纪念和心思的小东西打动，因为它们会把爱从抽象情绪变成能被看见、留住、反复回想的证据。",
    strengthSummary: "那些被认真准备、很“像你”的小心意，会让你感觉自己真的被记住了。",
    blindSpotSummary: "重要时刻总被忘记，或者心意总停留在嘴上不落地，会让你觉得少了一层被认真对待。",
    relationshipStyle:
      "你会被礼物打动，尤其当它不是完成任务式送出，而是真的和你有关。它像是你关系里的“加深记忆点”，会让你更容易记住被爱的瞬间。",
    stressMode:
      "你不是不喜欢收礼物，而是礼物本身通常不是你判断爱的主要通道。如果只有礼物、没有其他更核心的表达，你未必会因此感到足够满足。",
    growthAdvice: "不一定贵，但一定要“像你”；把礼物和具体记忆连接起来，比随手买更有感。",
    posterTags: ["被记住", "心意落地", "有纪念感"],
    shareCopy: "原来我不是在意礼物本身，而是在意那种“你真的记得我”的感觉。",
    highlights: ["在意心意感", "需要记忆点", "对敷衍式送礼无感"],
    strengths: [
      "收到能贴近你喜好、回忆和细节的小礼物",
      "在普通日子里也有被惦记、被想到的心意",
      "重要时刻有能被留住、反复想起的纪念感",
    ],
    blindSpots: [
      "重要日子总被忘记，关系缺少被具体记住的痕迹",
      "礼物只是完成任务，没有任何“像你”的感觉",
      "只有口头表达，却几乎没有可留存、可回想的心意",
    ],
    relationshipNotes: [
      "别人容易把你误解成“物质”，其实你更在意的是对方有没有在细节上记住你、用心对待你。",
      "你在意的不是贵，而是那份心意有没有真正和你有关。",
    ],
    growthNotes: [
      "不一定贵，但一定要“像你”",
      "把礼物和具体记忆连接起来，比随手买更有感",
      "平时的小心意，常常比节日的标准化礼盒更打动你",
    ],
  },
  acts_of_service: {
    dimensionKey: "acts_of_service",
    title: "服务的行动",
    alias: "被照顾、被接住",
    nickname: "行动主通道",
    summary: "你最容易因为被主动分担、被照顾、被落实到行动里而感到被爱。",
    subtitle: "你对“爱有没有落到行动上”非常敏感，照顾与落实本身就是爱的证明。",
    firstImpression: "有人愿意替你把事情接过去、把负担分掉，会比很多漂亮话更让你安心。",
    overview:
      "你对“爱有没有落到行动上”非常敏感。对你来说，真正让人安心的，往往不是说得多漂亮，而是对方有没有愿意动手、分担、照顾、落实。当你累、乱、忙的时候，有人替你把事情接过去、把细节处理好、把负担分掉，你会比收到很多漂亮话更有被爱的感觉。如果一个人总是“嘴上有你，行动里没你”，你会很快失去耐心。",
    strengthSummary: "记得、做到、提前安排、主动帮忙、减少你的负担，都是你最容易接收到的爱。",
    blindSpotSummary: "关键时刻接不住、只会安慰不愿意上手，会让你很快觉得关系不够可靠。",
    relationshipStyle:
      "你对行动兑现度很看重，虽然不一定排第一，但它会直接影响你对关系可靠性的判断。对你来说，照顾不是浪漫的对立面，反而是很真实的浪漫。",
    stressMode:
      "你当然会感谢别人帮忙，但相比“做了什么”，你可能更先被别的通道打动。单纯的照顾与安排，不一定足以让你感觉情感被真正触达。",
    growthAdvice: "少一点“你要我做什么就说”，多一点主动察觉；关键时刻伸手帮一把，比临时安慰更有用。",
    posterTags: ["说到做到", "主动分担", "被可靠接住"],
    shareCopy: "对我来说，爱最有力的时候，往往是有人真的替我分担。",
    highlights: ["重视兑现度", "偏好可靠感", "讨厌空转"],
    strengths: [
      "有人主动察觉你的忙乱并直接帮上手",
      "在你最累的时候，有人把具体事项安排和接住",
      "对方用落实、分担和照顾，让你不必独自扛着",
    ],
    blindSpots: [
      "嘴上在乎，关键时刻却接不住你",
      "总说“你要我做什么就说”，却很少主动察觉",
      "承诺很多，但细节和落实总是一再落空",
    ],
    relationshipNotes: [
      "别人容易把你看成“务实到不浪漫”，其实你只是更相信：爱如果是真的，通常会体现在愿不愿意做事。",
      "你在意的不是被安排，而是对方愿不愿意把你放进自己的行动里。",
    ],
    growthNotes: [
      "少一点“你要我做什么就说”，多一点主动察觉",
      "比起空头承诺，按时出现、落实细节更能打动你",
      "在你最忙最乱时伸手帮一把，效果远胜临时安慰",
    ],
  },
  physical_touch: {
    dimensionKey: "physical_touch",
    title: "身体的接触",
    alias: "被温柔靠近",
    nickname: "接触主通道",
    summary: "你最容易因为自然靠近、被抱住安抚、身体上的回应与陪伴而感到被爱。",
    subtitle: "亲密感常常是通过“靠近”被确认的，身体回应会直接影响你对关系温度的感受。",
    firstImpression: "一个拥抱、一只牵住的手、情绪不好时被抱住安抚，都会让你很快确认“我没有被推远”。",
    overview:
      "你对身体距离很敏感，亲密感常常是通过“靠近”被真正确认的。一个拥抱、一只牵住的手、靠在一起的安静时刻、情绪不好时被抱住安抚，这些都会直接影响你对关系温度的感受。对你来说，身体接触不是可有可无的小动作，而是一种非常直接的“我在你身边”的信号。当关系里长期缺少自然靠近、亲密触碰或身体上的回应，你会很容易感觉疏离。",
    strengthSummary: "自然的靠近、牵手、拥抱与温柔回应，会让你快速感到安心和被在乎。",
    blindSpotSummary: "日常里越来越少自然靠近，或者在你需要安抚时没有身体回应，会让你很快感到被推远。",
    relationshipStyle:
      "你对身体靠近有明显好感，它会增强你被在乎、被接住的感受。当接触和你的主语言一起出现时，你会更快进入关系里的安心状态。",
    stressMode:
      "你并不排斥亲密接触，只是它通常不是你判断关系好坏的第一信号。如果别的核心通道没有被满足，再多拥抱也未必能真正解决你的失落感。",
    growthAdvice: "见面时主动靠近；在情绪不稳时给稳定、温柔、尊重边界的接触；别只在热烈时靠近。",
    posterTags: ["温柔靠近", "身体回应", "日常安全感"],
    shareCopy: "我在关系里很吃“靠近感”——被温柔抱住，比很多话都更有用。",
    highlights: ["需要靠近感", "对疏离敏感", "日常触碰很重要"],
    strengths: [
      "见面时自然被拥抱、牵手、靠近",
      "情绪不稳时被温柔安抚，而不是被晾在一边",
      "在平常的相处里也有稳定、自然、不过度表演的亲密动作",
    ],
    blindSpots: [
      "关系里越来越少自然靠近与安抚",
      "情绪最不稳的时候，却得不到身体上的回应",
      "只有口头表达，却长期缺少真实靠近的温度",
    ],
    relationshipNotes: [
      "别人可能会误会你“过度依赖亲密动作”，其实你更在意的是通过身体靠近确认彼此没有被推远。",
      "你在意的不是表演式亲密，而是稳定、自然、尊重边界的靠近。",
    ],
    growthNotes: [
      "见面时主动靠近，比等对方开口更有感",
      "在情绪不稳时，先给稳定、温柔、尊重边界的接触",
      "不要只在热烈时靠近，日常里的自然触碰更有安全感",
    ],
  },
}

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
    title: "哪一种更容易让你感到被爱？",
    optionA: "对方认真告诉我“你真的很重要”。",
    dimensionA: "words_of_affirmation",
    optionB: "对方放下手机，只专心陪我一会儿。",
    dimensionB: "quality_time",
  },
  {
    id: "q02",
    title: "哪一种更容易让你感到被爱？",
    optionA: "收到一段具体夸我、肯定我的消息。",
    dimensionA: "words_of_affirmation",
    optionB: "收到一份明显为我花过心思的小礼物。",
    dimensionB: "receiving_gifts",
  },
  {
    id: "q03",
    title: "哪一种更容易让你感到被爱？",
    optionA: "听到对方明确说“辛苦了，我懂你”。",
    dimensionA: "words_of_affirmation",
    optionB: "对方直接帮我把麻烦事处理掉。",
    dimensionB: "acts_of_service",
  },
  {
    id: "q04",
    title: "哪一种更容易让你感到被爱？",
    optionA: "对方当面说出在乎和喜欢。",
    dimensionA: "words_of_affirmation",
    optionB: "对方先抱住我、靠近我。",
    dimensionB: "physical_touch",
  },
  {
    id: "q05",
    title: "哪一种更容易让你感到被爱？",
    optionA: "和对方有一段不被打扰的专注相处。",
    dimensionA: "quality_time",
    optionB: "对方带来一个让我感觉“你有记得我”的小心意。",
    dimensionB: "receiving_gifts",
  },
  {
    id: "q06",
    title: "哪一种更容易让你感到被爱？",
    optionA: "对方专门空出半天时间，只想和我待在一起。",
    dimensionA: "quality_time",
    optionB: "对方主动帮我分担手头的琐事。",
    dimensionB: "acts_of_service",
  },
  {
    id: "q07",
    title: "哪一种更容易让你感到被爱？",
    optionA: "和对方一边散步一边认真聊天。",
    dimensionA: "quality_time",
    optionB: "和对方安静牵手或依偎在一起。",
    dimensionB: "physical_touch",
  },
  {
    id: "q08",
    title: "哪一种更容易让你感到被爱？",
    optionA: "在普通日子里收到一份被认真挑选的心意。",
    dimensionA: "receiving_gifts",
    optionB: "对方默默替我把事情做好。",
    dimensionB: "acts_of_service",
  },
  {
    id: "q09",
    title: "哪一种更容易让你感到被爱？",
    optionA: "收到一件很懂我的小礼物。",
    dimensionA: "receiving_gifts",
    optionB: "在我情绪低落时被温柔抱住。",
    dimensionB: "physical_touch",
  },
  {
    id: "q10",
    title: "哪一种更容易让你感到被爱？",
    optionA: "对方不用我开口，就主动把该做的事做好。",
    dimensionA: "acts_of_service",
    optionB: "我累的时候，对方靠近我、抱一抱我。",
    dimensionB: "physical_touch",
  },
  {
    id: "q11",
    title: "哪一种更容易让你感到被爱？",
    optionA: "听到对方说“我一直很欣赏你这点”。",
    dimensionA: "words_of_affirmation",
    optionB: "对方特地把今晚留给我，不被别人打扰。",
    dimensionB: "quality_time",
  },
  {
    id: "q12",
    title: "哪一种更容易让你感到被爱？",
    optionA: "对方公开认可我的用心和付出。",
    dimensionA: "words_of_affirmation",
    optionB: "纪念日收到一份明显按我喜好准备的礼物。",
    dimensionB: "receiving_gifts",
  },
  {
    id: "q13",
    title: "哪一种更容易让你感到被爱？",
    optionA: "闹别扭后，对方认真表达理解和重视。",
    dimensionA: "words_of_affirmation",
    optionB: "闹别扭后，对方直接用行动把问题修补好。",
    dimensionB: "acts_of_service",
  },
  {
    id: "q14",
    title: "哪一种更容易让你感到被爱？",
    optionA: "我难过时，听到一句“我在，你不用一个人扛”。",
    dimensionA: "words_of_affirmation",
    optionB: "我难过时，对方先握住我或抱住我。",
    dimensionB: "physical_touch",
  },
  {
    id: "q15",
    title: "哪一种更容易让你感到被爱？",
    optionA: "周末和对方有一段完整、专注的约会时间。",
    dimensionA: "quality_time",
    optionB: "对方出门回来时，带回一份让我会心一笑的小手信。",
    dimensionB: "receiving_gifts",
  },
  {
    id: "q16",
    title: "哪一种更容易让你感到被爱？",
    optionA: "对方愿意坐下来，耐心听我把整件事说完。",
    dimensionA: "quality_time",
    optionB: "对方会直接上手帮我一起处理眼前的问题。",
    dimensionB: "acts_of_service",
  },
  {
    id: "q17",
    title: "哪一种更容易让你感到被爱？",
    optionA: "看完电影后，对方继续认真和我聊感受。",
    dimensionA: "quality_time",
    optionB: "看电影时能自然靠在一起、牵着手。",
    dimensionB: "physical_touch",
  },
  {
    id: "q18",
    title: "哪一种更容易让你感到被爱？",
    optionA: "节日里收到一份有纪念意义的礼物。",
    dimensionA: "receiving_gifts",
    optionB: "节日里对方提前把需要张罗的事都安排好。",
    dimensionB: "acts_of_service",
  },
  {
    id: "q19",
    title: "哪一种更容易让你感到被爱？",
    optionA: "平常日里突然收到一份小惊喜。",
    dimensionA: "receiving_gifts",
    optionB: "一见面就先得到一个很实在的拥抱。",
    dimensionB: "physical_touch",
  },
  {
    id: "q20",
    title: "哪一种更容易让你感到被爱？",
    optionA: "生病或状态差时，对方会照顾我、替我处理具体事务。",
    dimensionA: "acts_of_service",
    optionB: "生病或状态差时，对方会陪在身边、抱抱我。",
    dimensionB: "physical_touch",
  },
  {
    id: "q21",
    title: "哪一种更容易让你感到被爱？",
    optionA: "听到对方具体说出我哪里让他/她喜欢。",
    dimensionA: "words_of_affirmation",
    optionB: "对方专程来见我一面，即使时间不长。",
    dimensionB: "quality_time",
  },
  {
    id: "q22",
    title: "哪一种更容易让你感到被爱？",
    optionA: "收到一段长消息，清楚表达珍惜与欣赏。",
    dimensionA: "words_of_affirmation",
    optionB: "收到一件对方记得我随口提过、后来特地准备的东西。",
    dimensionB: "receiving_gifts",
  },
  {
    id: "q23",
    title: "哪一种更容易让你感到被爱？",
    optionA: "在我压力大时，听到一句“我知道你最近真的不容易”。",
    dimensionA: "words_of_affirmation",
    optionB: "在我压力大时，对方直接替我分掉一部分任务。",
    dimensionB: "acts_of_service",
  },
  {
    id: "q24",
    title: "哪一种更容易让你感到被爱？",
    optionA: "被当面认真说一句“你对我很重要”。",
    dimensionA: "words_of_affirmation",
    optionB: "在委屈的时候，被抱住安抚。",
    dimensionB: "physical_touch",
  },
  {
    id: "q25",
    title: "哪一种更容易让你感到被爱？",
    optionA: "旅行时，对方把注意力都放在和我一起体验这件事上。",
    dimensionA: "quality_time",
    optionB: "旅行结束后，带回一个有意义、能留住回忆的小纪念。",
    dimensionB: "receiving_gifts",
  },
  {
    id: "q26",
    title: "哪一种更容易让你感到被爱？",
    optionA: "我倾诉时，对方不打断、不敷衍，真的听进去。",
    dimensionA: "quality_time",
    optionB: "我忙乱时，对方直接过来帮我一起收拾、处理。",
    dimensionB: "acts_of_service",
  },
  {
    id: "q27",
    title: "哪一种更容易让你感到被爱？",
    optionA: "晚饭后，和对方慢慢走、慢慢聊很久。",
    dimensionA: "quality_time",
    optionB: "晚饭后，和对方自然靠在一起，不必说太多话。",
    dimensionB: "physical_touch",
  },
  {
    id: "q28",
    title: "哪一种更容易让你感到被爱？",
    optionA: "对方记住特别的日子，并准备让我觉得“被放在心上”的礼物。",
    dimensionA: "receiving_gifts",
    optionB: "对方一早就帮我把繁琐事项安排妥当。",
    dimensionB: "acts_of_service",
  },
  {
    id: "q29",
    title: "哪一种更容易让你感到被爱？",
    optionA: "收到一件能被我长期留着、反复想起这段关系的东西。",
    dimensionA: "receiving_gifts",
    optionB: "在情绪不稳的时候，被轻轻抱住或贴近。",
    dimensionB: "physical_touch",
  },
  {
    id: "q30",
    title: "哪一种更容易让你感到被爱？",
    optionA: "对方会主动接送、照顾、处理具体安排。",
    dimensionA: "acts_of_service",
    optionB: "对方会用拥抱、牵手、靠近来表达在乎。",
    dimensionB: "physical_touch",
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

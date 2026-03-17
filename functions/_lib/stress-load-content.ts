import type { QuizRuntimeConfig } from "./types"

export const stressLoadQuestions = [
  // D1 任务超载（Q1-Q5）
  { id: "q1", title: "我经常觉得要处理的事情明显多于我的时间和精力。", axisKey: "D1" },
  { id: "q2", title: "一件事刚做完，下一件事就立刻顶上来，让我很难真正喘口气。", axisKey: "D1" },
  { id: "q3", title: "即使在休息时，我脑子里也常挂着“还有很多没做完”。", axisKey: "D1" },
  { id: "q4", title: "我经常同时记着很多待办，以至于很难彻底放松。", axisKey: "D1" },
  { id: "q5", title: "一天结束后，我常有一种“忙了很久但还是没消化完事情”的感觉。", axisKey: "D1" },

  // D2 掌控流失（Q6-Q10）
  { id: "q6", title: "最近我经常觉得生活节奏不是我在安排，而是我在被推着走。", axisKey: "D2" },
  { id: "q7", title: "一点临时变化，就很容易打乱我整天的状态。", axisKey: "D2" },
  { id: "q8", title: "我时常觉得重要的事情并不在我的掌控范围内。", axisKey: "D2" },
  { id: "q9", title: "面对问题时，我第一反应更像是“我又要被压住了”，而不是“我能处理”。", axisKey: "D2" },
  { id: "q10", title: "我最近常有一种“再怎么努力，也追不上变化”的无力感。", axisKey: "D2" },

  // D3 预警常开（Q11-Q15）
  { id: "q11", title: "明明事情还没发生，我却会提前在脑子里反复预演最坏情况。", axisKey: "D3" },
  { id: "q12", title: "听到消息提示音、电话或临时通知时，我身体会下意识紧一下。", axisKey: "D3" },
  { id: "q13", title: "到了晚上、周末或假期，我也很难完全停止对接下来事情的担心。", axisKey: "D3" },
  { id: "q14", title: "有些事还没开始，我已经先被它耗掉很多心理能量。", axisKey: "D3" },
  { id: "q15", title: "我最近很少有“真的放心了”的状态，总像还有什么在后面等着我。", axisKey: "D3" },

  // D4 恢复断电（Q16-Q20）
  { id: "q16", title: "即使睡了一觉，我也不太觉得自己真正恢复过来。", axisKey: "D4" },
  { id: "q17", title: "做以前喜欢的事，也不一定能让我明显放松。", axisKey: "D4" },
  { id: "q18", title: "我明明在休息，但大脑并没有一起停下来。", axisKey: "D4" },
  { id: "q19", title: "即便当天没有特别忙，我也常像一直处于“工作模式”里。", axisKey: "D4" },
  { id: "q20", title: "最近让我感到“完全轻松”的时刻，比以前少了很多。", axisKey: "D4" },

  // D5 情绪磨损（Q21-Q25）
  { id: "q21", title: "我比以前更容易烦躁、没耐心，或者突然很想躲开所有人。", axisKey: "D5" },
  { id: "q22", title: "一些不算大的事，也会让我觉得格外心累。", axisKey: "D5" },
  { id: "q23", title: "我最近更懒得解释、社交或回应外界。", axisKey: "D5" },
  { id: "q24", title: "我知道自己应该调整状态，但常常提不起真正行动的力气。", axisKey: "D5" },
  { id: "q25", title: "我经常觉得自己像被慢慢磨薄了一层，不是突然崩掉，而是持续被耗着。", axisKey: "D5" },
]

export const stressLoadDimensions = [
  { key: "D1", label: "任务超载" },
  { key: "D2", label: "掌控流失" },
  { key: "D3", label: "预警常开" },
  { key: "D4", label: "恢复断电" },
  { key: "D5", label: "情绪磨损" },
]

export const stressLoadLevels = [
  { key: "L1", min: 0, max: 19, name: "轻压巡航", summary: "有压力，但系统整体仍在可恢复区间" },
  { key: "L2", min: 20, max: 39, name: "持续拉紧", summary: "已经开始长时间绷着，放松效率下降" },
  { key: "L3", min: 40, max: 59, name: "高压积载", summary: "压力正在累积，多个维度出现明显超载" },
  { key: "L4", min: 60, max: 79, name: "过载边缘", summary: "系统持续高压运转，恢复明显跟不上消耗" },
  { key: "L5", min: 80, max: 100, name: "超载警报", summary: "你的心理系统已接近或进入严重超负荷区间" },
]

export const stressLoadProfiles = [
  { key: "P1", dimensionKey: "D1", name: "任务洪流型", issue: "事太多，脑内待办永不清零" },
  { key: "P2", dimensionKey: "D2", name: "失控悬挂型", issue: "最耗你的，不一定是忙，而是失控感。" },
  { key: "P3", dimensionKey: "D3", name: "预警常开型", issue: "系统长期处于提前戒备状态。" },
  { key: "P4", dimensionKey: "D4", name: "恢复断电型", issue: "你不是真的没休息，而是休息已经恢复不了你。" },
  { key: "P5", dimensionKey: "D5", name: "情绪磨损型", issue: "压力已经开始慢慢磨损你的情绪弹性。" },
]

export const stressLoadRuntime: QuizRuntimeConfig = {
  meta: {
    slug: "stress-load-test",
    title: "压力负荷测试",
    summary: "测测最近 30 天，你的心理系统到底承受了多少重量",
    estimatedMinutes: 5,
    tags: ["压力负荷", "25 题", "心理状态", "深度报告"],
    category: "心理状态 / 压力",
  },
  runtime: {
    rendererKey: "custom",
    resultTemplateKey: "custom",
    scoringKey: "radar",
  },
  presentation: {
    themeKey: "midnight-stress",
    storyMode: true,
    screenCount: 5,
    shareCardKey: "stress-load-poster",
  },
  questions: stressLoadQuestions.map((q) => ({
    ...q,
    type: "single_choice" as const,
    options: [
      { id: `${q.id}_1`, label: "几乎没有", value: { [q.axisKey]: 1 } },
      { id: `${q.id}_2`, label: "偶尔如此", value: { [q.axisKey]: 2 } },
      { id: `${q.id}_3`, label: "有时如此", value: { [q.axisKey]: 3 } },
      { id: `${q.id}_4`, label: "经常如此", value: { [q.axisKey]: 4 } },
      { id: `${q.id}_5`, label: "几乎总是", value: { [q.axisKey]: 5 } },
    ],
  })),
  results: stressLoadProfiles.map((p) => ({
    key: p.key,
    title: p.name,
    summary: p.issue,
    dimensionKey: p.dimensionKey,
  })),
  extensions: {
    scoring: {
      dimensions: stressLoadDimensions,
    },
    stressLoad: {
      levels: stressLoadLevels,
      profiles: stressLoadProfiles,
    },
  },
}

本文档从“可商用、可配置、可扩展”的角度，重新定义灵测 SoulTest 的题库资源获取、评分引擎与题集配置策略。

本次修订的目标有三点：

1. 修正旧文档中对商用版权过于乐观的表述
2. 明确“通用核心 + 自定义扩展”的题集配置方向
3. 让资源获取、JSON 配置、结果页设计和上线流程真正形成闭环

---

## 1. 资源获取原则

### 1.1 不再把“可参考”误写成“可直接商用”

题库资源必须分成三类管理：

| 分类 | 含义 | 可否直接用于付费商品 |
| --- | --- | --- |
| **可直接商用** | 许可证明确允许商业使用，或为自研原创 | 可以 |
| **可改编后谨慎使用** | 可参考其结构、维度、算法，但需重写题目与结果文案，并保留来源记录 | 视具体许可证和改编程度而定 |
| **仅可参考，不可直接商用** | 带 `NC`、版权不清晰、品牌/插画受保护 | 不可以 |

### 1.2 当前资源判断

| 资源 | 用途 | 当前判断 |
| --- | --- | --- |
| **Open Psychometrics / 开源量表数据** | 研究、维度结构、评分思路参考 | 需逐项确认具体许可，不统一视作可商用 |
| **OEJTS / OpenJungTypes** | MBTI 类测试的维度结构与算法参考 | 仅建议作方法参考，不建议直接复制题目进入付费商品 |
| **BigFive-test（MIT）** | 大五人格题库与实现参考 | 许可相对友好，但仍建议保留来源与改编记录 |
| **Dirty Dozen / SD-3 等公开量表** | 雷达型人格测试的维度与题目参考 | 更适合作为公开学术量表参考，但中文商业呈现仍建议二次加工 |
| **五种爱情语言等流行框架** | 品类思路、结果结构参考 | 建议自编题目与结果文案，不直接照搬现成商业站点内容 |

### 1.3 平台级要求：每套题必须带来源元数据

每个 `quiz_version` 都应记录 `sourceManifest`，至少包含：

```json
{
  "sourceType": "original | adapted | reference_only",
  "sourceName": "Open Psychometrics",
  "license": "CC BY-NC-SA 4.0",
  "commercialRisk": "high",
  "notes": "仅参考维度结构，题目与结果文案已重写"
}
```

这样做的价值：

- 后期排查版权风险时不需要回忆
- 多人协作时不会误把“可参考”当成“可商用”
- 后台以后可直接筛出高风险题集做复查

---

## 2. 评分模式与平台抽象

### 2.1 评分模式总览

当前平台仍然采用五种模式的分类方式：

| 模式 | 说明 | 典型测试 |
| --- | --- | --- |
| `accumulate` | 选项给一个或多个结果加分，最高分胜出 | 城市匹配、动物人格 |
| `dimension` | 二元维度对立计分，组合成类型 | MBTI 类测试 |
| `radar` | 多个独立维度同时计分 | 暗黑三角、爱情语言 |
| `range` | 总分落区间，映射为等级结果 | 社死指数、恋爱脑指数 |
| `branch` | 决策树式跳转，不依赖传统加分 | 前世今生、剧情测试 |

### 2.2 代码层抽象

从实现角度，平台只需要三类执行器：

1. **通用评分执行器**：覆盖 `accumulate / dimension / radar / range`
2. **分支执行器**：覆盖 `branch`
3. **自定义执行器**：留给高复杂度题集，例如大体量专业测评或强叙事专属玩法

也就是说，平台可以保持统一底座，但不强迫所有题集都完全“模板化”。

---

## 3. 题集配置方向：通用核心 + 自定义扩展

### 3.1 设计立场

你提出的判断是正确的：

- 简单趣味测试适合完全走通用模型
- 体量大、专业性高、或高度依赖专属 UI/UX 的题集，不适合被一个死板 schema 完全约束

所以平台不追求“所有题集同构”，而是追求：

- **最小公共契约统一**
- **专属能力可挂接**

### 3.2 推荐结构

```ts
interface QuizConfig {
  meta: QuizMeta;
  runtime: RuntimeConfig;
  scoring: ScoringConfig;
  questions: Question[];
  results: ResultDefinition[];
  presentation?: PresentationConfig;
  sourceManifest?: SourceManifest;
  extensions?: Record<string, unknown>;
}

interface RuntimeConfig {
  rendererKey: 'generic' | string;
  scoringKey: 'accumulate' | 'dimension' | 'radar' | 'range' | 'branch' | string;
  resultTemplateKey: 'generic' | string;
}
```

### 3.3 平台约束什么，不约束什么

**平台强约束：**

- 题集最小元数据
- 题目数组与结果数组
- 运行时键值
- 来源元数据
- 发布与版本机制

**平台不强约束：**

- 每种题集的细节布局
- 复杂图表数据结构
- 特殊结果页叙事形式
- 个别题集的专属算法参数

这些特殊能力都进入 `extensions`。

### 3.4 一个典型的扩展示例

```json
{
  "runtime": {
    "rendererKey": "mbti-pro",
    "scoringKey": "custom:oejts-like",
    "resultTemplateKey": "mbti-annual-report"
  },
  "extensions": {
    "mbtiPro": {
      "dimensionOrder": ["EI", "SN", "TF", "JP"],
      "showPercentBars": true,
      "showRoleCards": true
    }
  }
}
```

这样能保证：

- 后台仍把它当“一个题集版本”管理
- 运行时仍由统一 API 下发
- 前端根据 `rendererKey` 选择专属页面逻辑

---

## 4. 通用题目与结果结构建议

### 4.1 题目结构

```ts
interface Question {
  id: string;
  type: string;
  text: string;
  description?: string;
  image?: string;
  options?: Option[];
  config?: Record<string, unknown>;
}

interface Option {
  id: string;
  text: string;
  image?: string;
  scores?: ScoreRule[];
  nextQuestionId?: string;
  meta?: Record<string, unknown>;
}

interface ScoreRule {
  target: string;
  value: number;
  side?: 'A' | 'B';
}
```

### 4.2 结果结构

```ts
interface ResultDefinition {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  tags?: string[];
  image?: string;
  themeKey?: string;
  meta?: Record<string, unknown>;
}
```

### 4.3 展示配置

```ts
interface PresentationConfig {
  themeKey?: string;
  storyMode?: boolean;
  screenCount?: number;
  shareCardKey?: string;
  sections?: Array<Record<string, unknown>>;
}
```

这里的关键点是：

- 通用题集只使用 `themeKey`、`screenCount` 即可
- 复杂题集可在 `sections` 和 `extensions` 中塞入专属展示配置

---

## 5. 资源获取到上线的完整链路

### 5.1 标准工作流

```text
收集资源
  -> 判断许可证与商用风险
  -> 翻译/重写/本地化
  -> 配置 QuizConfig
  -> 补 sourceManifest
  -> 本地校验计分逻辑
  -> 设计结果页映射
  -> 进入 quiz_versions 草稿
  -> 预览
  -> 发布
```

### 5.2 翻译与本地化原则

- 不直接做生硬直译
- 要转成小红书用户更自然的表达方式
- 结果文案优先提供情绪价值，避免冷冰冰学术口吻
- 趣味题目可更口语化，专业题目则控制娱乐化程度

### 5.3 题目加工程度建议

| 类型 | 加工建议 |
| --- | --- |
| 纯娱乐向自创测试 | AI 生成初稿 + 人工调优 + 自建结果体系 |
| 学术量表改编测试 | 保留维度逻辑，重写题目语气与结果表达 |
| 商用风险高的来源 | 仅保留方法参考，不直接迁移题目或视觉素材 |

---

## 6. 不同题集类型的落地建议

### 6.1 适合完全通用化的题集

- 灵魂城市匹配
- 动物人格
- 社死指数
- 恋爱脑指数
- 各类轻娱乐人格匹配

这些题集通常可直接使用：

- 通用题型组件
- 通用评分执行器
- 通用结果模板

### 6.2 适合“半通用 + 扩展”的题集

- MBTI 类测试
- 大五人格
- 爱情语言
- 暗黑三角
- 九型人格

这些题集的共性是：

- 核心仍可复用统一计分框架
- 但结果页常常需要专属解释、专属图表或更多配置项

### 6.3 适合专属执行器的题集

- 大量分支剧情测试
- 高专业度长报告测试
- 极度依赖专属交互与动画节奏的题集

这些题集不应反向污染通用平台模型，而应通过 `rendererKey / scoringKey / extensions` 做专属承载。

---

## 7. 结果页与分享图策略

### 7.1 结果页层次

每套题的结果页建议拆为三层：

1. **结构层**：Story 模式、长图导出、标签、CTA
2. **模板层**：通用模板或专属模板
3. **内容层**：结果标题、描述、图表、彩蛋文案

### 7.2 为什么不要把结果页做成完全通用

因为你卖点之一就是：

- 同一个平台下，不同题集的质感和氛围可以明显不同
- 简单题集要快，复杂题集要有记忆点

所以结果页只统一外壳，不统一一切细节。

### 7.3 分享图策略

- 分享图模板应比结果页更克制、更稳定
- 避免依赖 `backdrop-filter` 等导出不稳定能力
- 分享图上的二维码应优先指向 Landing Page 或对应题集介绍页，而不是直接指向验证码页

---

## 8. 首批题集的实施判断

| 题集 | 实施建议 | 说明 |
| --- | --- | --- |
| 灵魂城市匹配 | 优先上线 | 适合做品牌样板，视觉空间大 |
| 暗黑三角人格 | 优先上线 | 题量轻、结果图好做、传播性强 |
| 社死指数 | 优先上线 | 轻量、上手快、适合做免费体验或低价款 |
| MBTI 类测试 | 谨慎上线 | 可做，但必须先处理商用版权与文案重写问题 |
| 爱情语言 | 可做 | 建议按概念改编，不直接搬现成站点内容 |

---

## 9. 合规结论

### 9.1 必须避免的做法

- 直接把带 `NC` 限制的题库原文放进付费商品
- 直接使用商业平台已有角色命名、插画与结果包装
- 把娱乐测试包装成专业医疗或心理诊断结论

### 9.2 安全做法

- 保留方法论参考，重写中文题目与结果文案
- 所有题集记录来源元数据
- 对高风险题集标注 `commercialRisk = high`
- 对外统一声明“仅供娱乐参考，不构成专业建议”

---

## 10. 最终结论

这套平台不应该被理解为“一个万能 schema 包打天下”，而应该被理解为：

- 有一套稳定的平台底座
- 有一套通用评分与渲染协议
- 同时允许少数题集突破通用层，走专属实现

这个方向既符合你的长期经营诉求，也更符合真实产品演进路径。


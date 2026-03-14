收集整理可直接用于灵测 SoulTest 测试题设计的公开资源，涵盖完整题目、评分规则和结果描述。资源按「可直接使用」→「需翻译改编」→「需自行设计」三级分类。

---

## 1. OEJTS — MBTI 开源替代品

<aside>
✅

**可直接使用** | 协议：CC BY-NC-SA 4.0 | 计分模式：dimension | 来源：[openpsychometrics.org](http://openpsychometrics.org)

</aside>

### 1.1 基本信息

- **全称**：Open Extended Jungian Type Scales 1.2
- **题目数**：32 题（配对描述，5 点量表）
- **结果**：16 种 MBTI 类型（INTJ、ENFP 等）
- **作者**：Eric Jorgenson
- **GitHub**：[DomBruno/OpenJungTypes](https://github.com/DomBruno/OpenJungTypes)（含 JS 实现）
- **PDF 原文**：[OEJTS1.2.pdf](https://openpsychometrics.org/tests/OJTS/development/OEJTS1.2.pdf)

### 1.2 完整 32 题

| 编号 | 左端描述（得分1） | 右端描述（得分5） | 维度 |
| --- | --- | --- | --- |
| Q1 | makes lists（喜欢列清单） | relies on memory（靠记忆） | J-P |
| Q2 | sceptical（怀疑派） | wants to believe（愿意相信） | T-F |
| Q3 | bored by time alone（独处无聊） | needs time alone（需要独处） | E-I |
| Q4 | accepts things as they are（接受现状） | unsatisfied with the way things are（不满现状） | S-N |
| Q5 | keeps a clean room（保持整洁） | just puts stuff wherever（随处放东西） | J-P |
| Q6 | thinks "robotic" is an insult（觉得"像机器人"是贬义） | strives to have a mechanical mind（追求理性思维） | T-F |
| Q7 | energetic（精力充沛） | mellow（温和沉稳） | E-I |
| Q8 | prefer multiple choice test（喜欢选择题） | prefer essay answers（喜欢论述题） | S-N |
| Q9 | chaotic（混乱的） | organized（有条理的） | J-P |
| Q10 | easily hurt（容易受伤） | thick-skinned（皮厚） | T-F |
| Q11 | works best in groups（团队协作好） | works best alone（独自工作好） | E-I |
| Q12 | focused on the present（关注当下） | focused on the future（关注未来） | S-N |
| Q13 | plans far ahead（提前规划） | plans at the last minute（临时规划） | J-P |
| Q14 | wants people's respect（想获得尊重） | wants their love（想获得爱） | T-F |
| Q15 | gets worn out by parties（聚会后疲惫） | gets fired up by parties（聚会后兴奋） | E-I |
| Q16 | fits in（融入人群） | stands out（特立独行） | S-N |
| Q17 | keeps options open（保留选项） | commits（做出承诺） | J-P |
| Q18 | wants to be good at fixing things（擅长修东西） | wants to be good at fixing people（擅长疗愈他人） | T-F |
| Q19 | talks more（话多） | listens more（更愿意倾听） | E-I |
| Q20 | describes what happened（描述发生了什么） | describes what it meant（描述意味着什么） | S-N |
| Q21 | gets work done right away（立即完成工作） | procrastinates（拖延） | J-P |
| Q22 | follows the heart（跟随内心） | follows the head（跟随理性） | T-F |
| Q23 | stays at home（宅家） | goes out on the town（出门社交） | E-I |
| Q24 | wants the big picture（看大局） | wants the details（看细节） | S-N |
| Q25 | improvises（即兴发挥） | prepares（提前准备） | J-P |
| Q26 | bases morality on justice（道德基于公正） | bases morality on compassion（道德基于同情） | T-F |
| Q27 | finds it difficult to yell very loudly（不擅长大声喊） | yelling comes naturally（自然地大声喊） | E-I |
| Q28 | theoretical（理论派） | empirical（实证派） | S-N |
| Q29 | works hard（努力工作） | plays hard（尽情玩乐） | J-P |
| Q30 | uncomfortable with emotions（对情绪不自在） | values emotions（重视情绪） | T-F |
| Q31 | likes to perform in front of people（喜欢当众表演） | avoids public speaking（回避公开发言） | E-I |
| Q32 | likes to know "who? what? when?" | likes to know "why?" | S-N |

### 1.3 评分算法

每题得分为 1~5，按以下公式计算四个维度得分：

```
IE = 30 - Q3 - Q7 - Q11 + Q15 - Q19 + Q23 + Q27 - Q31
SN = 12 + Q4 + Q8 + Q12 + Q16 + Q20 - Q24 - Q28 + Q32
FT = 30 - Q2 + Q6 + Q10 - Q14 - Q18 + Q22 - Q26 - Q30
JP = 18 + Q1 + Q5 - Q9 + Q13 - Q17 + Q21 - Q25 + Q29

判定规则：
- IE > 24 → E（外向），否则 I（内向）
- SN > 24 → N（直觉），否则 S（感觉）
- FT > 24 → T（思考），否则 F（情感）
- JP > 24 → P（感知），否则 J（判断）

四个字母组合 = 最终类型（如 INFP、ENTJ）
```

### 1.4 结果内容

16 种类型各需编写结果描述。可参考以下免费资源获取每种类型的特征描述：

- [personalityjunkie.com](http://personalityjunkie.com) — 每种类型有详细免费描述
- [OpenMBTI.org](http://OpenMBTI.org) — 评分算法可视化详解
- [16personalities.com](http://16personalities.com) 的类型框架（**注意**：角色名和插画有版权，需自行设计）

---

## 2. Dirty Dozen — 暗黑三角人格（12 题精简版）

<aside>
✅

**可直接使用** | 协议：学术公开量表 | 计分模式：radar | 来源：Jonason & Webster, 2010

</aside>

### 2.1 基本信息

- **全称**：Dark Triad Dirty Dozen (DTDD)
- **题目数**：12 题
- **量表**：1-7 李克特量表（1=完全不同意，7=完全同意）
- **维度**：马基雅维利主义、精神病态、自恋
- **PDF 原文**：[Dark Triad Dirty Dozen Items](https://www.gdwebster.com/uploads/1/2/1/8/121851337/dark_triad_dirty_dozen_items.pdf)

### 2.2 完整 12 题（英文原题 + 中文翻译）

| 编号 | 英文原题 | 中文翻译（参考） | 子量表 |
| --- | --- | --- | --- |
| 1 | I tend to manipulate others to get my way. | 为了达到目的，我倾向于操控他人。 | 马基雅维利 |
| 2 | I have used deceit or lied to get my way. | 我曾用欺骗或撒谎来达到目的。 | 马基雅维利 |
| 3 | I have used flattery to get my way. | 我曾用奉承来达到目的。 | 马基雅维利 |
| 4 | I tend to exploit others towards my own end. | 我倾向于利用他人来实现自己的目标。 | 马基雅维利 |
| 5 | I tend to lack remorse. | 我往往缺乏悔恨感。 | 精神病态 |
| 6 | I tend to not be concerned with the morality of my actions. | 我不太关心自己行为的道德性。 | 精神病态 |
| 7 | I tend to be callous or insensitive. | 我往往比较冷漠或不敏感。 | 精神病态 |
| 8 | I tend to be cynical. | 我比较愤世嫉俗。 | 精神病态 |
| 9 | I tend to want others to admire me. | 我希望被他人仰慕。 | 自恋 |
| 10 | I tend to want others to pay attention to me. | 我希望被他人关注。 | 自恋 |
| 11 | I tend to seek prestige or status. | 我追求声望和地位。 | 自恋 |
| 12 | I tend to expect special favors from others. | 我期望获得他人的特殊对待。 | 自恋 |

### 2.3 评分规则

```
每题得分：1（完全不同意）~ 7（完全同意）

子量表评分（取平均分）：
- 马基雅维利主义 = avg(Q1, Q2, Q3, Q4)  满分 7.0
- 精神病态 = avg(Q5, Q6, Q7, Q8)  满分 7.0
- 自恋 = avg(Q9, Q10, Q11, Q12)  满分 7.0
- 暗黑三角总分 = avg(Q1-Q12)  满分 7.0

结果展示：雷达图（3 维度）+ 主标签（最高分维度）
```

### 2.4 结果描述建议

- **马基雅维利主义主导**：「操控大师型」— 天生的策略家，善于观察人心、精于布局
- **精神病态主导**：「暗影行者型」— 冷静果断，不被情绪左右，追求效率
- **自恋主导**：「聚光灯型」— 天生的表演者，渴望成为焦点，自信满满

---

## 3. Short Dark Triad (SD-3) — 暗黑三角（27 题完整版）

<aside>
✅

**可直接使用** | 协议：CC BY-NC-SA 4.0 | 计分模式：radar | 来源：Jones & Paulhus, 2014

</aside>

### 3.1 基本信息

- **题目数**：27 题（每维度 9 题）
- **量表**：1-5 李克特量表
- **在线版**：[openpsychometrics.org/tests/SD3](http://openpsychometrics.org/tests/SD3)
- **论文**：Jones, D.N. & Paulhus, D.L. (2014). Assessment, 21(1), 28-41.

### 3.2 评分规则

```
每维度 9 题取平均分（1-5 范围）
- 马基雅维利主义：Q1-Q9
- 自恋：Q10-Q18
- 精神病态：Q19-Q27

可与 Dirty Dozen 互为精简版/完整版
```

> 完整 27 道题目需从 [openpsychometrics.org](http://openpsychometrics.org) 在线测试中提取，或参阅原始论文。SD-3 比 Dirty Dozen 更细致，适合做「深度暗黑人格测试」作为高级版。
> 

---

## 4. 五种爱情语言测试

<aside>
⚠️

**需改编使用** | 协议：概念框架公开，原题需改写 | 计分模式：radar | 来源：Dr. Gary Chapman

</aside>

### 4.1 基本信息

- **题目数**：30 题（配对选择制）
- **5 个维度**：肯定的言辞 (A)、精心的时刻 (B)、接受礼物 (C)、服务的行动 (D)、身体的接触 (E)
- **官方测试**：[5lovelanguages.com/quizzes](http://5lovelanguages.com/quizzes)
- **PDF 完整版**：[Five Love Languages Test (PDF)](https://nbcgutah.com/wp-content/uploads/2017/09/5.LoveLanguageTest.pdf)

### 4.2 题目结构（30 题配对选择）

每题给出两个陈述（分别属于不同维度），用户选择更符合自己的那个：

```
Q1:  A. 我喜欢收到肯定的纸条/消息。
     E. 我喜欢被拥抱。

Q2:  B. 我喜欢和你一对一共度时光。
     D. 当你给我实际帮助时我感受到爱。

Q3:  C. 我喜欢收到礼物。
     B. 我喜欢和你一起散步。

Q4:  D. 当你为我做事时我感受到爱。
     E. 当你拥抱或触碰我时我感受到爱。

Q5:  E. 当你搂着我时我感到被爱。
     C. 当收到礼物时我感到被爱。

... 共 30 题（完整题目见上方 PDF 链接）
```

### 4.3 评分规则

```
统计每个字母的选择次数：
A = 肯定的言辞（Words of Affirmation）
B = 精心的时刻（Quality Time）
C = 接受礼物（Receiving Gifts）
D = 服务的行动（Acts of Service）
E = 身体的接触（Physical Touch）

每个字母最高分 = 12
最高分字母 = 你的主要爱情语言

结果展示：雷达图（5 维度）+ 主要爱情语言标签
```

### 4.4 结果描述建议

- **肯定的言辞 (A)**：「甜言蜜语派」— 一句"你真棒"胜过千言万语
- **精心的时刻 (B)**：「陪伴至上派」— 全心全意的关注是最好的礼物
- **接受礼物 (C)**：「心意物化派」— 不在于价格，在于用心
- **服务的行动 (D)**：「行动证明派」— 做比说更有说服力
- **身体的接触 (E)**：「拥抱治愈派」— 一个拥抱胜过一切

---

## 5. BigFive 大五人格测试

<aside>
✅

**可直接使用** | 协议：MIT License | 计分模式：radar | 来源：IPIP-NEO / rubynor

</aside>

### 5.1 基本信息

- **题目数**：120 题（完整版）/ 可精简至 50 或 20 题
- **5 个维度**：开放性、尽责性、外向性、宜人性、神经质
- **每维度 6 个子维度**，共 30 个子维度
- **GitHub**：[rubynor/bigfive-web](https://github.com/rubynor/bigfive-web)（MIT 协议，含完整题库 JSON + 20+ 语言翻译）
- **在线版**：[bigfive-test.com](http://bigfive-test.com)
- **Kaggle 数据集**：[Big Five Personality Test](https://www.kaggle.com/datasets/tunguz/big-five-personality-test)（100 万+ 条原始数据）

### 5.2 评分规则

```
每题 1-5 李克特量表（部分反向计分）

5 个维度各 24 题，每个子维度 4 题
维度得分 = 所属题目得分之和（反向题需翻转：6 - 原始分）

结果展示：
- 雷达图（5 维度）
- 各维度百分位对比
- 30 个子维度的详细得分条
```

### 5.3 适配建议

120 题太长，建议精简为 **50 题版**（IPIP-50，每维度 10 题）或 **20 题版**（Mini-IPIP，每维度 4 题）。GitHub 仓库中包含完整题目 JSON 和多语言翻译文件，**含中文翻译**，可直接使用。

---

## 6. HEXACO 六维人格测试

<aside>
✅

**可直接使用** | 协议：研究者免费使用 | 计分模式：radar | 来源：Lee & Ashton

</aside>

### 6.1 基本信息

- **题目数**：100 题（标准版）/ 60 题（精简版）
- **6 个维度**：诚实-谦逊 (H)、情绪性 (E)、外向性 (X)、宜人性 (A)、尽责性 (C)、开放性 (O)
- **每维度 4 个子维度**，共 24 个子维度 + 1 个利他主义间质量表
- **官网**：[hexaco.org](http://hexaco.org)
- **评分表**：[100 题版评分表 PDF](https://hexaco.org/downloads/ScoringKeys_100.pdf)

### 6.2 评分规则

```
每题 1-5 李克特量表
标注 "R" 的题目需反向计分（6 - 原始分）

每个子维度 4 题，取平均分
每个维度得分 = 4 个子维度平均分的平均值

比大五多一个「诚实-谦逊」维度，差异化卖点！
```

### 6.3 差异化卖点

比大五多了「诚实-谦逊」维度，在小红书上可以包装为"**测测你有多真实？**"——比传统大五更有话题性，也更有分享欲。

---

## 7. Holland RIASEC 职业兴趣测试

<aside>
✅

**可直接使用** | 协议：公开免费 | 计分模式：radar | 来源：O*NET / Holland

</aside>

### 7.1 基本信息

- **题目数**：48 题（openpsychometrics 版）/ 60 题（标准版）
- **6 个维度**：现实型 (R)、研究型 (I)、艺术型 (A)、社会型 (S)、企业型 (E)、常规型 (C)
- **在线版**：[openpsychometrics.org/tests/RIASEC](http://openpsychometrics.org/tests/RIASEC)
- **PDF 版**：[RIASEC Test (PDF)](https://hawaiipublicschools.org/DOE%20Forms/CTE/RIASEC.pdf)
- **O*NET 官方**：[onetinterestprofiler.org](http://onetinterestprofiler.org)

### 7.2 评分规则

```
每题 1-5 量表评分（喜欢/不喜欢该活动）

6 个维度各自累加得分
取前 3 高分维度的字母 = 你的职业兴趣代码

如：SAE = 社会型 + 艺术型 + 企业型
→ 适合的职业方向：教育、咨询、创意管理等
```

### 7.3 包装建议

可包装为「**测测你的理想职业是什么？**」或「**你的天赋密码是什么？**」——职业测试在小红书上有稳定需求，尤其是应届生和职场转型人群。

---

## 8. 九型人格 (Enneagram)

<aside>
⚠️

**需改编使用** | 协议：概念公开，完整题目需自行设计或获取 | 计分模式：radar | 来源：多个免费测试平台

</aside>

### 8.1 基本信息

- **题目数**：36-144 题（版本不一）
- **9 种类型**：完美主义者、助人者、成就者、个性者、观察者、忠诚者、热情者、挑战者、和平者
- **参考平台**：
    - [personalitypath.com](http://personalitypath.com)（免费、150 万+ 人测过）
    - [enneagramuniverse.com](http://enneagramuniverse.com)（免费、界面现代）
    - [crystalknows.com/enneagram-test](http://crystalknows.com/enneagram-test)（100 万+ 人测过）
    - [enneagraminstitute.com](http://enneagraminstitute.com) — 9 种类型的官方权威描述

### 8.2 评分规则

```
每题归属于 9 个类型之一
9 个类型各自累加得分
最高分 = 你的主类型
次高分 = 你的侧翼

结果展示：雷达图（9 维度）+ 主类型 + 侧翼
```

### 8.3 结果描述（9 种类型简述）

| 类型 | 名称 | 核心动机 | 核心恐惧 |
| --- | --- | --- | --- |
| 1 | 完美主义者 / 改革者 | 追求正确和改善 | 害怕犯错或不道德 |
| 2 | 助人者 / 给予者 | 渴望被爱和被需要 | 害怕不被爱 |
| 3 | 成就者 / 表演者 | 追求成功和认可 | 害怕没有价值 |
| 4 | 个性者 / 浪漫者 | 追求独特和深度 | 害怕平庸和缺乏意义 |
| 5 | 观察者 / 探索者 | 追求知识和理解 | 害怕无能和被侵入 |
| 6 | 忠诚者 / 怀疑者 | 追求安全和确定性 | 害怕失去支持 |
| 7 | 热情者 / 冒险家 | 追求快乐和自由 | 害怕痛苦和限制 |
| 8 | 挑战者 / 保护者 | 追求力量和掌控 | 害怕软弱和被控制 |
| 9 | 和平者 / 调停者 | 追求和谐和平静 | 害怕冲突和分离 |

---

## 9. 情商 (EQ) 测试

<aside>
⚠️

**需改编使用** | 协议：概念框架公开 | 计分模式：radar 或 range | 来源：多个免费平台

</aside>

### 9.1 基本信息

- **题目数**：15-50 题（版本不一）
- **5 个维度**（Goleman 模型）：自我意识、自我管理、内驱力、同理心、社交能力
- **或 5 个维度**（Bar-On 模型）：自省能力、人际能力、适应能力、抗压能力、整体情绪
- **参考平台**：
    - [ihhp.com/free-eq-quiz](http://ihhp.com/free-eq-quiz)（免费，含多维度）
    - [123test.com/emotional-intelligence-test](http://123test.com/emotional-intelligence-test)（免费，基于 Bar-On 模型）
    - [eiexperience.com/resources/emotional-intelligence-quiz](http://eiexperience.com/resources/emotional-intelligence-quiz)（15 题精简版）

### 9.2 评分规则

```
每题 1-5 李克特量表
5 个维度各自累加得分
总 EQ 分 = 所有维度得分之和

可同时用 radar（5 维度雷达图）+ range（总分等级）展示：
- 总分 80%+ → "情商大师"
- 总分 60-79% → "情绪管理良好"
- 总分 40-59% → "情绪敏感型"
- 总分 <40% → "需要修炼的小怪兽"
```

### 9.3 包装建议

可包装为「**你的情商段位是什么？**」或「**测测你是情绪天才还是情绪小白？**」——情商测试在小红书职场和情感板块都有高热度。

---

## 10. 趣味/娱乐向测试（需自行设计）

<aside>
🎨

以下测试**没有标准量表**，需要自行创作题目，但可以参考已有平台的设计思路。建议使用 AI 辅助生成初版，然后人工调整。

</aside>

### 10.1 灵魂城市匹配

- **计分模式**：accumulate
- **建议题数**：15-20 题
- **建议结果**：12-15 个城市
- **参考**：BuzzFeed 的 "Which City Should You Actually Live In?" 系列
- **设计思路**：每道题的选项对应不同城市加分，如"周末你更喜欢做什么？"→ 逛博物馆=巴黎+3，探索美食=东京+2

### 10.2 社死指数测试

- **计分模式**：range
- **建议题数**：15 题
- **建议结果**：6 个等级（Lv.1 社交达人 → Lv.6 社死之王）
- **参考**：小红书上已有大量"社死指数"图片测试可作为题目灵感
- **设计思路**：场景题为主，如"公共场合裤子拉链开了你会？"，每个选项 1-5 分

### 10.3 恋爱脑指数测试

- **计分模式**：range
- **建议题数**：10-15 题
- **建议结果**：5 个等级
- **参考**：
    - [beauty321.com](http://beauty321.com) [10 题恋爱脑检测](https://www.beauty321.com/post/66358)
    - [goodmood.com.tw](http://goodmood.com.tw) [15 题恋爱脑测试](https://goodmood.com.tw/love-struck-test/)
- **设计思路**：情景选择题，如"对方没秒回你消息，你会？"→ 选项从理性到上头分别 1-5 分

### 10.4 前世今生测试

- **计分模式**：branch（分支跳转）
- **建议题数**：总题库 30+ 题，每次只答 8-12 题
- **建议结果**：8-12 个角色
- **设计思路**：决策树结构，每个选项决定下一题，如"你推开一扇门，里面是？"→ 花园=Q5，图书馆=Q6

### 10.5 七宗罪测试

- **计分模式**：radar
- **建议题数**：14-21 题（每个罪 2-3 题）
- **7 个维度**：傲慢、贪婪、色欲、嫉妒、暴食、懒惰、暴怒
- **设计思路**：场景题+自评，如"看到朋友升职你第一反应是？"→ 真心祝贺(嫉妒+1) / 暗自比较(嫉妒+3) / 无所谓(懒惰+2)

---

## 11. 资源汇总一览表

| 资源 | 题数 | 计分模式 | 可用度 | 协议 | 获取方式 |
| --- | --- | --- | --- | --- | --- |
| OEJTS（MBTI替代） | 32 | dimension | ✅ 直接用 | CC BY-NC-SA 4.0 | PDF + GitHub JS |
| Dirty Dozen（暗黑三角精简） | 12 | radar | ✅ 直接用 | 学术公开 | PDF 完整题+评分 |
| SD-3（暗黑三角完整） | 27 | radar | ✅ 直接用 | CC BY-NC-SA 4.0 | 在线版 + 论文 |
| BigFive 大五人格 | 120/50/20 | radar | ✅ 直接用 | MIT License | GitHub JSON + 中文翻译 |
| HEXACO 六维人格 | 100/60 | radar | ✅ 直接用 | 研究者免费 | 官网 + 评分表 PDF |
| Holland RIASEC 职业兴趣 | 48/60 | radar | ✅ 直接用 | 公开免费 | 在线版 + PDF |
| 五种爱情语言 | 30 | radar | ⚠️ 需改编 | 概念公开 | PDF 完整题 + 官网 |
| 九型人格 | 36-144 | radar | ⚠️ 需改编 | 概念公开 | 多个免费平台 |
| 情商 EQ 测试 | 15-50 | radar + range | ⚠️ 需改编 | 概念公开 | 多个免费平台 |
| 灵魂城市匹配 | 15-20 | accumulate | 🎨 需自创 | — | AI 辅助 + 人工 |
| 社死指数 | 15 | range | 🎨 需自创 | — | AI 辅助 + 人工 |
| 恋爱脑指数 | 10-15 | range | — | — | 参考现有测试改编 |
| 前世今生 | 30+ | branch | 🎨 需自创 | — | AI 辅助 + 人工 |
| 七宗罪 | 14-21 | radar | 🎨 需自创 | — | AI 辅助 + 人工 |

---

## 12. 重要链接速查

### 开源项目

- [openpsychometrics.org](http://openpsychometrics.org) — 几十套完整心理测试
- [GitHub: DomBruno/OpenJungTypes](https://github.com/DomBruno/OpenJungTypes) — OEJTS JS 实现
- [GitHub: rubynor/bigfive-web](https://github.com/rubynor/bigfive-web) — 大五人格 MIT 开源（含中文翻译 JSON）
- [hexaco.org](http://hexaco.org) — HEXACO 官方材料

### 完整题目 PDF

- [OEJTS 1.2 完整 32 题 + 评分](https://openpsychometrics.org/tests/OJTS/development/OEJTS1.2.pdf)
- [Dirty Dozen 完整 12 题 + 评分](https://www.gdwebster.com/uploads/1/2/1/8/121851337/dark_triad_dirty_dozen_items.pdf)
- [五种爱情语言完整 30 题 + 评分](https://nbcgutah.com/wp-content/uploads/2017/09/5.LoveLanguageTest.pdf)
- [HEXACO 100 题评分表](https://hexaco.org/downloads/ScoringKeys_100.pdf)
- [Holland RIASEC 60 题 PDF](https://hawaiipublicschools.org/DOE%20Forms/CTE/RIASEC.pdf)

### 数据集

- [Kaggle: Big Five 100万+ 条数据](https://www.kaggle.com/datasets/tunguz/big-five-personality-test)
- [Kaggle: IPIP-NEO 120 题版](https://www.kaggle.com/datasets/edersoncorbari/pip-neo-big-five-personality-120-item-version)
## 📌 方案概述

本方案定义灵测 SoulTest 的验证码系统设计。系统从架构层面支持**多种验证策略**，通过配置切换即可适应不同阶段的业务需求：

- **MVP 阶段**：每套测试使用一个通用验证码 + 定期轮换，配合小红书原生自动发货
- **增长阶段**：接入阿奇索 API，实现一单一码动态生成

两种模式共用同一套验证接口，切换时无需改动前端代码。

---

## 🎯 验证策略体系

### 策略一：通用码模式（MVP 默认）

**适用场景**：初期快速上线，降低发货复杂度

**运作方式**：

- 每套测试配置一个通用验证码（如 `SOUL-CITY-0315`）
- 用户输入验证码 → 系统比对 → 匹配则放行
- 验证码设有**过期时间**，到期后自动失效，需运营手动或定时任务轮换新码
- 新码生效后，同步更新小红书自动发货的回复内容即可

**发货方式**：小红书原生「虚拟商品自动发货」

- 商品上架时填写固定链接 + 验证码
- 买家付款后自动私信发送，零人工介入

**码格式建议**：`SOUL-{主题缩写}-{日期或批次}`

- 示例：`SOUL-MBTI-0315`、`SOUL-CITY-W12`（第12周）
- 长度适中（12~16字符），方便用户手动输入
- 不要使用容易混淆的字符（0/O、1/l/I）

**轮换策略**：

- 建议周期：每 7~14 天轮换一次
- 轮换时设置一个**宽限期**（如 48 小时），新旧码同时有效，避免刚买的用户码失效
- 轮换操作：更新数据库/配置 → 更新小红书自动发货内容

### 策略二：一单一码模式（增长阶段）

**适用场景**：日单量增大，需要防止码泄露/滥用

**运作方式**：

- 用户下单 → 阿奇索回调我方 API → 动态生成唯一验证码 → 返回给阿奇索 → 发送给买家
- 每个码对应唯一订单来源，但**验证后不立即销毁**，避免用户中途中断后产生客诉
- 码的可用性主要由**有效期**控制，必要时再叠加订单归属校验
- 核心数据落 `D1`，`KV` 只缓存短期访问令牌或临时状态

**发货方式**：阿奇索「自有货源 - 标准系统」接口

- 详见 [阿奇索自动发货对接方案](https://www.notion.so/be41ebd120ad45789f99c64b12519614?pvs=21)

### 策略三：免验证模式（可选/促销）

**适用场景**：免费引流测试、限时体验活动

**运作方式**：

- 特定测试配置为免验证，用户直接访问链接即可答题
- 可设置有效期窗口（如活动期间3天内免验证）

---

## 🏗️ 多策略架构设计

### 核心思路：策略模式 + 配置驱动

题集运行时只声明“需要哪类访问策略”，真正的验证码、批次、过期时间和商品映射统一放在平台数据模型中（`products / product_quizzes / code_batches / codes`），验证引擎根据策略类型分发到对应逻辑：

### 题集配置与平台数据的职责划分

```json
{
  "slug": "love-pattern-map",
  "name": "亲密关系模式图谱",
  "access": {
    "strategy": "shared_code"
  }
}
```

```json
> 实际可用码、批次有效期、商品绑定关系不写死在题集 JSON 中，而是由后台在 `products / code_batches / codes` 中维护。
```

```json
{
  "slug": "free-trial",
  "verification": {
    "strategy": "none",
    "none": {
      "validFrom": "2026-04-01T00:00:00+08:00",
      "validUntil": "2026-04-03T23:59:59+08:00"
    }
  }
}
```

### 验证引擎伪代码

```tsx
// 统一验证入口
async function verifyAccess(slug: string, inputCode?: string) {
  const quiz = await getQuizConfig(slug);
  const strategy = quiz.verification.strategy;

  switch (strategy) {
    case 'none':
      return verifyNone(quiz);
    case 'shared_code':
      return verifySharedCode(quiz, inputCode);
    case 'unique_code':
      return verifyUniqueCode(quiz, inputCode);
    default:
      throw new Error('Unknown strategy');
  }
}

// 策略一：免验证
function verifyNone(quiz) {
  const now = new Date();
  const config = quiz.verification.none;
  if (config?.validFrom && now < new Date(config.validFrom)) return { ok: false, reason: 'not_started' };
  if (config?.validUntil && now > new Date(config.validUntil)) return { ok: false, reason: 'expired' };
  return { ok: true };
}

// 策略二：通用码（支持多码宽限期）
function verifySharedCode(quiz, inputCode) {
  const now = new Date();
  const codes = quiz.verification.shared_code.codes;
  const matched = codes.find(c =>
    c.code === inputCode &&
    now >= new Date(c.validFrom) &&
    now <= new Date(c.validUntil)
  );
  return matched ? { ok: true } : { ok: false, reason: 'invalid_or_expired' };
}

// 策略三：一单一码
async function verifyUniqueCode(quiz, inputCode) {
  const record = await D1.get(`code:${inputCode}`);
  if (!record) return { ok: false, reason: 'not_found' };
  if (record.quiz_slug !== quiz.slug) return { ok: false, reason: 'wrong_quiz' };
  if (record.expires_at < Date.now()) return { ok: false, reason: 'expired' };
  return { ok: true };
}
```

### 前端验证页面

前端不关心后端用哪种策略，统一提供验证码输入界面：

1. 用户访问 `soultest.nanproduced.cloud/{slug}`
2. 前端调用 `GET /api/quiz/{slug}/info` 获取测试基本信息 + 验证策略类型
3. 如果策略为 `none` → 直接进入答题
4. 如果策略为 `shared_code` 或 `unique_code` → 显示验证码输入框
5. 用户输入码 → 前端调用 `POST /api/verify` → 后端返回结果
6. 验证通过 → 前端获得一个 session token → 进入答题

---

## 📋 MVP 阶段操作手册

### 上新一套测试的完整流程

1. **准备内容**：编写测试题 JSON 配置（题目、选项、计分、结果）
2. **设置验证码**：在后台创建单题产品 + 通用码批次，设定有效期
3. **部署上线**：提交代码 → 自动构建部署
4. **小红书上架**：
    - 发布商品，类目选「电子资源」
    - 发货模式选「自动发货」
    - 填写链接：`soultest.nanproduced.cloud/{slug}`
    - 填写内容说明：`验证码：SOUL-XXXX-XXXX`
5. **定期轮换**：每 7~14 天更新验证码 → 更新小红书自动发货内容

### 验证码轮换操作

1. 在后台新增一条通用码记录，`validFrom` 设为比旧码 `validUntil` 提前 48 小时（宽限期重叠）
2. 部署更新
3. 旧码到期当天，更新小红书自动发货内容为新码
4. 宽限期结束后旧码自动失效，无需额外操作

---

## 🔄 从 MVP 到一单一码的升级路径

| 步骤 | 操作 | 影响范围 |
| --- | --- | --- |
| 1 | 开通阿奇索「自有货源 - 标准系统」服务 | 第三方平台 |
| 2 | 部署阿奇索回调 API（/api/agiso/generate） | 后端新增接口 |
| 3 | 将目标测试的 strategy 从 shared_code 改为 unique_code | 配置变更，一行改动 |
| 4 | 小红书发货方式从「原生自动发货」切换为「阿奇索发货」 | 小红书商品设置 |
| 5 | 前端无需改动 | 零影响 |

> 升级是渐进式的：可以先对高销量测试切换为一单一码，低销量测试继续用通用码，两种模式并存。
> 

---

## ⚖️ 两种模式对比

| 维度 | 通用码（MVP） | 一单一码（增长期） |
| --- | --- | --- |
| 发货方式 | 小红书原生自动发货 | 阿奇索 API 回调 |
| 第三方依赖 | 无 | 阿奇索 |
| 开发成本 | 极低 | 中等（需对接 API） |
| 运维成本 | 定期轮换码 + 更新小红书 | 全自动，无人工 |
| 防泄露 | 弱（码可分享） | 强（一码一用） |
| 传播效应 | 码泄露 = 免费推广 | 无此效应 |
| 适合阶段 | 日单 < 100，验证市场 | 日单 > 100，保护收入 |

---

## 🛡️ MVP 阶段的风险与应对

| 风险 | 概率 | 影响 | 应对 |
| --- | --- | --- | --- |
| 验证码被大量传播 | 高 | 低（初期免费推广反而有利） | 接受；若影响收入，提前启动一单一码升级 |
| 用户投诉码过期 | 中 | 中 | 设 48h 宽限期；商品详情页注明"码有有效期" |
| 忘记轮换码 | 中 | 低 | 设日历提醒；后续可做 Cron 自动轮换 |
| 竞对抄袭模式 | 低 | 低 | 我们的壁垒在体验而非验证码机制 |

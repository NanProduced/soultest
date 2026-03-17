# 题集发布与接入流程（D1 正式版）

本文用于替代旧的“过渡期兼容版”接入说明，明确后续题集发布、验证码发放与管理平台配置的唯一基线：**D1 是业务真相源**。

> 本文结论适用于当前仓库的后续开发约束：
> - 新测试题接入时，不再向 `functions/_lib/mock-data.ts` 写入业务数据
> - 新测试题接入时，不再向 `functions/_lib/admin-mock-data.ts` 写入业务数据
> - 本地开发同样以 Wrangler 本地 D1 为准，不再把 mock 文件作为正式接入步骤的一部分
> - `mock-data.ts` / `admin-mock-data.ts` 仅保留迁移过渡用途，迁移完成后应废弃删除

## 一、核心原则

### 1. D1 是唯一正式数据源

上线后，以下业务能力必须直接由 D1 提供：

- 题集目录
- 题集详情元数据
- 题集运行时配置
- 商品与题集绑定关系
- 批次管理
- 验证码生成、冻结、作废、生效状态
- 管理平台展示所需的正式业务数据

对应表为：

- `quizzes`
- `quiz_versions`
- `products`
- `product_quizzes`
- `code_batches`
- `codes`

### 2. 代码里只保留“逻辑与 UI”，不保留“正式业务数据”

后续代码中允许保留的内容：

- 自定义详情页 / 测试页 / 结果页组件
- 评分逻辑
- 图表与结果渲染组件
- 题目专属视觉样式
- 通用验证码输入组件
- 必要的类型定义与数据解析逻辑

后续代码中不应继续新增的内容：

- 新题目录条目
- 新题管理台条目
- 正式商品配置
- 正式验证码
- 正式批次配置
- 以“静态对象”形式长期保存的正式 intro / runtime / 题目配置

### 3. 本地开发也走 D1，不走“先 mock 后补库”

当前仓库已经具备本地 D1 工作流：

```bash
pnpm run db:migrate:local
pnpm run db:seed:local
```

说明：`pnpm run db:seed:local` 会先执行 `db/seeds/local.sql`，再执行生成后的 `db/seeds/free-runtime.sql`。

因此本地联调、题集接入、验证码测试、管理台验证，都应以本地 D1 为准。

这意味着：

- 后续新题接入时，必须先补 `db/seeds/local.sql`
- 本地如果看不到新题、管理台批次不生效、验证码不能即时生效，优先检查 D1 seed，而不是继续改 mock 文件

## 二、当前仓库里的 mock 文件是什么状态

### 1. `functions/_lib/admin-mock-data.ts`

当前作用：

- 为管理平台题集列表提供静态兼容条目
- 为公开题集目录提供一部分静态兼容来源
- 在 `mock` 模式下提供完整后台题集列表

这意味着它**不是正式数据源**，只是过渡期兼容层。

后续约束：

- 不再向该文件新增任何新题条目
- 不再把“管理台能看到题目”视为改这个文件的理由
- 管理平台题集、公开目录题集都必须改为从 D1 获取正式数据

### 2. `functions/_lib/mock-data.ts`

当前作用：

- 在 `mock` 模式下提供公开题集目录、题集 intro、runtime、商品、批次、验证码等模拟数据
- 在部分非 `mock` 场景下，经由 `official-quiz-content.ts` 提供静态兜底内容
- 为本地极少数“尚未迁移完成”的题目提供临时兼容数据

这同样**不是正式数据源**。

后续约束：

- 不再向该文件新增任何新题正式数据
- 不再新增正式商品、正式验证码、正式批次到该文件
- 不再把“页面先跑起来”作为长期写入 mock-data 的理由

### 3. 允许保留的过渡能力

在迁移全部完成前，仓库可以暂时保留这些兼容能力：

- 非 `mock` 模式下，详情页 / runtime 对静态内容的兜底
- 本地开发环境下，极少数历史题目的静态访问兜底
- 旧题尚未迁移完成时，管理台与公开目录的静态补位

但这些都应视为：

- **只读兼容层**
- **迁移缓冲层**
- **待删除资产**

而不是未来接入规范的一部分。

## 三、新测试题的正式接入流程

以后所有新测试题，都按以下顺序接入。

### 第 1 步：先确定题目边界

先确认以下内容：

- 唯一 `slug`
- 是否免费 / 付费
- 是否需要落在 landing / `/quizzes`
- 是否需要商品绑定
- 是否需要批次发码
- 是否使用统一验证码输入组件
- 是否使用自定义详情页 / 测试页 / 结果页

说明：

- UI 页面是否自定义，属于前端实现问题
- 题目配置、商品、批次、验证码是否可运营，属于 D1 数据问题
- 两者必须同时完成，不能互相替代

### 第 2 步：写入 D1 正式数据

#### 免费题至少需要

- `quizzes`
- `quiz_versions`

#### 付费题至少需要

- `quizzes`
- `quiz_versions`
- `products`
- `product_quizzes`
- `code_batches`
- `codes`

建议约束：

- `quizzes` 负责题目主信息与发布状态
- `quiz_versions.config_json` 负责题目 intro、runtime、题目配置、结果配置等正式内容
- `products` 与 `product_quizzes` 负责商品与题目绑定
- `code_batches` 与 `codes` 负责验证码即时生效能力

### 第 3 步：同步本地 seed

必须同步：

- `db/seeds/local.sql`
- `db/seeds/free-runtime.sql`（由 `scripts/build-free-runtime-seed.mjs` 生成，用于承载 6 套免费题完整 runtime）

推荐执行：

```bash
pnpm run db:migrate:local
pnpm run db:seed:local
```

完成后至少验证：

- 管理平台能读到题目
- 公开目录能读到题目
- 题目详情页可打开
- 测试 runtime 可正常读取
- 付费题验证码能即时校验并即时生效
- 批次冻结 / 作废后前端访问能立即反映真实状态

### 第 4 步：接入前端页面代码

页面层建议如下：

- 验证码输入组件：统一
- 详情页：按题自定义
- 测试页：按题自定义
- 结果页：按题自定义

但不论页面如何实现，页面读取的正式数据都必须来自 D1。

允许代码中保留：

- 页面布局
- 视觉表达
- 图表配置
- 评分实现
- 结果解释组件

不允许继续依赖：

- “把题目录写进 mock-data 才能显示”
- “把商品写进 mock-data 才能发码”
- “把验证码写进 mock-data 先顶着用”

### 第 5 步：验收后再决定是否保留过渡兜底

如果该题已经完整进入 D1，并完成本地与管理平台验证，则：

- 不应再向 mock 文件补同一份正式业务数据
- 如已有对应静态兼容内容，应进入待清理名单

## 四、已落地题目的迁移范围

根据当前仓库现状，已落地题目应按“先切正式读取路径，再删除静态兼容”的顺序推进。

### 1. 已进入本地 D1 seed 的付费题

当前以下付费题已在 `db/seeds/local.sql` 中具备正式业务数据：

- `oejts-personality-map`
- `relationship-preference-test`
- `dark-triad`
- `bigfive`
- `hexaco-60`
- `soul-tarot`
- `enneagram`
- `riasec-48`
- `stress-load-test`
- `desire-composition`

这些题目的下一步重点不再是“补入库”，而是：

- 非 `mock` 模式下优先从 D1 读取目录 / 管理台元数据
- 持续校验 `quiz_versions.config_json` 中的 intro / runtime 完整性
- 确保商品、批次、验证码统一由 D1 提供与即时生效
- 将 `mock-data.ts` / `admin-mock-data.ts` 收缩为过渡兜底，而非主路径来源

### 2. 当前仍保留的静态兼容边界

截至当前阶段，静态兼容仍主要保留在以下场景：

- `mock` 模式下的完整题集 / 商品 / 批次 / 验证码模拟数据
- 非 `mock` 模式下的 `official-quiz-content.ts` 静态 intro / runtime 兜底
- 本地开发环境中，验证码校验失败时的少量静态 fallback

这意味着当前的主任务不是继续往 mock 文件追加条目，而是逐步缩小这些边界，直到非 `mock` 模式完全不再依赖它们。

### 3. 免费题当前状态

当前这 6 个免费题已经完成首批 D1 元数据迁移：

- `free/aura`
- `free/banwei`
- `free/painting`
- `free/talent`
- `free/szondi`
- `free/soul-city`

当前已进入 D1 的内容包括：

- 题集主记录（`quizzes`）
- 发布版本记录（`quiz_versions`）
- 目录 / 管理台所需的标题、摘要、分类、状态、landing 展示状态
- intro 扩展元数据（如 `tagline`、`priceLabel`、`questionCount`、`valuePoints`、`flowSteps`）

当前状态与仍保留的边界：

- 6 个免费题的运行时题目 / 结果内容已写入 D1，并由前端通过 `/api/free-quizzes/runtime` 优先读取
- 非 `mock` 模式下，该接口已按 D1 主源读取；若 D1 runtime 缺失会直接失败，不再静默回退到静态 runtime
- 免费题详情页 / 测试页 / 结果页的 UI 与评分实现仍保留在前端仓库代码中
- `src/features/free-quizzes/*-data.ts` 仍作为 free-runtime seed 生成源与过渡兼容存在，不是线上正式主读取路径
- `mock-data.ts` / `admin-mock-data.ts` 里的免费题静态数据仍作为 `mock` 模式与少量历史兼容存在

下一步目标不是再次“补免费题入库”，而是继续收缩非 `mock` 模式下对这些静态兼容条目的依赖，最终撤掉 `official-quiz-content.ts` 的静态 runtime 兜底并删除 `mock` 文件。

## 五、mock 文件的废弃与删除策略

删除这两个文件不能一步硬删，建议按三阶段推进。

### 阶段 A：立即冻结写入

从现在开始执行：

- 新题禁止写入 `functions/_lib/mock-data.ts`
- 新题禁止写入 `functions/_lib/admin-mock-data.ts`
- 所有新题正式接入以 D1 + `db/seeds/local.sql` 为唯一流程

这是当前必须立刻生效的规则。

### 阶段 B：完成存量迁移

完成以下事项后，才能进入删除阶段：

- 10 套已落地付费题在非 `mock` 模式下完全由 D1 提供目录 / 管理台元数据
- 6 个免费题在非 `mock` 模式下完全由 D1 提供目录 / 管理台元数据
- 管理平台题集列表不再依赖 `getStaticAdminQuizzes()` 的非 `mock` 合并补位
- 公开目录不再依赖静态兼容目录条目
- 非 `mock` 模式下的验证码联调默认不再依赖静态 mock grant（仅在显式打开 `ALLOW_STATIC_ACCESS_GRANT_FALLBACK=true` 时保留应急兜底）

### 阶段 C：切换仓库代码并删除文件

满足迁移条件后，再做代码切换：

1. 让非 `mock` 模式下的仓库读取逻辑完全 D1-first，且不再合并静态题集列表
2. 清除 `official-quiz-content.ts` 对 `mock-data.ts` 的依赖
3. 删除 `functions/_lib/admin-mock-data.ts`
4. 删除 `functions/_lib/mock-data.ts`
5. 删除与之对应的历史兼容调用与测试夹具

注意：

- 删除动作必须在“现有已落地测试题仍可正常使用”的前提下进行
- 如果某题还依赖静态 runtime / intro，则不能贸然删文件
- 删除前应先跑本地 D1 seed，并逐题验证公开入口、答题入口、结果页、管理台、批次与验证码链路

## 六、后续开发硬性规范

从本文生效起，后续新增测试题必须遵守：

### 必须做

- 先设计 D1 数据
- 同步 `db/seeds/local.sql`
- 用本地 Wrangler D1 完成联调
- 用管理平台验证批次与验证码即时生效
- 让正式题目内容以 D1 发布版本为准

### 不得做

- 不得继续向 `mock-data.ts` 新增正式业务数据
- 不得继续向 `admin-mock-data.ts` 新增正式业务数据
- 不得把 mock 文件当作新题发布步骤
- 不得用静态验证码代替 D1 发码流程
- 不得让管理平台显示结果与 D1 实际状态不一致

## 七、推荐执行顺序

建议从现在开始按下面顺序推进：

1. 先以本文替换旧发布流程认知
2. 冻结对 `mock-data.ts` / `admin-mock-data.ts` 的新增写入
3. 先切掉 10 套已落地付费题在非 `mock` 模式下的静态目录 / 管理台兼容读取
4. 再切掉 6 个免费题在非 `mock` 模式下的静态兼容读取
5. 再移除非 `mock` 模式下的静态验证码 fallback
6. 最后删除仓库中的 mock 兼容文件

## 八、验收清单

进入“可以删除 mock 文件”的阶段前，至少确认：

- 所有已上线准备题目都能从 D1 读到题集信息
- 所有付费题都能从 D1 读到商品、批次、验证码数据
- 管理平台创建 / 冻结 / 作废批次能即时生效
- 前端验证码校验结果与 D1 实际状态一致
- landing 与 `/quizzes` 不再依赖静态兼容条目
- 当前已落地测试题没有因为迁移而不可用

---

如果后续要继续推进代码改造，默认顺序应为：**先迁移 D1 数据，再移除仓库静态兼容，最后删除 mock 文件**。







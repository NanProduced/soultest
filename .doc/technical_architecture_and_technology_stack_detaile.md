## 1. 文档目标

本文档定义灵测 SoulTest 的平台级技术方案，重点解决以下问题：

- 如何在当前技术栈下实现长期可扩展的平台结构
- 如何支持“一码单题 / 一码多题 / 推广体验码 / 套餐商品”
- 如何让题集既可走通用模型，又允许复杂题集做专属处理
- 如何在低成本前提下完成部署、运营和后续扩展

本文档替代旧版“单题 H5 + 一次性验证码”思路，新的架构基线以 `平台化、低成本、低技术债` 为目标。

---

## 2. 设计原则

### 2.1 平台设计原则

1. **平台先于单题实现**：先把题集、商品、验证码、版本发布这些底层模型设计稳定，再做具体题目。
2. **通用能力优先，专属能力可扩展**：大部分题集走统一渲染与统一计分；高复杂度题集允许专属渲染器与专属扩展块。
3. **低成本优先于大数据平台**：只记录经营需要的数据，不做重埋点、重报表系统。
4. **用户体验优先于强校验**：验证码不做使用次数扣减，重点控制有效期、状态与批次策略。
5. **避免双真相源**：D1 负责业务状态；KV 只缓存；R2 只存素材与发布产物。

### 2.2 技术原则

- **React SPA** 满足当前交互需求与 Cloudflare 部署需求
- **Pages Functions** 承担轻量 API，不引入独立服务器
- **D1** 保存平台核心状态和题集版本源数据
- **KV** 仅缓存热点验证码与公开元数据，避免把兑换状态写死在 KV
- **R2** 保存封面图、结果图素材、已发布版本快照等大对象

---

## 3. 系统边界与职责

### 3.1 系统结构

```text
用户浏览器
  ├─ Landing Page / 测试介绍页 / 答题页 / 结果页
  └─ 管理后台

Cloudflare Pages
  └─ React SPA 静态资源

Cloudflare Pages Functions
  ├─ 公共访问接口
  ├─ 答题提交流程
  └─ 管理后台接口

Cloudflare D1
  ├─ 题集、版本、商品、验证码批次、验证码、提交记录
  └─ 管理员与后台配置

Cloudflare Workers KV
  ├─ 热点验证码缓存
  └─ 已发布公开题集元数据缓存

Cloudflare R2
  ├─ 题集素材
  ├─ 结果图素材
  └─ 已发布题集快照 JSON
```

### 3.2 各存储角色

| 组件 | 是否真相源 | 负责内容 |
| --- | --- | --- |
| **D1** | 是 | 平台业务状态、版本记录、发布指针、验证码状态、提交结果 |
| **KV** | 否 | 热点缓存，减少 D1 读取压力 |
| **R2** | 否 | 素材与发布产物存储，不承担业务状态真相源 |

### 3.3 为什么不用“KV 标记 used”

旧方案中的 `verify -> used=true` 不适合当前业务，原因如下：

- 用户中途中断后无法继续，容易引发客诉
- 不支持“一码多题”与“套餐商品”
- 不支持推广码、体验码等复用场景
- KV 免费层写入能力更有限，不适合做业务真相源

新方案改为：

- `verify` 只校验验证码是否有效
- 校验通过后签发时效访问凭证 `access token`
- 用户后续凭 `access token` 访问已授权题集
- 验证码本身只受 `状态 + 有效期 + 批次策略` 控制，不受次数控制

---

## 4. 路由与页面结构

```text
/                          Landing Page（低优先级，可先做简版）
/:slug                     测试介绍页 / 验证码入口页
/:slug/test                答题页
/:slug/result/:submissionId 结果页
/admin                     管理后台首页
/admin/quizzes             题集管理
/admin/products            商品管理
/admin/codes               验证码批次与码管理
/admin/analytics           经营统计
```

说明：

- `/:slug` 页面同时承担测试介绍、购买指引、验证码输入和免费试用入口。
- Landing Page 不是核心业务链路必须项，但对品牌承接、分享引流和交叉购买有价值。

---

## 5. 平台数据模型

### 5.1 设计思路

平台模型分成四层：

1. **题集层**：一个测试在平台中的长期身份
2. **版本层**：某个测试在某个时刻的不可变配置快照
3. **商品层**：面向销售的包装单元，可单题、可套餐、可推广
4. **权益层**：验证码批次与具体验证码，决定用户可访问哪些题集

### 5.2 核心实体关系

```text
Quiz
  └─ QuizVersion (1:N)

Product
  └─ ProductQuiz (1:N)
       └─ Quiz

CodeBatch
  └─ Code (1:N)
       └─ Product

Submission
  ├─ Quiz
  ├─ QuizVersion
  └─ Code
```

### 5.3 D1 表结构建议

```sql
CREATE TABLE quizzes (
  id                         TEXT PRIMARY KEY,
  slug                       TEXT UNIQUE NOT NULL,
  title                      TEXT NOT NULL,
  summary                    TEXT,
  category                   TEXT,
  status                     TEXT NOT NULL DEFAULT 'draft',
  cover_url                  TEXT,
  price                      REAL DEFAULT 0.99,
  landing_visible            INTEGER DEFAULT 1,
  current_draft_version_id   TEXT,
  current_published_version_id TEXT,
  created_at                 TEXT DEFAULT (datetime('now')),
  updated_at                 TEXT DEFAULT (datetime('now'))
);

CREATE TABLE quiz_versions (
  id                         TEXT PRIMARY KEY,
  quiz_id                    TEXT NOT NULL,
  version                    INTEGER NOT NULL,
  schema_version             TEXT NOT NULL,
  status                     TEXT NOT NULL DEFAULT 'draft',
  config_json                TEXT NOT NULL,
  source_manifest_json       TEXT,
  release_note               TEXT,
  created_at                 TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
  UNIQUE (quiz_id, version)
);

CREATE TABLE products (
  id                         TEXT PRIMARY KEY,
  name                       TEXT NOT NULL,
  product_type               TEXT NOT NULL,
  status                     TEXT NOT NULL DEFAULT 'active',
  sales_channel              TEXT DEFAULT 'xiaohongshu',
  purchase_url               TEXT,
  intro_mode                 TEXT DEFAULT 'code_gate',
  landing_visible            INTEGER DEFAULT 1,
  description                TEXT,
  created_at                 TEXT DEFAULT (datetime('now')),
  updated_at                 TEXT DEFAULT (datetime('now'))
);

CREATE TABLE product_quizzes (
  id                         TEXT PRIMARY KEY,
  product_id                 TEXT NOT NULL,
  quiz_id                    TEXT NOT NULL,
  sort_order                 INTEGER DEFAULT 0,
  access_json                TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
  UNIQUE (product_id, quiz_id)
);

CREATE TABLE code_batches (
  id                         TEXT PRIMARY KEY,
  product_id                 TEXT NOT NULL,
  name                       TEXT NOT NULL,
  strategy_type              TEXT NOT NULL,
  code_prefix                TEXT,
  code_length                INTEGER DEFAULT 8,
  status                     TEXT NOT NULL DEFAULT 'active',
  expires_at                 TEXT,
  policy_json                TEXT,
  created_at                 TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE codes (
  code                       TEXT PRIMARY KEY,
  batch_id                   TEXT NOT NULL,
  status                     TEXT NOT NULL DEFAULT 'active',
  expires_at                 TEXT,
  metadata_json              TEXT,
  created_at                 TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (batch_id) REFERENCES code_batches(id)
);

CREATE TABLE submissions (
  id                         TEXT PRIMARY KEY,
  quiz_id                    TEXT NOT NULL,
  quiz_version_id            TEXT NOT NULL,
  product_id                 TEXT,
  code                       TEXT,
  result_key                 TEXT,
  score_json                 TEXT,
  duration_sec               INTEGER,
  shared                     INTEGER DEFAULT 0,
  client_info_json           TEXT,
  created_at                 TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
  FOREIGN KEY (quiz_version_id) REFERENCES quiz_versions(id),
  FOREIGN KEY (code) REFERENCES codes(code)
);

CREATE TABLE admins (
  id                         TEXT PRIMARY KEY,
  username                   TEXT UNIQUE NOT NULL,
  password_hash              TEXT NOT NULL,
  created_at                 TEXT DEFAULT (datetime('now'))
);
```

### 5.4 为什么要拆 `quiz` 与 `quiz_version`

这能解决后续最容易出现的技术债：

- 已上线题集需要修改文案或结果模板
- 不同时间点的用户需要看到不同发布版本
- 回滚时不能直接覆盖旧 JSON
- 复杂题集需要保留专属配置而不污染基础题集记录

### 5.5 为什么要拆 `product` 与 `quiz`

因为你卖的是“商品”，不是单纯“题集”。

拆开后可自然支持：

- 一码单题
- 一码多题套餐
- 推广体验码
- 同一题集被多个商品复用
- 不同商品对同一题集应用不同引导文案或访问权限

---

## 6. 题集配置模型：通用核心 + 自定义扩展

### 6.1 设计判断

并不是所有题集都适合严格统一。平台应该强约束“最小公共接口”，而不是强行让所有题集共享同一套展示细节。

因此平台采用：

- **通用核心层**：元数据、题目、结果、计分、结果模板键、主题键
- **运行时扩展层**：专属渲染器、专属计分器、扩展配置块

### 6.2 推荐配置结构

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

interface QuizMeta {
  slug: string;
  title: string;
  subtitle?: string;
  summary?: string;
  estimatedMinutes?: number;
  tags?: string[];
  category?: string;
}

interface RuntimeConfig {
  rendererKey: 'generic' | string;
  resultTemplateKey: 'generic' | string;
  scoringKey: 'accumulate' | 'dimension' | 'radar' | 'range' | 'branch' | string;
}

interface PresentationConfig {
  themeKey?: string;
  storyMode?: boolean;
  screenCount?: number;
  shareCardKey?: string;
  customSections?: Array<Record<string, unknown>>;
}

interface SourceManifest {
  sourceType: 'original' | 'adapted' | 'reference_only';
  license?: string;
  sourceName?: string;
  commercialRisk?: 'low' | 'medium' | 'high';
  notes?: string;
}
```

### 6.3 平台如何处理“专属题集”

当某套题集有以下情况时，允许走专属扩展：

- 题量大、逻辑复杂
- 需要非标准化结果页布局
- 需要特殊图表或叙事体验
- 需要专属数据处理逻辑

此时不改平台公共表结构，只在配置中使用：

- `runtime.rendererKey = 'mbti-pro'`
- `runtime.scoringKey = 'custom:oejts-like'`
- `extensions.mbtiPro = { ... }`

这样既保留平台统一管理能力，又避免一开始把所有题集强行塞进死板模型。

---

## 7. 验证码与权益策略模型

### 7.1 核心原则

- 验证码不做“用完即删”
- 验证码不做次数扣减
- 验证码只受 `状态 + 有效期 + 批次策略` 控制
- `verify` 成功后签发时效访问凭证，不直接毁码
- 批次层支持冻结、过期、撤销

### 7.2 支持的策略类型

| 策略 | 说明 | 适用场景 |
| --- | --- | --- |
| `single_product` | 一个验证码对应一个商品，商品中可含一个或多个题集 | 常规付费售卖 |
| `bundle` | 一个验证码对应一个套餐商品，用户可访问套餐内多个题集 | 组合包、节日套装 |
| `promo` | 一个验证码对应推广活动商品，可体验指定题集 | 拉新、投放、KOL 合作 |
| `custom_scope` | 批次策略 JSON 决定可访问题集范围 | 运营临时活动 |

### 7.3 推荐批次策略结构

```json
{
  "scopeMode": "product",
  "allowQuizSlugs": ["city-match", "dark-triad"],
  "introVisible": true,
  "tokenTtlDays": 30,
  "notes": "618 推广码"
}
```

### 7.4 验证码状态

| 状态 | 含义 |
| --- | --- |
| `active` | 可正常验证 |
| `expired` | 已过有效期 |
| `revoked` | 单码撤销 |
| `paused` | 批次冻结，需通过批次状态控制 |

### 7.5 推荐验证流程

```text
用户输入 code
  -> /api/access/verify
  -> D1 查询 code + batch + product
  -> 校验状态、有效期、商品可用性
  -> 签发 access token（带过期时间）
  -> 返回本码可访问的题集列表
  -> 前端进入某个题集的 intro/test 流程
```

### 7.6 为什么要签发访问凭证

因为验证码与“访问会话”不是一回事。

拆开后有几个好处：

- 同一验证码在有效期内可重复进入，不易引发客诉
- 一码多题时，前端可先展示该码有权限的所有题集
- 以后要做扫码直达、入口记忆、最近访问题集时更容易扩展

---

## 8. API 设计

### 8.1 公共接口

| Method | Path | 说明 |
| --- | --- | --- |
| `GET` | `/api/quizzes/public` | Landing Page 使用，返回可公开展示的题集卡片 |
| `GET` | `/api/quizzes/:slug/intro` | 返回测试介绍页所需的公开信息 |
| `POST` | `/api/access/verify` | 验证验证码并签发访问凭证 |
| `GET` | `/api/access/me` | 返回当前凭证下可访问的题集与商品信息 |
| `GET` | `/api/quizzes/:slug/runtime` | 返回已发布的题集运行时配置，需要访问凭证 |
| `POST` | `/api/submissions` | 提交答题结果 |
| `POST` | `/api/submissions/:id/share` | 标记本次结果已导出/分享 |

### 8.2 管理后台接口

| Method | Path | 说明 |
| --- | --- | --- |
| `POST` | `/api/admin/login` | 管理员登录 |
| `GET/POST` | `/api/admin/quizzes` | 题集列表、创建题集 |
| `GET/POST` | `/api/admin/quizzes/:id/versions` | 查看版本、创建草稿版本 |
| `POST` | `/api/admin/quizzes/:id/publish` | 发布指定版本 |
| `GET/POST` | `/api/admin/products` | 商品管理 |
| `GET/POST` | `/api/admin/code-batches` | 批次管理 |
| `POST` | `/api/admin/code-batches/:id/generate` | 生成一批验证码 |
| `POST` | `/api/admin/codes/revoke` | 撤销单码或批量撤销 |
| `GET` | `/api/admin/analytics/summary` | 经营概览 |

### 8.3 `verify` 接口示例

请求：

```json
{
  "code": "A8KQ2P7X"
}
```

响应：

```json
{
  "accessToken": "signed-token",
  "expiresAt": "2026-04-12T00:00:00Z",
  "product": {
    "id": "prod_bundle_001",
    "name": "灵魂测试体验包"
  },
  "allowedQuizzes": [
    { "slug": "city-match", "title": "你的灵魂城市是哪里？" },
    { "slug": "dark-triad", "title": "你的暗黑人格是什么？" }
  ]
}
```

### 8.4 `runtime` 接口说明

`/api/quizzes/:slug/runtime` 的职责是：

- 校验访问凭证是否仍有效
- 读取 D1 当前发布版本指针
- 返回对应题集的运行时 JSON
- 可选从 KV / R2 命中缓存或发布快照

这样可以避免前端直接依赖静态 JSON 路径，也便于后续灰度与回滚。

---

## 9. 发布与存储策略

### 9.1 发布流程

```text
后台编辑草稿版本
  -> 保存 quiz_versions.config_json
  -> 预览
  -> 发布
  -> quizzes.current_published_version_id 指向新版本
  -> 可选同步发布快照到 R2
  -> 刷新 KV 缓存
```

### 9.2 D1 / KV / R2 的协同关系

- **D1**：保存草稿版本与发布指针
- **KV**：缓存公开题集卡片、热点运行时配置、热点验证码元数据
- **R2**：存封面图、结果图素材、已发布快照 JSON

### 9.3 为什么发布快照仍可放 R2

因为 R2 在这里是“发布产物仓库”，不是编辑源。

只要满足以下原则，就不会形成双真相源：

- 编辑只改 D1 中的 `quiz_versions.config_json`
- 发布指针只认 D1
- R2 中的快照是发布后的派生产物

---

## 10. 管理后台范围

当前后台建议只做“经营必需能力”：

1. **题集管理**：题集基础信息、版本列表、发布回滚
2. **商品管理**：单题商品、套餐商品、推广商品
3. **验证码管理**：批次创建、导出、冻结、撤销
4. **数据概览**：订单转化相关的最小经营指标

不建议首期就做：

- 拖拽式页面搭建器
- 重埋点分析平台
- 复杂角色权限系统
- 自动化内容生成后台

---

## 11. Landing Page 评估

Landing Page 有价值，但不是 P0 核心。它更像增长入口，而不是答题主链路的一部分。

优先价值在于：

- 承接分享长图二维码流量
- 建立品牌感而不是“裸奔 H5”
- 展示全部测试，促进交叉购买
- 承接免费试玩入口

注意：

- 在当前 SPA 架构下，Landing Page 的 **品牌承接价值远大于 SEO 价值**
- 如果未来强依赖 SEO，再评估静态预渲染或独立增长页策略

---

## 12. 成本与可行性结论

### 12.1 技术可行性

基于当前锁定技术栈，本项目完全可实现以下目标：

- 多题集统一管理
- 一码单题 / 一码多题 / 推广码 / 套餐码
- 通用题集 + 专属题集共存
- 低成本部署与低运维负担
- 管理后台与前台共用一套前端工程

### 12.2 成本判断

按当前 Cloudflare 官方免费层，项目早期成本可控制在 **接近 0 到很低** 的区间；真正可能带来额外月成本的通常是：

- 自动发货 SaaS
- 域名或短信等外部服务
- 流量明显放大后的 Cloudflare 超额用量

在不做重埋点、不做服务端生成图片、不引入额外 SaaS 的情况下，平台在前期不应出现“月运维几百元”的结构性压力。

说明：免费额度与计费规则可能调整，具体以上线时官方最新文档为准。

---

## 13. 推荐开发顺序

### Phase 0：工程初始化

- Vite + React + TypeScript
- Tailwind + Router + shadcn/ui
- Cloudflare Pages Functions 基础目录
- Wrangler 与本地开发链路

### Phase 1：平台基础骨架

- D1 表结构
- 管理后台登录
- 题集与版本管理
- 商品管理
- 验证码批次与生成

### Phase 2：用户链路

- 验证码验证
- 题集介绍页与答题页
- 通用计分引擎
- 结果页与长图导出

### Phase 3：首批上线

- 首批题集配置
- 小红书自动发货对接
- 经营看板
- Landing Page 简版


# SoulTest

面向小红书等内容渠道的 **题集运营平台 + 数字权益发放系统**。

项目目标不是只做几个单页趣味测试，而是先打好一套可以长期复用的底层：支持多题集管理、验证码/访问权益发放、测试流程承载、结果展示与分享，以及后续按品类持续扩展。

## 项目定位

SoulTest 分为两条核心链路：

- **用户侧**：浏览题集、输入验证码、完成测试、查看结果、生成分享内容。
- **平台侧**：管理题集、版本、产品绑定关系、验证码批次、发布状态与基础运营配置。

当前方向不是重 BI、重 CMS、重页面搭建器，而是一套 **低成本、可长期扩展、对题集业务友好** 的运营底座。

## 核心设计原则

- **D1 是唯一事实源**：核心业务数据统一落 D1。
- **KV 只做缓存 / 短期令牌**：不把 KV 当主数据库使用。
- **R2 只存资源与发布产物**：例如封面、分享图模板、发布快照等。
- **验证码验证后不立即销毁**：优先采用有效期控制，避免用户中断后无法继续。
- **题集配置采用“通用核心 + 自定义扩展”**：简单题集走通用模型，复杂题集允许专属渲染 / 评分扩展。
- **先做耐用底座，不做过度平台化**：首期不上复杂 BI、自动化运营编排、可视化页面搭建器。

## UI / 组件策略

当前仓库已初始化 `shadcn/ui`，后续展示层建议按下面方式演进：

- **基础交互层**：优先使用 `shadcn/ui` 承担表单、弹窗、按钮、表格、后台结构等稳定组件。
- **展示表达层**：可按需引入 `Aceternity UI` 做 Landing Page、题集详情页、结果页氛围模块、营销展示卡片等高表现力区块。
- **体验升级阶段**：后续 UI/UX 重构时，结合 `ui-ux-pro-max` 与相关 UI skills 做系统化迭代，而不是只替换视觉皮肤。

## 当前技术栈

### 前端工程

- `React 19`
- `Vite 8`
- `TypeScript`
- `Tailwind CSS 4`
- `shadcn/ui`
- `React Router v7`

### Cloudflare 目标栈

- `Cloudflare Pages / Functions`
- `Cloudflare D1`
- `Cloudflare KV`
- `Cloudflare R2`
- `Wrangler`

## 当前已落地内容

### 前端骨架

- 公共站点布局 + 后台布局
- 首页、题集详情、测试页、结果页、后台首页骨架
- 题集 mock 数据与基础组件

### 平台底座

- `D1` 初版 schema 与迁移目录
- 本地开发用 seed 数据
- `Wrangler` 配置模板
- `Pages Functions` mock API / stub
- `Vite -> /api` 本地代理

### 当前已提供的 API stub

- `GET /api/health`
- `GET /api/quizzes/public`
- `GET /api/quizzes/:slug/intro`
- `POST /api/access/verify`
- `GET /api/quizzes/:slug/runtime`
- `POST /api/submissions`
- `GET /api/admin/overview`
- `GET /api/admin/quizzes`
- `GET /api/admin/products`
- `GET /api/admin/code-batches`

## 本地开发

### 1. 初始化本地 D1 数据

```bash
pnpm db:migrate:local
pnpm db:seed:local
```

### 2. 一键启动本地联调

```bash
pnpm dev
```

该命令会同时拉起：

- `Vite` 前端开发服务器
- `Cloudflare Pages Functions` 本地环境（含 `D1 / KV / R2` 模拟）

默认情况下：

- 前端页面由 `Vite` 提供热更新
- 本地 API 运行在 `http://127.0.0.1:8788`
- `/api` 已代理到本地 Functions

### 3. 只启动单个进程时可用

```bash
pnpm dev:web   # 仅启动前端
pnpm dev:api   # 仅启动 API / Functions
```

首次初始化或你修改了 schema / seed 时，仍需先执行：

```bash
pnpm db:migrate:local
pnpm db:seed:local
```

### 4. 联调用测试码

- `ST-DEMO-ALPHA`：单题集体验码
- `ST-PACK-618`：双题合集码
- `SOUL-LOVE-0313`：亲密关系模式图谱 MVP 通用码
- `ST-PROMO-OPEN`：推广体验码

## 规划中的核心路由

- `/`：Landing Page / 题集展厅
- `/:slug`：题集介绍页
- `/:slug/test`：测试流程页
- `/:slug/result/:submissionId`：结果页
- `/admin`：管理后台

## 文档结构

- `README.md`：项目总览、原则、技术方向、开发入口
- `.doc/technical_architecture_and_technology_stack_detaile.md`：平台版架构、数据模型、API、验证码策略、成本与开发顺序
- `.doc/Scoring_engine_and_test_question_resource_acquisition_plan.md`：题库来源、合规边界、评分模式、配置抽象
- `.doc/rednote_Fun_Test_Product_Market_Analysis.md`：市场与平台运营分析
- `.doc/Alternative_test_question_sets_and_topic_planning.md`：题集方向与首批选题规划
- `.doc/Annual_report_style_UI_UX_research.md`：结果页 / 分享页视觉研究
- `.doc/landing_page_design_plan.md`：Landing Page 定位与结构建议

## 下一步建议

1. 把首页 / 题集详情 / 后台首页逐步切到真实 API 读取
2. 为管理后台补题集、产品、批次的列表页与表单页
3. 给结果页增加可刷新回查接口与分享海报产物
4. 启动下一轮 UI/UX 重构，聚焦 Landing、详情页、结果表达层

PRAGMA foreign_keys = ON;

INSERT OR REPLACE INTO quizzes (
  id,
  slug,
  title,
  summary,
  category,
  status,
  price,
  landing_visible,
  current_published_version_id
) VALUES
  (
    'quiz_personality_archetype',
    'personality-archetype',
    '人格原型实验室',
    '以更适合内容传播的表达方式重构人格测试，结果页强调角色感、情绪共鸣和分享文案。',
    '人格 / 性格',
    'published',
    19.9,
    1,
    'quiz_version_personality_v1'
  ),
  (
    'quiz_love_pattern_map',
    'love-pattern-map',
    '亲密关系模式图谱',
    '基于关系表达偏好框架改编的 8 题 MVP 版本，先验证结果表达、分享意愿和付费感知。',
    '情感 / 关系',
    'published',
    29.9,
    1,
    'quiz_version_love_v1'
  ),
  (
    'quiz_workplace_energy_profile',
    'workplace-energy-profile',
    '职场能量画像',
    '用轻咨询方式输出职场风格、协作偏好与高能区，兼顾趣味性和实用价值。',
    '职场 / 天赋',
    'published',
    0,
    1,
    'quiz_version_workplace_v1'
  );

INSERT OR REPLACE INTO quiz_versions (
  id,
  quiz_id,
  version,
  schema_version,
  status,
  config_json,
  release_note
) VALUES
  (
    'quiz_version_personality_v1',
    'quiz_personality_archetype',
    1,
    '1.0.0',
    'published',
    '{"meta":{"slug":"personality-archetype","title":"人格原型实验室","summary":"不是冷冰冰的量表，而是能被用户看懂、愿意晒出来的人格故事。","estimatedMinutes":6,"tags":["高传播","可分享","结果包装强"],"category":"人格 / 性格"},"runtime":{"rendererKey":"generic","resultTemplateKey":"story-card","scoringKey":"dimension"},"presentation":{"themeKey":"violet-lab","storyMode":true,"screenCount":4,"shareCardKey":"persona-poster"},"questions":[{"id":"q1","type":"single_choice","title":"聚会里你更像哪种角色？","options":[{"id":"q1_a","label":"主动暖场的人","value":{"spark":2}},{"id":"q1_b","label":"观察氛围的人","value":{"insight":2}},{"id":"q1_c","label":"负责照顾细节的人","value":{"care":2}}]},{"id":"q2","type":"single_choice","title":"遇到压力时你会先做什么？","options":[{"id":"q2_a","label":"立刻行动拆解问题","value":{"spark":2}},{"id":"q2_b","label":"先消化情绪再行动","value":{"care":2}},{"id":"q2_c","label":"先弄清底层原因","value":{"insight":2}}]}],"results":[{"key":"spark_leader","title":"火花主导者","summary":"你会点亮氛围，也擅长把自己推到故事中央。"},{"key":"insight_observer","title":"洞察观察者","summary":"你更擅长捕捉细节与情绪变化，结果页适合做深度叙事。"},{"key":"care_anchor","title":"情绪锚点者","summary":"你在关系里更像稳定器，适合温柔但坚定的表达。"}],"extensions":{"share":{"captionTone":"dramatic"}}}',
    '初始化本地联调用的 v1 发布版'
  ),
  (
    'quiz_version_love_v1',
    'quiz_love_pattern_map',
    1,
    '1.0.0',
    'published',
    '{"meta":{"slug":"love-pattern-map","title":"亲密关系模式图谱","summary":"基于关系表达偏好框架改编的 8 题 MVP，用来验证结果表达和用户分享欲。","estimatedMinutes":4,"tags":["情绪价值","关系表达","MVP 首发"],"category":"情感 / 关系"},"runtime":{"rendererKey":"generic","resultTemplateKey":"relationship-story","scoringKey":"dimension"},"presentation":{"themeKey":"rose-map","storyMode":true,"screenCount":4,"shareCardKey":"love-pattern-card"},"questions":[{"id":"q1","type":"single_choice","title":"忙了一整周后，什么最让你感到被在乎？","options":[{"id":"q1_a","label":"听到一句很真诚的肯定","value":{"affirmation":1}},{"id":"q1_b","label":"对方专门留出一段只属于你的时间","value":{"time":1}},{"id":"q1_c","label":"有人顺手把麻烦事替你处理掉","value":{"service":1}},{"id":"q1_d","label":"收到一份记得你喜好的小东西","value":{"gifts":1}},{"id":"q1_e","label":"被抱住安静待一会儿","value":{"touch":1}}]},{"id":"q2","type":"single_choice","title":"发生争执后，哪种和好方式最能打动你？","options":[{"id":"q2_a","label":"认真道歉，并明确说你很重要","value":{"affirmation":1}},{"id":"q2_b","label":"关掉手机，坐下来好好聊一晚","value":{"time":1}},{"id":"q2_c","label":"直接把问题修好，不再重演","value":{"service":1}},{"id":"q2_d","label":"带来一份用心准备的小补偿","value":{"gifts":1}},{"id":"q2_e","label":"主动靠近，牵手或拥抱","value":{"touch":1}}]},{"id":"q3","type":"single_choice","title":"理想的纪念日更像下面哪一种？","options":[{"id":"q3_a","label":"写一段只属于你的话给你","value":{"affirmation":1}},{"id":"q3_b","label":"安排一整段完整二人时间","value":{"time":1}},{"id":"q3_c","label":"把吃住行流程都照顾妥当","value":{"service":1}},{"id":"q3_d","label":"准备一个有故事的小礼物","value":{"gifts":1}},{"id":"q3_e","label":"有很多贴贴和亲密互动","value":{"touch":1}}]},{"id":"q4","type":"single_choice","title":"对方很忙但还想表达心意，你最在意哪件事？","options":[{"id":"q4_a","label":"抽空发来坚定又温柔的话","value":{"affirmation":1}},{"id":"q4_b","label":"哪怕很短，也给你完整专注的十分钟","value":{"time":1}},{"id":"q4_c","label":"顺手帮你解决一个现实问题","value":{"service":1}},{"id":"q4_d","label":"记住你的偏好，带回一个小心意","value":{"gifts":1}},{"id":"q4_e","label":"回到你身边先给你一个拥抱","value":{"touch":1}}]},{"id":"q5","type":"single_choice","title":"在关系里，你最容易对哪种落差失望？","options":[{"id":"q5_a","label":"说话越来越冷淡、敷衍","value":{"affirmation":1}},{"id":"q5_b","label":"总说重要，却始终没空陪你","value":{"time":1}},{"id":"q5_c","label":"答应的事一再落空","value":{"service":1}},{"id":"q5_d","label":"总记不住你的喜好和细节","value":{"gifts":1}},{"id":"q5_e","label":"身体上越来越疏离","value":{"touch":1}}]},{"id":"q6","type":"single_choice","title":"当你很低落时，你最想被怎样安慰？","options":[{"id":"q6_a","label":"被明确肯定和安抚","value":{"affirmation":1}},{"id":"q6_b","label":"有人安静地陪着你","value":{"time":1}},{"id":"q6_c","label":"有人帮你把眼前的事理顺","value":{"service":1}},{"id":"q6_d","label":"收到一个带心意的小惊喜","value":{"gifts":1}},{"id":"q6_e","label":"被搂一下、拍拍背","value":{"touch":1}}]},{"id":"q7","type":"single_choice","title":"你判断对方是否认真时，更看重什么？","options":[{"id":"q7_a","label":"是否愿意清楚表达爱和认可","value":{"affirmation":1}},{"id":"q7_b","label":"是否愿意持续投入时间陪你","value":{"time":1}},{"id":"q7_c","label":"是否会把承诺真正落到行动","value":{"service":1}},{"id":"q7_d","label":"是否会记住细节并准备心意","value":{"gifts":1}},{"id":"q7_e","label":"是否会自然地主动靠近你","value":{"touch":1}}]},{"id":"q8","type":"single_choice","title":"如果只能保留一种“被爱证明”，你会选哪种？","options":[{"id":"q8_a","label":"经常听到被珍视和夸奖","value":{"affirmation":1}},{"id":"q8_b","label":"经常拥有高质量相处时间","value":{"time":1}},{"id":"q8_c","label":"经常被实际照顾和分担","value":{"service":1}},{"id":"q8_d","label":"经常收到有记忆点的小礼物","value":{"gifts":1}},{"id":"q8_e","label":"经常拥有拥抱和身体靠近","value":{"touch":1}}]}],"results":[{"key":"affirmation_resonator","dimensionKey":"affirmation","title":"言语确认型","summary":"你会通过被肯定、被认真表达来确认关系温度，模糊和敷衍最容易让你失落。","highlights":["你需要被明确说出来的在乎","一句认真回应，胜过很多含糊表示"]},{"key":"time_companion","dimensionKey":"time","title":"陪伴沉浸型","summary":"你最在意的是完整的注意力和专注陪伴，对你来说“在场”本身就是爱。","highlights":["高质量陪伴比频繁消息更有力量","你很能分辨对方是否真正把时间留给你"]},{"key":"service_supporter","dimensionKey":"service","title":"行动照顾型","summary":"你相信做比说更有说服力，真正让你安心的是被照顾、被分担、被落地兑现。","highlights":["你看重承诺是否真的被执行","细致照顾会让你快速建立安全感"]},{"key":"gift_memory","dimensionKey":"gifts","title":"心意具象型","summary":"你会从“被记住”里感受到爱，礼物对你不是价格，而是心意被具体看见。","highlights":["你很在意对方有没有记住细节","小而准的心意比昂贵更打动你"]},{"key":"touch_healer","dimensionKey":"touch","title":"靠近治愈型","summary":"身体靠近会让你迅速感到安心，一个拥抱、牵手或贴近比很多解释更有效。","highlights":["你通过靠近确认关系的真实感","亲密接触会直接影响你的安全感"]}],"extensions":{"scoring":{"dimensions":[{"key":"affirmation","label":"言语确认"},{"key":"time","label":"陪伴时间"},{"key":"service","label":"行动照顾"},{"key":"gifts","label":"心意礼物"},{"key":"touch","label":"身体靠近"}]},"share":{"captionTone":"intimate"}}}',
    '初始化本地联调用的 v1 发布版'
  ),
  (
    'quiz_version_workplace_v1',
    'quiz_workplace_energy_profile',
    1,
    '1.0.0',
    'published',
    '{"meta":{"slug":"workplace-energy-profile","title":"职场能量画像","summary":"适合做高客单补充品类，也适合作为免费体验引流题。","estimatedMinutes":5,"tags":["低门槛","轻职业咨询","引流友好"],"category":"职场 / 天赋"},"runtime":{"rendererKey":"generic","resultTemplateKey":"career-energy","scoringKey":"dimension"},"presentation":{"themeKey":"amber-work","storyMode":false,"screenCount":3,"shareCardKey":"work-energy-card"},"questions":[{"id":"q1","type":"single_choice","title":"你最有能量的工作状态是？","options":[{"id":"q1_a","label":"快速推进项目","value":{"drive":2}},{"id":"q1_b","label":"帮助团队协同","value":{"support":2}},{"id":"q1_c","label":"分析问题建模型","value":{"insight":2}}]},{"id":"q2","type":"single_choice","title":"什么最容易消耗你？","options":[{"id":"q2_a","label":"流程太慢","value":{"drive":2}},{"id":"q2_b","label":"关系紧张","value":{"support":2}},{"id":"q2_c","label":"目标模糊","value":{"insight":2}}]}],"results":[{"key":"driver_mode","title":"推进引擎型","summary":"你适合承担目标推进与项目落地。"},{"key":"support_mode","title":"协同润滑型","summary":"你擅长稳住团队氛围与协作效率。"},{"key":"insight_mode","title":"策略洞察型","summary":"你在分析、拆解和建模时最有存在感。"}],"extensions":{"share":{"captionTone":"confident"}}}',
    '初始化本地联调用的 v1 发布版'
  );

UPDATE quizzes SET current_draft_version_id = current_published_version_id;

INSERT OR REPLACE INTO products (
  id,
  name,
  product_type,
  status,
  sales_channel,
  purchase_url,
  intro_mode,
  landing_visible,
  description
) VALUES
  (
    'product_personality_single',
    '人格原型单测体验',
    'single_product',
    'active',
    'xiaohongshu',
    'https://example.com/personality',
    'code_gate',
    1,
    '单码单题集，适合标准付费售卖。'
  ),
  (
    'product_relationship_bundle',
    '人格 + 关系双题合集',
    'bundle',
    'active',
    'xiaohongshu',
    'https://example.com/bundle',
    'code_gate',
    1,
    '一码可解锁人格原型实验室和亲密关系模式图谱。'
  ),
  (
    'product_love_shared',
    '亲密关系模式图谱 · MVP 单测',
    'single_product',
    'active',
    'xiaohongshu',
    'https://example.com/love-mvp',
    'code_gate',
    1,
    'MVP 阶段单题集通用码方案，验证付费链路与结果表达。'
  ),
  (
    'product_promo_experience',
    '职场能量免费体验码',
    'promo',
    'active',
    'xiaohongshu',
    'https://example.com/promo',
    'hybrid',
    1,
    '前期拉新体验用，强调低门槛试用。'
  );

INSERT OR REPLACE INTO product_quizzes (
  id,
  product_id,
  quiz_id,
  sort_order,
  access_json
) VALUES
  (
    'pq_personality_single',
    'product_personality_single',
    'quiz_personality_archetype',
    1,
    '{"mode":"full_access"}'
  ),
  (
    'pq_bundle_personality',
    'product_relationship_bundle',
    'quiz_personality_archetype',
    1,
    '{"mode":"full_access"}'
  ),
  (
    'pq_bundle_love',
    'product_relationship_bundle',
    'quiz_love_pattern_map',
    2,
    '{"mode":"full_access"}'
  ),
  (
    'pq_love_shared',
    'product_love_shared',
    'quiz_love_pattern_map',
    1,
    '{"mode":"full_access"}'
  ),
  (
    'pq_promo_workplace',
    'product_promo_experience',
    'quiz_workplace_energy_profile',
    1,
    '{"mode":"trial"}'
  );

INSERT OR REPLACE INTO code_batches (
  id,
  product_id,
  name,
  strategy_type,
  code_prefix,
  code_length,
  status,
  expires_at,
  policy_json
) VALUES
  (
    'batch_personality_launch',
    'product_personality_single',
    '人格原型首发批次',
    'single_product',
    'ST',
    12,
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"scopeMode":"product","tokenTtlDays":30,"introVisible":true,"notes":"首发标准售卖批次"}'
  ),
  (
    'batch_bundle_campaign',
    'product_relationship_bundle',
    '双题合集 618 批次',
    'bundle',
    'ST',
    12,
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"scopeMode":"product","tokenTtlDays":30,"introVisible":true,"notes":"618 打包活动"}'
  ),
  (
    'batch_love_shared_mvp',
    'product_love_shared',
    '关系题 MVP 通用码批次',
    'single_product',
    'SOUL',
    14,
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"scopeMode":"product","verificationMode":"shared_code","tokenTtlDays":30,"introVisible":true,"notes":"MVP 通用码，后续可平滑切换为一单一码"}'
  ),
  (
    'batch_promo_trial',
    'product_promo_experience',
    '免费体验推广码',
    'promo',
    'ST',
    12,
    'active',
    '2026-06-30T23:59:59.000Z',
    '{"scopeMode":"custom_scope","allowQuizSlugs":["workplace-energy-profile"],"tokenTtlDays":7,"introVisible":true,"notes":"KOL 推广批次"}'
  );

INSERT OR REPLACE INTO codes (
  code,
  batch_id,
  status,
  expires_at,
  metadata_json
) VALUES
  (
    'ST-DEMO-ALPHA',
    'batch_personality_launch',
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"channel":"manual","remark":"单题集联调码"}'
  ),
  (
    'ST-PACK-618',
    'batch_bundle_campaign',
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"channel":"campaign","remark":"双题合集联调码"}'
  ),
  (
    'SOUL-LOVE-0313',
    'batch_love_shared_mvp',
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"channel":"mvp","remark":"亲密关系模式图谱 MVP 通用码"}'
  ),
  (
    'ST-PROMO-OPEN',
    'batch_promo_trial',
    'active',
    '2026-06-30T23:59:59.000Z',
    '{"channel":"promo","remark":"体验码联调"}'
  );

INSERT OR REPLACE INTO admins (
  id,
  username,
  password_hash
) VALUES (
  'admin_local_dev',
  'admin',
  'dev-only-placeholder-hash'
);

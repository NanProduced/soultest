-- Stress Load Test Seed Data
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
) VALUES (
  'quiz_stress_load_test',
  'stress-load-test',
  '压力负荷测试',
  '测测最近 30 天，你的心理系统到底承受了多少重量',
  '心理状态 / 压力',
  'published',
  19.9,
  1,
  'quiz_version_stress_load_v1'
);

INSERT OR REPLACE INTO quiz_versions (
  id,
  quiz_id,
  version,
  schema_version,
  status,
  config_json,
  release_note
) VALUES (
  'quiz_version_stress_load_v1',
  'quiz_stress_load_test',
  1,
  '1.0.0',
  'published',
  '{"meta":{"slug":"stress-load-test","title":"压力负荷测试","summary":"测测最近 30 天，你的心理系统到底承受了多少重量","estimatedMinutes":5,"tags":["压力负荷","25 题","心理状态","深度报告"],"category":"心理状态 / 压力"},"runtime":{"rendererKey":"custom","resultTemplateKey":"custom","scoringKey":"radar"},"presentation":{"themeKey":"midnight-stress","storyMode":true,"screenCount":5,"shareCardKey":"stress-load-poster"},"questions":[{"id":"q1","title":"我经常觉得要处理的事情明显多于我的时间和精力。","axisKey":"D1","type":"single_choice","options":[{"id":"q1_1","label":"几乎没有","value":{"D1":1}},{"id":"q1_2","label":"偶尔如此","value":{"D1":2}},{"id":"q1_3","label":"有时如此","value":{"D1":3}},{"id":"q1_4","label":"经常如此","value":{"D1":4}},{"id":"q1_5","label":"几乎总是","value":{"D1":5}}]},{"id":"q2","title":"一件事刚做完，下一件事就立刻顶上来，让我很难真正喘口气。","axisKey":"D1","type":"single_choice","options":[{"id":"q2_1","label":"几乎没有","value":{"D1":1}},{"id":"q2_2","label":"偶尔如此","value":{"D1":2}},{"id":"q2_3","label":"有时如此","value":{"D1":3}},{"id":"q2_4","label":"经常如此","value":{"D1":4}},{"id":"q2_5","label":"几乎总是","value":{"D1":5}}]},{"id":"q3","title":"即使在休息时，我脑子里也常挂着“还有很多没做完”。","axisKey":"D1","type":"single_choice","options":[{"id":"q3_1","label":"几乎没有","value":{"D1":1}},{"id":"q3_2","label":"偶尔如此","value":{"D1":2}},{"id":"q3_3","label":"有时如此","value":{"D1":3}},{"id":"q3_4","label":"经常如此","value":{"D1":4}},{"id":"q3_5","label":"几乎总是","value":{"D1":5}}]},{"id":"q4","title":"我经常同时记着很多待办，以至于很难彻底放松。","axisKey":"D1","type":"single_choice","options":[{"id":"q4_1","label":"几乎没有","value":{"D1":1}},{"id":"q4_2","label":"偶尔如此","value":{"D1":2}},{"id":"q4_3","label":"有时如此","value":{"D1":3}},{"id":"q4_4","label":"经常如此","value":{"D1":4}},{"id":"q4_5","label":"几乎总是","value":{"D1":5}}]},{"id":"q5","title":"一天结束后，我常有一种“忙了很久但还是没消化完事情”的感觉。","axisKey":"D1","type":"single_choice","options":[{"id":"q5_1","label":"几乎没有","value":{"D1":1}},{"id":"q5_2","label":"偶尔如此","value":{"D1":2}},{"id":"q5_3","label":"有时如此","value":{"D1":3}},{"id":"q5_4","label":"经常如此","value":{"D1":4}},{"id":"q5_5","label":"几乎总是","value":{"D1":5}}]},{"id":"q6","title":"最近我经常觉得生活节奏不是我在安排，而是我在被推着走。","axisKey":"D2","type":"single_choice","options":[{"id":"q6_1","label":"几乎没有","value":{"D2":1}},{"id":"q6_2","label":"偶尔如此","value":{"D2":2}},{"id":"q6_3","label":"有时如此","value":{"D2":3}},{"id":"q6_4","label":"经常如此","value":{"D2":4}},{"id":"q6_5","label":"几乎总是","value":{"D2":5}}]},{"id":"q7","title":"一点临时变化，就很容易打乱我整天的状态。","axisKey":"D2","type":"single_choice","options":[{"id":"q7_1","label":"几乎没有","value":{"D2":1}},{"id":"q7_2","label":"偶尔如此","value":{"D2":2}},{"id":"q7_3","label":"有时如此","value":{"D2":3}},{"id":"q7_4","label":"经常如此","value":{"D2":4}},{"id":"q7_5","label":"几乎总是","value":{"D2":5}}]},{"id":"q8","title":"我时常觉得重要的事情并不在我的掌控范围内。","axisKey":"D2","type":"single_choice","options":[{"id":"q8_1","label":"几乎没有","value":{"D2":1}},{"id":"q8_2","label":"偶尔如此","value":{"D2":2}},{"id":"q8_3","label":"有时如此","value":{"D2":3}},{"id":"q8_4","label":"经常如此","value":{"D2":4}},{"id":"q8_5","label":"几乎总是","value":{"D2":5}}]},{"id":"q9","title":"面对问题时，我第一反应更像是“我又要被压住了”，而不是“我能处理”。","axisKey":"D2","type":"single_choice","options":[{"id":"q9_1","label":"几乎没有","value":{"D2":1}},{"id":"q9_2","label":"偶尔如此","value":{"D2":2}},{"id":"q9_3","label":"有时如此","value":{"D2":3}},{"id":"q9_4","label":"经常如此","value":{"D2":4}},{"id":"q9_5","label":"几乎总是","value":{"D2":5}}]},{"id":"q10","title":"我最近常有一种“再怎么努力，也追不上变化”的无力感。","axisKey":"D2","type":"single_choice","options":[{"id":"q10_1","label":"几乎没有","value":{"D2":1}},{"id":"q10_2","label":"偶尔如此","value":{"D2":2}},{"id":"q10_3","label":"有时如此","value":{"D2":3}},{"id":"q10_4","label":"经常如此","value":{"D2":4}},{"id":"q10_5","label":"几乎总是","value":{"D2":5}}]},{"id":"q11","title":"明明事情还没发生，我却会提前在脑子里反复预演最坏情况。","axisKey":"D3","type":"single_choice","options":[{"id":"q11_1","label":"几乎没有","value":{"D3":1}},{"id":"q11_2","label":"偶尔如此","value":{"D3":2}},{"id":"q11_3","label":"有时如此","value":{"D3":3}},{"id":"q11_4","label":"经常如此","value":{"D3":4}},{"id":"q11_5","label":"几乎总是","value":{"D3":5}}]},{"id":"q12","title":"听到消息提示音、电话或临时通知时，我身体会下意识紧一下。","axisKey":"D3","type":"single_choice","options":[{"id":"q12_1","label":"几乎没有","value":{"D3":1}},{"id":"q12_2","label":"偶尔如此","value":{"D3":2}},{"id":"q12_3","label":"有时如此","value":{"D3":3}},{"id":"q12_4","label":"经常如此","value":{"D3":4}},{"id":"q12_5","label":"几乎总是","value":{"D3":5}}]},{"id":"q13","title":"到了晚上、周末或假期，我也很难完全停止对接下来事情的担心。","axisKey":"D3","type":"single_choice","options":[{"id":"q13_1","label":"几乎没有","value":{"D3":1}},{"id":"q13_2","label":"偶尔如此","value":{"D3":2}},{"id":"q13_3","label":"有时如此","value":{"D3":3}},{"id":"q13_4","label":"经常如此","value":{"D3":4}},{"id":"q13_5","label":"几乎总是","value":{"D3":5}}]},{"id":"q14","title":"有些事还没开始，我已经先被它耗掉很多心理能量。","axisKey":"D3","type":"single_choice","options":[{"id":"q14_1","label":"几乎没有","value":{"D3":1}},{"id":"q14_2","label":"偶尔如此","value":{"D3":2}},{"id":"q14_3","label":"有时如此","value":{"D3":3}},{"id":"q14_4","label":"经常如此","value":{"D3":4}},{"id":"q14_5","label":"几乎总是","value":{"D3":5}}]},{"id":"q15","title":"我最近很少有“真的放心了”的状态，总像还有什么在后面等着我。","axisKey":"D3","type":"single_choice","options":[{"id":"q15_1","label":"几乎没有","value":{"D3":1}},{"id":"q15_2","label":"偶尔如此","value":{"D3":2}},{"id":"q15_3","label":"有时如此","value":{"D3":3}},{"id":"q15_4","label":"经常如此","value":{"D3":4}},{"id":"q15_5","label":"几乎总是","value":{"D3":5}}]},{"id":"q16","title":"即使睡了一觉，我也不太觉得自己真正恢复过来。","axisKey":"D4","type":"single_choice","options":[{"id":"q16_1","label":"几乎没有","value":{"D4":1}},{"id":"q16_2","label":"偶尔如此","value":{"D4":2}},{"id":"q16_3","label":"有时如此","value":{"D4":3}},{"id":"q16_4","label":"经常如此","value":{"D4":4}},{"id":"q16_5","label":"几乎总是","value":{"D4":5}}]},{"id":"q17","title":"做以前喜欢的事，也不一定能让我明显放松。","axisKey":"D4","type":"single_choice","options":[{"id":"q17_1","label":"几乎没有","value":{"D4":1}},{"id":"q17_2","label":"偶尔如此","value":{"D4":2}},{"id":"q17_3","label":"有时如此","value":{"D4":3}},{"id":"q17_4","label":"经常如此","value":{"D4":4}},{"id":"q17_5","label":"几乎总是","value":{"D4":5}}]},{"id":"q18","title":"我明明在休息，但大脑并没有一起停下来。","axisKey":"D4","type":"single_choice","options":[{"id":"q18_1","label":"几乎没有","value":{"D4":1}},{"id":"q18_2","label":"偶尔如此","value":{"D4":2}},{"id":"q18_3","label":"有时如此","value":{"D4":3}},{"id":"q18_4","label":"经常如此","value":{"D4":4}},{"id":"q18_5","label":"几乎总是","value":{"D4":5}}]},{"id":"q19","title":"即便当天没有特别忙，我也常像一直处于“工作模式”里。","axisKey":"D4","type":"single_choice","options":[{"id":"q19_1","label":"几乎没有","value":{"D4":1}},{"id":"q19_2","label":"偶尔如此","value":{"D4":2}},{"id":"q19_3","label":"有时如此","value":{"D4":3}},{"id":"q19_4","label":"经常如此","value":{"D4":4}},{"id":"q19_5","label":"几乎总是","value":{"D4":5}}]},{"id":"q20","title":"最近让我感到“完全轻松”的时刻，比以前少了很多。","axisKey":"D4","type":"single_choice","options":[{"id":"q20_1","label":"几乎没有","value":{"D4":1}},{"id":"q20_2","label":"偶尔如此","value":{"D4":2}},{"id":"q20_3","label":"有时如此","value":{"D4":3}},{"id":"q20_4","label":"经常如此","value":{"D4":4}},{"id":"q20_5","label":"几乎总是","value":{"D4":5}}]},{"id":"q21","title":"我比以前更容易烦躁、没耐心，或者突然很想躲开所有人。","axisKey":"D5","type":"single_choice","options":[{"id":"q21_1","label":"几乎没有","value":{"D5":1}},{"id":"q21_2","label":"偶尔如此","value":{"D5":2}},{"id":"q21_3","label":"有时如此","value":{"D5":3}},{"id":"q21_4","label":"经常如此","value":{"D5":4}},{"id":"q21_5","label":"几乎总是","value":{"D5":5}}]},{"id":"q22","title":"一些不算大的事，也会让我觉得格外心累。","axisKey":"D5","type":"single_choice","options":[{"id":"q22_1","label":"几乎没有","value":{"D5":1}},{"id":"q22_2","label":"偶尔如此","value":{"D5":2}},{"id":"q22_3","label":"有时如此","value":{"D5":3}},{"id":"q22_4","label":"经常如此","value":{"D5":4}},{"id":"q22_5","label":"几乎总是","value":{"D5":5}}]},{"id":"q23","title":"我最近更懒得解释、社交或回应外界。","axisKey":"D5","type":"single_choice","options":[{"id":"q23_1","label":"几乎没有","value":{"D5":1}},{"id":"q23_2","label":"偶尔如此","value":{"D5":2}},{"id":"q23_3","label":"有时如此","value":{"D5":3}},{"id":"q23_4","label":"经常如此","value":{"D5":4}},{"id":"q23_5","label":"几乎总是","value":{"D5":5}}]},{"id":"q24","title":"我知道自己应该调整状态，但常常提不起真正行动的力气。","axisKey":"D5","type":"single_choice","options":[{"id":"q24_1","label":"几乎没有","value":{"D5":1}},{"id":"q24_2","label":"偶尔如此","value":{"D5":2}},{"id":"q24_3","label":"有时如此","value":{"D5":3}},{"id":"q24_4","label":"经常如此","value":{"D5":4}},{"id":"q24_5","label":"几乎总是","value":{"D5":5}}]},{"id":"q25","title":"我经常觉得自己像被慢慢磨薄了一层，不是突然崩掉，而是持续被耗着。","axisKey":"D5","type":"single_choice","options":[{"id":"q25_1","label":"几乎没有","value":{"D5":1}},{"id":"q25_2","label":"偶尔如此","value":{"D5":2}},{"id":"q25_3","label":"有时如此","value":{"D5":3}},{"id":"q25_4","label":"经常如此","value":{"D5":4}},{"id":"q25_5","label":"几乎总是","value":{"D5":5}}]}],"results":[{"key":"P1","title":"任务洪流型","summary":"事太多，脑内待办永不清零","dimensionKey":"D1"},{"key":"P2","title":"失控悬挂型","summary":"最耗你的，不一定是忙，而是失控感。","dimensionKey":"D2"},{"key":"P3","title":"预警常开型","summary":"系统长期处于提前戒备状态。","dimensionKey":"D3"},{"key":"P4","title":"恢复断电型","summary":"你不是真的没休息，而是休息已经恢复不了你。","dimensionKey":"D4"},{"key":"P5","title":"情绪磨损型","summary":"压力已经开始慢慢磨损你的情绪弹性。","dimensionKey":"D5"}],"extensions":{"scoring":{"dimensions":[{"key":"D1","label":"任务超载"},{"key":"D2","label":"掌控流失"},{"key":"D3","label":"预警常开"},{"key":"D4","label":"恢复断电"},{"key":"D5","label":"情绪磨损"}]},"stressLoad":{"levels":[{"key":"L1","min":0,"max":19,"name":"轻压巡航","summary":"有压力，但系统整体仍在可恢复区间"},{"key":"L2","min":20,"max":39,"name":"持续拉紧","summary":"已经开始长时间绷着，放松效率下降"},{"key":"L3","min":40,"max":59,"name":"高压积载","summary":"压力正在累积，多个维度出现明显超载"},{"key":"L4","min":60,"max":79,"name":"过载边缘","summary":"系统持续高压运转，恢复明显跟不上消耗"},{"key":"L5","min":80,"max":100,"name":"超载警报","summary":"你的心理系统已接近或进入严重超负荷区间"}],"profiles":[{"key":"P1","dimensionKey":"D1","name":"任务洪流型","issue":"事太多，脑内待办永不清零"},{"key":"P2","dimensionKey":"D2","name":"失控悬挂型","issue":"最耗你的，不一定是忙，而是失控感。"},{"key":"P3","dimensionKey":"D3","name":"预警常开型","issue":"系统长期处于提前戒备状态。"},{"key":"P4","dimensionKey":"D4","name":"恢复断电型","issue":"你不是真的没休息，而是休息已经恢复不了你。"},{"key":"P5","dimensionKey":"D5","name":"情绪磨损型","issue":"压力已经开始慢慢磨损你的情绪弹性。"}]},"intro":{"tagline":"25 ?????????????????????","priceLabel":"25 ????","accessSummary":"?????????????????????????","questionCount":25,"valuePoints":["????????","????????","72 ????????"],"flowSteps":["?????","?? 25 ?","??????"],"detailSections":[{"title":"?????????","description":"?????????????????????????????????????????????????????????????????? 30 ???????"},{"title":"??????","description":"?????????????????????????????????? 72 ?????????????????????????"}]}}}',
  '压力负荷测试正式版首发运行时配置，采用自定义渲染器与结果页。'
);

UPDATE quizzes
SET current_draft_version_id = 'quiz_version_stress_load_v1'
WHERE id = 'quiz_stress_load_test';

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
) VALUES (
  'product_stress_load_single',
  '压力负荷测试 · 正式版单测',
  'single_product',
  'active',
  'xiaohongshu',
  'https://example.com/stress-load',
  'code_gate',
  1,
  '采用共享验证码交付压力负荷测试正式版。'
);

INSERT OR REPLACE INTO product_quizzes (
  id,
  product_id,
  quiz_id,
  sort_order,
  access_json
) VALUES (
  'pq_stress_load_single',
  'product_stress_load_single',
  'quiz_stress_load_test',
  1,
  '{"mode":"full_access"}'
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
) VALUES (
  'batch_stress_load_launch',
  'product_stress_load_single',
  '压力负荷测试首发批次',
  'single_product',
  'STRESS',
  14,
  'active',
  '2026-12-31T23:59:59.000Z',
  '{"scopeMode":"product","verificationMode":"shared_code","tokenTtlDays":30,"introVisible":true,"notes":"正式版首发阶段采用共享验证码"}'
);

INSERT OR REPLACE INTO codes (
  code,
  batch_id,
  status,
  expires_at,
  metadata_json
) VALUES
  (
    'STRESS-LOAD-2026',
    'batch_stress_load_launch',
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"channel":"formal-launch","remark":"压力负荷测试正式版随机验证码"}'
  ),
  (
    'ST-STRESS-BETA',
    'batch_stress_load_launch',
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"channel":"customer-support","remark":"压力负荷测试联调验证码"}'
  );

PRAGMA foreign_keys = ON;

DELETE FROM submissions;
DELETE FROM codes;
DELETE FROM code_batches;
DELETE FROM product_quizzes;
DELETE FROM products;
DELETE FROM quiz_versions;
DELETE FROM quizzes;
DELETE FROM admins;

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
  'quiz_oejts_personality_map',
  'oejts-personality-map',
  'OEJTS 16 型人格图谱',
  'OEJTS 16 型人格图谱是一套基于四条人格偏好维度的自我探索测试，帮你看见自己的注意力方向、判断方式与行动节奏。',
  '人格 / 性格',
  'published',
  29.9,
  1,
  'quiz_version_oejts_v1'
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
  'quiz_version_oejts_v1',
  'quiz_oejts_personality_map',
  1,
  '1.0.0',
  'published',
  '{"meta":{"slug":"oejts-personality-map","title":"OEJTS 16 型人格图谱","summary":"OEJTS 16 型人格图谱是一套基于四条人格偏好维度的自我探索测试，帮你看见自己的注意力方向、判断方式与行动节奏。","estimatedMinutes":8,"tags":["OEJTS","32 题完整版","16 型人格","适合保存结果卡片"],"category":"人格 / 性格"},"runtime":{"rendererKey":"generic","resultTemplateKey":"oejts-profile","scoringKey":"oejts"},"presentation":{"themeKey":"ink-glow","storyMode":true,"screenCount":5,"shareCardKey":"oejts-type-poster"},"questions":[{"id":"q01","title":"让你更快“回血”的通常是？","leftLabel":"热闹一点、和人待在一起","rightLabel":"安静一点、自己待一会儿","axisKey":"ie","reverseScore":true,"type":"single_choice","options":[{"id":"q01_1","label":"明显更接近左边","value":{"score":1}},{"id":"q01_2","label":"略偏左边","value":{"score":2}},{"id":"q01_3","label":"两边差不多","value":{"score":3}},{"id":"q01_4","label":"略偏右边","value":{"score":4}},{"id":"q01_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q02","title":"当脑中刚冒出一个想法时，你更像哪一边？","leftLabel":"先说出来，边聊边想清楚","rightLabel":"先在心里理顺，再开口表达","axisKey":"ie","reverseScore":true,"type":"single_choice","options":[{"id":"q02_1","label":"明显更接近左边","value":{"score":1}},{"id":"q02_2","label":"略偏左边","value":{"score":2}},{"id":"q02_3","label":"两边差不多","value":{"score":3}},{"id":"q02_4","label":"略偏右边","value":{"score":4}},{"id":"q02_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q03","title":"刚进入陌生场合时，你通常会？","leftLabel":"比较自然地主动和人搭话","rightLabel":"先观察气氛，再慢慢进入状态","axisKey":"ie","reverseScore":true,"type":"single_choice","options":[{"id":"q03_1","label":"明显更接近左边","value":{"score":1}},{"id":"q03_2","label":"略偏左边","value":{"score":2}},{"id":"q03_3","label":"两边差不多","value":{"score":3}},{"id":"q03_4","label":"略偏右边","value":{"score":4}},{"id":"q03_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q04","title":"哪种状态更容易让你进入节奏？","leftLabel":"和别人一起推进一件事","rightLabel":"一个人安静地把事情做下去","axisKey":"ie","reverseScore":true,"type":"single_choice","options":[{"id":"q04_1","label":"明显更接近左边","value":{"score":1}},{"id":"q04_2","label":"略偏左边","value":{"score":2}},{"id":"q04_3","label":"两边差不多","value":{"score":3}},{"id":"q04_4","label":"略偏右边","value":{"score":4}},{"id":"q04_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q05","title":"如果周末完全由你安排，你更可能会？","leftLabel":"约人见面、出去走走","rightLabel":"留点时间给自己慢慢过","axisKey":"ie","reverseScore":true,"type":"single_choice","options":[{"id":"q05_1","label":"明显更接近左边","value":{"score":1}},{"id":"q05_2","label":"略偏左边","value":{"score":2}},{"id":"q05_3","label":"两边差不多","value":{"score":3}},{"id":"q05_4","label":"略偏右边","value":{"score":4}},{"id":"q05_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q06","title":"在多人讨论里，你更接近哪一边？","leftLabel":"更愿意先把观点抛出来","rightLabel":"更习惯先听一圈再表达","axisKey":"ie","reverseScore":true,"type":"single_choice","options":[{"id":"q06_1","label":"明显更接近左边","value":{"score":1}},{"id":"q06_2","label":"略偏左边","value":{"score":2}},{"id":"q06_3","label":"两边差不多","value":{"score":3}},{"id":"q06_4","label":"略偏右边","value":{"score":4}},{"id":"q06_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q07","title":"对你来说更顺手的表达方式通常是？","leftLabel":"当场说出来更自然","rightLabel":"写下来或私下说更顺手","axisKey":"ie","reverseScore":true,"type":"single_choice","options":[{"id":"q07_1","label":"明显更接近左边","value":{"score":1}},{"id":"q07_2","label":"略偏左边","value":{"score":2}},{"id":"q07_3","label":"两边差不多","value":{"score":3}},{"id":"q07_4","label":"略偏右边","value":{"score":4}},{"id":"q07_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q08","title":"连续社交一整天之后，你通常会觉得？","leftLabel":"反而更有精神","rightLabel":"更想安静下来缓一缓","axisKey":"ie","reverseScore":true,"type":"single_choice","options":[{"id":"q08_1","label":"明显更接近左边","value":{"score":1}},{"id":"q08_2","label":"略偏左边","value":{"score":2}},{"id":"q08_3","label":"两边差不多","value":{"score":3}},{"id":"q08_4","label":"略偏右边","value":{"score":4}},{"id":"q08_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q09","title":"面对一件新事物时，你更容易被什么打动？","leftLabel":"它是否已经被证明可行","rightLabel":"它是不是带着新可能","axisKey":"sn","reverseScore":false,"type":"single_choice","options":[{"id":"q09_1","label":"明显更接近左边","value":{"score":1}},{"id":"q09_2","label":"略偏左边","value":{"score":2}},{"id":"q09_3","label":"两边差不多","value":{"score":3}},{"id":"q09_4","label":"略偏右边","value":{"score":4}},{"id":"q09_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q10","title":"向别人讲一件事时，你通常会先讲？","leftLabel":"事情具体发生了什么","rightLabel":"这件事意味着什么、会走向哪里","axisKey":"sn","reverseScore":false,"type":"single_choice","options":[{"id":"q10_1","label":"明显更接近左边","value":{"score":1}},{"id":"q10_2","label":"略偏左边","value":{"score":2}},{"id":"q10_3","label":"两边差不多","value":{"score":3}},{"id":"q10_4","label":"略偏右边","value":{"score":4}},{"id":"q10_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q11","title":"真正做决定时，你更看重哪一边？","leftLabel":"眼下条件是否现实可行","rightLabel":"长远看是否值得投入","axisKey":"sn","reverseScore":false,"type":"single_choice","options":[{"id":"q11_1","label":"明显更接近左边","value":{"score":1}},{"id":"q11_2","label":"略偏左边","value":{"score":2}},{"id":"q11_3","label":"两边差不多","value":{"score":3}},{"id":"q11_4","label":"略偏右边","value":{"score":4}},{"id":"q11_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q12","title":"平时你的注意力更常落在？","leftLabel":"眼前需要处理的实际问题","rightLabel":"接下来可能发生的变化","axisKey":"sn","reverseScore":false,"type":"single_choice","options":[{"id":"q12_1","label":"明显更接近左边","value":{"score":1}},{"id":"q12_2","label":"略偏左边","value":{"score":2}},{"id":"q12_3","label":"两边差不多","value":{"score":3}},{"id":"q12_4","label":"略偏右边","value":{"score":4}},{"id":"q12_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q13","title":"面对任务时，你更偏好哪一类？","leftLabel":"步骤清楚、边界明确","rightLabel":"可以探索、留有发挥空间","axisKey":"sn","reverseScore":false,"type":"single_choice","options":[{"id":"q13_1","label":"明显更接近左边","value":{"score":1}},{"id":"q13_2","label":"略偏左边","value":{"score":2}},{"id":"q13_3","label":"两边差不多","value":{"score":3}},{"id":"q13_4","label":"略偏右边","value":{"score":4}},{"id":"q13_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q14","title":"学一样新东西时，你通常更依赖？","leftLabel":"具体案例和已有经验","rightLabel":"整体框架和抽象概念","axisKey":"sn","reverseScore":false,"type":"single_choice","options":[{"id":"q14_1","label":"明显更接近左边","value":{"score":1}},{"id":"q14_2","label":"略偏左边","value":{"score":2}},{"id":"q14_3","label":"两边差不多","value":{"score":3}},{"id":"q14_4","label":"略偏右边","value":{"score":4}},{"id":"q14_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q15","title":"看待一件事时，你更容易先注意到？","leftLabel":"实际发生了哪些细节","rightLabel":"背后可能隐藏的规律","axisKey":"sn","reverseScore":false,"type":"single_choice","options":[{"id":"q15_1","label":"明显更接近左边","value":{"score":1}},{"id":"q15_2","label":"略偏左边","value":{"score":2}},{"id":"q15_3","label":"两边差不多","value":{"score":3}},{"id":"q15_4","label":"略偏右边","value":{"score":4}},{"id":"q15_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q16","title":"当现实和设想同时摆在面前时，你通常会？","leftLabel":"先把现实稳住再说","rightLabel":"先去想更远一点的可能","axisKey":"sn","reverseScore":false,"type":"single_choice","options":[{"id":"q16_1","label":"明显更接近左边","value":{"score":1}},{"id":"q16_2","label":"略偏左边","value":{"score":2}},{"id":"q16_3","label":"两边差不多","value":{"score":3}},{"id":"q16_4","label":"略偏右边","value":{"score":4}},{"id":"q16_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q17","title":"做判断时，你更容易先想到？","leftLabel":"这件事合不合理","rightLabel":"这样做会不会伤到人","axisKey":"ft","reverseScore":true,"type":"single_choice","options":[{"id":"q17_1","label":"明显更接近左边","value":{"score":1}},{"id":"q17_2","label":"略偏左边","value":{"score":2}},{"id":"q17_3","label":"两边差不多","value":{"score":3}},{"id":"q17_4","label":"略偏右边","value":{"score":4}},{"id":"q17_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q18","title":"别人来向你倾诉或求助时，你更像哪一边？","leftLabel":"先帮对方理清问题","rightLabel":"先让对方感觉被理解","axisKey":"ft","reverseScore":true,"type":"single_choice","options":[{"id":"q18_1","label":"明显更接近左边","value":{"score":1}},{"id":"q18_2","label":"略偏左边","value":{"score":2}},{"id":"q18_3","label":"两边差不多","value":{"score":3}},{"id":"q18_4","label":"略偏右边","value":{"score":4}},{"id":"q18_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q19","title":"发生分歧时，你更在意哪一边？","leftLabel":"规则、标准和逻辑","rightLabel":"关系、处境和感受","axisKey":"ft","reverseScore":true,"type":"single_choice","options":[{"id":"q19_1","label":"明显更接近左边","value":{"score":1}},{"id":"q19_2","label":"略偏左边","value":{"score":2}},{"id":"q19_3","label":"两边差不多","value":{"score":3}},{"id":"q19_4","label":"略偏右边","value":{"score":4}},{"id":"q19_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q20","title":"你更希望别人先认可你哪一面？","leftLabel":"有能力、有判断","rightLabel":"真诚、温暖、值得信赖","axisKey":"ft","reverseScore":true,"type":"single_choice","options":[{"id":"q20_1","label":"明显更接近左边","value":{"score":1}},{"id":"q20_2","label":"略偏左边","value":{"score":2}},{"id":"q20_3","label":"两边差不多","value":{"score":3}},{"id":"q20_4","label":"略偏右边","value":{"score":4}},{"id":"q20_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q21","title":"面对一个棘手问题时，你通常会？","leftLabel":"先想怎么把它解决","rightLabel":"先看谁最需要被安抚","axisKey":"ft","reverseScore":true,"type":"single_choice","options":[{"id":"q21_1","label":"明显更接近左边","value":{"score":1}},{"id":"q21_2","label":"略偏左边","value":{"score":2}},{"id":"q21_3","label":"两边差不多","value":{"score":3}},{"id":"q21_4","label":"略偏右边","value":{"score":4}},{"id":"q21_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q22","title":"表达不同意见时，你更接近哪一边？","leftLabel":"即使不中听也愿意直说","rightLabel":"会尽量照顾对方的接受感","axisKey":"ft","reverseScore":true,"type":"single_choice","options":[{"id":"q22_1","label":"明显更接近左边","value":{"score":1}},{"id":"q22_2","label":"略偏左边","value":{"score":2}},{"id":"q22_3","label":"两边差不多","value":{"score":3}},{"id":"q22_4","label":"略偏右边","value":{"score":4}},{"id":"q22_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q23","title":"做重要选择时，你更像哪一边？","leftLabel":"可以相对抽离情绪来判断","rightLabel":"很难完全不考虑情感因素","axisKey":"ft","reverseScore":true,"type":"single_choice","options":[{"id":"q23_1","label":"明显更接近左边","value":{"score":1}},{"id":"q23_2","label":"略偏左边","value":{"score":2}},{"id":"q23_3","label":"两边差不多","value":{"score":3}},{"id":"q23_4","label":"略偏右边","value":{"score":4}},{"id":"q23_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q24","title":"你会更欣赏哪一类人？","leftLabel":"头脑清楚、判断稳定","rightLabel":"有温度、懂得体谅别人","axisKey":"ft","reverseScore":true,"type":"single_choice","options":[{"id":"q24_1","label":"明显更接近左边","value":{"score":1}},{"id":"q24_2","label":"略偏左边","value":{"score":2}},{"id":"q24_3","label":"两边差不多","value":{"score":3}},{"id":"q24_4","label":"略偏右边","value":{"score":4}},{"id":"q24_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q25","title":"开始做一件事前，你更习惯？","leftLabel":"先把安排定下来","rightLabel":"先动起来，边做边调","axisKey":"jp","reverseScore":false,"type":"single_choice","options":[{"id":"q25_1","label":"明显更接近左边","value":{"score":1}},{"id":"q25_2","label":"略偏左边","value":{"score":2}},{"id":"q25_3","label":"两边差不多","value":{"score":3}},{"id":"q25_4","label":"略偏右边","value":{"score":4}},{"id":"q25_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q26","title":"面对还没确定的事时，你通常会觉得？","leftLabel":"早点定下来更安心","rightLabel":"留点空间反而更自在","axisKey":"jp","reverseScore":false,"type":"single_choice","options":[{"id":"q26_1","label":"明显更接近左边","value":{"score":1}},{"id":"q26_2","label":"略偏左边","value":{"score":2}},{"id":"q26_3","label":"两边差不多","value":{"score":3}},{"id":"q26_4","label":"略偏右边","value":{"score":4}},{"id":"q26_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q27","title":"日常生活里，你更依赖哪一种方式？","leftLabel":"清单、提醒、固定安排","rightLabel":"当下感觉和临场记忆","axisKey":"jp","reverseScore":false,"type":"single_choice","options":[{"id":"q27_1","label":"明显更接近左边","value":{"score":1}},{"id":"q27_2","label":"略偏左边","value":{"score":2}},{"id":"q27_3","label":"两边差不多","value":{"score":3}},{"id":"q27_4","label":"略偏右边","value":{"score":4}},{"id":"q27_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q28","title":"推进一件事时，你更接近哪一边？","leftLabel":"稳定地一点点推进","rightLabel":"临近节点时集中冲一把","axisKey":"jp","reverseScore":false,"type":"single_choice","options":[{"id":"q28_1","label":"明显更接近左边","value":{"score":1}},{"id":"q28_2","label":"略偏左边","value":{"score":2}},{"id":"q28_3","label":"两边差不多","value":{"score":3}},{"id":"q28_4","label":"略偏右边","value":{"score":4}},{"id":"q28_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q29","title":"对待空间和物品时，你更像哪一边？","leftLabel":"各归其位会更舒服","rightLabel":"顺手好用更重要","axisKey":"jp","reverseScore":false,"type":"single_choice","options":[{"id":"q29_1","label":"明显更接近左边","value":{"score":1}},{"id":"q29_2","label":"略偏左边","value":{"score":2}},{"id":"q29_3","label":"两边差不多","value":{"score":3}},{"id":"q29_4","label":"略偏右边","value":{"score":4}},{"id":"q29_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q30","title":"计划出门或出行时，你更习惯？","leftLabel":"先把行程大致确认好","rightLabel":"到时候看情况灵活调整","axisKey":"jp","reverseScore":false,"type":"single_choice","options":[{"id":"q30_1","label":"明显更接近左边","value":{"score":1}},{"id":"q30_2","label":"略偏左边","value":{"score":2}},{"id":"q30_3","label":"两边差不多","value":{"score":3}},{"id":"q30_4","label":"略偏右边","value":{"score":4}},{"id":"q30_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q31","title":"面对多个任务同时出现时，你更接近哪一边？","leftLabel":"更想先完成一件再说","rightLabel":"同时开着几个方向更有感觉","axisKey":"jp","reverseScore":false,"type":"single_choice","options":[{"id":"q31_1","label":"明显更接近左边","value":{"score":1}},{"id":"q31_2","label":"略偏左边","value":{"score":2}},{"id":"q31_3","label":"两边差不多","value":{"score":3}},{"id":"q31_4","label":"略偏右边","value":{"score":4}},{"id":"q31_5","label":"明显更接近右边","value":{"score":5}}]},{"id":"q32","title":"当计划突然变化时，你的第一反应更像？","leftLabel":"重新安排、尽快理顺","rightLabel":"顺势改道、边走边看","axisKey":"jp","reverseScore":false,"type":"single_choice","options":[{"id":"q32_1","label":"明显更接近左边","value":{"score":1}},{"id":"q32_2","label":"略偏左边","value":{"score":2}},{"id":"q32_3","label":"两边差不多","value":{"score":3}},{"id":"q32_4","label":"略偏右边","value":{"score":4}},{"id":"q32_5","label":"明显更接近右边","value":{"score":5}}]}],"results":[{"key":"INTJ","alias":"战略规划者","typeCode":"INTJ","nickname":"战略规划者","title":"INTJ · 战略规划者","keywords":["独立","前瞻","冷静","结构感"],"firstImpression":"清醒、克制、不容易被外界节奏带跑。","summary":"你通常先关注事情的整体结构、发展路径和长期影响，再决定是否投入精力。你不太喜欢没有方向感的消耗，更愿意把时间放在真正重要、真正值得的目标上。","overview":"INTJ 往往以独立、克制和有预判力的方式面对世界。你习惯先在心里搭好框架，再逐步验证现实是否符合预期。相比热闹与即时反馈，你更看重逻辑、效率和长期价值，因此容易给人一种冷静、清醒、带有距离感的印象。","strengthSummary":"擅长从杂乱信息中抓出主线；能把复杂问题拆解成更可执行的部分；面对长期目标时通常有较强的耐心和持续推进能力。","blindSpotSummary":"当你过于专注结构和结果时，可能会忽略他人的情绪节奏，也可能低估关系维护本身的重要性。对低效率、反复解释和随意决策的容忍度较低，容易因此显得过于直接或不够柔软。","relationshipStyle":"你更看重深度、稳定和价值观上的契合，而不是高频但空转的互动。你不一定会用非常外放的方式表达在意，但一旦确认关系，通常会用持续投入、认真规划和可靠行动来表达重视。","workStyle":"你适合需要独立判断、系统思考和长期规划的环境。无论是策略、产品、内容框架、系统搭建还是复杂项目推进，只要问题足够复杂、目标足够清晰，你通常都能发挥优势。","stressMode":"在高压下，你可能会进一步收紧自己的控制感，对外界的不确定性和低效率变得更敏感。有时你会通过抽离社交、加大自我要求来应对压力，但这也可能让你更难及时释放疲惫。","growthAdvice":"适当让别人看到你的思考过程，而不只是最终结论；在追求正确和有效之外，也给关系中的感受留出位置。","posterTags":["长期主义","结构脑","清醒克制"],"shareCopy":"先看清方向，再决定出手。","subtitle":"清醒、克制、不容易被外界节奏带跑。","highlights":["独立","前瞻","冷静","结构感"],"strengths":["擅长从杂乱信息中抓出主线","能把复杂问题拆解成更可执行的部分","面对长期目标时通常有较强的耐心和持续推进能力"],"blindSpots":["当你过于专注结构和结果时，可能会忽略他人的情绪节奏，也可能低估关系维护本身的重要性。对低效率、反复解释和随意决策的容忍度较低，容易因此显得过于直接或不够柔软"],"relationshipNotes":["你更看重深度、稳定和价值观上的契合，而不是高频但空转的互动。你不一定会用非常外放的方式表达在意，但一旦确认关系，通常会用持续投入、认真规划和可靠行动来表达重视。"],"workNotes":["你适合需要独立判断、系统思考和长期规划的环境。无论是策略、产品、内容框架、系统搭建还是复杂项目推进，只要问题足够复杂、目标足够清晰，你通常都能发挥优势。"],"stressNotes":["在高压下，你可能会进一步收紧自己的控制感，对外界的不确定性和低效率变得更敏感。有时你会通过抽离社交、加大自我要求来应对压力，但这也可能让你更难及时释放疲惫。"],"growthNotes":["适当让别人看到你的思考过程，而不只是最终结论；在追求正确和有效之外，也给关系中的感受留出位置。"]},{"key":"INTP","alias":"逻辑探索者","typeCode":"INTP","nickname":"逻辑探索者","title":"INTP · 逻辑探索者","keywords":["理性","好奇","思辨","抽象"],"firstImpression":"安静但脑内很忙，像是在同时处理好几层问题。","summary":"你通常会先把问题想通、想透，再决定是否行动。对你来说，真正重要的不只是答案本身，而是这个答案是否经得起推敲。","overview":"INTP 常常表现出独立、理性和高度思辨的一面。你习惯从概念、原理和逻辑关系出发看问题，不轻易接受表面现象，也不喜欢为了迎合环境而快速表态。相比立即达成共识，你更在意内部逻辑是否自洽。","strengthSummary":"擅长分析复杂概念；能在别人觉得混乱的地方找到结构和规律；面对新知识时愿意追问“为什么”，而不是只记住表面结论。","blindSpotSummary":"因为过于在意逻辑质量，你有时会在思考中停留太久，导致行动延后。对流程化、重复性强或需要情绪照顾的事务耐心有限，也可能让别人觉得你难以接近或反应偏冷。","relationshipStyle":"你通常更容易通过高质量交流、共同兴趣和思想碰撞建立亲近感。相比频繁互动，你更重视交流本身是否真实、有内容、有意义。","workStyle":"你适合研究、分析、策略支持、概念验证、模型搭建这类允许独立思考的工作。只要环境不强迫你过度社交，且能给你一定探索空间，你通常能发挥得更稳定。","stressMode":"当压力升高时，你可能会进一步退回自己的思考空间，通过反复分析来寻找确定感。短期内这有助于整理思路，但也可能让你更难及时行动或寻求帮助。","growthAdvice":"在追求“想明白”之外，也练习把思考更早地转成行动；不是所有问题都要等到完全确定才开始。","posterTags":["脑内建模","先想清楚","独立判断"],"shareCopy":"想透之后，世界才会变清楚。","subtitle":"安静但脑内很忙，像是在同时处理好几层问题。","highlights":["理性","好奇","思辨","抽象"],"strengths":["擅长分析复杂概念","能在别人觉得混乱的地方找到结构和规律","面对新知识时愿意追问“为什么”，而不是只记住表面结论"],"blindSpots":["因为过于在意逻辑质量，你有时会在思考中停留太久，导致行动延后。对流程化、重复性强或需要情绪照顾的事务耐心有限，也可能让别人觉得你难以接近或反应偏冷"],"relationshipNotes":["你通常更容易通过高质量交流、共同兴趣和思想碰撞建立亲近感。相比频繁互动，你更重视交流本身是否真实、有内容、有意义。"],"workNotes":["你适合研究、分析、策略支持、概念验证、模型搭建这类允许独立思考的工作。只要环境不强迫你过度社交，且能给你一定探索空间，你通常能发挥得更稳定。"],"stressNotes":["当压力升高时，你可能会进一步退回自己的思考空间，通过反复分析来寻找确定感。短期内这有助于整理思路，但也可能让你更难及时行动或寻求帮助。"],"growthNotes":["在追求“想明白”之外，也练习把思考更早地转成行动；不是所有问题都要等到完全确定才开始。"]},{"key":"ENTJ","alias":"目标统筹者","typeCode":"ENTJ","nickname":"目标统筹者","title":"ENTJ · 目标统筹者","keywords":["果断","统筹","执行","掌控力"],"firstImpression":"像一个会自然接过节奏的人，目标感很强。","summary":"你倾向于快速看清目标、路径和资源分配，并推动事情朝着明确结果前进。对你来说，空转和拖延通常比困难本身更难忍受。","overview":"ENTJ 往往给人干练、果断、有掌控力的印象。你习惯站在更高的位置看局面，迅速判断优先级，并组织行动。你不太满足于停留在讨论层面，而更关心一件事怎样真正被推进、被完成、被做成。","strengthSummary":"在判断方向、制定策略和推动执行上通常很有力量；面对复杂局面时能迅速抓住关键变量；容易带动他人一起前进。","blindSpotSummary":"当结果导向过强时，你可能会低估关系中的缓冲空间，也容易对拖延、犹豫和反复确认感到不耐烦。高标准虽然能提高效率，但也可能让他人感到压力。","relationshipStyle":"你欣赏坦诚、独立、有判断力的人。关系里你通常不喜欢过度猜测和含糊表达，更偏好直接沟通、明确需求、一起成长的互动方式。","workStyle":"你适合需要统筹、决策、带项目、带节奏的环境。尤其在高复杂度、高目标感、高执行要求的场景中，你往往能比较快进入状态。","stressMode":"在高压下，你可能更想强化掌控感，对错误、低效和不确定性更敏感。你容易把自己放到持续推进的位置，却忽略身体和情绪也需要恢复。","growthAdvice":"不是所有问题都只能靠更强的推进解决；适度放慢、补足沟通和情绪连接，往往会让结果更稳。","posterTags":["目标导向","推进力强","先做成再说"],"shareCopy":"先定方向，再把它做成。","subtitle":"像一个会自然接过节奏的人，目标感很强。","highlights":["果断","统筹","执行","掌控力"],"strengths":["在判断方向、制定策略和推动执行上通常很有力量","面对复杂局面时能迅速抓住关键变量","容易带动他人一起前进"],"blindSpots":["当结果导向过强时，你可能会低估关系中的缓冲空间，也容易对拖延、犹豫和反复确认感到不耐烦。高标准虽然能提高效率，但也可能让他人感到压力"],"relationshipNotes":["你欣赏坦诚、独立、有判断力的人。关系里你通常不喜欢过度猜测和含糊表达，更偏好直接沟通、明确需求、一起成长的互动方式。"],"workNotes":["你适合需要统筹、决策、带项目、带节奏的环境。尤其在高复杂度、高目标感、高执行要求的场景中，你往往能比较快进入状态。"],"stressNotes":["在高压下，你可能更想强化掌控感，对错误、低效和不确定性更敏感。你容易把自己放到持续推进的位置，却忽略身体和情绪也需要恢复。"],"growthNotes":["不是所有问题都只能靠更强的推进解决；适度放慢、补足沟通和情绪连接，往往会让结果更稳。"]},{"key":"ENTP","alias":"观点开拓者","typeCode":"ENTP","nickname":"观点开拓者","title":"ENTP · 观点开拓者","keywords":["灵活","发散","机敏","反常规"],"firstImpression":"脑子转得快，很容易从别人没想到的角度切进来。","summary":"你擅长从不同角度理解问题，也擅长在固定局面中发现新的解法。很多别人觉得“只能这样”的事，在你看来其实都还有别的可能。","overview":"ENTP 通常思维灵活、反应快、好奇心强，对新点子、新组合和新视角很敏感。你不太喜欢被过早定义，也不满足于按现成规则重复执行。相比守住既有路径，你更习惯打开更多路径。","strengthSummary":"有很强的发散能力和重组能力；能迅速发现连接、提出新问法、撬动新机会；面对变化时通常适应得很快。","blindSpotSummary":"当想法太多、入口太多时，你可能会在探索中分散注意力，导致推进和收束不足。你不喜欢无聊和重复，但现实里很多成果恰恰依赖持续打磨。","relationshipStyle":"你通常喜欢有内容、有互动感、能彼此激发的人际关系。你欣赏能接住你想法、愿意一起讨论和探索的人，不太适应长期沉闷、机械的相处状态。","workStyle":"你适合创意、策划、早期探索、产品破局、沟通表达等需要快速联想和观点输出的任务。面对从 0 到 1 的问题时，你往往能提供很强的能量。","stressMode":"在压力下，你可能会通过开启更多可能来回避真正的定夺，表面仍很活跃，内里却逐渐失去聚焦感。","growthAdvice":"保留你的探索天赋，同时练习把最重要的一个想法真正做完；真正的突破，不只来自想法，也来自落地。","posterTags":["鬼点子多","脑洞在线","不按常规出牌"],"shareCopy":"看见更多可能，也敢改写旧答案。","subtitle":"脑子转得快，很容易从别人没想到的角度切进来。","highlights":["灵活","发散","机敏","反常规"],"strengths":["有很强的发散能力和重组能力","能迅速发现连接、提出新问法、撬动新机会","面对变化时通常适应得很快"],"blindSpots":["当想法太多、入口太多时，你可能会在探索中分散注意力，导致推进和收束不足。你不喜欢无聊和重复，但现实里很多成果恰恰依赖持续打磨"],"relationshipNotes":["你通常喜欢有内容、有互动感、能彼此激发的人际关系。你欣赏能接住你想法、愿意一起讨论和探索的人，不太适应长期沉闷、机械的相处状态。"],"workNotes":["你适合创意、策划、早期探索、产品破局、沟通表达等需要快速联想和观点输出的任务。面对从 0 到 1 的问题时，你往往能提供很强的能量。"],"stressNotes":["在压力下，你可能会通过开启更多可能来回避真正的定夺，表面仍很活跃，内里却逐渐失去聚焦感。"],"growthNotes":["保留你的探索天赋，同时练习把最重要的一个想法真正做完；真正的突破，不只来自想法，也来自落地。"]},{"key":"INFJ","alias":"洞察协调者","typeCode":"INFJ","nickname":"洞察协调者","title":"INFJ · 洞察协调者","keywords":["敏锐","深度","共情","意义感"],"firstImpression":"安静但很有存在感，像是能看见很多没说出口的东西。","summary":"你往往能在表面信息之外，感知到人、关系和局面中的深层脉络。你不是最喧闹的人，但通常会在安静观察中形成非常完整的理解。","overview":"INFJ 常被认为兼具洞察力与关怀感。你既会关注事情的意义，也会关注人在其中的状态和感受。你不太喜欢浅层、碎片化的互动，更容易被有深度、有方向感、有真实连接的关系与目标吸引。","strengthSummary":"擅长理解复杂的人际动态；能把感受、动机和趋势整理成清晰判断；通常具备较强的长期洞察力。","blindSpotSummary":"因为对人和关系足够敏感，你也更容易被误解、冷淡或长期失衡的关系消耗。很多感受你会先放在心里，表面平静，内里却可能已经很累。","relationshipStyle":"你重视稳定、真诚和深度连接，通常不太适应过于表面化或反复试探的互动。你希望关系里不仅有情绪回应，也有价值观和理解层面的契合。","workStyle":"你适合需要洞察、理解、表达和长期陪伴的任务，比如内容策划、用户洞察、咨询支持、教育引导、品牌叙事等。","stressMode":"高压下，你可能会先沉默、先压住自己，努力维持外在平稳。但如果长期得不到理解和恢复，你会逐渐进入内耗状态。","growthAdvice":"不要总是等别人“自己看懂你”；适当直接表达需求、界限和疲惫，会比持续隐忍更有效。","posterTags":["深度共情","看透表象","安静但有力量"],"shareCopy":"看见别人没说出口的那一层。","subtitle":"安静但很有存在感，像是能看见很多没说出口的东西。","highlights":["敏锐","深度","共情","意义感"],"strengths":["擅长理解复杂的人际动态","能把感受、动机和趋势整理成清晰判断","通常具备较强的长期洞察力"],"blindSpots":["因为对人和关系足够敏感，你也更容易被误解、冷淡或长期失衡的关系消耗。很多感受你会先放在心里，表面平静，内里却可能已经很累"],"relationshipNotes":["你重视稳定、真诚和深度连接，通常不太适应过于表面化或反复试探的互动。你希望关系里不仅有情绪回应，也有价值观和理解层面的契合。"],"workNotes":["你适合需要洞察、理解、表达和长期陪伴的任务，比如内容策划、用户洞察、咨询支持、教育引导、品牌叙事等。"],"stressNotes":["高压下，你可能会先沉默、先压住自己，努力维持外在平稳。但如果长期得不到理解和恢复，你会逐渐进入内耗状态。"],"growthNotes":["不要总是等别人“自己看懂你”；适当直接表达需求、界限和疲惫，会比持续隐忍更有效。"]},{"key":"INFP","alias":"价值理想者","typeCode":"INFP","nickname":"价值理想者","title":"INFP · 价值理想者","keywords":["真诚","理想感","温柔","内在驱动"],"firstImpression":"看起来安静，但内心世界很丰富，也很有自己的坚持。","summary":"你做选择时，往往更在意这件事是否真正符合内心认同。对你来说，真实感和价值感常常比表面的效率更重要。","overview":"INFP 通常拥有较强的内在价值坐标，也拥有细腻而丰富的感受力。你可能并不总是高调表达自己，但内心对人、关系、意义和理想有很深的判断。你不太愿意活成别人期待的样子，更希望忠于真正相信的东西。","strengthSummary":"通常真诚、敏感、有想象力；对人与事的细微变化很有感受力；在内容、表达、创作、共情和理解层面常有独特优势。","blindSpotSummary":"当现实环境与内在价值冲突时，你可能更容易受伤、退缩或失去动力。你对外界标准未必有强服从感，但在需要稳定推进时也可能显得摇摆。","relationshipStyle":"你很看重被理解、被尊重和被真诚对待。关系里你通常不喜欢表演和敷衍，一旦认定对方，就容易投入很深的情感与信任。","workStyle":"你适合内容创作、品牌表达、心理洞察、用户理解、创意策划和需要价值感驱动的工作。只要做的事与你真正在意的方向一致，你通常会投入得很深。","stressMode":"在高压下，你可能更容易退回自己的内在世界，对外部要求产生回避感，也可能因为长期压抑而失去行动感。","growthAdvice":"保护好你的价值感，同时建立更稳定的行动节奏；理想不一定要和执行对立。","posterTags":["真诚内核","理想驱动","温柔有边界"],"shareCopy":"忠于自己相信的那一面。","subtitle":"看起来安静，但内心世界很丰富，也很有自己的坚持。","highlights":["真诚","理想感","温柔","内在驱动"],"strengths":["通常真诚、敏感、有想象力","对人与事的细微变化很有感受力","在内容、表达、创作、共情和理解层面常有独特优势"],"blindSpots":["当现实环境与内在价值冲突时，你可能更容易受伤、退缩或失去动力。你对外界标准未必有强服从感，但在需要稳定推进时也可能显得摇摆"],"relationshipNotes":["你很看重被理解、被尊重和被真诚对待。关系里你通常不喜欢表演和敷衍，一旦认定对方，就容易投入很深的情感与信任。"],"workNotes":["你适合内容创作、品牌表达、心理洞察、用户理解、创意策划和需要价值感驱动的工作。只要做的事与你真正在意的方向一致，你通常会投入得很深。"],"stressNotes":["在高压下，你可能更容易退回自己的内在世界，对外部要求产生回避感，也可能因为长期压抑而失去行动感。"],"growthNotes":["保护好你的价值感，同时建立更稳定的行动节奏；理想不一定要和执行对立。"]},{"key":"ENFJ","alias":"关系引导者","typeCode":"ENFJ","nickname":"关系引导者","title":"ENFJ · 关系引导者","keywords":["带动","共情","表达","影响力"],"firstImpression":"很会照顾场上的人，也很会把气氛往更好的方向带。","summary":"你不仅关心事情能不能做成，也关心人是否被理解、被连接、被带动。你往往能自然地觉察别人的状态，并让群体向更有共识的方向移动。","overview":"ENFJ 往往具有很强的共情能力、表达能力和带动能力。你擅长把抽象目标转译成别人愿意跟随的方向，也擅长在关系里提供回应与推动。相比冷冰冰地推进结果，你更希望结果和人都被照顾到。","strengthSummary":"常常能感知他人的情绪变化并做出及时回应；擅长组织关系、建立信任、创造合作氛围；在表达和带动方面通常比较突出。","blindSpotSummary":"因为太容易承担关系中的责任，你有时会不自觉背起过多的期待与情绪劳动。你擅长照顾别人，却未必同样擅长及时照顾自己。","relationshipStyle":"你需要回应、真诚和成长感。你通常会主动投入，也希望关系里有明确的温度、尊重和双向反馈。","workStyle":"你适合需要沟通、引导、组织和影响力的工作，比如教育、社区、内容传播、用户运营、团队协作、品牌表达等。","stressMode":"在压力下，你可能一边维持体面和照顾，一边把疲惫压在自己身上，直到真正超负荷时才意识到自己已经很累。","growthAdvice":"练习把“照顾所有人”改成“也照顾好自己”；不是所有关系都需要你来维持完整。","posterTags":["共情力强","很会带人","关系感知高"],"shareCopy":"不仅看见人，也愿意把人带向更好的方向。","subtitle":"很会照顾场上的人，也很会把气氛往更好的方向带。","highlights":["带动","共情","表达","影响力"],"strengths":["常常能感知他人的情绪变化并做出及时回应","擅长组织关系、建立信任、创造合作氛围","在表达和带动方面通常比较突出"],"blindSpots":["因为太容易承担关系中的责任，你有时会不自觉背起过多的期待与情绪劳动。你擅长照顾别人，却未必同样擅长及时照顾自己"],"relationshipNotes":["你需要回应、真诚和成长感。你通常会主动投入，也希望关系里有明确的温度、尊重和双向反馈。"],"workNotes":["你适合需要沟通、引导、组织和影响力的工作，比如教育、社区、内容传播、用户运营、团队协作、品牌表达等。"],"stressNotes":["在压力下，你可能一边维持体面和照顾，一边把疲惫压在自己身上，直到真正超负荷时才意识到自己已经很累。"],"growthNotes":["练习把“照顾所有人”改成“也照顾好自己”；不是所有关系都需要你来维持完整。"]},{"key":"ENFP","alias":"灵感连接者","typeCode":"ENFP","nickname":"灵感连接者","title":"ENFP · 灵感连接者","keywords":["热情","共鸣","创意","连接感"],"firstImpression":"有生命力，也很容易把这份热度带给别人。","summary":"你容易被有趣的人、想法和可能性点燃，也容易把这种热度传递给周围的人。你的生命力常常体现在对新鲜感、真实感和连接感的追求里。","overview":"ENFP 通常热情、敏锐、富有联想力，对外部世界和人与人之间的关系有很强的感知力。你不喜欢太早被固定，也不喜欢在没有情感投入和意义感的情况下持续消耗。","strengthSummary":"通常有很强的感染力、连接力和创意力；能快速发现人与人、事与事之间的关系；也能让交流变得有生命力、有温度、有内容。","blindSpotSummary":"当可能性太多时，你容易在不同方向之间来回切换，导致行动不够收束。情绪和环境反馈也更容易影响你的稳定输出。","relationshipStyle":"你欣赏有回应、有趣味、愿意交流真实感受的人。关系里你不太适应长期冷处理或高度僵化的互动方式。","workStyle":"你适合创意、品牌、内容、用户互动、活动策划、探索型产品等需要灵感与连接力的场景。","stressMode":"在高压下，你可能表面依旧轻快，但内里已经开始疲惫、分散或失去聚焦。外部看来你还在动，实际上内在能量可能已被透支。","growthAdvice":"保留你的热度，同时为自己建立更稳的节奏与收束机制；灵感只有落地后才会变成真正的作品。","posterTags":["灵感体质","共鸣感强","热情有感染力"],"shareCopy":"把热情、连接和可能性一起点亮。","subtitle":"有生命力，也很容易把这份热度带给别人。","highlights":["热情","共鸣","创意","连接感"],"strengths":["通常有很强的感染力、连接力和创意力","能快速发现人与人、事与事之间的关系","也能让交流变得有生命力、有温度、有内容"],"blindSpots":["当可能性太多时，你容易在不同方向之间来回切换，导致行动不够收束。情绪和环境反馈也更容易影响你的稳定输出"],"relationshipNotes":["你欣赏有回应、有趣味、愿意交流真实感受的人。关系里你不太适应长期冷处理或高度僵化的互动方式。"],"workNotes":["你适合创意、品牌、内容、用户互动、活动策划、探索型产品等需要灵感与连接力的场景。"],"stressNotes":["在高压下，你可能表面依旧轻快，但内里已经开始疲惫、分散或失去聚焦。外部看来你还在动，实际上内在能量可能已被透支。"],"growthNotes":["保留你的热度，同时为自己建立更稳的节奏与收束机制；灵感只有落地后才会变成真正的作品。"]},{"key":"ISTJ","alias":"稳健执行者","typeCode":"ISTJ","nickname":"稳健执行者","title":"ISTJ · 稳健执行者","keywords":["可靠","务实","秩序感","责任心"],"firstImpression":"安静但让人放心，像是会把事情稳稳接住的人。","summary":"你更相信经过验证的方法、清晰的标准和稳定推进的力量。相比冒进和空想，你更愿意一步一步把事情做好。","overview":"ISTJ 通常给人可靠、克制、务实的印象。你重视责任、秩序和可落地性，不太喜欢模糊、随意和没有边界的协作方式。你往往不会夸张表达，但会通过持续的执行和稳定的表现体现价值。","strengthSummary":"通常细致、守信、执行稳、能把流程和规则落实到位；面对需要长期维护和精确推进的任务时，往往比多数人更耐得住、也更靠得住。","blindSpotSummary":"你对频繁变化、无序协作和缺乏明确标准的环境容忍度较低。过于强调“应该怎样”时，也可能让你更难适应模糊、开放和需要试错的场景。","relationshipStyle":"你不一定擅长高调表达情绪，但通常会通过实际行动、稳定投入和责任感表达在意。你更看重真实可靠，而不是表面的热情。","workStyle":"你适合流程型、执行型、系统性强的工作，如运营、项目执行、财务、风控、法务支持、流程管理等。","stressMode":"在高压下，你可能更倾向抓紧规则与秩序，对偏差、反复变化和不守约的情况更敏感。","growthAdvice":"稳是你的优势，但也可以适当练习在变化中保留弹性；不是所有不确定都意味着失控。","posterTags":["靠谱稳定","落地能力强","秩序感在线"],"shareCopy":"把复杂的事，稳稳地落下来。","subtitle":"安静但让人放心，像是会把事情稳稳接住的人。","highlights":["可靠","务实","秩序感","责任心"],"strengths":["通常细致、守信、执行稳、能把流程和规则落实到位","面对需要长期维护和精确推进的任务时，往往比多数人更耐得住、也更靠得住"],"blindSpots":["你对频繁变化、无序协作和缺乏明确标准的环境容忍度较低。过于强调“应该怎样”时，也可能让你更难适应模糊、开放和需要试错的场景"],"relationshipNotes":["你不一定擅长高调表达情绪，但通常会通过实际行动、稳定投入和责任感表达在意。你更看重真实可靠，而不是表面的热情。"],"workNotes":["你适合流程型、执行型、系统性强的工作，如运营、项目执行、财务、风控、法务支持、流程管理等。"],"stressNotes":["在高压下，你可能更倾向抓紧规则与秩序，对偏差、反复变化和不守约的情况更敏感。"],"growthNotes":["稳是你的优势，但也可以适当练习在变化中保留弹性；不是所有不确定都意味着失控。"]},{"key":"ISFJ","alias":"温和守护者","typeCode":"ISFJ","nickname":"温和守护者","title":"ISFJ · 温和守护者","keywords":["细腻","照顾感","稳定","体贴"],"firstImpression":"不张扬，但很容易让人放下戒备。","summary":"你通常会自然地留意细节、感受和实际需要，也愿意用安静但持续的方式支持重要的人和关系。","overview":"ISFJ 往往细致、温和、可靠，对环境中的人和秩序都比较敏感。你不太需要成为最显眼的人，但常常会是那个让事情顺利运转、让别人感到安心的人。","strengthSummary":"通常记得住细节，也留心他人的状态；擅长提供稳定支持；愿意在小事上投入心力，这种持续性和细致度非常可贵。","blindSpotSummary":"因为习惯先顾全他人和整体秩序，你有时会把自己的需求放得太后，甚至在疲惫累积后仍不习惯及时表达。","relationshipStyle":"你重视安全感、回应和稳定陪伴。你不一定总是把情绪说得很满，但通常会用行动、记挂和长期投入来体现重视。","workStyle":"你适合服务支持、协作配合、流程维护、教育照顾、用户支持等需要耐心、责任心和稳定心力的场景。","stressMode":"在高压下，你可能会继续扛住表面责任，但内在承载会慢慢逼近上限，尤其当长期得不到回应或理解时。","growthAdvice":"照顾别人是一种能力，但照顾自己同样重要；适时表达边界，不会削弱你的温和，反而能让你的稳定更持久。","posterTags":["温柔可靠","细节控","默默撑住很多事"],"shareCopy":"温柔不是退让，而是稳定地守住重要的人和事。","subtitle":"不张扬，但很容易让人放下戒备。","highlights":["细腻","照顾感","稳定","体贴"],"strengths":["通常记得住细节，也留心他人的状态","擅长提供稳定支持","愿意在小事上投入心力，这种持续性和细致度非常可贵"],"blindSpots":["因为习惯先顾全他人和整体秩序，你有时会把自己的需求放得太后，甚至在疲惫累积后仍不习惯及时表达"],"relationshipNotes":["你重视安全感、回应和稳定陪伴。你不一定总是把情绪说得很满，但通常会用行动、记挂和长期投入来体现重视。"],"workNotes":["你适合服务支持、协作配合、流程维护、教育照顾、用户支持等需要耐心、责任心和稳定心力的场景。"],"stressNotes":["在高压下，你可能会继续扛住表面责任，但内在承载会慢慢逼近上限，尤其当长期得不到回应或理解时。"],"growthNotes":["照顾别人是一种能力，但照顾自己同样重要；适时表达边界，不会削弱你的温和，反而能让你的稳定更持久。"]},{"key":"ESTJ","alias":"秩序执行者","typeCode":"ESTJ","nickname":"秩序执行者","title":"ESTJ · 秩序执行者","keywords":["直接","清晰","效率","组织力"],"firstImpression":"很容易让局面变得可执行、可落地。","summary":"你倾向于快速建立规则、分工和节奏，让事情回到可执行、可推进的状态。相比模糊试探，你更相信明确和落实。","overview":"ESTJ 常常给人果断、直接、讲效率的印象。你重视责任与结果，也习惯把任务拆分、排程、推进，确保事情不停留在空谈中。你通常不会对混乱坐视不管，而会本能地去组织和纠偏。","strengthSummary":"在执行、组织、管理和流程推进上通常很有力量；面对需要定标准、盯节点、压进度的事务时，往往能迅速进入状态。","blindSpotSummary":"当你过于强调效率与规则时，可能让人感受到压力。对犹豫、低效、含糊不清的容忍度较低，也可能让你在关系里显得不够柔软。","relationshipStyle":"你重视靠谱、守约和直白。对你来说，关系中的稳定和责任感往往比花哨表达更重要。","workStyle":"你适合项目落地、流程管理、团队执行、运营统筹、组织协调等需要强推进力的工作。","stressMode":"在高压下，你可能会进一步强化掌控，试图通过更快决策、更严标准来维持秩序，但这也可能增加自身与他人的紧张感。","growthAdvice":"在推进结果之外，也给他人的节奏和情绪留一点缓冲区；更有效并不总意味着更强硬。","posterTags":["执行到位","讲规则","把事拉回正轨"],"shareCopy":"让事情回到该有的秩序里。","subtitle":"很容易让局面变得可执行、可落地。","highlights":["直接","清晰","效率","组织力"],"strengths":["在执行、组织、管理和流程推进上通常很有力量","面对需要定标准、盯节点、压进度的事务时，往往能迅速进入状态"],"blindSpots":["当你过于强调效率与规则时，可能让人感受到压力。对犹豫、低效、含糊不清的容忍度较低，也可能让你在关系里显得不够柔软"],"relationshipNotes":["你重视靠谱、守约和直白。对你来说，关系中的稳定和责任感往往比花哨表达更重要。"],"workNotes":["你适合项目落地、流程管理、团队执行、运营统筹、组织协调等需要强推进力的工作。"],"stressNotes":["在高压下，你可能会进一步强化掌控，试图通过更快决策、更严标准来维持秩序，但这也可能增加自身与他人的紧张感。"],"growthNotes":["在推进结果之外，也给他人的节奏和情绪留一点缓冲区；更有效并不总意味着更强硬。"]},{"key":"ESFJ","alias":"关系协调者","typeCode":"ESFJ","nickname":"关系协调者","title":"ESFJ · 关系协调者","keywords":["体贴","配合感","回应快","氛围感"],"firstImpression":"很会照顾场面，也很会照顾人的感受。","summary":"你通常能同时看见关系中的氛围、他人的感受和现实中的秩序需求，并努力让它们彼此兼容。","overview":"ESFJ 往往有很强的人际敏感度和责任感。你擅长在互动中捕捉反馈，也乐于让关系、合作和氛围变得更顺。相比抽象远景，你更在意眼前的人是否被妥善回应、具体的事情是否被照顾周全。","strengthSummary":"通常会主动维持互动质量，也愿意在细节和感受上投入；对群体氛围和合作状态很敏感；能帮助一群人更顺地配合起来。","blindSpotSummary":"因为过于在意反馈，你有时会把外界评价和关系状态看得太重。面对冲突或冷淡时，也可能比别人更容易受到影响。","relationshipStyle":"你重视及时回应、礼貌、体贴和明确投入。对你来说，关系里“有没有被看见”是很重要的体验。","workStyle":"你适合服务、运营、协调、用户沟通、团队配合、社群维护等需要人与流程并重的场景。","stressMode":"在高压下，你可能仍然努力维持对外的稳定和体面，但内心会对被忽视、被冷处理或关系失衡更敏感。","growthAdvice":"不必把所有关系的平衡都放在自己肩上；适时把注意力收回到自身需求上，会让你的稳定更健康。","posterTags":["很会照顾人","氛围稳定器","回应感强"],"shareCopy":"让关系有温度，也让合作更顺畅。","subtitle":"很会照顾场面，也很会照顾人的感受。","highlights":["体贴","配合感","回应快","氛围感"],"strengths":["通常会主动维持互动质量，也愿意在细节和感受上投入","对群体氛围和合作状态很敏感","能帮助一群人更顺地配合起来"],"blindSpots":["因为过于在意反馈，你有时会把外界评价和关系状态看得太重。面对冲突或冷淡时，也可能比别人更容易受到影响"],"relationshipNotes":["你重视及时回应、礼貌、体贴和明确投入。对你来说，关系里“有没有被看见”是很重要的体验。"],"workNotes":["你适合服务、运营、协调、用户沟通、团队配合、社群维护等需要人与流程并重的场景。"],"stressNotes":["在高压下，你可能仍然努力维持对外的稳定和体面，但内心会对被忽视、被冷处理或关系失衡更敏感。"],"growthNotes":["不必把所有关系的平衡都放在自己肩上；适时把注意力收回到自身需求上，会让你的稳定更健康。"]},{"key":"ISTP","alias":"务实解题者","typeCode":"ISTP","nickname":"务实解题者","title":"ISTP · 务实解题者","keywords":["冷静","上手快","观察力","现场感"],"firstImpression":"不吵不闹，但一遇到问题就很能打。","summary":"你通常会先观察局面、判断变量，然后迅速进入解决问题的状态。相比空谈，你更相信直接上手和现场验证。","overview":"ISTP 往往安静、独立、冷静，对外界保持一定距离感，但在真正需要处理问题时往往非常高效。你不太喜欢被过度干涉，也不喜欢在无意义的表达和流程里消耗。","strengthSummary":"对现实问题的判断通常很直接；有不错的动手与应变能力；面对突发状况或需要快速排障的场景时，往往比多数人更能保持清醒。","blindSpotSummary":"你不太擅长把复杂情绪说得很完整，也可能因为习惯“先自己处理”而显得疏离。长期关系中，如果缺少主动解释，别人可能不容易真正理解你。","relationshipStyle":"你更喜欢自然、轻松、不黏不压迫的关系状态。你尊重彼此空间，也希望关系里少一点强行拉扯、多一点真实与舒服。","workStyle":"你适合技术、排障、执行支持、产品打磨、现场处理等需要判断力和解决能力的工作。","stressMode":"在高压下，你可能会进一步减少表达，把更多精力收回到“先解决问题”上，却因此更难让别人知道你的真实状态。","growthAdvice":"解决问题是你的强项，但被理解同样重要；适当把自己的想法和感受说出来，会让关系更顺。","posterTags":["冷静处理","现场反应快","问题终结者"],"shareCopy":"先看清问题，再迅速把它解开。","subtitle":"不吵不闹，但一遇到问题就很能打。","highlights":["冷静","上手快","观察力","现场感"],"strengths":["对现实问题的判断通常很直接","有不错的动手与应变能力","面对突发状况或需要快速排障的场景时，往往比多数人更能保持清醒"],"blindSpots":["你不太擅长把复杂情绪说得很完整，也可能因为习惯“先自己处理”而显得疏离。长期关系中，如果缺少主动解释，别人可能不容易真正理解你"],"relationshipNotes":["你更喜欢自然、轻松、不黏不压迫的关系状态。你尊重彼此空间，也希望关系里少一点强行拉扯、多一点真实与舒服。"],"workNotes":["你适合技术、排障、执行支持、产品打磨、现场处理等需要判断力和解决能力的工作。"],"stressNotes":["在高压下，你可能会进一步减少表达，把更多精力收回到“先解决问题”上，却因此更难让别人知道你的真实状态。"],"growthNotes":["解决问题是你的强项，但被理解同样重要；适当把自己的想法和感受说出来，会让关系更顺。"]},{"key":"ISFP","alias":"真实体验者","typeCode":"ISFP","nickname":"真实体验者","title":"ISFP · 真实体验者","keywords":["温和","审美感","真实","感受力"],"firstImpression":"安静舒服，不会强压别人，但很有自己的感受标准。","summary":"你更重视真实感受、当下体验和内心认同，不喜欢被过度定义，也不喜欢在违背自己节奏的状态里生活。","overview":"ISFP 通常温和、低调、敏感，对审美、氛围和情绪体验有较高感知力。你不一定想成为最主动表达的人，但对舒服与不舒服、真诚与敷衍、适合与不适合，心里通常有很清楚的感受。","strengthSummary":"通常有较好的感受力、审美感和对细节氛围的把握；待人不张扬，却往往能给人一种舒服、真实、不带压迫感的相处体验。","blindSpotSummary":"当外界节奏太快、要求太硬时，你容易产生消耗感。重要需求若长期不表达，也可能让别人误以为你没有意见或不在意。","relationshipStyle":"你更重视被尊重、被理解和相处时的自然舒适。相比轰轰烈烈，你更在意关系是否真实、是否让人安心。","workStyle":"你适合设计、审美表达、内容体验、创作支持、用户感受优化等需要细腻感知的任务。","stressMode":"在高压下，你可能会先后退一步，保护自己的空间与情绪。如果持续得不到缓冲，行动力和表达欲都可能下降。","growthAdvice":"保留你对真实感受的尊重，同时学会更早表达需求与边界，让外界更有机会真正理解你。","posterTags":["真实感强","审美在线","温柔但不将就"],"shareCopy":"温和地做自己，也认真感受世界。","subtitle":"安静舒服，不会强压别人，但很有自己的感受标准。","highlights":["温和","审美感","真实","感受力"],"strengths":["通常有较好的感受力、审美感和对细节氛围的把握","待人不张扬，却往往能给人一种舒服、真实、不带压迫感的相处体验"],"blindSpots":["当外界节奏太快、要求太硬时，你容易产生消耗感。重要需求若长期不表达，也可能让别人误以为你没有意见或不在意"],"relationshipNotes":["你更重视被尊重、被理解和相处时的自然舒适。相比轰轰烈烈，你更在意关系是否真实、是否让人安心。"],"workNotes":["你适合设计、审美表达、内容体验、创作支持、用户感受优化等需要细腻感知的任务。"],"stressNotes":["在高压下，你可能会先后退一步，保护自己的空间与情绪。如果持续得不到缓冲，行动力和表达欲都可能下降。"],"growthNotes":["保留你对真实感受的尊重，同时学会更早表达需求与边界，让外界更有机会真正理解你。"]},{"key":"ESTP","alias":"行动应变者","typeCode":"ESTP","nickname":"行动应变者","title":"ESTP · 行动应变者","keywords":["果敢","现场反应","机会感","直接"],"firstImpression":"很会抓当下，也很敢下场。","summary":"你更习惯在真实场景中快速判断、快速试错、快速调整，而不是停留在过多预设和纸面推演里。","overview":"ESTP 往往反应快、胆量足、现实感强，对外界变化和现场反馈有很高敏感度。你更相信行动会带来答案，也更愿意在局面里边走边看、边试边调。","strengthSummary":"通常具有很强的即时应变能力；面对突发情况能快速进入状态；对机会和反馈的捕捉也通常很及时。","blindSpotSummary":"因为更信任即时反馈，你有时可能低估长期规划、提前准备和稳定积累的重要性。面对低刺激、慢反馈、重复性高的任务时，也更容易失去耐心。","relationshipStyle":"你通常偏好直接、轻松、有互动感的相处方式，不喜欢过度猜测和长期拉扯。关系里你更愿意用真实反应而不是复杂表演来推进交流。","workStyle":"你适合销售、商务、活动、执行、现场协调、危机处理等需要快速判断和即时反应的工作环境。","stressMode":"在高压下，你可能会进一步依赖行动和外部刺激来分散压迫感，表面很能扛，但也可能忽略真正需要沉下来整理的部分。","growthAdvice":"行动是你的优势，但适度提前规划会让你的效率更高、代价更低；不是所有问题都需要到了现场才处理。","posterTags":["行动派","现场感强","反应很快"],"shareCopy":"先进入场景，再把机会抓住。","subtitle":"很会抓当下，也很敢下场。","highlights":["果敢","现场反应","机会感","直接"],"strengths":["通常具有很强的即时应变能力","面对突发情况能快速进入状态","对机会和反馈的捕捉也通常很及时"],"blindSpots":["因为更信任即时反馈，你有时可能低估长期规划、提前准备和稳定积累的重要性。面对低刺激、慢反馈、重复性高的任务时，也更容易失去耐心"],"relationshipNotes":["你通常偏好直接、轻松、有互动感的相处方式，不喜欢过度猜测和长期拉扯。关系里你更愿意用真实反应而不是复杂表演来推进交流。"],"workNotes":["你适合销售、商务、活动、执行、现场协调、危机处理等需要快速判断和即时反应的工作环境。"],"stressNotes":["在高压下，你可能会进一步依赖行动和外部刺激来分散压迫感，表面很能扛，但也可能忽略真正需要沉下来整理的部分。"],"growthNotes":["行动是你的优势，但适度提前规划会让你的效率更高、代价更低；不是所有问题都需要到了现场才处理。"]},{"key":"ESFP","alias":"活力感染者","typeCode":"ESFP","nickname":"活力感染者","title":"ESFP · 活力感染者","keywords":["热情","亲和","表现力","氛围感"],"firstImpression":"有温度，也有存在感，很容易把人带进状态。","summary":"你通常能把现场气氛、人际温度和真实体验带活。你对当下有很强的参与感，也很容易把这种生命力传递出去。","overview":"ESFP 往往自然、亲切、有表现力，重视互动感、真实感和生活本身的鲜活度。你不喜欢冷冰冰地完成任务，更希望人和事情都能有温度、有回应、有参与感。","strengthSummary":"通常有较强的亲和力、现场感和表达感染力；无论是在关系里还是在协作中，都容易让氛围变得更轻松、更有人味。","blindSpotSummary":"因为对外部反馈很敏感，你的状态也更容易被环境影响。面对过度压抑、重复僵化或长期冷淡的场景时，你会比较容易消耗。","relationshipStyle":"你重视回应、陪伴、参与感和情绪温度。对你来说，关系不只是“在一起”，更是有没有真正交流、真正感受到彼此。","workStyle":"你适合内容表达、活动执行、品牌互动、社群沟通、用户体验等需要人际互动和现场感的工作。","stressMode":"在高压下，你可能会先用忙碌、热闹或继续投入人群的方式撑住自己，但真正的疲惫往往会在后面慢慢显现。","growthAdvice":"保留你的活力和温度，同时给自己建立一点节奏与边界，让热情不至于总被环境消耗。","posterTags":["氛围感强","感染力高","现场小太阳"],"shareCopy":"把温度、活力和参与感带进每个现场。","subtitle":"有温度，也有存在感，很容易把人带进状态。","highlights":["热情","亲和","表现力","氛围感"],"strengths":["通常有较强的亲和力、现场感和表达感染力","无论是在关系里还是在协作中，都容易让氛围变得更轻松、更有人味"],"blindSpots":["因为对外部反馈很敏感，你的状态也更容易被环境影响。面对过度压抑、重复僵化或长期冷淡的场景时，你会比较容易消耗"],"relationshipNotes":["你重视回应、陪伴、参与感和情绪温度。对你来说，关系不只是“在一起”，更是有没有真正交流、真正感受到彼此。"],"workNotes":["你适合内容表达、活动执行、品牌互动、社群沟通、用户体验等需要人际互动和现场感的工作。"],"stressNotes":["在高压下，你可能会先用忙碌、热闹或继续投入人群的方式撑住自己，但真正的疲惫往往会在后面慢慢显现。"],"growthNotes":["保留你的活力和温度，同时给自己建立一点节奏与边界，让热情不至于总被环境消耗。"]}],"extensions":{"scoring":{"dimensions":[{"key":"ie","label":"I 内向 ←→ E 外向"},{"key":"sn","label":"S 实感 ←→ N 直觉"},{"key":"ft","label":"F 情感 ←→ T 思考"},{"key":"jp","label":"J 判断 ←→ P 感知"}]},"share":{"captionTone":"insightful"},"intro":{"tagline":"OEJTS 正式版首发，结果页支持回看、保存、分享与一键导出人格海报。","priceLabel":"32 题完整版","accessSummary":"输入随机测试口令后开始，有效期内可重复进入","valuePoints":["16 型结果","四条维度倾向","关系 / 工作 / 压力提示"],"flowSteps":["输入测试口令","完成 32 题","查看完整结果"],"detailSections":[{"title":"OEJTS 是什么","description":"OEJTS 16 型人格图谱是一套基于 I/E、S/N、F/T、J/P 四条人格偏好维度的自我探索测试。它关注你更自然的注意力方向、判断方式与行动节奏，而不是给你贴上固定不变的标签。"},{"title":"这套题适合谁","description":"适合想快速了解自己在四条人格维度上更偏向哪一侧，以及这些偏好如何影响关系、沟通与做事方式的人。"},{"title":"你会得到什么","description":"结果页会展示你的 16 型结果、四条维度位置，以及围绕关系、工作和压力情境的补充解读。"},{"title":"答题方式","description":"每题都在两种倾向之间做 5 级选择，按第一反应作答即可，不需要刻意追求“最好”的答案。"}]}}}',
  'OEJTS 正式版首发运行时配置'
);

UPDATE quizzes
SET current_draft_version_id = 'quiz_version_oejts_v1'
WHERE id = 'quiz_oejts_personality_map';

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
  'product_oejts_single',
  'OEJTS 16 型人格图谱 · 正式版单测',
  'single_product',
  'active',
  'xiaohongshu',
  'https://example.com/oejts',
  'code_gate',
  1,
  '当前采用一套题一个随机口令的正式版交付方案。'
);

INSERT OR REPLACE INTO product_quizzes (
  id,
  product_id,
  quiz_id,
  sort_order,
  access_json
) VALUES (
  'pq_oejts_single',
  'product_oejts_single',
  'quiz_oejts_personality_map',
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
  'batch_oejts_launch',
  'product_oejts_single',
  'OEJTS 正式版首发批次',
  'single_product',
  'OEJTS',
  14,
  'active',
  '2026-12-31T23:59:59.000Z',
  '{"scopeMode":"product","verificationMode":"shared_code","tokenTtlDays":30,"introVisible":true,"notes":"正式版首发阶段先采用一套题一个随机口令"}'
);

INSERT OR REPLACE INTO codes (
  code,
  batch_id,
  status,
  expires_at,
  metadata_json
) VALUES (
  'OEJTS-7Q4X-9M2P',
  'batch_oejts_launch',
  'active',
  '2026-12-31T23:59:59.000Z',
  '{"channel":"formal-launch","remark":"OEJTS 正式版随机口令"}'
);

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
  'quiz_relationship_preference_test',
  'relationship-preference-test',
  '亲密关系偏好测试',
  '这是一套基于五种爱情语言模型改编的关系偏好测试，帮助你看见在亲密关系里最有感觉的被爱方式、次要通道与容易错位的表达差异。',
  '关系 / 亲密关系',
  'published',
  29.9,
  1,
  'quiz_version_relationship_preference_v1'
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
  'quiz_version_relationship_preference_v1',
  'quiz_relationship_preference_test',
  1,
  '1.0.0',
  'published',
  '{"meta":{"slug":"relationship-preference-test","title":"亲密关系偏好测试","summary":"这是一套基于五种爱情语言模型改编的关系偏好测试，帮助你看见在亲密关系里最有感觉的被爱方式、次要通道与容易错位的表达差异。","estimatedMinutes":6,"tags":["亲密关系偏好","30 题正式版","五种爱情语言","关系海报"],"category":"关系 / 亲密关系"},"runtime":{"rendererKey":"generic","resultTemplateKey":"relationship-story","scoringKey":"radar"},"presentation":{"themeKey":"rose-map","storyMode":true,"screenCount":4,"shareCardKey":"relationship-language-poster"},"questions":[],"results":[],"extensions":{"intro":{"tagline":"30 题正式版，支持结果回看、分享与关系海报导出。","priceLabel":"30 题正式版","accessSummary":"输入购买后获得的验证码开始测试，有效期内可重复进入","valuePoints":["主语言 / 次语言判断","五维分布与失落触发点","伴侣行动建议 + 可导出海报"],"flowSteps":["输入验证码","完成 30 题二选一","查看完整结果"],"detailSections":[]}}}',
  '亲密关系偏好测试正式版运行时占位配置，题目内容由官方静态运行时补全。'
);

UPDATE quizzes
SET current_draft_version_id = 'quiz_version_relationship_preference_v1'
WHERE id = 'quiz_relationship_preference_test';

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
  'product_relationship_preference_single',
  '亲密关系偏好测试 · 正式版单测',
  'single_product',
  'active',
  'xiaohongshu',
  'https://example.com/relationship-preference',
  'code_gate',
  1,
  '当前采用共享验证码交付亲密关系偏好测试正式版。'
);

INSERT OR REPLACE INTO product_quizzes (
  id,
  product_id,
  quiz_id,
  sort_order,
  access_json
) VALUES (
  'pq_relationship_preference_single',
  'product_relationship_preference_single',
  'quiz_relationship_preference_test',
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
  'batch_relationship_preference_launch',
  'product_relationship_preference_single',
  '亲密关系偏好测试首发批次',
  'single_product',
  'RPREF',
  14,
  'active',
  '2026-12-31T23:59:59.000Z',
  '{"scopeMode":"product","verificationMode":"shared_code","tokenTtlDays":30,"introVisible":true,"notes":"正式版首发阶段采用共享验证码，便于投放与客服联调"}'
);

INSERT OR REPLACE INTO codes (
  code,
  batch_id,
  status,
  expires_at,
  metadata_json
) VALUES
  (
    'RPREF-8Q4M-2T7K',
    'batch_relationship_preference_launch',
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"channel":"formal-launch","remark":"亲密关系偏好测试正式版随机验证码"}'
  ),
  (
    'ST-LOVE-BETA',
    'batch_relationship_preference_launch',
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"channel":"customer-support","remark":"亲密关系偏好测试客服联调验证码"}'
  );

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
  'quiz_dark_triad',
  'dark-triad',
  '暗面力量测试',
  '每个人都有不愿意承认的那一面。基于经典的暗黑三角模型，这套测试将帮你看见隐藏在人格深处的策略操盘、聚光主场与冷感冒险倾向。',
  '专业量表',
  'published',
  29.9,
  1,
  'quiz_version_dark_triad_v1'
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
  'quiz_version_dark_triad_v1',
  'quiz_dark_triad',
  1,
  '1.0.0',
  'published',
  '{"meta":{"slug":"dark-triad","title":"暗面力量测试","summary":"每个人都有不愿意承认的那一面。基于经典的暗黑三角模型，这套测试将帮你看见隐藏在人格深处的策略操盘、聚光主场与冷感冒险倾向。","estimatedMinutes":5,"tags":["暗面人格","生存策略","27 题","深度解析"],"category":"专业量表"},"runtime":{"renderer":"custom","resultTemplate":"custom"},"presentation":{"themeKey":"ink-glow","storyMode":true,"screenCount":5,"shareCardKey":"sd3-poster"},"questions":[],"results":[],"extensions":{"intro":{"tagline":"27 题专业版，探索你的暗面人格与生存策略。","priceLabel":"27 题正式版","accessSummary":"输入购买后获得的验证码开始测试，有效期内可重复进入","valuePoints":["三维人格分布图","9大暗面原型定位","人际与竞争策略拆解"],"flowSteps":["输入验证码","完成 27 题自评","解锁深度报告"],"detailSections":[]}}}',
  '暗面力量测试正式版运行时占位配置，题目内容由官方静态运行时补全。'
);

UPDATE quizzes
SET current_draft_version_id = 'quiz_version_dark_triad_v1'
WHERE id = 'quiz_dark_triad';

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
  'product_dark_triad_single',
  '暗面力量测试 · 正式版单测',
  'single_product',
  'active',
  'xiaohongshu',
  'https://example.com/dark-triad',
  'code_gate',
  1,
  '当前采用共享验证码交付暗面力量测试正式版。'
);

INSERT OR REPLACE INTO product_quizzes (
  id,
  product_id,
  quiz_id,
  sort_order,
  access_json
) VALUES (
  'pq_dark_triad_single',
  'product_dark_triad_single',
  'quiz_dark_triad',
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
  'batch_dark_triad_launch',
  'product_dark_triad_single',
  '暗面力量测试首发批次',
  'single_product',
  'SD3',
  14,
  'active',
  '2026-12-31T23:59:59.000Z',
  '{"scopeMode":"product","verificationMode":"shared_code","tokenTtlDays":30,"introVisible":true,"notes":"正式版首发阶段采用共享验证码，便于投放与客服联调"}'
);

INSERT OR REPLACE INTO codes (
  code,
  batch_id,
  status,
  expires_at,
  metadata_json
) VALUES
  (
    'SD3-DARK-TRIAD',
    'batch_dark_triad_launch',
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"channel":"formal-launch","remark":"暗黑三角测试正式版随机验证码"}'
  ),
  (
    'ST-SD3-BETA',
    'batch_dark_triad_launch',
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"channel":"customer-support","remark":"暗黑三角测试客服联调验证码"}'
  );



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
  'quiz_bigfive_personality',
  'bigfive',
  '大五人格测试',
  '基于国际通用 Big Five 模型的大五人格测试，帮助你看到自己在外向性、宜人性、尽责性、神经质与开放性五个维度上的稳定偏好。',
  '人格 / 性格',
  'published',
  29.9,
  1,
  'quiz_version_bigfive_v1'
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
  'quiz_version_bigfive_v1',
  'quiz_bigfive_personality',
  1,
  '1.0.0',
  'published',
  '{"meta":{"slug":"bigfive","title":"大五人格测试","summary":"基于国际通用 Big Five 模型的大五人格测试，帮助你看到自己在外向性、宜人性、尽责性、神经质与开放性五个维度上的稳定偏好。","estimatedMinutes":8,"tags":["大五人格","50 题","五维人格","正式版"],"category":"人格 / 性格"},"runtime":{"rendererKey":"generic","resultTemplateKey":"story-card","scoringKey":"radar"},"presentation":{"themeKey":"ink-glow","storyMode":true,"screenCount":5,"shareCardKey":"bigfive-profile-poster"},"questions":[],"results":[],"extensions":{"intro":{"tagline":"50 题正式版，支持保存人格画像与分享结果长图。","priceLabel":"50 题正式版","accessSummary":"输入购买后获得的验证码开始测试，有效期内可重复进入","valuePoints":["五维人格画像","关系 / 工作 / 压力解读","支持保存与分享"],"flowSteps":["输入验证码","完成 50 题","查看完整结果"],"detailSections":[]}}}',
  '大五人格测试正式版运行时占位配置，题目内容由官方静态运行时补全。'
);

UPDATE quizzes
SET current_draft_version_id = 'quiz_version_bigfive_v1'
WHERE id = 'quiz_bigfive_personality';

DELETE FROM codes WHERE batch_id = 'batch_dark_triad_launch';
DELETE FROM code_batches WHERE id = 'batch_dark_triad_launch';
DELETE FROM product_quizzes WHERE product_id = 'product_dark_triad_single';
DELETE FROM products WHERE id = 'product_dark_triad_single';

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
  'product_personality_bundle_shared',
  '人格深测双题通用版',
  'bundle',
  'active',
  'xiaohongshu',
  'https://example.com/personality-pro',
  'code_gate',
  1,
  '同一组验证码可访问大五人格测试与暗面力量测试。'
);

INSERT OR REPLACE INTO product_quizzes (
  id,
  product_id,
  quiz_id,
  sort_order,
  access_json
) VALUES
  (
    'pq_personality_bundle_bigfive',
    'product_personality_bundle_shared',
    'quiz_bigfive_personality',
    1,
    '{"mode":"full_access"}'
  ),
  (
    'pq_personality_bundle_dark_triad',
    'product_personality_bundle_shared',
    'quiz_dark_triad',
    2,
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
  'batch_personality_bundle_launch',
  'product_personality_bundle_shared',
  '人格深测双题通用批次',
  'bundle',
  'PRO',
  14,
  'active',
  '2026-12-31T23:59:59.000Z',
  '{"scopeMode":"product","verificationMode":"shared_code","tokenTtlDays":30,"introVisible":true,"notes":"当前采用共享验证码，同一组验证码可同时访问大五人格与暗面力量测试。"}'
);

INSERT OR REPLACE INTO codes (
  code,
  batch_id,
  status,
  expires_at,
  metadata_json
) VALUES
  (
    'SOUL-PRO-2026',
    'batch_personality_bundle_launch',
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"channel":"formal-launch","remark":"人格深测双题通用验证码"}'
  ),
  (
    'ST-PRO-BETA',
    'batch_personality_bundle_launch',
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"channel":"customer-support","remark":"人格深测双题联调验证码"}'
  ),
  (
    'SD3-DARK-TRIAD',
    'batch_personality_bundle_launch',
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"channel":"compatibility","remark":"兼容保留的暗黑三角验证码"}'
  ),
  (
    'ST-SD3-BETA',
    'batch_personality_bundle_launch',
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"channel":"compatibility","remark":"兼容保留的暗黑三角联调验证码"}'
  );

-- HEXACO 60 Personality Test
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
  'quiz_hexaco_personality',
  'hexaco-60',
  'HEXACO 六维人格测试',
  '基于 HEXACO 六维人格模型，通过 60 道题目深度还原你在规则、情绪、社交、冲突、执行与开放性六个维度上的稳定偏好。比大五人格多一维，看见更真实的自己。',
  '人格 / 性格',
  'published',
  39.9,
  1,
  'quiz_version_hexaco_v1'
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
  'quiz_version_hexaco_v1',
  'quiz_hexaco_personality',
  1,
  '1.0.0',
  'published',
  '{"meta":{"slug":"hexaco-60","title":"HEXACO 六维人格测试","summary":"基于 HEXACO 六维人格模型，通过 60 道题目深度还原你在规则、情绪、社交、冲突、执行与开放性六个维度上的稳定偏好。","estimatedMinutes":10,"tags":["HEXACO","六维人格","60 题","深度解析"],"category":"人格 / 性格"},"runtime":{"rendererKey":"generic","resultTemplateKey":"hexaco-profile","scoringKey":"hexaco"},"presentation":{"themeKey":"violet-lab","storyMode":true,"screenCount":6,"shareCardKey":"hexaco-poster"},"questions":[],"results":[],"extensions":{"intro":{"tagline":"60 题专业版，支持结果回看、分享与一键导出六维雷达图海报。","priceLabel":"60 题正式版","accessSummary":"输入购买后获得的验证码开始测试，有效期内可重复进入","valuePoints":["六维人格图谱","H 维度特色解读","关系 / 协作 / 压力全景报告"],"flowSteps":["输入验证码","完成 60 题","查看完整结果"],"detailSections":[]}}}',
  'HEXACO 六维人格测试正式版运行时占位配置，题目内容由官方静态运行时补全。'
);

UPDATE quizzes
SET current_draft_version_id = 'quiz_version_hexaco_v1'
WHERE id = 'quiz_hexaco_personality';

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
  'product_hexaco_single',
  'HEXACO 六维人格测试 · 正式版单测',
  'single_product',
  'active',
  'xiaohongshu',
  'https://example.com/hexaco',
  'code_gate',
  1,
  '当前采用共享验证码交付 HEXACO 六维人格测试正式版。'
);

INSERT OR REPLACE INTO product_quizzes (
  id,
  product_id,
  quiz_id,
  sort_order,
  access_json
) VALUES (
  'pq_hexaco_single',
  'product_hexaco_single',
  'quiz_hexaco_personality',
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
  'batch_hexaco_launch',
  'product_hexaco_single',
  'HEXACO 六维人格测试首发批次',
  'single_product',
  'HEXA',
  14,
  'active',
  '2026-12-31T23:59:59.000Z',
  '{"scopeMode":"product","verificationMode":"shared_code","tokenTtlDays":30,"introVisible":true,"notes":"正式版首发阶段采用共享验证码，便于投放与客服联调"}'
);

INSERT OR REPLACE INTO codes (
  code,
  batch_id,
  status,
  expires_at,
  metadata_json
) VALUES
  (
    'HEXA-60-PRO',
    'batch_hexaco_launch',
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"channel":"formal-launch","remark":"HEXACO 六维人格测试正式版随机验证码"}'
  );

-- Soul Tarot Test
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
  'quiz_soul_tarot',
  'soul-tarot',
  '你是哪张塔罗牌？',
  '22 张大阿尔卡纳，22 种灵魂原型——你的灵魂，对应哪一张牌？基于 5 维向量匹配算法，寻找你的灵魂归宿。',
  '神秘学 / 心理',
  'published',
  9.9,
  1,
  'quiz_version_tarot_v1'
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
  'quiz_version_tarot_v1',
  'quiz_soul_tarot',
  1,
  '1.0.0',
  'published',
  '{"meta":{"slug":"soul-tarot","title":"你是哪张塔罗牌？","summary":"22 张大阿尔卡纳，22 种灵魂原型——你的灵魂，对应哪一张牌？","estimatedMinutes":10,"tags":["塔罗占卜","灵魂原型","30 题","小红书爆款"],"category":"神秘学 / 心理"},"runtime":{"rendererKey":"generic","resultTemplateKey":"tarot-profile","scoringKey":"tarot"},"presentation":{"themeKey":"tarot-mystic","storyMode":true,"screenCount":8,"shareCardKey":"tarot-poster"},"questions":[],"results":[],"extensions":{"intro":{"tagline":"30 题正式版，支持一键导出精美塔罗灵魂海报。","priceLabel":"30 题正式版","accessSummary":"输入购买后获得的验证码开始测试，有效期内可重复进入","valuePoints":["灵魂塔罗匹配","五维灵魂向量","灵魂判词与生活建议"],"flowSteps":["输入验证码","完成 30 题","揭开灵魂牌面"],"detailSections":[]}}}',
  '灵魂塔罗测试正式版运行时占位配置，题目内容由官方静态运行时补全。'
);

UPDATE quizzes
SET current_draft_version_id = 'quiz_version_tarot_v1'
WHERE id = 'quiz_soul_tarot';

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
  'product_soul_tarot_single',
  '你是哪张塔罗牌？ · 正式版单测',
  'single_product',
  'active',
  'xiaohongshu',
  'https://example.com/tarot',
  'code_gate',
  1,
  '当前采用共享验证码交付灵魂塔罗测试正式版。'
);

INSERT OR REPLACE INTO product_quizzes (
  id,
  product_id,
  quiz_id,
  sort_order,
  access_json
) VALUES (
  'pq_soul_tarot_single',
  'product_soul_tarot_single',
  'quiz_soul_tarot',
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
  'batch_soul_tarot_launch',
  'product_soul_tarot_single',
  '灵魂塔罗测试首发批次',
  'single_product',
  'TAROT',
  14,
  'active',
  '2026-12-31T23:59:59.000Z',
  '{"scopeMode":"product","verificationMode":"shared_code","tokenTtlDays":30,"introVisible":true,"notes":"正式版首发阶段采用共享验证码，便于投放与客服联调"}'
);

INSERT OR REPLACE INTO codes (
  code,
  batch_id,
  status,
  expires_at,
  metadata_json
) VALUES
  (
    'SOUL-TAROT-2026',
    'batch_soul_tarot_launch',
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"channel":"formal-launch","remark":"灵魂塔罗测试正式版随机验证码"}'
  ),
  (
    'ST-TAROT-BETA',
    'batch_soul_tarot_launch',
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"channel":"customer-support","remark":"灵魂塔罗测试客服联调验证码"}'
  );

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
  'quiz_enneagram_54',
  'enneagram',
  '九型人格测试',
  '一套更偏向“核心驱动力”视角的九型人格测试。54 道原创中文题，帮你看见自己更接近哪一种内在动机模式，以及关系、工作和压力下的自然反应。',
  '人格 / 驱动力',
  'published',
  39.9,
  1,
  'quiz_version_enneagram_v1'
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
  'quiz_version_enneagram_v1',
  'quiz_enneagram_54',
  1,
  '1.0.0',
  'published',
  '{"meta":{"slug":"enneagram","title":"九型人格测试","summary":"一套更偏向“核心驱动力”视角的九型人格测试。54 道原创中文题，帮你看见自己更接近哪一种内在动机模式，以及关系、工作和压力下的自然反应。","estimatedMinutes":9,"tags":["九型人格","54 题正式版","核心驱动力","适合保存分享长图"],"category":"人格 / 驱动力"},"runtime":{"rendererKey":"generic","resultTemplateKey":"enneagram-profile","scoringKey":"enneagram"},"presentation":{"themeKey":"editorial-mystic","storyMode":true,"screenCount":6,"shareCardKey":"enneagram-drive-poster"},"questions":[],"results":[],"extensions":{"intro":{"tagline":"54 题正式版，结果支持保存驱动力长图与社媒分享。","priceLabel":"54 题正式版","accessSummary":"输入购买后获得的验证码开始测试，有效期内可重复进入","valuePoints":["主型 + 近邻类型判断","关系 / 工作 / 压力方向解析","支持保存与分享"],"flowSteps":["输入验证码","完成 54 题符合度作答","查看完整结果"],"detailSections":[]}}}',
  '九型人格测试正式版运行时占位配置，题目内容由官方静态运行时补全。'
);

UPDATE quizzes
SET current_draft_version_id = 'quiz_version_enneagram_v1'
WHERE id = 'quiz_enneagram_54';

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
  'product_enneagram_single',
  '九型人格测试 · 正式版单测',
  'single_product',
  'active',
  'xiaohongshu',
  'https://example.com/enneagram',
  'code_gate',
  1,
  '当前采用共享验证码交付九型人格测试正式版。'
);

INSERT OR REPLACE INTO product_quizzes (
  id,
  product_id,
  quiz_id,
  sort_order,
  access_json
) VALUES (
  'pq_enneagram_single',
  'product_enneagram_single',
  'quiz_enneagram_54',
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
  'batch_enneagram_launch',
  'product_enneagram_single',
  '九型人格测试首发批次',
  'single_product',
  'ENNEA',
  14,
  'active',
  '2026-12-31T23:59:59.000Z',
  '{"scopeMode":"product","verificationMode":"shared_code","tokenTtlDays":30,"introVisible":true,"notes":"正式版首发阶段采用共享验证码，便于投放与客服联调"}'
);

INSERT OR REPLACE INTO codes (
  code,
  batch_id,
  status,
  expires_at,
  metadata_json
) VALUES
  (
    'ENNEA-5W4-2026',
    'batch_enneagram_launch',
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"channel":"formal-launch","remark":"九型人格测试正式版随机验证码"}'
  ),
  (
    'ST-ENNEA-BETA',
    'batch_enneagram_launch',
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"channel":"customer-support","remark":"九型人格测试客服联调验证码"}'
  );

-- RIASEC 48
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
  'quiz_riasec_48',
  'riasec-48',
  '霍兰德 RIASEC 职业兴趣测试',
  '基于经典 Holland RIASEC 模型，通过 48 道精选题目，精准还原你在六个核心维度上的兴趣偏好，帮你找到更契合的工作环境与职业方向。',
  '职业 / 发展',
  'published',
  29.9,
  1,
  'quiz_version_riasec_v1'
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
  'quiz_version_riasec_v1',
  'quiz_riasec_48',
  1,
  '1.0.0',
  'published',
  '{"meta":{"slug":"riasec-48","title":"霍兰德 RIASEC 职业兴趣测试","summary":"基于经典 Holland RIASEC 模型，通过 48 道精选题目，精准还原你在六个核心维度上的兴趣偏好，帮你找到更契合的工作环境与职业方向。","estimatedMinutes":8,"tags":["职业兴趣","RIASEC","48 题","深度解析"],"category":"职业 / 发展"},"runtime":{"rendererKey":"generic","resultTemplateKey":"riasec-profile","scoringKey":"riasec"},"presentation":{"themeKey":"professional-blue","storyMode":true,"screenCount":6,"shareCardKey":"riasec-profile-poster"},"questions":[],"results":[],"extensions":{"intro":{"tagline":"48 题正式版，包含 12 组深度三码报告与六维图谱。","priceLabel":"48 题正式版","accessSummary":"输入购买后获得的验证码开始测试，有效期内可重复进入","valuePoints":["六维兴趣图谱","前三码深度报告","适合的任务与环境建议"],"flowSteps":["输入验证码","完成 48 题","查看完整结果"],"detailSections":[]}}}',
  'RIASEC 职业兴趣测试正式版占位配置，内容由静态 runtime 补全。'
);

UPDATE quizzes
SET current_draft_version_id = 'quiz_version_riasec_v1'
WHERE id = 'quiz_riasec_48';

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
  'product_riasec_single',
  '霍兰德 RIASEC 职业兴趣测试 · 正式版单测',
  'single_product',
  'active',
  'xiaohongshu',
  'https://example.com/riasec',
  'code_gate',
  1,
  '采用共享验证码交付 RIASEC 正式版。'
);

INSERT OR REPLACE INTO product_quizzes (
  id,
  product_id,
  quiz_id,
  sort_order,
  access_json
) VALUES (
  'pq_riasec_single',
  'product_riasec_single',
  'quiz_riasec_48',
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
  'batch_riasec_launch',
  'product_riasec_single',
  'RIASEC 首发批次',
  'single_product',
  'RIASEC',
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
    'RIASEC-7M2P-9Q4X',
    'batch_riasec_launch',
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"channel":"formal-launch","remark":"RIASEC 正式版验证码"}'
  ),
  (
    'ST-RIASEC-BETA',
    'batch_riasec_launch',
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"channel":"customer-support","remark":"RIASEC 客服联调验证码"}'
  );

-- BEGIN FREE QUIZ D1 MIGRATION
-- 免费测试题元数据已迁入 D1；免费题运行页仍保持前端自定义实现。

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
  'free_quiz_aura_color',
  'free/aura',
  '你的 Aura 是什么颜色？',
  '基于双维度四象限模型的免费体验测试，3 分钟快速识别你的灵魂底色。',
  '免费 / 灵魂气场',
  'published',
  0,
  1,
  'quiz_version_free_aura_v1'
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
  'quiz_version_free_aura_v1',
  'free_quiz_aura_color',
  1,
  '1.0.0',
  'published',
  '{"meta":{"slug":"free/aura","title":"你的 Aura 是什么颜色？","summary":"基于双维度四象限模型的免费体验测试，3 分钟快速识别你的灵魂底色。","estimatedMinutes":3,"tags":["免费","Aura","18题","引流款"],"category":"免费 / 灵魂气场"},"runtime":{"rendererKey":"custom-free-page","resultTemplateKey":"custom-free-page","scoringKey":"custom-free-page"},"presentation":{"themeKey":"custom-free-page","storyMode":true,"screenCount":1,"shareCardKey":"custom-free-page"},"questions":[],"results":[],"extensions":{"intro":{"tagline":"免费体验款，用于内容传播和引流。","priceLabel":"免费体验","accessSummary":"无需验证码，直接开始测试","questionCount":18,"valuePoints":["8 种灵魂光谱","专属灵魂画像","结果页可分享"],"flowSteps":["进入页面","完成 18 题","查看结果"],"detailSections":[]}}}',
  '将免费测试题目录元数据迁入 D1，保留前端自定义题页与结果页实现。'
);

UPDATE quizzes
SET current_draft_version_id = 'quiz_version_free_aura_v1'
WHERE id = 'free_quiz_aura_color';

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
  'free_quiz_banwei_density',
  'free/banwei',
  '你的班味浓度检测',
  '面向打工人传播场景的免费检测题，用五维成分分析你的班味浓度。',
  '免费 / 职场娱乐',
  'published',
  0,
  1,
  'quiz_version_free_banwei_v1'
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
  'quiz_version_free_banwei_v1',
  'free_quiz_banwei_density',
  1,
  '1.0.0',
  'published',
  '{"meta":{"slug":"free/banwei","title":"你的班味浓度检测","summary":"面向打工人传播场景的免费检测题，用五维成分分析你的班味浓度。","estimatedMinutes":2,"tags":["免费","班味","15题","传播测试"],"category":"免费 / 职场娱乐"},"runtime":{"rendererKey":"custom-free-page","resultTemplateKey":"custom-free-page","scoringKey":"custom-free-page"},"presentation":{"themeKey":"custom-free-page","storyMode":true,"screenCount":1,"shareCardKey":"custom-free-page"},"questions":[],"results":[],"extensions":{"intro":{"tagline":"免费轻测款，用于社交传播和用户破冰。","priceLabel":"免费体验","accessSummary":"无需验证码，直接开始测试","questionCount":15,"valuePoints":["五维成分分析","社畜形态结论","结果页可分享"],"flowSteps":["进入页面","完成 15 题","查看结果"],"detailSections":[]}}}',
  '将免费测试题目录元数据迁入 D1，保留前端自定义题页与结果页实现。'
);

UPDATE quizzes
SET current_draft_version_id = 'quiz_version_free_banwei_v1'
WHERE id = 'free_quiz_banwei_density';

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
  'free_quiz_painting_soul_map',
  'free/painting',
  '你的灵魂是哪幅名画？',
  '通过 28 道审美与直觉选择题，定位你的艺术人格坐标。',
  '免费 / 艺术人格',
  'published',
  0,
  1,
  'quiz_version_free_painting_v1'
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
  'quiz_version_free_painting_v1',
  'free_quiz_painting_soul_map',
  1,
  '1.0.0',
  'published',
  '{"meta":{"slug":"free/painting","title":"你的灵魂是哪幅名画？","summary":"通过 28 道审美与直觉选择题，定位你的艺术人格坐标。","estimatedMinutes":5,"tags":["免费","名画","28题","艺术人格"],"category":"免费 / 艺术人格"},"runtime":{"rendererKey":"custom-free-page","resultTemplateKey":"custom-free-page","scoringKey":"custom-free-page"},"presentation":{"themeKey":"custom-free-page","storyMode":true,"screenCount":1,"shareCardKey":"custom-free-page"},"questions":[],"results":[],"extensions":{"intro":{"tagline":"免费艺术人格测试，适合做传播和风格种草。","priceLabel":"免费体验","accessSummary":"无需验证码，直接开始测试","questionCount":28,"valuePoints":["艺术风格匹配","人格投射结果","结果页可分享"],"flowSteps":["进入页面","完成 28 题","查看结果"],"detailSections":[]}}}',
  '将免费测试题目录元数据迁入 D1，保留前端自定义题页与结果页实现。'
);

UPDATE quizzes
SET current_draft_version_id = 'quiz_version_free_painting_v1'
WHERE id = 'free_quiz_painting_soul_map';

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
  'free_quiz_hidden_talent',
  'free/talent',
  '你的隐藏天赋是什么？',
  '基于六维天赋模型的轻量测试，帮助用户快速看见自己的核心优势。',
  '免费 / 天赋探索',
  'published',
  0,
  1,
  'quiz_version_free_talent_v1'
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
  'quiz_version_free_talent_v1',
  'free_quiz_hidden_talent',
  1,
  '1.0.0',
  'published',
  '{"meta":{"slug":"free/talent","title":"你的隐藏天赋是什么？","summary":"基于六维天赋模型的轻量测试，帮助用户快速看见自己的核心优势。","estimatedMinutes":3,"tags":["免费","天赋","20题","热门推荐"],"category":"免费 / 天赋探索"},"runtime":{"rendererKey":"custom-free-page","resultTemplateKey":"custom-free-page","scoringKey":"custom-free-page"},"presentation":{"themeKey":"custom-free-page","storyMode":true,"screenCount":1,"shareCardKey":"custom-free-page"},"questions":[],"results":[],"extensions":{"intro":{"tagline":"免费天赋测试，适合首轮破冰和用户分享。","priceLabel":"免费体验","accessSummary":"无需验证码，直接开始测试","questionCount":20,"valuePoints":["六维天赋画像","天赋原型判断","结果页可分享"],"flowSteps":["进入页面","完成 20 题","查看结果"],"detailSections":[]}}}',
  '将免费测试题目录元数据迁入 D1，保留前端自定义题页与结果页实现。'
);

UPDATE quizzes
SET current_draft_version_id = 'quiz_version_free_talent_v1'
WHERE id = 'free_quiz_hidden_talent';

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
  'free_quiz_szondi_shadow',
  'free/szondi',
  '索迪测试：潜意识暗影',
  '基于经典投射法的免费测试，用影像偏好揭示你更容易压抑的那一面。',
  '免费 / 潜意识投射',
  'published',
  0,
  1,
  'quiz_version_free_szondi_v1'
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
  'quiz_version_free_szondi_v1',
  'free_quiz_szondi_shadow',
  1,
  '1.0.0',
  'published',
  '{"meta":{"slug":"free/szondi","title":"索迪测试：潜意识暗影","summary":"基于经典投射法的免费测试，用影像偏好揭示你更容易压抑的那一面。","estimatedMinutes":4,"tags":["免费","索迪","24题","暗影探索"],"category":"免费 / 潜意识投射"},"runtime":{"rendererKey":"custom-free-page","resultTemplateKey":"custom-free-page","scoringKey":"custom-free-page"},"presentation":{"themeKey":"custom-free-page","storyMode":true,"screenCount":1,"shareCardKey":"custom-free-page"},"questions":[],"results":[],"extensions":{"intro":{"tagline":"免费暗影探索，适合作为轻量传播款。","priceLabel":"免费体验","accessSummary":"无需验证码，直接开始测试","questionCount":24,"valuePoints":["潜意识偏好","隐藏冲动提示","结果页可分享"],"flowSteps":["进入页面","完成 24 题","查看结果"],"detailSections":[]}}}',
  '将免费测试题目录元数据迁入 D1，保留前端自定义题页与结果页实现。'
);

UPDATE quizzes
SET current_draft_version_id = 'quiz_version_free_szondi_v1'
WHERE id = 'free_quiz_szondi_shadow';

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
  'free_quiz_soul_city',
  'free/soul-city',
  '你的灵魂是哪座城市？',
  '把大五人格映射到城市气质，用 30 道轻量题找到最像你的世界坐标。',
  '免费 / 城市人格',
  'published',
  0,
  1,
  'quiz_version_free_soul_city_v1'
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
  'quiz_version_free_soul_city_v1',
  'free_quiz_soul_city',
  1,
  '1.0.0',
  'published',
  '{"meta":{"slug":"free/soul-city","title":"你的灵魂是哪座城市？","summary":"把大五人格映射到城市气质，用 30 道轻量题找到最像你的世界坐标。","estimatedMinutes":4,"tags":["免费","城市人格","30题","分享向"],"category":"免费 / 城市人格"},"runtime":{"rendererKey":"custom-free-page","resultTemplateKey":"custom-free-page","scoringKey":"custom-free-page"},"presentation":{"themeKey":"custom-free-page","storyMode":true,"screenCount":1,"shareCardKey":"custom-free-page"},"questions":[],"results":[],"extensions":{"intro":{"tagline":"免费城市人格测试，适合社交分享和世界观种草。","priceLabel":"免费体验","accessSummary":"无需验证码，直接开始测试","questionCount":30,"valuePoints":["五维灵魂匹配","18 座全球城市","结果页可分享"],"flowSteps":["进入页面","完成 30 题","查看结果"],"detailSections":[]}}}',
  '将免费测试题目录元数据迁入 D1，保留前端自定义题页与结果页实现。'
);

UPDATE quizzes
SET current_draft_version_id = 'quiz_version_free_soul_city_v1'
WHERE id = 'free_quiz_soul_city';
-- END FREE QUIZ D1 MIGRATION

-- BEGIN PAID QUIZ D1 MIGRATION: STRESS LOAD + DESIRE COMPOSITION
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
  '测测最近 30 天，你的心理系统到底承受了多少重量。',
  '心理状态 / 压力',
  'published',
  29.9,
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
  '压力负荷测试正式版元数据迁入 D1，运行时内容暂由静态 runtime 兼容补全。'
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
  'product_stress_load_shared',
  '压力负荷测试 · 正式版单测',
  'single_product',
  'active',
  'xiaohongshu',
  'https://example.com/stress-load',
  'code_gate',
  1,
  '压力负荷测试正式版，面向高压人群的深度自评与报告。'
);

INSERT OR REPLACE INTO product_quizzes (
  id,
  product_id,
  quiz_id,
  sort_order,
  access_json
) VALUES (
  'pq_stress_load_shared',
  'product_stress_load_shared',
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
  'batch_stress_load_shared',
  'product_stress_load_shared',
  '压力负荷测试首发批次',
  'single_product',
  'STRESS',
  16,
  'active',
  '2026-12-31T23:59:59.000Z',
  '{"scopeMode":"product","verificationMode":"shared_code","tokenTtlDays":30,"introVisible":true,"notes":"压力负荷测试首发阶段采用共享验证码，便于内容投放与客服联调。"}'
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
    'batch_stress_load_shared',
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"channel":"formal-launch","remark":"压力负荷测试正式版验证码"}'
  ),
  (
    'ST-STRESS-BETA',
    'batch_stress_load_shared',
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"channel":"customer-support","remark":"压力负荷测试客服联调验证码"}'
  );

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
  'quiz_desire_composition',
  'desire-composition',
  '你的欲望组成图',
  '每个人心中都藏着一份欲望配方，测测你的灵魂最渴望什么。',
  '性格探索 / 欲望',
  'published',
  19.9,
  1,
  'quiz_version_desire_composition_v1'
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
  'quiz_version_desire_composition_v1',
  'quiz_desire_composition',
  1,
  '1.0.0',
  'published',
  '{"meta":{"slug":"desire-composition","title":"你的欲望组成图","summary":"每个人心中都藏着一份欲望配方，测测你的灵魂最渴望什么","estimatedMinutes":2,"tags":["欲望组成","12题","饼图","人格标签"],"category":"性格探索 / 欲望"},"runtime":{"rendererKey":"custom","resultTemplateKey":"custom","scoringKey":"dimension"},"presentation":{"themeKey":"midnight-desire","storyMode":true,"screenCount":3,"shareCardKey":"desire-composition-poster"},"questions":[{"id":"q1","type":"single_choice","title":"你意外获得了一笔100万现金，第一反应是？","options":[{"id":"q1_a","label":"先存起来/投资理财，让钱生钱","value":{"M":3}},{"id":"q1_b","label":"买一张头等舱机票，带最爱的人去蜜月旅行","value":{"L":3,"S":1}},{"id":"q1_c","label":"全身改造！医美/置装/健身私教安排上","value":{"B":3}},{"id":"q1_d","label":"辞职！用这笔钱给自己一年自由时间","value":{"S":3,"K":1}},{"id":"q1_e","label":"拿来创业/做一个自己的品牌","value":{"P":3,"M":1}}]},{"id":"q2","type":"single_choice","title":"周末一个人的完美晚餐是？","options":[{"id":"q2_a","label":"订一家米其林/网红餐厅，认真吃一顿好的","value":{"F":3,"B":1}},{"id":"q2_b","label":"叫外卖+追剧/刷手机，窝在沙发上发呆","value":{"S":3}},{"id":"q2_c","label":"约上暧昧对象/伴侣，烛光晚餐走起","value":{"L":3,"F":1}},{"id":"q2_d","label":"自己下厨做一道没试过的菜，享受研究的过程","value":{"K":3,"F":1}},{"id":"q2_e","label":"去参加一个高端社交晚宴，拓展人脉","value":{"P":3,"M":1}}]},{"id":"q3","type":"single_choice","title":"你最常在深夜打开的App是？","options":[{"id":"q3_a","label":"淘宝/小红书——看看有什么好看的衣服和美妆","value":{"B":3,"M":1}},{"id":"q3_b","label":"探探/微信——和喜欢的人聊天或翻聊天记录","value":{"L":3}},{"id":"q3_c","label":"基金/股票App——看看今天赚了还是亏了","value":{"M":3}},{"id":"q3_d","label":"B站/播客/知乎——学点新东西或看纪录片","value":{"K":3}},{"id":"q3_e","label":"大众点评/美食博主视频——研究明天吃什么","value":{"F":3}}]},{"id":"q4","type":"single_choice","title":"如果可以拥有一种超能力，你选？","options":[{"id":"q4_a","label":"时间暂停——想休息多久就多久，永远不赶deadline","value":{"S":3}},{"id":"q4_b","label":"读心术——知道别人在想什么，永远占据主动","value":{"P":3,"K":1}},{"id":"q4_c","label":"永葆青春——永远保持最好看的状态","value":{"B":3}},{"id":"q4_d","label":"点石成金——碰什么都能变成钱","value":{"M":3,"P":1}},{"id":"q4_e","label":"让喜欢的人也喜欢自己——100%的爱情回应率","value":{"L":3}}]},{"id":"q5","type":"single_choice","title":"你理想中的家是什么样的？","options":[{"id":"q5_a","label":"市中心豪华公寓，落地窗俯瞰城市，彰显身份","value":{"P":3,"M":1}},{"id":"q5_b","label":"有超大衣帽间和浴室，每天精致出门","value":{"B":3,"S":1}},{"id":"q5_c","label":"开放式大厨房是核心，冰箱永远是满的","value":{"F":3,"S":1}},{"id":"q5_d","label":"有一面墙的书+安静的书房，像自己的小世界","value":{"K":3,"S":1}},{"id":"q5_e","label":"温馨的两人/家庭空间，最重要的是和爱的人在一起","value":{"L":3,"S":1}}]},{"id":"q6","type":"single_choice","title":"在一个陌生的聚会上，你最希望别人怎么形容你？","options":[{"id":"q6_a","label":"\"TA看起来好有钱\"/\"气场好强，一看就很成功\"","value":{"M":3,"P":1}},{"id":"q6_b","label":"\"TA也太好看了吧\"/\"好有品味\"","value":{"B":3}},{"id":"q6_c","label":"\"TA说话好有深度\"/\"懂好多东西\"","value":{"K":3,"P":1}},{"id":"q6_d","label":"\"TA身边那个人好幸福\"/\"好甜的一对\"","value":{"L":3}},{"id":"q6_e","label":"\"TA看起来好chill\"/\"好松弛好舒服\"","value":{"S":3}}]},{"id":"q7","type":"single_choice","title":"如果重新选择职业，你最心动的是？","options":[{"id":"q7_a","label":"投资人/企业家——赚大钱，实现财务自由","value":{"M":3,"P":1}},{"id":"q7_b","label":"美妆博主/时尚编辑——每天研究美丽这件事","value":{"B":3,"K":1}},{"id":"q7_c","label":"米其林厨师/美食旅行家——尝遍世界美味","value":{"F":3,"K":1}},{"id":"q7_d","label":"学者/作家/纪录片导演——探索真相和知识","value":{"K":3}},{"id":"q7_e","label":"自由职业/数字游民——在哪都能工作，自由最重要","value":{"S":3,"M":1}}]},{"id":"q8","type":"single_choice","title":"什么最容易让你嫉妒？","options":[{"id":"q8_a","label":"看到同龄人买了豪车/豪宅","value":{"M":3}},{"id":"q8_b","label":"看到别人秀恩爱/被偏爱","value":{"L":3}},{"id":"q8_c","label":"看到别人天生丽质/身材超好","value":{"B":3}},{"id":"q8_d","label":"看到别人升职加薪/成了领导","value":{"P":3,"M":1}},{"id":"q8_e","label":"看到别人躺平不上班还过得很好","value":{"S":3}}]},{"id":"q9","type":"single_choice","title":"你做过最多的白日梦是？","options":[{"id":"q9_a","label":"中了彩票，从此只做想做的事","value":{"M":3,"S":1}},{"id":"q9_b","label":"遇到了灵魂伴侣，从此被一个人深深爱着","value":{"L":3}},{"id":"q9_c","label":"一觉醒来变成了超级大帅哥/大美女","value":{"B":3}},{"id":"q9_d","label":"环游世界，吃遍每个国家的招牌美食","value":{"F":3,"K":1}},{"id":"q9_e","label":"成为某个领域的大佬，所有人都尊敬你","value":{"P":3,"K":1}}]},{"id":"q10","type":"single_choice","title":"选一部你最想\"活进去\"的电影/剧集：","options":[{"id":"q10_a","label":"《华尔街之狼》/《继承之战》——纸醉金迷的上流世界","value":{"M":3,"P":1}},{"id":"q10_b","label":"《怦然心动》/《花束般的恋爱》——心动到窒息的爱情","value":{"L":3}},{"id":"q10_c","label":"《小森林》/《向往的生活》——日出而作日落而息的田园","value":{"S":3,"F":1}},{"id":"q10_d","label":"《穿普拉达的女王》/《艾米丽在巴黎》——时尚光鲜的生活","value":{"B":3,"P":1}},{"id":"q10_e","label":"《星际穿越》/《三体》——探索宇宙终极奥秘","value":{"K":3}}]},{"id":"q11","type":"single_choice","title":"朋友圈发什么内容，你会获得最大满足感？","options":[{"id":"q11_a","label":"九宫格自拍/穿搭照，评论区全是\"好好看！\"","value":{"B":3,"L":1}},{"id":"q11_b","label":"和另一半的甜蜜合照/恋爱日常","value":{"L":3}},{"id":"q11_c","label":"打卡高端餐厅/精致美食摆盘","value":{"F":3,"B":1}},{"id":"q11_d","label":"新车/新房/旅行头等舱——\"不经意\"的凡尔赛","value":{"M":3,"P":1}},{"id":"q11_e","label":"读完一本书/学完一门课/参加了一个有趣的讲座","value":{"K":3}}]},{"id":"q12","type":"single_choice","title":"最后一题——如果有一个神灯，你许的第一个愿望是？","options":[{"id":"q12_a","label":"一辈子花不完的钱","value":{"M":3}},{"id":"q12_b","label":"遇到一个一辈子深爱彼此的人","value":{"L":3}},{"id":"q12_c","label":"永远年轻漂亮","value":{"B":3}},{"id":"q12_d","label":"能自由地做任何想做的事，没有任何束缚","value":{"S":3,"P":1}},{"id":"q12_e","label":"知道宇宙所有的答案","value":{"K":3}}]}],"results":[{"key":"M","title":"黄金猎手","summary":"你的灵魂里住着一个华尔街之狼"},{"key":"P","title":"王座收藏家","summary":"你不想被世界选择，你要选择世界"},{"key":"L","title":"浪漫至死","summary":"你的灵魂是用爱做的"},{"key":"B","title":"颜值至上主义者","summary":"这个世界对好看的人永远有优待"},{"key":"F","title":"灵魂干饭人","summary":"没有什么是一顿好吃的解决不了的"},{"key":"K","title":"灵魂学霸","summary":"你的大脑永远在hunger mode"},{"key":"S","title":"人间躺赢家","summary":"你的终极欲望，是不被任何欲望绑架"}],"extensions":{"scoring":{"dimensions":[{"key":"M","label":"财富欲"},{"key":"P","label":"权力欲"},{"key":"L","label":"爱情欲"},{"key":"B","label":"美貌欲"},{"key":"F","label":"美食欲"},{"key":"K","label":"求知欲"},{"key":"S","label":"安逸欲"}]},"desireComposition":{"dimensions":[{"key":"M","name":"财富欲","emoji":"💰","color":"#FFD700","label":"黄金猎手","description":"对金钱、物质安全感和财务自由的渴望"},{"key":"P","name":"权力欲","emoji":"👑","color":"#FF4444","label":"王座收藏家","description":"对掌控力、影响力和社会地位的渴望"},{"key":"L","name":"爱情欲","emoji":"💕","color":"#FF69B4","label":"浪漫至死","description":"对浪漫关系、亲密连接和被爱的渴望"},{"key":"B","name":"美貌欲","emoji":"✨","color":"#BF55EC","label":"颜值至上主义者","description":"对外在美、个人形象和魅力值的渴望"},{"key":"F","name":"美食欲","emoji":"🍽️","color":"#FF9A56","label":"灵魂干饭人","description":"对美食、味觉享受和感官愉悦的渴望"},{"key":"K","name":"求知欲","emoji":"🧠","color":"#4A90D9","label":"灵魂学霸","description":"对知识、探索未知和精神成长的渴望"},{"key":"S","name":"安逸欲","emoji":"🌿","color":"#2ECC71","label":"人间躺赢家","description":"对舒适、自由和内心平静的渴望"}],"personalities":{"M":{"key":"M","title":"黄金猎手","tagline":"你的灵魂里住着一个华尔街之狼","description":["你对金钱有一种天然的敏锐嗅觉——不是贪婪，而是一种对安全感和自由的深层渴望。","你相信\"钱不是万能的，但没有钱是万万不能的\"。你不会为了面子花钱，但你会为了\"让自己的人生有更多选择权\"而努力赚钱。","别人可能觉得你\"太现实\"，但你知道：真正的浪漫，是有底气的浪漫。"],"quote":"先实现财务自由，再谈诗和远方。","celebrities":["巴菲特","董明珠","马斯克"],"tags":["现实主义者","财务敏锐","追求自由"]},"P":{"key":"P","title":"王座收藏家","tagline":"你不想被世界选择，你要选择世界","description":["你渴望的不是\"权力\"本身，而是\"掌控感\"——对自己人生的掌控，对局面的掌控，对未来的掌控。","你讨厌\"被安排\"的感觉，天生就想做那个\"做决定的人\"。你有天然的领导气质，在人群中不自觉地就会站到C位。","有人说你\"好强\"，但你知道：弱者才需要妥协，强者创造规则。"],"quote":"这个世界是我的，也是你们的，但归根结底是我的。","celebrities":["武则天","奥普拉","拿破仑"],"tags":["掌控欲强","领导气质","创造规则"]},"L":{"key":"L","title":"浪漫至死","tagline":"你的灵魂是用爱做的","description":["你这辈子最大的欲望，就是好好爱一个人，也被一个人好好爱着。你相信爱情，相信灵魂伴侣的存在。","你可能在物质上不那么在意，但在感情上，你极度\"贪心\"——你想要100分的心动、100分的陪伴、100分的理解。","有人说你\"恋爱脑\"，但你知道：在爱里全力以赴的人，才是最勇敢的人。"],"quote":"给我一个人，我可以放弃全世界。（但最好那个人也很有钱。开玩笑的。）","celebrities":["泰勒·斯威夫特","莎士比亚","张爱玲"],"tags":["情感丰富","相信爱情","勇敢追爱"]},"B":{"key":"B","title":"颜值至上主义者","tagline":"这个世界对好看的人永远有优待","description":["你对\"美\"有一种近乎执着的追求——不只是外表，还有品味、气质和整体呈现。","你相信\"好看\"是一种核心竞争力，也是一种自我尊重。你的衣柜可能比书柜大，你的护肤步骤可能比工作流程还复杂。","有人说你\"肤浅\"，但你知道：对美的追求，本身就是人类最高级的本能之一。"],"quote":"好看就是正义。（不接受反驳。）","celebrities":["Jennie","范冰冰","贝克汉姆"],"tags":["追求美感","注重形象","品味独特"]},"F":{"key":"F","title":"灵魂干饭人","tagline":"没有什么是一顿好吃的解决不了的","description":["你是一个用味蕾感知世界的人。对你来说，美食不只是填饱肚子，而是一种生活哲学。","你可能为了一碗面跨城，为了一家餐厅订好机票，为了一道菜学了三天。你的快乐很简单——吃到好吃的，就是人生巅峰。","有人说你\"贪吃\"，但你知道：认真对待每一餐的人，也在认真对待人生。"],"quote":"人生苦短，先吃为敬。","celebrities":["蔡澜","谢霆锋","Anthony Bourdain"],"tags":["美食至上","生活哲学家","味觉敏锐"]},"K":{"key":"K","title":"灵魂学霸","tagline":"你的大脑永远在hunger mode","description":["你最上瘾的事，是\"搞懂一个新东西\"的那一刻。你的好奇心像一个永远填不满的黑洞。","今天研究量子力学，明天研究中世纪历史，后天研究咖啡豆的烘焙工艺。你相信\"无知\"才是最可怕的事。","有人说你\"书呆子\"，但你知道：真正有趣的灵魂，来自永不停止的探索。"],"quote":"这个世界上最性感的器官是大脑。","celebrities":["爱因斯坦","埃隆·马斯克","何同学"],"tags":["求知欲强","好奇心旺","探索精神"]},"S":{"key":"S","title":"人间躺赢家","tagline":"你的终极欲望，是不被任何欲望绑架","description":["你活得通透，看得明白。你不想卷，不想争，不想被社会时钟推着走。","你最大的欲望，就是没有欲望——或者说，你的欲望就是\"自由地做自己\"。你相信人生的意义不在于\"获得更多\"，而在于\"需要更少\"。","有人说你\"佛系\"，但你知道：真正的自由，是不需要向任何人证明自己。"],"quote":"世界那么大，我只想躺平。（但要躺在马尔代夫。）","celebrities":["李子柒","梭罗","五条悟"],"tags":["追求自由","通透豁达","反内卷"]}},"nationalAverage":{"M":22,"P":10,"L":20,"B":15,"F":13,"K":8,"S":12}},"intro":{"tagline":"12 ?????????????????????","priceLabel":"12 ????","accessSummary":"?????????????????????????","questionCount":12,"valuePoints":["??????","??????","??????"],"flowSteps":["?????","?? 12 ?","??????"],"detailSections":[{"title":"??????????","description":"?????????????????????? 12 ????????????????????????????????????????????"},{"title":"?????????","description":"????????????????????????????????????????????????????????????????????"},{"title":"??????","description":"??????????????????6 ??????????????????????????????????????????????????"}]}}}',
  '欲望组成图正式版元数据迁入 D1，运行时内容暂由静态 runtime 兼容补全。'
);

UPDATE quizzes
SET current_draft_version_id = 'quiz_version_desire_composition_v1'
WHERE id = 'quiz_desire_composition';

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
  'product_desire_composition_shared',
  '你的欲望组成图 · 正式版单测',
  'single_product',
  'active',
  'xiaohongshu',
  'https://example.com/desire-composition',
  'code_gate',
  1,
  '欲望组成图正式版，适合传播与分享的轻量深测产品。'
);

INSERT OR REPLACE INTO product_quizzes (
  id,
  product_id,
  quiz_id,
  sort_order,
  access_json
) VALUES (
  'pq_desire_composition_shared',
  'product_desire_composition_shared',
  'quiz_desire_composition',
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
  'batch_desire_composition_shared',
  'product_desire_composition_shared',
  '欲望组成图首发批次',
  'single_product',
  'DESIRE',
  16,
  'active',
  '2026-12-31T23:59:59.000Z',
  '{"scopeMode":"product","verificationMode":"shared_code","tokenTtlDays":30,"introVisible":true,"notes":"欲望组成图首发阶段采用共享验证码，便于传播投放与客服联调。"}'
);

INSERT OR REPLACE INTO codes (
  code,
  batch_id,
  status,
  expires_at,
  metadata_json
) VALUES
  (
    'DESIRE-COMP-2026',
    'batch_desire_composition_shared',
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"channel":"formal-launch","remark":"欲望组成图正式版验证码"}'
  ),
  (
    'ST-DESIRE-BETA',
    'batch_desire_composition_shared',
    'active',
    '2026-12-31T23:59:59.000Z',
    '{"channel":"customer-support","remark":"欲望组成图客服联调验证码"}'
  );
-- END PAID QUIZ D1 MIGRATION: STRESS LOAD + DESIRE COMPOSITION
INSERT OR REPLACE INTO admins (
  id,
  username,
  password_hash
) VALUES (
  'admin_local_dev',
  'NanProduced',
  'pbkdf2_sha256$210000$sMEqIZOBWkjr7JucC4OiQg==$yJNRabI/roVcUc6Mv7aJiN7eB7lEMCdo3sgwoUiPEYI='
);






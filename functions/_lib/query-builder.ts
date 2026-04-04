export const QUERIES = {
  listPublicQuizzes: `
    SELECT
      q.id,
      q.slug,
      q.title,
      q.summary,
      q.category,
      q.price,
      v.config_json
    FROM quizzes q
    LEFT JOIN quiz_versions v ON v.id = q.current_published_version_id
    WHERE q.status = 'published' AND q.landing_visible = 1
    ORDER BY q.created_at DESC
  `,

  getQuizIntro: `
    SELECT
      q.id,
      q.slug,
      q.title,
      q.summary,
      q.category,
      q.price,
      v.config_json,
      p.sales_channel,
      p.purchase_url
    FROM quizzes q
    LEFT JOIN quiz_versions v ON v.id = q.current_published_version_id
    LEFT JOIN product_quizzes pq ON pq.quiz_id = q.id
    LEFT JOIN products p ON p.id = pq.product_id AND p.status = 'active' AND p.landing_visible = 1
    WHERE q.slug = ?1
    ORDER BY pq.sort_order ASC
    LIMIT 1
  `,

  getRuntimeConfig: `
    SELECT
      q.id AS quiz_id,
      q.title AS quiz_title,
      q.current_published_version_id,
      v.config_json
    FROM quizzes q
    LEFT JOIN quiz_versions v ON v.id = q.current_published_version_id
    WHERE q.slug = ?1 AND q.status = 'published'
    LIMIT 1
  `,

  listAdminProducts: `
    SELECT
      p.id,
      p.name,
      p.product_type,
      p.status,
      p.description,
      COUNT(pq.id) AS quiz_count
    FROM products p
    LEFT JOIN product_quizzes pq ON pq.product_id = p.id
    GROUP BY p.id
    ORDER BY p.created_at DESC
  `,

  getLinkedQuizzes: `
    SELECT q.slug, q.title
    FROM product_quizzes pq
    JOIN quizzes q ON q.id = pq.quiz_id
    WHERE pq.product_id = ?1
    ORDER BY pq.sort_order ASC, q.created_at DESC
  `,

  listAdminCodeBatches: `
    SELECT
      cb.id,
      cb.name,
      cb.product_id,
      p.name AS product_name,
      cb.strategy_type,
      cb.status,
      cb.expires_at,
      cb.code_prefix,
      cb.code_length,
      cb.policy_json,
      COUNT(c.code) AS code_count
    FROM code_batches cb
    JOIN products p ON p.id = cb.product_id
    LEFT JOIN codes c ON c.batch_id = cb.id
    GROUP BY cb.id
    ORDER BY cb.created_at DESC
  `,

  getSampleCodes: `
    SELECT code, status, expires_at
    FROM codes
    WHERE batch_id = ?1
    ORDER BY created_at DESC
    LIMIT 3
  `,

  getAdminQuizVerification: `
    SELECT
      p.id AS product_id,
      p.name AS product_name,
      p.status AS product_status,
      cb.id AS batch_id,
      cb.name AS batch_name,
      cb.status AS batch_status,
      cb.strategy_type,
      cb.policy_json
    FROM product_quizzes pq
    JOIN products p ON p.id = pq.product_id
    LEFT JOIN code_batches cb ON cb.id = (
      SELECT cb2.id
      FROM code_batches cb2
      WHERE cb2.product_id = p.id
      ORDER BY
        CASE cb2.status
          WHEN 'active' THEN 0
          WHEN 'draft' THEN 1
          WHEN 'paused' THEN 2
          WHEN 'expired' THEN 3
          ELSE 4
        END,
        cb2.created_at DESC
      LIMIT 1
    )
    WHERE pq.quiz_id = ?1
    ORDER BY
      CASE p.status
        WHEN 'active' THEN 0
        WHEN 'draft' THEN 1
        WHEN 'paused' THEN 2
        ELSE 3
      END,
      pq.sort_order ASC
    LIMIT 1
  `,

  getActiveCodeCount: `
    SELECT COUNT(*) AS value FROM codes WHERE batch_id = ?1 AND status = 'active'
  `,

  getActiveSampleCodes: `
    SELECT code, status, expires_at
    FROM codes
    WHERE batch_id = ?1 AND status = 'active'
    ORDER BY created_at DESC
    LIMIT 3
  `,

  listAdminQuizzes: `
    SELECT
      q.id,
      q.slug,
      q.title,
      q.summary,
      q.category,
      q.price,
      q.status,
      q.landing_visible,
      COALESCE(published.config_json, draft.config_json) AS config_json
    FROM quizzes q
    LEFT JOIN quiz_versions published ON published.id = q.current_published_version_id
    LEFT JOIN quiz_versions draft ON draft.id = q.current_draft_version_id
    ORDER BY q.created_at DESC
  `,

  lookupCode: `
    SELECT
      c.code,
      c.status AS code_status,
      c.expires_at AS code_expires_at,
      cb.status AS batch_status,
      cb.expires_at AS batch_expires_at,
      cb.policy_json,
      p.id AS product_id,
      p.name AS product_name,
      p.product_type
    FROM codes c
    JOIN code_batches cb ON cb.id = c.batch_id
    JOIN products p ON p.id = cb.product_id
    WHERE c.code = ?1
    LIMIT 1
  `,

  getAllowedQuizzes: `
    SELECT q.slug, q.title
    FROM product_quizzes pq
    JOIN quizzes q ON q.id = pq.quiz_id
    WHERE pq.product_id = ?1
    ORDER BY pq.sort_order ASC, q.created_at ASC
  `,

  createCodeBatch: `
    INSERT INTO code_batches (
      id,
      product_id,
      name,
      strategy_type,
      code_prefix,
      code_length,
      status,
      expires_at,
      policy_json
    ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'active', ?7, ?8)
  `,

  createCode: `
    INSERT INTO codes (code, batch_id, status, expires_at, metadata_json)
    VALUES (?1, ?2, 'active', ?3, ?4)
  `,

  verifyCodeCount: `
    SELECT COUNT(*) AS count
    FROM codes
    WHERE batch_id = ?1
  `,

  deleteCodesByBatchId: `
    DELETE FROM codes WHERE batch_id = ?1
  `,

  deleteCodeBatch: `
    DELETE FROM code_batches WHERE id = ?1
  `,

  updateCodeBatchPolicy: `
    UPDATE code_batches
    SET policy_json = ?2
    WHERE id = ?1
  `,

  getCodeBatch: `
    SELECT id, status
    FROM code_batches
    WHERE id = ?1
    LIMIT 1
  `,

  updateCodeBatchStatus: `
    UPDATE code_batches
    SET status = ?2
    WHERE id = ?1
  `,

  revokeCodes: `
    UPDATE codes
    SET status = 'revoked'
    WHERE batch_id = ?1
      AND status != 'revoked'
  `,

  getQuizById: `
    SELECT id, current_published_version_id
    FROM quizzes
    WHERE slug = ?1
    LIMIT 1
  `,

  recordSubmission: `
    INSERT INTO submissions (
      id,
      quiz_id,
      quiz_version_id,
      product_id,
      code,
      result_key,
      score_json,
      duration_sec,
      client_info_json
    ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
  `,

  getSubmissionDetail: `
    SELECT
      s.id,
      s.result_key,
      s.score_json,
      s.created_at,
      q.slug,
      q.title,
      v.config_json
    FROM submissions s
    INNER JOIN quizzes q ON q.id = s.quiz_id
    INNER JOIN quiz_versions v ON v.id = s.quiz_version_id
    WHERE s.id = ?1
    LIMIT 1
  `,

  getActiveCodesCount: `
    SELECT COUNT(*) AS value FROM codes WHERE status = 'active'
  `,

  getSubmissionsCount: `
    SELECT COUNT(*) AS value FROM submissions
  `,

  getSubmissions24h: `
    SELECT COUNT(*) AS value FROM submissions WHERE datetime(created_at) >= datetime('now', '-1 day')
  `,

  getSubmissions7d: `
    SELECT COUNT(*) AS value FROM submissions WHERE datetime(created_at) >= datetime('now', '-7 day')
  `,

  getSubmissions30d: `
    SELECT COUNT(*) AS value FROM submissions WHERE datetime(created_at) >= datetime('now', '-30 day')
  `,

  getAvgDuration: `
    SELECT ROUND(AVG(duration_sec)) AS avgDurationSec FROM submissions WHERE duration_sec IS NOT NULL
  `,

  getShareCount: `
    SELECT COUNT(*) AS shareCount FROM submissions WHERE shared = 1
  `,

  getTopQuizzes: `
    SELECT
      q.id AS quizId,
      q.slug AS slug,
      q.title AS title,
      COUNT(*) AS submissions
    FROM submissions s
    JOIN quizzes q ON q.id = s.quiz_id
    GROUP BY q.id, q.slug, q.title
    ORDER BY submissions DESC, MAX(s.created_at) DESC
    LIMIT 5
  `,

  getDailySubmissions: `
    SELECT
      substr(created_at, 1, 10) AS date,
      COUNT(*) AS value
    FROM submissions
    WHERE datetime(created_at) >= datetime('now', '-6 day')
    GROUP BY substr(created_at, 1, 10)
    ORDER BY date ASC
  `,
}

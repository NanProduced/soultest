import type { CloudflareEnv } from "./types"

const ADMIN_SESSION_COOKIE = "soultest_admin_session"
const ADMIN_SESSION_TTL_SECONDS = 12 * 60 * 60
const ADMIN_LOGIN_WINDOW_SECONDS_DEFAULT = 10 * 60
const ADMIN_LOGIN_MAX_ATTEMPTS_DEFAULT = 5
const PBKDF2_PREFIX = "pbkdf2_sha256"
const DEVELOPMENT_ADMIN_ID = "admin_local_dev_bypass"
const DEVELOPMENT_ADMIN_USERNAME = "local-dev"
const DEVELOPMENT_APP_ENVS = new Set(["local", "development", "dev"])

interface AdminRow {
  id: string
  username: string
  password_hash: string
}

interface StoredAdminSession {
  token: string
  adminId: string
  username: string
  issuedAt: string
  expiresAt: string
}

interface FailedLoginWindow {
  attempts: number
  expiresAt: string
}

interface AdminLoginRateLimitState {
  locked: boolean
  remainingSeconds: number
  attempts: number
  maxAttempts: number
}

function parseCookies(cookieHeader: string | null) {
  if (!cookieHeader) {
    return new Map<string, string>()
  }

  return new Map(
    cookieHeader
      .split(";")
      .map((segment) => segment.trim())
      .filter(Boolean)
      .map((segment) => {
        const [name, ...rest] = segment.split("=")
        return [name, decodeURIComponent(rest.join("="))] as const
      }),
  )
}

function getCookieToken(request: Request) {
  const cookies = parseCookies(request.headers.get("cookie"))
  return cookies.get(ADMIN_SESSION_COOKIE)
}

function encodeBase64(buffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

function decodeBase64(value: string) {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0))
}

function timingSafeEqual(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) {
    return false
  }

  let mismatch = 0

  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left[index] ^ right[index]
  }

  return mismatch === 0
}

async function deriveSecretHash(rawSecret: string, saltBase64: string, iterations: number) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(rawSecret), { name: "PBKDF2" }, false, ["deriveBits"])
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: decodeBase64(saltBase64),
      iterations,
    },
    key,
    256,
  )

  return encodeBase64(bits)
}

async function verifyEncodedSecret(rawSecret: string, encodedHash: string) {
  try {
    const [scheme, iterationText, saltBase64, expectedHashBase64] = encodedHash.split("$")

    if (scheme !== PBKDF2_PREFIX || !iterationText || !saltBase64 || !expectedHashBase64) {
      return false
    }

    const iterations = Number(iterationText)

    if (!Number.isFinite(iterations) || iterations <= 0) {
      return false
    }

    const actualHashBase64 = await deriveSecretHash(rawSecret, saltBase64, iterations)
    return timingSafeEqual(decodeBase64(actualHashBase64), decodeBase64(expectedHashBase64))
  } catch {
    return false
  }
}

function buildSessionCacheKey(token: string) {
  return `admin-session:${token}`
}

function buildFailedLoginCacheKey(clientId: string) {
  return `admin-login-window:${clientId}`
}

function getAdminAccessKeyHash(env: CloudflareEnv) {
  const value = env.ADMIN_ACCESS_KEY_HASH?.trim()
  return value ? value : undefined
}

function createDevelopmentAdminSession(): StoredAdminSession {
  const issuedAt = new Date().toISOString()
  const expiresAt = new Date(Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000).toISOString()

  return {
    token: "dev_bypass_session",
    adminId: DEVELOPMENT_ADMIN_ID,
    username: DEVELOPMENT_ADMIN_USERNAME,
    issuedAt,
    expiresAt,
  }
}

export function isDevelopmentAdminBypassEnabled(env: CloudflareEnv) {
  return DEVELOPMENT_APP_ENVS.has(env.APP_ENV)
}

export function getDevelopmentAdminSession() {
  return createDevelopmentAdminSession()
}

function getClientIdentifier(request: Request) {
  const cfConnectingIp = request.headers.get("cf-connecting-ip")?.trim()

  if (cfConnectingIp) {
    return cfConnectingIp
  }

  const forwardedIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  return forwardedIp || "unknown"
}

function getAdminLoginWindowSeconds(env: CloudflareEnv) {
  const configured = Number(env.ADMIN_LOGIN_WINDOW_SECONDS ?? ADMIN_LOGIN_WINDOW_SECONDS_DEFAULT)

  if (!Number.isFinite(configured) || configured < 60) {
    return ADMIN_LOGIN_WINDOW_SECONDS_DEFAULT
  }

  return Math.floor(configured)
}

function getAdminLoginMaxAttempts(env: CloudflareEnv) {
  const configured = Number(env.ADMIN_LOGIN_MAX_ATTEMPTS ?? ADMIN_LOGIN_MAX_ATTEMPTS_DEFAULT)

  if (!Number.isFinite(configured) || configured < 1) {
    return ADMIN_LOGIN_MAX_ATTEMPTS_DEFAULT
  }

  return Math.floor(configured)
}

async function readFailedLoginWindow(request: Request, env: CloudflareEnv) {
  const raw = await env.SOULTEST_CACHE.get(buildFailedLoginCacheKey(getClientIdentifier(request)))

  if (!raw) {
    return undefined
  }

  try {
    const windowState = JSON.parse(raw) as FailedLoginWindow

    if (!windowState.expiresAt || !Number.isFinite(Date.parse(windowState.expiresAt))) {
      await env.SOULTEST_CACHE.delete(buildFailedLoginCacheKey(getClientIdentifier(request)))
      return undefined
    }

    if (Date.parse(windowState.expiresAt) <= Date.now()) {
      await env.SOULTEST_CACHE.delete(buildFailedLoginCacheKey(getClientIdentifier(request)))
      return undefined
    }

    return windowState
  } catch {
    await env.SOULTEST_CACHE.delete(buildFailedLoginCacheKey(getClientIdentifier(request)))
    return undefined
  }
}

function createCookieHeader(token: string, expiresAt: string, request: Request) {
  const isSecure = new URL(request.url).protocol === "https:"

  return [
    `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Priority=High",
    ...(isSecure ? ["Secure"] : []),
    `Expires=${new Date(expiresAt).toUTCString()}`,
    `Max-Age=${ADMIN_SESSION_TTL_SECONDS}`,
  ].join("; ")
}

function createClearedCookieHeader(request: Request) {
  const isSecure = new URL(request.url).protocol === "https:"

  return [
    `${ADMIN_SESSION_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Priority=High",
    ...(isSecure ? ["Secure"] : []),
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
    "Max-Age=0",
  ].join("; ")
}

export function isAdminAccessKeyConfigured(env: CloudflareEnv) {
  return Boolean(getAdminAccessKeyHash(env))
}

export async function getAdminLoginRateLimitState(request: Request, env: CloudflareEnv): Promise<AdminLoginRateLimitState> {
  const windowState = await readFailedLoginWindow(request, env)
  const maxAttempts = getAdminLoginMaxAttempts(env)

  if (!windowState) {
    return {
      locked: false,
      remainingSeconds: 0,
      attempts: 0,
      maxAttempts,
    }
  }

  return {
    locked: windowState.attempts >= maxAttempts,
    remainingSeconds: Math.max(1, Math.ceil((Date.parse(windowState.expiresAt) - Date.now()) / 1000)),
    attempts: windowState.attempts,
    maxAttempts,
  }
}

export async function recordFailedAdminLoginAttempt(request: Request, env: CloudflareEnv): Promise<AdminLoginRateLimitState> {
  const existingWindow = await readFailedLoginWindow(request, env)
  const maxAttempts = getAdminLoginMaxAttempts(env)
  const defaultWindowSeconds = getAdminLoginWindowSeconds(env)
  const expiresAt =
    existingWindow && Date.parse(existingWindow.expiresAt) > Date.now()
      ? existingWindow.expiresAt
      : new Date(Date.now() + defaultWindowSeconds * 1000).toISOString()
  const attempts = (existingWindow?.attempts ?? 0) + 1
  const remainingSeconds = Math.max(1, Math.ceil((Date.parse(expiresAt) - Date.now()) / 1000))

  await env.SOULTEST_CACHE.put(
    buildFailedLoginCacheKey(getClientIdentifier(request)),
    JSON.stringify({
      attempts,
      expiresAt,
    } satisfies FailedLoginWindow),
    {
      expirationTtl: remainingSeconds,
    },
  )

  return {
    locked: attempts >= maxAttempts,
    remainingSeconds,
    attempts,
    maxAttempts,
  }
}

export async function clearFailedAdminLoginAttempts(request: Request, env: CloudflareEnv) {
  await env.SOULTEST_CACHE.delete(buildFailedLoginCacheKey(getClientIdentifier(request)))
}

export async function authenticateAdmin(username: string, password: string, accessKey: string, env: CloudflareEnv) {
  const normalizedUsername = username.trim()
  const accessKeyHash = getAdminAccessKeyHash(env)

  if (!normalizedUsername || !password || !accessKey || !accessKeyHash) {
    return undefined
  }

  const [row, accessKeyMatched] = await Promise.all([
    env.SOULTEST_DB.prepare(
      `
        SELECT id, username, password_hash
        FROM admins
        WHERE username = ?1
        LIMIT 1
      `,
    )
      .bind(normalizedUsername)
      .first<AdminRow>(),
    verifyEncodedSecret(accessKey, accessKeyHash),
  ])

  if (!row || !accessKeyMatched) {
    return undefined
  }

  const passwordMatched = await verifyEncodedSecret(password, row.password_hash)

  if (!passwordMatched) {
    return undefined
  }

  return {
    id: row.id,
    username: row.username,
  }
}

export async function issueAdminSession(admin: { id: string; username: string }, env: CloudflareEnv) {
  const issuedAt = new Date().toISOString()
  const expiresAt = new Date(Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000).toISOString()
  const token = `sta_${crypto.randomUUID().replaceAll("-", "")}`

  const session: StoredAdminSession = {
    token,
    adminId: admin.id,
    username: admin.username,
    issuedAt,
    expiresAt,
  }

  await env.SOULTEST_CACHE.put(buildSessionCacheKey(token), JSON.stringify(session), {
    expirationTtl: ADMIN_SESSION_TTL_SECONDS,
  })

  return session
}

export async function getAdminSession(request: Request, env: CloudflareEnv) {
  const token = getCookieToken(request)

  if (!token) {
    return isDevelopmentAdminBypassEnabled(env) ? getDevelopmentAdminSession() : undefined
  }

  const raw = await env.SOULTEST_CACHE.get(buildSessionCacheKey(token))

  if (!raw) {
    return isDevelopmentAdminBypassEnabled(env) ? getDevelopmentAdminSession() : undefined
  }

  try {
    return JSON.parse(raw) as StoredAdminSession
  } catch {
    return isDevelopmentAdminBypassEnabled(env) ? getDevelopmentAdminSession() : undefined
  }
}

export async function destroyAdminSession(request: Request, env: CloudflareEnv) {
  const token = getCookieToken(request)

  if (!token) {
    return
  }

  await env.SOULTEST_CACHE.delete(buildSessionCacheKey(token))
}

export function getAdminSessionCookieHeader(token: string, expiresAt: string, request: Request) {
  return createCookieHeader(token, expiresAt, request)
}

export function getAdminSessionClearCookieHeader(request: Request) {
  return createClearedCookieHeader(request)
}

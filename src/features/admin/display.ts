export const verificationModeLabels = {
  none: "免验证码",
  shared_code: "通用口令",
  unique_code: "一单一码",
} as const

export const scopeModeLabels = {
  product: "整个产品内可访问",
  custom_scope: "仅允许指定题集",
} as const

export function formatAdminDate(value?: string | null) {
  return value ? new Date(value).toLocaleDateString("zh-CN") : "无"
}

export function formatAdminDateTime(value?: string | null) {
  return value ? new Date(value).toLocaleString("zh-CN") : "-"
}

export function isExpiringWithin(value: string | null | undefined, days: number) {
  if (!value) {
    return false
  }

  const expiresAt = new Date(value).getTime()
  const now = Date.now()

  if (Number.isNaN(expiresAt) || expiresAt < now) {
    return false
  }

  return expiresAt - now <= days * 24 * 60 * 60 * 1000
}

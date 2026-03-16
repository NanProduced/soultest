export const ADMIN_PORTAL_BASE = "/private-room"
export const LEGACY_ADMIN_PORTAL_BASE = "/admin"
export const ADMIN_API_BASE = "/api/private-room"

export function buildAdminPortalPath(segment?: string) {
  const normalizedSegment = segment?.replace(/^\/+/, "")
  return normalizedSegment ? `${ADMIN_PORTAL_BASE}/${normalizedSegment}` : ADMIN_PORTAL_BASE
}

export function isAdminPortalPath(pathname: string) {
  return pathname.startsWith(ADMIN_PORTAL_BASE) || pathname.startsWith(LEGACY_ADMIN_PORTAL_BASE)
}
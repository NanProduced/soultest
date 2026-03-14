import { Outlet, useLocation } from "react-router"

import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"

export function PublicLayout() {
  const location = useLocation()
  const immersive = location.pathname.includes("/test")

  return (
    <div className="min-h-screen text-foreground">
      {immersive ? null : <SiteHeader />}
      <main>
        <Outlet />
      </main>
      {immersive ? null : <SiteFooter />}
    </div>
  )
}

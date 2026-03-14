import { Home, Undo2 } from "lucide-react"
import { Link } from "react-router"

import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#f4f0ff_0%,#ffffff_45%,#f8fafc_100%)] px-6">
      <div className="max-w-xl rounded-[32px] border border-black/10 bg-white p-8 text-center shadow-[14px_14px_0px_rgba(15,23,42,0.06)]">
        <p className="text-sm uppercase tracking-[0.32em] text-violet-500">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950">这个页面暂时找不到</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          可能是链接写错了，也可能是这页已经下线。先回首页，或者重新挑一套测试开始。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild className="rounded-full px-5">
            <Link to="/">
              <Home className="size-4" />
              返回首页
            </Link>
          </Button>
          <Button asChild className="rounded-full px-5" variant="outline">
            <Link to="/#catalog">
              <Undo2 className="size-4" />
              查看全部测试
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

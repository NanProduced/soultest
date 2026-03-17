import { ExternalLink, ScanLine } from "lucide-react"

export interface PurchaseQrPlaceholderProps {
  purchaseUrl?: string
  salesChannel?: string
}

export function PurchaseQrPlaceholder({
  purchaseUrl,
  salesChannel,
}: PurchaseQrPlaceholderProps) {
  const channelLabel = salesChannel === "xiaohongshu" ? "小红书店铺" : "购买入口"
  const hasPurchaseLink = Boolean(purchaseUrl && !purchaseUrl.includes("example.com"))

  const cardContent = (
    <div className="flex flex-col items-center text-center">
      <div className="mx-auto flex aspect-square w-[124px] items-center justify-center rounded-[20px] bg-white p-3 shadow-[0_18px_60px_rgba(15,23,42,0.18)] sm:w-[136px]">
        <div className="relative flex h-full w-full items-center justify-center rounded-[16px] border-[5px] border-slate-950 bg-slate-50">
          <div className="absolute left-3 top-3 h-5 w-5 rounded-[4px] border-[4px] border-slate-950" />
          <div className="absolute right-3 top-3 h-5 w-5 rounded-[4px] border-[4px] border-slate-950" />
          <div className="absolute bottom-3 left-3 h-5 w-5 rounded-[4px] border-[4px] border-slate-950" />
          <div className="absolute bottom-4 right-4 h-3.5 w-3.5 rounded-[4px] bg-slate-950" />

          <div className="flex flex-col items-center justify-center gap-1 text-slate-950">
            <ScanLine className="size-6" />
            <span className="text-xs font-semibold tracking-[0.22em]">灵测</span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm font-medium text-white">{channelLabel}二维码</p>
      <p className="mt-1 max-w-[180px] text-[12px] leading-5 text-white/58">
        {hasPurchaseLink ? "扫码或点击即可跳转购买" : "预留展示区域，后续可替换为真实店铺二维码"}
      </p>
    </div>
  )

  if (!hasPurchaseLink || !purchaseUrl) {
    return (
      <div className="w-full max-w-[220px] rounded-[22px] border border-dashed border-white/14 bg-white/6 p-4 backdrop-blur-md sm:ml-auto">
        {cardContent}
      </div>
    )
  }

  return (
    <a
      className="group block w-full max-w-[220px] rounded-[22px] border border-dashed border-white/14 bg-white/6 p-4 backdrop-blur-md transition hover:border-fuchsia-300/35 hover:bg-white/8 sm:ml-auto"
      href={purchaseUrl}
      rel="noreferrer"
      target="_blank"
    >
      {cardContent}
      <div className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[14px] border border-white/10 bg-white/8 px-3 py-2 text-sm text-white transition group-hover:bg-white/10">
        去{channelLabel}购买
        <ExternalLink className="size-4" />
      </div>
    </a>
  )
}

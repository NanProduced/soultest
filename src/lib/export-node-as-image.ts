import { getFontEmbedCSS, toBlob } from "html-to-image"

interface ExportNodeAsPngOptions {
  filename: string
  backgroundColor?: string
  width?: number
  height?: number
  canvasWidth?: number
  canvasHeight?: number
  pixelRatio?: number
  style?: Partial<CSSStyleDeclaration>
  filter?: (domNode: HTMLElement) => boolean
  skipFonts?: boolean
}

function triggerDownload(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement("a")

  anchor.href = objectUrl
  anchor.download = filename
  anchor.rel = "noopener"
  anchor.style.display = "none"

  document.body.append(anchor)
  anchor.click()
  anchor.remove()

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl)
  }, 1000)
}

export async function exportNodeAsPng(node: HTMLElement, options: ExportNodeAsPngOptions) {
  const { filename, skipFonts, ...rest } = options
  const fontEmbedCSS = skipFonts ? undefined : await getFontEmbedCSS(node)
  const blob = await toBlob(node, {
    cacheBust: true,
    pixelRatio: 1,
    ...rest,
    ...(fontEmbedCSS ? { fontEmbedCSS } : {}),
  })

  if (!blob) {
    throw new Error("图片生成失败，请稍后再试")
  }

  triggerDownload(blob, filename)
}

export async function exportNodeAsImage(node: HTMLElement, filename: string) {
  return exportNodeAsPng(node, { filename })
}

import { useEffect, useRef, useState } from 'react'
import * as pdfjs from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

/** Draws every page of a PDF as a canvas, stacked vertically, so the whole document scrolls on phones. */
export default function PdfPagesViewer({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    const container = containerRef.current
    let cancelled = false
    let doc: pdfjs.PDFDocumentProxy | null = null

    async function render() {
      if (!container) return
      try {
        const loaded = await pdfjs.getDocument(url).promise
        if (cancelled) {
          loaded.destroy()
          return
        }
        doc = loaded
        const width = container.clientWidth || 800
        const ratio = Math.min(window.devicePixelRatio || 1, 2)
        for (let n = 1; n <= loaded.numPages; n++) {
          const page = await loaded.getPage(n)
          if (cancelled) return
          const base = page.getViewport({ scale: 1 })
          const viewport = page.getViewport({ scale: (width / base.width) * ratio })
          const canvas = document.createElement('canvas')
          canvas.width = Math.floor(viewport.width)
          canvas.height = Math.floor(viewport.height)
          canvas.style.width = '100%'
          canvas.style.height = 'auto'
          canvas.style.display = 'block'
          canvas.style.marginBottom = '12px'
          container.appendChild(canvas)
          const context = canvas.getContext('2d')
          if (context) await page.render({ canvasContext: context, viewport }).promise
        }
        if (!cancelled) setStatus('ready')
      } catch {
        if (!cancelled) setStatus('error')
      }
    }

    render()
    return () => {
      cancelled = true
      doc?.destroy()
      container?.replaceChildren()
    }
  }, [url])

  return (
    <div className="rounded-[10px] border border-[#D8EDFF] bg-[#F3F3F3] p-[8px]">
      {status === 'loading' && <p className="p-[12px] text-[13px] text-[#646464]">Loading PDF…</p>}
      {status === 'error' && (
        <p className="p-[12px] text-[13px] text-[#DC2626]">Could not show this PDF. Use Download to save it.</p>
      )}
      <div ref={containerRef} />
    </div>
  )
}

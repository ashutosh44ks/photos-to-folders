import { useEffect, useState, type FC } from 'react'

type SettingsHintOverlayProps = {
  hintKey: number
  imageName?: string
}

type HintColors = {
  fill: string
  border: string
}

const ON_DARK: HintColors = { fill: '#fff', border: '#404040a6' }
const ON_LIGHT: HintColors = { fill: '#404040', border: '#fffa6' }

function luminance(r: number, g: number, b: number) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Sample left-side pixels; white+dark-grey on dark bg, dark-grey+white on light. */
function useHintColors(imageName: string | undefined, hintKey: number): HintColors {
  const [colors, setColors] = useState<HintColors>(ON_DARK)

  useEffect(() => {
    if (!imageName) {
      setColors(ON_DARK)
      return
    }

    let cancelled = false
    const img = new Image()
    img.src = `/api/images/${encodeURIComponent(imageName)}`

    img.onload = () => {
      if (cancelled) return

      const canvas = document.createElement('canvas')
      const w = Math.min(img.naturalWidth, 160)
      const h = Math.min(img.naturalHeight, 240)
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return

      ctx.drawImage(img, 0, 0, w, h)
      const samples: Array<[number, number]> = [
        [0.12, 0.15],
        [0.1, 0.35],
        [0.08, 0.55],
        [0.15, 0.75],
      ]

      let total = 0
      for (const [nx, ny] of samples) {
        const x = Math.min(w - 1, Math.floor(nx * w))
        const y = Math.min(h - 1, Math.floor(ny * h))
        const [r, g, b] = ctx.getImageData(x, y, 1, 1).data
        total += luminance(r, g, b)
      }

      setColors(total / samples.length < 140 ? ON_DARK : ON_LIGHT)
    }

    img.onerror = () => {
      if (!cancelled) setColors(ON_DARK)
    }

    return () => {
      cancelled = true
    }
  }, [imageName, hintKey])

  return colors
}

const SettingsHintOverlay: FC<SettingsHintOverlayProps> = ({ hintKey, imageName }) => {
  const { fill, border } = useHintColors(imageName, hintKey)
  const path = 'M 150 420 C 90 280, 55 140, 48 56'

  return (
    <>
      <div
        key={`spotlight-${hintKey}`}
        aria-hidden
        className="hint-spotlight pointer-events-none absolute inset-0 z-50"
        style={{
          background:
            'radial-gradient(circle 56px at 40px 40px, transparent 0%, transparent 55%, rgb(0 0 0 / 0.35) 100%)',
        }}
      />
      <svg
        key={`arrow-${hintKey}`}
        aria-hidden
        className="hint-arrow pointer-events-none absolute inset-0 z-25 h-full w-full"
      >
        <defs>
          <marker
            id={`hint-arrowhead-${hintKey}`}
            markerWidth="7"
            markerHeight="7"
            refX="5.5"
            refY="3.5"
            orient="auto"
          >
            <path
              d="M0.4,0.4 L6.6,3.5 L0.4,6.6 Z"
              fill={fill}
              stroke={border}
              strokeWidth="0.25"
            />
          </marker>
        </defs>
        <path
          d={path}
          fill="none"
          stroke={border}
          strokeWidth="3.5"
          strokeDasharray="7 5"
          strokeLinecap="round"
        />
        <path
          d={path}
          fill="none"
          stroke={fill}
          strokeWidth="2.5"
          strokeDasharray="7 5"
          strokeLinecap="round"
          markerEnd={`url(#hint-arrowhead-${hintKey})`}
        />
      </svg>
    </>
  )
}

export default SettingsHintOverlay

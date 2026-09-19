const COLORS = ['#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#ef4444']

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  w: number
  h: number
  color: string
  rotation: number
  rotationSpeed: number
  opacity: number
}

export type ConfettiOptions = {
  /** Animation length in ms. Default 5000. */
  durationMs?: number
  /** Number of pieces. Default 280. */
  particleCount?: number
}

/** Full-screen confetti burst. Self-cleans when done. */
export function fireConfetti({ durationMs = 5000, particleCount = 280 }: ConfettiOptions = {}) {
  const canvas = document.createElement('canvas')
  canvas.style.cssText =
    'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999'
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    canvas.remove()
    return
  }

  const particles: Particle[] = Array.from({ length: particleCount }, () => {
    const angle = Math.random() * Math.PI * 2
    const speed = 4 + Math.random() * 7
    return {
      x: canvas.width / 2,
      y: canvas.height * 0.35,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 5,
      w: 6 + Math.random() * 8,
      h: 8 + Math.random() * 10,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      opacity: 1,
    }
  })

  const start = performance.now()
  const duration = durationMs

  const frame = (now: number) => {
    const elapsed = now - start
    const t = elapsed / duration
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const p of particles) {
      p.vy += 0.18
      p.vx *= 0.995
      p.x += p.vx
      p.y += p.vy
      p.rotation += p.rotationSpeed
      p.opacity = Math.max(0, 1 - t)

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.globalAlpha = p.opacity
      ctx.fillStyle = p.color
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
      ctx.restore()
    }

    if (elapsed < duration) {
      requestAnimationFrame(frame)
    } else {
      canvas.remove()
    }
  }

  requestAnimationFrame(frame)
}

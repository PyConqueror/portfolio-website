'use client'

import { useEffect, useId, useImperativeHandle, useRef, useSyncExternalStore } from 'react'
import type { HTMLAttributes, Ref } from 'react'
import { cn } from '@/utilities/ui'

const BEZEL_WIDTH = 20
const REFRACTION_SCALE = 32
const REFRACTIVE_INDEX = 1.5
const PROFILE_SAMPLES = 128
const BLUR = 2
const SATURATION = 1.8
// RGBA 128/128/128/255 as one little-endian word: "no displacement".
const NEUTRAL_PIXEL = 0xff808080

const GLASS_CLASS =
  'relative bg-black/45 shadow-[inset_1.5px_1.5px_1px_-1px_rgb(255_255_255/0.6),inset_-1.5px_-1.5px_1px_-1px_rgb(255_255_255/0.35),inset_0_0_0_0.5px_rgb(255_255_255/0.12),inset_0_0_16px_rgb(255_255_255/0.05),0_8px_32px_-4px_rgb(0_0_0/0.45)]'

// Convex squircle rim: height rises from 0 at the edge to 1 where the bezel meets the flat top.
const bezelHeight = (t: number) => Math.pow(1 - Math.pow(1 - t, 4), 1 / 4)

// Sideways shift of a straight-down ray bent by the rim (Snell's law), normalised to 0–1.
const REFRACTION_PROFILE = (() => {
  const step = 1 / PROFILE_SAMPLES
  const shifts = Array.from({ length: PROFILE_SAMPLES }, (_, index) => {
    const t = (index + 0.5) * step
    const slope = (bezelHeight(t + step / 2) - bezelHeight(t - step / 2)) / step
    const incidence = Math.atan(slope)
    const refraction = Math.asin(Math.sin(incidence) / REFRACTIVE_INDEX)
    return bezelHeight(t) * Math.tan(incidence - refraction)
  })
  const peak = Math.max(...shifts)
  return shifts.map((shift) => shift / peak)
})()

// Only Chromium renders SVG filters inside `backdrop-filter`; other engines get a frosted fallback.
const supportsRefraction = () =>
  Boolean(
    (
      navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }
    ).userAgentData?.brands.some(({ brand }) => brand === 'Chromium'),
  )

const subscribe = () => () => {}

function createDisplacementMap(width: number, height: number, radius: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) return ''

  const image = context.createImageData(width, height)
  new Uint32Array(image.data.buffer).fill(NEUTRAL_PIXEL)
  const bezel = Math.min(BEZEL_WIDTH, width / 2, height / 2)
  const edge = Math.ceil(Math.max(bezel, radius))
  const halfWidth = width / 2
  const halfHeight = height / 2

  for (let y = 0; y < height; y++) {
    const fullRow = y < edge || y >= height - edge || width <= edge * 2
    for (let x = 0; x < width; x++) {
      if (!fullRow && x === edge) x = width - edge
      const px = x + 0.5 - halfWidth
      const py = y + 0.5 - halfHeight
      const qx = Math.abs(px) - halfWidth + radius
      const qy = Math.abs(py) - halfHeight + radius

      let distance = radius - qy
      let normalX = 0
      let normalY = 1
      if (qx > 0 && qy > 0) {
        const length = Math.hypot(qx, qy)
        distance = radius - length
        normalX = qx / length
        normalY = qy / length
      } else if (qx > qy) {
        distance = radius - qx
        normalX = 1
        normalY = 0
      }

      const shift =
        distance >= 0 && distance < bezel
          ? (REFRACTION_PROFILE[Math.floor((distance / bezel) * PROFILE_SAMPLES)] ?? 0)
          : 0
      const index = (y * width + x) * 4
      image.data[index] = 128 - Math.sign(px) * normalX * shift * 127
      image.data[index + 1] = 128 - Math.sign(py) * normalY * shift * 127
    }
  }

  context.putImageData(image, 0, 0)
  return canvas.toDataURL()
}

export function LiquidGlass({
  blur = BLUR,
  className,
  style,
  children,
  ref,
  ...props
}: { blur?: number; ref?: Ref<HTMLDivElement> } & HTMLAttributes<HTMLDivElement>) {
  const filterId = `liquid-glass-${useId().replace(/[^\w-]/g, '')}`
  const surfaceRef = useRef<HTMLDivElement>(null)
  const leftMapRef = useRef<SVGFEImageElement>(null)
  const rightMapRef = useRef<SVGFEImageElement>(null)
  const refracts = useSyncExternalStore(subscribe, supportsRefraction, () => false)

  useImperativeHandle(ref, () => surfaceRef.current as HTMLDivElement)

  useEffect(() => {
    const surface = surfaceRef.current
    const leftMap = leftMapRef.current
    const rightMap = rightMapRef.current
    if (!refracts || !surface || !leftMap || !rightMap) return

    // Each half of the map is pinned to its own edge, so width changes only move the halves.
    // Once the width grows, the map is redrawn at double width so later growth needs no redraw.
    let drawn = ''
    let capacity = 0
    const observer = new ResizeObserver(() => {
      const { offsetWidth: width, offsetHeight: height } = surface
      if (!width || !height) return
      const radius = Math.min(
        parseFloat(getComputedStyle(surface).borderTopLeftRadius) || 0,
        width / 2,
        height / 2,
      )
      const key = `${height}:${radius}`
      if (key !== drawn || width > capacity) {
        capacity = key === drawn ? width * 2 : width
        drawn = key
        const map = createDisplacementMap(capacity, height, radius)
        leftMap.setAttribute('href', map)
        rightMap.setAttribute('href', map)
      }
      const half = String(width / 2)
      leftMap.setAttribute('width', half)
      leftMap.setAttribute('height', String(height))
      rightMap.setAttribute('x', half)
      rightMap.setAttribute('width', half)
      rightMap.setAttribute('height', String(height))
    })
    observer.observe(surface)
    return () => observer.disconnect()
  }, [refracts])

  return (
    <div
      {...props}
      ref={surfaceRef}
      style={refracts ? { ...style, backdropFilter: `url(#${filterId})` } : style}
      className={cn(
        GLASS_CLASS,
        !refracts && 'backdrop-blur-md backdrop-saturate-[1.8]',
        className,
      )}
    >
      {refracts && (
        <svg aria-hidden className="pointer-events-none absolute h-0 w-0">
          <filter
            id={filterId}
            x="0"
            y="0"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blurred" />
            <feFlood floodColor="rgb(128, 128, 128)" result="neutral" />
            <feImage
              ref={leftMapRef}
              x="0"
              y="0"
              preserveAspectRatio="xMinYMid slice"
              result="leftMap"
            />
            <feImage
              ref={rightMapRef}
              y="0"
              preserveAspectRatio="xMaxYMid slice"
              result="rightMap"
            />
            <feMerge result="displacement">
              <feMergeNode in="neutral" />
              <feMergeNode in="leftMap" />
              <feMergeNode in="rightMap" />
            </feMerge>
            <feDisplacementMap
              in="blurred"
              in2="displacement"
              scale={REFRACTION_SCALE}
              xChannelSelector="R"
              yChannelSelector="G"
              result="refracted"
            />
            <feColorMatrix in="refracted" type="saturate" values={String(SATURATION)} />
          </filter>
        </svg>
      )}
      {children}
    </div>
  )
}

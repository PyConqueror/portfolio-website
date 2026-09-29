'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent, PointerEvent } from 'react'
import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { cn } from '@/lib/utils'
import { RollingText } from './motion'

type NavLink = { label: string; href: string; section: string; icon: LucideIcon }
type Slot = { x: number; width: number }

const VARIANTS = {
  bar: {
    lensPadding: 14,
    track: '',
    row: 'flex items-center gap-8 py-1',
    item: 'relative py-1 text-sm transition-colors',
  },
  tabs: {
    lensPadding: 0,
    track: 'w-full',
    row: 'grid auto-cols-fr grid-flow-col',
    item: 'flex flex-col items-center gap-1 py-2 text-[10px] font-medium leading-3 tracking-wider transition-colors',
  },
}
// The labels row bleeds past the track so hover underlines and focus rings sit inside its mask.
const ROW_BLEED = 8
const DRAG_THRESHOLD = 4
const RUBBER_BAND = 0.25
const LIFT_SCALE = 0.12
const MAGNIFICATION = 1.18
const MAX_STRETCH = 0.28
const STRETCH_SPEED = 1600
const SLIDE_SPRING = { stiffness: 380, damping: 24, mass: 0.9, restDelta: 0.5, restSpeed: 20 }
const LIFT_SPRING = { stiffness: 320, damping: 24 }
const STRETCH_SPRING = { stiffness: 260, damping: 14 }
const PRESENCE_SPRING = { stiffness: 300, damping: 30 }

const REST_FILL = 'rgba(255, 255, 255, 0.12)'
const LIFTED_FILL = 'rgba(255, 255, 255, 0.05)'
const REST_SHADOW =
  'inset 1px 1px 0.5px -0.5px rgba(255, 255, 255, 0.35), inset -1px -1px 0.5px -0.5px rgba(255, 255, 255, 0.15), inset 0px 0px 6px 0px rgba(255, 255, 255, 0.04), 0px 2px 6px -2px rgba(0, 0, 0, 0.2)'
const LIFTED_SHADOW =
  'inset 1.5px 1.5px 1px -1px rgba(255, 255, 255, 0.85), inset -1.5px -1.5px 1px -1px rgba(255, 255, 255, 0.5), inset 0px 0px 10px 0px rgba(255, 255, 255, 0.18), 0px 8px 22px -6px rgba(0, 0, 0, 0.55)'

const centerOf = (slot: Slot) => slot.x + slot.width / 2

export function NavSlider({
  links,
  activeSection,
  onSelect,
  variant = 'bar',
}: {
  links: NavLink[]
  activeSection: string | null
  onSelect: (section: string) => void
  variant?: keyof typeof VARIANTS
}) {
  const styles = VARIANTS[variant]
  const reduceMotion = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const dragRef = useRef<{ pointerId: number; startX: number; active: boolean } | null>(null)
  const suppressClickRef = useRef(false)
  const previousIndexRef = useRef(-1)
  const [slots, setSlots] = useState<Slot[]>([])
  const [trackWidth, setTrackWidth] = useState(0)
  const activeIndex = links.findIndex((link) => link.section === activeSection)

  const x = useSpring(0, SLIDE_SPRING)
  const width = useSpring(0, SLIDE_SPRING)
  const lift = useSpring(0, LIFT_SPRING)
  const presence = useSpring(0, PRESENCE_SPRING)
  const speed = useVelocity(x)
  const stretchTarget = useTransform(
    speed,
    [-STRETCH_SPEED, 0, STRETCH_SPEED],
    [MAX_STRETCH, 0, MAX_STRETCH],
  )
  const stretch = useSpring(stretchTarget, STRETCH_SPRING)

  const size = useTransform(() => (0.8 + 0.2 * presence.get()) * (1 + LIFT_SCALE * lift.get()))
  const scaleX = useTransform(() => size.get() * (1 + stretch.get()))
  const scaleY = useTransform(() => size.get() * (1 - stretch.get() / 2))
  const magnification = useTransform(lift, [0, 1], [1, MAGNIFICATION])
  const contentX = useTransform(
    () => width.get() / 2 - magnification.get() * (x.get() + width.get() / 2),
  )
  const fill = useTransform(lift, [0, 1], [REST_FILL, LIFTED_FILL])
  const shadow = useTransform(lift, [0, 1], [REST_SHADOW, LIFTED_SHADOW])

  // The real labels are masked out under the lens, where its magnified copy takes their place.
  const holeStart = useTransform(() => ROW_BLEED + x.get() + (width.get() * (1 - scaleX.get())) / 2)
  const holeEnd = useTransform(() => ROW_BLEED + x.get() + (width.get() * (1 + scaleX.get())) / 2)
  const holeAlpha = useTransform(presence, (value) => 1 - value)
  const labelsMask = useMotionTemplate`linear-gradient(to right, #000 ${holeStart}px, rgb(0 0 0 / ${holeAlpha}) ${holeStart}px, rgb(0 0 0 / ${holeAlpha}) ${holeEnd}px, #000 ${holeEnd}px)`

  const moveLens = useCallback(
    (slot: Slot, immediate = false) => {
      if (immediate || reduceMotion) {
        x.jump(slot.x)
        width.jump(slot.width)
      } else {
        x.set(slot.x)
        width.set(slot.width)
      }
    },
    [reduceMotion, x, width],
  )

  const glideTo = useCallback(
    (slot: Slot) => {
      lift.set(Math.abs(x.get() - slot.x) > 0.5 && !reduceMotion ? 1 : 0)
      moveLens(slot)
    },
    [lift, moveLens, reduceMotion, x],
  )

  useMotionValueEvent(x, 'animationComplete', () => {
    if (!dragRef.current?.active) lift.set(0)
  })

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const { lensPadding } = styles
    const observer = new ResizeObserver(() => {
      setTrackWidth(track.offsetWidth)
      setSlots(
        linkRefs.current.map((link) => ({
          x: (link?.offsetLeft ?? 0) - lensPadding,
          width: (link?.offsetWidth ?? 0) + lensPadding * 2,
        })),
      )
    })
    observer.observe(track)
    return () => observer.disconnect()
  }, [styles])

  useEffect(() => {
    const moved = previousIndexRef.current !== activeIndex
    previousIndexRef.current = activeIndex
    if (dragRef.current?.active) return
    const slot = slots[activeIndex]
    if (!slot) {
      presence.set(0)
      return
    }
    if (moved && presence.get() > 0.05) glideTo(slot)
    else moveLens(slot, true)
    presence.set(1)
  }, [activeIndex, slots, glideTo, moveLens, presence])

  const followPointer = (clientX: number, immediate = false) => {
    const track = trackRef.current
    const first = slots[0]
    const last = slots.at(-1)
    if (!track || !first || !last) return

    const low = centerOf(first)
    const high = centerOf(last)
    let center = clientX - track.getBoundingClientRect().left
    if (center < low) center = low - (low - center) * RUBBER_BAND
    else if (center > high) center = high + (center - high) * RUBBER_BAND

    const nextIndex = slots.findIndex((slot) => centerOf(slot) >= center)
    const after = slots[nextIndex] ?? last
    const before = slots[nextIndex - 1] ?? after
    const progress =
      after === before ? 0 : (center - centerOf(before)) / (centerOf(after) - centerOf(before))
    const lensWidth = before.width + (after.width - before.width) * progress
    moveLens({ x: center - lensWidth / 2, width: lensWidth }, immediate)
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, active: false }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    if (!drag.active) {
      if (event.pointerType === 'mouse' && event.buttons === 0) {
        dragRef.current = null
        return
      }
      if (Math.abs(event.clientX - drag.startX) < DRAG_THRESHOLD) return
      drag.active = true
      event.currentTarget.setPointerCapture(event.pointerId)
      if (!reduceMotion) lift.set(1)
      followPointer(event.clientX, presence.get() < 0.05)
      presence.set(1)
      return
    }
    followPointer(event.clientX)
  }

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    dragRef.current = null
    if (!drag.active) return

    const center = x.get() + width.get() / 2
    const distances = slots.map((slot) => Math.abs(centerOf(slot) - center))
    const index =
      event.type === 'pointerup' ? distances.indexOf(Math.min(...distances)) : activeIndex
    const slot = slots[index]
    if (slot) {
      glideTo(slot)
    } else {
      lift.set(0)
      presence.set(0)
    }

    // Swallow the click the browser fires at the end of a drag, then select through the real link.
    suppressClickRef.current = true
    setTimeout(() => {
      suppressClickRef.current = false
      if (index !== activeIndex) linkRefs.current[index]?.click()
    })
  }

  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return
    event.preventDefault()
    event.stopPropagation()
  }

  const renderLabel = (link: NavLink) =>
    variant === 'bar' ? (
      <RollingText text={link.label} />
    ) : (
      <>
        <link.icon className="h-5 w-5" />
        <span>{link.label}</span>
      </>
    )

  return (
    <div
      ref={trackRef}
      className={cn('relative touch-pan-y select-none', styles.track)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onClickCapture={handleClickCapture}
    >
      <motion.div style={{ maskImage: labelsMask }} className={cn('-mx-2 px-2', styles.row)}>
        {links.map((link, index) => (
          <Link
            key={link.href}
            ref={(node) => {
              linkRefs.current[index] = node
            }}
            href={link.href}
            draggable={false}
            onClick={() => onSelect(link.section)}
            className={cn(
              styles.item,
              variant === 'bar' && [
                'group hover:text-ultra-orange',
                'after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-white/40 after:transition-transform after:duration-300 hover:after:scale-x-100',
              ],
              index === activeIndex && 'text-ultra-orange',
            )}
          >
            {renderLabel(link)}
          </Link>
        ))}
      </motion.div>

      <motion.div
        aria-hidden
        style={{
          x,
          width,
          scaleX,
          scaleY,
          opacity: presence,
          backgroundColor: fill,
          boxShadow: shadow,
        }}
        className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden rounded-full"
      >
        <motion.div
          style={{ x: contentX, scale: magnification, originX: 0, width: trackWidth }}
          className={cn('absolute inset-y-0 left-0', styles.row)}
        >
          {links.map((link, index) => (
            <span
              key={link.href}
              className={cn(styles.item, index === activeIndex && 'text-ultra-orange')}
            >
              {renderLabel(link)}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

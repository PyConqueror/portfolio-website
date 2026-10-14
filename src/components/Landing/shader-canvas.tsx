'use client'

import { useEffect, useRef } from 'react'
import type { MotionValue } from 'motion/react'
import { cn } from '@/lib/utils'

const MAX_PIXEL_RATIO = 2
const RESOLUTION_SCALE = 0.5
const MOUSE_EASING = 0.035
// Caps the time step so the scene resumes where it paused instead of jumping ahead.
const MAX_FRAME_MS = 50

const VERTEX_SHADER = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

export const GLSL_PALETTE = `
const vec3 SAGE = vec3(0.627, 0.878, 0.671);
const vec3 AMBER = vec3(1.0, 0.675, 0.180);
const vec3 OXBLOOD = vec3(0.647, 0.176, 0.145);
`

export const GLSL_NOISE = `
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rotation = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = rotation * p * 2.02;
    amplitude *= 0.5;
  }
  return value;
}
`

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null
}

// Full-screen fragment shader fed with u_resolution, u_time, u_mouse, u_hover (eases to 1 while the
// mouse is over the canvas) and one float uniform per entry in `uniforms`. Pass a memoized `uniforms` object: a new one rebuilds the WebGL context.
export function ShaderCanvas({
  fragmentShader,
  uniforms,
  fallback = '#000000',
  className,
}: {
  fragmentShader: string
  uniforms?: Record<string, MotionValue<number>>
  fallback?: string
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    // A fresh canvas per run: a context released by a previous cleanup cannot be reused.
    const canvas = document.createElement('canvas')
    canvas.className = 'absolute inset-0 h-full w-full'
    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'low-power',
    })
    if (!gl) return
    gl.getExtension('OES_standard_derivatives')

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER)
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader)
    const program = gl.createProgram()
    if (!vertexShader || !fragment || !program) return
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)
    container.appendChild(canvas)

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
    const timeLocation = gl.getUniformLocation(program, 'u_time')
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse')
    const hoverLocation = gl.getUniformLocation(program, 'u_hover')
    const extraUniforms = Object.entries(uniforms ?? {}).map(([name, value]) => ({
      location: gl.getUniformLocation(program, name),
      value,
    }))

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mouse = { x: 0.5, y: 0.5, hover: 0 }
    const target = { x: 0.5, y: 0.5, hover: 0 }
    let elapsed = 0
    let last = 0
    let frame = 0
    let visible = true

    const draw = () => {
      mouse.x += (target.x - mouse.x) * MOUSE_EASING
      mouse.y += (target.y - mouse.y) * MOUSE_EASING
      mouse.hover += (target.hover - mouse.hover) * MOUSE_EASING
      gl.uniform1f(timeLocation, elapsed / 1000)
      gl.uniform2f(mouseLocation, mouse.x, mouse.y)
      gl.uniform1f(hoverLocation, mouse.hover)
      extraUniforms.forEach(({ location, value }) => gl.uniform1f(location, value.get()))
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const loop = (now: number) => {
      elapsed += Math.min(now - (last || now), MAX_FRAME_MS)
      last = now
      draw()
      frame = requestAnimationFrame(loop)
    }

    const play = () => {
      if (frame || reduceMotion || !visible || document.hidden) return
      last = 0
      frame = requestAnimationFrame(loop)
    }

    const pause = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }

    const redrawIfIdle = () => {
      if (!frame) draw()
    }

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO) * RESOLUTION_SCALE
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale))
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale))
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
      redrawIfIdle()
    }

    const handlePointerMove = (event: globalThis.PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const rect = canvas.getBoundingClientRect()
      target.x = (event.clientX - rect.left) / rect.width
      target.y = 1 - (event.clientY - rect.top) / rect.height
      target.hover = target.x >= 0 && target.x <= 1 && target.y >= 0 && target.y <= 1 ? 1 : 0
    }

    const handlePointerOut = (event: globalThis.PointerEvent) => {
      if (!event.relatedTarget) target.hover = 0
    }

    const handleVisibilityChange = () => (document.hidden ? pause() : play())

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting)
      if (visible) play()
      else pause()
    })
    intersectionObserver.observe(canvas)
    window.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerout', handlePointerOut)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    const unsubscribers = extraUniforms.map(({ value }) => value.on('change', redrawIfIdle))

    return () => {
      pause()
      unsubscribers.forEach((unsubscribe) => unsubscribe())
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      window.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerout', handlePointerOut)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      canvas.remove()
    }
  }, [fragmentShader, uniforms])

  return (
    <div
      ref={containerRef}
      className={cn('overflow-hidden', className)}
      style={{ background: fallback }}
    />
  )
}

'use client'

import { useMemo, useRef } from 'react'
import type { ReactNode } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { cn } from '@/lib/utils'
import { GLSL_NOISE, GLSL_PALETTE, ShaderCanvas } from './shader-canvas'

const EASE_EXPO = [0.19, 1, 0.22, 1] as const

const FALLBACK_BACKGROUND = [
  'radial-gradient(ellipse at 25% 35%, rgba(255, 172, 46, 0.22), transparent 55%)',
  'radial-gradient(ellipse at 78% 70%, rgba(165, 45, 37, 0.32), transparent 60%)',
  'radial-gradient(ellipse at 60% 15%, rgba(160, 224, 171, 0.14), transparent 50%)',
  '#000000',
].join(', ')

// All values are GLSL expressions; `aspect` is in scope. The sphere's centre moves from `from`
// to `to` as u_travel goes 0 → 1, while the liquid outside and inside it dims by the given pairs.
function createLiquidShader({
  from,
  to,
  outerDim,
  lensDim,
}: {
  from: string
  to: string
  outerDim: [string, string]
  lensDim: [string, string]
}) {
  return `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_travel;
uniform float u_fade;

${GLSL_PALETTE}
${GLSL_NOISE}

vec3 liquid(vec2 p, float t) {
  p *= 0.7;
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(
    fbm(p + 2.5 * q + vec2(1.7, 9.2) + 0.6 * t),
    fbm(p + 2.5 * q + vec2(8.3, 2.8) - 0.5 * t)
  );
  float f = fbm(p + 2.5 * r);

  vec3 color = mix(OXBLOOD, AMBER, smoothstep(0.26, 0.44, f));
  color = mix(color, SAGE, smoothstep(0.5, 0.66, r.y) * 0.7);
  color = mix(vec3(dot(color, vec3(0.299, 0.587, 0.114))), color, 0.75);
  float sheen = pow(smoothstep(0.2, 0.46, f), 1.6);
  return color * sheen * 0.8;
}

vec2 sphereCenter(float aspect, float travel) {
  return mix(${from}, ${to}, travel);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  vec2 mouse = (u_mouse - 0.5) * vec2(aspect, 1.0);
  float t = u_time * 0.045;

  vec2 toMouse = mouse - p;
  p += toMouse * 0.14 * exp(-dot(toMouse, toMouse) * 3.0);

  float travel = smoothstep(0.0, 1.0, u_travel);
  vec2 center = sphereCenter(aspect, travel) + mouse * 0.05;
  float radius = 0.68 * clamp(aspect, 0.7, 1.0);
  vec2 offset = p - center;
  float d = length(offset) / radius;
  float inside = 1.0 - smoothstep(0.992, 1.0, d);
  float z = sqrt(max(1.0 - d * d, 0.0));

  // Narrower screens sample the lens as if 16:10, so the sphere shows the same liquid as on a laptop.
  vec2 lensCenter = sphereCenter(max(aspect, 1.6), travel) + mouse * 0.05;
  vec3 outer = liquid(p, t);
  vec3 lens = liquid(lensCenter + offset * mix(1.3, 0.55, z) * (0.68 / radius), t + 3.0);
  lens *= 0.8 + 0.35 * z;
  float rim = smoothstep(0.9, 0.995, d) * inside;
  lens += rim * (0.12 + lens * 0.9);

  vec3 color = mix(
    outer * mix(${outerDim[0]}, ${outerDim[1]}, travel),
    lens * mix(${lensDim[0]}, ${lensDim[1]}, travel),
    inside
  );
  color *= mix(0.35, 1.0, smoothstep(1.0, 0.15, length(uv - 0.5)));
  color *= 1.0 - u_fade;
  color += (hash(gl_FragCoord.xy + fract(u_time)) - 0.5) / 255.0;

  gl_FragColor = vec4(color, 1.0);
}
`
}

const STAGE_SHADER = createLiquidShader({
  from: 'vec2(aspect * 0.3, -0.18)',
  to: 'vec2(-aspect * 0.32, 0.08)',
  outerDim: ['1.0', '0.35'],
  lensDim: ['1.0', '0.8'],
})

const RISE_SHADER = createLiquidShader({
  from: 'vec2(aspect * 0.28, -1.5)',
  to: 'vec2(aspect * 0.28, -0.08)',
  outerDim: ['0.75', '0.75'],
  lensDim: ['1.0', '1.0'],
})

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1)

// Pins the backdrop behind its children: the sphere drifts over the first viewport of scroll,
// and the scene fades to black over the last one so the next section continues seamlessly.
export function LiquidStage({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const travel = useTransform(scrollY, (y) => {
    const stage = stageRef.current
    return stage ? clamp01((y - stage.offsetTop) / window.innerHeight) : 0
  })
  const fade = useTransform(scrollY, (y) => {
    const stage = stageRef.current
    if (!stage) return 0
    const start = stage.offsetTop + stage.offsetHeight - 2 * window.innerHeight
    return clamp01((y - start) / window.innerHeight)
  })
  const uniforms = useMemo(() => ({ u_travel: travel, u_fade: fade }), [travel, fade])

  return (
    <div ref={stageRef} className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="sticky top-0 h-[100lvh] overflow-hidden">
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2.4, ease: EASE_EXPO }}
          >
            <ShaderCanvas
              fragmentShader={STAGE_SHADER}
              uniforms={uniforms}
              fallback={FALLBACK_BACKGROUND}
              className="absolute inset-0"
            />
          </motion.div>
          <div className="bg-grain absolute inset-0 opacity-[0.16] mix-blend-overlay" />
        </div>
      </div>
      {children}
    </div>
  )
}

// The closing bookend: the liquid fades in from black and the sphere rises from below the
// fold as `progress` goes 0 → 1.
export function LiquidRise({
  progress,
  className,
}: {
  progress: MotionValue<number>
  className?: string
}) {
  const fade = useTransform(progress, [0, 0.6], [1, 0])
  const uniforms = useMemo(() => ({ u_travel: progress, u_fade: fade }), [progress, fade])

  return (
    <div aria-hidden className={cn('pointer-events-none', className)}>
      <ShaderCanvas
        fragmentShader={RISE_SHADER}
        uniforms={uniforms}
        fallback={FALLBACK_BACKGROUND}
        className="absolute inset-0"
      />
      <div className="bg-grain absolute inset-0 opacity-[0.16] mix-blend-overlay" />
    </div>
  )
}

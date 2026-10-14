'use client'

import { useMemo } from 'react'
import type { MotionValue } from 'motion/react'
import { GLSL_NOISE, GLSL_PALETTE, ShaderCanvas } from './shader-canvas'

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_hover;
uniform float u_progress;

${GLSL_PALETTE}
${GLSL_NOISE}

const float ROWS = 84.0;
const float ANGLE = 0.26;

void main() {
  float cellPx = u_resolution.y / ROWS;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 uv = gl_FragCoord.xy / u_resolution;
  mat2 rotate = mat2(cos(ANGLE), sin(ANGLE), -sin(ANGLE), cos(ANGLE));
  mat2 unrotate = mat2(cos(ANGLE), -sin(ANGLE), sin(ANGLE), cos(ANGLE));

  vec2 grid = rotate * (gl_FragCoord.xy / cellPx);
  vec2 local = fract(grid) - 0.5;
  vec2 centerUv = unrotate * (floor(grid) + 0.5) * cellPx / u_resolution;

  vec2 p = (centerUv - 0.5) * vec2(aspect, 1.0);
  vec2 mouse = (u_mouse - 0.5) * vec2(aspect, 1.0);
  float t = u_time * 0.05;

  vec2 q = p * 1.1 + vec2(u_progress * 1.2, 0.0);
  float field = fbm(q + vec2(t, -t * 0.6) + fbm(q * 1.7 - t) * 0.8);
  float wave = 0.5 + 0.5 * sin((p.x * 0.8 + p.y) * 7.0 - u_time * 0.6);
  float value = smoothstep(0.26, 0.46, field) * mix(0.35, 1.0, wave);

  float dist = length(p - mouse);
  float lens = exp(-dist * dist * 14.0) * u_hover;
  value = max(value, lens * 0.9);
  value += 0.25 * lens * sin(dist * 40.0 - u_time * 4.0);

  float radius = clamp(value, 0.0, 1.0) * 0.48;
  float aa = 1.2 / cellPx;
  float dotMask = 1.0 - smoothstep(radius - aa, radius + aa, length(local));

  vec3 tint = mix(OXBLOOD, AMBER, smoothstep(0.25, 0.45, field));
  tint = mix(tint, SAGE, smoothstep(0.55, 0.75, fbm(q * 0.6 + 7.3)) * 0.6);

  vec3 color = tint * dotMask * (0.26 + lens * 0.6);
  color *= smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.8, uv.y);
  color *= mix(0.5, 1.0, smoothstep(0.95, 0.3, length(uv - 0.5)));

  gl_FragColor = vec4(color, 1.0);
}
`

// A rotated halftone dot screen whose dots swell with a slow flowing field; dots grow and ripple
// under the cursor, and `progress` drifts the field sideways.
export function HalftoneBackdrop({
  progress,
  className,
}: {
  progress: MotionValue<number>
  className?: string
}) {
  const uniforms = useMemo(() => ({ u_progress: progress }), [progress])
  return <ShaderCanvas fragmentShader={FRAGMENT_SHADER} uniforms={uniforms} className={className} />
}

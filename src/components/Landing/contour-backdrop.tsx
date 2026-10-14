'use client'

import { useMemo } from 'react'
import type { MotionValue } from 'motion/react'
import { GLSL_NOISE, GLSL_PALETTE, ShaderCanvas } from './shader-canvas'

const FRAGMENT_SHADER = `
#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_progress;

${GLSL_PALETTE}
${GLSL_NOISE}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  vec2 mouse = (u_mouse - 0.5) * vec2(aspect, 1.0);
  float t = u_time * 0.03;

  vec2 toMouse = p - mouse;
  float lens = exp(-dot(toMouse, toMouse) * 7.0);
  p -= toMouse * lens * 0.45;

  vec2 q = p * 0.8 + vec2(u_progress * 1.5, 0.0);
  vec2 warp = vec2(fbm(q + vec2(0.0, t)), fbm(q + vec2(5.2, 1.3) - t));
  float field = fbm(q + 1.8 * warp + vec2(t * 0.5, 0.0));

  float bands = field * 34.0;
  float edge = min(fract(bands), 1.0 - fract(bands));
  float width = fwidth(bands);
  float line = 1.0 - smoothstep(0.0, width * 1.2, edge);
  float halo = 1.0 - smoothstep(0.0, width * 7.0, edge);

  vec3 tint = mix(OXBLOOD, AMBER, smoothstep(0.22, 0.42, field));
  tint = mix(tint, SAGE, smoothstep(0.45, 0.65, warp.y) * 0.6);

  vec3 color = tint * (line * 0.4 + halo * 0.08) * (0.55 + lens * 1.2);
  color *= smoothstep(0.0, 0.3, uv.y) * smoothstep(1.0, 0.7, uv.y);
  color *= mix(0.45, 1.0, smoothstep(0.95, 0.25, length(uv - 0.5)));
  color += (hash(gl_FragCoord.xy + fract(u_time)) - 0.5) / 255.0;

  gl_FragColor = vec4(color, 1.0);
}
`

// Contour lines of a slowly flowing field; the cursor bends them like an unseen lens and
// `progress` drifts them sideways.
export function ContourBackdrop({
  progress,
  className,
}: {
  progress: MotionValue<number>
  className?: string
}) {
  const uniforms = useMemo(() => ({ u_progress: progress }), [progress])
  return <ShaderCanvas fragmentShader={FRAGMENT_SHADER} uniforms={uniforms} className={className} />
}

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

vec3 curtain(vec2 p, float seed, float lift, float t) {
  float wave = sin(p.x * (1.0 + seed * 0.4) + t * 0.5 + seed * 2.1) * 0.07;
  wave += sin(p.x * (2.6 + seed * 0.5) - t * 0.4 + seed) * 0.035;
  float drift = (fbm(vec2(p.x * 0.8 + seed * 5.0, t * 0.2 + seed)) - 0.3) * 0.4;
  float h = p.y - (lift + wave + drift);

  float rays = noise(vec2(p.x * 18.0 + seed * 11.0, t * 0.6 + seed));
  rays = 0.25 + 0.75 * rays * rays;
  rays *= 0.5 + 0.5 * noise(vec2(p.x * 3.0 - t * 0.3, seed));
  float body = mix(exp(h * 30.0), exp(-h * 4.5), step(0.0, h));
  float edge = exp(-abs(h) * 45.0) * 0.5;
  float haze = exp(-abs(h) * 9.0) * 0.08;

  vec3 tint = mix(SAGE, AMBER, smoothstep(0.02, 0.16, h));
  tint = mix(tint, OXBLOOD, smoothstep(0.12, 0.35, h));
  float patches = smoothstep(0.12, 0.5, noise(vec2(p.x * 1.1 + seed * 7.0, t * 0.35 + seed)));
  return (tint * (body * rays + haze) + SAGE * edge * rays) * patches;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  vec2 mouse = (u_mouse - 0.5) * vec2(aspect, 1.0);
  float t = u_time * 0.08;

  vec2 toMouse = p - mouse;
  float lens = exp(-dot(toMouse, toMouse) * 6.0) * u_hover;
  p.y += lens * 0.06;
  p.x += u_progress * 1.2;
  float rise = (u_progress - 0.5) * 0.25;

  vec3 color = curtain(p, 0.0, -0.28 + rise, t) * 0.9;
  color += curtain(p * vec2(0.8, 1.0), 1.7, -0.05 + rise, t) * 0.75;
  color += curtain(p * vec2(1.3, 1.0), 3.1, 0.16 + rise, t * 1.2) * 0.6;
  color *= 1.0 + lens * 0.8;

  color *= smoothstep(0.0, 0.15, uv.y) * smoothstep(1.0, 0.85, uv.y);
  color *= mix(0.55, 1.0, smoothstep(0.95, 0.25, length(uv - 0.5)));
  color = 1.0 - exp(-color * 2.2);
  color += (hash(gl_FragCoord.xy + fract(u_time)) - 0.5) / 255.0;

  gl_FragColor = vec4(color, 1.0);
}
`

// Layered aurora curtains: a swaying, rayed lower edge glowing sage that fades up through amber
// into oxblood. The cursor bends and brightens them; `progress` drifts them sideways and up.
export function AuroraBackdrop({
  progress,
  className,
}: {
  progress: MotionValue<number>
  className?: string
}) {
  const uniforms = useMemo(() => ({ u_progress: progress }), [progress])
  return <ShaderCanvas fragmentShader={FRAGMENT_SHADER} uniforms={uniforms} className={className} />
}

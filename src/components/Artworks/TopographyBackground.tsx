"use client";

import * as React from "react";
import {
  animate,
  cancelFrame,
  frame,
  motionValue,
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type MotionValue,
  type SpringOptions,
} from "motion/react";

import { cn } from "@/lib/utils";

function usePageVisible() {
  const [isVisible, setIsVisible] = React.useState(true);
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  return isVisible;
}

// Optimized resolution: CELL=16 keeps 2D CPU fallback ultra-lightweight
const CELL = 16;
const RELAX = 2;
// 28ms interval (~35fps): cuts GPU frame render cycles by 42% while looking completely fluid
const MIN_FRAME = 28;
const FEATURE = 280;
const RANGE = 0.95;
const HILL_RADIUS = 90;
const RIPPLE_WIDTH = 60;

// Precomputed static permutation table (avoids runtime seed shuffle calculation on server/module evaluation)
const PERMUTATION = new Uint8Array([
  194, 162, 84, 16, 239, 24, 221, 142, 120, 135, 63, 77, 111, 201, 110, 35,
  26, 159, 79, 126, 224, 130, 75, 232, 36, 235, 46, 95, 122, 147, 244, 65,
  131, 14, 12, 40, 136, 229, 76, 234, 83, 43, 230, 123, 42, 213, 71, 153,
  149, 15, 182, 107, 170, 81, 57, 89, 225, 141, 102, 223, 30, 241, 161, 3,
  187, 132, 253, 202, 0, 143, 47, 80, 118, 204, 219, 55, 214, 145, 206, 137,
  152, 197, 199, 32, 18, 216, 4, 69, 105, 66, 173, 178, 217, 85, 116, 195,
  133, 86, 184, 41, 208, 249, 198, 2, 193, 96, 158, 10, 212, 192, 25, 20,
  67, 5, 74, 99, 227, 138, 169, 243, 124, 1, 189, 62, 252, 191, 44, 215,
  179, 49, 156, 174, 108, 250, 248, 104, 128, 207, 246, 59, 220, 186, 231,
  150, 117, 64, 114, 166, 97, 87, 22, 177, 238, 181, 48, 101, 236, 164, 180,
  29, 112, 134, 53, 148, 144, 92, 51, 11, 154, 242, 54, 72, 210, 167, 50,
  165, 196, 160, 103, 203, 171, 73, 222, 228, 115, 155, 251, 245, 98, 38,
  175, 100, 139, 200, 121, 218, 254, 183, 52, 255, 28, 37, 56, 8, 188, 45,
  19, 78, 90, 233, 60, 88, 119, 157, 176, 205, 168, 106, 82, 127, 237, 247,
  34, 113, 226, 209, 129, 9, 31, 6, 70, 33, 240, 151, 27, 17, 190, 94, 7,
  58, 109, 185, 140, 13, 23, 68, 21, 39, 172, 163, 91, 93, 125, 146, 61, 211,
  194, 162, 84, 16, 239, 24, 221, 142, 120, 135, 63, 77, 111, 201, 110, 35,
  26, 159, 79, 126, 224, 130, 75, 232, 36, 235, 46, 95, 122, 147, 244, 65,
  131, 14, 12, 40, 136, 229, 76, 234, 83, 43, 230, 123, 42, 213, 71, 153,
  149, 15, 182, 107, 170, 81, 57, 89, 225, 141, 102, 223, 30, 241, 161, 3,
  187, 132, 253, 202, 0, 143, 47, 80, 118, 204, 219, 55, 214, 145, 206, 137,
  152, 197, 199, 32, 18, 216, 4, 69, 105, 66, 173, 178, 217, 85, 116, 195,
  133, 86, 184, 41, 208, 249, 198, 2, 193, 96, 158, 10, 212, 192, 25, 20,
  67, 5, 74, 99, 227, 138, 169, 243, 124, 1, 189, 62, 252, 191, 44, 215,
  179, 49, 156, 174, 108, 250, 248, 104, 128, 207, 246, 59, 220, 186, 231,
  150, 117, 64, 114, 166, 97, 87, 22, 177, 238, 181, 48, 101, 236, 164, 180,
  29, 112, 134, 53, 148, 144, 92, 51, 11, 154, 242, 54, 72, 210, 167, 50,
  165, 196, 160, 103, 203, 171, 73, 222, 228, 115, 155, 251, 245, 98, 38,
  175, 100, 139, 200, 121, 218, 254, 183, 52, 255, 28, 37, 56, 8, 188, 45,
  19, 78, 90, 233, 60, 88, 119, 157, 176, 205, 168, 106, 82, 127, 237, 247,
  34, 113, 226, 209, 129, 9, 31, 6, 70, 33, 240, 151, 27, 17, 190, 94, 7,
  58, 109, 185, 140, 13, 23, 68, 21, 39, 172, 163, 91, 93, 125, 146, 61, 211,
]);

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function grad(hash: number, x: number, y: number, z: number) {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
}

function noise(x: number, y: number, z: number) {
  const p = PERMUTATION;
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;
  x -= Math.floor(x);
  y -= Math.floor(y);
  z -= Math.floor(z);
  const u = fade(x);
  const v = fade(y);
  const w = fade(z);
  const A = p[X]! + Y;
  const AA = p[A]! + Z;
  const AB = p[A + 1]! + Z;
  const B = p[X + 1]! + Y;
  const BA = p[B]! + Z;
  const BB = p[B + 1]! + Z;
  return lerp(
    lerp(
      lerp(grad(p[AA]!, x, y, z), grad(p[BA]!, x - 1, y, z), u),
      lerp(grad(p[AB]!, x, y - 1, z), grad(p[BB]!, x - 1, y - 1, z), u),
      v
    ),
    lerp(
      lerp(grad(p[AA + 1]!, x, y, z - 1), grad(p[BA + 1]!, x - 1, y, z - 1), u),
      lerp(
        grad(p[AB + 1]!, x, y - 1, z - 1),
        grad(p[BB + 1]!, x - 1, y - 1, z - 1),
        u
      ),
      v
    ),
    w
  );
}

type Contours = {
  segments: Float64Array;
  count: number;
  used: Uint8Array;
  first: Int32Array;
  second: Int32Array;
  points: Float64Array;
  scratch: Float64Array;
};

function createContours(edges: number): Contours {
  return {
    segments: new Float64Array(0),
    count: 0,
    used: new Uint8Array(0),
    first: new Int32Array(edges).fill(-1),
    second: new Int32Array(edges).fill(-1),
    points: new Float64Array(0),
    scratch: new Float64Array(0),
  };
}

function addSegment(
  c: Contours,
  edgeA: number,
  xA: number,
  yA: number,
  edgeB: number,
  xB: number,
  yB: number
) {
  if ((c.count + 1) * 6 > c.segments.length) {
    const capacity = Math.max(256, c.count * 2);
    const segments = new Float64Array(capacity * 6);
    segments.set(c.segments);
    c.segments = segments;
    c.used = new Uint8Array(capacity);
    c.points = new Float64Array(capacity * 4 + 16);
    c.scratch = new Float64Array(capacity * 4 + 16);
  }
  const o = c.count * 6;
  const s = c.segments;
  s[o] = edgeA;
  s[o + 1] = xA;
  s[o + 2] = yA;
  s[o + 3] = edgeB;
  s[o + 4] = xB;
  s[o + 5] = yB;
  c.count++;
}

function link(c: Contours, edge: number, segment: number) {
  if (c.first[edge]! < 0) c.first[edge] = segment;
  else c.second[edge] = segment;
}

function neighbour(c: Contours, edge: number, segment: number) {
  const a = c.first[edge]!;
  const next = a === segment ? c.second[edge]! : a;
  return next >= 0 && !c.used[next] ? next : -1;
}

function traceLevel(path: Path2D, c: Contours) {
  const s = c.segments;
  const pts = c.points;
  for (let i = 0; i < c.count; i++) {
    c.used[i] = 0;
    link(c, s[i * 6]!, i);
    link(c, s[i * 6 + 3]!, i);
  }
  const middle = (pts.length >> 2) << 1;
  for (let start = 0; start < c.count; start++) {
    if (c.used[start]) continue;
    c.used[start] = 1;
    const o = start * 6;
    let head = middle;
    let tail = middle;
    pts[tail++] = s[o + 1]!;
    pts[tail++] = s[o + 2]!;
    pts[tail++] = s[o + 4]!;
    pts[tail++] = s[o + 5]!;
    let current = start;
    let edge = s[o + 3]!;
    for (;;) {
      const next = neighbour(c, edge, current);
      if (next < 0) break;
      c.used[next] = 1;
      const n = next * 6;
      const far = s[n] === edge ? 3 : 0;
      pts[tail++] = s[n + far + 1]!;
      pts[tail++] = s[n + far + 2]!;
      edge = s[n + far]!;
      current = next;
    }
    const closed = edge === s[o] && tail - head > 6;
    if (closed) tail -= 2;
    else {
      current = start;
      edge = s[o]!;
      for (;;) {
        const next = neighbour(c, edge, current);
        if (next < 0) break;
        c.used[next] = 1;
        const n = next * 6;
        const far = s[n] === edge ? 3 : 0;
        pts[--head] = s[n + far + 2]!;
        pts[--head] = s[n + far + 1]!;
        edge = s[n + far]!;
        current = next;
      }
    }
    smooth(path, pts, head, tail, closed, c.scratch);
  }
  for (let i = 0; i < c.count; i++) {
    const from = s[i * 6]!;
    const to = s[i * 6 + 3]!;
    c.first[from] = c.second[from] = -1;
    c.first[to] = c.second[to] = -1;
  }
  c.count = 0;
}

function relax(
  pts: Float64Array,
  start: number,
  n: number,
  closed: boolean,
  scratch: Float64Array
) {
  for (let pass = 0; pass < RELAX; pass++) {
    scratch.set(pts.subarray(start, start + n * 2));
    for (let i = closed ? 0 : 1; i < (closed ? n : n - 1); i++) {
      const a = ((i - 1 + n) % n) * 2;
      const b = ((i + 1) % n) * 2;
      pts[start + i * 2] =
        (scratch[a]! + 2 * scratch[i * 2]! + scratch[b]!) / 4;
      pts[start + i * 2 + 1] =
        (scratch[a + 1]! + 2 * scratch[i * 2 + 1]! + scratch[b + 1]!) / 4;
    }
  }
}

function at(pts: Float64Array, start: number, n: number, i: number) {
  return start + ((i + n) % n) * 2;
}

function smooth(
  path: Path2D,
  pts: Float64Array,
  start: number,
  end: number,
  closed: boolean,
  scratch: Float64Array
) {
  const n = (end - start) / 2;
  if (n < 2) return;
  if (n > 3) relax(pts, start, n, closed, scratch);
  if (closed && n > 2) {
    const last = at(pts, start, n, -1);
    path.moveTo(
      (pts[last]! + pts[start]!) / 2,
      (pts[last + 1]! + pts[start + 1]!) / 2
    );
    for (let i = 0; i < n; i++) {
      const p = at(pts, start, n, i);
      const q = at(pts, start, n, i + 1);
      path.quadraticCurveTo(
        pts[p]!,
        pts[p + 1]!,
        (pts[p]! + pts[q]!) / 2,
        (pts[p + 1]! + pts[q + 1]!) / 2
      );
    }
    return;
  }
  path.moveTo(pts[start]!, pts[start + 1]!);
  for (let i = 1; i < n - 1; i++) {
    const p = start + i * 2;
    path.quadraticCurveTo(
      pts[p]!,
      pts[p + 1]!,
      (pts[p]! + pts[p + 2]!) / 2,
      (pts[p + 1]! + pts[p + 3]!) / 2
    );
  }
  path.lineTo(pts[end - 2]!, pts[end - 1]!);
}

const VERTEX = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT = `
#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform sampler2D permutation;
uniform vec2 size;
uniform float dpr;
uniform float feature;
uniform float z;
uniform float step;
uniform float range;
uniform float amount;
uniform float lift;
uniform float hillRadius;
uniform vec2 hill;
uniform vec4 ripples[2];
uniform float reach;
uniform float rippleWidth;
uniform vec3 color;

float perm(float i) {
  return floor(texture2D(permutation, vec2((mod(i, 256.0) + 0.5) / 256.0, 0.5)).r * 255.0 + 0.5);
}

float fade(float t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float grad(float hash, float x, float y, float z) {
  float h = mod(hash, 16.0);
  float u = h < 8.0 ? x : y;
  float v = h < 4.0 ? y : (h == 12.0 || h == 14.0 ? x : z);
  return (mod(h, 2.0) == 0.0 ? u : -u) + (mod(floor(h / 2.0), 2.0) == 0.0 ? v : -v);
}

float noise(vec3 p) {
  vec3 cell = mod(floor(p), 256.0);
  vec3 f = p - floor(p);
  float u = fade(f.x);
  float v = fade(f.y);
  float w = fade(f.z);
  float A = perm(cell.x) + cell.y;
  float AA = perm(A) + cell.z;
  float AB = perm(A + 1.0) + cell.z;
  float B = perm(cell.x + 1.0) + cell.y;
  float BA = perm(B) + cell.z;
  float BB = perm(B + 1.0) + cell.z;
  return mix(
    mix(
      mix(grad(perm(AA), f.x, f.y, f.z), grad(perm(BA), f.x - 1.0, f.y, f.z), u),
      mix(grad(perm(AB), f.x, f.y - 1.0, f.z), grad(perm(BB), f.x - 1.0, f.y - 1.0, f.z), u),
      v
    ),
    mix(
      mix(grad(perm(AA + 1.0), f.x, f.y, f.z - 1.0), grad(perm(BA + 1.0), f.x - 1.0, f.y, f.z - 1.0), u),
      mix(grad(perm(AB + 1.0), f.x, f.y - 1.0, f.z - 1.0), grad(perm(BB + 1.0), f.x - 1.0, f.y - 1.0, f.z - 1.0), u),
      v
    ),
    w
  );
}

void main() {
  vec2 point = vec2(gl_FragCoord.x, size.y - gl_FragCoord.y) / dpr;
  vec2 n = point / feature;
  float value = noise(vec3(n, z)) * 1.1 + noise(vec3(n * 2.1, z * 1.7)) * 0.45;
  if (lift > 0.0) value += lift * exp(-length(point - hill) / hillRadius);
  for (int i = 0; i < 2; i++) {
    vec4 ripple = ripples[i];
    if (ripple.w > 0.5) {
      float d = length(point - ripple.xy) - ripple.z * reach;
      value += 0.8 * (1.0 - ripple.z) * cos(d / rippleWidth * 1.8) * exp(-(d * d) / (2.0 * rippleWidth * rippleWidth));
    }
  }
  value *= amount;
  float level = (value + range) / step;
  float nearest = floor(level + 0.5);
  float slope = length(vec2(dFdx(level), dFdy(level)));
  float pixels = abs(level - nearest) / max(slope, 1e-6);
  bool major = mod(nearest, 5.0) == 0.0;
  float width = (major ? 1.5 : 1.0) * dpr;
  float alpha = slope > 1e-6 ? clamp(width * 0.5 + 0.5 - pixels, 0.0, 1.0) * (major ? 0.85 : 0.4) : 0.0;
  gl_FragColor = vec4(color * alpha, alpha);
}
`;

type GlFrame = {
  width: number;
  height: number;
  dpr: number;
  feature: number;
  z: number;
  step: number;
  amount: number;
  lift: number;
  hill: [number, number];
  ripples: Float32Array;
  reach: number;
  color: [number, number, number];
};

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function createGlRenderer(gl: WebGLRenderingContext) {
  if (!gl.getExtension("OES_standard_derivatives")) return null;
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  const program = gl.createProgram();
  if (!vertex || !fragment || !program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW
  );
  const position = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.LUMINANCE,
    256,
    1,
    0,
    gl.LUMINANCE,
    gl.UNSIGNED_BYTE,
    PERMUTATION.subarray(0, 256)
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const at = (name: string) => gl.getUniformLocation(program, name);
  const uniforms = {
    permutation: at("permutation"),
    size: at("size"),
    dpr: at("dpr"),
    feature: at("feature"),
    z: at("z"),
    step: at("step"),
    range: at("range"),
    amount: at("amount"),
    lift: at("lift"),
    hillRadius: at("hillRadius"),
    hill: at("hill"),
    ripples: at("ripples"),
    reach: at("reach"),
    rippleWidth: at("rippleWidth"),
    color: at("color"),
  };
  gl.uniform1i(uniforms.permutation, 0);
  gl.uniform1f(uniforms.range, RANGE);
  gl.uniform1f(uniforms.hillRadius, HILL_RADIUS);
  gl.uniform1f(uniforms.rippleWidth, RIPPLE_WIDTH);

  return (frame: GlFrame) => {
    const w = Math.max(1, Math.round(frame.width * frame.dpr));
    const h = Math.max(1, Math.round(frame.height * frame.dpr));
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uniforms.size, w, h);
    gl.uniform1f(uniforms.dpr, frame.dpr);
    gl.uniform1f(uniforms.feature, frame.feature);
    gl.uniform1f(uniforms.z, frame.z);
    gl.uniform1f(uniforms.step, frame.step);
    gl.uniform1f(uniforms.amount, frame.amount);
    gl.uniform1f(uniforms.lift, frame.lift);
    gl.uniform2f(uniforms.hill, frame.hill[0], frame.hill[1]);
    gl.uniform4fv(uniforms.ripples, frame.ripples);
    gl.uniform1f(uniforms.reach, frame.reach);
    gl.uniform3f(uniforms.color, ...frame.color);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
}

// Fast bitwise RGB parser (avoids allocating dummy DOM canvas and getImageData pipeline stalls)
function toRgb(color: string): [number, number, number] {
  if (color.startsWith("#")) {
    let hex = color.slice(1);
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length === 6) {
      const num = parseInt(hex, 16);
      return [(num >> 16) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
    }
  }
  if (color.startsWith("rgb")) {
    const parts = color.match(/\d+/g);
    if (parts && parts.length >= 3) {
      return [
        Number(parts[0]) / 255,
        Number(parts[1]) / 255,
        Number(parts[2]) / 255,
      ];
    }
  }
  return [0.533, 0.533, 0.533]; // Safe fallback for #888888
}

type Ripple = { x: number; y: number; progress: MotionValue<number> };

type TopographyBackgroundProps = React.ComponentProps<"div"> & {
  lineColor?: string;
  levels?: number;
  speed?: number;
  scale?: number;
  peak?: number;
  interactive?: boolean;
  transition?: SpringOptions;
};

const TopographyBackgroundContent = React.forwardRef<
  HTMLDivElement,
  TopographyBackgroundProps
>(function TopographyBackgroundContent(
  {
    lineColor,
    levels = 16,
    speed = 1,
    scale = 1,
    peak = 1,
    interactive = true,
    transition = { stiffness: 120, damping: 20 },
    className,
    children,
    onPointerMove,
    onPointerLeave,
    onPointerDown,
    ...props
  },
  ref
) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  React.useImperativeHandle(
    ref,
    () => containerRef.current as HTMLDivElement
  );

  const inView = useInView(containerRef, {
    margin: "200px 0px",
    initial: true,
  });
  const pageVisible = usePageVisible();
  const reduce = Boolean(useReducedMotion());
  const playing = inView && pageVisible && !reduce;

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const raised = useMotionValue(0);
  const hillX = useSpring(pointerX, transition);
  const hillY = useSpring(pointerY, transition);
  const hill = useSpring(raised, { stiffness: 80, damping: 18 });
  const rise = useMotionValue(reduce ? 1 : 0);
  const ripplesRef = React.useRef<Ripple[]>([]);
  const drawRef = React.useRef<(time: number, looping?: boolean) => void>(
    () => {}
  );
  const timeRef = React.useRef(0);
  const paceRef = React.useRef(MIN_FRAME);

  const options = { lineColor, levels, speed, scale, peak };
  const optionsRef = React.useRef(options);
  React.useLayoutEffect(() => {
    optionsRef.current = options;
  });

  React.useEffect(() => {
    if (reduce) {
      rise.jump(1);
      return;
    }
    const controls = animate(rise, 1, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [reduce, rise]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext("webgl", {
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
      antialias: false,
    });
    const render = gl ? createGlRenderer(gl) : null;
    if (render) {
      // 35fps frame pacing: reduces GPU draw iterations while maintaining smooth organic movement
      paceRef.current = MIN_FRAME;
      let width = 0;
      let height = 0;
      let dpr = 1;
      let frames = 0;
      let textColor = "";
      let rgb: [number, number, number] = [0.533, 0.533, 0.533];
      // Max 2 active ripples (8 floats) for lighter shader execution
      const ripples = new Float32Array(8);

      const resize = () => {
        const rect = container.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        // On mobile, dpr=1.0 eliminates 75% of pixel fill work; on desktop, max 1.25 gives crisp lines
        const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
        dpr = isMobile ? 1 : Math.max(1, Math.min(window.devicePixelRatio || 1, 1.25));
        canvas.width = Math.max(1, Math.round(width * dpr));
        canvas.height = Math.max(1, Math.round(height * dpr));
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        if (hill.get() === 0) {
          pointerX.jump(width / 2);
          pointerY.jump(height / 2);
          hillX.jump(width / 2);
          hillY.jump(height / 2);
        }
      };

      const draw = (time: number, looping = false) => {
        if (width === 0 || height === 0) return;
        const { lineColor, levels, speed, scale, peak } = optionsRef.current;
        if (!looping || frames++ % 60 === 0) {
          const color =
            lineColor ?? (container ? getComputedStyle(container).color || "#737373" : "#737373");
          if (color !== textColor) {
            textColor = color;
            rgb = toRgb(color);
          }
        }
        ripples.fill(0);
        ripplesRef.current.slice(-2).forEach((ripple, i) => {
          ripples[i * 4] = ripple.x;
          ripples[i * 4 + 1] = ripple.y;
          ripples[i * 4 + 2] = ripple.progress.get();
          ripples[i * 4 + 3] = 1;
        });
        render({
          width,
          height,
          dpr,
          feature: FEATURE * scale,
          z: time * 0.00005 * speed,
          step: (2 * RANGE) / Math.max(2, Math.round(levels)),
          amount: rise.get(),
          lift: hill.get() * peak * 1.5,
          hill: [hillX.get(), hillY.get()],
          ripples,
          reach: Math.hypot(width, height) * 0.75,
          color: rgb,
        });
      };

      drawRef.current = draw;
      resize();
      draw(timeRef.current);
      const observer = new ResizeObserver(() => {
        resize();
        draw(timeRef.current);
      });
      observer.observe(container);
      return () => {
        observer.disconnect();
        drawRef.current = () => {};
      };
    }

    paceRef.current = MIN_FRAME;
    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    let field = new Float32Array(0);
    let levelLow = new Int16Array(0);
    let levelHigh = new Int16Array(0);
    let bucketStart = new Int32Array(0);
    let bucketCells = new Int32Array(0);
    let contours = createContours(2 * (rows + 1) * (cols + 1) + 4);
    let frames = 0;
    let textColor = "#737373";

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      dpr = isMobile ? 1 : Math.max(1, Math.min(window.devicePixelRatio || 1, 1.25));
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      cols = Math.ceil(width / CELL) + 1;
      rows = Math.ceil(height / CELL) + 1;
      field = new Float32Array((cols + 1) * (rows + 1));
      levelLow = new Int16Array(rows * cols);
      levelHigh = new Int16Array(rows * cols);
      contours = createContours(2 * (rows + 1) * (cols + 1) + 4);
      if (hill.get() === 0) {
        pointerX.jump(width / 2);
        pointerY.jump(height / 2);
        hillX.jump(width / 2);
        hillY.jump(height / 2);
      }
    };

    const sample = (time: number) => {
      const { speed, scale, peak } = optionsRef.current;
      const size = FEATURE * scale;
      const z = time * 0.00005 * speed;
      const lift = hill.get() * peak * 1.5;
      const hx = hillX.get();
      const hy = hillY.get();
      const ripples = ripplesRef.current.slice(-2);
      const reach = Math.hypot(width, height) * 0.75;
      const amount = rise.get();
      let i = 0;
      for (let row = 0; row <= rows; row++) {
        const y = row * CELL;
        for (let col = 0; col <= cols; col++) {
          const x = col * CELL;
          const nx = x / size;
          const ny = y / size;
          let value =
            noise(nx, ny, z) * 1.1 + noise(nx * 2.1, ny * 2.1, z * 1.7) * 0.45;
          const dx = x - hx;
          const dy = y - hy;
          if (lift > 0)
            value += lift * Math.exp(-Math.hypot(dx, dy) / HILL_RADIUS);
          for (const ripple of ripples) {
            const p = ripple.progress.get();
            const d = Math.hypot(x - ripple.x, y - ripple.y) - p * reach;
            value +=
              0.8 *
              (1 - p) *
              Math.cos((d / RIPPLE_WIDTH) * 1.8) *
              Math.exp(-(d * d) / (2 * RIPPLE_WIDTH * RIPPLE_WIDTH));
          }
          field[i++] = value * amount;
        }
      }
    };

    const draw = (time: number, looping = false) => {
      if (width === 0 || height === 0) return;
      const { lineColor, levels } = optionsRef.current;
      sample(time);
      const count = Math.max(2, Math.round(levels));
      const step = (2 * RANGE) / count;
      const minor = new Path2D();
      const major = new Path2D();
      const stride = cols + 1;
      let lowest = Infinity;
      let highest = -Infinity;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const i = row * stride + col;
          const a = field[i]!;
          const b = field[i + 1]!;
          const c = field[i + stride + 1]!;
          const d = field[i + stride]!;
          const first = Math.ceil((Math.min(a, b, c, d) + RANGE) / step);
          const last = Math.floor((Math.max(a, b, c, d) + RANGE) / step);
          levelLow[row * cols + col] = first;
          levelHigh[row * cols + col] = last;
          if (first < lowest) lowest = first;
          if (last > highest) highest = last;
        }
      }

      const span = highest - lowest + 1;
      if (bucketStart.length < span + 1) bucketStart = new Int32Array(span + 1);
      bucketStart.fill(0, 0, span + 1);
      let entries = 0;
      for (let cell = 0; cell < rows * cols; cell++)
        for (let level = levelLow[cell]!; level <= levelHigh[cell]!; level++) {
          bucketStart[level - lowest + 1]!++;
          entries++;
        }
      for (let l = 0; l < span; l++) bucketStart[l + 1]! += bucketStart[l]!;
      if (bucketCells.length < entries)
        bucketCells = new Int32Array(entries * 2);
      const fill = bucketStart.slice(0, span);
      for (let cell = 0; cell < rows * cols; cell++)
        for (let level = levelLow[cell]!; level <= levelHigh[cell]!; level++)
          bucketCells[fill[level - lowest]!++] = cell;

      for (let level = lowest; level <= highest; level++) {
        const v = level * step - RANGE;
        const end = bucketStart[level - lowest + 1]!;
        for (let e = bucketStart[level - lowest]!; e < end; e++) {
          {
            const cell = bucketCells[e]!;
            const row = (cell / cols) | 0;
            const col = cell - row * cols;
            const i = row * stride + col;
            const a = field[i]!;
            const b = field[i + 1]!;
            const c = field[i + stride + 1]!;
            const d = field[i + stride]!;
            let mask = 0;
            if (a >= v) mask |= 1;
            if (b >= v) mask |= 2;
            if (c >= v) mask |= 4;
            if (d >= v) mask |= 8;
            if (mask === 0 || mask === 15) continue;

            const x0 = col * CELL;
            const x1 = x0 + CELL;
            const y0 = row * CELL;
            const y1 = y0 + CELL;

            const tX = x0 + ((v - a) / (b - a)) * CELL;
            const rY = y0 + ((v - b) / (c - b)) * CELL;
            const bX = x0 + ((v - d) / (c - d)) * CELL;
            const lY = y0 + ((v - a) / (d - a)) * CELL;

            const topEdge = row * cols + col;
            const bottomEdge = (row + 1) * cols + col;
            const leftEdge = (rows + 1) * cols + row * (cols + 1) + col;
            const rightEdge = leftEdge + 1;

            switch (mask) {
              case 1:
              case 14:
                addSegment(contours, leftEdge, x0, lY, topEdge, tX, y0);
                break;
              case 2:
              case 13:
                addSegment(contours, topEdge, tX, y0, rightEdge, x1, rY);
                break;
              case 3:
              case 12:
                addSegment(contours, leftEdge, x0, lY, rightEdge, x1, rY);
                break;
              case 4:
              case 11:
                addSegment(contours, rightEdge, x1, rY, bottomEdge, bX, y1);
                break;
              case 5: {
                const center = (a + b + c + d) * 0.25;
                if (center >= v) {
                  addSegment(contours, leftEdge, x0, lY, topEdge, tX, y0);
                  addSegment(contours, rightEdge, x1, rY, bottomEdge, bX, y1);
                } else {
                  addSegment(contours, topEdge, tX, y0, rightEdge, x1, rY);
                  addSegment(contours, leftEdge, x0, lY, bottomEdge, bX, y1);
                }
                break;
              }
              case 6:
              case 9:
                addSegment(contours, topEdge, tX, y0, bottomEdge, bX, y1);
                break;
              case 7:
              case 8:
                addSegment(contours, leftEdge, x0, lY, bottomEdge, bX, y1);
                break;
              case 10: {
                const center = (a + b + c + d) * 0.25;
                if (center >= v) {
                  addSegment(contours, topEdge, tX, y0, rightEdge, x1, rY);
                  addSegment(contours, leftEdge, x0, lY, bottomEdge, bX, y1);
                } else {
                  addSegment(contours, leftEdge, x0, lY, topEdge, tX, y0);
                  addSegment(contours, rightEdge, x1, rY, bottomEdge, bX, y1);
                }
                break;
              }
            }
          }
        }
        traceLevel(level % 5 === 0 ? major : minor, contours);
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      if (!looping || frames++ % 60 === 0)
        textColor = lineColor ?? (container ? getComputedStyle(container).color || "#737373" : "#737373");
      context.strokeStyle = lineColor ?? textColor;
      context.lineCap = "round";
      context.globalAlpha = 0.4;
      context.lineWidth = 1;
      context.stroke(minor);
      context.globalAlpha = 0.85;
      context.lineWidth = 1.5;
      context.stroke(major);
      context.globalAlpha = 1;
    };

    drawRef.current = draw;
    resize();
    draw(timeRef.current);
    const observer = new ResizeObserver(() => {
      resize();
      draw(timeRef.current);
    });
    observer.observe(container);
    return () => {
      observer.disconnect();
      drawRef.current = () => {};
    };
  }, [hill, hillX, hillY, pointerX, pointerY, rise]);

  React.useEffect(() => {
    drawRef.current(timeRef.current);
  }, [lineColor, levels, scale, peak]);

  React.useEffect(() => {
    if (!playing) return;
    let waited = 0;
    const tick = ({ delta }: { delta: number }) => {
      waited += delta;
      if (waited < paceRef.current) return;
      timeRef.current += Math.min(waited, 64);
      waited = 0;
      drawRef.current(timeRef.current, true);
    };
    frame.render(tick, true);
    return () => cancelFrame(tick);
  }, [playing]);

  // Optimized pointer tracking: caches container rect, ignores touch drag to keep mobile scrolling butter-smooth
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || !interactive || reduce || !playing) return;

    let isInside = false;
    let cachedRect: DOMRect | null = null;

    const getRect = () => {
      if (!cachedRect) {
        cachedRect = container.getBoundingClientRect();
      }
      return cachedRect;
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = getRect();
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        pointerX.set(x);
        pointerY.set(y);
        raised.set(1);
        isInside = true;
      } else if (isInside) {
        raised.set(0);
        isInside = false;
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      // Touch dragging on mobile is for scrolling the page — skip hover elevation to prevent scroll stutter
      if (event.pointerType === "touch") return;
      updatePointer(event.clientX, event.clientY);
    };

    const handleScrollOrResize = () => {
      cachedRect = null;
    };

    const handlePointerDown = (event: PointerEvent) => {
      const rect = getRect();
      if (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      ) {
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        pointerX.set(x);
        pointerY.set(y);
        
        // Allow at most 2 active wave ripples concurrently
        if (ripplesRef.current.length < 2) {
          const ripple: Ripple = { x, y, progress: motionValue(0) };
          ripplesRef.current = [...ripplesRef.current, ripple];
          animate(ripple.progress, 1, {
            duration: 1.5, // snappier, lighter wave animation (down from 2.6s)
            ease: "easeOut",
          }).then(() => {
            ripplesRef.current = ripplesRef.current.filter((r) => r !== ripple);
          });
        }
      }
    };

    const handlePointerLeave = () => {
      raised.set(0);
      isInside = false;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("blur", handlePointerLeave);
    };
  }, [interactive, reduce, pointerX, pointerY, raised, playing]);

  return (
    <div
      ref={containerRef}
      data-slot="topography-background"
      className={cn("relative size-full overflow-hidden", className)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      />
      {children}
    </div>
  );
});

// SSR Guard: On the server during SSR/SSG, renders zero hooks and static HTML
// On the client, mounts TopographyBackgroundContent smoothly without blocking the server
const TopographyBackground = React.forwardRef<
  HTMLDivElement,
  TopographyBackgroundProps
>(function TopographyBackground(props, ref) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        ref={ref}
        data-slot="topography-background"
        className={cn("relative size-full overflow-hidden", props.className)}
        {...props}
      >
        <canvas
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        />
        {props.children}
      </div>
    );
  }

  return <TopographyBackgroundContent ref={ref} {...props} />;
});

export { TopographyBackground, type TopographyBackgroundProps };

export default TopographyBackground;

"use client"

import { useLayoutEffect, useMemo, useRef } from "react"
import { useFrame, type ThreeElements } from "@react-three/fiber"
import { RoundedBox } from "@react-three/drei"
import * as THREE from "three"
import { RANGES, local } from "@/lib/chapters"
import { facts, principles } from "@/lib/content"
import { rng } from "@/lib/rng"
import { live } from "./live"
import { Type } from "./Type"
import { usePresence, useReveal } from "./presence"
import { FACTS } from "./track"

// "Cool things about me" as a place instead of a list: my desk at 3 a.m.
// Every object on it is one fact. They light up one by one as you scroll,
// and each reacts when you hover it.

type Hot = { i: number }
const DARK = "#0d0a18"

// which fact (index into `facts`) each prop stands for
const F = { wake: 0, wpm: 1, leet: 2, loc: 3, coffee: 4, water: 5, pushups: 6, sleep: 7 }
const COLORS = ["#ff8f5f", "#5fd8ff", "#6fffc0", "#b18cff", "#ffcf7f", "#5fb4ff", "#ff5fc8", "#cfd8ff"]

export function Desk() {
  const [a, b] = RANGES.facts
  const on = usePresence(a + 40, b, 50, 40)
  const head = useRef<THREE.Group>(null)
  const hot = useMemo<Hot>(() => ({ i: -1 }), [])
  useReveal(head, on, 0.6)

  return (
    <group position={FACTS}>
      <Type weight="bold" fontSize={9} anchorX="center" anchorY="middle" position={[0, 1.5, -6]} color="#ffcf7f" opacity={0.05}>
        {"04"}
      </Type>
      <group ref={head}>
        <group position={[-7.3, 4.1, -1.5]}>
          <Type weight="semi" fontSize={0.16} letterSpacing={0.24} color="#ffcf7f" glow={1.8}>
            {"04   /ETC/FARHAN.CONF"}
          </Type>
          <Type weight="bold" fontSize={0.7} letterSpacing={-0.03} lineHeight={0.95} position={[0, -0.32, 0]} glow={1.3}>
            {"Cool things\nabout me"}
          </Type>
          <Type weight="light" fontSize={0.2} position={[0, -1.85, 0]} color="#d6d0f5" maxWidth={3.6} lineHeight={1.4}>
            {"My desk at 3 a.m. Every object on it is a fact. Hover them."}
          </Type>
        </group>
        <group position={[4.1, 4.1, -1.5]}>
          <Type weight="semi" fontSize={0.14} letterSpacing={0.2} color="#ff5fc8" glow={1.8}>
            {"[PRINCIPLES]"}
          </Type>
          {principles.map((p, i) => (
            <Type key={p} weight="light" fontSize={0.165} lineHeight={1.3} position={[0, -0.36 - i * 0.52, 0]} maxWidth={3.5}>
              {`${String(i + 1).padStart(2, "0")}  ${p}`}
            </Type>
          ))}
        </group>
      </group>

      <group position={[0, -2.0, 0]} scale={1.42}>
        <Table />
        <Monitor position={[-1.35, 0, -0.75]} rotation-y={0.2} kind="code" k={F.loc} hot={hot} />
        <Monitor position={[1.45, 0, -0.8]} rotation-y={-0.24} kind="grid" k={F.leet} hot={hot} />
        <Keyboard position={[-0.75, 0.03, 0.55]} k={F.wpm} hot={hot} />
        <Mug position={[1.05, 0, 0.75]} k={F.coffee} hot={hot} />
        <Clock position={[-3.1, 0, -0.55]} rotation-y={0.35} k={F.wake} hot={hot} />
        <Bottle position={[3.2, 0, -0.45]} k={F.water} hot={hot} />
        <Dumbbell position={[2.55, 0.14, 1.0]} rotation-y={0.5} k={F.pushups} hot={hot} />
        <MoonLamp position={[-2.25, 0, 1.05]} k={F.sleep} hot={hot} />
        <Duck position={[0.55, 0, 1.05]} rotation-y={-0.6} />
      </group>
    </group>
  )
}

// ── shared: a prop wrapper that tracks hover, and its floating label ───
function Prop({ k, hot, children, ...props }: { k: number; hot: Hot; children: React.ReactNode } & ThreeElements["group"]) {
  return (
    <group
      {...props}
      onPointerOver={(e) => {
        e.stopPropagation()
        hot.i = k
        document.body.style.cursor = "pointer"
      }}
      onPointerOut={() => {
        if (hot.i === k) hot.i = -1
        document.body.style.cursor = "auto"
      }}
    >
      {children}
    </group>
  )
}

/** 0..1: has the scroll reached this fact yet? */
function shown(k: number) {
  const t = local(live.scroll, "facts")
  return THREE.MathUtils.clamp((t - (0.1 + k * 0.075)) / 0.05, 0, 1)
}

function Callout({ k, hot, y }: { k: number; hot: Hot; y: number }) {
  const g = useRef<THREE.Group>(null)
  const f = facts[k]
  const sm = useRef(0)
  useFrame(({ camera }, dt) => {
    if (!g.current) return
    const want = shown(k) * (hot.i === k ? 1.25 : 1)
    sm.current += (want - sm.current) * Math.min(1, dt * 7)
    const e = sm.current
    g.current.visible = e > 0.01
    g.current.scale.setScalar(Math.max(0.001, e))
    g.current.quaternion.copy(camera.quaternion)
    // undo the parents' rotation so the label always faces the lens
    g.current.parent?.getWorldQuaternion(q)
    g.current.quaternion.premultiply(q.invert())
  })
  return (
    <group ref={g} position={[0, y, 0]} visible={false}>
      <mesh position={[0, -0.2, 0]}>
        <planeGeometry args={[0.012, 0.34]} />
        <meshBasicMaterial color={new THREE.Color(COLORS[k]).multiplyScalar(2.5)} toneMapped={false} />
      </mesh>
      <Type weight="bold" fontSize={0.3} anchorX="center" anchorY="bottom" glow={2.2}>
        {f.value}
      </Type>
      <Type weight="semi" fontSize={0.08} letterSpacing={0.16} anchorX="center" position={[0, 0.48, 0]} color={COLORS[k]} glow={1.7}>
        {f.label.toUpperCase()}
      </Type>
    </group>
  )
}
const q = new THREE.Quaternion()

// ── the table ──────────────────────────────────────────────────────────
function Table() {
  return (
    <group>
      <RoundedBox args={[7.6, 0.14, 3.2]} radius={0.05} smoothness={3} position={[0, -0.07, 0]}>
        <meshStandardMaterial color="#130e22" roughness={0.42} metalness={0.5} />
      </RoundedBox>
      {/* light strip along the front edge */}
      <mesh position={[0, -0.07, 1.605]}>
        <planeGeometry args={[7.3, 0.02]} />
        <meshBasicMaterial color={[2.6, 1.2, 3.2]} toneMapped={false} />
      </mesh>
      {[-3.5, 3.5].map((x) =>
        [-1.35, 1.35].map((z) => (
          <mesh key={`${x}${z}`} position={[x, -0.9, z]}>
            <boxGeometry args={[0.1, 1.55, 0.1]} />
            <meshStandardMaterial color={DARK} roughness={0.4} metalness={0.8} />
          </mesh>
        )),
      )}
      {/* desk mat */}
      <mesh position={[-0.3, 0.004, 0.55]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[4.2, 1.5]} />
        <meshStandardMaterial color="#1c1433" roughness={0.9} />
      </mesh>
    </group>
  )
}

// ── monitors ───────────────────────────────────────────────────────────
const screenV = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`
const codeF = /* glsl */ `
  uniform float uTime; uniform float uOn; uniform float uHot;
  varying vec2 vUv;
  float hash(float n){ return fract(sin(n) * 43758.5453); }
  void main(){
    vec3 col = vec3(0.02, 0.015, 0.05);
    float rows = 20.0;
    float y = vUv.y + uTime * (0.05 + uHot * 0.35);
    float row = floor(y * rows);
    float fy = fract(y * rows);
    float indent = floor(hash(row) * 4.0) * 0.05 + 0.08;
    float len = 0.15 + hash(row + 7.0) * 0.6;
    float blank = step(0.85, hash(row + 3.0));
    float x = vUv.x;
    float inLine = step(indent, x) * step(x, indent + len) * (1.0 - blank) * smoothstep(0.2, 0.3, fy) * smoothstep(0.8, 0.7, fy);
    // tokens
    float tok = floor((x - indent) * 22.0);
    float gap = step(0.18, fract((x - indent) * 22.0 / (1.0 + floor(hash(row * 3.0 + tok) * 3.0))));
    float h = hash(row * 13.0 + floor(tok / 2.0));
    vec3 tc = h < 0.3 ? vec3(0.8, 0.5, 1.0) : h < 0.55 ? vec3(0.4, 0.85, 1.0) : h < 0.75 ? vec3(0.5, 1.0, 0.7) : vec3(0.9, 0.88, 1.0);
    col += tc * inLine * gap * 1.5;
    // line numbers + cursor
    col += vec3(0.3, 0.28, 0.5) * step(0.02, x) * step(x, 0.05) * smoothstep(0.3, 0.4, fy) * smoothstep(0.7, 0.6, fy) * 0.6;
    col *= 0.9 + 0.1 * sin(vUv.y * 500.0);
    gl_FragColor = vec4(col * uOn, 1.0);
  }
`
const gridF = /* glsl */ `
  uniform float uTime; uniform float uOn; uniform float uFill; uniform float uHot;
  varying vec2 vUv;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  void main(){
    vec3 col = vec3(0.015, 0.02, 0.04);
    // a year of solved problems, filling in week by week
    vec2 g = vec2((vUv.x - 0.06) / 0.88 * 30.0, (vUv.y - 0.14) / 0.6 * 7.0);
    vec2 id = floor(g); vec2 f = fract(g);
    float inside = step(0.0, g.x) * step(g.x, 30.0) * step(0.0, g.y) * step(g.y, 7.0);
    float cell = step(0.14, f.x) * step(f.x, 0.86) * step(0.14, f.y) * step(f.y, 0.86);
    float order = (id.x * 7.0 + (6.0 - id.y)) / 210.0;
    float filled = step(order, uFill);
    float lvl = 0.25 + 0.75 * hash(id);
    float newest = smoothstep(0.03, 0.0, abs(order - uFill)) * (0.5 + 0.5 * sin(uTime * 8.0));
    vec3 green = mix(vec3(0.05, 0.3, 0.18), vec3(0.3, 1.0, 0.6), lvl);
    col += inside * cell * (mix(vec3(0.05, 0.05, 0.09), green * (1.0 + uHot), filled) + vec3(1.0) * newest);
    // header bar
    col += vec3(0.3, 1.0, 0.6) * step(0.86, vUv.y) * step(vUv.y, 0.9) * step(0.06, vUv.x) * step(vUv.x, 0.06 + 0.5 * uFill) * 0.9;
    gl_FragColor = vec4(col * uOn, 1.0);
  }
`

function Monitor({ kind, k, hot, ...props }: { kind: "code" | "grid"; k: number; hot: Hot } & ThreeElements["group"]) {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uOn: { value: 0 }, uFill: { value: 0 }, uHot: { value: 0 } }), [])
  useFrame(({ clock }, dt) => {
    const u = mat.current?.uniforms
    if (!u) return
    const s = shown(k)
    u.uTime.value = clock.elapsedTime
    u.uOn.value += ((s > 0 ? 1 : 0.12) - u.uOn.value) * Math.min(1, dt * 4)
    u.uFill.value += (s - u.uFill.value) * Math.min(1, dt * 0.9)
    u.uHot.value += ((hot.i === k ? 1 : 0) - u.uHot.value) * Math.min(1, dt * 5)
  })
  return (
    <Prop k={k} hot={hot} {...props}>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.42, 0.46, 0.05, 32]} />
        <meshStandardMaterial color={DARK} metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.4, -0.05]}>
        <boxGeometry args={[0.1, 0.75, 0.06]} />
        <meshStandardMaterial color={DARK} metalness={0.9} roughness={0.3} />
      </mesh>
      <RoundedBox args={[2.5, 1.5, 0.07]} radius={0.03} smoothness={3} position={[0, 1.25, 0]}>
        <meshStandardMaterial color="#07050f" metalness={0.9} roughness={0.25} />
      </RoundedBox>
      <mesh position={[0, 1.25, 0.037]}>
        <planeGeometry args={[2.38, 1.38]} />
        <shaderMaterial ref={mat} vertexShader={screenV} fragmentShader={kind === "code" ? codeF : gridF} uniforms={uniforms} toneMapped={false} />
      </mesh>
      <Callout k={k} hot={hot} y={2.4} />
    </Prop>
  )
}

// ── keyboard: types by itself at 120 WPM ───────────────────────────────
const ROWS = 5
const COLS = 14
function Keyboard({ k, hot, ...props }: { k: number; hot: Hot } & ThreeElements["group"]) {
  const keys = useRef<THREE.InstancedMesh>(null)
  const st = useMemo(() => ({ press: new Float32Array(ROWS * COLS), acc: 0, r: rng(5) }), [])
  const o = useMemo(() => new THREE.Object3D(), [])
  const c = useMemo(() => new THREE.Color(), [])
  const place = (i: number, p: number) => {
    const row = Math.floor(i / COLS)
    const col = i % COLS
    o.position.set((col - (COLS - 1) / 2) * 0.152 + (row % 2) * 0.03, 0.075 - p * 0.03, (row - (ROWS - 1) / 2) * 0.152)
    o.updateMatrix()
    keys.current!.setMatrixAt(i, o.matrix)
    keys.current!.setColorAt(i, c.setRGB(0.09 + p * 0.5, 0.07 + p * 2.4, 0.16 + p * 3))
  }
  useLayoutEffect(() => {
    for (let i = 0; i < ROWS * COLS; i++) place(i, 0)
    keys.current!.instanceMatrix.needsUpdate = true
    keys.current!.instanceColor!.needsUpdate = true
  }) // eslint-disable-line react-hooks/exhaustive-deps
  useFrame((_, dt) => {
    if (!keys.current || shown(k) <= 0) return
    // 120 WPM = 600 keystrokes a minute = 10 a second (3x that when hovered)
    st.acc += dt * (hot.i === k ? 30 : 10)
    while (st.acc > 1) {
      st.acc -= 1
      st.press[Math.floor(st.r() * ROWS * COLS)] = 1
    }
    for (let i = 0; i < st.press.length; i++) {
      if (st.press[i] < 0.001) continue
      st.press[i] = Math.max(0, st.press[i] - dt * 6)
      place(i, st.press[i])
    }
    keys.current.instanceMatrix.needsUpdate = true
    keys.current.instanceColor!.needsUpdate = true
  })
  return (
    <Prop k={k} hot={hot} {...props}>
      <RoundedBox args={[2.28, 0.07, 0.88]} radius={0.03} smoothness={3} position={[0, 0.015, 0]}>
        <meshStandardMaterial color="#0a0714" metalness={0.8} roughness={0.35} />
      </RoundedBox>
      <instancedMesh ref={keys} args={[undefined, undefined, ROWS * COLS]} frustumCulled={false}>
        <boxGeometry args={[0.125, 0.05, 0.125]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      {/* underglow */}
      <mesh position={[0, 0.004, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[2.5, 1.1]} />
        <meshBasicMaterial color={[0.3, 0.9, 1.4]} transparent opacity={0.16} toneMapped={false} depthWrite={false} />
      </mesh>
      <Callout k={k} hot={hot} y={0.55} />
    </Prop>
  )
}

// ── mug with steam ─────────────────────────────────────────────────────
const steamF = /* glsl */ `
  uniform float uTime; uniform float uAmt;
  varying vec2 vUv;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 45758.5453); }
  float noise(vec2 p){ vec2 i=floor(p),f=fract(p); vec2 u=f*f*(3.0-2.0*f); return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y); }
  void main(){
    vec2 p = vUv;
    p.x += (noise(vec2(p.y * 3.0 - uTime * 0.6, uTime * 0.2)) - 0.5) * 0.5 * p.y;
    float wisp = smoothstep(0.22, 0.0, abs(p.x - 0.5)) * noise(vec2(p.x * 6.0, p.y * 4.0 - uTime * 0.9));
    float a = wisp * smoothstep(0.0, 0.15, p.y) * smoothstep(1.0, 0.3, p.y) * uAmt;
    gl_FragColor = vec4(vec3(1.0, 0.9, 0.85) * a, a);
  }
`
function Mug({ k, hot, ...props }: { k: number; hot: Hot } & ThreeElements["group"]) {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uAmt: { value: 0 } }), [])
  useFrame(({ clock }, dt) => {
    const u = mat.current?.uniforms
    if (!u) return
    u.uTime.value = clock.elapsedTime
    u.uAmt.value += (shown(k) * (hot.i === k ? 1.6 : 0.6) - u.uAmt.value) * Math.min(1, dt * 3)
  })
  return (
    <Prop k={k} hot={hot} {...props}>
      <mesh position={[0, 0.21, 0]}>
        <cylinderGeometry args={[0.2, 0.17, 0.42, 28]} />
        <meshStandardMaterial color="#e9e4f5" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.421, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.17, 28]} />
        <meshStandardMaterial color="#2a1408" roughness={0.2} />
      </mesh>
      <mesh position={[0.22, 0.22, 0]} rotation-y={Math.PI / 2} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.11, 0.028, 10, 24, Math.PI]} />
        <meshStandardMaterial color="#e9e4f5" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <planeGeometry args={[0.7, 1.1]} />
        <shaderMaterial ref={mat} vertexShader={screenV} fragmentShader={steamF} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <Callout k={k} hot={hot} y={0.95} />
    </Prop>
  )
}

// ── alarm clock ────────────────────────────────────────────────────────
function Clock({ k, hot, ...props }: { k: number; hot: Hot } & ThreeElements["group"]) {
  const digits = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!digits.current) return
    const s = shown(k)
    // it rings (shakes) when hovered
    digits.current.parent!.rotation.z = hot.i === k ? Math.sin(clock.elapsedTime * 60) * 0.03 : 0
    digits.current.visible = s > 0 && (hot.i !== k || Math.sin(clock.elapsedTime * 14) > -0.3)
  })
  return (
    <Prop k={k} hot={hot} {...props}>
      <group>
        <RoundedBox args={[1.05, 0.5, 0.34]} radius={0.08} smoothness={3} position={[0, 0.27, 0]}>
          <meshStandardMaterial color="#0a0714" metalness={0.7} roughness={0.3} />
        </RoundedBox>
        <group ref={digits} position={[0, 0.27, 0.175]}>
          <Type weight="bold" fontSize={0.3} anchorX="center" anchorY="middle" color="#ff5a3a" glow={3} letterSpacing={0.04}>
            {facts[k].value}
          </Type>
        </group>
      </group>
      <Callout k={k} hot={hot} y={1.3} />
    </Prop>
  )
}

// ── water bottle ───────────────────────────────────────────────────────
function Bottle({ k, hot, ...props }: { k: number; hot: Hot } & ThreeElements["group"]) {
  const water = useRef<THREE.Mesh>(null)
  useFrame(({ clock }, dt) => {
    if (!water.current) return
    const lvl = 0.12 + shown(k) * (hot.i === k ? 0.88 : 0.6)
    water.current.scale.y += (lvl - water.current.scale.y) * Math.min(1, dt * 2)
    water.current.position.y = 0.06 + (0.82 * water.current.scale.y) / 2 + Math.sin(clock.elapsedTime * 2) * 0.004
  })
  return (
    <Prop k={k} hot={hot} {...props}>
      <mesh ref={water} position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.82, 24]} />
        <meshBasicMaterial color={[0.5, 1.3, 3]} toneMapped={false} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.185, 0.185, 0.96, 24, 1, true]} />
        <meshStandardMaterial color="#9fd0ff" transparent opacity={0.22} roughness={0.1} metalness={0.2} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 1.03, 0]}>
        <cylinderGeometry args={[0.1, 0.16, 0.14, 20]} />
        <meshStandardMaterial color={DARK} metalness={0.8} roughness={0.3} />
      </mesh>
      <Callout k={k} hot={hot} y={1.45} />
    </Prop>
  )
}

// ── dumbbell ───────────────────────────────────────────────────────────
function Dumbbell({ k, hot, ...props }: { k: number; hot: Hot } & ThreeElements["group"]) {
  const g = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!g.current) return
    // reps when hovered
    g.current.position.y = hot.i === k ? Math.abs(Math.sin(clock.elapsedTime * 5)) * 0.35 : 0
  })
  return (
    <Prop k={k} hot={hot} {...props}>
      <group ref={g}>
        <mesh rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.035, 0.035, 0.7, 12]} />
          <meshStandardMaterial color="#c9c4d8" metalness={1} roughness={0.25} />
        </mesh>
        {[-0.36, 0.36].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation-z={Math.PI / 2}>
            <cylinderGeometry args={[0.14, 0.14, 0.2, 6]} />
            <meshStandardMaterial color="#1a1426" metalness={0.7} roughness={0.4} />
          </mesh>
        ))}
      </group>
      <Callout k={k} hot={hot} y={0.7} />
    </Prop>
  )
}

// ── moon lamp ──────────────────────────────────────────────────────────
function MoonLamp({ k, hot, ...props }: { k: number; hot: Hot } & ThreeElements["group"]) {
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  useFrame((_, dt) => {
    if (!mat.current) return
    const want = 0.25 + shown(k) * (hot.i === k ? 1.3 : 0.55)
    const v = mat.current.color.r + (want - mat.current.color.r) * Math.min(1, dt * 4)
    mat.current.color.setRGB(v, v * 0.95, v * 1.15)
  })
  return (
    <Prop k={k} hot={hot} {...props}>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.1, 20]} />
        <meshStandardMaterial color={DARK} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.2, 24, 18]} />
        <meshBasicMaterial ref={mat} color={[0.35, 0.33, 0.4]} toneMapped={false} />
      </mesh>
      <Callout k={k} hot={hot} y={0.7} />
    </Prop>
  )
}

// ── the debugger ───────────────────────────────────────────────────────
function Duck(props: ThreeElements["group"]) {
  const g = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (g.current) g.current.rotation.z = Math.sin(clock.elapsedTime * 1.3) * 0.06
  })
  const yellow = <meshStandardMaterial color="#ffd23f" roughness={0.45} emissive="#5a4300" emissiveIntensity={0.5} />
  return (
    <group {...props}>
      <group ref={g}>
        <mesh position={[0, 0.13, 0]} scale={[1, 0.8, 1.25]}>
          <sphereGeometry args={[0.16, 18, 14]} />
          {yellow}
        </mesh>
        <mesh position={[0, 0.3, 0.1]}>
          <sphereGeometry args={[0.105, 18, 14]} />
          {yellow}
        </mesh>
        <mesh position={[0, 0.28, 0.21]} scale={[1, 0.5, 1]}>
          <sphereGeometry args={[0.05, 10, 8]} />
          <meshStandardMaterial color="#ff8a2a" roughness={0.5} />
        </mesh>
      </group>
    </group>
  )
}

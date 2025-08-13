'use client';

import * as THREE from 'three';
import { Suspense, useMemo, useRef, forwardRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, MeshTransmissionMaterial, Html } from '@react-three/drei';
import { EffectComposer, Bloom, SMAA } from '@react-three/postprocessing';

type Props = { size?: number; className?: string };

/* ====================== 강낭콩(Bean) 변형 훅 ====================== */
function useBeanGeometry(
  radius = 1,
  widthSegments = 160,
  heightSegments = 160,
  opts?: {
    indent?: number; bulge?: number; sigma?: number; bias?: number;
    pinch?: number; pinchSigmaX?: number; pinchSigmaY?: number;
    rightLobe?: number; rightLobeShift?: number; rightLobeSigma?: number;
    skewX?: number; wobbleAmp?: number; wobbleFreq?: number;
  }
) {
  const base = useMemo(() => new THREE.SphereGeometry(radius, widthSegments, heightSegments), []);
  const geom = useMemo(() => base.clone(), [base]);
  const original = useMemo(
    () => Float32Array.from((base.getAttribute('position') as THREE.BufferAttribute).array as Float32Array),
    [base],
  );

  const INDENT = opts?.indent ?? 0.34;
  const BULGE  = opts?.bulge  ?? 0.38;
  const SIGMA  = opts?.sigma  ?? 0.45;
  const BIAS   = opts?.bias   ?? 0.55;
  const PINCH       = opts?.pinch ?? 0.20;
  const PINCH_SIG_X = opts?.pinchSigmaX ?? 0.28;
  const PINCH_SIG_Y = opts?.pinchSigmaY ?? 0.42;
  const RLOBE       = opts?.rightLobe ?? 0.10;
  const RLOBE_SHIFT = opts?.rightLobeShift ?? 0.85;
  const RLOBE_SIG   = opts?.rightLobeSigma ?? 0.60;
  const SKEW_X      = opts?.skewX ?? 0.06;
  const WAMP        = opts?.wobbleAmp ?? 0.07;
  const WFREQ       = opts?.wobbleFreq ?? 1.15;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pos = (geom.getAttribute('position') as THREE.BufferAttribute).array as Float32Array;
    const n = pos.length / 3;

    const wobbleGlobal = WAMP * Math.sin(t * WFREQ);
    const wobbleAlt    = (WAMP * 0.7) * Math.sin(t * (WFREQ * 1.7) + 1.2);

    for (let i = 0; i < n; i++) {
      const i3 = i * 3;
      const ox = original[i3 + 0];
      const oy = original[i3 + 1];
      const oz = original[i3 + 2];

      const len = Math.max(Math.hypot(ox, oy, oz), 1e-6);
      const nx = ox / len, ny = oy / len, nz = oz / len;

      const dxL = ox + BIAS, dxR = ox - BIAS;
      const d2L = dxL*dxL + oy*oy + oz*oz;
      const d2R = dxR*dxR + oy*oy + oz*oz;
      const gL = Math.exp(-d2L / (2 * SIGMA * SIGMA));
      const gR = Math.exp(-d2R / (2 * SIGMA * SIGMA));

      let disp = BULGE * gR - INDENT * gL;

      const px = ox / PINCH_SIG_X, py = (oy - 0.18) / PINCH_SIG_Y;
      const pinch = PINCH * Math.exp(-(px * px + py * py));
      disp -= pinch;

      const rx = (ox - RLOBE_SHIFT);
      const r2 = (rx*rx + oy*oy + oz*oz) / (2 * RLOBE_SIG * RLOBE_SIG);
      const swell = RLOBE * Math.exp(-r2);
      disp += swell;

      const squash = 1 - THREE.MathUtils.smoothstep(oy, -1.0, 0.3);
      disp -= 0.08 * squash;

      disp += wobbleGlobal * (0.8 + 0.2 * Math.sin(ox * 3.0 + t * 1.2));
      disp += wobbleAlt    * (0.7 + 0.3 * Math.sin(oy * 2.4 + t * 0.9));

      let nxpos = ox + nx * disp;
      let nypos = oy + ny * disp;
      let nzpos = oz + nz * disp;

      nxpos += SKEW_X * (ny) * (0.6 + 0.4 * Math.sin(t + oy * 3.0));

      pos[i3 + 0] = nxpos;
      pos[i3 + 1] = nypos;
      pos[i3 + 2] = nzpos;
    }

    (geom.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    geom.computeVertexNormals();
    geom.computeBoundingBox();
  });

  return geom;
}

/* ====================== 중앙 어둡게(로고 가독성) ====================== */
function CenterDarken({ radius = 0.92, opacity = 0.72 }) {
  const tex = useMemo(() => {
    const s = 256, c = document.createElement('canvas');
    c.width = s; c.height = s;
    const x = c.getContext('2d')!;
    const g = x.createRadialGradient(s/2, s/2, 0, s/2, s/2, s/2);
    g.addColorStop(0.0, 'rgba(0,0,0,0.85)');
    g.addColorStop(0.55,'rgba(0,0,0,0.40)');
    g.addColorStop(1.0, 'rgba(0,0,0,0)');
    x.fillStyle = g; x.fillRect(0,0,s,s);
    const t = new THREE.Texture(c);
    t.needsUpdate = true; t.minFilter = THREE.LinearFilter;
    return t;
  }, []);

  return (
    <sprite position={[0,0,0.07]} scale={[radius, radius, 1]}>
      <spriteMaterial map={tex} blending={THREE.MultiplyBlending} depthWrite={false} opacity={opacity} transparent />
    </sprite>
  );
}

/* ====================== 로고 SVG 중앙 오버레이 ====================== */
function CenterLogo() {
  return (
    <Html center transform sprite zIndexRange={[10, 0]} scale={0.82}>
      
    </Html>
  );
}

/* ====================== 선명한 림(Fresnel) ====================== */
function FresnelRim({ color = '#FFFFFF' }) {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  useFrame(({ clock }) => { if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime(); });
  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(color) },
    uPower: { value: 2.7 },
    uIntensity: { value: 1.55 },
    uTime: { value: 0 },
  }), [color]);

  return (
    <mesh scale={1.006}>
      <sphereGeometry args={[1, 160, 160]} />
      <shaderMaterial
        ref={matRef}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={/* glsl */`
          varying vec3 vN; varying vec3 vWP;
          void main(){
            vN = normalize(normalMatrix * normal);
            vec4 wp = modelMatrix * vec4(position,1.0);
            vWP = wp.xyz;
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `}
        fragmentShader={/* glsl */`
          uniform vec3 uColor; uniform float uPower; uniform float uIntensity; uniform float uTime;
          varying vec3 vN; varying vec3 vWP;
          void main(){
            vec3 V = normalize(cameraPosition - vWP);
            float f = pow(1.0 - max(dot(normalize(vN), V), 0.0), uPower);
            f *= (0.9 + 0.22 * sin(uTime*1.2));
            vec3 col = uColor * f * uIntensity;
            gl_FragColor = vec4(col, f);
          }
        `}
      />
    </mesh>
  );
}

/* ====================== 글래스 코어 & 네온 스킨 (지오메트리만) ====================== */
function GlassCoreMesh() {
  const geom = useBeanGeometry(1, 160, 160, {
    indent: 0.28, bulge: 0.30, sigma: 0.50, bias: 0.50,
    pinch: 0.16, pinchSigmaX: 0.30, pinchSigmaY: 0.45,
    rightLobe: 0.10, rightLobeShift: 0.82, rightLobeSigma: 0.62,
    skewX: 0.05, wobbleAmp: 0.05, wobbleFreq: 1.0,
  });
  return (
    <mesh geometry={geom} scale={0.985}>
      <MeshTransmissionMaterial
        transmission={1}
        thickness={1.28}
        roughness={0.08}
        ior={1.36}
        chromaticAberration={0.018}
        anisotropy={0.12}
        clearcoat={1}
        clearcoatRoughness={0.12}
        attenuationColor="#ABB9FF"
        attenuationDistance={0.52}
        color="#FFFFFF"
        backside
      />
    </mesh>
  );
}

function NeonSkinMesh({ matRef }:{ matRef: React.MutableRefObject<any> }) {
  const geom = useBeanGeometry(1, 160, 160, {
    indent: 0.36, bulge: 0.40, sigma: 0.42, bias: 0.58,
    pinch: 0.22, pinchSigmaX: 0.26, pinchSigmaY: 0.40,
    rightLobe: 0.12, rightLobeShift: 0.90, rightLobeSigma: 0.58,
    skewX: 0.08, wobbleAmp: 0.075, wobbleFreq: 1.2,
  });
  return (
    <mesh geometry={geom} scale={1.07}>
      <MeshDistortMaterial
        ref={matRef}
        color="#FFFFFF"
        emissive="#FFFFFF"
        emissiveIntensity={0.26}
        roughness={0.13}
        metalness={0.06}
        transparent
        opacity={0.48}
        distort={0.28}
        speed={1.3}
      />
    </mesh>
  );
}

/* ====================== 공통 그룹: 여기만 회전/스케일/이동 ====================== */
const BeanGroup = forwardRef<THREE.Group, { children: React.ReactNode }>(function BeanGroup({ children }, ref) {
  const group = useRef<THREE.Group>(null!);
  // 부모로 ref 전달
  // @ts-ignore
  if (ref) (ref as any).current = group.current;

  const neonMat = useRef<any>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // 그룹 단위 애니메이션 → 내부 Html/스프라이트도 함께 움직임
    group.current.rotation.y = Math.sin(t*0.26)*0.28;
    group.current.rotation.x = Math.sin(t*0.34)*0.16;
    const sx = 1.0 + Math.sin(t*1.05) * 0.12;
    const sy = 1.0 + Math.sin(t*1.45 + 0.7) * 0.14;
    const sz = 1.0 + Math.sin(t*0.85 + 1.3) * 0.11;
    group.current.scale.set(sx, sy, sz);
    group.current.position.y = Math.sin(t*0.95)*0.03 - 0.02;

    if (neonMat.current) {
      neonMat.current.distort = 0.26 + Math.sin(t*1.3)*0.14;
    }
  });

  return (
    <group ref={group}>
      <GlassCoreMesh />
      <NeonSkinMesh matRef={neonMat} />
      {/* 중앙에 붙어있는 애들 */}
      <CenterDarken />
      <CenterLogo />
      <FresnelRim color="#FFFFFF" />
      {children}
    </group>
  );
});

/* ====================== 배경 네온 글로우 ====================== */
function BackGlow() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: `
          radial-gradient(72% 66% at 54% 16%, rgba(171,185,255,0.65) 0%, rgba(171,185,255,0.18) 36%, rgba(171,185,255,0) 70%),
          radial-gradient(82% 76% at 78% 72%, rgba(255,35,97,0.70) 0%, rgba(255,35,97,0.28) 46%, rgba(255,35,97,0) 78%),
          radial-gradient(82% 76% at 24% 72%, rgba(101,67,255,0.60) 0%, rgba(101,67,255,0.26) 46%, rgba(101,67,255,0) 78%),
          radial-gradient(72% 58% at 70% 36%, rgba(255,0,55,0.65) 0%, rgba(255,0,55,0.25) 50%, rgba(255,0,55,0) 80%)
        `,
        filter: 'blur(14px)',
        mixBlendMode: 'overlay',
        opacity: 0.96,
      }}
    />
  );
}

/* ====================== 캔버스 페이드 마스크 ====================== */
const maskStyle: React.CSSProperties = {
  WebkitMaskImage: 'radial-gradient(closest-side, #000 82%, rgba(0,0,0,0) 96%)',
  maskImage: 'radial-gradient(closest-side, #000 82%, rgba(0,0,0,0) 96%)',
};

/* ====================== 메인 ====================== */
export default function BlobLogo3D({ size = 300, className }: Props) {
  return (
    <div className={`relative ${className ?? ''}`} style={{ width: size, height: size, isolation: 'isolate', ...maskStyle }}>
      <BackGlow />
      <Canvas
        className="absolute inset-0"
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0.05, 3.0], fov: 45 }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.06;
          scene.background = null;
        }}
      >
        {/* 라이트 팔레트 */}
        <ambientLight intensity={0.34} />
        <spotLight position={[0, 3.0, 2.2]} angle={1.05} penumbra={0.95} intensity={1.45} color="#ffffff" />
        <pointLight position={[-2.6, -0.1, 1.2]} intensity={1.40} color="#6543FF" />
        <pointLight position={[ 2.3, -0.1, 1.0]} intensity={1.50} color="#FF2361" />
        <pointLight position={[ 0.0, -1.5, 1.0]} intensity={0.95} color="#ABB9FF" />
        <pointLight position={[ 0.0,  1.2,-1.2]} intensity={0.75} color="#FF0037" />

        <Suspense fallback={null}>
          {/* ✅ 그룹 하나만 움직인다 → 로고가 항상 중앙 */}
          <BeanGroup>
            <CenterDarken />
            <CenterLogo />
            <FresnelRim color="#FFFFFF" />
          </BeanGroup>

          <EffectComposer multisampling={0} enableNormalPass={false}>
            <SMAA />
            <Bloom intensity={0.98} luminanceThreshold={0.72} luminanceSmoothing={0.16} mipmapBlur />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}

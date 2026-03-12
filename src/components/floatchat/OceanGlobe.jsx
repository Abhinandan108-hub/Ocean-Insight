import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Stars } from "@react-three/drei";
import * as THREE from "three";

function FloatDots({ count = 120 }) {
  const meshRef = useRef();
  const positions = useMemo(() => {
    const pts = [];
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const r = 1.02;
      pts.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
    }
    return new Float32Array(pts);
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="#0EA5A4"
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
}

function GlobeMesh({ color = "#0E2A47", wireColor = "#0EA5A4" }) {
  const globeRef = useRef();
  const wireRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (globeRef.current) globeRef.current.rotation.y = t * 0.07;
    if (wireRef.current) wireRef.current.rotation.y = t * 0.07;
  });

  return (
    <>
      <mesh ref={globeRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color={color}
          metalness={0.1}
          roughness={0.7}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh ref={wireRef}>
        <sphereGeometry args={[1.001, 24, 24]} />
        <meshBasicMaterial
          color={wireColor}
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>
    </>
  );
}

function PulseRing() {
  const ringRef = useRef();
  useFrame((state) => {
    const s = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.04;
    if (ringRef.current) {
      ringRef.current.scale.setScalar(s);
      ringRef.current.material.opacity = 0.12 + Math.sin(state.clock.elapsedTime * 1.5) * 0.06;
    }
  });
  return (
    <mesh ref={ringRef}>
      <sphereGeometry args={[1.12, 32, 32]} />
      <meshBasicMaterial color="#0EA5A4" transparent opacity={0.1} side={THREE.BackSide} />
    </mesh>
  );
}

export default function OceanGlobe({ className = "" }) {
  return (
    <div className={`w-full h-full ${className}`} style={{ pointerEvents: "none" }}>
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-2, -2, -2]} intensity={0.5} color="#0EA5A4" />
        <Stars radius={6} depth={3} count={800} factor={0.5} saturation={0} fade speed={0.5} />
        <GlobeMesh />
        <FloatDots count={180} />
        <PulseRing />
      </Canvas>
    </div>
  );
}

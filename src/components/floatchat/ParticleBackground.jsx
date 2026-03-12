import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// Variant: "neural" (login), "wave" (signup), "data" (dashboard)
function NeuralNet({ count = 80 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 3);
    }
    return new Float32Array(arr);
  }, [count]);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#0EA5A4" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function WaveParticles({ count = 200 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 4;
      arr.push(x, 0, z);
    }
    return new Float32Array(arr);
  }, [count]);

  useFrame((state) => {
    const pos = ref.current?.geometry.attributes.position;
    if (!pos) return;
    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, Math.sin(x * 0.8 + state.clock.elapsedTime) * 0.3 + Math.cos(z * 0.6 + state.clock.elapsedTime * 0.7) * 0.2);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#0EA5A4" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function DataStreams({ count = 60 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 2);
    }
    return new Float32Array(arr);
  }, [count]);

  useFrame((state) => {
    const pos = ref.current?.geometry.attributes.position;
    if (!pos) return;
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) - 0.02;
      if (y < -3) y = 3;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#0EA5A4" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

export default function ParticleBackground({ variant = "neural", className = "" }) {
  return (
    <div className={`w-full h-full ${className}`} style={{ pointerEvents: "none" }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }} gl={{ antialias: true, alpha: true }} style={{ background: "transparent" }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[2, 2, 2]} intensity={0.8} color="#0EA5A4" />
        <Stars radius={8} depth={4} count={600} factor={0.4} saturation={0} fade speed={0.3} />
        {variant === "neural" && <NeuralNet />}
        {variant === "wave" && <WaveParticles />}
        {variant === "data" && <DataStreams />}
      </Canvas>
    </div>
  );
}

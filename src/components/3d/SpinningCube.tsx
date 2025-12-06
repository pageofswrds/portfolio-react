"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, Suspense } from "react";
import { Mesh } from "three";

function Cube() {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.2 : 1}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={hovered ? "#ff6b6b" : "#4ecdc4"}
        emissive={hovered ? "#ff6b6b" : "#4ecdc4"}
        emissiveIntensity={0.5}
        toneMapped={false}
      />
    </mesh>
  );
}

export default function SpinningCube({ className }: { className?: string }) {
  return (
    <div className={className} style={{ background: "#1A1714" }}>
      <Canvas>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <Cube />
        </Suspense>
      </Canvas>
    </div>
  );
}

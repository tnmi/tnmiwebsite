"use client";

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface FluidGlassBarProps {
  children?: React.ReactNode;
  ior?: number;
  thickness?: number;
  chromaticAberration?: number;
  anisotropy?: number;
  transmission?: number;
  roughness?: number;
  scale?: number;
}

function BarMesh({
  ior = 1.15,
  thickness = 10,
  chromaticAberration = 0.05,
  anisotropy = 0.01,
  transmission = 1,
  roughness = 0,
}: Omit<FluidGlassBarProps, 'children' | 'scale'>) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      // Very subtle rotation
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      mesh.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.15) * 0.1;
    }
  });

  return (
    <mesh ref={mesh} scale={[1, 1, 1]}>
      <planeGeometry args={[5, 5, 16, 16]} />
      <MeshTransmissionMaterial
        ior={ior}
        thickness={thickness}
        chromaticAberration={chromaticAberration}
        anisotropy={anisotropy}
        transmission={transmission}
        roughness={roughness}
        toneMapped={false}
        samples={4}
        resolution={256}
      />
    </mesh>
  );
}

export function FluidGlassBar({
  children,
  ior = 1.15,
  thickness = 10,
  chromaticAberration = 0.05,
  anisotropy = 0.01,
  transmission = 1,
  roughness = 0,
  scale = 0.15,
}: FluidGlassBarProps) {
  return (
    <div className="relative w-full h-full">
      {/* Three.js Canvas for glass effect - BEHIND content */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ 
          opacity: scale,
          mixBlendMode: 'screen',
        }}
      >
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 0, 3], fov: 50 }}
            dpr={[1, 1.5]} // Limit DPR for performance
            gl={{ 
              alpha: true, 
              antialias: false, // Disable for performance
              powerPreference: 'high-performance',
            }}
            frameloop="demand" // Only render when needed
          >
            <Suspense fallback={null}>
              <Environment preset="sunset" background={false} />
              <BarMesh
                ior={ior}
                thickness={thickness}
                chromaticAberration={chromaticAberration}
                anisotropy={anisotropy}
                transmission={transmission}
                roughness={roughness}
              />
            </Suspense>
          </Canvas>
        </Suspense>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}

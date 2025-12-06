import "@/app/styles.css";
import dynamic from "next/dynamic";
import BackgroundSetter from "@/lib/setbg";
import SiteBar from "@/components/ui/custom/SiteBar";

import { useRef, useState, useEffect, Suspense, useMemo } from "react";
import * as THREE from "three";
import { Mesh, Euler } from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  OrbitControls,
  Environment,
  Text,
  Text3D,
  MeshTransmissionMaterial,
  OrthographicCamera,
} from "@react-three/drei";
import { Orbit } from "next/font/google";
import { useControls } from "leva";
import { ChromaticAberration } from "@react-three/postprocessing";
import { EffectComposer, N8AO, SMAA } from "@react-three/postprocessing";

export default function GlassScene() {
  return (
    <Canvas>
      {/* <OrthographicCamera
        makeDefault
        near={1}
        far={2000}
        position={[0, 0, 200]}
      /> */}
      <ambientLight intensity={1} />
      {/* <pointLight position={[4, 4, 4]} /> */}
      <directionalLight intensity={3} position={[0, 3, 2]} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      {/* <OrbitControls /> */}
      <Environment preset="city" />

      {/* <EffectComposer multisampling={0}>
        <N8AO halfRes color="black" aoRadius={2} intensity={1} aoSamples={6} denoiseSamples={4} />
        <SMAA />
      </EffectComposer> */}
    </Canvas>
  );
}

function Model() {
  const meshRef = useRef<Mesh>(null);
  const planeRef = useRef<Mesh>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const textPos = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)];
  const textRot = [new THREE.Euler(0, 0, 0), new THREE.Euler(0, 0, 0)];
  const planePos = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, -0.25, -1),
  ];
  const planeRot = [new THREE.Euler(0, 0, 0), new THREE.Euler(-1.3, 0, 0.75)];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { nodes } = useGLTF("./models/torus.glb") as any;
  // const { nodes } = useGLTF('./models/poly.glb')
  const { viewport } = useThree();

  useFrame((state, delta) => {
    if (!meshRef.current) {
      return;
    }

    const speed = isHovered ? 1 : 0.5;

    meshRef.current.rotation.x += delta * speed;
    meshRef.current.rotation.z += delta * speed;

    if (isHovered) {
      // planeRef.current.rotation.y += delta * speed;
      // planeRef.current.position.lerp(posB, delta * 3);
      // planeRef.current.setRotationFromEuler(rotB);
    } else {
      // planeRef.current.scale
      // planeRef.current.position.lerp(posA, delta * 3);
      // planeRef.current.setRotationFromEuler(rotA);
    }
  });

  // glass
  // const materialProps = useControls({
  //   thickness: { value: 0.2, min: 0, max: 3, step: 0.05 },
  //   roughness: { value: 0, min: 0, max: 1, step: 0.1 },
  //   transmission: { value: 1, min: 0, max: 1, step: 0.1},
  //   ior: { value: 1.2, min: 0, max: 3, step: 0.01 },
  //   chromaticAberration: { value: 0.05, min: 0, max: 1 },
  //   backside: { value: true },
  // })
  const glassProps = useMemo(
    () => [new THREE.BoxGeometry(), new THREE.SphereGeometry(0.785398)],
    []
  );

  // film effect
  // const materialProps = useControls({
  //   thickness: { value: 1.5, min: 0, max: 3, step: 0.05 },
  //   roughness: { value: 0.9, min: 0, max: 1, step: 0.1 },
  //   transmission: { value: 1, min: 0, max: 1, step: 0.1},
  //   ior: { value: 1.2, min: 0, max: 3, step: 0.01 },
  //   chromaticAberration: { value: 0.0, min: 0, max: 1 },
  //   backside: { value: true },
  // })

  return (
    <group
      scale={viewport.width / 4}
      onPointerEnter={(event) => (event.stopPropagation(), setIsHovered(true))}
      onPointerLeave={() => setIsHovered(false)}
      onClick={() => setIsClicked(!isClicked)}
    >
      {/* <group>
        <Text
          fontSize={0.5}
          font='fonts/GraphikMedium.otf'
          position={[-0.225, 0.225, -0.75]}
          letterSpacing={-0.05}
          color={"#FFFFFF"}
        >
          Interaction
        </Text>
        <Text
          fontSize={0.5}
          font='fonts/GraphikMedium.otf'
          position={[1.05, 0.225, -0.75]}
          letterSpacing={-0.05}
          color={isHovered ? "#FFC700": "#FFFFFF"}
        >
          *
        </Text>
        <Text 
          fontSize={0.5}
          font='fonts/GraphikMedium.otf'
          position={[0.475, -0.225, -0.75]}
          letterSpacing={-0.05}
          color={"#ffffff"}
        >
          Designer
        </Text>

      </group> */}

      <mesh
        {...nodes.Torus001}
        ref={meshRef}
        position={[0, 0, 0.2]}
        scale={0.5}
      >
        {/* <planeGeometry  /> */}
        <MeshTransmissionMaterial
          thickness={0.2}
          roughness={0}
          transmission={1}
          ior={0.8}
          chromaticAberration={0.03}
          backside={true}
        />
      </mesh>
      {/* <mesh {...nodes.Torus001} ref={meshRef} position={[0, 0, 0.2]} scale={0.5}>
        <MeshTransmissionMaterial {...materialProps} />
      </mesh> */}
      {/* <mesh>
        <boxGeometry/>
        <MeshTransmissionMaterial {...materialProps} />
      </mesh> */}
    </group>
  );
}

//   thickness: { value: 0.2, min: 0, max: 3, step: 0.05 },
//   roughness: { value: 0, min: 0, max: 1, step: 0.1 },
//   transmission: { value: 1, min: 0, max: 1, step: 0.1},
//   ior: { value: 1.2, min: 0, max: 3, step: 0.01 },
//   chromaticAberration: { value: 0.05, min: 0, max: 1 },
//   backside: { value: true },

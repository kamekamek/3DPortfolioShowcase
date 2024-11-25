import { useRef, useEffect, Suspense, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Html } from "@react-three/drei";
import ProjectCard from "./ProjectCard";
import { useProjects } from "@/lib/hooks/useProjects";
import * as THREE from "three";

export default function Scene() {
  const { camera } = useThree();
  const controlsRef = useRef<any>();
  const { data: projects = [] } = useProjects();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (projects.length > 0) {
      setIsLoading(false);
    }
  }, [projects]);

  useEffect(() => {
    if (camera) {
      camera.position.set(0, 3, 8);
      camera.lookAt(0, 0, 0);
    }

    // WebGLコンテキストの設定
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const gl = canvas.getContext('webgl2', {
        powerPreference: 'high-performance',
        antialias: true,
        alpha: false,
        stencil: false
      });
      
      // コンテキスト復帰のハンドリング
      canvas.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        console.warn('WebGL context lost, attempting to restore...');
      });
      
      canvas.addEventListener('webglcontextrestored', () => {
        console.log('WebGL context restored');
      });
    }
  }, [camera]);

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  // プロジェクトカードを円形に配置
  const calculatePosition = (index: number, total: number) => {
    const radius = 5;
    const angle = (index / total) * Math.PI * 2;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    return [x, 0, z] as [number, number, number];
  };

  // カードの回転を中心を向くように計算
  const calculateRotation = (position: [number, number, number]) => {
    const angle = Math.atan2(position[0], position[2]);
    return [0, angle, 0] as [number, number, number];
  };

  if (isLoading) {
    return <Html center>
      <div className="text-white">Loading projects...</div>
    </Html>;
  }

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 3, 8]} fov={75} />
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.08}
        minDistance={5}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
        rotateSpeed={0.8}
      />
      
      <fog attach="fog" args={["#202020", 5, 25]} />
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <hemisphereLight intensity={0.2} />

      <gridHelper args={[20, 20, "#303030", "#202020"]} />

      <Suspense fallback={null}>
        {projects.map((project, index) => {
          const position = calculatePosition(index, projects.length);
          const rotation = calculateRotation(position);
          return (
            <ProjectCard
              key={project.id}
              project={project}
              position={position}
              rotation={rotation}
            />
          );
        })}
      </Suspense>
    </>
  );
}

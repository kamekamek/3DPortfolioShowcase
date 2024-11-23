import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import ProjectCard from "./ProjectCard";
import { useProjects } from "@/lib/hooks/useProjects";
import * as THREE from "three";

export default function Scene() {
  const { camera } = useThree();
  const controlsRef = useRef<any>();
  const { data: projects = [] } = useProjects();

  useEffect(() => {
    if (camera) {
      camera.position.set(0, 3, 8);
      camera.lookAt(0, 0, 0);
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

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 3, 8]} fov={75} />
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <hemisphereLight intensity={0.3} />

      <gridHelper args={[20, 20, "#303030", "#202020"]} />

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
    </>
  );
}

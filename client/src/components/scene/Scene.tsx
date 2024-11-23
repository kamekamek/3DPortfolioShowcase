import { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ProjectCard from "./ProjectCard";
import { useProjects } from "@/lib/hooks/useProjects";

export default function Scene() {
  const { camera } = useThree();
  const controlsRef = useRef<any>();
  const { data: projects = [] } = useProjects();

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        camera={camera}
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={10}
      />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      <gridHelper args={[20, 20, "#303030", "#202020"]} />

      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          position={project.position}
          rotation={project.rotation}
        />
      ))}
    </>
  );
}

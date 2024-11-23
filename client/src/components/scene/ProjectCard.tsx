import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import type { Project } from "@/lib/types";
import ProjectDialog from "../ProjectDialog";
import { useUpdateProjectTransform } from "@/lib/hooks/useProjects";
import * as THREE from "three";

interface ProjectCardProps {
  project: Project;
  position: [number, number, number];
  rotation: [number, number, number];
}

export default function ProjectCard({ project, position, rotation }: ProjectCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const updateTransform = useUpdateProjectTransform();
  const texture = useLoader(THREE.TextureLoader, project.image);

  useEffect(() => {
    texture.encoding = THREE.sRGBEncoding;
    texture.needsUpdate = true;
  }, [texture]);

  useFrame((state) => {
    if (meshRef.current && hovered) {
      // スムーズなホバーアニメーション
      meshRef.current.rotation.y += Math.sin(state.clock.elapsedTime) * 0.01;
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
    } else if (meshRef.current) {
      // 元の状態に戻る
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  const handleDragEnd = () => {
    if (meshRef.current) {
      updateTransform.mutate({
        id: project.id,
        position: [
          meshRef.current.position.x,
          meshRef.current.position.y,
          meshRef.current.position.z,
        ],
        rotation: [
          meshRef.current.rotation.x,
          meshRef.current.rotation.y,
          meshRef.current.rotation.z,
        ],
      });
    }
  };

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setDialogOpen(true)}
        scale={1}
      >
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial
          map={texture}
          color={hovered ? "#ffffff" : "#dddddd"}
          metalness={0.3}
          roughness={0.7}
          transparent
          opacity={0.95}
        >
          <primitive attach="map" object={texture} />
        </meshStandardMaterial>
      </mesh>

      <ProjectDialog
        project={project}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </group>
  );
}

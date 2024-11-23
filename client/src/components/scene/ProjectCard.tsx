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
  const targetScale = useRef(new THREE.Vector3(1, 1, 1));
  const targetRotation = useRef(new THREE.Euler());
  const texture = useLoader(THREE.TextureLoader, project.image);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (hovered) {
      // ホバー時のアニメーション
      targetScale.current.setScalar(1.1);
      targetRotation.current.y += delta * 0.5;
    } else {
      // 通常状態
      targetScale.current.setScalar(1);
      targetRotation.current.y = rotation[1];
    }

    // スムーズな補間
    meshRef.current.scale.lerp(targetScale.current, 0.1);
    meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 0.1;
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
      >
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial
          map={texture}
          color={hovered ? "#ffffff" : "#dddddd"}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      <ProjectDialog
        project={project}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </group>
  );
}

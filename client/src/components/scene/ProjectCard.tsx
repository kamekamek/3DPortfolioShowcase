import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Project } from "@/lib/types";
import ProjectDialog from "../ProjectDialog";
import { useUpdateProjectTransform } from "@/lib/hooks/useProjects";

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

  useFrame(() => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y += 0.01;
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
      >
        <boxGeometry args={[1, 1.5, 0.1]} />
        <meshStandardMaterial
          color={hovered ? "#ffffff" : "#888888"}
          metalness={0.5}
          roughness={0.5}
        />
        
        <Html
          transform
          position={[0, 0, 0.06]}
          className="pointer-events-none"
          center
        >
          <div className="w-32 h-48 bg-black/80 rounded p-2 text-white">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-24 object-cover rounded"
            />
            <h3 className="text-sm font-bold mt-2">{project.title}</h3>
          </div>
        </Html>
      </mesh>

      <ProjectDialog
        project={project}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </group>
  );
}

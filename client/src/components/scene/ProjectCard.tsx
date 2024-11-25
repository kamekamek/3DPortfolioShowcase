import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import type { Project } from "@/lib/types";
import { useUpdateProjectTransform } from "@/lib/hooks/useProjects";
import { useProjectStore } from "@/lib/store";
import * as THREE from "three";

// アニメーション定数
const HOVER_SCALE = 1.08;  // スケールを少し大きく
const ROTATION_SPEED = 0.2; // 回転速度を調整
const LERP_FACTOR = 0.1;   // よりスムーズな遷移
const GLOW_INTENSITY = 0.5; // グローエフェクトの強度

interface ProjectCardProps {
  project: Project;
  position: [number, number, number];
  rotation: [number, number, number];
}

export default function ProjectCard({ project, position, rotation }: ProjectCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const updateTransform = useUpdateProjectTransform();
  const setSelectedProject = useProjectStore(state => state.setSelectedProject);
  const targetScale = useRef(new THREE.Vector3(1, 1, 1));
  const targetRotation = useRef(new THREE.Euler());
  const texture = useLoader(THREE.TextureLoader, project.image, (loader) => {
    loader.setCrossOrigin('anonymous');
  });

  // テクスチャ最適化とWebGLコンテキスト復帰ハンドリング
  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
  }, [texture]);

  // よりスムーズなアニメーション
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (hovered) {
      targetScale.current.setScalar(HOVER_SCALE);
      targetRotation.current.y += delta * ROTATION_SPEED;
    } else {
      targetScale.current.setScalar(1);
      targetRotation.current.y = rotation[1];
    }

    meshRef.current.scale.lerp(targetScale.current, LERP_FACTOR);
    meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * LERP_FACTOR;
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
      <group
        position={position}
        rotation={rotation}
      >
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => setSelectedProject(project)}
        >
          <boxGeometry args={[2, 3, 0.1]} />
          <meshPhysicalMaterial
            map={texture}
            color={hovered ? "#ffffff" : "#dddddd"}
            metalness={0.4}
            roughness={0.6}
            clearcoat={0.5}
            clearcoatRoughness={0.3}
            envMapIntensity={hovered ? 1.2 : 0.8}
            emissive={hovered ? "#404040" : "#000000"}
            emissiveIntensity={hovered ? GLOW_INTENSITY : 0}
          />
        </mesh>
      </group>
    </group>
  );
}

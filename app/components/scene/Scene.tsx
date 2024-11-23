"use client";

import React, { useRef, useEffect, Suspense } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import ProjectCard from "./ProjectCard";
import { useProjects } from "@/app/lib/hooks/useProjects";
import * as THREE from "three";
import { useToast } from "@/app/components/ui/use-toast";

export default function Scene() {
  const { camera } = useThree();
  const controlsRef = useRef<any>();
  const { data: projects = [], isError, error } = useProjects();
  const { toast } = useToast();
  
  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again later.",
        variant: "destructive",
      });
      console.error(error);
    }
  }, [isError, error, toast]);

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

  if (isError) {
    return null;
  }

  return (
    <>
      <Environment preset="city" />
      <PerspectiveCamera makeDefault position={[0, 3, 8]} fov={75} />
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />
      
      <ambientLight intensity={0.8} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <spotLight
        position={[-10, 10, -5]}
        intensity={0.5}
        angle={0.5}
        penumbra={1}
      />

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

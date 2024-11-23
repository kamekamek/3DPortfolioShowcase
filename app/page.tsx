"use client";

import { Canvas } from "@react-three/fiber";
import Scene from "@/components/scene/Scene";
import Navigation from "@/components/Navigation";
import DialogContainer from "@/components/DialogContainer";

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <Navigation />
      <Canvas
        camera={{ position: [0, 2, 5], fov: 75 }}
        className="bg-gradient-to-b from-black to-gray-900"
      >
        <Scene />
      </Canvas>
      <DialogContainer />
    </div>
  );
}

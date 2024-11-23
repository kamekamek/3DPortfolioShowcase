import { Canvas } from "@react-three/fiber";
import Scene from "@/components/scene/Scene";
import Navigation from "@/components/Navigation";

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
    </div>
  );
}

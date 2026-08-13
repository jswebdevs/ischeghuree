"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF, Environment } from "@react-three/drei";
import { Loader2 } from "lucide-react";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function Product3DViewer({ url }: { url: string }) {
  return (
    <div className="aspect-[4/5] sm:aspect-square bg-card border border-border rounded-3xl overflow-hidden relative">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6} adjustCamera={1.2}>
            <Model url={url} />
          </Stage>
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={1.5}
          maxDistance={8}
          autoRotate
          autoRotateSpeed={0.6}
        />
      </Canvas>
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-card/80 backdrop-blur-sm border border-border rounded-full px-3 py-1">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}

// Fallback shown while drei resolves the GLTF.
export function Viewer3DFallback() {
  return (
    <div className="aspect-[4/5] sm:aspect-square bg-card border border-border rounded-3xl flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );
}

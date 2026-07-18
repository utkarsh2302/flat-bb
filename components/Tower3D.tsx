"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Html } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Mesh } from "three";
import type { UnitStatus } from "@/lib/data";
import { dominantStatus } from "@/lib/status";
import { useApp } from "@/lib/store";

// Input: the units on each floor. Live status is computed from the store OUTSIDE
// the Canvas (React context does not cross the R3F reconciler boundary).
export interface Tower3DFloor {
  floor: number;
  unitIds: string[];
}
interface FloorView {
  floor: number;
  status: UnitStatus;
  available: number;
}

const COLOR: Record<UnitStatus, string> = {
  available: "#ff4f00",
  held: "#d6d3d1",
  booked: "#2a2622",
};
const GAP = 0.34;
const W = 3.2;
const D = 2.2;
const H = 0.26;

function Floor({ data, y, onPick }: { data: FloorView; y: number; onPick: (f: number) => void }) {
  const ref = useRef<Mesh>(null);
  const [hover, setHover] = useState(false);
  const color = COLOR[data.status];
  return (
    <mesh
      ref={ref}
      position={[0, y, 0]}
      scale={hover ? [1.05, 1, 1.05] : [1, 1, 1]}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = "auto"; }}
      onClick={(e) => { e.stopPropagation(); onPick(data.floor); }}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[W, H, D]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={data.status === "available" ? (hover ? 0.7 : 0.35) : hover ? 0.25 : 0}
        roughness={0.5}
        metalness={0.1}
      />
      {hover && (
        <Html center position={[W / 2 + 0.5, 0, 0]} distanceFactor={9} zIndexRange={[10, 0]}>
          <div className="pointer-events-none whitespace-nowrap rounded-md bg-ink px-2.5 py-1 text-[12px] font-semibold text-on-primary shadow-lg">
            Floor {data.floor} · {data.available > 0 ? `${data.available} available` : "sold out"}
          </div>
        </Html>
      )}
    </mesh>
  );
}

function Building({ floors, onPick }: { floors: FloorView[]; onPick: (f: number) => void }) {
  const total = floors.length;
  return (
    <group position={[0, -(total * GAP) / 2, 0]}>
      <mesh position={[0, -0.35, 0]} receiveShadow>
        <boxGeometry args={[W + 0.7, 0.5, D + 0.7]} />
        <meshStandardMaterial color="#e7e5e4" roughness={0.9} />
      </mesh>
      {floors.map((f, i) => (
        <Floor key={f.floor} data={f} y={i * GAP} onPick={onPick} />
      ))}
    </group>
  );
}

export default function Tower3D({
  towerId,
  towerName,
  floors,
}: {
  towerId: string;
  towerName: string;
  floors: Tower3DFloor[]; // ascending (floor 1 first)
}) {
  const router = useRouter();
  const { s } = useApp();
  const [mounted, setMounted] = useState(false);
  // Client-only mount gate so WebGL never runs during SSR.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const views: FloorView[] = floors.map((f) => {
    const st = f.unitIds.map((id) => s.unitStatus[id]);
    const available = st.filter((x) => x === "available").length;
    const held = st.filter((x) => x === "held").length;
    return { floor: f.floor, status: dominantStatus(available, held), available };
  });

  if (!mounted) {
    return <div className="h-[360px] w-full animate-pulse rounded-lg bg-canvas-soft sm:h-[440px]" />;
  }

  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-lg bg-gradient-to-b from-canvas-soft to-canvas sm:h-[440px]">
      <Canvas camera={{ position: [5.5, 2.5, 6.5], fov: 38 }} dpr={[1, 2]} shadows gl={{ antialias: true }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[6, 10, 6]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-6, 4, -6]} intensity={0.4} />
        <Building floors={views} onPick={(f) => router.push(`/explore/${towerId}/${f}`)} />
        <ContactShadows position={[0, -(views.length * GAP) / 2 - 0.62, 0]} opacity={0.35} scale={12} blur={2.4} far={4} />
        <OrbitControls
          makeDefault
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.6}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.9}
          minDistance={6}
          maxDistance={12}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
        <div className="rounded-md bg-canvas/80 px-3 py-1.5 text-[13px] font-semibold text-ink backdrop-blur">
          {towerName} · 3D
        </div>
        <div className="rounded-md bg-canvas/80 px-3 py-1.5 text-[12px] text-body backdrop-blur">
          Drag to rotate · tap a floor
        </div>
      </div>
    </div>
  );
}

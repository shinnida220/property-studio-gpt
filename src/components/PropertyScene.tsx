"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, ThreeEvent, useThree } from "@react-three/fiber";
import { Environment, Html, OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useEditorStore, type EditableTarget, type RoomId, type FurnitureItem } from "@/stores/editor-store";
import { WalkthroughPhysics } from "@/components/Walkthrough";

function Material({ color, roughness = 0.82 }: { color: string; roughness?: number }) {
  return <meshStandardMaterial color={color} roughness={roughness} />;
}

function RoomShell({
  position,
  width,
  depth,
  height = 3,
  wallColor,
  floorColor,
  ceilingColor,
  wallFinish,
  floorFinish,
  ceilingFinish,
  onWallClick,
  walkthrough
}: {
  position: [number, number, number];
  width: number;
  depth: number;
  height?: number;
  wallColor: string;
  floorColor: string;
  ceilingColor: string;
  wallFinish: { roughness: number; metalness: number };
  floorFinish: { roughness: number; metalness: number };
  ceilingFinish: { roughness: number; metalness: number };
  onWallClick: () => void;
  walkthrough: boolean;
  furniture: FurnitureItem[];
  selectedFurnitureId: string | null;
  selectFurniture: (id: string | null) => void;
  updateFurniture: (id: string, patch: Partial<Pick<FurnitureItem, "position" | "rotation" | "scale" | "color">>) => void;
}) {
  const doorwayWidth = 1.25;
  const segmentWidth = (width - doorwayWidth) / 2;
  return (
    <group position={position}>
      <mesh position={[0, 0.025, 0]} receiveShadow><boxGeometry args={[width, 0.05, depth]} /><meshStandardMaterial color={floorColor} roughness={floorFinish.roughness} metalness={floorFinish.metalness} /></mesh>
      <mesh position={[0, height / 2, -depth / 2]} castShadow receiveShadow onClick={(e) => { e.stopPropagation(); onWallClick(); }}><boxGeometry args={[width, height, 0.12]} /><meshStandardMaterial color={wallColor} roughness={wallFinish.roughness} metalness={wallFinish.metalness} /></mesh>
      <mesh position={[-width / 2, height / 2, 0]} castShadow receiveShadow onClick={(e) => { e.stopPropagation(); onWallClick(); }}><boxGeometry args={[0.12, height, depth]} /><Material color={wallColor} /></mesh>
      <mesh position={[width / 2, height / 2, 0]} castShadow receiveShadow onClick={(e) => { e.stopPropagation(); onWallClick(); }}><boxGeometry args={[0.12, height, depth]} /><Material color={wallColor} /></mesh>
      {walkthrough ? <>
        <mesh position={[-(doorwayWidth / 2 + segmentWidth / 2), height / 2, depth / 2]} castShadow><boxGeometry args={[segmentWidth, height, 0.12]} /><Material color={wallColor} /></mesh>
        <mesh position={[(doorwayWidth / 2 + segmentWidth / 2), height / 2, depth / 2]} castShadow><boxGeometry args={[segmentWidth, height, 0.12]} /><Material color={wallColor} /></mesh>
        <mesh position={[0, height - 0.3, depth / 2]} castShadow><boxGeometry args={[doorwayWidth, 0.6, 0.12]} /><Material color={wallColor} /></mesh>
      </> : <mesh position={[0, height / 2, depth / 2]} castShadow receiveShadow onClick={(e) => { e.stopPropagation(); onWallClick(); }}><boxGeometry args={[width, height, 0.12]} /><Material color={wallColor} /></mesh>}
      <mesh position={[0, height, 0]} receiveShadow><boxGeometry args={[width, 0.12, depth]} /><meshStandardMaterial color={ceilingColor} roughness={ceilingFinish.roughness} metalness={ceilingFinish.metalness} side={THREE.DoubleSide} /></mesh>
    </group>
  );
}
function Sofa({ color, onSelect }: { color: string; onSelect: () => void }) {
  return (
    <group position={[0, 0, 0]} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[2.05, 0.48, 0.82]} />
        <Material color={color} />
      </mesh>
      <mesh position={[0, 0.83, -0.34]} castShadow>
        <boxGeometry args={[2.05, 0.58, 0.16]} />
        <Material color={color} />
      </mesh>
      {[-0.95, 0.95].map((x) => (
        <mesh key={x} position={[x, 0.58, 0]} castShadow>
          <boxGeometry args={[0.18, 0.68, 0.86]} />
          <Material color={color} />
        </mesh>
      ))}
      {[-0.5, 0.5].map((x) => (
        <mesh key={x} position={[x, 0.78, -0.16]} rotation={[0.12, 0, 0]} castShadow>
          <boxGeometry args={[0.58, 0.42, 0.13]} />
          <meshStandardMaterial color="#eee7dc" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function Chair({ color, onSelect, position }: { color: string; onSelect: () => void; position: [number, number, number] }) {
  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      <mesh position={[0, 0.48, 0]} castShadow><boxGeometry args={[0.7, 0.14, 0.68]} /><Material color={color} /></mesh>
      <mesh position={[0, 0.88, -0.26]} castShadow><boxGeometry args={[0.7, 0.78, 0.12]} /><Material color={color} /></mesh>
      {[-0.27, 0.27].flatMap((x) => [-0.25, 0.25].map((z) => (
        <mesh key={`${x}-${z}`} position={[x, 0.23, z]} castShadow><boxGeometry args={[0.07, 0.46, 0.07]} /><Material color="#59483b" /></mesh>
      )))}
    </group>
  );
}

function Bed({ color, onSelect }: { color: string; onSelect: () => void }) {
  return (
    <group position={[0, 0, 0]} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      <mesh position={[0, 0.34, 0]} castShadow><boxGeometry args={[1.9, 0.48, 2.25]} /><Material color="#795d48" /></mesh>
      <mesh position={[0, 0.62, 0.05]} castShadow><boxGeometry args={[1.84, 0.18, 2.05]} /><Material color={color} /></mesh>
      {[-0.48, 0.48].map((x) => (
        <mesh key={x} position={[x, 0.78, -0.72]} castShadow><boxGeometry args={[0.68, 0.18, 0.46]} /><meshStandardMaterial color="#f2eee7" roughness={1} /></mesh>
      ))}
      <mesh position={[0, 0.67, 0.56]} castShadow><boxGeometry args={[1.84, 0.12, 0.82]} /><Material color={color} /></mesh>
    </group>
  );
}

function DiningTable() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.82, 0]} castShadow><boxGeometry args={[1.7, 0.12, 0.95]} /><Material color="#886648" /></mesh>
      {[-0.72, 0.72].flatMap((x) => [-0.35, 0.35].map((z) => (
        <mesh key={`${x}-${z}`} position={[x, 0.4, z]} castShadow><boxGeometry args={[0.09, 0.8, 0.09]} /><Material color="#654a36" /></mesh>
      )))}
    </group>
  );
}

function Window({ position, width = 1.35, height = 1.1 }: { position: [number, number, number]; width?: number; height?: number }) {
  return (
    <group position={position}>
      <mesh><boxGeometry args={[width, height, 0.06]} /><meshPhysicalMaterial color="#9bc4d2" roughness={0.08} metalness={0.05} transmission={0.12} transparent opacity={0.72} /></mesh>
      <mesh position={[0, 0, 0.045]}><boxGeometry args={[0.045, height, 0.035]} /><Material color="#f1eee7" /></mesh>
      <mesh position={[0, 0, 0.045]}><boxGeometry args={[width, 0.045, 0.035]} /><Material color="#f1eee7" /></mesh>
    </group>
  );
}

function HouseExterior({ wallColor }: { wallColor: string }) {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.04, 0]} receiveShadow><boxGeometry args={[13, 0.08, 11]} /><Material color="#8d927f" /></mesh>
      <mesh position={[0, 1.55, -1]} castShadow receiveShadow><boxGeometry args={[8.2, 3.1, 6.4]} /><Material color={wallColor} /></mesh>
      <mesh position={[0, 3.25, -1]} rotation={[0, 0, Math.PI / 4]} castShadow><boxGeometry args={[6.3, 0.2, 6.8]} /><Material color="#4c4d4b" /></mesh>
      <mesh position={[0, 1.1, 2.23]} castShadow><boxGeometry args={[1.15, 2.2, 0.12]} /><Material color="#674c38" /></mesh>
      <Window position={[-2.25, 1.85, 2.23]} width={1.65} height={1.25} />
      <Window position={[2.25, 1.85, 2.23]} width={1.65} height={1.25} />
      <mesh position={[0, 0.025, 3.9]} receiveShadow><boxGeometry args={[3.2, 0.05, 3.2]} /><Material color="#b6a48e" /></mesh>
      <mesh position={[-5.3, 0.55, -1]} castShadow><boxGeometry args={[1.5, 1.1, 1.5]} /><Material color="#b4b1a8" /></mesh>
      <mesh position={[5.3, 0.55, -1]} castShadow><boxGeometry args={[1.5, 1.1, 1.5]} /><Material color="#b4b1a8" /></mesh>
      {Array.from({ length: 7 }).map((_, i) => (
        <group key={i} position={[-5.7 + i * 1.9, 0, 5.15]}>
          <mesh position={[0, 0.35, 0]} castShadow><cylinderGeometry args={[0.32, 0.42, 0.7, 8]} /><Material color="#6b765b" /></mesh>
          <mesh position={[0, 0.95, 0]} castShadow><icosahedronGeometry args={[0.62, 1]} /><Material color="#54704e" /></mesh>
        </group>
      ))}
    </group>
  );
}

function FurnitureModel({ item, selected, onSelect }: { item: FurnitureItem; selected: boolean; onSelect: () => void }) {
  const color = item.color;
  return (
    <group position={item.position} rotation={item.rotation} scale={item.scale}
      onClick={(event) => { event.stopPropagation(); onSelect(); }}>
      {item.kind === "sofa" && <>
        <mesh position={[0, 0.38, 0]} castShadow><boxGeometry args={[1.8, 0.42, 0.78]} /><Material color={color} /></mesh>
        <mesh position={[0, 0.78, -0.3]} castShadow><boxGeometry args={[1.8, 0.48, 0.16]} /><Material color={color} /></mesh>
        {[-0.82, 0.82].map((x) => <mesh key={x} position={[x, 0.55, 0]} castShadow><boxGeometry args={[0.16, 0.62, 0.82]} /><Material color={color} /></mesh>)}
      </>}
      {item.kind === "armchair" && <>
        <mesh position={[0, 0.42, 0]} castShadow><boxGeometry args={[0.78, 0.22, 0.76]} /><Material color={color} /></mesh>
        <mesh position={[0, 0.82, -0.3]} castShadow><boxGeometry args={[0.78, 0.72, 0.14]} /><Material color={color} /></mesh>
        {[-0.3, 0.3].flatMap((x) => [-0.28, 0.28].map((z) => <mesh key={`${x}-${z}`} position={[x, 0.2, z]}><boxGeometry args={[0.07, 0.4, 0.07]} /><Material color="#59483b" /></mesh>))}
      </>}
      {(item.kind === "coffee-table" || item.kind === "dining-table") && <>
        <mesh position={[0, item.kind === "coffee-table" ? 0.42 : 0.78, 0]} castShadow><boxGeometry args={item.kind === "coffee-table" ? [1.15, 0.1, 0.72] : [1.65, 0.12, 0.95]} /><Material color={color} /></mesh>
        {[-0.7, 0.7].flatMap((x) => [-0.32, 0.32].map((z) => <mesh key={`${x}-${z}`} position={[x, item.kind === "coffee-table" ? 0.2 : 0.38, z]} castShadow><boxGeometry args={[0.07, item.kind === "coffee-table" ? 0.4 : 0.75, 0.07]} /><Material color="#654a36" /></mesh>))}
      </>}
      {item.kind === "bed" && <>
        <mesh position={[0, 0.28, 0]} castShadow><boxGeometry args={[1.8, 0.35, 2.1]} /><Material color="#795d48" /></mesh>
        <mesh position={[0, 0.52, 0.05]} castShadow><boxGeometry args={[1.76, 0.16, 1.95]} /><Material color={color} /></mesh>
        {[-0.45, 0.45].map((x) => <mesh key={x} position={[x, 0.68, -0.68]} castShadow><boxGeometry args={[0.62, 0.14, 0.4]} /><Material color="#f2eee7" /></mesh>)}
      </>}
      {item.kind === "plant" && <>
        <mesh position={[0, 0.18, 0]} castShadow><cylinderGeometry args={[0.22, 0.18, 0.36, 16]} /><Material color="#9b7554" /></mesh>
        <mesh position={[0, 0.82, 0]} castShadow><icosahedronGeometry args={[0.58, 1]} /><Material color={color} /></mesh>
        <mesh position={[0.22, 1.1, 0.12]} castShadow><icosahedronGeometry args={[0.34, 1]} /><Material color="#64845b" /></mesh>
      </>}
      {item.kind === "floor-lamp" && <>
        <mesh position={[0, 0.85, 0]} castShadow><cylinderGeometry args={[0.035, 0.045, 1.7, 12]} /><Material color="#9b865f" /></mesh>
        <mesh position={[0, 1.72, 0]} castShadow><coneGeometry args={[0.28, 0.42, 20]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.12} /></mesh>
        <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.28, 0.28, 0.12, 20]} /><Material color="#59483b" /></mesh>
      </>}
      {selected && <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.72, 0.78, 40]} />
        <meshBasicMaterial color="#4f9664" side={THREE.DoubleSide} />
      </mesh>}
    </group>
  );
}

function Interior({ room, colors, finishes, showFurniture, onSelect, walkthrough, furniture, selectedFurnitureId, selectFurniture, updateFurniture }: {
  room: RoomId;
  colors: Record<EditableTarget, string>;
  finishes: Record<"walls" | "floor" | "ceiling", { color: string; kind: string; roughness: number; metalness: number }>;
  showFurniture: boolean;
  onSelect: (target: EditableTarget) => void;
  walkthrough: boolean;
}) {
  if (room === "exterior") return <HouseExterior wallColor={colors.walls} />;

  const roomConfig: Record<Exclude<RoomId, "exterior">, { position: [number, number, number]; width: number; depth: number }> = {
    living: { position: [0, 0, 0], width: 7, depth: 6 },
    kitchen: { position: [0, 0, 0], width: 6, depth: 5 },
    bedroom: { position: [0, 0, 0], width: 6, depth: 5 },
    bathroom: { position: [0, 0, 0], width: 4.5, depth: 4 }
  };
  const config = roomConfig[room];

  return (
    <group>
      <RoomShell
        position={[0, 0, 0]}
        width={config.width}
        depth={config.depth}
        wallColor={colors.walls}
        floorColor={finishes.floor.color}
        ceilingColor={finishes.ceiling.color}
        wallFinish={finishes.walls}
        floorFinish={finishes.floor}
        ceilingFinish={finishes.ceiling}
        onWallClick={() => onSelect("walls")}
        walkthrough={walkthrough}
      />
      {room === "living" && showFurniture && (
        <>
          <group position={[0, 0, 1]}><Sofa color={colors.sofa} onSelect={() => onSelect("sofa")} /></group>
          <group position={[-2.1, 0, -1.4]}><Chair color={colors.chair} position={[0, 0, 0]} onSelect={() => onSelect("chair")} /></group>
          <group position={[0.5, 0, -0.75]}>
            <mesh position={[0, 0.34, 0]} castShadow><boxGeometry args={[1.2, 0.12, 0.72]} /><Material color="#8c6848" /></mesh>
            {[-0.48, 0.48].flatMap((x) => [-0.25, 0.25].map((z) => <mesh key={`${x}-${z}`} position={[x, 0.16, z]}><boxGeometry args={[0.06, 0.32, 0.06]} /><Material color="#644a35" /></mesh>))}
          </group>
          <Window position={[-1.8, 1.85, -2.92]} />
        </>
      )}
      {room === "kitchen" && showFurniture && (
        <>
          <group position={[0, 0, -1.65]}>
            <mesh position={[0, 0.95, 0]} castShadow><boxGeometry args={[4.4, 1.7, 0.72]} /><Material color={colors.cabinet} /></mesh>
            <mesh position={[0, 1.85, 0]} castShadow><boxGeometry args={[4.5, 0.12, 0.84]} /><Material color="#d8d1c5" /></mesh>
          </group>
          <group position={[0, 0, 0.7]}><DiningTable /></group>
          <Chair color={colors.chair} position={[-1.25, 0, 0.7]} onSelect={() => onSelect("chair")} />
          <Chair color={colors.chair} position={[1.25, 0, 0.7]} onSelect={() => onSelect("chair")} />
          <Window position={[0, 1.8, -2.42]} width={1.6} />
        </>
      )}
      {room === "bedroom" && showFurniture && (
        <>
          <group position={[0, 0, 0.2]}><Bed color={colors.bed} onSelect={() => onSelect("bed")} /></group>
          <group position={[-2, 0, -1.5]}>
            <mesh position={[0, 0.95, 0]} castShadow><boxGeometry args={[0.8, 1.8, 0.7]} /><Material color={colors.cabinet} /></mesh>
          </group>
          <Window position={[0, 1.85, -2.42]} width={1.7} />
        </>
      )}
      {room === "bathroom" && (
        <>
          <mesh position={[0.9, 0.5, -1]} castShadow><boxGeometry args={[1.25, 1, 1.3]} /><meshStandardMaterial color="#eeeae1" roughness={0.25} /></mesh>
          <mesh position={[-1, 0.45, 0.7]} castShadow><cylinderGeometry args={[0.32, 0.32, 0.9, 24]} /><meshStandardMaterial color="#f4f2ed" roughness={0.2} /></mesh>
          <mesh position={[0, 1.8, -2.42]}><boxGeometry args={[1.4, 1.1, 0.05]} /><meshPhysicalMaterial color="#a9c9d2" roughness={0.1} /></mesh>
        </>
      )}
      <mesh position={[0, 3.05, 0]}><boxGeometry args={[0.18, 0.12, 0.18]} /><meshStandardMaterial color="#f9e9c2" emissive="#f9e9c2" emissiveIntensity={1.1} /></mesh>
    </group>
  );
}

function SceneContent() {
  const room = useEditorStore((s) => s.activeRoom);
  const colors = useEditorStore((s) => s.colors);
  const showFurniture = useEditorStore((s) => s.showFurniture);
  const setTarget = useEditorStore((s) => s.setTarget);
  const target = useEditorStore((s) => s.selectedTarget);
  const finishes = useEditorStore((s) => s.finishes);
  const furniture = useEditorStore((s) => s.furniture);
  const selectedFurnitureId = useEditorStore((s) => s.selectedFurnitureId);
  const selectFurniture = useEditorStore((s) => s.selectFurniture);
  const updateFurniture = useEditorStore((s) => s.updateFurniture);
  const cameraMode = useEditorStore((s) => s.cameraMode);
  const { camera } = useThree();
  const walkthrough = cameraMode === "walk";

  useEffect(() => {
    if (cameraMode === "orbit") {
      camera.position.set(10, 7, 12);
      camera.lookAt(0, 1.2, 0);
    }
  }, [camera, cameraMode]);

  const roomTitle = room === "exterior" ? "Exterior" : room.charAt(0).toUpperCase() + room.slice(1);

  return (
    <>
      <color attach="background" args={["#dfe7e8"]} />
      <fog attach="fog" args={["#dfe7e8", 18, 45]} />
      <ambientLight intensity={0.72} />
      <directionalLight position={[8, 12, 7]} intensity={2.2} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <Environment preset="city" />
      <group position={[0, 0, 0]}>
        <Interior room={room} colors={colors} finishes={finishes} showFurniture={showFurniture} onSelect={setTarget} walkthrough={walkthrough} furniture={furniture.filter((item) => item.room === room)} selectedFurnitureId={selectedFurnitureId} selectFurniture={selectFurniture} updateFurniture={updateFurniture} />
      </group>
      {showFurniture && furniture.filter((item) => item.room === room).map((item) => (
        <FurnitureModel key={item.id} item={item} selected={selectedFurnitureId === item.id} onSelect={() => selectFurniture(item.id)} />
      ))}
      <ContactShadows position={[0, 0.02, 0]} opacity={0.3} scale={18} blur={2.5} far={8} />
      {cameraMode === "orbit" ? <OrbitControls
        makeDefault
        target={room === "exterior" ? [0, 1.2, 0] : [0, 1.2, 0]}
        minDistance={2.4}
        maxDistance={room === "exterior" ? 24 : 11}
        maxPolarAngle={Math.PI / 2.03}
        enableDamping
        dampingFactor={0.08}
      /> : <WalkthroughPhysics room={room} />}
      {cameraMode === "orbit" && <Html position={[0, 3.4, 0]} center distanceFactor={12} style={{ pointerEvents: "none" }}>
        <div className="scene-label">{roomTitle} · Interactive preview</div>
      </Html>}
      {room === "exterior" && <mesh position={[0, -0.09, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#9aa58e" roughness={1} />
      </mesh>}
    </>
  );
}

export default function PropertyScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [10, 7, 12], fov: 42, near: 0.1, far: 150 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <SceneContent />
    </Canvas>
  );
}

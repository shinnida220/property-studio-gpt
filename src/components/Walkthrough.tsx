"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useEditorStore, type RoomId, type WalkDirection } from "@/stores/editor-store";

const ROOM_ORDER: Exclude<RoomId, "exterior">[] = ["living", "kitchen", "bedroom", "bathroom"];
const ROOM_SIZE: Record<Exclude<RoomId, "exterior">, { width: number; depth: number }> = {
  living: { width: 7, depth: 6 }, kitchen: { width: 6, depth: 5 },
  bedroom: { width: 6, depth: 5 }, bathroom: { width: 4.5, depth: 4 }
};

function RoomCollision({ room, showFurniture }: { room: Exclude<RoomId, "exterior">; showFurniture: boolean }) {
  const { width, depth } = ROOM_SIZE[room];
  const furniture = useEditorStore((state) => state.furniture).filter((item) => item.room === room);
  const wallHeight = 3, wallThickness = 0.12, doorwayWidth = 1.25;
  const segmentWidth = (width - doorwayWidth) / 2;
  const furnitureDimensions: Record<string, [number, number, number, number]> = {
    sofa: [0.95, 0.48, 0.43, 0.48], armchair: [0.42, 0.48, 0.42, 0.48],
    "coffee-table": [0.62, 0.25, 0.4, 0.25], "dining-table": [0.85, 0.42, 0.5, 0.42],
    bed: [0.95, 0.48, 1.08, 0.48], plant: [0.32, 0.72, 0.32, 0.72],
    "floor-lamp": [0.18, 0.85, 0.18, 0.85]
  };
  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[width / 2, 0.1, depth / 2]} position={[0, -0.1, 0]} />
      <CuboidCollider args={[wallThickness / 2, wallHeight / 2, depth / 2]} position={[-width / 2, wallHeight / 2, 0]} />
      <CuboidCollider args={[wallThickness / 2, wallHeight / 2, depth / 2]} position={[width / 2, wallHeight / 2, 0]} />
      <CuboidCollider args={[width / 2, wallHeight / 2, wallThickness / 2]} position={[0, wallHeight / 2, -depth / 2]} />
      <CuboidCollider args={[segmentWidth / 2, wallHeight / 2, wallThickness / 2]} position={[-(doorwayWidth / 2 + segmentWidth / 2), wallHeight / 2, depth / 2]} />
      <CuboidCollider args={[segmentWidth / 2, wallHeight / 2, wallThickness / 2]} position={[(doorwayWidth / 2 + segmentWidth / 2), wallHeight / 2, depth / 2]} />
      <CuboidCollider args={[doorwayWidth / 2, 0.3, wallThickness / 2]} position={[0, wallHeight - 0.3, depth / 2]} />
      {showFurniture && room === "living" && <>
        <CuboidCollider args={[1.05, 0.48, 0.44]} position={[0, 0.48, 1]} />
        <CuboidCollider args={[0.42, 0.5, 0.42]} position={[-2.1, 0.5, -1.4]} />
        <CuboidCollider args={[0.65, 0.38, 0.4]} position={[0.5, 0.38, -0.75]} />
      </>}
      {showFurniture && room === "kitchen" && <>
        <CuboidCollider args={[2.2, 0.9, 0.38]} position={[0, 0.95, -1.65]} />
        <CuboidCollider args={[0.85, 0.45, 0.48]} position={[0, 0.82, 0.7]} />
        <CuboidCollider args={[0.4, 0.5, 0.4]} position={[-1.25, 0.5, 0.7]} />
        <CuboidCollider args={[0.4, 0.5, 0.4]} position={[1.25, 0.5, 0.7]} />
      </>}
      {showFurniture && room === "bedroom" && <>
        <CuboidCollider args={[0.95, 0.52, 1.12]} position={[0, 0.52, 0.2]} />
        <CuboidCollider args={[0.42, 0.9, 0.38]} position={[-2, 0.9, -1.5]} />
      </>}
      {showFurniture && furniture.map((item) => {
        const [x, y, z, centerY] = furnitureDimensions[item.kind];
        return <CuboidCollider key={item.id}
          args={[x * item.scale[0], y * item.scale[1], z * item.scale[2]]}
          position={[item.position[0], centerY * item.scale[1], item.position[2]]}
          rotation={item.rotation} />;
      })}
      {room === "bathroom" && <>
        <CuboidCollider args={[0.65, 0.52, 0.65]} position={[0.9, 0.52, -1]} />
        <CuboidCollider args={[0.34, 0.46, 0.34]} position={[-1, 0.46, 0.7]} />
      </>}
    </RigidBody>
  );
}

function Avatar({ root, leftArm, rightArm, leftLeg, rightLeg }: {
  root: React.RefObject<THREE.Group | null>;
  leftArm: React.RefObject<THREE.Group | null>;
  rightArm: React.RefObject<THREE.Group | null>;
  leftLeg: React.RefObject<THREE.Group | null>;
  rightLeg: React.RefObject<THREE.Group | null>;
}) {
  const skin = "#c98e69";
  return (
    <group ref={root} position={[0, -0.82, 0]}>
      <mesh position={[0, 0.78, 0]} castShadow><capsuleGeometry args={[0.23, 0.48, 6, 12]} /><meshStandardMaterial color="#456b59" roughness={0.8} /></mesh>
      <mesh position={[0, 1.25, 0]} castShadow><sphereGeometry args={[0.19, 16, 12]} /><meshStandardMaterial color={skin} /></mesh>
      <mesh position={[0, 1.43, -0.02]} castShadow><sphereGeometry args={[0.195, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.56]} /><meshStandardMaterial color="#302820" /></mesh>
      <group ref={leftArm} position={[-0.29, 1.02, 0]}>
        <mesh position={[0, -0.24, 0]} castShadow><capsuleGeometry args={[0.075, 0.34, 4, 8]} /><meshStandardMaterial color={skin} /></mesh>
      </group>
      <group ref={rightArm} position={[0.29, 1.02, 0]}>
        <mesh position={[0, -0.24, 0]} castShadow><capsuleGeometry args={[0.075, 0.34, 4, 8]} /><meshStandardMaterial color={skin} /></mesh>
      </group>
      <group ref={leftLeg} position={[-0.13, 0.56, 0]}>
        <mesh position={[0, -0.23, 0]} castShadow><capsuleGeometry args={[0.09, 0.34, 4, 8]} /><meshStandardMaterial color="#344b62" /></mesh>
        <mesh position={[0, -0.44, -0.055]} castShadow><boxGeometry args={[0.17, 0.1, 0.3]} /><meshStandardMaterial color="#272727" /></mesh>
      </group>
      <group ref={rightLeg} position={[0.13, 0.56, 0]}>
        <mesh position={[0, -0.23, 0]} castShadow><capsuleGeometry args={[0.09, 0.34, 4, 8]} /><meshStandardMaterial color="#344b62" /></mesh>
        <mesh position={[0, -0.44, -0.055]} castShadow><boxGeometry args={[0.17, 0.1, 0.3]} /><meshStandardMaterial color="#272727" /></mesh>
      </group>
    </group>
  );
}

function Player({ room }: { room: Exclude<RoomId, "exterior"> }) {
  const body = useRef<any>(null);
  const avatar = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null), rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null), rightLeg = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();
  const yaw = useRef(0), pitch = useRef(0.2), distance = useRef(4.6);
  const keys = useRef(new Set<string>());
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchDistance = useRef(0);
  const walkInput = useEditorStore((state) => state.walkInput);
  const setRoom = useEditorStore((state) => state.setRoom);
  const depth = ROOM_SIZE[room].depth;
  const transitionLock = useRef(false);
  const cameraTarget = useRef(new THREE.Vector3());
  const cameraPosition = useRef(new THREE.Vector3());
  const facing = useRef(0), gait = useRef(0);

  useEffect(() => {
    const element = gl.domElement;
    element.style.touchAction = "none";
    const onKeyDown = (event: KeyboardEvent) => {
      if (["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)) event.preventDefault();
      keys.current.add(event.code);
    };
    const onKeyUp = (event: KeyboardEvent) => keys.current.delete(event.code);
    const onBlur = () => { keys.current.clear(); pointers.current.clear(); pinchDistance.current = 0; };
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "touch" && event.button !== 0) return;
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      element.setPointerCapture?.(event.pointerId);
      if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()];
        pinchDistance.current = Math.hypot(a.x - b.x, a.y - b.y);
      }
    };
    const onPointerMove = (event: PointerEvent) => {
      const previous = pointers.current.get(event.pointerId);
      if (!previous) return;
      const dx = event.clientX - previous.x, dy = event.clientY - previous.y;
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.current.size >= 2) {
        const [a, b] = [...pointers.current.values()];
        const nextDistance = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchDistance.current > 0) distance.current = THREE.MathUtils.clamp(distance.current - (nextDistance - pinchDistance.current) * 0.012, 2.4, 7.5);
        pinchDistance.current = nextDistance;
      } else {
        yaw.current -= dx * 0.004;
        pitch.current = THREE.MathUtils.clamp(pitch.current - dy * 0.003, -0.08, 0.72);
      }
    };
    const onPointerUp = (event: PointerEvent) => {
      pointers.current.delete(event.pointerId);
      if (pointers.current.size < 2) pinchDistance.current = 0;
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      distance.current = THREE.MathUtils.clamp(distance.current + event.deltaY * 0.006, 2.4, 7.5);
    };
    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", onPointerUp);
    element.addEventListener("pointercancel", onPointerUp);
    element.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", onPointerUp);
      element.removeEventListener("pointercancel", onPointerUp);
      element.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      element.style.touchAction = "";
    };
  }, [gl]);

  useEffect(() => {
    if (!body.current) return;
    body.current.setTranslation({ x: 0, y: 0.84, z: depth / 2 - 1.35 }, true);
    body.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    yaw.current = 0;
    pitch.current = 0.2;
    transitionLock.current = false;
  }, [room, depth]);

  useFrame((_, delta) => {
    const rigidBody = body.current;
    if (!rigidBody) return;
    const dt = Math.min(delta, 1 / 30);
    const pressed = (key: WalkDirection) => walkInput[key];
    const forward = pressed("forward") || keys.current.has("KeyW") || keys.current.has("ArrowUp");
    const backward = pressed("backward") || keys.current.has("KeyS") || keys.current.has("ArrowDown");
    const left = pressed("left") || keys.current.has("KeyA") || keys.current.has("ArrowLeft");
    const right = pressed("right") || keys.current.has("KeyD") || keys.current.has("ArrowRight");
    const ix = Number(right) - Number(left), iz = Number(backward) - Number(forward);
    const normalizer = Math.hypot(ix, iz) > 1 ? 1 / Math.hypot(ix, iz) : 1;
    const dx = (Math.cos(yaw.current) * ix + Math.sin(yaw.current) * iz) * normalizer;
    const dz = (-Math.sin(yaw.current) * ix + Math.cos(yaw.current) * iz) * normalizer;
    const velocity = rigidBody.linvel();
    const blend = 1 - Math.exp(-(ix || iz ? 11 : 15) * dt);
    const vx = THREE.MathUtils.lerp(velocity.x, dx * 3.1, blend);
    const vz = THREE.MathUtils.lerp(velocity.z, dz * 3.1, blend);
    rigidBody.setLinvel({ x: vx, y: velocity.y, z: vz }, true);

    const speed = Math.hypot(vx, vz);
    const position = rigidBody.translation();
    if (avatar.current) {
      if (speed > 0.12) {
        facing.current = THREE.MathUtils.dampAngle(facing.current, Math.atan2(vx, -vz), 12, dt);
        avatar.current.rotation.y = facing.current;
        gait.current += dt * Math.min(speed / 3.1, 1) * 9;
      } else gait.current = THREE.MathUtils.damp(gait.current, 0, 5, dt);
      const stride = speed > 0.12 ? Math.sin(gait.current) * 0.58 : 0;
      if (leftLeg.current) leftLeg.current.rotation.x = stride;
      if (rightLeg.current) rightLeg.current.rotation.x = -stride;
      if (leftArm.current) leftArm.current.rotation.x = -stride * 0.72;
      if (rightArm.current) rightArm.current.rotation.x = stride * 0.72;
    }

    cameraTarget.current.set(position.x, position.y + 0.82, position.z);
    const horizontal = Math.cos(pitch.current) * distance.current;
    cameraPosition.current.set(
      cameraTarget.current.x - Math.sin(yaw.current) * horizontal,
      cameraTarget.current.y + Math.sin(pitch.current) * distance.current,
      cameraTarget.current.z + Math.cos(yaw.current) * horizontal
    );
    camera.position.lerp(cameraPosition.current, 1 - Math.exp(-8 * dt));
    camera.lookAt(cameraTarget.current);

    if (!transitionLock.current && position.z > depth / 2 + 0.05 && Math.abs(position.x) < 0.72) {
      transitionLock.current = true;
      setRoom(ROOM_ORDER[(ROOM_ORDER.indexOf(room) + 1) % ROOM_ORDER.length]);
    }
  });

  return (
    <RigidBody ref={body} type="dynamic" colliders={false} position={[0, 0.84, depth / 2 - 1.35]}
      enabledRotations={[false, false, false]} linearDamping={1.5} angularDamping={8} canSleep={false} ccd>
      <CapsuleCollider args={[0.52, 0.28]} />
      <Avatar root={avatar} leftArm={leftArm} rightArm={rightArm} leftLeg={leftLeg} rightLeg={rightLeg} />
    </RigidBody>
  );
}

export function WalkthroughPhysics({ room }: { room: RoomId }) {
  const showFurniture = useEditorStore((state) => state.showFurniture);
  if (room === "exterior") return null;
  return <Physics gravity={[0, -9.81, 0]} timeStep={1 / 60} interpolate>
    <RoomCollision room={room} showFurniture={showFurniture} />
    <Player room={room} />
  </Physics>;
}

export function WalkTouchControls() {
  const setWalkInput = useEditorStore((state) => state.setWalkInput);
  const clearWalkInput = useEditorStore((state) => state.clearWalkInput);
  const directions: { key: WalkDirection; label: string; symbol: string }[] = [
    { key: "forward", label: "Move forward", symbol: "↑" },
    { key: "left", label: "Move left", symbol: "←" },
    { key: "backward", label: "Move backward", symbol: "↓" },
    { key: "right", label: "Move right", symbol: "→" }
  ];
  return <div className="walk-touch-controls" onPointerUp={clearWalkInput} onPointerCancel={clearWalkInput} onPointerLeave={clearWalkInput}>
    {directions.map(({ key, label, symbol }) => <button key={key} type="button" aria-label={label}
      onContextMenu={(event) => event.preventDefault()}
      onPointerDown={(event) => { event.preventDefault(); setWalkInput(key, true); }}
      onPointerUp={(event) => { event.preventDefault(); setWalkInput(key, false); }}
      onPointerCancel={() => setWalkInput(key, false)}>{symbol}</button>)}
  </div>;
}
